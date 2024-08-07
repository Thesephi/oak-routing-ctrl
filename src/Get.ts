import { debug } from "./utils/logger.ts";
import { register } from "./Store.ts";
import { getUserSuppliedDecoratedMethodName } from "./utils/getUserSuppliedDecoratedMethodName.ts";
import { type OakOpenApiSpec } from "../deps.ts";
import { updateOas } from "./oasStore.ts";

/**
 * Decorator that should be used on the Controller Class Method
 * for GET endpoints
 */
export const Get = (
  path: string = "",
  openApiSpec?: OakOpenApiSpec,
) =>
// deno-lint-ignore ban-types
(arg1: Function | object, arg2: ClassMethodDecoratorContext | string): void => {
  const fnName: string = getUserSuppliedDecoratedMethodName(arg1, arg2);
  debug(
    `invoking Get MethodDecorator for ${fnName} with pathPrefix ${path} -`,
    `runtime provides context:`,
    arg2,
  );
  register("get", path, fnName);
  updateOas(fnName, "get", path, openApiSpec);
};

export const _internal = { Get };
