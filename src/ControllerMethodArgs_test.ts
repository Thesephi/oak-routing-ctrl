import {
  assertEquals,
  assertSpyCalls,
  assertStringIncludes,
  assertThrows,
  Body,
  type BodyType,
  Buffer,
  oakTesting,
  spy,
} from "../dev_deps.ts";
import { ERR_UNSUPPORTED_CLASS_METHOD_DECORATOR_RUNTIME_BEHAVIOR } from "./Constants.ts";
import {
  _internal,
  type ControllerMethodArg,
  ControllerMethodArgs,
} from "./ControllerMethodArgs.ts";

const { createMockContext } = oakTesting;

Deno.test("ControllerMethodArgs Decorator - unsupported strategy - declaring body, param, query", () => {
  assertThrows(
    () =>
      // calling decorator with inputs that don't match any known strategy
      // e.g. in this case both 1st and 2nd arguments receive an object-type value
      ControllerMethodArgs("body", "param", "query")(
        {},
        // deno-lint-ignore no-explicit-any
        {} as any,
      ),
    Error,
    ERR_UNSUPPORTED_CLASS_METHOD_DECORATOR_RUNTIME_BEHAVIOR,
  );
});

Deno.test("ControllerMethodArgs Decorator - unsupported strategy - declaring param, body", () => {
  assertThrows(
    () =>
      // calling decorator with inputs that don't match any known strategy
      // e.g. in this case both 1st and 2nd arguments receive an object-type value
      ControllerMethodArgs("param", "body")(
        {},
        // deno-lint-ignore no-explicit-any
        {} as any,
      ),
    Error,
    ERR_UNSUPPORTED_CLASS_METHOD_DECORATOR_RUNTIME_BEHAVIOR,
  );
});

Deno.test("ControllerMethodArgs Decorator - unsupported strategy - declaring param, query", () => {
  assertThrows(
    () =>
      // calling decorator with inputs that don't match any known strategy
      // e.g. in this case both 1st and 2nd arguments receive an object-type value
      ControllerMethodArgs("param", "query")(
        {},
        // deno-lint-ignore no-explicit-any
        {} as any,
      ),
    Error,
    ERR_UNSUPPORTED_CLASS_METHOD_DECORATOR_RUNTIME_BEHAVIOR,
  );
});

Deno.test("ControllerMethodArgs Decorator - unsupported strategy - declaring body", () => {
  assertThrows(
    () =>
      // calling decorator with inputs that don't match any known strategy
      // e.g. in this case both 1st and 2nd arguments receive an object-type value
      ControllerMethodArgs("body")(
        {},
        // deno-lint-ignore no-explicit-any
        {} as any,
      ),
    Error,
    ERR_UNSUPPORTED_CLASS_METHOD_DECORATOR_RUNTIME_BEHAVIOR,
  );
});

Deno.test("ControllerMethodArgs Decorator - unsupported strategy - declaring nothing", () => {
  assertThrows(
    () =>
      // calling decorator with inputs that don't match any known strategy
      // e.g. in this case both 1st and 2nd arguments receive an object-type value
      ControllerMethodArgs()(
        {},
        // deno-lint-ignore no-explicit-any
        {} as any,
      ),
    Error,
    ERR_UNSUPPORTED_CLASS_METHOD_DECORATOR_RUNTIME_BEHAVIOR,
  );
});

Deno.test("ControllerMethodArgs Decorator - Standard strategy - declaring body, param, query", async () => {
  let enhancedHandler;
  let enhancedHandlerRetVal;
  try {
    enhancedHandler = ControllerMethodArgs("body", "param", "query")(
      function testHandler(_body: unknown, _param: unknown, _query: unknown) {
        // @TODO consider mocking `body`, `param`, and `query` and assert for
        // their parsed values
        return { "i.am": "deep" };
      },
      {
        name: "testHandler",
      } as ClassMethodDecoratorContext,
    );
  } catch (e) {
    throw new Error(`test case should not have thrown ${e.message}`);
  }
  assertEquals(typeof enhancedHandler, "function");

  try {
    const ctx = createMockContext();
    Object.defineProperty(ctx.request, "body", {
      get: () => createMockRequestBody("json"),
    });

    enhancedHandlerRetVal = await enhancedHandler(ctx);
  } catch (e) {
    throw new Error(`test case should not have thrown ${e.message}`);
  }

  assertEquals(enhancedHandlerRetVal, { "i.am": "deep" });
});

