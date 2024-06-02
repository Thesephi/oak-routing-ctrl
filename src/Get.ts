import { debug } from "./utils/logger.ts";
import { register } from "./Store.ts";

/**
 * Decorator that should be used on the Controller Class Method
 * for GET endpoints
 */
export const Get = (path: string = "") =>
// deno-lint-ignore ban-types
(target: Function, context: ClassMethodDecoratorContext): void => {
  debug(
    `invoking Get MethodDecorator for ${target.name} with pathPrefix ${path}`,
    context,
  );
  register("get", path, target.name);
};
