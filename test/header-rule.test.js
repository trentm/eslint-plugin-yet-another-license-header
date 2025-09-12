/*
 * Copyright Trent Mick
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

// https://eslint.org/docs/latest/integrate/nodejs-api#ruletester
const {RuleTester} = require('eslint');

const rule = require('../lib/header-rule');

const ruleTester = new RuleTester();
ruleTester.run('header', rule, {
    valid: [
        {
            options: [{header: '/* Copyright Lisa */'}],
            code: '/* Copyright Lisa */\n\nconsole.log("hi");',
        },
        {
            options: [{header: '/* Copyright Lisa */'}],
            code: '#!/usr/bin/env node\n/* Copyright Lisa */\n\nconsole.log("hi");',
        },

        // Line-style comment block works.
        {
            options: [
                {header: '// Copyright Lisa\n// SPDX-License-Identifier: MIT'},
            ],
            code: '// Copyright Lisa\n// SPDX-License-Identifier: MIT\n\nconsole.log("hi");',
        },

        // CRLF line endings
        {
            options: [
                {
                    header: '/* Copyright Lisa\n * SPDX-License-Identifier: MIT\n */',
                },
            ],
            code: '/* Copyright Lisa\r\n * SPDX-License-Identifier: MIT\r\n */\r\n\r\nconsole.log("hi");',
        },
    ],

    // TODO: test opts.allowHeaderPatterns
    // TODO: test opts.headerFile

    invalid: [
        {
            options: [{header: '/* Copyright Lisa */'}],
            code: '/* Copyright Bart */\n\nconsole.log("hi");',
            output: '/* Copyright Lisa */\n\nconsole.log("hi");',
            errors: [{messageId: 'incorrectHeader'}],
        },

        // Doesn't blow away a top-comment, as long as the comment doesn't
        // include "Copyright", "SPDX-License-Identifier", etc. See `LIC_RE`.
        {
            options: [{header: '/* Copyright Lisa */'}],
            code: '/* Some non-lic comment\n * ...\n */\n\nconsole.log("hi");',
            output: '/* Copyright Lisa */\n\n/* Some non-lic comment\n * ...\n */\n\nconsole.log("hi");',
            errors: [{messageId: 'missingHeader'}],
        },
        {
            options: [{header: '/* Copyright Lisa */'}],
            code: '// Some non-lic comment\n// ...\n\nconsole.log("hi");',
            output: '/* Copyright Lisa */\n\n// Some non-lic comment\n// ...\n\nconsole.log("hi");',
            errors: [{messageId: 'missingHeader'}],
        },

        // Line-style comment block works.
        {
            options: [
                {header: '// Copyright Lisa\n// SPDX-License-Identifier: MIT'},
            ],
            code: '// Copyright Lisa\n// SPDX-License-Identifier: WTFPL\n\nconsole.log("hi");',
            output: '// Copyright Lisa\n// SPDX-License-Identifier: MIT\n\nconsole.log("hi");',
            errors: [{messageId: 'incorrectHeader'}],
        },

        // CRLF line endings
        {
            options: [
                {
                    header: '/* Copyright Lisa\n * SPDX-License-Identifier: MIT\n */',
                },
            ],
            code: 'console.log("hi");\r\nconsole.log("bye");\r\n',
            output: '/* Copyright Lisa\r\n * SPDX-License-Identifier: MIT\r\n */\r\n\r\nconsole.log("hi");\r\nconsole.log("bye");\r\n',
            errors: [{messageId: 'missingHeader'}],
        },
    ],
});
