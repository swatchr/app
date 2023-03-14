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
    'object-property-newline': ['off', { allowAllPropertiesOnSameLine: true }],
    'array-element-newline': ['off', { multiline: true, minItems: 5 }],
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
