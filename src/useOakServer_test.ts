import type { SupportedVerb } from "./Store.ts";
import {
  type Context,
  type ErrorStatus,
  RouteContext,
  Status,
  z,
} from "../deps.ts";
import {
  assertEquals,
  assertSnapshot,
  assertSpyCalls,
  oakTesting,
  spy,
} from "../dev_deps.ts";
import {
  Controller,
  type ControllerMethodArg,
  ControllerMethodArgs,
  Delete,
  Get,
  Head,
  Options,
  Patch,
  Post,
  Put,
  useOakServer,
} from "../mod.ts";
import { _internal as useOakServerInternal } from "./useOakServer.ts";
import {
  type MockRequestBodyDefinition,
  mockRequestInternals,
} from "../test_utils/mockRequestInternals.ts";
import { assertSpyCallArg } from "jsr:@std/testing@^1.0.2/mock";

const staticFormData = new FormData();
staticFormData.append("foo", "phiil");

const arrayBufferLen42 = new ArrayBuffer(42);

@Controller("/noop")
class NoopController {
  noop() { }
}

class UndecoratedController {
  noop() { }
}

@Controller("/test")
class TestController {
  @Get("/foo")
  foo(ctx: Context) {
    // we can assign `response.body` directly inside the handler fn
    ctx.response.body = "hello, sync foo";
  }
  @Post("/bar")
  @ControllerMethodArgs("body", "query")
  bar(body: { saz: string }, query: { maz: string }) {
    // we can also simply return something, which will automatically
    // get assigned as `response.body` later by the framework
    return new Promise((resolve) => {
      setTimeout(() =>
        resolve(`hello, async bar with saz=${body.saz} and maz=${query.maz}`)
      );
    });
  }
  @Get("/baz/:zaz")
  @ControllerMethodArgs("query", "param")
  baz(query: Record<string, string>, param: Record<string, string>) {
    return `hello, path /baz/${param.zaz} with query ${query.someKey}`;
  }
  @Put("/taz/:someId")
  @ControllerMethodArgs("body")
  taz(body: ArrayBuffer, ctx: RouteContext<"/taz/:someId">) {
    const td = new TextDecoder();
    return `hello, path param ${ctx.params.someId} with someBlob=${td.decode(body)
      }`;
  }
  @Delete("/raz/")
  raz() {
    return { status: 204 };
  }
  @Patch("/yaz/:whatever")
  // using arbitrary controller method args is supported
  // but discouraged (hence we have to type-cast)
  @ControllerMethodArgs("whatever" as ControllerMethodArg)
  yaz(whatever: string) {
    return `hello, ${whatever}`;
  }
  justRandom() {
    return "this is returned from a non-decorated function";
  }
  @Options("/bul")
  @ControllerMethodArgs("body")
  bul(body: URLSearchParams) {
    return `hello, bul=${body.get("foo")}`;
  }
  @Head("/phil")
  @ControllerMethodArgs("body")
  phil(body: FormData) {
    return `hello, phil=${body.get("foo")}`;
  }
  @Post("/uah")
  @ControllerMethodArgs("body")
  uah(body: ArrayBuffer) {
    return `hello, ArrayBuffer body with byteLength=${body.byteLength}`;
  }
  @Get("/zodError")
  zodError() {
    z.enum(["alice", "bob"]).parse("camela");
  }
  @Post("/arbitraryError")
  arbitraryError() {
    throw new Error("nah");
  }
}

/**
 * test case matching what was declared in `TestController`
 * @NOTE the method, params, and body definitions are simulations for
 * network requests directly called against the oak http server
 * (alternatively we can use e.g. `superoak` to facilitate these)
 */
type TestCaseDefinition = {
  caseDescription: string;
  method: SupportedVerb;
  mockRequestQuery?: Record<string, string>;
  mockRequestPathParams?: Record<string, string>;
  mockRequestBody?: MockRequestBodyDefinition;
  expectedResponse: unknown;
  expectedCtxThrow?: boolean;
  expectedError?: unknown;
  expectedResponseStatus?: Status;
};

Deno.test("useOakServer - noop Controller", () => {
  const ctx = oakTesting.createMockContext();
  useOakServer(ctx.app, [NoopController]);
  const routes = Array.from(useOakServerInternal.oakRouter.values());
  assertEquals(routes.length, 0);
});

Deno.test("useOakServer - undecorated Controller", () => {
  const ctx = oakTesting.createMockContext();
  useOakServer(ctx.app, [UndecoratedController]);
  const routes = Array.from(useOakServerInternal.oakRouter.values());
  assertEquals(routes.length, 0);
});

