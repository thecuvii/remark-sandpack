// @ts-check
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { defineConfig } = require('eslint-define-config');

module.exports = defineConfig({
  root: true,
  extends: ['alloy', 'alloy/typescript'],
  plugins: ['prettier'],
  rules: { 'prettier/prettier': 'error' },
});
