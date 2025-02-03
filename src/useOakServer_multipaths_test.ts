// superdeno currently doesn't work out-of-the-box with Deno 2
// so we hack around it a little
(globalThis.window = globalThis as
  & typeof globalThis
  & Window
  & Record<symbol, unknown>)[Symbol("SHAM_SYMBOL")] = {};

import { superoak } from "superoak";
import { Application } from "@oak/oak";
import {
  type Context,
  Controller,
  ControllerMethodArgs,
  Get,
  Post,
  Put,
  useOakServer,
} from "../mod.ts";
import { assertSpyCallArgs, assertSpyCalls, spy } from "@std/testing/mock";
import { assertEquals } from "@std/assert";

const spyTemplate = {
  handler1(..._: unknown[]) {},
  handler2(..._: unknown[]) {},
  handler3(..._: unknown[]) {},
  catchAll(..._: unknown[]) {},
};

@Controller("/test")
class TestController {
  @Get("/handler1/:bar")
  @Get("/handler1/bar")
  @Post("/handler1/par")
  @ControllerMethodArgs("param")
  handler1(param: Record<string, unknown>, ctx: Context) {
    const method = ctx.request.method;
    const reqPath = ctx.request.url.pathname;
    const regPath = ctx.state._oakRoutingCtrl_regPath;
    spyTemplate.handler1(method, reqPath, regPath, { ...param });
    return { method, reqPath, regPath, param };
  }

  @Get("/handler2/bar")
  @Post("/handler2/par")
  @Get("/handler2/:bar")
  @ControllerMethodArgs("body", "param")
  handler2(
    body: Record<string, unknown>,
    param: Record<string, unknown>,
    ctx: Context,
  ) {
    const method = ctx.request.method;
    const reqPath = ctx.request.url.pathname;
    const regPath = ctx.state._oakRoutingCtrl_regPath;
    spyTemplate.handler2(method, reqPath, regPath, { ...param });
    return { method, reqPath, regPath, param, body };
  }

  @Put("/handler3")
  @Put("/handler3/:bar")
  @ControllerMethodArgs("body", "param")
  handler3(
    body: Record<string, unknown>,
    param: Record<string, unknown>,
    ctx: Context,
  ) {
    const method = ctx.request.method;
    const reqPath = ctx.request.url.pathname;
    const regPath = ctx.state._oakRoutingCtrl_regPath;
    spyTemplate.handler3(method, reqPath, regPath, { ...param });
    return { method, reqPath, regPath, param, body };
  }
}

const app = new Application();
useOakServer(app, [TestController]);
app.use((ctx) => {
  spyTemplate.catchAll(
    "catch-all middleware invoked for",
    ctx.request.url.pathname,
  );
});

/**
 * Two similar paths registered on the same handler, the only difference
 * being how the path parameter is declared & recognized; Scenario 1:
 * - @Get("/foo/:bar")
 * - @Get("/foo/bar")
 */
Deno.test("Overlapping paths, scenario 1", async () => {
  const handler1Spy = spy(spyTemplate, "handler1");
  const catchAllSpy = spy(spyTemplate, "catchAll");

  const req = await superoak(app);
  const res = await req.get("/test/handler1/bar");

  assertSpyCalls(handler1Spy, 2);
  assertSpyCallArgs(handler1Spy, 0, [
    "GET",
    "/test/handler1/bar",
    "/test/handler1/bar",
    {},
  ]);
  assertSpyCallArgs(handler1Spy, 1, [
    "GET",
    "/test/handler1/bar",
    "/test/handler1/:bar",
    {
      bar: "bar",
    },
  ]);
  assertSpyCalls(catchAllSpy, 1);

  handler1Spy.restore();
  catchAllSpy.restore();

  assertEquals(res.body, {
    method: "GET",
    reqPath: "/test/handler1/bar",
    regPath: "/test/handler1/bar",
    param: { bar: "bar" },
  });
});

