# oak-routing-ctrl

[![JSR](https://jsr.io/badges/@dklab/oak-routing-ctrl)](https://jsr.io/@dklab/oak-routing-ctrl)
[![JSR Score](https://jsr.io/badges/@dklab/oak-routing-ctrl/score)](https://jsr.io/@dklab/oak-routing-ctrl)
[![Built with the Deno Standard Library](https://raw.githubusercontent.com/denoland/deno_std/main/badge.svg)](https://jsr.io/@std)
[![Known Vulnerabilities](https://snyk.io/test/github/thesephi/oak-routing-ctrl/badge.svg)](https://snyk.io/test/github/thesephi/oak-routing-ctrl)
[![codecov](https://codecov.io/github/Thesephi/oak-routing-ctrl/graph/badge.svg?token=BA3M9P6410)](https://codecov.io/github/Thesephi/oak-routing-ctrl)

routing-controllers -like library for the [Oak](https://jsr.io/@oak/oak)
framework (`jsr:@oak/oak`) 🚗 🐿️ 🦕

```ts
@Controller("/api/v1/pokemon")
class MyPokedex {
  @Get("/:id")
  viewEntry(ctx) {
    if (ctx.params.id === "0025") return "Pikachu";
  }
}
```

## Forewords

If you're familiar with the
[npm library routing-controllers](https://www.npmjs.com/package/routing-controllers),
you'll find yourself very much at home.

However, please note that this libray is **not** meant to be a drop-in
replacement for routing-controllers, as it attempts to conform to
[TC39 Decorators proposal](https://github.com/tc39/proposal-decorators) which
[doesn't support Method Parameter Decorator](https://github.com/tc39/proposal-decorators?tab=readme-ov-file#comparison-with-typescript-experimental-decorators)
yet. There's currently no plan to support TypeScript "experimental" decorators,
but if you feel strongly for it, please feel free to fork this repo!

## Example Usages

### Heads up

For easy reading, the examples below do not specify any explicit version when
installing library dependencies. But in your production code, it's advisable to
pin every dependency to a specific version.

### Deno runtime

Prerequisite:
[Deno](https://docs.deno.com/runtime/manual/getting_started/installation)

#### Example: Retrieving path parameters

```bash
deno add @oak/oak @dklab/oak-routing-ctrl
```

```ts
import { Application } from "@oak/oak/application";
import {
  Controller,
  ControllerMethodArgs,
  Get,
  useOakServer,
} from "@dklab/oak-routing-ctrl";

const app = new Application();

@Controller("/v1")
class MyController {
  @Get("/hello/:name")
  @ControllerMethodArgs("param")
  hello(param) {
    return `hello, ${param.name}`;
  }
}

useOakServer(app, [MyController]);

await app.listen({ port: 1993 });
```

```bash
deno run --allow-env --allow-net main.ts

# in another terminal
curl localhost:1993/v1/hello/world # prints: hello, world
```

##### Other examples

##### Retrieving path parameters and request body

<details>
<summary>View Example</summary>

```ts
import { Application } from "@oak/oak/application";
import {
  Controller,
  ControllerMethodArgs,
  Post,
  useOakServer,
} from "@dklab/oak-routing-ctrl";
const app = new Application();

@Controller("/v1")
class MyController {
  @Post("/tell/:name")
  @ControllerMethodArgs("param", "body")
  tell(param, body) {
    return `telling ${param.name} that "${body.message}"`;
  }
}

useOakServer(app, [MyController]);

await app.listen({ port: 1993 });
```

```bash
curl -H"Content-Type: application/json" localhost:1993/v1/tell/alice -d'{"message": "all we need is love"}'
# prints: telling alice that "all we need is love"
```

</details>

##### Retrieving request query and path parameters

<details>
<summary>View Example</summary>

```ts
import { Application } from "@oak/oak/application";
import {
  Controller,
  ControllerMethodArgs,
  Get,
  useOakServer,
} from "@dklab/oak-routing-ctrl";
const app = new Application();

@Controller("/v1")
class MyController {
  @Get("/books/:category")
  @ControllerMethodArgs("query", "param")
  search(query, param) {
    return `searching for books in category "${param.category}" with query "page=${query.page}"`;
  }
}

useOakServer(app, [MyController]);

await app.listen({ port: 1993 });
```

```bash
curl localhost:1993/v1/books/thriller\?page=2
# prints: searching for books in category "thriller" with query "page=2"
```

</details>

##### Accessing underlying context object

<details>
<summary>View Example</summary>

```ts
import { Application } from "@oak/oak/application";
import { Controller, Get, useOakServer } from "@dklab/oak-routing-ctrl";
const app = new Application();

@Controller()
class MyController {
  @Get("/foo/bar")
  fooBar(ctx) {
    return `request header x-foo has value "${
      ctx.request.headers.get("x-foo")
    }"`;
  }
}

useOakServer(app, [MyController]);

await app.listen({ port: 1993 });
```

```bash
curl -H"x-foo: lorem" localhost:1993/foo/bar
# prints: request header x-foo has value "lorem"
```

</details>

### Other runtimes

#### Node.js

<details>
<summary>View Example</summary>

```bash
npm i @jsr/oak__oak @jsr/dklab__oak-routing-ctrl

# note that `npx jsr i {package}` also works, but
# installing directly from the `@jsr` scope may result
# in better dependency resolutions
```

```ts
// alternatively imported from "@oak/oak/application"
import { Application } from "@jsr/oak__oak/application";

// alternatively imported from "@dklab/oak-routing-ctrl"
import {
  Controller,
  ControllerMethodArgs,
  Get,
  useOakServer,
} from "@jsr/dklab__oak-routing-ctrl";

@Controller("/v1")
export class MyController {
  @Get("/hello/:name")
  @ControllerMethodArgs("param")
  hello(param: Record<string, string>) {
    return `hello, ${param.name}`;
  }
}

const app = new Application();

useOakServer(app, [MyController]);
await app.listen({ port: 1993 });
```

```bash
curl http://localhost:1993/hello/world # prints: hello, world
```

</details>

#### Cloudflare Workers

<details>
<summary>View Example</summary>

```bash
npx jsr add @oak/oak @dklab/oak-routing-ctrl
```

```ts
import { Application } from "@oak/oak/application";
import {
  Controller,
  ControllerMethodArgs,
  Get,
  useOakServer,
} from "@dklab/oak-routing-ctrl";

@Controller()
class MyCloudflareWorkerController {
  @Get("/hello/:name")
  @ControllerMethodArgs("param")
  hello(param: { name: string }) {
    return `hello, ${param.name}`;
  }
}

const app = new Application();

useOakServer(app, [MyCloudflareWorkerController]);

export default { fetch: app.fetch };
```

```bash
curl http://{your-cloudflare-worker-domain}/hello/world # prints: hello, world
```

</details>

#### Bun

<details>
<summary>View Example</summary>

```bash
bunx jsr i @oak/oak @dklab/oak-routing-ctrl
```

```ts
import { Application } from "@oak/oak/application";

import {
  Controller,
  ControllerMethodArgs,
  Get,
  useOakServer,
} from "@dklab/oak-routing-ctrl";

@Controller("/v1")
class MyController {
  @Get("/hello/:name")
  hello(ctx) {
    return `hello, ${ctx.params.name}`;
  }
}

const app = new Application();
useOakServer(app, [MyController]);
await app.listen({ port: 1993 });
```

```bash
curl http://localhost:1993/hello/world # prints: hello, world
```

</details>

## Developer Resources

### Tests

```bash
deno test -A --coverage=cov_profile
deno coverage cov_profile
```
