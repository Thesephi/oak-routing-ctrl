import { debug } from "./utils/logger.ts";
import { type Application, Router, Status } from "@oak/oak";
import { z } from "./utils/schema_utils.ts";
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
    const ctrl: unknown = new Ctrl();
    const ctrlProps: string[] = Object.getOwnPropertyNames(Ctrl.prototype);
    for (const propName of ctrlProps) {
      if (propName === "constructor") continue;
      const fqFnName = `${Ctrl.name}.${propName}`;
      const pair = store.get(fqFnName);
      if (!pair) continue;
      for (const [path, verb] of pair) {
        oakRouter[verb](
          path,
          async (ctx, next): Promise<void> => {
            // since 0.14.0, multiple paths can be registered on the
            // same handler function, so it's useful to have a pointer
            // to the currently registered path every time the handler is
            // invoked per match
            ctx.state._oakRoutingCtrl_regPath = path;
            debug(
              `handling literally-registered path ${path} with ${fqFnName}`,
            );

            const handler = Object.getOwnPropertyDescriptor(
              Ctrl.prototype,
              propName,
            )?.value;
            try {
              const handlerRetVal = await handler.call(ctrl, ctx);
              // some developers set body within the handler,
              // some developers return something from the handler
              // and expect that it gets assigned to the response,
              // so by doing the following, we satisfy both use cases
              ctx.response.body = ctx.response.body ?? handlerRetVal;
            } catch (e) {
              if (e instanceof z.ZodError) {
                return ctx.throw(Status.BadRequest, (e as Error).toString());
              }
              throw e;
            }
            await next();
          },
        );
        debug(`mapping route [${verb}] ${path} -> ${fqFnName}`);
      }
    }
  }
  app.use(oakRouter.routes());
  app.use(oakRouter.allowedMethods());
};

/**
 * alias of {@linkcode useOakServer}
 */
export const useOak = useOakServer;

export const _internal = { oakRouter };
