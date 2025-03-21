# Setting up NPM_TOKEN for GitHub Actions

To enable automatic publishing to npm via GitHub Actions, you need to set up an npm access token as a GitHub repository secret. Follow these steps:

## 1. Generate an npm Access Token

1. Log in to your npm account at https://www.npmjs.com/
2. Click on your profile picture → Access Tokens
3. Click "Generate New Token"
4. Select "Automation" token type
5. Copy the generated token (it will only be shown once)

## 2. Add the Token to GitHub Secrets

1. Go to your GitHub repository
2. Click on "Settings" → "Secrets and variables" → "Actions"
3. Click "New repository secret"
4. Name: `NPM_TOKEN`
5. Value: Paste the npm token you generated
6. Click "Add secret"

## 3. Verify Workflow Permissions

1. In your GitHub repository, go to "Settings" → "Actions" → "General"
2. Under "Workflow permissions", select "Read and write permissions"
3. Save changes

## 4. Create a Release

Now when you create a release in GitHub, the workflow will automatically publish the package to npm using the configured token.