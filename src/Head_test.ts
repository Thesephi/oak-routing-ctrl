import {
  assertEquals,
  assertInstanceOf,
  assertSpyCall,
  assertSpyCalls,
  type MethodSpy,
  spy,
} from "../dev_deps.ts";
import { store } from "./Store.ts";
import { _internal } from "./Head.ts";

Deno.test("@Head decorator", () => {
  const Head: MethodSpy = spy(_internal, "Head");

  try {
    class _ {
      @Head("/bar")
      doSomething() {}
    }
  } finally {
    Head.restore();
  }

  assertSpyCall(Head, 0, { args: ["/bar"] });
  assertInstanceOf(Head.calls[0].returned, Function);
  assertSpyCalls(Head, 1);
  assertEquals(store.get("doSomething")?.get("head"), "/bar");
});
