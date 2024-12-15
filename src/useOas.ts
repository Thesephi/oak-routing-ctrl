import { Application } from "@oak/oak";
import { oasStore } from "./oasStore.ts";
import {
  OpenApiGeneratorV3,
  OpenAPIRegistry,
  type RouteConfig,
} from "@asteasolutions/zod-to-openapi";
import { type OpenAPIObjectConfig } from "@asteasolutions/zod-to-openapi/dist/v3.0/openapi-generator";
import { debug } from "./utils/logger.ts";
import { inspect } from "./utils/inspect.ts";

const defaultOasJsonServingPath = "/oas.json";
const defaultOasUiServingPath = "/swagger";
const defaultOasUiTemplate = `
<!doctype html>
<html>
  <head>
    <meta charset="utf-8">
    <script type="module" src="https://unpkg.com/rapidoc/dist/rapidoc-min.js"></script>
  </head>
  <body>
    <rapi-doc spec-url="/oas.json" render-style="view" theme="dark"></rapi-doc>
  </body>
</html>
`;

const registry = new OpenAPIRegistry();

/**
 * interface for an object used to configure how the Open API Spec
 * is generated (e.g. `/oas.json`)
 */
export type UseOasConfig = Partial<OpenAPIObjectConfig> & {
  jsonPath?: string;
  uiPath?: string;
  uiTemplate?: string;
};

type UseOas = (
  app: Application,
  cfg?: UseOasConfig,
) => void;

const _useOas: UseOas = (
  app,
  cfg = {},
) => {
  const {
    jsonPath = defaultOasJsonServingPath,
    uiPath = defaultOasUiServingPath,
    uiTemplate = defaultOasUiTemplate,
    ...oasCfg
  } = cfg;

  oasStore.forEach((rc, fnName) => {
    if ("path" in rc && "method" in rc && "responses" in rc) {
      registry.registerPath(rc as RouteConfig);
    } else {
      debug(
        `WARNING: OAS RouteConfig for '${fnName}' lacks either 'path', 'method', or 'responses'`,
      );
    }
  });

  const generator = new OpenApiGeneratorV3(registry.definitions);
  const apiDoc = generator.generateDocument({
    openapi: "3.0.0",
    info: {
      version: "1.0.0",
      title: "My API",
      description: "This is the API",
    },
    servers: [{ url: "/" }],
    ...oasCfg,
  });

  debug("OpenApiSpec", inspect(apiDoc, { depth: 10 }));

  app.use(async (ctx, next) => {
    if (ctx.request.url.pathname === jsonPath) {
      ctx.response.body = apiDoc;
    } else if (ctx.request.url.pathname === uiPath) {
      ctx.response.body = uiTemplate;
    }
    await next();
  });
};

/**
 * helper method to enable Open API Spec for the routes
 * declared with oak-routing-ctrl decorators
 * @param {Application} app the {@linkcode Application} instance from `@oak/oak`
 * @param {UseOasConfig} [cfg] optional configuration object to
 * finetune the Open API spec documentation
 */
export const useOas = (
  app: Application,
  cfg: UseOasConfig = {},
): void => {
  try {
    _useOas(app, cfg);
  } catch (e) {
    debug(
      "unable to complete OpenApiSpec initialization:",
      (e as Error).message,
    );
  }
};

export const _internal = { registry };
