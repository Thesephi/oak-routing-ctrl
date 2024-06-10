import { debug } from "./logger.ts";
import {
  afterEach,
  assertSpyCall,
  assertSpyCalls,
  beforeEach,
  stub,
} from "../../dev_deps.ts";
import type { Stub } from "../../dev_deps.ts";
import { describe, it } from "../../dev_deps.ts";

let stubConsoleDebug: Stub;

beforeEach(() => {
  stubConsoleDebug = stub(console, "debug", () => {});
});

afterEach(() => {
  stubConsoleDebug.restore();
});

describe("debug logger", () => {
  it("behaves without DEBUG env var", () => {
    const stubbedGetDebugEnv = stubGetEnv("DEBUG", undefined);
    try {
      debug("foo");
      assertSpyCalls(stubConsoleDebug, 0);
    } finally {
      stubbedGetDebugEnv.restore();
    }
  });

  it("behaves with DEBUG env var set to true", () => {
    const stubbedGetDebugEnv = stubGetEnv("DEBUG", "true");
    try {
      debug("bar");
      assertSpyCall(stubConsoleDebug, 0, { args: ["bar"] });
    } finally {
      stubbedGetDebugEnv.restore();
    }
  });

  it("behaves with DEBUG env var set to oak-routing-ctrl", () => {
    const stubbedGetDebugEnv = stubGetEnv("DEBUG", "oak-routing-ctrl");
    try {
      debug("bar");
      assertSpyCall(stubConsoleDebug, 0, { args: ["bar"] });
    } finally {
      stubbedGetDebugEnv.restore();
    }
  });

  it("behaves eith DEBUG env var set to an arbitrary unexpected value", () => {
    const stubbedGetDebugEnv = stubGetEnv("DEBUG", "foobar");
    try {
      debug("foo");
      assertSpyCalls(stubConsoleDebug, 0);
    } finally {
      stubbedGetDebugEnv.restore();
    }
  });
});

function stubGetEnv(envName: string, stubValue: string | undefined): Stub {
  return stub(
    Deno.env,
    "get",
    (key) => key === envName ? stubValue : Deno.env.get(key),
  );
}
