import {
  assertEquals,
  assertInstanceOf,
  assertSpyCall,
  assertSpyCalls,
  type MethodSpy,
  spy,
} from "../dev_deps.ts";
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
  assertEquals(store.get("doSomething")?.get("delete"), "/bar");
});
