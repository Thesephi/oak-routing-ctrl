import { assertEquals, assertThrows } from "../../dev_deps.ts";
import { ERR_UNSUPPORTED_CLASS_METHOD_DECORATOR_RUNTIME_BEHAVIOR } from "../Constants.ts";
import { getUserSuppliedDecoratedMethodName } from "./getUserSuppliedDecoratedMethodName.ts";

Deno.test("getUserSuppliedDecoratedMethodName - Standard strategy", () => {
  const retVal = getUserSuppliedDecoratedMethodName(
    function testHandler() {},
    {
      kind: "method",
      name: "testHandler",
    } as ClassMethodDecoratorContext,
  );
  assertEquals(retVal, "testHandler");
});

Deno.test("getUserSuppliedDecoratedMethodName - CloudflareWorker strategy", () => {
  const retVal = getUserSuppliedDecoratedMethodName(
    {},
    "testHandler",
  );
  assertEquals(retVal, "testHandler");
});

Deno.test("getUserSuppliedDecoratedMethodName - unsupported strategy", () => {
  assertThrows(
    () =>
      getUserSuppliedDecoratedMethodName(
        {},
        // deno-lint-ignore no-explicit-any
        {} as any,
      ),
    Error,
    ERR_UNSUPPORTED_CLASS_METHOD_DECORATOR_RUNTIME_BEHAVIOR,
  );
});
