# How to contribute to oak-routing-ctrl

## General Code of Conduct

1. Please see [GOVERNANCE.md](./GOVERNANCE.md) for high-level information.
2. This library is meant to do 1 thing only (and must to it well), so we should
   limit new features beyond the "scaffolding of API endpoint handlers" to the
   minimum possible.
3. There is no direct pushing to `main` branch. Any change must go through a
   Pull Request. This applies to all contributor roles. This includes typo
   updates and other such one-liner fixes.
4. Code Coverage on the default branch (`main`) must always be 100%.
5. Any added feature or bugfix must be proven to work on all 4 runtimes (Deno,
   Cloudflare Workers, Bun, and Node.js)

## Library Publishing

1. Publishing into the
   [JavaScript Registry](https://jsr.io/@dklab/oak-routing-ctrl) may only happen
   via git tags. A GitHub Action has been set up to automate publishing when a
   new tag is created on (or pushed to) remote.
2. <ins>Only</ins> tag official releases on `main` branch. In other words: the
   tagged commit <ins>must</ins> exist on the `main` branch.
3. Our git tags must always have the format `vX.Y.Z`: starting with the letter
   `v` in lowercase, followed by `X.Y.Z` which conforms to the
   [SemVer standard](https://semver.org/) where X = major, Y = minor, and Z =
   patch.
4. Don't forget to update the library version in the `jsr.json` file
   <ins>before</ins> tagging your commit for release, otherwise the release
   won't happen. <ins>Heads up</ins>: the value in `jsr.json` file starts with
   the major version directly (without the letter `v`)
   - In the future, a tool such as
     [semantic-release](https://github.com/semantic-release/semantic-release)
     might be used to automate version bumps.
5. Before publishing an "official release", it's always advisable to publish an
   "alpha release" first. For example, if you're working on the feature "foo",
   for which you branched off from `main` at the most recent git tag `v1.5.1`,
   then tagging your commit `v1.5.1-foo-alpha.1` would be an appropriate choice.