Deno.test("ControllerMethodArgs Decorator - Standard strategy - declaring body, param, query, headers", async () => {
  let enhancedHandler;
  let enhancedHandlerRetVal;
  try {
    enhancedHandler = ControllerMethodArgs("body", "param", "query", "headers")(
      function testHandler(
        _body: unknown,
        _param: unknown,
        _query: unknown,
        headers: unknown,
      ) {
        // @TODO consider mocking `body`, `param`, and `query` and assert for
        // their parsed values
        return {
          "i.am.also": "deep",
          "my.headers.include": headers,
        };
      },
      {
        name: "testHandler",
      } as ClassMethodDecoratorContext,
    );
  } catch (e) {
    throw new Error(`test case should not have thrown ${e.message}`);
  }
  assertEquals(typeof enhancedHandler, "function");

  try {
    const ctx = createMockContext();
    Object.defineProperty(ctx.request, "body", {
      get: () => createMockRequestBody("json"),
    });
    Object.defineProperty(ctx.request, "headers", {
      value: new Map([["x-foo", "bar"]]),
    });

    enhancedHandlerRetVal = await enhancedHandler(ctx);
  } catch (e) {
    throw new Error(`test case should not have thrown ${e.message}`);
  }

  assertEquals(enhancedHandlerRetVal, {
    "i.am.also": "deep",
    "my.headers.include": { "x-foo": "bar" },
  });
});

Deno.test("ControllerMethodArgs Decorator - Standard strategy - declaring param, body", async () => {
  let enhancedHandler;
  let enhancedHandlerRetVal;
  try {
    enhancedHandler = ControllerMethodArgs("param", "body")(
      function testHandler(_param: unknown, _body: unknown) {
        // @TODO consider mocking `param` and `body` and assert for
        // their parsed values
        return { "declaring": "param, body" };
      },
      {
        name: "testHandler",
      } as ClassMethodDecoratorContext,
    );
  } catch (e) {
    throw new Error(`test case should not have thrown ${e.message}`);
  }
  assertEquals(typeof enhancedHandler, "function");

  try {
    const ctx = createMockContext();
    Object.defineProperty(ctx.request, "body", {
      get: () => createMockRequestBody("json"),
    });

    enhancedHandlerRetVal = await enhancedHandler(ctx);
  } catch (e) {
    throw new Error(`test case should not have thrown ${e.message}`);
  }

  assertEquals(enhancedHandlerRetVal, { "declaring": "param, body" });
});

Deno.test("ControllerMethodArgs Decorator - Standard strategy - declaring param, query", async () => {
  let enhancedHandler;
  let enhancedHandlerRetVal;
  try {
    enhancedHandler = ControllerMethodArgs("param", "query")(
      function testHandler(_param: unknown, _query: unknown) {
        // @TODO consider mocking `param` and `query` and assert for
        // their parsed values
        return { "declaring": "param, query" };
      },
      {
        name: "testHandler",
      } as ClassMethodDecoratorContext,
    );
  } catch (e) {
    throw new Error(`test case should not have thrown ${e.message}`);
  }
  assertEquals(typeof enhancedHandler, "function");

  try {
    const ctx = createMockContext();
    Object.defineProperty(ctx.request, "body", {
      get: () => createMockRequestBody("json"),
    });

    enhancedHandlerRetVal = await enhancedHandler(ctx);
  } catch (e) {
    throw new Error(`test case should not have thrown ${e.message}`);
  }

  assertEquals(enhancedHandlerRetVal, { "declaring": "param, query" });
});

