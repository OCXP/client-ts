# GitHub Actions Setup for OCXP Client

This directory contains GitHub Actions workflows for automated publishing and releases.

## Workflows

### 1. `publish.yml` - Automatic npm Publishing
Publishes the package to npm whenever a version tag is pushed.

**Triggers on:** Tags matching `v*` (e.g., v0.2.7, v1.0.0)

### 2. `release.yml` - GitHub Release Creation
Creates a GitHub release with changelog whenever a version tag is pushed.

**Triggers on:** Tags matching `v*`

## Setup Instructions

### Step 1: Create npm Automation Token

1. Go to [npmjs.com](https://www.npmjs.com/) and log in
2. Click your profile picture → **Access Tokens**
3. Click **Generate New Token** → **Automation**
4. Name it something like "GitHub Actions - OCXP Client"
5. Copy the token (starts with `npm_`)

### Step 2: Add Token to GitHub Secrets

1. Go to your GitHub repository
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Name: `NPM_TOKEN`
5. Value: Paste your npm token
6. Click **Add secret**

### Step 3: Verify Setup

The workflows are now ready! To test:

```bash
# Make sure you're on main branch with all changes committed
git checkout main
git pull

# Create and push a version tag
npm version patch -m "chore: release %s"
git push && git push --tags
```

## How It Works

1. **Local Development:**
   - Make your changes
   - Commit and push to main
   - Run `npm version patch/minor/major` to bump version
   - Push the tag: `git push --tags`

2. **GitHub Actions:**
   - Detects the new version tag
   - Runs tests and builds the package
   - Publishes to npm automatically
   - Creates a GitHub release

## Version Commands

```bash
# Patch version (0.2.7 → 0.2.8) - bug fixes
npm version patch -m "chore: release %s"

# Minor version (0.2.7 → 0.3.0) - new features
npm version minor -m "chore: release %s"

# Major version (0.2.7 → 1.0.0) - breaking changes
npm version major -m "chore: release %s"

# Push changes and tags
git push && git push --tags
```

## Troubleshooting

- **npm publish fails:** Check that NPM_TOKEN secret is set correctly
- **Workflow doesn't trigger:** Ensure tag starts with 'v' (e.g., v0.2.7)
- **Permission denied:** Check repository settings allow GitHub Actions

## Manual Publishing

If automation fails, you can still publish manually:

```bash
npm publish --otp=YOUR_OTP_CODE
```