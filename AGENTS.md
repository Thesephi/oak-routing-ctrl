## General instructions

This guideline includes instructions on how to work with the tech stack employed
by this repo. If there's any diversion between this guideline and the public
tech stack documentation, then the public documentation prevails. Here are the
URLs to the public doc:

- Deno CLI: https://docs.deno.com/runtime/reference/cli/
- oak server framework: https://jsr.io/@oak/oak/doc
- asdf tool version management: https://asdf-vm.com/guide/getting-started.html

## Setup commands

- to install the latest deno runtime & cli version: `asdf install deno latest`
- to enforce a specific deno version for this project: change the value in the
  file `.tool-versions` (as per asdf spec)
- to check for outdated dependencies: `deno outdated`
- to install latest dependencies: `deno update --latest`

## Code style

The IDE should have `deno fmt` configured as an on-file-saved auto-formatter.
Otherwise, make sure to always run `deno fmt` before commiting.

## Changelog

This project employs a CHANGELOG following 'keepachangelog.com' convention.
Dependency upgrades are recorded in the CHANGELOG under the 'Changed' section
(for every release note).

## Testing

Deno tasks available to run different types of tests:

- documentation syntax test: `deno task check-doc`
- unit test: `deno task test`
- end-to-end test: `deno task e2e-test`

## Library Publishing

This project is already set up with a CI/CD pipeline (GitHub Action) supporting
library publishing.

Follow the order below to publish a new `oak-routing-ctrl` library version:

- Ensure that all tests must pass (unit tests, end-to-end tests)
- Verify that you're on the release branch following the format `release/x.x.x`
  with `x.x.x` being the release version (semver standard)
  - the release version must match the most recent value found in `CHANGELOG.md`
  - if unsure which release version to use, you must ask the user
  - if the release branch is not yet created, create & switch to it
- Commit current code & create a release PR on GitHub
  - the release commit always has this format:
    `vx.x.x - see CHANGELOG for details`
- Once the PR is approved & merged to `master`, switch to `master`
- Run `deno publish --dry-run` to ensure everything is appropriate, e.g. the
  value of the field `version` in `deno.jsonc` and the git tag, and the
  corresponding release note in CHANGELOG.md, all must be consistent with one
  another
- Create a new git tag on `master` branch following the format `vx.x.x`. This
  will trigger the library publishing GitHub workflow
