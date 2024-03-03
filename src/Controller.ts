import { debug } from "./utils/logger.ts";
import { join } from "../deps.ts";
import { store } from "./Store.ts";

export abstract class BaseController {
  // [key: string]: (ctx: Context) => any
}

export type Controller = new () => BaseController;

/**
 * Decorator that should be used on the Controller Class
 */
export const Controller =
  (pathPrefix: string = "") =>
  (target: Controller, context: ClassDecoratorContext) => {
    debug(`invoking ControllerDecorator for ${target.name}`, context);
    const fnNames: string[] = Object.getOwnPropertyNames(target.prototype);
    for (const fnName of fnNames) {
      const pair = store.get(fnName);
      if (!pair) continue;
      pair.forEach((path, verb, p) => p.set(verb, join(pathPrefix, path)));
    }
  };
