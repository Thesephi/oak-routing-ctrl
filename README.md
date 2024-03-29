# oak-routing-ctrl

[![Built with the Deno Standard Library](https://raw.githubusercontent.com/denoland/deno_std/main/badge.svg)](https://jsr.io/@std)

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

## Installation

Prerequisite:
[Deno](https://docs.deno.com/runtime/manual/getting_started/installation)

```bash
deno add @dklab/oak-routing-ctrl
```

## Example Usage

```ts
// main.ts

import { Application } from "jsr:@oak/oak";
import { useOakServer } from "jsr:@dklab/oak-routing-ctrl";
import { MyController } from "./MyController.ts";

const app = new Application();
useOakServer(app, [MyController]);
await app.listen({ port: 1993 });
```

```ts
// MyController.ts

import {
  Controller,
  ControllerActionArgs,
  Post,
} from "jsr:@dklab/oak-routing-ctrl";

@Controller()
export class MyController {
  @Post("/tell/:whom")
  @ControllerActionArgs("body")
  say(body, ctx) {
    const { note } = body;
    console.log(`telling ${ctx.params.whom} that "${note}"`);
  }
}
```

```bash
deno run -A main.ts
curl localhost:1993/tell/Alice -d'{"note": "Bob is waiting"}'
```
