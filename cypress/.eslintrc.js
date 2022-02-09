module.exports = {
  plugins: ['cypress'],
  env: {
    'cypress/globals': true,
  },
  extends: ['plugin:cypress/recommended'],
  rules: {
    'flowtype/require-valid-file-annotation': 'off',
  },
};
