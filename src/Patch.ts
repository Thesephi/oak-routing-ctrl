import { debug } from "./utils/logger.ts";
import { register } from "./Store.ts";
import { getUserSuppliedDecoratedMethodName } from "./utils/getUserSuppliedDecoratedMethodName.ts";
import type { OakOpenApiSpec } from "./utils/schema_utils.ts";
import { updateOas } from "./oasStore.ts";

type MethodDecorator = (
  // deno-lint-ignore ban-types
  arg1: Function | object,
  arg2: ClassMethodDecoratorContext | string,
) => void;

/**
 * Decorator that should be used on the Controller Class Method
 * for `PATCH` endpoints
 * @example
 * ```ts
 * import { Controller, Patch } from "@dklab/oak-routing-ctrl"
 *
 * ;@Controller()
 * class ExampleClass {
 *   ;@Patch("/")
 *   async adjustSomething() {
 *     // implementation
 *   }
 * }
 * ```
 */
export const Patch = (
  path: string = "",
  openApiSpec?: OakOpenApiSpec,
): MethodDecorator =>
(arg1, arg2): void => {
  const fnName: string = getUserSuppliedDecoratedMethodName(arg1, arg2);
  debug(
    `invoking Patch MethodDecorator for ${fnName} with pathPrefix ${path} -`,
    `runtime provides context:`,
    arg2,
  );
  register("patch", path, fnName);
  updateOas(fnName, "patch", path, openApiSpec);
};

export const _internal = { Patch };
