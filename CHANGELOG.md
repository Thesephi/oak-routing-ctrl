## [0.8.7] - 2024-07-15

### Changed

- `@Controller` decorator doesn't require 2nd parameter `context` so it plays
  along better with `experimentalDecorators` mode (even this library doesn't
  support it officially)
- improved README

## [0.8.6] - 2024-07-14

### Added

- `z.infer` re-exported as type `zInfer`

## [0.8.5] - 2024-07-14

### Changed

- library publish command (the 2nd JSR provenance fix attempt)

## [0.8.4] - 2024-07-13

### Added

- more non-type symbols re-exported from `z`

### Fixed

- JSR provenance fix attempt (remedying previous Github Action failure)

## [0.8.3] - 2024-07-13

### Changed

- limited exported symbols from `SubsetOfZ` to an opinionated list of most
  widely used ones

## [0.8.2] - 2024-07-11

### Changed

- `z` "slow types" workaround attempt: `SubsetOfZ`

## [0.8.1] - 2024-07-11

### Added

- `useOas` method is now documented

### Changed

- `z` "slow types" workaround attempt

## [0.8.0] - 2024-07-11

### Added

- decorators for 2 more methods: `@Head` and `@Options`
- support for Swagger documentation serving (powered by
  `@asteasolutions/zod-to-openapi`)

### Changed

- upgraded dependencies: `@std/assert@1.0.0`, `@std/testing@0.225.3`,
  `@std/io@0.224.3`

### Fixed

- typos in previous sections of this CHANGELOG

## [0.7.4] - 2024-06-20

### Added

- `CONTRIBUTING.md` and `GOVERNANCE.md`

### Changed

- `README.md` headline formatting should conform to best practices

## [0.7.3] - 2024-06-17

### Added

- more symbols exported directly for better compatibilities with Cloudflare
  Workers projects (esp. in IDE environments such as Visual Studio Code)

### Fixed

- better support for JavaScript Registry documentation navigation indentation
  behaviors

## [0.7.2] - 2024-06-17

### Changed

- typo fix in README Markdown
- added test coverage chart to README
- attempted better format for JSR library main page

## [0.7.1] - 2024-06-17

### Added

- organized example usages in README

## [0.7.0] - 2024-06-16

### Changed

- upgraded dependencies: `@oak/oak@16.1.0`, `@oak/std@0.225.2`,
  `@std/assert@^0.226.0`
- removed unnecessarily exported code from `dep.ts`

### Added

- examples for other runtimes (`Node.js`, `bun`)

## [0.6.1] - 2024-06-10

### Changed

- avoiding "slow types" in exported JSR lib

## [0.6.0] - 2024-06-10

### Added

- compatibilities with Cloudflare Workers

### Changed

- in `useOakServer` internal request handler logic, `next()` is also called at
  the end

## [0.5.1] - 2024-06-08

### Added

- unit tests
- README updates
- upgraded dependencies (`@std/testing@^0.225.1`)
- Codecov integration

## [0.5.0] - 2024-06-02

### Changed

- renaming exported symbols:
  - `SupportedControllerMethodArgs` => `ControllerMethodArg`
  - `ControllerActionArgs` => `ControllerMethodArgs`

## [0.4.0] - 2024-06-02

### Changed

- consolidated (documented) enums for `@ControllerActionArgs` decorator
  arguments: `param`, `body`, `query`

### Added

- tests for `useOakServer`

### Fixed

- respect response body if it's assigned to `ctx.response.body` inside the
  handler function just as when it's returned by the handler function itself

## [0.3.0] - 2024-05-26

### Changed

- upgraded dependencies (`@oak/oak@16.0.0`, `@std/path@^0.225.1`,
  `@std/assert@^0.225.3`, `@std/testing@^0.224.0`)

## [0.2.0] - 2024-03-05

### Changed

- upgraded dependency to `@oak/oak@14.2.0`

## [0.1.2] - 2024-03-04

### Added

- decorator `@Patch` to use on controller method handling HTTP Patch requests

### Fixed

- calls without a request payload should no longer result in 400 'Unable to
  parse request body' error
- internal TypeScript update chores

## [0.1.1] - 2024-03-03

### Added

- initial release