Deno.test("One @Post and Two @Get paths registered on handler1", async () => {
  const handler1Spy = spy(spyTemplate, "handler1");
  const catchAllSpy = spy(spyTemplate, "catchAll");

  const req = await superoak(app);
  const res = await req.post("/test/handler1/par");

  assertSpyCalls(handler1Spy, 1);
  assertSpyCallArgs(handler1Spy, 0, [
    "POST",
    "/test/handler1/par",
    "/test/handler1/par",
    {},
  ]);
  assertSpyCalls(catchAllSpy, 1);

  handler1Spy.restore();
  catchAllSpy.restore();

  assertEquals(res.body, {
    method: "POST",
    reqPath: "/test/handler1/par",
    regPath: "/test/handler1/par",
    param: {},
  });
});

/**
 * Two similar paths registered on the same handler, the only difference
 * being how the path parameter is declared & recognized; Scenario 2:
 * - @Get("/foo/bar")
 * - @Get("/foo/:bar")
 */
Deno.test("Overlapping paths, scenario 2", async () => {
  const handler2Spy = spy(spyTemplate, "handler2");
  const catchAllSpy = spy(spyTemplate, "catchAll");

  const req = await superoak(app);
  const res = await req.get("/test/handler2/bar");

  assertSpyCalls(handler2Spy, 2);
  assertSpyCallArgs(handler2Spy, 0, [
    "GET",
    "/test/handler2/bar",
    "/test/handler2/:bar",
    {
      bar: "bar",
    },
  ]);
  assertSpyCallArgs(handler2Spy, 1, [
    "GET",
    "/test/handler2/bar",
    "/test/handler2/bar",
    {
      bar: "bar",
    },
  ]);
  assertSpyCalls(catchAllSpy, 1);

  handler2Spy.restore();
  catchAllSpy.restore();

  assertEquals(res.body, {
    method: "GET",
    reqPath: "/test/handler2/bar",
    regPath: "/test/handler2/:bar",
    param: { bar: "bar" },
    body: {},
  });
});

Deno.test("One @Post and Two @Get paths registered on handler2", async () => {
  const handler2Spy = spy(spyTemplate, "handler2");
  const catchAllSpy = spy(spyTemplate, "catchAll");

  const req = await superoak(app);
  const res = await req.post("/test/handler2/par").send({
    universe: 42,
  });

  assertSpyCalls(handler2Spy, 1);
  assertSpyCallArgs(handler2Spy, 0, [
    "POST",
    "/test/handler2/par",
    "/test/handler2/par",
    {},
  ]);
  assertSpyCalls(catchAllSpy, 1);

  handler2Spy.restore();
  catchAllSpy.restore();

  assertEquals(res.body, {
    method: "POST",
    reqPath: "/test/handler2/par",
    regPath: "/test/handler2/par",
    param: {},
    body: { universe: 42 },
  });
});

Deno.test("Similar paths that do not actually overlap - path 1", async () => {
  const handler3Spy = spy(spyTemplate, "handler3");
  const catchAllSpy = spy(spyTemplate, "catchAll");

  const req = await superoak(app);
  const res = await req.put("/test/handler3/").send({
    charlie: false,
  });

  assertSpyCalls(handler3Spy, 1);
  assertSpyCallArgs(handler3Spy, 0, [
    "PUT",
    "/test/handler3/",
    "/test/handler3",
    {},
  ]);
  assertSpyCalls(catchAllSpy, 1);

  handler3Spy.restore();
  catchAllSpy.restore();

  assertEquals(res.body, {
    method: "PUT",
    reqPath: "/test/handler3/",
    regPath: "/test/handler3",
    param: {},
    body: { charlie: false },
  });
});

Deno.test("Similar paths that do not actually overlap - path 2", async () => {
  const handler3Spy = spy(spyTemplate, "handler3");
  const catchAllSpy = spy(spyTemplate, "catchAll");

  const req = await superoak(app);
  const res = await req.put("/test/handler3/charlie").send({
    charlie: true,
  });

  assertSpyCalls(handler3Spy, 1);
  assertSpyCallArgs(handler3Spy, 0, [
    "PUT",
    "/test/handler3/charlie",
    "/test/handler3/:bar",
    { bar: "charlie" },
  ]);
  assertSpyCalls(catchAllSpy, 1);

  handler3Spy.restore();
  catchAllSpy.restore();

  assertEquals(res.body, {
    method: "PUT",
    reqPath: "/test/handler3/charlie",
    regPath: "/test/handler3/:bar",
    param: { bar: "charlie" },
    body: { charlie: true },
  });
});
