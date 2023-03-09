/** @type {import("eslint").Linter.Config} */
const config = {
  // overrides: [
  //   {
  //     extends: [
  //       'plugin:@typescript-eslint/recommended-requiring-type-checking',
  //     ],
  //     files: ['*.ts', '*.tsx'],
  //     parserOptions: {
  //       project: 'tsconfig.json',
  //     },
  //   },
  // ],
  // parser: '@typescript-eslint/parser',
  // parserOptions: {
  //   project: './tsconfig.json',
  // },
  // plugins: ['@typescript-eslint', 'prettier'],
  plugins: ['prettier'],
  extends: ['next/core-web-vitals'],
  rules: {
    // '@typescript-eslint/consistent-type-imports': [
    //   'warn',
    //   {
    //     prefer: 'type-imports',
    //     fixStyle: 'separate-type-imports',
    //   },
    // ],
    '@typescript-eslint/no-unsafe-assignment': 'off',
    '@typescript-eslint/no-unsafe-call': 'off',
    quotes: ['error', 'single'],
    semi: ['error', 'always'],
    'prettier/prettier': ['error', { endOfLine: 'auto' }],
  },
};

module.exports = config;
