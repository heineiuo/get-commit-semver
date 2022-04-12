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
On every `push`

```yaml
on:
  push:

name: Example

jobs:
  build:
    name: Example
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v2
      
      - run: |
        git fetch --prune --unshallow --tags

      - name: Create changelogs
        id: changelogs
        uses: heineiuo/create-changelogs@master

      - name: Get semver
        id: semver
        uses: heineiuo/get-commit-semver@main

      - name: Create Release
        id: create_release
        uses: actions/create-release@latest
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        with:
          tag_name: ${{ github.ref }}
          release_name: ${{ github.ref }}
          body: ${{ steps.changelogs.outputs.changelogs }}
          draft: false
          prerelease: ${{ steps.semver.outputs.is_prerelease }}


```
