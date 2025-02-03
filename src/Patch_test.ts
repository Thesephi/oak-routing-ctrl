import { assertEquals, assertInstanceOf } from "@std/assert";
import {
  assertSpyCall,
  assertSpyCalls,
  type MethodSpy,
  spy,
} from "@std/testing/mock";
import { store } from "./Store.ts";
import { _internal } from "./Patch.ts";

Deno.test("@Patch decorator", () => {
  const Patch: MethodSpy = spy(_internal, "Patch");

  try {
    class _ {
      @Patch("/bar")
      doSomething() {}
    }
  } finally {
    Patch.restore();
  }

  assertSpyCall(Patch, 0, { args: ["/bar"] });
  assertInstanceOf(Patch.calls[0].returned, Function);
  assertSpyCalls(Patch, 1);
  assertEquals(store.get("doSomething")?.get("/bar"), "patch");
});
