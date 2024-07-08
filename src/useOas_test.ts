import {
  assertEquals,
  assertSnapshot,
  createMockApp,
  stub,
} from "../dev_deps.ts";
import { OpenApiGeneratorV3, z } from "../deps.ts";
import { updateOas } from "./oasStore.ts";
import { _internal, useOas } from "./useOas.ts";

Deno.test("useOas when _useOas throws", () => {
  const mock = stub(_internal, "_useOas", () => {
    throw new Error("nope");
  });
  useOas(createMockApp());
  mock.restore();
});

Deno.test("useOas with empty definitions", () => {
  useOas(createMockApp());
  assertEquals(_internal.registry.definitions, []);
});

Deno.test("useOas standard behavior", async (t) => {
  const fnName = "doSomething";
  const method = "post";
  const path = "/hello/:name";

  updateOas(fnName, method, path, {
    request: {
      params: z.object({ name: z.string() }),
    },
  });

  const oasConfig = {
    uiPath: "/my/swagger",
    jsonPath: "/my/swagger/json",
    uiTemplate: "<html>mock</html>",
    openapi: "3.0.3",
    info: {
      version: "0.1.0",
      title: "mock API",
      description: "this is a mock API",
    },
    servers: [{ url: "/mock/" }],
  };

  useOas(createMockApp(), oasConfig);

  const generator = new OpenApiGeneratorV3(_internal.registry.definitions);
  const apiDoc = generator.generateDocument(oasConfig);

  await assertSnapshot(t, apiDoc);
});
