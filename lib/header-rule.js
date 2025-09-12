/*
 * Copyright Trent Mick
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const assert = require('assert/strict');
const {readFileSync} = require('fs');
const pj = require('../package.json');

function eolNormalize(s) {
    return s.split(/\r?\n/g).join('\n');
}

const LIC_RE = /Copyright|@license|SPDX-License-Identifier/i;
function looksLikeLicenseComment(s) {
    return LIC_RE.test(s);
}

function headerMatches(s, normHeader, opts) {
    if (s === normHeader) {
        return true;
    } else if (opts.allowedHeaderPatterns) {
        for (let pat of opts.allowedHeaderPatterns) {
            if (typeof pat.test === 'function') {
                if (pat.test(s)) {
                    return true;
                }
            } else if (typeof pat === 'string') {
                if (s === pat) {
                    return true;
                }
            }
        }
    }
    return false;
}

function eolFromS(s) {
    const numCRLF = (s.match(/\r\n/g) || []).length;
    const numLF = (s.match(/\n/g) || []).length - numCRLF;
    if (numCRLF === 0 && numLF === 0) {
        // For now, default to '\n' even on Windows. If need to change that
        // later, can add an option.
        return '\n';
    } else if (numCRLF > numLF) {
        return '\r\n';
    } else {
        // On a tie, we prefer '\n'.
        return '\n';
    }
}

function eolReplace(normS, eol) {
    if (eol === '\n') {
        // The normalized form uses '\n' for end-of-line characters.
        return normS;
    } else {
        return normS.replace(/\n/g, '\r\n');
    }
}

function create(context) {
    const opts = context.options[0];
    let normHeader;
    if ('header' in opts) {
        normHeader = eolNormalize(opts.header.trim());
    } else {
        normHeader = eolNormalize(readFileSync(opts.headerFile, 'utf8').trim());
    }

    // Get the end-of-line style used in the target file for "fix" content
    // below.
    const eol = eolFromS(context.sourceCode.getText());

    return {
        Program: (node) => {
            // Consider the first comment before the first node, excluding
            // the shebang line, if any.
            const leadingComments = context.sourceCode.getCommentsBefore(node);
            let shebang = null;
            if (
                leadingComments.length > 0 &&
                leadingComments[0].type === 'Shebang'
            ) {
                shebang = leadingComments.shift();
            }

            if (leadingComments.length === 0) {
                context.report({
                    node,
                    messageId: 'missingHeader',
                    fix(fixer) {
                        const start = shebang ? shebang.range[1] + eol.length : 0;
                        const end = node.range[0];
                        return fixer.replaceTextRange(
                            [start, end],
                            eolReplace(normHeader + '\n\n', eol)
                        );
                    },
                });
                return;
            }

            // There is a leading comment. Extract it to be considered.
            let considerRange;
            let considerComment;
            if (leadingComments[0].type === 'Block') {
                considerRange = leadingComments[0].range;
                considerComment =
                    '/*' + eolNormalize(leadingComments[0].value) + '*/';
            } else {
                // Slurp up continguous line comments.
                assert.ok(leadingComments[0].type === 'Line');
                considerRange = leadingComments[0].range.slice();
                const lines = ['//' + leadingComments[0].value];
                for (const c of leadingComments.slice(1)) {
                    if (c.type !== 'Line') {
                        break;
                    }
                    if (c.range[0] > considerRange[1] + 1) {
                        break;
                    }
                    considerRange[1] = c.range[1];
                    lines.push('//' + c.value);
                }
                considerComment = lines.join('\n');
            }

            // If the existing leading comment does *not* look like a license
            // block, then report `missingHeader`.
            if (!looksLikeLicenseComment(considerComment)) {
                context.report({
                    node,
                    messageId: 'missingHeader',
                    fix(fixer) {
                        const start = shebang ? shebang.range[1] + eol.length : 0;
                        const end = leadingComments[0].range[0];
                        return fixer.replaceTextRange(
                            [start, end],
                            eolReplace(normHeader + '\n\n', eol)
                        );
                    },
                });
                return;
            }

            // The existing leading comment either matches, or needs to be
            // replaced.
            if (!headerMatches(considerComment, normHeader, opts)) {
                context.report({
                    node,
                    messageId: 'incorrectHeader',
                    fix(fixer) {
                        return fixer.replaceTextRange(
                            considerRange,
                            eolReplace(normHeader, eol)
                        );
                    },
                });
                return;
            }
        },
    };
}

const rule = {
    meta: {
        type: 'suggestion',
        docs: {
            description: 'Ensure every file has the configured header',
            url: pj.homepage,
        },
        fixable: 'code',

        // The plugin takes exactly one argument, an object with the following
        // props:
        // 1. `header` or `headerFile` with the default header content,
        // 2. optional `allowedHeaderPatterns`: an array of strings or RegExps
        //    to match against.
        //
        // https://eslint.org/docs/latest/extend/custom-rules#options-schemas
        defaultOptions: [],
        schema: {
            type: 'array',
            minItems: 1,
            maxItems: 1,
            items: [
                {
                    anyOf: [
                        {
                            type: 'object',
                            properties: {
                                header: {type: 'string'},
                                allowedHeaderPatterns: {
                                    type: 'array',
                                    // Note: not specifying the type of the items, because
                                    // I don't know how to allow "string" and RegExp.
                                },
                            },
                            required: ['header'],
                            additionalProperties: false,
                        },
                        {
                            type: 'object',
                            properties: {
                                headerFile: {type: 'string'},
                                allowedHeaderPatterns: {
                                    type: 'array',
                                    // Note: not specifying the type of the items, because
                                    // I don't know how to allow "string" and RegExp.
                                },
                            },
                            required: ['headerFile'],
                            additionalProperties: false,
                        },
                    ],
                },
            ],
        },

        messages: {
            missingHeader: 'Missing license header',
            incorrectHeader: 'Incorrect license header',
        },
    },

    create,
};

module.exports = rule;
