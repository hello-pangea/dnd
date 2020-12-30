module.exports = {
  extends: [
    'prettier',
    'airbnb',
    'plugin:flowtype/recommended',
    'prettier/react',
    'prettier/flowtype',
    'plugin:jest/recommended',
    'plugin:prettier/recommended',
  ],
  parser: 'babel-eslint',
  plugins: [
    'prettier',
    'flowtype',
    'emotion',
    'react',
    'react-hooks',
    'import',
    'jest',
    'es5',
  ],
  env: {
    es6: true,
    browser: true,
    node: true,
    'jest/globals': true,
  },
  globals: {
    // flow globals
    TimeoutID: true,
    IntervalID: true,
    AnimationFrameID: true,
  },
  rules: {
    // Error on prettier violations
    'prettier/prettier': 'error',

    // New eslint style rules that is not disabled by prettier:
    'lines-between-class-members': 'off',

    // Allowing warning and error console logging
    // use `invariant` and `warning`
    'no-console': ['error'],

    // Opting out of prefer destructuring (nicer with flow in lots of cases)
    'prefer-destructuring': 'off',

    // Disallowing the use of variables starting with `_` unless it called on `this`.
    // Allowed: `this._secret = Symbol()`
    // Not allowed: `const _secret = Symbol()`
    'no-underscore-dangle': ['error', { allowAfterThis: true }],

    // Cannot reassign function parameters but allowing modification
    'no-param-reassign': ['error', { props: false }],

    // Named exports are kewl
    'import/prefer-default-export': 'off',

    // Don't tell me what to do!
    'max-classes-per-file': 'off',

    // Allowing ++ on numbers
    'no-plusplus': 'off',

    // Always enforcing the use of curly braces for if statements
    curly: ['error', 'all'],

    'no-restricted-syntax': [
      // Nicer booleans #1
      // Disabling the use of !! to cast to boolean
      'error',
      {
        selector:
          'UnaryExpression[operator="!"] > UnaryExpression[operator="!"]',
        message:
          '!! to cast to boolean relies on a double negative. Use Boolean() instead',
      },
      // Nicer booleans #2
      // Avoiding accidental `new Boolean()` calls
      // (also covered by `no-new-wrappers` but i am having fun)
      {
        selector: 'NewExpression[callee.name="Boolean"]',
        message:
          'Avoid using constructor: `new Boolean(value)` as it creates a Boolean object. Did you mean `Boolean(value)`?',
      },
      // We are using a useLayoutEffect / useEffect switch to avoid SSR warnings for useLayoutEffect
      // We want to ensure we use `import useEffect from '*use-isomorphic-layout-effect'`
      // to ensure we still get the benefits of `eslint-plugin-react-hooks`
      {
        selector:
          'ImportDeclaration[source.value=/use-isomorphic-layout-effect/] > ImportDefaultSpecifier[local.name!="useLayoutEffect"]',
        message:
          'Must use `useLayoutEffect` as the name of the import from `*use-isomorphic-layout-effect` to leverage `eslint-plugin-react-hooks`',
      },

      // No Array.from as it pulls in a large amount of babel helpers
      {
        selector: 'MemberExpression[object.name="Array"][property.name="from"]',
        message:
          'Not allowing using of Array.from to save kbs. Please use native-with-fallback/from',
      },

      // No usage of `tiny-invariant`. Must use our own invariant for error flow
      {
        selector: 'ImportDeclaration[source.value="tiny-invariant"]',
        message:
          'Please use our own invariant function (src/invariant.js) to ensure correct error flow',
      },

      // Must use invariant to throw
      {
        selector: 'ThrowStatement',
        message:
          'Please use invariant (src/invariant.js) for throwing. This is to ensure correct error flows',
      },
    ],

    // Allowing Math.pow rather than forcing `**`
    'no-restricted-properties': [
      'error',
      {
        object: 'Math',
        property: 'pow',
      },
    ],

    'no-restricted-imports': [
      'error',
      {
        paths: [
          // Forcing use of useMemoOne
          {
            name: 'react',
            importNames: ['useMemo', 'useCallback'],
            message:
              '`useMemo` and `useCallback` are subject to cache busting. Please use `useMemoOne`',
          },
          // Forcing use aliased imports from useMemoOne
          {
            name: 'use-memo-one',
            importNames: ['useMemoOne', 'useCallbackOne'],
            message:
              'use-memo-one exports `useMemo` and `useCallback` which work nicer with `eslint-plugin-react-hooks`',
          },
          // Disabling using of useLayoutEffect from react
          {
            name: 'react',
            importNames: ['useLayoutEffect'],
            message:
              '`useLayoutEffect` causes a warning in SSR. Use `useIsomorphicLayoutEffect`',
          },
        ],
      },
    ],

    // Allowing jsx in files with any file extension (old components have jsx but not the extension)
    'react/jsx-filename-extension': 'off',

    // Not requiring default prop declarations all the time
    'react/require-default-props': 'off',

    // Opt out of preferring stateless functions
    'react/prefer-stateless-function': 'off',

    // Allowing files to have multiple components in it
    'react/no-multi-comp': 'off',

    // Sometimes we use the PropTypes.object PropType for simplicity
    'react/forbid-prop-types': 'off',

    // Allowing the non function setState approach
    'react/no-access-state-in-setstate': 'off',

    // Opting out of this
    'react/destructuring-assignment': 'off',

    // Adding 'skipShapeProps' as the rule has issues with correctly handling PropTypes.shape
    'react/no-unused-prop-types': ['error', { skipShapeProps: true }],

    // Having issues with this rule not working correctly
    'react/default-props-match-prop-types': 'off',

    // Allowing functions to be passed as props
    'react/jsx-no-bind': 'off',

    // Require // @flow at the top of files
    'flowtype/require-valid-file-annotation': [
      'error',
      'always',
      { annotationStyle: 'line' },
    ],

    // Allowing importing from dev deps (for stories and tests)
    'import/no-extraneous-dependencies': 'off',

    // Enforce rules of hooks
    'react-hooks/rules-of-hooks': 'error',
    // Second argument to hook functions
    'react-hooks/exhaustive-deps': 'error',

    'react/jsx-props-no-spreading': 'off',

    // using <React.Fragment> is fine
    'react/jsx-fragments': 'off',

    // all good to declare static class members in the class
    'react/static-property-placement': 'off',

    // don't need to initialize state in a constructor
    'react/state-in-constructor': 'off',

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
  overrides: [
    // Forbid using not es5 methods
    {
      files: 'src/**/*.js',
      rules: {
        'es5/no-es6-methods': 'error',
        'es5/no-es6-static-methods': [
          'error',
          { exceptMethods: ['Object.assign'] },
        ],
      },
    },

    // Typescript files
    {
      parser: '@typescript-eslint/parser',
      extends: [
        'plugin:import/typescript',
        'plugin:@typescript-eslint/recommended',
        'prettier/@typescript-eslint',
      ],
      plugins: ['@typescript-eslint'],
      files: ['**/*.ts?(x)'],
      rules: {
        'flowtype/no-types-missing-file-annotation': 'off',
        'flowtype/require-valid-file-annotation': 'off',

        "import/extensions": [
          "error",
          "ignorePackages",
          {
            "js": "never",
            "jsx": "never",
            "ts": "never",
            "tsx": "never"
          }
        ],

        'no-use-before-define': 'off',
        '@typescript-eslint/no-use-before-define': ['error'],

        'no-unused-expressions': 'off',
        '@typescript-eslint/no-unused-expressions': ['error'],

        'no-useless-constructor': 'off',
        '@typescript-eslint/no-useless-constructor': ['error'],
      },
    },
  ],
};
