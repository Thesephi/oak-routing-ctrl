import { debug } from "./utils/logger.ts";
import {
  Application,
  RouteParams,
  Router,
  RouterMiddleware,
  State,
} from "../deps.ts";
import type { ControllerClass } from "./Controller.ts";
import { store } from "./Store.ts";

const oakRouter: Router = new Router({});

/**
 * entry method to supercharge an `oak` application with routing-controllers -like
 * capabilities (i.e. Controller Class and Method Decorators)
 */
export const useOakServer = (
  app: Application,
  Controllers: ControllerClass[],
): void => {
  for (const Ctrl of Controllers) {
    new Ctrl();
    const ctrlProps: string[] = Object.getOwnPropertyNames(Ctrl.prototype);
    for (const propName of ctrlProps) {
      if (propName === "constructor") continue;
      const pair = store.get(propName);
      if (!pair) continue;
      for (const [verb, path] of pair) {
        oakRouter[verb](
          path,
          (async (ctx) => {
            const handler = Object.getOwnPropertyDescriptor(
              Ctrl.prototype,
              propName,
            )?.value;
            // @TODO consider the case where user already assigned ctx.response.body?
            ctx.response.body = await handler(ctx);
          }) as RouterMiddleware<string, RouteParams<string>, State>,
        );
        debug(`mapping route [${verb}] ${path} -> ${propName}`);
      }
    }
  }
  app.use(oakRouter.routes());
  app.use(oakRouter.allowedMethods());
};
