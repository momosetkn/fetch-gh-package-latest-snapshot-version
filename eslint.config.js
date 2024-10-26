import tseslint from 'typescript-eslint'
import eslintConfigPrettier from 'eslint-config-prettier'
import globals from 'globals'
import js from '@eslint/js'

export default tseslint.config(
  {
    files: ['src/**/*.ts'],
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommendedTypeChecked,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.es2025,
      parserOptions: {
        project: ['./tsconfig.json'],
      },
    },
  },
  {
    ignores: ['dist/*.*'],
  },
  eslintConfigPrettier,
)