Deno.test("ControllerMethodArgs Decorator - Standard strategy - declaring body", async () => {
  let enhancedHandler;
  let enhancedHandlerRetVal;
  try {
    enhancedHandler = ControllerMethodArgs("body")(
      function testHandler(_body: unknown) {
        // @TODO consider mocking `body` and assert for
        // its parsed value
        return { "declaring": "body" };
      },
      {
        name: "testHandler",
      } as ClassMethodDecoratorContext,
    );
  } catch (e) {
    throw new Error(`test case should not have thrown ${e.message}`);
  }
  assertEquals(typeof enhancedHandler, "function");

  try {
    const ctx = createMockContext();
    Object.defineProperty(ctx.request, "body", {
      get: () => createMockRequestBody("json"),
    });

    enhancedHandlerRetVal = await enhancedHandler(ctx);
  } catch (e) {
    throw new Error(`test case should not have thrown ${e.message}`);
  }

  assertEquals(enhancedHandlerRetVal, { "declaring": "body" });
});

Deno.test("ControllerMethodArgs Decorator - Standard strategy - declaring nothing", async () => {
  let enhancedHandler;
  let enhancedHandlerRetVal;
  try {
    enhancedHandler = ControllerMethodArgs()(
      function testHandler(_body: unknown) {
        return { "declaring": "nothing" };
      },
      {
        name: "testHandler",
      } as ClassMethodDecoratorContext,
    );
  } catch (e) {
    throw new Error(`test case should not have thrown ${e.message}`);
  }
  assertEquals(typeof enhancedHandler, "function");

  try {
    const ctx = createMockContext();
    Object.defineProperty(ctx.request, "body", {
      get: () => createMockRequestBody("json"),
    });

    enhancedHandlerRetVal = await enhancedHandler(ctx);
  } catch (e) {
    throw new Error(`test case should not have thrown ${e.message}`);
  }

  assertEquals(enhancedHandlerRetVal, { "declaring": "nothing" });
});

Deno.test("ControllerMethodArgs Decorator - CloudflareWorker strategy - faulty runtime behavior", () => {
  assertThrows(
    () =>
      ControllerMethodArgs("body", "param", "query")(
        {},
        "testHandler",
        null, // this is the faulty behavior (non spec-conforming)
      ),
    Error,
    "Cannot read properties of null (reading 'value')",
  );
});

Deno.test("ControllerMethodArgs Decorator - CloudflareWorker strategy - declaring body, param, query", async () => {
  const methodDescriptor = {
    value: function testHandler() {
      return { "i.am": "deep.too" };
    },
    writable: true,
    enumerable: false,
    configurable: true,
  };
  let decoratorRetVal;
  try {
    decoratorRetVal = ControllerMethodArgs("body", "param", "query")(
      {},
      "testHandler",
      methodDescriptor,
    );
  } catch (e) {
    throw new Error(`test case should not have thrown ${e.message}`);
  }
  assertEquals(decoratorRetVal, undefined);

  // by this point, `methodDescriptor.value` has been written with a new value
  // which is the enhanced `testHandler`
  let enhancedHandlerRetVal;
  try {
    // deno-lint-ignore ban-types
    const enhancedHandler: Function = methodDescriptor.value;
    const ctx = createMockContext();
    Object.defineProperty(ctx.request, "body", {
      get: () => createMockRequestBody("json"),
    });
    enhancedHandlerRetVal = await enhancedHandler(ctx);
  } catch (e) {
    throw new Error(`test case should not have thrown ${e.message}`);
  }

  assertEquals(enhancedHandlerRetVal, { "i.am": "deep.too" });
});

Deno.test("ControllerMethodArgs Decorator - CloudflareWorker strategy - declaring body, param, query, headers", async () => {
  const methodDescriptor = {
    value: function testHandler(
      _body: unknown,
      _param: unknown,
      _query: unknown,
      headers: unknown,
    ) {
      return {
        "i.am.also": "deep.ya",
        "my.headers.include": headers
      };
    },
    writable: true,
    enumerable: false,
    configurable: true,
  };
  let decoratorRetVal;
  try {
    decoratorRetVal = ControllerMethodArgs("body", "param", "query", "headers")(
      {},
      "testHandler",
      methodDescriptor,
    );
  } catch (e) {
    throw new Error(`test case should not have thrown ${e.message}`);
  }
  assertEquals(decoratorRetVal, undefined);

  // by this point, `methodDescriptor.value` has been written with a new value
  // which is the enhanced `testHandler`
  let enhancedHandlerRetVal;
  try {
    // deno-lint-ignore ban-types
    const enhancedHandler: Function = methodDescriptor.value;
    const ctx = createMockContext();
    Object.defineProperty(ctx.request, "body", {
      get: () => createMockRequestBody("json"),
    });
    Object.defineProperty(ctx.request, "headers", {
      value: new Map([["x-foo", "bar"]])
    })
    enhancedHandlerRetVal = await enhancedHandler(ctx);
  } catch (e) {
    throw new Error(`test case should not have thrown ${e.message}`);
  }

  assertEquals(enhancedHandlerRetVal, {
    "i.am.also": "deep.ya",
    "my.headers.include": { "x-foo": "bar" },
  });
});

