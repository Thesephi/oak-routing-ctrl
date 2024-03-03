import { debug } from "./utils/logger.ts";
import { register } from "./Store.ts";

export const Post =
  (path: string = "") =>
  (target: Function, context: ClassMethodDecoratorContext) => {
    debug(
      `invoking Post MethodDecorator for ${target.name} with pathPrefix ${path}`,
      context,
      // target.constructor[Symbol.metadata],
    );
    register("post", path, target.name);
  };
