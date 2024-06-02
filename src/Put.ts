import { debug } from "./utils/logger.ts";
import { register } from "./Store.ts";

/**
 * Decorator that should be used on the Controller Class Method
 * for PUT endpoints
 */
export const Put = (path: string = "") =>
// deno-lint-ignore ban-types
(target: Function, context: ClassMemberDecoratorContext): void => {
  debug(
    `invoking Put MethodDecorator for ${target.name} with pathPrefix ${path}`,
    context,
  );
  register("put", path, target.name);
};
