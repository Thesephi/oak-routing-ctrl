import { assertEquals, assertInstanceOf } from "@std/assert";
import {
  assertSpyCall,
  assertSpyCalls,
  type MethodSpy,
  spy,
} from "@std/testing/mock";
import { store } from "./Store.ts";
import { _internal } from "./Get.ts";

Deno.test("@Get decorator", () => {
  const Get: MethodSpy = spy(_internal, "Get");

  try {
    class _ {
      @Get("/bar")
      doSomething() {}
    }
  } finally {
    Get.restore();
  }

  assertSpyCall(Get, 0, { args: ["/bar"] });
  assertInstanceOf(Get.calls[0].returned, Function);
  assertSpyCalls(Get, 1);
  assertEquals(store.get("doSomething")?.get("/bar"), "get");
});
