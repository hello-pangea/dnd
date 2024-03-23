import type { Options } from '@swc/core';
import type { StorybookConfig } from '@storybook/react-webpack5';
import { resolve } from 'path';
import { config as dotenvConfig } from 'dotenv';

dotenvConfig();

const storybookConfig: StorybookConfig = {
  typescript: {
    check: true,
    checkOptions: {
      typescript: {
        configFile: './stories/tsconfig.json',
      },
    },
  },
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-storysource',
    '@storybook/addon-webpack5-compiler-swc',
  ],

  core: {
    disableTelemetry: true,
  },

  stories: ['../stories/**/*.mdx', '../stories/**/*.stories.@(js|jsx|ts|tsx)'],

  webpackFinal: async (config) => {
    // We need to disable the hot module reloading when we run the lighthouse audit,
    // because it wait for the load to finish, but the /__webpack_hmr query never ends.
    // https://github.com/storybookjs/storybook/issues/3062#issuecomment-504550789
    if (process.env.DISABLE_HMR === 'true') {
      config.entry = (config.entry as string[]).filter(
        (singleEntry) => !singleEntry.includes('/webpack-hot-middleware/'),
      );
    }

    return config;
  },

  framework: {
    name: '@storybook/react-webpack5',

    options: {
      // FIXME: The way we generate data isn't working properly with StrictMode
      strictMode: false,
    },
  },

  docs: {
    autodocs: false,
  },

  swc: (config: Options): Options => {
    return {
      ...config,
      jsc: {
        ...(config?.jsc || {}),
        baseUrl: resolve(__dirname),
        paths: {
          '@hello-pangea/dnd': [
            process.env.USE_PRODUCTION_BUILD === 'true'
              ? resolve(__dirname, '../dist/dnd.esm')
              : resolve(__dirname, '../src/index.ts'),
          ],
        },
      },
    };
  },
};

export default storybookConfig;
