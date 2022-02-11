module.exports = {
  extends: ['plugin:jest/recommended'],

  plugins: ['jest'],

  env: {
    'jest/globals': true,
  },

  rules: {
    // allowing console.warn / console.error
    // this is because we often mock console.warn and console.error and adding this rul
    // avoids needing to constantly be opting out of the rule
    'no-console': ['error', { allow: ['warn', 'error'] }],

    // allowing useMemo and useCallback in tests
    'no-restricted-imports': 'off',

    // Allowing Array.from
    'no-restricted-syntax': 'off',

    'react/function-component-definition': 'off',

    'jest/expect-expect': [
      'error',
      {
        assertFunctionNames: [
          'expect',
          // these functions will run expect internally
          'withWarn',
          'withError',
          'withoutError',
          'withoutWarn',
        ],
      },
    ],
  },
};
