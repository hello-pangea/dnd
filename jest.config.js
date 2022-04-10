const config = {
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

const REACT_VERSION = process.env.REACT_VERSION;

if (['16', '17'].includes(REACT_VERSION)) {
  config.testPathIgnorePatterns = [
    ...config.testPathIgnorePatterns,
    // These test do not requires react and will
    // be run in the base run (with react v18)
    'test/unit/docs',
    'test/unit/health',
  ];
  config.cacheDirectory = `.cache/jest-cache-react-${REACT_VERSION}`;
  config.moduleNameMapper = {
    '^@testing-library/react((\\/.*)?)$': '@testing-library/react-16-17$1',
    '^react-dom((\\/.*)?)$': `react-dom-${REACT_VERSION}$1`,
    '^react((\\/.*)?)$': `react-${REACT_VERSION}$1`,
  };
}

if (process.env.CI) {
  config.maxWorkers = 2;
}

module.exports = config;
