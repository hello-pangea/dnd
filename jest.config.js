module.exports = {
  setupFiles: [
    // for some painful reason this is needed for our 'async' usage
    // in drop-dev-warnings-for-prod.spec.js
    // eslint-disable-next-line node/no-extraneous-require
    require.resolve('regenerator-runtime/runtime'),
    './test/env-setup.js',
  ],
  setupFilesAfterEnv: ['./test/test-setup.js'],
  // node_modules is default.
  testPathIgnorePatterns: ['/node_modules/', '/cypress/'],
  modulePathIgnorePatterns: ['/dist/'],
  watchPlugins: [
    'jest-watch-typeahead/filename',
    'jest-watch-typeahead/testname',
  ],
  verbose: true,
};