Deno.test("ControllerMethodArgs Decorator - CloudflareWorker strategy - declaring param, body", async () => {
  const methodDescriptor = {
    value: function testHandler() {
      return { "declaring": "param, body" };
    },
    writable: true,
    enumerable: false,
    configurable: true,
  };
  let decoratorRetVal;
  try {
    decoratorRetVal = ControllerMethodArgs("param", "body")(
      {},
      "testHandler",
      methodDescriptor,
    );
  } catch (e) {
    throw new Error(`test case should not have thrown ${e.message}`);
  }
  assertEquals(decoratorRetVal, undefined);

  // by this point, `methodDescriptor.value` has been written with a new value
  // which is the enhanced `testHandler`
  let enhancedHandlerRetVal;
  try {
    // deno-lint-ignore ban-types
    const enhancedHandler: Function = methodDescriptor.value;
    const ctx = createMockContext();
    Object.defineProperty(ctx.request, "body", {
      get: () => createMockRequestBody("json"),
    });
    enhancedHandlerRetVal = await enhancedHandler(ctx);
  } catch (e) {
    throw new Error(`test case should not have thrown ${e.message}`);
  }

  assertEquals(enhancedHandlerRetVal, { "declaring": "param, body" });
});

Deno.test("ControllerMethodArgs Decorator - CloudflareWorker strategy - declaring param, query", async () => {
  const methodDescriptor = {
    value: function testHandler() {
      return { "declaring": "param, query" };
    },
    writable: true,
    enumerable: false,
    configurable: true,
  };
  let decoratorRetVal;
  try {
    decoratorRetVal = ControllerMethodArgs("param", "query")(
      {},
      "testHandler",
      methodDescriptor,
    );
  } catch (e) {
    throw new Error(`test case should not have thrown ${e.message}`);
  }
  assertEquals(decoratorRetVal, undefined);

  // by this point, `methodDescriptor.value` has been written with a new value
  // which is the enhanced `testHandler`
  let enhancedHandlerRetVal;
  try {
    // deno-lint-ignore ban-types
    const enhancedHandler: Function = methodDescriptor.value;
    const ctx = createMockContext();
    Object.defineProperty(ctx.request, "body", {
      get: () => createMockRequestBody("json"),
    });
    enhancedHandlerRetVal = await enhancedHandler(ctx);
  } catch (e) {
    throw new Error(`test case should not have thrown ${e.message}`);
  }

  assertEquals(enhancedHandlerRetVal, { "declaring": "param, query" });
});

Deno.test("ControllerMethodArgs Decorator - CloudflareWorker strategy - declaring body", async () => {
  const methodDescriptor = {
    value: function testHandler() {
      return { "declaring": "body" };
    },
    writable: true,
    enumerable: false,
    configurable: true,
  };
  let decoratorRetVal;
  try {
    decoratorRetVal = ControllerMethodArgs("body")(
      {},
      "testHandler",
      methodDescriptor,
    );
  } catch (e) {
    throw new Error(`test case should not have thrown ${e.message}`);
  }
  assertEquals(decoratorRetVal, undefined);

  // by this point, `methodDescriptor.value` has been written with a new value
  // which is the enhanced `testHandler`
  let enhancedHandlerRetVal;
  try {
    // deno-lint-ignore ban-types
    const enhancedHandler: Function = methodDescriptor.value;
    const ctx = createMockContext();
    Object.defineProperty(ctx.request, "body", {
      get: () => createMockRequestBody("json"),
    });
    enhancedHandlerRetVal = await enhancedHandler(ctx);
  } catch (e) {
    throw new Error(`test case should not have thrown ${e.message}`);
  }

  assertEquals(enhancedHandlerRetVal, { "declaring": "body" });
});

