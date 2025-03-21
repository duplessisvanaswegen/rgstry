module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    'plugin:@typescript-eslint/recommended',
    'prettier',
    'plugin:prettier/recommended',
  ],
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  rules: {
    // Custom global rules
    '@typescript-eslint/no-explicit-any': 'warn', // Downgrade any usage to warning instead of error
  },
  overrides: [
    {
      // Special rules for test files, type definitions, and runtime type detection files
      files: [
        '**/*.spec.ts', 
        '**/types/**/*.ts', 
        '**/types/**/*.d.ts',
        '**/metadata-factory.ts',  // Add metadata-factory.ts to the list because it needs to use any for reflection API
        '**/reflect-*.ts'          // Any reflect-related files
      ],
      rules: {
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-unused-vars': 'off',
      },
    },
  ],
};
