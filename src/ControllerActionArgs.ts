import { debug } from "./utils/logger.ts";
import { Context, RouteContext } from "../deps.ts";

export const ControllerActionArgs =
  (...desirableParams: string[]) =>
  (target: Function, context: ClassMethodDecoratorContext): any => {
    debug(`invoking ControllerActionCtx Decorator`, target);

    const methodName = context.name;
    async function retVal(this: ThisType<unknown>, ...args: any[]) {
      // original args: (ctx)
      const ctx: Context & RouteContext<string> = args.shift();
      // expected (decorated) args: desirableParams e.g. (tenant, language, body, ctx)

      let parsedReqBody: unknown;
      try {
        // https://github.com/oakserver/oak?tab=readme-ov-file#request-body
        // @TODO make body parsing more sophisticated?
        parsedReqBody = await ctx.request.body.json();
      } catch (e) {
        return ctx.throw(400, `Unable to parse request body: ${e.message}`, {
          stack: e.stack,
        });
      }

      let decoratedArgs: any[] = [];
      for (const p of desirableParams) {
        switch (true) {
          case ["ctx", "context"].includes(p):
            // ctx to be handled separately
            decoratedArgs.push(ctx);
            break;
          case p === "body":
            // body to be handled separately
            decoratedArgs.push(parsedReqBody);
            break;
          default:
            // otherwise assume it's all ctx params
            decoratedArgs.push(ctx.params[p]);
        }
      }

      // squeze ctx at the end anyways, as many users might be familiar
      // with this (and some often forget to declare `ctx` explicitly when using the Decorator)
      decoratedArgs.push(ctx);

      return await target.call(this, ...decoratedArgs);
    }

    Object.defineProperty(retVal, "name", {
      value: methodName,
      writable: false,
    });
    return retVal;
  };
