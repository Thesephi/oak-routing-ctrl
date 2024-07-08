import {
  assertEquals,
  assertSnapshot,
  assertSpyCall,
  createMockApp,
  stub,
} from "../dev_deps.ts";
import { OpenApiGeneratorV3, z } from "../deps.ts";
import { oasStore, updateOas } from "./oasStore.ts";
import { _internal, useOas } from "./useOas.ts";

Deno.test("useOas with a non-conforming Application instance", () => {
  const defEnvGet = Deno.env.get;
  const stubGetEnv = stub(Deno.env, "get", (key) => {
    if (key === "DEBUG") return "true";
    return defEnvGet(key);
  });
  const stubConsoleDebug = stub(console, "debug", () => {});

  // deno-lint-ignore no-explicit-any
  useOas(null as any, true as any);

  assertSpyCall(stubConsoleDebug, 0, {
    args: [
      "OpenApiSpec",
      "{\n" +
      '  openapi: "3.0.0",\n' +
      '  info: { version: "1.0.0", title: "My API", description: "This is the API" },\n' +
      '  servers: [ { url: "/" } ],\n' +
      "  components: { schemas: {}, parameters: {} },\n" +
      "  paths: {}\n" +
      "}",
    ],
  });

  assertSpyCall(stubConsoleDebug, 1, {
    args: [
      "unable to complete OpenApiSpec initialization:",
      "Cannot read properties of null (reading 'use')",
    ],
  });

  stubConsoleDebug.restore();
  stubGetEnv.restore();
});

Deno.test("useOas with a non-conforming entry in oasStore", () => {
  const defEnvGet = Deno.env.get;
  const stubGetEnv = stub(Deno.env, "get", (key) => {
    if (key === "DEBUG") return "true";
    return defEnvGet(key);
  });
  const stubConsoleDebug = stub(console, "debug", () => {});

  // deno-lint-ignore no-explicit-any
  oasStore.set("doSomething|get|/hello/:name", { foo: "bar" } as any);

  useOas(createMockApp());

  assertSpyCall(stubConsoleDebug, 0, {
    args: [
      "WARNING: OAS RouteConfig for 'doSomething|get|/hello/:name' lacks either 'path', 'method', or 'responses'",
    ],
  });

  stubConsoleDebug.restore();
  stubGetEnv.restore();
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
