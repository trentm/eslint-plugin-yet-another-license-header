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
import headerPlugin from './index.js';

const gitignore = fileURLToPath(new URL('.gitignore', import.meta.url));

export default defineConfig([
    includeIgnoreFile(gitignore, 'Imported .gitignore patterns'),
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
    {files: ['**/*.js'], languageOptions: {sourceType: 'commonjs'}},
    eslintConfigPrettier,
]);
