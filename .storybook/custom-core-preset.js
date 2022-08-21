// import webpackConfig from '../preview/iframe-webpack.config';



exports.webpack = async (config, options) => {
  const reactMajorVersion = process.env.REACT_MAJOR_VERSION;
  const isOldReactVersion = ['16', '17'].includes(reactMajorVersion);
  const reactModuleSufix = isOldReactVersion ? `-${reactMajorVersion}` : '';
  console.log(config);

  config.resolve.alias = {
    ...config.resolve.alias,
    react: require.resolve(`react${reactModuleSufix}`),
    'react-dom': require.resolve(`react-dom${reactModuleSufix}`),
  };

console.log(config);

  return config;
};

exports.entries = async (entries, options) => {
  console.log('entries:', entries);

  return entries;
};
