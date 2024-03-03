import { debug } from "./utils/logger.ts";
import { register } from "./Store.ts";

export const Delete =
  (path: string = "") =>
  (target: Function, context: ClassMethodDecoratorContext) => {
    debug(
      `invoking Delete MethodDecorator for ${target.name} with pathPrefix ${path}`,
      context,
    );
    register("delete", path, target.name);
  };
