import { debug } from "./utils/logger.ts";
import { register } from "./Store.ts";
import { getUserSuppliedDecoratedMethodName } from "./utils/getUserSuppliedDecoratedMethodName.ts";
import { type OakOpenApiSpec } from "./utils/schema_utils.ts";
import { updateOas } from "./oasStore.ts";

type MethodDecorator = (
  // deno-lint-ignore ban-types
  arg1: Function | object,
  arg2: ClassMethodDecoratorContext | string,
) => void;

/**
 * Decorator that should be used on the Controller Class Method
 * for `DELETE` endpoints
 * @example
 * ```ts
 * import { Controller, Delete } from "@dklab/oak-routing-ctrl"
 *
 * ;@Controller()
 * class ExampleClass {
 *   ;@Delete("/:resource")
 *   async deleteSomething() {
 *     // implementation
 *   }
 * }
 * ```
 */
export const Delete = (
  path: string = "",
  openApiSpec?: OakOpenApiSpec,
): MethodDecorator =>
(arg1, arg2): void => {
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
