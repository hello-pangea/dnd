module.exports = {
  rules: {
    'flowtype/require-valid-file-annotation': 'off',

    // allowing console.warn / console.error
    // this is because we often mock console.warn and console.error and adding this rul
    // avoids needing to constantly be opting out of the rule
    'no-console': ['error', { allow: ['warn', 'error'] }],

    // allowing useMemo and useCallback
    'no-restricted-imports': 'off',

    // Allowing Array.from
    'no-restricted-syntax': 'off',

    // Sometimes used for simple examples
    'react/state-in-constructor': 'off',
  },
};
