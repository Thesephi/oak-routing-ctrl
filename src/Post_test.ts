import { assertEquals, assertInstanceOf } from "@std/assert";
import {
  assertSpyCall,
  assertSpyCalls,
  type MethodSpy,
  spy,
} from "@std/testing/mock";
import { store } from "./Store.ts";
import { _internal } from "./Post.ts";

Deno.test("@Post decorator", () => {
  const Post: MethodSpy = spy(_internal, "Post");

  try {
    class _ {
      @Post("/bar")
      doSomething() {}
    }
  } finally {
    Post.restore();
  }

  assertSpyCall(Post, 0, { args: ["/bar"] });
  assertInstanceOf(Post.calls[0].returned, Function);
  assertSpyCalls(Post, 1);
  assertEquals(store.get("doSomething")?.get("/bar"), "post");
});
