# GitHub Actions Workflows

This document explains the GitHub Actions workflows set up for this repository.

## CI Workflow

The CI workflow runs on all pull requests and pushes to the main branch:
- Runs on Node.js 18.x and 20.x
- Runs linting and tests
- Verifies the build process

## Publishing Workflow

The package is automatically published to npm when a new GitHub release is created:

1. Create a new release with a tag (e.g., v1.0.1) via GitHub's release interface
2. The workflow will automatically publish to npm

### Setup Requirements

Before the publishing workflow can work:

1. Generate an npm access token with publish rights
2. Add it as a secret in the GitHub repository settings named `NPM_TOKEN`