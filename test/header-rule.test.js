/*
 * Copyright Trent Mick
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

// https://eslint.org/docs/latest/integrate/nodejs-api#ruletester
const {RuleTester} = require('eslint');

const rule = require('../lib/header-rule');

const allowedHeaderPatterns = [
    `
/*
 * Copyright Marge
 * SPDX-License-Identifier: MIT
 */
`,
    /\/\*\n \* Copyright Lisa(, .+)*\n \* SPDX-License-Identifier: MIT\n \*\//,
];

const ruleTester = new RuleTester();
ruleTester.run('header', rule, {
    valid: [
        {
            name: 'basic',
            options: [{header: '/* Copyright Lisa */'}],
            code: '/* Copyright Lisa */\n\nconsole.log("hi");',
        },
        {
            name: 'shebang',
            options: [{header: '/* Copyright Lisa */'}],
            code: '#!/usr/bin/env node\n/* Copyright Lisa */\n\nconsole.log("hi");',
        },

        // Line-style comment block works.
        {
            name: 'line-style comment block',
            options: [
                {header: '// Copyright Lisa\n// SPDX-License-Identifier: MIT'},
            ],
            code: '// Copyright Lisa\n// SPDX-License-Identifier: MIT\n\nconsole.log("hi");',
        },

        // CRLF line endings
        {
            name: 'CRLF',
            options: [
                {
                    header: '/* Copyright Lisa\n * SPDX-License-Identifier: MIT\n */',
                },
            ],
            code: '/* Copyright Lisa\r\n * SPDX-License-Identifier: MIT\r\n */\r\n\r\nconsole.log("hi");',
        },

        // headerFile
        {
            name: 'headerFile',
            options: [
                {
                    headerFile: './test/fixtures/license-header-lisa.txt',
                },
            ],
            code: '/*\n * Copyright Lisa\n * SPDX-License-Identifier: MIT\n */\n\nconsole.log("hi");',
        },

        // allowedHeaderPatterns
        {
            name: 'allowedHeaderPatterns 1',
            options: [
                {
                    headerFile: './test/fixtures/license-header-lisa.txt',
                    allowedHeaderPatterns,
                },
            ],
            code: '/*\n * Copyright Lisa\n * SPDX-License-Identifier: MIT\n */\n\nconsole.log("hi");',
        },

        {
            name: 'allowedHeaderPatterns 2',
            options: [
                {
                    headerFile: './test/fixtures/license-header-lisa.txt',
                    allowedHeaderPatterns,
                },
            ],
            code: '/*\n * Copyright Marge\n * SPDX-License-Identifier: MIT\n */\n\nconsole.log("hi");',
        },
        {
            name: 'allowedHeaderPatterns 3',
            options: [
                {
                    headerFile: './test/fixtures/license-header-lisa.txt',
                    allowedHeaderPatterns,
                },
            ],
            code: '/*\n * Copyright Lisa, Maggie\n * SPDX-License-Identifier: MIT\n */\n\nconsole.log("hi");',
        },
    ],

    invalid: [
        {
            name: 'basic (fix)',
            options: [{header: '/* Copyright Lisa */'}],
            code: '/* Copyright Bart */\n\nconsole.log("hi");',
            output: '/* Copyright Lisa */\n\nconsole.log("hi");',
            errors: [{messageId: 'incorrectHeader'}],
        },

        // Doesn't blow away a top-comment, as long as the comment doesn't
        // include "Copyright", "SPDX-License-Identifier", etc. See `LIC_RE`.
        {
            name: 'non-lic top-comment, block-style',
            options: [{header: '/* Copyright Lisa */'}],
            code: '/* Some non-lic comment\n * ...\n */\n\nconsole.log("hi");',
            output: '/* Copyright Lisa */\n\n/* Some non-lic comment\n * ...\n */\n\nconsole.log("hi");',
            errors: [{messageId: 'missingHeader'}],
        },
        {
            name: 'non-lic top-comment, line-style',
            options: [{header: '/* Copyright Lisa */'}],
            code: '// Some non-lic comment\n// ...\n\nconsole.log("hi");',
            output: '/* Copyright Lisa */\n\n// Some non-lic comment\n// ...\n\nconsole.log("hi");',
            errors: [{messageId: 'missingHeader'}],
        },

        // Line-style comment block works.
        {
            name: 'line-style comment block (fix)',
            options: [
                {header: '// Copyright Lisa\n// SPDX-License-Identifier: MIT'},
            ],
            code: '// Copyright Lisa\n// SPDX-License-Identifier: WTFPL\n\nconsole.log("hi");',
            output: '// Copyright Lisa\n// SPDX-License-Identifier: MIT\n\nconsole.log("hi");',
            errors: [{messageId: 'incorrectHeader'}],
        },

        // CRLF line endings
        {
            name: 'CRLF (fix)',
            options: [
                {
                    header: '/* Copyright Lisa\n * SPDX-License-Identifier: MIT\n */',
                },
            ],
            code: 'console.log("hi");\r\nconsole.log("bye");\r\n',
            output: '/* Copyright Lisa\r\n * SPDX-License-Identifier: MIT\r\n */\r\n\r\nconsole.log("hi");\r\nconsole.log("bye");\r\n',
            errors: [{messageId: 'missingHeader'}],
        },

        // allowedHeaderPatterns
        {
            name: 'allowedHeaderPatterns (fix)',
            options: [
                {
                    headerFile: './test/fixtures/license-header-lisa.txt',
                    allowedHeaderPatterns,
                },
            ],
            code: '/*\n * Copyright Maggie, Lisa\n * SPDX-License-Identifier: MIT\n */\n\nconsole.log("hi");',
            output: '/*\n * Copyright Lisa\n * SPDX-License-Identifier: MIT\n */\n\nconsole.log("hi");',
            errors: [{messageId: 'incorrectHeader'}],
        },
    ],
});
