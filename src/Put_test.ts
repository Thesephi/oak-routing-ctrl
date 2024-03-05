import {
  assertEquals,
  assertSpyCall,
  assertSpyCalls,
  spy,
  stub,
} from "../dev_deps.ts";
import { debug } from "./utils/logger.ts";
import { register, store } from "./Store.ts";
import { Put } from "./Put.ts";

Deno.test("@Put decorator", () => {
  // @TODO check why spies don't work
  // const spyStoreRegister = spy(register);
  // const spyLoggerDebug = spy(debug);

  class _ {
    @Put("/bar")
    doSomething() {}
  }

  // assertSpyCalls(spyLoggerDebug, 1);
  // assertSpyCalls(spyStoreRegister, 1);
  // assertSpyCall(spyStoreRegister, 0, {
  //   args: ["put", "/bar", "doSomething"],
  //   returned: undefined,
  // });

  assertEquals(store.get("doSomething")?.get("put"), "/bar");
});
