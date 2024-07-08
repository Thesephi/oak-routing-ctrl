export { join } from "jsr:@std/path@^0.225.2";

export { Router } from "jsr:@oak/oak@^16.1.0";

export type {
  Application,
  Context,
  Next,
  RouteContext,
} from "jsr:@oak/oak@^16.1.0";

import {
  type ResponseConfig,
  type RouteConfig,
} from "npm:@asteasolutions/zod-to-openapi@^7.1.1";

export type OakOpenApiSpec =
  & Omit<RouteConfig, "method" | "path" | "responses">
  & {
    responses?: {
      [statusCode: string]: ResponseConfig;
    };
  };

export { type ResponseConfig, type RouteConfig };

export {
  extendZodWithOpenApi,
  OpenApiGeneratorV3,
  OpenAPIRegistry,
  type ZodRequestBody,
} from "npm:@asteasolutions/zod-to-openapi@^7.1.1";

export { type OpenAPIObjectConfig } from "npm:@asteasolutions/zod-to-openapi@^7.1.1/dist/v3.0/openapi-generator";

export { z } from "npm:zod@^3.23.8"; // must export from npm: instead from deno.land to be compatible with zod-to-openapi
