import { assertSnapshot } from "@std/testing/snapshot";
import { inspect } from "./inspect.ts";

const testObj = {
  this: {
    is: {
      a: ["relatively", "deep", "object"],
      b: {
        but: {
          "is it": true,
        },
        or: {
          is: {
            it: new Map([["just", "1"], ["a", "2"], ["hoax", "3"]]),
          },
        },
      },
    },
  },
};

Deno.test("inspect without depth - Deno env", async (t) => {
  const retVal = inspect(testObj);
  await assertSnapshot(t, retVal);
});

Deno.test("inspect with depth - Deno env", async (t) => {
  const retVal = inspect(testObj, { depth: 10 });
  await assertSnapshot(t, retVal);
});

Deno.test("inspect - non-Deno env", async (t) => {
  const origDesc = Object.getOwnPropertyDescriptor(globalThis, "Deno");
  Object.defineProperty(globalThis, "Deno", {
    value: undefined,
  });
  const retVal = inspect(testObj);
  Object.defineProperty(globalThis, "Deno", origDesc!);
  await assertSnapshot(t, retVal);
});
