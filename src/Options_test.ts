import { assertEquals, assertInstanceOf } from "@std/assert";
import {
  assertSpyCall,
  assertSpyCalls,
  type MethodSpy,
  spy,
} from "@std/testing/mock";
import { store } from "./Store.ts";
import { _internal } from "./Options.ts";

Deno.test("@Options decorator", () => {
  const Options: MethodSpy = spy(_internal, "Options");

  try {
    class _ {
      @Options("/bar")
      doSomething() {}
    }
  } finally {
    Options.restore();
  }

  assertSpyCall(Options, 0, { args: ["/bar"] });
  assertInstanceOf(Options.calls[0].returned, Function);
  assertSpyCalls(Options, 1);
  assertEquals(store.get("doSomething")?.get("/bar"), "options");
});
