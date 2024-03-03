import { debug } from "./utils/logger.ts";
import { register } from "./Store.ts";

export const Put =
  (path: string = "") =>
  (target: Function, context: ClassMemberDecoratorContext) => {
    debug(
      `invoking Put MethodDecorator for ${target.name} with pathPrefix ${path}`,
      context,
    );
    register("put", path, target.name);
  };
