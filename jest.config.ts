/* eslint-disable @typescript-eslint/triple-slash-reference */
/// <reference path="./test/typings/environment.d.ts" />

import type { Config } from 'jest';
import getReactMajorVersion from './test/util/get-react-major-version';
import isRunningInCI from './test/util/is-running-in-ci';

const reactMajorVersion = getReactMajorVersion();

const config: Config = {
  clearMocks: true,
  modulePathIgnorePatterns: ['/dist/'],
  resetMocks: true,
  resetModules: true,
  restoreMocks: true,

  setupFiles: ['./test/setup/env-setup.ts'],
  setupFilesAfterEnv: ['./test/setup/test-setup.ts'],
  testEnvironment: './test/setup/environment.ts',
  // node_modules is default.
  testPathIgnorePatterns: ['/node_modules/', '/cypress/'],
  transform: {
    '\\.[jt]sx?$': 'babel-jest',
  },
  verbose: true,
  watchPlugins: [
    'jest-watch-typeahead/filename',
    'jest-watch-typeahead/testname',
  ],
};

// eslint-disable-next-line no-console
console.log('Testing with React version:', `${reactMajorVersion}.x.x`);

if (reactMajorVersion === '18') {
  config.cacheDirectory = `.cache/jest-cache-react-${reactMajorVersion}`;
  config.moduleNameMapper = {
    '^react-dom((\\/.*)?)$': `react-dom-${reactMajorVersion}$1`,
    '^react((\\/.*)?)$': `react-${reactMajorVersion}$1`,
  };
}

if (isRunningInCI()) {
  config.maxWorkers = 2;
}

export default config;
