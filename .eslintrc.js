module.exports = {
  // Parser to lint TypeScript code, see:
  // https://standardjs.com/index.html#typescript
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    ecmaFeatures: {
      jsx: true,
    },
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  extends: [
    'eslint:recommended',
    // Uses the recommended rules from @eslint-plugin-react
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    // Keep prettier rules last to make sure its style changes are not
    // overwritten by other rules
    'plugin:prettier/recommended',
    'prettier/@typescript-eslint',
  ],
  plugins: ['@typescript-eslint', 'prettier'],
  rules: {
    // Always require dangling commas for multiline objects and arrays
    'comma-dangle': ['error', 'always-multiline'],
    // This react rule helps with typos but requires escaping all kinds
    // of characters which makes the source code less readable. I left only
    // the rules for '>' and '}' because these are probably the most common
    // typos but they could also be removed.
    'react/no-unescaped-entities': [
      'error',
      {
        forbid: ['>', '}'],
      },
    ],
    // Warn on prettier violations and continue with build
    'prettier/prettier': 1,
    'react/prop-types': 0,
  },
};
