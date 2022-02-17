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

if (process.env.REACT_VERSION === '16') {
  config.testPathIgnorePatterns = [
    ...config.testPathIgnorePatterns,
    // These test do not requires react and will
    // be run in the base run (with react v17)
    'test/unit/docs',
    'test/unit/health',
  ];
  config.cacheDirectory = '.cache/jest-cache-react-16';
  config.moduleNameMapper = {
    '^react-dom((\\/.*)?)$': 'react-dom-16$1',
    '^react((\\/.*)?)$': 'react-16$1',
  };
}

if (process.env.CI) {
  config.maxWorkers = 2;
}

module.exports = config;
