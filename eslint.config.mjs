import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import { defineConfig } from 'eslint/config';

export default defineConfig([
    js.configs.recommended,
    ...tseslint.configs.recommendedTypeChecked,

    {
        files: ['src/**/*.{js,mjs,cjs,ts,mts,cts}'],
        languageOptions: {
            globals: globals.node,
            parserOptions: {
                project: './tsconfig.json',
                tsconfigRootDir: import.meta.dirname,
            },
        },
        rules: {
            quotes: [
                'error',
                'single',
                {
                    avoidEscape: true,
                    allowTemplateLiterals: false,
                },
            ],
            'jsx-quotes': ['error', 'prefer-double'],
        },
    },
]);