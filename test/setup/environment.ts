import type {
  EnvironmentContext,
  JestEnvironmentConfig,
} from '@jest/environment';
import JSDOMEnvironment from 'jest-environment-jsdom';
import { TextDecoder, TextEncoder } from 'util';

import attachRafStub from './attach-raf-stub';
import transitionEventPolyfill from './transition-event-polyfill';

export default class MyJSDOMEnvironment extends JSDOMEnvironment {
  constructor(config: JestEnvironmentConfig, context: EnvironmentContext) {
    super(config, context);

    attachRafStub.call(this);
    transitionEventPolyfill.call(this);

    // When importing jsdom in one of the test it throws an
    // error, because TextDecoder and TextEncoder are needed.
    this.global.TextDecoder = TextDecoder as typeof this.global.TextDecoder;
    this.global.TextEncoder = TextEncoder;
  }
}
