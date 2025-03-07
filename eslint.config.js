import globals from 'globals';
import tseslint from 'typescript-eslint';
import eslintPluginAstro from 'eslint-plugin-astro';
import astroParser from 'astro-eslint-parser';
import tsParser from '@typescript-eslint/parser';

export default [
  {files: ["**/*.{js,mjs,cjs,ts}"]},
  {languageOptions: { globals: globals.browser }},
  ...(tseslint.configs.recommended.map(config => ({
    ...config,
    files: ["**/*.ts"],
    rules: {
      ...config.rules,
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
    }
  }))),
  ...(eslintPluginAstro.configs['flat/base'].map(config => {
    return {
      ...config,
      files: ["**/*.astro"],
      languageOptions: {
        parser: astroParser,
        parserOptions: {
          parser: tsParser,
          extraFileExtensions: ['.astro'],
          project: './tsconfig.json',
          sourceType: 'module',
        }
      }
    }})),
  {
    files: ['**/*.astro'],
    languageOptions: {
      parser: astroParser,
      parserOptions: {
        parser: tsParser,
        extraFileExtensions: ['.astro'],
        project: './tsconfig.json',
        sourceType: 'module',
      }
    }
  }
];
