module.exports = {
  transform: {
    '\\.[jt]sx?$': 'babel-jest',
  },
  setupFiles: ['./test/env-setup.js'],
  setupFilesAfterEnv: ['./test/test-setup.ts'],
  // node_modules is default.
  testPathIgnorePatterns: ['/node_modules/', '/cypress/'],
  modulePathIgnorePatterns: ['/dist/'],
  watchPlugins: [
    'jest-watch-typeahead/filename',
    'jest-watch-typeahead/testname',
  ],
  verbose: true,
};
