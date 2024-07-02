import { debug } from "./utils/logger.ts";
import { register } from "./Store.ts";
import { getUserSuppliedDecoratedMethodName } from "./utils/getUserSuppliedDecoratedMethodName.ts";
import { type OasRouteConfig } from "../deps.ts";
import { updateOas } from "./oasStore.ts";

/**
 * Decorator that should be used on the Controller Class Method
 * for PATCH endpoints
 */
export const Patch = (
  path: string = "",
  openApiSpecs?: OasRouteConfig,
) =>
// deno-lint-ignore ban-types
(arg1: Function | object, arg2: ClassMethodDecoratorContext | string): void => {
  const fnName: string = getUserSuppliedDecoratedMethodName(arg1, arg2);
  debug(
    `invoking Patch MethodDecorator for ${fnName} with pathPrefix ${path} -`,
    `runtime provides context:`,
    arg2,
  );
  register("patch", path, fnName);
  updateOas(fnName, "patch", path, openApiSpecs);
};

export const _internal = { Patch };
