const webpackBuild = require('@storybook/builder-webpack4');

// overridePresets
console.log(webpackBuild);

exports.executor = webpackBuild.executor;
// getConfig
exports.getConfig = webpackBuild.getConfig;
// makeStatsFromError
exports.makeStatsFromError = webpackBuild.makeStatsFromError;
// bail
exports.bail = webpackBuild.bail;
// start
exports.start = webpackBuild.start;
// build
exports.build = webpackBuild.build;

exports.corePresets = [
  ...webpackBuild.corePresets,
  require.resolve('./custom-core-preset.js'),
];

// overridePresets
exports.overridePresets = webpackBuild.overridePresets;

// module.exports = webpackBuild;
