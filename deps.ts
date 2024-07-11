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
  | "late"
  | "nullable"
  | "nativeEnum"
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
  | "union"
  | "undefined"
  | "unknown"
  | "objectUtil"
  | "pipeline"
  | "effect"
  | "optional"
  | "getParsedType"
  | "isAborted"
  | "isAsync"
  | "isDirty"
  | "isValid"
  | "instanceof"
  | "set"
  | "setErrorMap"
  | "getErrorMap"
  | "defaultErrorMap"
  | "addIssueToContext"
  | "makeIssue"
  | "oboolean"
  | "onumber"
  | "ostring"
  | "quotelessJson"
  | "ZodSchema"
  | "ZodObject"
  | "ZodAny"
  | "ZodArray"
  | "ZodBoolean"
  | "ZodDate"
  | "ZodDefault"
  | "ZodDiscriminatedUnion"
  | "ZodIntersection"
  | "ZodUnion"
  | "ZodEnum"
  | "ZodError"
  | "ZodEffects"
  | "ZodFunction"
  | "ZodBigInt"
  | "ZodNumber"
  | "ZodNativeEnum"
  | "ZodLazy"
  | "ZodNaN"
  | "ZodMap"
  | "ZodSymbol"
  | "ZodString"
  | "ZodNullable"
  | "ZodOptional"
  | "ZodPromise"
  | "ZodReadonly"
  | "ZodTuple"
  | "ZodType"
  | "ZodParsedType"
  | "ZodVoid"
  | "ZodUnknown"
  | "ZodNull"
  | "ZodNever"
  | "ZodUndefined"
  | "ZodLiteral"
  | "ZodPipeline"
  | "ZodRecord"
  | "ZodTransformer"
  | "ZodSet"
  | "ZodBranded"
  | "ZodCatch"
  | "ZodFirstPartyTypeKind"
  | "ZodIssueCode"
  | "ParseStatus"
  | "Schema"
  | "BRAND"
  | "DIRTY"
  | "EMPTY_PATH"
  | "INVALID"
  | "NEVER"
  | "OK"
>;
/**
 * entry to the `Zod` API, enhanced with `@asteasolutions/zod-to-openapi`;
 * for usage documentation please refer to https://github.com/asteasolutions/zod-to-openapi?tab=readme-ov-file#purpose-and-quick-example
 */
export const z: SubsetOfZ = slowTypedZ;
