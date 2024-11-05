export { join } from "jsr:@std/path@^1.0.8";

export { Router, Status } from "jsr:@oak/oak@^17.1.3";

export type {
  Application,
  Context,
  ErrorStatus,
  Next,
  RouteContext,
} from "jsr:@oak/oak@^17.1.3";

import {
  extendZodWithOpenApi,
  type ResponseConfig,
  type RouteConfig,
} from "npm:@asteasolutions/zod-to-openapi@^7.2.0";

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
} from "npm:@asteasolutions/zod-to-openapi@^7.2.0";

export { type OpenAPIObjectConfig } from "npm:@asteasolutions/zod-to-openapi@^7.2.0/dist/v3.0/openapi-generator";

// must import from `npm:` instead of from `deno.land` to be compatible with `@asteasolutions/zod-to-openapi`
import { z as slowTypedZ } from "npm:zod@^3.23.8";
extendZodWithOpenApi(slowTypedZ);
type SubsetOfZ = Pick<
  typeof slowTypedZ,
  | "object"
  | "array"
  | "string"
  | "number"
  | "boolean"
  | "void"
  | "undefined"
  | "null"
  | "enum"
  | "addIssueToContext"
  | "any"
  | "bigint"
  | "coerce"
  | "custom"
  | "date"
  | "datetimeRegex"
  | "defaultErrorMap"
  | "discriminatedUnion"
  | "effect"
  | "function"
  | "getErrorMap"
  | "getParsedType"
  | "instanceof"
  | "intersection"
  | "isAborted"
  | "isAsync"
  | "isDirty"
  | "isValid"
  | "late"
  | "lazy"
  | "literal"
  | "makeIssue"
  | "map"
  | "objectUtil"
  | "oboolean"
  | "onumber"
  | "optional"
  | "ostring"
  | "pipeline"
  | "preprocess"
  | "promise"
  | "quotelessJson"
  | "record"
  | "set"
  | "setErrorMap"
  | "strictObject"
  | "symbol"
  | "transformer"
  | "tuple"
  | "union"
  | "unknown"
  | "util"
  | "ZodError"
>;
/**
 * entry to the `Zod` API, enhanced with `@asteasolutions/zod-to-openapi`;
 * for usage documentation please refer to https://github.com/asteasolutions/zod-to-openapi?tab=readme-ov-file#purpose-and-quick-example
 * @example
 * ```ts
 * const SomeZodSchema = z.object({ name: z.string() });
 * ```
 */
export const z: SubsetOfZ = slowTypedZ;

/**
 * re-exported `z.infer` type inference API;
 * for usage documentation please refer to https://github.com/colinhacks/zod?tab=readme-ov-file#type-inference
 * @example
 * ```ts
 * const SomeZodSchema = z.object({ name: z.string() });
 * const somePathParam: zInfer<typeof SomeZodSchema> = { name: "foo" };
 * ```
 */
export type zInfer<T extends slowTypedZ.ZodType> = slowTypedZ.infer<T>;