Deno.test("ControllerMethodArgs Decorator - CloudflareWorker strategy - declaring nothing", async () => {
  const methodDescriptor = {
    value: function testHandler() {
      return { "declaring": "nothing" };
    },
    writable: true,
    enumerable: false,
    configurable: true,
  };
  let decoratorRetVal;
  try {
    decoratorRetVal = ControllerMethodArgs()(
      {},
      "testHandler",
      methodDescriptor,
    );
  } catch (e) {
    throw new Error(`test case should not have thrown ${e.message}`);
  }
  assertEquals(decoratorRetVal, undefined);

  // by this point, `methodDescriptor.value` has been written with a new value
  // which is the enhanced `testHandler`
  let enhancedHandlerRetVal;
  try {
    // deno-lint-ignore ban-types
    const enhancedHandler: Function = methodDescriptor.value;
    const ctx = createMockContext();
    Object.defineProperty(ctx.request, "body", {
      get: () => createMockRequestBody("json"),
    });
    enhancedHandlerRetVal = await enhancedHandler(ctx);
  } catch (e) {
    throw new Error(`test case should not have thrown ${e.message}`);
  }

  assertEquals(enhancedHandlerRetVal, { "declaring": "nothing" });
});

Deno.test("parseOakReqBody", async (t) => {
  // deno-lint-ignore no-explicit-any
  const bodyTestCases: { type: BodyType; expected: any }[] = [
    { type: "json", expected: { mock: "mock" } },
    { type: "text", expected: "mock" },
    { type: "binary", expected: new Buffer() },
    { type: "form", expected: new URLSearchParams({ mock: "mock" }) },
    { type: "form-data", expected: new FormData() },
    { type: "unknown", expected: new Buffer() },
    { type: "unsupported" as BodyType, expected: new Buffer() },
  ];

  await t.step("empty ctx.request.body", async () => {
    const ctx = createMockContext();
    Object.defineProperty(ctx.request, "body", {
      get: () => undefined,
    });
    // deno-lint-ignore no-explicit-any
    const parseResult = await _internal.parseOakReqBody(ctx as any);
    assertEquals(parseResult, undefined);
  });

  await Promise.all(bodyTestCases.map(({ type, expected }) =>
    t.step({
      name: `case body type ${type}`,
      fn: async () => {
        const ctx = createMockContext();
        Object.defineProperty(ctx.request, "body", {
          get: () => createMockRequestBody(type),
        });
        // deno-lint-ignore no-explicit-any
        const parseResult = await _internal.parseOakReqBody(ctx as any);
        assertEquals(parseResult, expected);
      },
      sanitizeOps: false,
      sanitizeResources: false,
      sanitizeExit: false,
    })
  ));
});

Deno.test("getEnhancedHandler with a faulty ctx.request.body", async () => {
  const spyParseOakRequestBody = spy(_internal, "parseOakReqBody");
  function testHandler() {
    return "i.am.an.enhanced.handler.response";
  }
  // deno-lint-ignore ban-types
  const enhancedHandler: Function = _internal.getEnhancedHandler(testHandler);
  const ctx = createMockContext();
  Object.defineProperty(ctx.request, "body", {
    get: () => {
      throw new Error("mock error accessing ctx.request.body");
    },
  });
  const spyCtxThrow = spy();
  Object.defineProperty(ctx, "throw", {
    value: (errorStatus: unknown, message?: string, props?: unknown) => {
      spyCtxThrow(errorStatus, message, props);
    },
  });
  await enhancedHandler(ctx);
  const [errorStatus, message, _props] = spyCtxThrow.calls[0].args;
  assertEquals(errorStatus, 400);
  assertStringIncludes(
    message,
    "Unable to parse request body: mock error accessing ctx.request.body",
  );
  assertSpyCalls(spyCtxThrow, 1);
  assertSpyCalls(spyParseOakRequestBody, 1);
  spyParseOakRequestBody.restore();
});

