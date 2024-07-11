export { join } from "jsr:@std/path@^0.225.2";

export { Router } from "jsr:@oak/oak@^16.1.0";

export type {
  Application,
  Context,
  Next,
  RouteContext,
} from "jsr:@oak/oak@^16.1.0";

import {
  extendZodWithOpenApi,
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
  OpenApiGeneratorV3,
  OpenAPIRegistry,
  type ZodRequestBody,
} from "npm:@asteasolutions/zod-to-openapi@^7.1.1";

export { type OpenAPIObjectConfig } from "npm:@asteasolutions/zod-to-openapi@^7.1.1/dist/v3.0/openapi-generator";

// must import from `npm:` instead of from `deno.land` to be compatible with `@asteasolutions/zod-to-openapi`
import { z as slowTypedZ } from "npm:zod@^3.23.8";
extendZodWithOpenApi(slowTypedZ);
type SubsetOfZ = Pick<
  typeof slowTypedZ,
  | "string"
  | "object"
  | "array"
  | "number"
  | "boolean"
  | "date"
  | "any"
  | "enum"
  | "function"
  | "lazy"
  | "void"
  | "promise"
  | "null"
  | "never"
  | "map"
  | "bigint"
  | "symbol"
  | "strictObject"
  | "transformer"
  | "literal"
  | "coerce"
  | "custom"
  | "util"
  | "tuple"
  | "record"
  | "preprocess"
  | "nan"
  | "datetimeRegex"
  | "discriminatedUnion"
  | "intersection"
  | "pipeline"
  | "ZodSchema"
  | "Schema"
>;
/**
 * entry to the `Zod` API, enhanced with `@asteasolutions/zod-to-openapi`;
 * for usage documentation please refer to https://github.com/asteasolutions/zod-to-openapi?tab=readme-ov-file#purpose-and-quick-example
 */
export const z: SubsetOfZ = slowTypedZ;
