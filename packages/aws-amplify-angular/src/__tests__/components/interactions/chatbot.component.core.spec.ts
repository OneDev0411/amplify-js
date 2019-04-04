import { Component, ChangeDetectorRef } from '@angular/core';
import { ComponentFixture, TestBed, async} from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting
} from '@angular/platform-browser-dynamic/testing';
import { AmplifyService } from '../../../providers/amplify.service';
import { ChatbotComponentCore } 
from '../../../components/interactions/chatbot/chatbot.component.core';

describe('ChatbotComponentCore: ', () => {

  let component: ChatbotComponentCore;
  let service: AmplifyService;
  let ref: ChangeDetectorRef;
  const modules = {
    Interactions: {}
  };

  beforeEach(() => { 
    service = new AmplifyService(modules);
    component = new ChatbotComponentCore(ref, service);
  });

  afterEach(() => {
    service = null;
    component = null;
  });


  it('...should be created', () => {
    expect(component).toBeTruthy();
  });

  it('...should have a performOnComplete method', () => {
    expect(component.performOnComplete).toBeTruthy();
  });

  it('...should have an onInputChange method', () => {
    expect(component.onInputChange).toBeTruthy();
  });

  it('...should have an onSubmit method', () => {
    expect(component.onSubmit).toBeTruthy();
  });

});
