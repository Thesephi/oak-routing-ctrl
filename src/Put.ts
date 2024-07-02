import { debug } from "./utils/logger.ts";
import { register } from "./Store.ts";
import { getUserSuppliedDecoratedMethodName } from "./utils/getUserSuppliedDecoratedMethodName.ts";
import { type OasRouteConfig } from "../deps.ts";
import { updateOas } from "./oasStore.ts";

/**
 * Decorator that should be used on the Controller Class Method
 * for PUT endpoints
 */
export const Put = (
  path: string = "",
  openApiSpecs?: OasRouteConfig,
) =>
// deno-lint-ignore ban-types
(arg1: Function | object, arg2: ClassMethodDecoratorContext | string): void => {
  const fnName: string = getUserSuppliedDecoratedMethodName(arg1, arg2);
  debug(
    `invoking Put MethodDecorator for ${fnName} with pathPrefix ${path} -`,
    `runtime provides context:`,
    arg2,
  );
  register("put", path, fnName);
  updateOas(fnName, "put", path, openApiSpecs);
};

export const _internal = { Put };
