import { debug } from "./utils/logger.ts";
import { register } from "./Store.ts";

/**
 * Decorator that should be used on the Controller Class Method
 * for POST endpoints
 */
export const Post = (path: string = "") =>
// deno-lint-ignore ban-types
(target: Function, context: ClassMethodDecoratorContext): void => {
  debug(
    `invoking Post MethodDecorator for ${target.name} with pathPrefix ${path}`,
    context,
    // target.constructor[Symbol.metadata],
  );
  register("post", path, target.name);
};

export const _internal = { Post };
