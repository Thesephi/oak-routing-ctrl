import { debug } from "./utils/logger.ts";
import { Application, Router } from "../deps.ts";
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
          async (ctx) => {
            const handler = Object.getOwnPropertyDescriptor(
              Ctrl.prototype,
              propName,
            )?.value;
            const handlerRetVal = await handler(ctx);
            // some developers set body within the handler,
            // some developers return something from the handler
            // and expect that it gets assigned to the response,
            // so by doing the following, we satisfy both use cases
            ctx.response.body = ctx.response.body ?? handlerRetVal;
          },
        );
        debug(`mapping route [${verb}] ${path} -> ${propName}`);
      }
    }
  }
  app.use(oakRouter.routes());
  app.use(oakRouter.allowedMethods());
};

export const _internal = { oakRouter };
