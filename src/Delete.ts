import { debug } from "./utils/logger.ts";
import { register } from "./Store.ts";

/**
 * Decorator that should be used on the Controller Class Method
 * for DELETE endpoints
 */
export const Delete = (path: string = "") =>
// deno-lint-ignore ban-types
(target: Function, context: ClassMethodDecoratorContext) => {
  debug(
    `invoking Delete MethodDecorator for ${target.name} with pathPrefix ${path}`,
    context,
  );
  register("delete", path, target.name);
};