Deno.test("getEnhancedHandler with a faulty ctx.request.url.searchParams", async () => {
  const spyParseOakRequestBody = spy(_internal, "parseOakReqBody");
  function testHandler() {
    return "i.am.an.enhanced.handler.response";
  }
  // deno-lint-ignore ban-types
  const enhancedHandler: Function = _internal.getEnhancedHandler(testHandler);
  const ctx = createMockContext();
  Object.defineProperty(ctx.request, "body", {
    get: () => createMockRequestBody("json"),
  });
  Object.defineProperty(ctx.request.url, "searchParams", {
    value: undefined,
  });
  const spyCtxThrow = spy();
  Object.defineProperty(ctx, "throw", {
    value: (errorStatus: unknown, message?: string, props?: unknown) => {
      spyCtxThrow(errorStatus, message, props);
    },
  });
  await enhancedHandler(ctx);
  const [errorStatus, message, _props] = spyCtxThrow.calls[0].args;
  assertEquals(errorStatus, 400);
  assertStringIncludes(
    message,
    "Unable to parse request search params: Cannot read properties of undefined (reading 'forEach')",
  );
  assertSpyCalls(spyCtxThrow, 1);
  assertSpyCalls(spyParseOakRequestBody, 1);
  spyParseOakRequestBody.restore();
});

Deno.test("getEnhancedHandler - declaring 4 desirable params in order A", async () => {
  const testHandler = spy((..._rest) => 42);
  // deno-lint-ignore ban-types
  const enhancedHandler: Function = _internal.getEnhancedHandler(
    testHandler,
    "body",
    "param",
    "query",
    "ctx" as ControllerMethodArg,
  );
  const ctx = createMockContext({
    path: "/hello/world",
    params: { name: "world" },
  });
  Object.defineProperty(ctx.request, "body", {
    get: () => createMockRequestBody("form"),
  });
  Object.defineProperty(ctx.request.url, "searchParams", {
    value: new Map([["foo", "bar"]]),
  });
  await enhancedHandler(ctx);
  const [body, param, query, context] = testHandler.calls[0].args;
  assertEquals(body, new URLSearchParams({ mock: "mock" }));
  assertEquals(param, { name: "world" });
  assertEquals(query, { foo: "bar" });
  assertEquals(context, ctx);
  assertEquals(testHandler.calls[0].returned, 42);
  assertSpyCalls(testHandler, 1);
});

Deno.test("getEnhancedHandler - declaring 4 desirable params in order B", async () => {
  const testHandler = spy((..._rest) => 43);
  // deno-lint-ignore ban-types
  const enhancedHandler: Function = _internal.getEnhancedHandler(
    testHandler,
    "body",
    "context" as ControllerMethodArg,
    "param",
    "query",
  );
  const ctx = createMockContext({
    path: "/hello/world",
    params: { name: "world" },
  });
  Object.defineProperty(ctx.request, "body", {
    get: () => createMockRequestBody("form-data"),
  });
  Object.defineProperty(ctx.request.url, "searchParams", {
    value: new Map([["foo", "bar"]]),
  });
  await enhancedHandler(ctx);
  const [body, context, param, query] = testHandler.calls[0].args;
  assertEquals(body, new FormData());
  assertEquals(param, { name: "world" });
  assertEquals(query, { foo: "bar" });
  assertEquals(context, ctx);
  assertEquals(testHandler.calls[0].returned, 43);
  assertSpyCalls(testHandler, 1);
});

Deno.test("getEnhancedHandler - declaring 5 desirable params", async () => {
  const spyParseOakRequestBody = spy(_internal, "parseOakReqBody");
  const testHandler = spy((..._rest) => 44);
  // deno-lint-ignore ban-types
  const enhancedHandler: Function = _internal.getEnhancedHandler(
    testHandler,
    "context" as ControllerMethodArg,
    "body",
    "param",
    "query",
    "hiddenFeature" as ControllerMethodArg,
  );
  const ctx = createMockContext({
    path: "/hello/world",
    params: { name: "world", hiddenFeature: "42" },
  });
  Object.defineProperty(ctx.request, "body", {
    get: () => createMockRequestBody("binary"),
  });
  Object.defineProperty(ctx.request.url, "searchParams", {
    value: new Map([["foo", "bar"]]),
  });
  await enhancedHandler(ctx);
  const [context, body, param, query, hiddenFeature] =
    testHandler.calls[0].args;
  assertEquals(body, new Buffer());
  assertEquals(param, { name: "world", hiddenFeature: "42" });
  assertEquals(query, { foo: "bar" });
  assertEquals(hiddenFeature, "42");
  assertEquals(context, ctx);
  assertEquals(testHandler.calls[0].returned, 44);
  assertSpyCalls(testHandler, 1);
  assertSpyCalls(spyParseOakRequestBody, 1);
  spyParseOakRequestBody.restore();
});

