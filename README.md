# Get commit semver

An action can get semver infomation from latest commit's message.



### Outputs

```yaml
  valid:
    description: "{boolean} is raw value a valid semver"
  raw: 
    description: "{string} raw value"
  major:
    description: "{number|null} major"
  minor:
    description: "{number|null} minor"
  patch:
    description: "{number|null} patch"
  is_prerelease:
    description: "{boolean|null} is prerelease"
  prerelease_name:
    description: "{string|null} prerelease name, like beta in v1.2.3-beta.4"
  prerelease_number:
    description: "{number|null} prerelease number, like 4 in v1.2.3-beta.4"
  build_number:
    description: "{number|null} build number, like 55555 in v1.2.3+55555"
  version:
    description: "{string|null} version, like 1.2.3-beta.1 in v1.2.3-beta.1 or 1.2.3 in v1.2.3+4444"
````

### Example
For every `push` on `main` branch, check the commit message,
if it's a semver like message, then create a new tag and push to
`main` branch, and create a new GitHub release.

```yaml

name: CI

on:
  push:
    branches:
      - main

jobs:
  build:
    name: CI
    runs-on: ubuntu-latest

    strategy:
      matrix:
        node-version: [16.x]

    steps:
      - name: Checkout code
        uses: actions/checkout@master

      - run: |
          git fetch --prune --unshallow

      - name: Echo Infomation
        run: |
          echo "event name: ${{github.event_name}}"
          echo "event action: ${{github.event.action}}"
          echo "event number: ${{github.event.number}}"
    
      - name: Get semver
        id: semver
        uses: heineiuo/get-commit-semver@main
    
      - name: Create tag
        uses: rickstaa/action-create-tag@v1
        if: |
          github.event_name == 'push' && steps.semver.outputs.valid == 'true'
        with:
          tag: ${{ steps.semver.outputs.raw }}

      - name: Create Changelogs
        if: |
          github.event_name == 'push' && steps.semver.outputs.valid == 'true'
        id: changelog
        uses: heineiuo/create-changelogs@master

      - name: Create Release
        if: |
          github.event_name == 'push' && steps.semver.outputs.valid == 'true'
        id: create_release
        uses: actions/create-release@latest
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        with:
          tag_name: ${{ steps.semver.outputs.raw }}
          release_name: ${{ steps.semver.outputs.raw }}
          body: ${{ steps.changelog.outputs.changelog_text }}
          draft: false
          prerelease: ${{ steps.changelog.outputs.release_type == 'prerelease' }}

```
