import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettierPlugin from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  prettierConfig,
  {
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      'prettier/prettier': 'error',
    },
  },
  {
    ignores: ['dist/**', 'node_modules/**', '**/*.spec.ts', '**/types/**/*.ts', '**/types/**/*.d.ts', 'src/metadata-factory.ts'],
  },
  {
    files: ['**/*.spec.ts', '**/types/**/*.ts', '**/types/**/*.d.ts', 'src/metadata-factory.ts', 'src/reflect-metadata-integration.spec.ts'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
    },
  }
);