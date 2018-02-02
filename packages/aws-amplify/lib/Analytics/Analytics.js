"use strict";
/*
 * Copyright 2017-2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with
 * the License. A copy of the License is located at
 *
 *     http://aws.amazon.com/apache2.0/
 *
 * or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
 * CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions
 * and limitations under the License.
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var Common_1 = require("../Common");
var AWSAnalyticsProvider_1 = require("./Providers/AWSAnalyticsProvider");
var Auth_1 = require("../Auth");
var logger = new Common_1.ConsoleLogger('AnalyticsClass');
var NON_RETRYABLE_EXCEPTIONS = ['BadRequestException', 'SerializationException', 'ValidationException'];
/**
* Provide mobile analytics client functions
*/
var AnalyticsClass = /** @class */ (function () {
    /**
     * Initialize Analtyics
     * @param config - Configuration of the Analytics
     */
    function AnalyticsClass() {
        this._buffer = [];
        this._config = {};
        this._pluggables = [];
        // default one
        this._pluggables.push(new AWSAnalyticsProvider_1.default());
    }
    /**
     * configure Analytics
     * @param {Object} config - Configuration of the Analytics
     */
    AnalyticsClass.prototype.configure = function (config) {
        var _this = this;
        logger.debug('configure Analytics');
        var conf = Object.assign({}, this._config, Common_1.Parser.parseMobilehubConfig(config).Analytics);
        var clientInfo = Common_1.ClientDevice.clientInfo();
        conf['clientInfo'] = conf['client_info'] ? conf['client_info'] : clientInfo;
        this._config = conf;
        this._pluggables.map(function (pluggable) {
            pluggable.configure(_this._config);
        });
        return conf;
    };
    /**
     * @async
     * init clients for Anlytics including mobile analytics and pinpoint
     * @return - True if initilization succeeds
     */
    // public async init() {
    //     const credentialsOK = await this._ensureCredentials();
    //     if (!credentialsOK) { return false; }
    //     logger.debug('init clients with config', this._config);
    //     // default one
    //     if (!this._provider) {
    //         this._provider = new AWSAnalyticsProvider();
    //     }
    //     return this._provider.init(this._config);
    // }
    /**
     * set the Analytics client
     * @param provider
     */
    AnalyticsClass.prototype.setProvider = function (provider) {
        this._provider = provider;
    };
    AnalyticsClass.prototype.addPluggable = function (pluggable) {
        if (pluggable) {
            this._pluggables.push(pluggable);
            pluggable.configure(this._config);
        }
    };
    /**
     * Record Session start
     * @return - A promise which resolves if event record successfully
     */
    AnalyticsClass.prototype.startSession = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: 
                    //return this._provider.putEvent({eventName: 'session_start'});
                    return [4 /*yield*/, this._getCredentials()];
                    case 1:
                        //return this._provider.putEvent({eventName: 'session_start'});
                        _a.sent();
                        this._pluggables.map(function (pluggable) {
                            pluggable.startSession(_this._config);
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Record Session stop
     * @return - A promise which resolves if event record successfully
     */
    AnalyticsClass.prototype.stopSession = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: 
                    //return this._provider.putEvent({eventName: 'session_stop'});
                    return [4 /*yield*/, this._getCredentials()];
                    case 1:
                        //return this._provider.putEvent({eventName: 'session_stop'});
                        _a.sent();
                        this._pluggables.map(function (pluggable) {
                            pluggable.stopSession(_this._config);
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Record one analytic event and send it to Pinpoint
     * @param {String} name - The name of the event
     * @param {Object} [attributs] - Attributes of the event
     * @param {Object} [metrics] - Event metrics
     * @return - A promise which resolves if event record successfully
     */
    AnalyticsClass.prototype.record = function (eventName, attributes, metrics) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: 
                    //return this._provider.putEvent({eventName, attributes, metrics});
                    return [4 /*yield*/, this._getCredentials()];
                    case 1:
                        //return this._provider.putEvent({eventName, attributes, metrics});
                        _a.sent();
                        this._pluggables.map(function (pluggable) {
                            pluggable.record({ eventName: eventName, attributes: attributes, metrics: metrics }, _this._config);
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * @async
     * Restart Analytics client and record session stop
     * @return - A promise which resolves to be true if current credential exists
     */
    // async restart() {
    //     return this.init();
    // }
    /**
     * @private
     * check if current crednetials exists
     */
    AnalyticsClass.prototype._getCredentials = function () {
        var conf = this._config;
        return Auth_1.default.currentCredentials()
            .then(function (credentials) {
            var cred = Auth_1.default.essentialCredentials(credentials);
            conf.credentials = cred;
            conf.endpointId = conf.credentials.identityId;
            logger.debug('set endpointId for analytics', conf.endpointId);
            logger.debug('set credentials for analytics', conf.credentials);
            return true;
        })
            .catch(function (err) {
            logger.debug('ensure credentials error', err);
            return false;
        });
    };
    return AnalyticsClass;
}());
exports.default = AnalyticsClass;
//# sourceMappingURL=Analytics.js.map