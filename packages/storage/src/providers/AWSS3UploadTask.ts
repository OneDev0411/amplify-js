import {
	UploadPartCommandInput,
	CompletedPart,
	S3Client,
	UploadPartCommand,
	CompleteMultipartUploadCommand,
	Part,
	AbortMultipartUploadCommand,
} from '@aws-sdk/client-s3';
import * as events from 'events';
import axios, { Canceler } from 'axios';
import { HttpHandlerOptions } from '@aws-sdk/types';
import { Logger } from '@aws-amplify/core';
import { TaskEvents } from './AWSS3UploadManager';
import { UploadTask } from '../types/Provider';
import { listSingleFile } from '../common/StorageUtils';
import { AWSS3ProviderUploadErrorStrings } from '../common/StorageErrorStrings';

const logger = new Logger('Storage');
enum State {
	INIT,
	IN_PROGRESS,
	PAUSED,
	ABORTED,
}

export interface AWSS3UploadTaskParams {
	s3Client: S3Client;
	uploadId: string;
	bucket: string;
	key: string;
	file: Blob;
	/**
	 * File size of each chunk of the parts
	 */
	partSize?: number;
	/**
	 * Completed Parts from an existing multipart upload
	 */
	completedParts?: Part[];
	emitter?: events.EventEmitter;
}

export interface InProgressRequest {
	uploadPartInput: UploadPartCommandInput;
	s3Request: Promise<any>;
	cancel: Canceler;
}

export interface UploadCompleteEvent {
	key: string;
}

export interface UploadProgressEvent {
	loaded: number;
	total: number;
}

const MAX_PARTS = 10000;
const PART_SIZE = 5 * 1024 * 1024;
const DEFAULT_QUEUE_SIZE = 4;

function comparePartNumber(a: CompletedPart, b: CompletedPart) {
	return a.PartNumber - b.PartNumber;
}

export class AWSS3UploadTask implements UploadTask {
	private readonly emitter: events.EventEmitter;
	private readonly file: Blob;
	private readonly partSize: number;
	private readonly queueSize = DEFAULT_QUEUE_SIZE;
	private readonly s3client: S3Client;
	private inProgress: InProgressRequest[] = [];
	private completedParts: CompletedPart[] = [];
	private cachedParts: Part[] = [];
	private queued: UploadPartCommandInput[] = [];
	private bytesUploaded: number = 0;
	private totalBytes: number = 0;

	readonly bucket: string;
	readonly key: string;
	readonly uploadId: UploadPartCommandInput['UploadId'];

	public state: State = State.INIT;

	constructor({
		s3Client,
		uploadId,
		bucket,
		key,
		file,
		completedParts,
		emitter,
	}: AWSS3UploadTaskParams) {
		this.s3client = s3Client;
		this.uploadId = uploadId;
		this.bucket = bucket;
		this.key = key;
		this.file = file;
		this.partSize = PART_SIZE;
		this.totalBytes = this.file.size;
		this.bytesUploaded = 0;
		this.emitter = emitter;
		this.cachedParts = completedParts || [];
		this.queued = this._createParts();
		this._validateParams();
		if (this.cachedParts) {
			this._initCachedUploadParts();
		}
		// event emitter will re-throw an error if an event emits an error unless there's a listener, attaching a no-op
		// function to it unless user adds their own onError callback
		this.emitter.on(TaskEvents.ERROR, () => {});
	}

	get percent() {
		return (this.bytesUploaded / this.totalBytes) * 100;
	}

	private _validateParams() {
		if (typeof this.uploadId !== 'string') {
			throw new Error(
				'UploadId must be specified and should be a string for an upload task'
			);
		}
		if (this.file.size / this.partSize > MAX_PARTS) {
			throw new Error('Too many parts');
		}
	}

	private _onPartUploadCompletion({
		eTag,
		partNumber,
		chunk,
	}: {
		eTag: string;
		partNumber: number;
		chunk: unknown;
	}) {
		if (!this._isBlob(chunk)) return;
		this.completedParts.push({
			ETag: eTag,
			PartNumber: partNumber,
		});
		this.bytesUploaded += chunk.size;
		this.emitter.emit(TaskEvents.UPLOAD_PROGRESS, {
			loaded: this.bytesUploaded,
			total: this.totalBytes,
		});
		// Remove the completed item from the inProgress array
		this.inProgress = this.inProgress.filter(
			job => job.uploadPartInput.PartNumber !== partNumber
		);
		if (this.queued.length && this.state !== State.PAUSED)
			this._startNextPart();
		if (this._isDone()) {
			this._completeUpload();
			this._verifyFileSize();
		}
	}

	private _completeUpload() {
		this.s3client
			.send(
				new CompleteMultipartUploadCommand({
					Bucket: this.bucket,
					Key: this.key,
					UploadId: this.uploadId,
					MultipartUpload: {
						// Parts are not always completed in order, we need to manually sort them
						Parts: this.completedParts.sort(comparePartNumber),
					},
				})
			)
			.then(res => {
				this.emitter.emit(TaskEvents.UPLOAD_COMPLETE, {
					key: `${this.bucket}/${this.key}`,
				});
			})
			.catch(err => {
				logger.error('error completing upload', err);
			});
	}

	private _isBlob(x: unknown): x is Blob {
		return typeof x !== 'undefined' && x instanceof Blob;
	}

