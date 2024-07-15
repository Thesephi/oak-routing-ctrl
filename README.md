# oak-routing-ctrl

[![JSR](https://jsr.io/badges/@dklab/oak-routing-ctrl)](https://jsr.io/@dklab/oak-routing-ctrl)
[![JSR Score](https://jsr.io/badges/@dklab/oak-routing-ctrl/score)](https://jsr.io/@dklab/oak-routing-ctrl)
[![Built with the Deno Standard Library](https://raw.githubusercontent.com/denoland/deno_std/main/badge.svg)](https://jsr.io/@std)
[![Known Vulnerabilities](https://snyk.io/test/github/thesephi/oak-routing-ctrl/badge.svg)](https://snyk.io/test/github/thesephi/oak-routing-ctrl)
[![codecov](https://codecov.io/github/Thesephi/oak-routing-ctrl/graph/badge.svg?token=BA3M9P6410)](https://codecov.io/github/Thesephi/oak-routing-ctrl)
[![Runtime Tests](https://github.com/Thesephi/oak-routing-ctrl/actions/workflows/runtime-tests.yml/badge.svg)](https://github.com/Thesephi/oak-routing-ctrl/actions/workflows/runtime-tests.yml)

TypeScript Decorators for easy scaffolding API services with the
[Oak](https://jsr.io/@oak/oak) framework (`jsr:@oak/oak`) 🚗 🐿️ 🦕

Works on Node.js, Bun, Cloudflare Workers, and Deno

```ts
@Controller("/api/v1/pokemon")
class MyPokedex {
  @Get("/:id")
  viewEntry(ctx) {
    if (ctx.params.id === "0025") return "Pikachu";
  }
}
```

![Open API Spec example](https://khangdinh.wordpress.com/wp-content/uploads/2024/07/oak-routing-ctrl-oas-example.png)

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

## Heads up

For easy reading, the examples below do not specify any explicit version when
installing library dependencies. But in your production code, it's advisable to
pin every dependency to a specific version.

## Deno runtime

Prerequisite:
[Deno](https://docs.deno.com/runtime/manual/getting_started/installation)

### Example: Retrieving path parameters

```bash
deno add @oak/oak @dklab/oak-routing-ctrl
```

```ts
// main.ts

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
```

```bash
# in another terminal
curl localhost:1993/v1/hello/world # prints: hello, world
```

### Example: Retrieving path parameters and request body

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

@Controller("/v1")
class MyController {
  @Post("/tell/:name")
  @ControllerMethodArgs("param", "body")
  tell(param, body) {
    return `telling ${param.name} that "${body.message}"`;
  }
}

const app = new Application();
useOakServer(app, [MyController]);
await app.listen({ port: 1993 });
```

_

```bash
curl -H"Content-Type: application/json" localhost:1993/v1/tell/alice -d'{"message": "all we need is love"}'
# prints: telling alice that "all we need is love"
```

</details>

### Example: Retrieving request query and path parameters

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

@Controller("/v1")
class MyController {
  @Get("/books/:category")
  @ControllerMethodArgs("query", "param")
  search(query, param) {
    return `searching for books in category "${param.category}" with query "page=${query.page}"`;
  }
}

const app = new Application();
useOakServer(app, [MyController]);
await app.listen({ port: 1993 });
```

_

```bash
curl localhost:1993/v1/books/thriller\?page=2
# prints: searching for books in category "thriller" with query "page=2"
```

</details>

### Example: Accessing underlying context object

<details>
<summary>View Example</summary>

```ts
import { Application } from "@oak/oak/application";
import { Controller, Get, useOakServer } from "@dklab/oak-routing-ctrl";

@Controller()
class MyController {
  @Get("/foo/bar")
  fooBar(ctx) {
    return `request header x-foo has value "${
      ctx.request.headers.get("x-foo")
    }"`;
  }
}

const app = new Application();
useOakServer(app, [MyController]);
await app.listen({ port: 1993 });
```

_

```bash
curl -H"x-foo: lorem" localhost:1993/foo/bar
# prints: request header x-foo has value "lorem"
```

</details>

## Other runtimes

### Node.js

```bash
npm create oak-nodejs-esbuild@latest
```

<details>
<summary>View Example</summary>

```bash
npm i @jsr/oak__oak @jsr/dklab__oak-routing-ctrl

# note that `npx jsr i {package}` also works, but
# installing directly from the `@jsr` scope may result
# in better dependency resolutions
```

_

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

_

```bash
curl http://localhost:1993/v1/hello/world # prints: hello, world
```

</details>

### Cloudflare Workers

```bash
npm create oak-cloudflare-worker@latest
```

Live Demo (uptime <ins>not</ins> guaranteed):
https://oak-routing-ctrl-cloudflare.dklab.workers.dev/swagger

<details>
<summary>View Example</summary>

```bash
npx jsr add @oak/oak @dklab/oak-routing-ctrl
```

_

```ts
import { Application } from "@oak/oak/application";
import {
  Controller,
  ControllerMethodArgs,
  Get,
  useOakServer,
} from "@dklab/oak-routing-ctrl/mod";

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

_

```bash
curl http://{your-cloudflare-worker-domain}/hello/world # prints: hello, world
```

</details>

### Bun

```bash
npm create oak-bun@latest
```

<details>
<summary>View Example</summary>

```bash
bunx jsr i @oak/oak @dklab/oak-routing-ctrl
```

_

```ts
import { Application, type RouterContext } from "@oak/oak";
import { Controller, Get, useOakServer } from "@dklab/oak-routing-ctrl";

@Controller("/v1")
class MyController {
  @Get("/hello/:name")
  hello(ctx: RouterContext<"/hello/:name">) {
    return `hello, ${ctx.params.name}`;
  }
}

const app = new Application();
useOakServer(app, [MyController]);
await app.listen({ port: 1993 });
```

_

```bash
curl http://localhost:1993/v1/hello/world # prints: hello, world
```

</details>

## Serving Open API Spec

Serving Open API Spec (both as a JSON doc and as an HTML view) is supported as
followed:

```ts
import { Application } from "@oak/oak";
import {
  Controller,
  ControllerMethodArgs,
  Get,
  useOakServer,
  useOas,
  z,
  type zInfer,
} from "@dklab/oak-routing-ctrl";

const HelloNamePathParamsSchema = z.object({ name: z.string() });
const OpenApiSpecForHelloName = {
  // using `zod` to express Open API Spec for this route
  // e.g. `request` and `responses`
  request: { params: HelloNamePathParamsSchema },
  responses: {
    "200": {
      description: "Success",
      content: { "text/html": { schema: z.string() } },
    },
  },
};

@Controller("/v1")
class MyController {
  @Get(
    "/hello/:name",
    OpenApiSpecForHelloName, // API spec is entirely optional
  )
  @ControllerMethodArgs("param")
  hello(
    param: zInfer<typeof HelloNamePathParamsSchema>, // or type it however else you like
  ) {
    return `hello, ${param.name}`; // intellisense should just work ™
  }
}

useOakServer(app, [MyController]);
useOas(app, {
  // optionally declare OAS info as per your project needs
  info: {
    version: "0.1.0",
    title: "My awesome API",
    description: "This is an awesome API",
  },
});

await app.listen({ port: 1993 });
```

The following OAS resources are now served:

- UI: http://localhost:1993/swagger
- JSON doc: http://localhost:1993/oas.json

<details>
<summary>View Example OAS json doc</summary>

```bash
curl localhost:1993/oas.json

{
  "openapi": "3.0.0",
  "info": {
    "version": "0.1.0",
    "title": "My awesome API",
    "description": "This is an awesome API"
  },
  "servers": [
    {
      "url": "http://localhost:1993"
    }
  ],
  "components": {
    "schemas": {},
    "parameters": {}
  },
  "paths": {
    "/hello/{name}": {
      "get": {
        "parameters": [
          {
            "schema": {
              "type": "string"
            },
            "required": true,
            "name": "name",
            "in": "path"
          }
        ],
        "responses": {
          "200": {
            "description": "Success",
            "content": {
              "text/plain": {
                "schema": {
                  "type": "string"
                }
              }
            }
          }
        }
      }
    }
  }
}
```

</details>

## Documentation

Documentation is hosted on the Javascript Registry:
https://jsr.io/@dklab/oak-routing-ctrl/doc

## Contributor Resources

### Tests

```bash
deno test -A --coverage=cov_profile
deno coverage cov_profile
```

[![test coverage](https://codecov.io/gh/Thesephi/oak-routing-ctrl/graphs/tree.svg?token=BA3M9P6410)](https://codecov.io/github/Thesephi/oak-routing-ctrl)
