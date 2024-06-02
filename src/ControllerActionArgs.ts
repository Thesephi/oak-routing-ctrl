import { debug } from "./utils/logger.ts";
import { Context, RouteContext } from "../deps.ts";

/**
 * literal keywords that can be used as arguments for the `@ControllerActionArgs`
 * decorator; these keywords **MUST** appear in the same order that their counterpart
 * arguments show up in the actual (decorated) handler function
 * @example
 * (@)ControllerActionArgs("query", "body")
 * doSomething(query: Record<string, string>, body: Record<string, string>) {
 *   console.log(query, body);
 * }
 */
export type SupportedControllerActionArgs =
  | "param"
  | "body"
  | "query";

/**
 * Decorator that should be used on the Controller Class Method
 * when we need to refer to request body, params, etc. in the
 * method body
 * @returns a function with the signature (arguments) matching that
 * of the provided `desirableParams`, which can then be **decorated**
 * with one of the Class Method decorators (e.g. `Get`, `Post`, etc.)
 * @example
 * ```ts
 * (@)Controller("/api/v1")
 * class MyClass {
 *   (@)Post("/:resource")
 *   (@)ControllerActionArgs("body", "query", "param")
 *   doSomething(body, query, param, ctx): void {
 *     console.log(`endpoint called: /api/v1/${ctx.params.resource}`);
 *     console.log(`now let's do something with`, body, query, param);
 *   }
 * }
 * ```
 */
export const ControllerActionArgs =
  (...desirableParams: SupportedControllerActionArgs[]) =>
  (
    // deno-lint-ignore ban-types
    target: Function,
    context: ClassMethodDecoratorContext,
    // deno-lint-ignore no-explicit-any
  ): any => {
    debug(`invoking ControllerActionArgs Decorator`, target);

    const methodName = context.name;

    // deno-lint-ignore no-explicit-any
    async function retVal(this: ThisType<unknown>, ...args: any[]) {
      // original args passed in by the framework: (ctx)
      const ctx: Context & RouteContext<string> = args.shift();

      let parsedReqBody: unknown;
      try {
        parsedReqBody = await parseOakReqBody(ctx);
      } catch (e) {
        return ctx.throw(400, `Unable to parse request body: ${e.message}`, {
          stack: e.stack,
        });
      }

      const parsedReqSearchParams: Record<string, string> = {};
      try {
        ctx.request.url.searchParams.forEach((value, key) =>
          parsedReqSearchParams[key] = value
        );
      } catch (e) {
        return ctx.throw(
          400,
          `Unable to parse request search params: ${e.message}`,
          {
            stack: e.stack,
          },
        );
      }

      const decoratedArgs: unknown[] = [];
      // expected (decorated) args are "extracted" from `ctx`
      // per `desirableParams`
      for (const p of desirableParams) {
        switch (true) {
          case p === "param":
            // path param
            decoratedArgs.push(ctx.params);
            break;
          case p === "body":
            // body to be handled separately
            decoratedArgs.push(parsedReqBody);
            break;
          case p === "query":
            // search query a.k.a URLSearchParams
            decoratedArgs.push(parsedReqSearchParams);
            break;
          case ["ctx", "context"].includes(p):
            // `ctx` or `context` is supported by default (as the last argument)
            // but can also be declared explicitly
            decoratedArgs.push(ctx);
            break;
          default:
            // otherwise assume it's all from ctx params
            decoratedArgs.push(ctx.params[p]);
            // @TODO consider if it's also desirable to extract the arg
            // from `parsedReqBody` as an automatic "fallback" after `ctx.params`
        }
      }

      // squeze ctx at the end anyways, as many users might be familiar
      // with it being last (and also people often forget to declare `ctx` explicitly
      // when using the Decorator)
      decoratedArgs.push(ctx);

      return await target.call(this, ...decoratedArgs);
    }

    Object.defineProperty(retVal, "name", {
      value: methodName,
      writable: false,
    });

    return retVal;
  };

async function parseOakReqBody(
  ctx: Context & RouteContext<string>,
): Promise<unknown> {
  let retVal: unknown;
  // https://github.com/oakserver/oak?tab=readme-ov-file#request-body
  switch (ctx.request.body?.type()) {
    case "json":
      retVal = await ctx.request.body.json();
      break;
    case "text":
      retVal = await ctx.request.body.text();
      break;
    case "binary":
      retVal = await ctx.request.body.blob();
      break;
    case "form":
      retVal = await ctx.request.body.form();
      break;
    case "form-data":
      retVal = await ctx.request.body.formData();
      break;
    case "unknown":
    default:
      retVal = await ctx.request.body?.arrayBuffer();
  }
  return retVal;
}
