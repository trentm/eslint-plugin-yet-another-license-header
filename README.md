# eslint-plugin-yet-another-license-header

This repo contains **yet another** eslint plugin for handling a **license
header** comment at the top of your JavaScript/TypeScript files.

# Why?

- There is [eslint-plugin-header](https://github.com/Stuk/eslint-plugin-header). AFAIK, this plugin [does not support eslint@9](https://github.com/open-telemetry/opentelemetry-js-contrib/pull/3001#discussion_r2338202665). It can also [accidentally blow away a top-comment](https://github.com/open-telemetry/opentelemetry-js-contrib/issues/2967).
- There is [eslint-plugin-license-header](https://github.com/nikku/eslint-plugin-license-header). I like this plugin. However, it does [not support having multiple allowed headers, or a pattern for allowed headers](https://github.com/nikku/eslint-plugin-license-header/issues/14). The [opentelemetry-js-contrib](https://github.com/open-telemetry/opentelemetry-js-contrib) requires this functionality. I have a [PR on eslint-plugin-license-header](https://github.com/nikku/eslint-plugin-license-header/pull/26) for this, which hopefully will eventually be included, in some form.

If you run into some issue with this plugin, it is very possible that the above
plugins are better battle-tested.

# Compatibility

Currently this is written to support eslint@9.
As well, the node versions supported (see package.json#engines) are selected
to match that for eslint@9.

<sub>(I'm open to supporting earlier node versions and earlier eslint versions.)</sub>

# Usage

1. Install it.

    ```
    npm install --save-dev eslint-plugin-yet-another-license-header
    ```

2. Add it to your [ESLint config file](https://eslint.org/docs/latest/use/configure/configuration-files), e.g. "eslint.config.mjs":

    ```js
    import {defineConfig} from 'eslint/config';
    import headerPlugin from 'eslint-plugin-yet-another-license-header';

    export default defineConfig([
        {
            plugins: {
                'yet-another-license-header': headerPlugin,
            },
            rules: {
                'yet-another-license-header/header': [
                    'error',
                    {
                        header: `
    /*
     * Copyright Trent Mick
     * SPDX-License-Identifier: Apache-2.0
     */
    `,
                        // Or use `headerFile` to point to the header content.
                        //      headerFile: './etc/header.txt',

                        // Optionally provide patterns.
                        allowedHeaderPatterns: [
                            // Allow additional copyrights after "Trent Mick".
                            /^\/\*\n \* Copyright Trent Mick(, .+)*\n \* SPDX-License-Identifier: Apache-2.0\n \*\/$/,
                        ],
                    },
                ],
                // ...
            },
        },
    ]);
    ```

3. Lint it.

    ```
    npx eslint
    ```

4. Fix it.

    ```
    npx eslint --fix
    ```

# Configuration

TODO: describe the options
