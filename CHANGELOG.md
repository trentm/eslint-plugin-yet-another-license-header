# eslint-plugin-yet-another-license-header Changelog

## v0.2.0

- fix: Trim string entries in `allowedHeaderPatterns` before comparison.

- release process: Switch to "trusted publishing"
  (https://docs.npmjs.com/trusted-publishers), i.e. a trust relation has been
  setup between this package on npm and the release.yml workflow in this repo.

## v0.1.0

- First release. Basically works. (Lacking tests and docs for
  `allowedHeaderPatterns` option.)
