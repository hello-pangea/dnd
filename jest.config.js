module.exports = {
  testEnvironment: './test/setup/environment.ts',
  transform: {
    '\\.[jt]sx?$': 'babel-jest',
  },
  setupFiles: ['./test/setup/env-setup.ts'],
  setupFilesAfterEnv: ['./test/setup/test-setup.ts'],
  // node_modules is default.
  testPathIgnorePatterns: ['/node_modules/', '/cypress/'],
  modulePathIgnorePatterns: ['/dist/'],
  watchPlugins: [
    'jest-watch-typeahead/filename',
    'jest-watch-typeahead/testname',
  ],
  verbose: true,
};
