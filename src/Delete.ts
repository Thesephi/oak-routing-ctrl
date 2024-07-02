import { debug } from "./utils/logger.ts";
import { register } from "./Store.ts";
import { getUserSuppliedDecoratedMethodName } from "./utils/getUserSuppliedDecoratedMethodName.ts";
import { type OakOpenApiSpec } from "../deps.ts";
import { updateOas } from "./oasStore.ts";

/**
 * Decorator that should be used on the Controller Class Method
 * for DELETE endpoints
 */
export const Delete = (
  path: string = "",
  openApiSpec?: OakOpenApiSpec,
) =>
// deno-lint-ignore ban-types
(arg1: Function | object, arg2: ClassMethodDecoratorContext | string): void => {
  const fnName: string = getUserSuppliedDecoratedMethodName(arg1, arg2);
  debug(
    `invoking Delete MethodDecorator for ${fnName} with pathPrefix ${path} -`,
    `runtime provides context:`,
    arg2,
  );
  register("delete", path, fnName);
  updateOas(fnName, "delete", path, openApiSpec);
};

export const _internal = { Delete };
