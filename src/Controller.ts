import { debug } from "./utils/logger.ts";
import { join } from "../deps.ts";
import { store } from "./Store.ts";
import { patchOasPath } from "./oasStore.ts";

/**
 * Just a standard Class, that can be decorated with the `@Controller` decorator
 */
export type ControllerClass = new (args?: unknown) => unknown;

/**
 * Decorator that should be used on the Controller Class
 */
export const Controller =
  (pathPrefix: string = "") =>
  (target: ControllerClass, context: ClassDecoratorContext): void => {
    debug(
      `invoking ControllerDecorator for ${target.name} -`,
      "runtime provides context:",
      context,
    );
    const fnNames: string[] = Object.getOwnPropertyNames(target.prototype);
    for (const fnName of fnNames) {
      const pair = store.get(fnName);
      if (!pair) continue;
      pair.forEach((path, verb, p) => {
        const fullPath = join(pathPrefix, path);
        p.set(verb, fullPath);
        patchOasPath(fnName, verb, fullPath);
      });
    }
  };
