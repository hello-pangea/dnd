module.exports = {
  extends: ['plugin:storybook/recommended'],
  plugins: ['@emotion'],
  rules: {
    '@emotion/pkg-renaming': 'error',

    // allowing console.warn / console.error
    // this is because we often mock console.warn and console.error and adding this rul
    // avoids needing to constantly be opting out of the rule
    'no-console': ['error', { allow: ['warn', 'error'] }],

    // Sometimes used for simple examples
    'class-methods-use-this': 'off',
    'react/function-component-definition': 'off',
    'react/state-in-constructor': 'off',
    'react/no-unknown-property': ['error', { ignore: ['css'] }],
  },
};
