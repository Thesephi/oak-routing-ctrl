import { debug } from "./utils/logger.ts";
import { Context, RouteContext } from "../deps.ts";
import { ERR_UNSUPPORTED_CLASS_METHOD_DECORATOR_RUNTIME_BEHAVIOR } from "./Constants.ts";

/**
 * literal keywords that can be used as arguments for the `@ControllerMethodArgs`
 * decorator; these keywords **MUST** appear in the same order that their counterpart
 * arguments show up in the actual (decorated) handler function
 * @example
 * ```ts
 * (@)ControllerMethodArgs("query", "body")
 * doSomething(query, body) {
 *   console.log(query, body);
 * }
 * ```
 */
export type ControllerMethodArg =
  | "param"
  | "body"
  | "query"
  | "headers";

// an enhanced version of a (decorated) method which
// is declared in the (decorated) Controller Class
type EnhancedHandler = (
  this: ThisType<unknown>,
  ...args: unknown[]
) => Promise<unknown>;

/**
 * Decorator that should be used on the Controller Method
 * when we need to refer to the request body, param, query, etc.
 * in the Method Body
 * @returns a function with the signature (arguments) matching that
 * of the provided `desirableParams`, which can then be **decorated**
 * with one of the Class Method decorators (e.g. `Get`, `Post`, etc.)
 * @example
 * ```ts
 * (@)Controller("/api/v1")
 * class MyClass {
 *   (@)Post("/:resource")
 *   (@)ControllerMethodArgs("body", "query", "param")
 *   doSomething(body, query, param, ctx): void {
 *     console.log(`endpoint called: /api/v1/${ctx.params.resource}`);
 *     console.log(`now let's do something with`, body, query, param);
 *   }
 * }
 * ```
 */
export const ControllerMethodArgs =
  (...desirableParams: ControllerMethodArg[]) =>
  (
    // deno-lint-ignore ban-types
    arg1: Function | object,
    arg2: ClassMethodDecoratorContext | string,
    // deno-lint-ignore no-explicit-any
    ...rest: any[]
    // deno-lint-ignore no-explicit-any
  ): any => {
    if (typeof arg1 === "function" && typeof arg2 === "object") {
      return decorateClassMethodTypeStandard(
        arg1,
        arg2,
        ...desirableParams,
      );
    }

    if (typeof arg1 === "object" && typeof arg2 === "string") {
      const methodDescriptor: PropertyDescriptor = rest[0];
      return decorateClassMethodTypeCloudflareWorker(
        arg1,
        arg2,
        methodDescriptor,
        ...desirableParams,
      );
    }

    throw new Error(ERR_UNSUPPORTED_CLASS_METHOD_DECORATOR_RUNTIME_BEHAVIOR);
  };

function decorateClassMethodTypeStandard(
  // deno-lint-ignore ban-types
  target: Function,
  context: ClassMethodDecoratorContext,
  ...consumerDesirableParams: ControllerMethodArg[]
): EnhancedHandler {
  debug(
    `invoking ControllerMethodArgs Decorator with Standard strategy`,
    context.name,
  );
  return getEnhancedHandler(target, ...consumerDesirableParams);
}

function decorateClassMethodTypeCloudflareWorker(
  _target: object,
  context: string, // from observations, this is the method name itself
  methodDescriptor: PropertyDescriptor,
  ...consumerDesirableParams: ControllerMethodArg[]
): void {
  debug(
    `invoking ControllerMethodArgs Decorator with CloudflareWorker strategy`,
    context,
  );
  const consumerSuppliedHandler = methodDescriptor.value;
  const enhancedHandler = getEnhancedHandler(
    consumerSuppliedHandler,
    ...consumerDesirableParams,
  );
  methodDescriptor.value = enhancedHandler;
}

function getEnhancedHandler(
  // deno-lint-ignore ban-types
  consumerSuppliedHandler: Function,
  ...consumerDesirableParams: ControllerMethodArg[]
): EnhancedHandler {
  const methodName = consumerSuppliedHandler.name;

  async function retVal(
    this: ThisType<unknown>,
    // deno-lint-ignore no-explicit-any
    ...args: any[]
  ): Promise<unknown> {
    // original args passed in by the framework: (ctx)
    const ctx: Context & RouteContext<string> = args.shift();

    let parsedReqBody: unknown;
    try {
      parsedReqBody = await _internal.parseOakReqBody(ctx);
    } catch (e) {
      return ctx.throw(
        400,
        `Unable to parse request body: ${(e as Error).message}`,
        {
          stack: (e as Error).stack,
        },
      );
    }

    const parsedReqSearchParams: Record<string, string> = {};
    try {
      ctx.request.url.searchParams.forEach((value: string, key: string) =>
        parsedReqSearchParams[key] = value
      );
    } catch (e) {
      return ctx.throw(
        400,
        `Unable to parse request search params: ${(e as Error).message}`,
        {
          stack: (e as Error).stack,
        },
      );
    }

    const decoratedArgs: unknown[] = [];
    // expected (decorated) args are "extracted" from `ctx`
    // per `consumerDesirableParams`
    for (const p of consumerDesirableParams) {
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
        case p === "headers": {
          // request headers
          const headers: Record<string, string> = {};
          ctx.request.headers.forEach((v: string, k: string) => headers[k] = v);
          decoratedArgs.push(headers);
          break;
        }
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

    return await consumerSuppliedHandler.call(
      this,
      ...decoratedArgs,
    );
  }

  Object.defineProperty(retVal, "name", {
    value: methodName,
    writable: false,
  });

  return retVal;
}

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

export const _internal = {
  parseOakReqBody,
  getEnhancedHandler,
  // decorateClassMethodTypeStandard,
  // decorateClassMethodTypeCloudflareWorker,
};
