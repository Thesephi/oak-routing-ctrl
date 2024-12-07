import { z } from "./utils/schema_utils.ts";
import { assertEquals, assertInstanceOf } from "@std/assert";
import { ZodObject } from "zod";
import { oasStore, patchOasPath, updateOas } from "./oasStore.ts";
import { _internal } from "./oasStore.ts";

const { getRouteId, getOasCompatPath } = _internal;

Deno.test("no-op", () => {
  updateOas("doSomething", "post", "/hello/:name");
  assertEquals(oasStore.size, 0);
});

Deno.test("store entry creation & update", () => {
  const fnName = "doSomething";
  const method = "post";
  const path = "/hello/:name";
  const patchedPath = "/api/v1/hello/:name";

  updateOas(fnName, method, path, {
    request: {
      body: {
        content: {
          "application/json": {
            schema: z.object({ foo: z.string() }),
          },
        },
      },
      params: z.object({ name: z.string() }),
    },
    responses: {
      "200": {
        description: "Successful response",
        content: {
          "application/json": {
            schema: z.object({ "42": z.object({}) }),
          },
        },
      },
    },
  });

  const record = oasStore.get(getRouteId(fnName, method, path));
  assertEquals(record?.method, method);
  assertEquals(record?.path, getOasCompatPath(path));
  assertInstanceOf(
    record?.request?.body?.content?.["application/json"]?.schema,
    ZodObject,
  );

  patchOasPath(fnName, method, patchedPath);
  const patchedRecord = oasStore.get(getRouteId(fnName, method, path));
  assertEquals(patchedRecord?.method, method);
  assertEquals(patchedRecord?.path, getOasCompatPath(patchedPath));
  assertInstanceOf(
    record?.request?.body?.content?.["application/json"]?.schema,
    ZodObject,
  );
});