Deno.test("getEnhancedHandler - declaring 3 desirable params in order A", async () => {
  const testHandler = spy((..._rest) => 45);
  // deno-lint-ignore ban-types
  const enhancedHandler: Function = _internal.getEnhancedHandler(
    testHandler,
    "body",
    "param",
    "query",
  );
  const ctx = createMockContext({
    path: "/hello/world",
    params: { name: "world" },
  });
  Object.defineProperty(ctx.request, "body", {
    get: () => createMockRequestBody("text"),
  });
  Object.defineProperty(ctx.request.url, "searchParams", {
    value: new Map([["foo", "bar"]]),
  });
  await enhancedHandler(ctx);
  const [body, param, query, context] = testHandler.calls[0].args;
  assertEquals(body, "mock");
  assertEquals(param, { name: "world" });
  assertEquals(query, { foo: "bar" });
  assertEquals(context, ctx);
  assertEquals(testHandler.calls[0].returned, 45);
  assertSpyCalls(testHandler, 1);
});

Deno.test("getEnhancedHandler - declaring 3 desirable params in order B", async () => {
  const testHandler = spy((..._rest) => 46);
  // deno-lint-ignore ban-types
  const enhancedHandler: Function = _internal.getEnhancedHandler(
    testHandler,
    "param",
    "query",
    "body",
  );
  const ctx = createMockContext({
    path: "/hello/world",
    params: { name: "world" },
  });
  Object.defineProperty(ctx.request, "body", {
    get: () => createMockRequestBody("unknown"),
  });
  Object.defineProperty(ctx.request.url, "searchParams", {
    value: new Map([["foo", "bar"]]),
  });
  await enhancedHandler(ctx);
  const [param, query, body, context] = testHandler.calls[0].args;
  assertEquals(body, new Buffer());
  assertEquals(param, { name: "world" });
  assertEquals(query, { foo: "bar" });
  assertEquals(context, ctx);
  assertEquals(testHandler.calls[0].returned, 46);
  assertSpyCalls(testHandler, 1);
});

Deno.test("getEnhancedHandler - not declaring any param", async () => {
  const testHandler = spy();
  // deno-lint-ignore ban-types
  const enhancedHandler: Function = _internal.getEnhancedHandler(testHandler);
  const ctx = createMockContext({
    path: "/hello/world",
    params: { name: "world" },
  });
  Object.defineProperty(ctx.request, "body", {
    get: () => createMockRequestBody("json"),
  });
  Object.defineProperty(ctx.request.url, "searchParams", {
    value: new Map([["foo", "bar"]]),
  });
  await enhancedHandler(ctx);
  const args = testHandler.calls[0].args;
  assertEquals(args.length, 1);
  assertEquals(args[0], ctx);
  assertEquals(testHandler.calls[0].returned, undefined);
  assertSpyCalls(testHandler, 1);
});

/**
 * @NOTE if/when `oak` supports such a method, better import from there instead
 */
function createMockRequestBody(type: BodyType): Body {
  const buf = new Buffer();
  const rs = new ReadableStream();
  const retVal = new Body({
    // deno-lint-ignore no-explicit-any
    request: {} as any,
    // deno-lint-ignore no-explicit-any
    headers: {} as any,
    getBody: () => rs,
  });
  Object.defineProperties(retVal, {
    has: {
      get: () => true,
    },
    type: {
      value: () => type,
    },
    json: {
      value: () => Promise.resolve({ mock: "mock" }),
    },
    text: {
      value: () => Promise.resolve("mock"),
    },
    blob: {
      value: () => Promise.resolve(buf),
    },
    form: {
      value: () => Promise.resolve(new URLSearchParams({ mock: "mock" })),
    },
    formData: {
      value: () => Promise.resolve(new FormData()),
    },
    arrayBuffer: {
      value: () => Promise.resolve(buf),
    },
  });
  return retVal;
}
