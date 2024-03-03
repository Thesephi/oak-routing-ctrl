import { debug } from "./utils/logger.ts";
import { Application, Router, RouterMiddleware, State } from "../deps.ts";
import type { Controller } from "./Controller.ts";
import { BaseController } from "./Controller.ts";
import { store } from "./Store.ts";

const oakRouter: Router = new Router({});

/**
 * entry method to supercharge an `oak` application with routing-controllers -like
 * capabilities (i.e. Controller Class and Method Decorators)
 */
export const useOakServer = (
  app: Application,
  Controllers: Controller[],
): void => {
  for (const Ctrl of Controllers) {
    const _: BaseController = new Ctrl();
    const ctrlProps: string[] = Object.getOwnPropertyNames(Ctrl.prototype);
    for (const propName of ctrlProps) {
      if (propName === "constructor") continue;
      const pair = store.get(propName);
      if (!pair) continue;
      for (const [verb, path] of pair) {
        oakRouter[verb](path, (async (ctx) => {
          const handler = Object.getOwnPropertyDescriptor(
            Ctrl.prototype,
            propName,
          )?.value;
          ctx.response.body = await handler(ctx);
        }) as RouterMiddleware<string, any, State>);
        debug(`mapping route [${verb}] ${path} -> ${propName}`);
      }
    }
  }
  app.use(oakRouter.routes());
  app.use(oakRouter.allowedMethods());
};
