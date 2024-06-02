import { assertEquals, assertSnapshot, oakTesting } from "../dev_deps.ts";
import { Controller } from "./Controller.ts";
import { Get } from "./Get.ts";
import { Post } from "./Post.ts";
import { _internal, useOakServer } from "./useOakServer.ts";

@Controller("/test")
class TestController {
  @Get("/foo")
  foo() {
    return "hello, sync foo";
  }
  @Post("/bar")
  bar() {
    return new Promise((resolve) => {
      setTimeout(() => resolve("hello, async bar"));
    });
  }
}

Deno.test({
  name: "useOakServer",
  async fn(t) {
    await t.step("router snapshot", async () => {
      const ctx = oakTesting.createMockContext();
      useOakServer(ctx.app, [TestController]);
      const routes = Array.from(_internal.oakRouter.values());
      await assertSnapshot(t, routes);
    });

    const routeTestCases = [
      { route: "foo", response: "hello, sync foo" },
      { route: "bar", response: "hello, async bar" },
    ];
    await Promise.all(routeTestCases.map(({ route, response }, i) =>
      t.step({
        name: `case ${route}`,
        fn: async () => {
          const ctx = oakTesting.createMockContext();
          const next = oakTesting.createMockNext();
          useOakServer(ctx.app, [TestController]);
          const routes = Array.from(_internal.oakRouter.values());
          await routes[i].middleware[0]?.(ctx, next); // simulate the route being requested
          assertEquals(ctx.response.body, response);
        },
        sanitizeOps: false,
        sanitizeResources: false,
        sanitizeExit: false,
      })
    ));
  },
});
