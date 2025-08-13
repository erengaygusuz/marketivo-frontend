import js from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import prettierConfig from 'eslint-config-prettier';
import prettier from 'eslint-plugin-prettier';

export default [
    {
        ignores: ['**/dist/**', '**/node_modules/**', '**/coverage/**', '**/.angular/**'],
    },
    // JavaScript files
    {
        files: ['**/*.{js,mjs}'],
        ...js.configs.recommended,
        plugins: {
            prettier,
        },
        rules: {
            ...prettierConfig.rules,
            'prettier/prettier': 'error',
            'no-console': 'error', // Changed from 'warn' to 'error'
            'prefer-const': 'error',
        },
    },
    // TypeScript files
    {
        files: ['**/*.{ts,mts}'],
        languageOptions: {
            parser: tsParser,
            parserOptions: {
                ecmaVersion: 2022,
                sourceType: 'module',
            },
        },
        plugins: {
            '@typescript-eslint': tseslint,
            prettier,
        },
        rules: {
            ...prettierConfig.rules,
            'prettier/prettier': 'error',

            // TypeScript-specific rules
            '@typescript-eslint/no-explicit-any': 'error', // Changed from 'warn' to 'error'
            '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],

            // Code quality rules for better readability
            'arrow-body-style': ['error', 'as-needed'],
            curly: ['error', 'all'],
            'no-console': 'error', // Changed from 'warn' to 'error'
            'no-debugger': 'error',
            'prefer-const': 'error',
            quotes: ['error', 'single', { avoidEscape: true }],
            semi: ['error', 'always'],
            'no-var': 'error',
            'no-duplicate-imports': 'error',

            // Spacing rules for better readability
            'padding-line-between-statements': [
                'error',
                { blankLine: 'always', prev: ['const', 'let', 'var'], next: '*' },
                { blankLine: 'any', prev: ['const', 'let', 'var'], next: ['const', 'let', 'var'] },
                { blankLine: 'always', prev: '*', next: 'return' },
                { blankLine: 'always', prev: ['import'], next: ['const', 'let', 'var'] },
                { blankLine: 'always', prev: ['function', 'class'], next: '*' },
                { blankLine: 'always', prev: '*', next: ['function', 'class'] },
            ],
        },
    },
];
