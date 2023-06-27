module.exports = {
  plugins: ['cypress'],
  env: {
    'cypress/globals': true,
  },
  extends: ['plugin:cypress/recommended'],
  rules: {
    'cypress/unsafe-to-chain-command': 'off',
  },
};
