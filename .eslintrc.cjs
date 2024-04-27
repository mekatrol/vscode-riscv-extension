/* eslint-env node */

module.exports = {
  root: true,
  extends: ['eslint:recommended'],
  plugins: ['@typescript-eslint'],
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      parser: '@typescript-eslint/parser',
      rules: {
        // this rule, if on, would require explicit return type on the `render` function
        '@typescript-eslint/explicit-function-return-type': 'error'
      }
    }
  ],
  parserOptions: {
    parser: require.resolve('@typescript-eslint/parser'),
    ecmaVersion: 'latest'
  },
  rules: {
    'prefer-promise-reject-errors': 'error',

    'max-len': [
      'error',
      200,
      {
        // Ignore path of SVG
        // Ignore content string (eg embedded image or SVG) in CSS
        // Ignore RegExp strings
        ignorePattern: '^\\s*\\/'
      }
    ],

    // An error not to use single quotes
    quotes: [
      'error',
      'single',
      {
        // If strings contain quotes within string then either quote style can be used
        // eg: 'single containing "double"' or "double containing 'single'"
        avoidEscape: true,

        // Template (back tick quote) literals are not allowed
        // Back tick (interpolation) strings must have at least one parameter to be valid
        // eg must use 'literal' and not `literal`, but `literal ${param}` is OK
        allowTemplateLiterals: false
      }
    ],

    // in plain CommonJS modules, you can't use `import foo = require('foo')` to pass this rule, so it has to be disabled
    '@typescript-eslint/no-var-requires': 'off',

    // allow debugger during development only
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',

    'no-console': [process.env.NODE_ENV === 'production' ? 'error' : 'warn', { allow: ['warn', 'error'] }],

    // The core 'no-unused-vars' rules (in the eslint:recommended ruleset)
    // does not work with type definitions
    'no-unused-vars': 'off',

    // Should use 'const' and 'let', but not 'var' for declaration variables
    // 'var' has global scope!
    'no-var': 'error',

    // We want underscore param to not trigger the warning
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        argsIgnorePattern: '^_.*$',
        varsIgnorePattern: '^_$',
        caughtErrorsIgnorePattern: '^_$'
      }
    ]
  }
};
