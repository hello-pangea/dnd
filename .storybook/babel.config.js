const { plugins, presets } = require('@storybook/core/dist/server/common/babel');

module.exports = {
  plugins,
  presets: [
    ...presets,
    '@emotion/babel-preset-css-prop',
  ],
  comments: false
}
