/*
 * Copyright Trent Mick
 * SPDX-License-Identifier: Apache-2.0
 */

const {name, version} = require('./package.json');

module.exports = {
    meta: {
        name,
        version,
        namespace: 'yet-another-license-header',
    },
    rules: {
        header: require('./lib/header-rule'),
    }
}
