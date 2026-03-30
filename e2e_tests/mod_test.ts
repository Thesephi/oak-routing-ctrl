import { superoak } from "superoak";
import { Application } from "@oak/oak/application";
import {
  Controller,
  ControllerMethodArgs,
  Get,
  Post,
  Put,
  useOakServer,
} from "../mod.ts";
import { assertEquals } from "@std/assert";

@Controller("/v1")
class MyController {
  @Get("/test/:name")
  @ControllerMethodArgs("param")
  handler1(param: { name: string }) {
    return `hello, ${param.name}`;
  }

  @Put("/test/:name")
  @ControllerMethodArgs("body")
  handler2(body: { age: number }) {
    return { age: body.age };
  }

  @Post("/test/:name")
  @ControllerMethodArgs("body")
  handler3(body: { nationality: string }) {
    return { nationality: body.nationality };
  }
}

const app = new Application();

useOakServer(app, [MyController]);

Deno.test("GET method", async () => {
  const request = await superoak(app);
  const resp = await request
    .get("/v1/test/foo")
    .expect(200);
  assertEquals(resp.text, "hello, foo");
});

Deno.test("PUT method with json content-type & proper body", async () => {
  const request = await superoak(app);
  const resp = await request
    .put("/v1/test/foo")
    .set("Content-Type", "application/json")
    .send(JSON.stringify({ age: 20 }))
    .expect(200);
  assertEquals(resp.body, { age: 20 });
});

Deno.test("PUT method with json content-type & empty body", async () => {
  const request = await superoak(app);
  const resp = await request
    .put("/v1/test/foo")
    .set("Content-Type", "application/json")
    .expect(200);
  assertEquals(resp.body, {});
});

Deno.test("POST method with json content-type & malformed non-empty body", async () => {
  const request = await superoak(app);
  const resp = await request
    .put("/v1/test/foo")
    .set("Content-Type", "application/json")
    .send("invalid json object")
    .expect(400);
  assertEquals(
    resp.text,
    "Unable to parse request body: Unexpected token 'i', \"invalid json object\" is not valid JSON",
  );
});
