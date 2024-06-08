import { debug } from "./utils/logger.ts";
import { register } from "./Store.ts";

/**
 * Decorator that should be used on the Controller Class Method
 * for PATCH endpoints
 */
export const Patch = (path: string = "") =>
// deno-lint-ignore ban-types
(target: Function, context: ClassMemberDecoratorContext): void => {
  debug(
    `invoking Patch MethodDecorator for ${target.name} with pathPrefix ${path}`,
    context,
  );
  register("patch", path, target.name);
};

export const _internal = { Patch };
