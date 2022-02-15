import type { Config } from '@jest/types';
import type { EnvironmentContext } from '@jest/environment';
import JSDOMEnvironment from 'jest-environment-jsdom';
import { TextDecoder, TextEncoder } from 'util';

import attachRafStub from './attach-raf-stub';

export default class MyJSDOMEnvironment extends JSDOMEnvironment {
  constructor(config: Config.ProjectConfig, context?: EnvironmentContext) {
    super(config, context);

    attachRafStub.call(this);

    // It was missing on the global object
    this.global.TextDecoder = TextDecoder as typeof this.global.TextDecoder;
    this.global.TextEncoder = TextEncoder;
  }
}
