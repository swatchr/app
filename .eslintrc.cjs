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
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
  },
  plugins: ['@typescript-eslint', 'prettier'],
  extends: ['next/core-web-vitals', 'prettier'],
  rules: {
    '@typescript-eslint/consistent-type-imports': [
      'warn',
      {
        prefer: 'type-imports',
        fixStyle: 'separate-type-imports',
      },
    ],
    quotes: ['error', 'single'],
    semi: ['error', 'always'],
    'prettier/prettier': ['error', { endOfLine: 'auto' }],
  },
};

module.exports = config;
