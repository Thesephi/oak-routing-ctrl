import { join } from "@std/path/posix";
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
    const ctrlClassName = target.name;
    debug(
      `invoking ControllerDecorator for ${ctrlClassName} -`,
      "runtime provides context:",
      context,
    );
    const fnNames: string[] = Object.getOwnPropertyNames(target.prototype);
    for (const fnName of fnNames) {
      const pair = store.get(fnName);
      if (!pair) continue;
      const patchedPair = new Map();
      pair.forEach((verb, path) => {
        const fullPath = join(pathPrefix, path); // @NOTE **must** be posix style
        patchedPair.set(fullPath, verb);
        debug(
          `[${ctrlClassName}] @Controller: patched [${verb}] ${path} to ${fullPath}`,
        );
        // @TODO consider throwing if we discover 2 (or more) Controllers
        // sharing the exact same set of path, fnName, and method
        patchOasPath(ctrlClassName, fnName, verb, fullPath);
      });
      store.delete(fnName);
      const fqFnName = `${ctrlClassName}.${fnName}`;
      store.set(fqFnName, patchedPair);
    }
  };
