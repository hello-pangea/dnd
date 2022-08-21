const path = require('path');

module.exports = (api) => {
  const isTest = api.env('test');
  const isProduction = api.env('production');

  const reactMajorVersion = process.env.REACT_MAJOR_VERSION;
  const isOldReactVersion = ['16', '17'].includes(reactMajorVersion);
  const reactModuleSufix = isOldReactVersion ? `-${reactMajorVersion}` : '';

  console.log(
    `REACT_MAJOR_VERSION: ${reactMajorVersion}`,
    `module suffix: ${reactModuleSufix}`,
    require.resolve(`react${reactModuleSufix}`),
    require.resolve(`react-dom${reactModuleSufix}`),
  );

  return {
    presets: [
      '@babel/react',
      '@babel/preset-typescript',
      [
        '@babel/env',
        isTest ? { targets: { node: 'current' } } : { loose: true },
      ],
    ].filter(Boolean),
    plugins: [
      [
        'babel-plugin-module-resolver',
        {
          alias: {
            '@react-forked/dnd':
              process.env.USE_PRODUCTION_BUILD === 'true'
                ? path.resolve(__dirname, './dist/dnd.esm')
                : path.resolve(__dirname, './src/index.ts'),

            // react: require.resolve(`react${reactModuleSufix}`),
            // 'react-dom': require.resolve(`react-dom${reactModuleSufix}`),
            // 'react-dom/client': require.resolve('react-dom/client'),
          },
        },
      ],
      '@babel/plugin-transform-object-assign',
      ['@babel/plugin-proposal-class-properties', { loose: true }],
      ['@babel/plugin-proposal-private-methods', { loose: true }],
      ['@babel/plugin-proposal-private-property-in-object', { loose: true }],
      // used for stripping out the `invariant` messages in production builds
      isProduction ? 'babel-plugin-dev-expression' : false,
    ].filter(Boolean),
    comments: false,
  };
};
