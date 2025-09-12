/*
 * Copyright Trent Mick
 * SPDX-License-Identifier: Apache-2.0
 */

import {fileURLToPath} from 'node:url';
import js from '@eslint/js';
import {includeIgnoreFile} from '@eslint/compat';
import globals from 'globals';
import {defineConfig} from 'eslint/config';
import eslintConfigPrettier from 'eslint-config-prettier/flat';
import eslintPlugin from 'eslint-plugin-eslint-plugin';

import headerPlugin from './index.js';

// https://eslint.org/docs/latest/use/configure/ignore#including-gitignore-files
const gitignore = fileURLToPath(new URL('.gitignore', import.meta.url));

export default defineConfig([
    includeIgnoreFile(gitignore, 'Imported .gitignore patterns'),

    // Per recommendation at https://eslint.org/docs/latest/extend/plugins#linting-a-plugin
    // Note: Not using `eslint-plugin-n` because it chokes on this .mjs file.
    eslintPlugin.configs.recommended,

    {
        files: ['**/*.{js,mjs,cjs}'],
        plugins: {js, 'yet-another-license-header': headerPlugin},
        extends: ['js/recommended'],
        languageOptions: {globals: globals.browser},
        rules: {
            'yet-another-license-header/header': [
                'error',
                {
                    headerFile: './etc/license-header.txt',
                },
            ],
        },
    },

    // ESLint flat-config assumes .js files are ESM without this.
    {files: ['**/*.js'], languageOptions: {sourceType: 'commonjs'}},

    // Turn off style-related rules, because we separately use prettier for that.
    eslintConfigPrettier,
]);