Deno.test({
  name: "useOakServer - fully decorated Controller",
  async fn(t) {
    await t.step("router snapshot", async () => {
      const ctx = oakTesting.createMockContext();
      useOakServer(ctx.app, [TestController]);
      const routes = Array.from(useOakServerInternal.oakRouter.values());

      await assertSnapshot(t, routes);

      assertEquals(
        routes.length,
        // most methods in TestController are decorated, except Ctor and a no-op random fn
        Object.getOwnPropertyNames(TestController.prototype).length - 2,
        "number of generated routes must match number of decorated ControllerClass methods",
      );
    });

    const routeTestCases: TestCaseDefinition[] = [
      {
        caseDescription: "handler that assigns ctx.response.body inline",
        method: "get",
        expectedResponse: "hello, sync foo",
      },
      {
        caseDescription: "handler with 'body' and 'query' in that exact order",
        method: "post",
        mockRequestQuery: {
          maz: "phil",
        },
        mockRequestBody: {
          type: "json",
          value: { "saz": 42 },
        },
        expectedResponse: "hello, async bar with saz=42 and maz=phil",
      },
      {
        caseDescription: "handler with 'query' and 'param' in that exact order",
        method: "get",
        mockRequestQuery: { someKey: "chaz" },
        mockRequestPathParams: { zaz: "jaz" },
        expectedResponse: "hello, path /baz/jaz with query chaz",
      },
      {
        caseDescription: "handler for a request with a binary payload",
        method: "put",
        mockRequestPathParams: { someId: "gaz" },
        mockRequestBody: {
          type: "binary",
          value: (new TextEncoder()).encode("wee"), // [119, 101, 101]
        },
        expectedResponse: "hello, path param gaz with someBlob=wee",
      },
      {
        caseDescription: "handler that returns a simple json body payload",
        method: "delete",
        expectedResponse: { status: 204 },
      },
      {
        caseDescription:
          "handler with arbitrary (undocumented) arg treated as a member of ctx.params",
        method: "patch",
        mockRequestPathParams: { whatever: "i.am.a.patch" },
        mockRequestBody: { type: "text", value: "lorem" },
        expectedResponse: "hello, i.am.a.patch",
      },
      {
        caseDescription: "handler for a request with a form payload",
        method: "options",
        mockRequestBody: {
          type: "form",
          value: new URLSearchParams({ foo: "buul" }),
        },
        expectedResponse: "hello, bul=buul",
      },
      {
        caseDescription: "handler for a request with a form-data payload",
        method: "head",
        mockRequestBody: {
          type: "form-data",
          value: staticFormData,
        },
        expectedResponse: "hello, phil=phiil",
      },
      {
        caseDescription: "handler for a request with an unknown-typed payload",
        method: "post",
        mockRequestBody: {
          type: "unknown",
          value: arrayBufferLen42,
        },
        expectedResponse: "hello, ArrayBuffer body with byteLength=42",
      },
      {
        caseDescription: "handler where a ZodError (validation error) happens",
        method: "get",
        expectedCtxThrow: true,
        expectedError: `[
          {
            "received": "camela",
            "code": "invalid_enum_value",
            "options": [
              "alice",
              "bob"
            ],
            "path": [],
            "message": "Invalid enum value. Expected 'alice' | 'bob', received 'camela'"
          }
        ]`,
        expectedResponse: undefined,
        expectedResponseStatus: Status.BadRequest,
      },
      {
        caseDescription: "handler where an arbitrary error happens",
        method: "post",
        expectedError: "nah",
        expectedResponse: undefined,
        expectedResponseStatus: Status.InternalServerError,
      },
    ];

    await Promise.all(
      routeTestCases.map(({
        caseDescription,
        method,
        mockRequestQuery = undefined,
        mockRequestPathParams = undefined,
        mockRequestBody = undefined,
        expectedResponse,
        expectedCtxThrow,
        expectedError,
        expectedResponseStatus,
      }, i) =>
        t.step({
          name: `case ${i + 1}: ${caseDescription}`,
          fn: async () => {
            const ctx = oakTesting.createMockContext({
              method,
              params: mockRequestPathParams,
            });

            mockRequestInternals(ctx.request, {
              mockRequestBody,
              mockRequestQuery,
            });

            const next = oakTesting.createMockNext();
            useOakServer(ctx.app, [TestController]);
            const routes = Array.from(useOakServerInternal.oakRouter.values());
            const spyCtxThrow = spy(ctx, "throw");
            try {
              // simulate the route being requested
              await routes[i].middleware[0]?.(ctx, next);
            } catch (e) {
              const theErrMsg = (e as Error).message;
              if (expectedCtxThrow) {
                assertSpyCalls(spyCtxThrow, 1);
                assertSpyCallArg(
                  spyCtxThrow,
                  0,
                  0,
                  expectedResponseStatus as ErrorStatus,
                );
                assertSpyCallArg(
                  spyCtxThrow,
                  0,
                  1,
                  JSON.stringify(
                    JSON.parse(expectedError as string),
                    undefined,
                    2,
                  ),
                );
              } else {
                assertSpyCalls(spyCtxThrow, 0);
                assertEquals(theErrMsg, expectedError);
              }
            }
            assertEquals(ctx.response.body, expectedResponse);
          },
          sanitizeOps: false,
          sanitizeResources: false,
          sanitizeExit: false,
        })
      ),
    );
  },
});
