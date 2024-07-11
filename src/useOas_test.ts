import {
  assertEquals,
  assertSnapshot,
  assertSpyCall,
  assertSpyCalls,
  type Middleware,
  oakTesting,
  spy,
  stub,
} from "../dev_deps.ts";
import { OpenApiGeneratorV3, z } from "../deps.ts";
import { oasStore, updateOas } from "./oasStore.ts";
import { _internal, useOas } from "./useOas.ts";
import { mockRequestInternals } from "../test_utils/mockRequestInternals.ts";

const { createMockApp, createMockContext } = oakTesting;

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

  const uiPath = "/my/swagger";
  const uiTemplate = "<html>mock</html>";
  const jsonPath = "/my/swagger/json";
  const oasConfig = {
    uiPath,
    uiTemplate,
    jsonPath,
    openapi: "3.0.3",
    info: {
      version: "0.1.0",
      title: "mock API",
      description: "this is a mock API",
    },
    servers: [{ url: "/mock/" }],
  };
  let apiDoc;

  await t.step(async function testApiDocSnapshot(t) {
    const mockCtx = createMockContext();
    useOas(mockCtx.app, oasConfig);
    const generator = new OpenApiGeneratorV3(_internal.registry.definitions);
    const {
      jsonPath: _jsonPath,
      uiPath: _uiPath,
      uiTemplate: _uiTemplate,
      ...oasCfg
    } = oasConfig;
    apiDoc = generator.generateDocument(oasCfg);
    await assertSnapshot(t, apiDoc);
  });

  const cases: { mockRequestPath: string; expectedResponseBody: unknown }[] = [{
    mockRequestPath: uiPath,
    expectedResponseBody: uiTemplate,
  }, {
    mockRequestPath: jsonPath,
    expectedResponseBody: apiDoc,
  }];

  await Promise.all(
    cases.map(({ mockRequestPath, expectedResponseBody }) =>
      t.step({
        name: `request oasMiddleware at ${mockRequestPath}`,
        fn: async () => {
          const mockCtx = createMockContext();
          mockRequestInternals(mockCtx.request, { mockRequestPath });
          const mockNxt = spy(() => Promise.resolve());
          const spyAppUse = spy(mockCtx.app, "use");

          useOas(mockCtx.app, oasConfig);

          const oasMiddleware = spyAppUse.calls[0].args[0] as Middleware;
          await oasMiddleware(mockCtx, mockNxt);

          assertSpyCalls(mockNxt, 1);
          assertEquals(mockCtx.response.body, expectedResponseBody);
        },
        sanitizeOps: false,
        sanitizeResources: false,
        sanitizeExit: false,
      })
    ),
  );
});
