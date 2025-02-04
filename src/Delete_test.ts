import { assertEquals, assertInstanceOf } from "@std/assert";
import {
  assertSpyCall,
  assertSpyCalls,
  type MethodSpy,
  spy,
} from "@std/testing/mock";
import { store } from "./Store.ts";
import { _internal } from "./Delete.ts";

Deno.test("@Delete decorator", () => {
  const Delete: MethodSpy = spy(_internal, "Delete");

  try {
    class _ {
      @Delete("/bar")
      doSomething() {}
    }
  } finally {
    Delete.restore();
  }

  assertSpyCall(Delete, 0, { args: ["/bar"] });
  assertInstanceOf(Delete.calls[0].returned, Function);
  assertSpyCalls(Delete, 1);
  assertEquals(store.get("doSomething")?.get("/bar"), "delete");
});
