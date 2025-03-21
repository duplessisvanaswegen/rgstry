# Release Process for rgstry

This document outlines the steps to create a new release.

## 1. Update Version and Changelog

1. Update the version in `package.json`:
   ```bash
   # For example, to release v1.0.1
   npm version 1.0.1 --no-git-tag-version
   ```

2. Update `CHANGELOG.md` with details about the new version.

## 2. Commit Changes

```bash
git add package.json CHANGELOG.md
git commit -m "Release v1.0.1"
```

## 3. Create a Git Tag

```bash
# Create a tag (vX.Y.Z format)
git tag -a v1.0.1 -m "Version 1.0.1"
```

## 4. Push to GitHub

```bash
# Push commits
git push origin main

# Push tags
git push origin v1.0.1
```

## 5. Create GitHub Release

1. Go to the repository on GitHub
2. Click on "Releases" in the right sidebar
3. Click "Create a new release"
4. Select the tag you just pushed
5. Add a title (e.g., "Release v1.0.1")
6. Copy the relevant section from CHANGELOG.md into the description
7. Click "Publish release"

The GitHub Actions workflow will automatically:
- Run tests
- Build the package
- Publish to npm