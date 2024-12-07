import { assertEquals, assertInstanceOf } from "@std/assert";
import {
  assertSpyCall,
  assertSpyCalls,
  type MethodSpy,
  spy,
} from "@std/testing/mock";
import { store } from "./Store.ts";
import { _internal } from "./Put.ts";

Deno.test("@Put decorator", () => {
  // @TODO check why spying on `register` or `debug` directly doesn't work
  // const spyStoreRegister = spy(register);
  // const spyLoggerDebug = spy(debug);

  const Put: MethodSpy = spy(_internal, "Put");

  try {
    class _ {
      @Put("/bar")
      doSomething() {}
    }
  } finally {
    Put.restore();
  }

  assertSpyCall(Put, 0, { args: ["/bar"] });
  assertInstanceOf(Put.calls[0].returned, Function);
  assertSpyCalls(Put, 1);
  assertEquals(store.get("doSomething")?.get("put"), "/bar");

  // assertSpyCalls(spyLoggerDebug, 1);
  // assertSpyCalls(spyStoreRegister, 1);
  // assertSpyCall(spyStoreRegister, 0, {
  //   args: ["put", "/bar", "doSomething"],
  //   returned: undefined,
  // });
});
