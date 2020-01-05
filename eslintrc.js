module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: [
    '@typescript-eslint',
  ],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  rules: {
    'semi': 1,
    'space-before-function-paren': [1, { "anonymous": "never", "named": "never", "asyncArrow": "always"}]
  }
};
