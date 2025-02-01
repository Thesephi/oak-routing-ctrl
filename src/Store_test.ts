import { assertEquals } from "@std/assert";
import { assertSpyCall, assertSpyCalls, spy } from "@std/testing/mock";
import { register, store } from "./Store.ts";

Deno.test("Store", () => {
  const spyStoreGet = spy(store, "get");
  const spyStoreSet = spy(store, "set");

  try {
    register("get", "/foo", "handlerFnName");
    register("post", "/bar", "handlerFnName");
    register("put", "/baz", "handlerFnName");
    register("delete", "/maz", "handlerFnName");
    register("patch", "/laz", "handlerFnName");
  } finally {
    spyStoreGet.restore();
    spyStoreSet.restore();
  }

  assertSpyCall(spyStoreGet, 0, { args: ["handlerFnName"] });
  assertSpyCall(spyStoreGet, 1, { args: ["handlerFnName"] });
  assertSpyCall(spyStoreGet, 2, { args: ["handlerFnName"] });
  assertSpyCall(spyStoreGet, 3, { args: ["handlerFnName"] });
  assertSpyCall(spyStoreGet, 4, { args: ["handlerFnName"] });
  const finalMap = new Map([
    ["get", "/foo"],
    ["post", "/bar"],
    ["put", "/baz"],
    ["delete", "/maz"],
    ["patch", "/laz"],
  ]);
  assertEquals(store.get("handlerFnName"), finalMap);

  assertSpyCalls(spyStoreGet, 5);
  assertSpyCalls(spyStoreSet, 1);
});
