import { join } from "@std/path";
import { debug } from "./utils/logger.ts";
import { store } from "./Store.ts";
import { patchOasPath } from "./oasStore.ts";

/**
 * Just a standard Class, that can be decorated with the {@linkcode Controller} decorator
 */
export type ControllerClass = new (args?: unknown) => unknown;

type ClassDecorator = (
  target: ControllerClass,
  context?: ClassDecoratorContext,
) => void;

/**
 * Decorator that should be used on the Controller Class
 * @NOTE under `experimentalDecorators`, `context` is not available
 * @example
 * ```ts
 * ;@Controller("/api/")
 * class ExampleClass {
 *   // functions that handle endpoints starting with `/api/`
 * }
 * ```
 */
export const Controller =
  (pathPrefix: string = ""): ClassDecorator => (target, context): void => {
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
