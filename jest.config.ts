// eslint-disable-next-line import/no-import-module-exports
import type { Config } from 'jest';

declare global {
  interface ProcessEnv {
    REACT_MAJOR_VERSION: string;
    CI?: boolean;
  }
}

const reactMajorVersion = process.env.REACT_MAJOR_VERSION;

const config: Config = {
  clearMocks: true,
  modulePathIgnorePatterns: ['/dist/'],
  resetMocks: true,
  resetModules: true,
  restoreMocks: true,

  // We need a `snapshotResolver` because we run our tests
  // for different react versions. Each version render components
  // differently thus returning a different snapshot. We'll store
  // each snapshot in different folders:
  // __react_16_snapshots__, __react_17_snapshots__, etc.
  snapshotResolver: '<rootDir>/test/setup/snapshot-resolver.ts',
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
console.log('Testing with React version:', `${reactMajorVersion || '18'}.x.x`);

if (['16', '17'].includes(reactMajorVersion)) {
  config.testPathIgnorePatterns = [
    ...(config.testPathIgnorePatterns || []),
    // These test do not requires react and will
    // be run in the base run (with react v18)
    'test/unit/docs',
    'test/unit/health',
  ];
  config.cacheDirectory = `.cache/jest-cache-react-${reactMajorVersion}`;
  config.moduleNameMapper = {
    '^@testing-library/react((\\/.*)?)$': `@testing-library/react-16-17$1`,
    '^react-dom((\\/.*)?)$': `react-dom-${reactMajorVersion}$1`,
    '^react((\\/.*)?)$': `react-${reactMajorVersion}$1`,
  };
}

if (process.env.CI) {
  config.maxWorkers = 2;
}

module.exports = config;
