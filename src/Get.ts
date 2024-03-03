import { debug } from "./utils/logger.ts";
import { register } from "./Store.ts";

export const Get =
  (path: string = "") =>
  (target: Function, context: ClassMethodDecoratorContext) => {
    debug(
      `invoking Get MethodDecorator for ${target.name} with pathPrefix ${path}`,
      context,
    );
    register("get", path, target.name);
  };
