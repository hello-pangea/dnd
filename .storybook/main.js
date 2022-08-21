require('dotenv').config();

const reactMajorVersion = process.env.REACT_MAJOR_VERSION;
const isOldReactVersion = ['16', '17'].includes(reactMajorVersion);
const reactModuleSufix = isOldReactVersion ? `-${reactMajorVersion}` : '';

module.exports = {
  addons: ['@storybook/addon-essentials', '@storybook/addon-storysource'],
  check: true,
  checkOptions: {
    tsconfig: '../stories/tsconfig.json',
  },
  core: {
    builder: require.resolve('./custom-builder'),
    disableTelemetry: true,
  },
  reactOptions: {
    strictMode: true,
    legacyRootApi: isOldReactVersion,
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

    config.resolve.alias = {
      ...config.resolve.alias,
      // react: require.resolve(`react${reactModuleSufix}`),
      // 'react-dom': require.resolve(`react-dom${reactModuleSufix}`),
    };

    return config;
  },
};
