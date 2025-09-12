# How to release

For example, assuming version `1.2.3`:

1. Ensure CHANGELOG.md has a good entry for the release.
2. Bump the release in "package.json".
3. Run `npm install` to sync "package-lock.json".
4. Push all desired changes to "main".
5. Tag and push, e.g.:
    ```bash
    git tag v1.2.3
    git push origin v1.2.3
    ```
