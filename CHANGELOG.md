# eslint-plugin-yet-another-license-header Changelog

## v1.0.0

- eslint v10 support
- fix: A file whose only content is the license header, i.e. there is no
  program code, was not handled properly.
  https://github.com/trentm/eslint-plugin-yet-another-license-header/issues/13

## v0.2.0

- fix: Trim string entries in `allowedHeaderPatterns` before comparison.

- release process: Switch to "trusted publishing"
  (https://docs.npmjs.com/trusted-publishers), i.e. a trust relation has been
  setup between this package on npm and the release.yml workflow in this repo.

## v0.1.0

- First release. Basically works. (Lacking tests and docs for
  `allowedHeaderPatterns` option.)
