import { Application } from "../deps.ts";
import { oasStore } from "./oasStore.ts";
import {
  OpenApiGeneratorV3,
  type OpenAPIObjectConfig,
  OpenAPIRegistry,
  type RouteConfig,
} from "../deps.ts";
import { debug } from "./utils/logger.ts";

const oasViewer = `
<!doctype html> <!-- Important: must specify -->
<html>
  <head>
    <meta charset="utf-8"> <!-- Important: rapi-doc uses utf8 characters -->
    <script type="module" src="https://unpkg.com/rapidoc/dist/rapidoc-min.js"></script>
  </head>
  <body>
    <rapi-doc spec-url = "/oas.json"> </rapi-doc>
  </body>
</html>
`;

const registry = new OpenAPIRegistry();

type UseOasConfig = Partial<OpenAPIObjectConfig> & {
  oasJsonServingPath: string; // e.g. /oas.json
  oasUiServingPath: string; // e.g. /swagger
};

export const useOas = (
  app: Application,
  cfg: UseOasConfig = {
    oasJsonServingPath: "/oas.json",
    oasUiServingPath: "/swagger",
  },
): void => {
  const { oasJsonServingPath, oasUiServingPath, ...oasCfg } = cfg;

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

  debug(Deno.inspect(apiDoc, { depth: 10 }));

  app.use(async (ctx, next) => {
    if (ctx.request.url.pathname === oasJsonServingPath) {
      ctx.response.body = apiDoc;
    } else if (ctx.request.url.pathname === oasUiServingPath) {
      ctx.response.body = oasViewer;
    }
    await next();
  });
};
