require('dotenv').config();

module.exports = {
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-storysource',
    'storybook-addon-performance/register',
  ],
  check: true,
  checkOptions: {
    tsconfig: '../stories/tsconfig.json',
  },
  stories: [
    '../stories/**/*.stories.mdx',
    '../stories/**/*.stories.@(js|jsx|ts|tsx)',
  ],
  babel: async (options) => ({
    ...options,
    presets: ['@emotion/babel-preset-css-prop', ...options.presets],
    comments: false,
  }),
  webpackFinal: async (config) => {
    // We need to disable the hot module reloading when we run the lighthouse audit,
    // because it wait for the load to finish, but the /__webpack_hmr query never ends.
    // https://github.com/storybookjs/storybook/issues/3062#issuecomment-504550789
    if (process.env.DISABLE_HMR === 'true') {
      config.entry = config.entry.filter(
        (singleEntry) => !singleEntry.includes('/webpack-hot-middleware/'),
      );
    }

    return config;
  },
};
