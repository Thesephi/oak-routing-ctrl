## [0.15.1] - 2025-05-20

### Changed

- upgraded dependencies: `jsr:@std/testing@^1.0.12`, `npm:zod@^3.25.7`

## [0.15.0] - 2025-05-08

### Changed

- Open API specs config object is fully spread into the final output

## [0.14.3] - 2025-04-27

upgraded dependencies: `jsr:@std/assert@^1.0.13`, `jsr:@std/path@^1.0.9`,
`jsr:@std/testing@^1.0.11`, `npm:zod@^3.24.3`

## [0.14.2] - 2025-03-03

### Fixed

- posix style is enforced when assigning paths in `@Controller` (so it still
  works when running on Windows platform)

## [0.14.1] - 2025-02-23

### Changed

- upgraded dependencies: `npm:zod@^3.24.2`

## [0.14.0] - 2025-02-04

## Changed

- multiple paths can now be registered on the same HTTP verb, and if the paths
  are exactly the same, or if the "static" and the "parameter" portions of the
  paths somehow overlap, then the handler is invoked **once for each registered
  path**; for example if we register `@Get("/foo/:bar")` and `@Get("/foo/bar")`
  (in that order) on the same handler function, then for every request to
  `/foo/bar`, that handler is invoked **twice**, the first time having no
  "param" at all, and the 2nd time having the param `bar` with the value
  `"bar"`. This behavior follows TC39 decorator specs where all decorators to a
  function are applied "from inside out" aka: the last declared decorator gets
  applied first, and so on

## Added

- `ctx.state._oakRoutingCtrl_regPath` is available as a pointer to the
  registered path that matches the URL request currently being handled; this is
  helpful in rare situations where multiple overlapping paths are registered on
  the same handler function, causing it to be invoked multiple times, and so we
  may benefit from a mechanism to control when to write to the response body (as
  this operation can only be done once)

## [0.13.0] - 2025-02-01

### Added

- Laxer usage of `ControllerMethodArgs` decorator: now allowing `queries`,
  `params`, `header` as literal arguments, so that things still work even if
  users accidentally / deliberately use the undocumented singular / plural forms
- Support for Open API Spec v3.1
- Support for `operationId` and `tags` in OAS path request declarations
- Support for top-level `tags` in OAS document

### Changed

- switched from `deps.ts` and `dev_deps.ts` to `deno.jsonc`
- revamped documentation (JSDoc)
- code format & code format settings for VS Code users
- upgraded dependencies (`zod@^3.24.1`, `@std/assert@^1.0.10`,
  `@std/testing@^1.0.8`)
- updated typing for `OakOpenApiSpec` (added prop: `request`, untyped unproven
  prop: `requestBody`)
- upgraded dependencies: `jsr:@oak/oak@^17.1.4`, `jsr:@std/assert@^1.0.11`,
  `jsr:@std/io@^0.225.2`, `jsr:@std/testing@^1.0.9`

## Removed

- the file `jsr.json` is removed in favour of the file `deno.jsonc`

## [0.12.2] - 2024-12-06

### Added

- `OakOpenApiSpec` and `useOak` are explicitly exported for consumption

### Changed

- README content update

### Fixed

- underscore character is now supported in OAS path param name

## [0.12.1] - 2024-11-05

### Changed

- laxed parsing rule for requests with header 'content-type: application/json'
  now covers all 3 methods: GET, DELETE, and HEAD
- doc updated in README

## [0.12.0] - 2024-11-05

### Changed

- lax parsing rule for GET requests with header 'content-type: application/json'
- upgraded dependencies (`@std/path@^1.0.8`, `@std/testing@^1.0.4`,
  `@std/assert@^1.0.7`, `@oak/oak@^17.1.3`,
  `@asteasolutions/zod-to-openapi@^7.2.0`, `@std/io@^0.225.0`)
- code format

## [0.11.0] - 2024-09-11

### Changed

- if a handler function throws because of a `Zod` validation error (ie. from
  `ZodSchema.parse()`), the response will automatically have status `400` and
  the whole `ZodError` as the response text

## [0.10.0] - 2024-09-08

### Added

- support for `headers` in `ControllerMethodArg` as a shortcut to parse &
  retrieve request headers

### Changed

- upgraded dependencies (`@oak/oak@17.0.0`, `@std/path@1.0.4`
  `@std/assert@1.0.4`, `@std/testing@1.0.2`, `@std/io@0.224.7`)

- minor TypeScript syntax updates to better support Deno 2

## [0.9.0] - 2024-07-16

### Changed

- `this` is retained when invoking controller methods
- `./test_utils` excluded from dist package

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
