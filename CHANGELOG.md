## [0.3.0] - 2024-05-26

### Changed

- upgraded dependencies (`@oak/oak@16.0.0`, `@std/path@^0.225.1`,
  `@std/assert@^0.225.3`, `@std/testing@^0.224.0`)

## [0.2.0] - 2024-03-05

### Changed

- upgraded dependency to `@oak/oak@14.2.0`

## [0.1.2] - 2024-03-04

### Added

- Decorator `@Patch` to use on controller method handling HTTP Patch requests

### Fixed

- calls without a request payload should no longer result in 400 'Unable to
  parse request body' error
- internal TypeScript update chores

## [0.1.1] - 2024-03-03

### Added

- initial release
