module.exports = {
  // Parser to lint TypeScript code, see:
  // https://standardjs.com/index.html#typescript
  parser: '@typescript-eslint/parser',
  plugins: [
    // Required plugin to lint TypeScript code
    '@typescript-eslint',
  ],
  rules: {
    // Prevent wrong "React was used before it was defined" errors, see:
    // https://stackoverflow.com/questions/63818415/react-was-used-before-it-was-defined
    'no-use-before-define': 'off',
    '@typescript-eslint/no-use-before-define': ['error'],
    // Standard incorrectly emits unused-variable errors, see:
    // https://github.com/standard/standard/issues/1283
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': 'error',
    // Always require dangling commas for multiline objects and arrays
    'comma-dangle': ['error', 'always-multiline'],
    // Standard does not like semicolons, semistandard likes them, we like
    // semicolons as well, but we're using standardx, therefore we have to
    // require them here manually
    semi: ['error', 'always'],
  },
};