	private _startNextPart() {
		if (this.queued.length > 0 && this.state !== State.PAUSED) {
			const cancelTokenSource = axios.CancelToken.source();
			const nextPart = this.queued.shift();
			this.inProgress.push({
				uploadPartInput: nextPart,
				s3Request: this.s3client
					.send(new UploadPartCommand(nextPart), {
						cancelTokenSource,
					} as HttpHandlerOptions)
					.then(output => {
						this._onPartUploadCompletion({
							eTag: output.ETag,
							partNumber: nextPart.PartNumber,
							chunk: nextPart.Body,
						});
						return output;
					})
					.catch(err => {
						if (this.state === State.PAUSED) {
							logger.log('upload paused');
						} else if (this.state === State.ABORTED) {
							logger.log('upload aborted');
						} else {
							logger.error('error starting next part of upload: ', err);
						}
						if (
							!axios.isCancel(err) &&
							err.message !==
								AWSS3ProviderUploadErrorStrings.UPLOAD_PAUSED_MESSAGE
						) {
							this.emitter.emit(TaskEvents.ERROR, err);
						}
						this.pause();
					}),
				cancel: cancelTokenSource.cancel,
			});
		}
	}

	/**
	 * Verify on S3 side that the file size matches the one on the client side.
	 *
	 * @async
	 * @return {Promise<boolean>} If the local file size matches the one on S3.
	 */
	private async _verifyFileSize(): Promise<boolean> {
		const obj = await listSingleFile({
			s3Client: this.s3client,
			key: this.key,
			bucket: this.bucket,
		});
		return Boolean(obj && obj.Size === this.file.size);
	}

	private _isDone() {
		return !this.queued.length && !this.inProgress.length;
	}

	private _attachUploadCompleteEvent(fn: Function) {
		this.emitter.on(TaskEvents.UPLOAD_COMPLETE, fn.bind(this));
	}

	private _attachUploadProgressEvent(fn: Function) {
		this.emitter.on(TaskEvents.UPLOAD_PROGRESS, fn.bind(this));
	}

	private _attachUploadErrorEvent(fn: Function) {
		this.emitter.on(TaskEvents.ERROR, fn.bind(this));
	}

	public onError(fn: (event: Error) => any) {
		if (Array.isArray(fn)) {
			fn.forEach(cb => {
				this._attachUploadErrorEvent(cb);
			});
		} else {
			this._attachUploadErrorEvent(fn);
		}
	}

	public onComplete(fn: (event: UploadCompleteEvent) => any) {
		if (Array.isArray(fn)) {
			fn.forEach(cb => {
				this._attachUploadCompleteEvent(cb);
			});
		} else {
			this._attachUploadCompleteEvent(fn);
		}
	}

	public onProgress(fn: (event: UploadProgressEvent) => any) {
		if (Array.isArray(fn)) {
			fn.forEach(cb => {
				this._attachUploadProgressEvent(cb);
			});
		} else {
			this._attachUploadProgressEvent(fn);
		}
	}

	private _createParts() {
		const size = this.file.size;
		const parts: UploadPartCommandInput[] = [];
		for (let bodyStart = 0; bodyStart < size; ) {
			const bodyEnd = Math.min(bodyStart + this.partSize, size);
			parts.push({
				Body: this.file.slice(bodyStart, bodyEnd),
				Key: this.key,
				Bucket: this.bucket,
				PartNumber: parts.length + 1,
				UploadId: this.uploadId,
			});
			bodyStart += this.partSize;
		}
		return parts;
	}

	private _initCachedUploadParts() {
		this.bytesUploaded += this.cachedParts.reduce(
			(acc, part) => acc + part.Size,
			0
		);
		// Find the set of part numbers that have already been uploaded
		const uploadedPartNumSet = new Set(
			this.cachedParts.map(part => part.PartNumber)
		);
		this.queued = this.queued.filter(
			part => !uploadedPartNumSet.has(part.PartNumber)
		);
		this.completedParts = this.cachedParts.map(part => ({
			PartNumber: part.PartNumber,
			ETag: part.ETag,
		}));
		this.emitter.emit(TaskEvents.UPLOAD_PROGRESS, {
			loaded: this.bytesUploaded,
			total: this.totalBytes,
		});
	}

	public resume(): void {
		if (this.state === State.ABORTED) {
			throw new Error('This task has already been aborted');
		} else if (this.bytesUploaded === this.totalBytes) {
			logger.warn('This task has already been completed');
		} else if (this.state === State.IN_PROGRESS) {
			logger.warn('Upload task already in progress');
		} else {
			this.state = State.IN_PROGRESS;
			for (let i = 0; i < this.queueSize; i++) {
				this._startNextPart();
			}
		}
	}

	public cancel(): void {
		this.pause();
		this.queued = [];
		this.completedParts = [];
		this.bytesUploaded = 0;
		this.state = State.ABORTED;
		this.emitter.emit(TaskEvents.ABORT);
		this.s3client
			.send(
				new AbortMultipartUploadCommand({
					Bucket: this.bucket,
					Key: this.key,
					UploadId: this.uploadId,
				})
			)
			.then(res => {
				logger.log(res);
			})
			.catch(err => {
				logger.error(
					`Error occured while aborting the upload to ${this.bucket}/${this.key}`,
					err
				);
			});
	}

	/**
	 * pause this particular upload task
	 **/
	public pause(): void {
		this.state = State.PAUSED;
		// Use axios cancel token to abort the part request immediately
		// Add the inProgress parts back to pending
		const removedInProgressReq = this.inProgress.splice(
			0,
			this.inProgress.length
		);
		removedInProgressReq.forEach(req => {
			req.cancel(AWSS3ProviderUploadErrorStrings.UPLOAD_PAUSED_MESSAGE);
		});
		// Put all removed in progress parts back into the queue
		this.queued.unshift(
			...removedInProgressReq.map(req => req.uploadPartInput)
		);
	}
}
