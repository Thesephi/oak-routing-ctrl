import { type OakOpenApiSpec, type RouteConfig } from "../deps.ts";
import { SupportedVerb } from "./Store.ts";
import { debug } from "./utils/logger.ts";

// export type OasRouteConfig = {
//   method: SupportedVerb;
//   path: string;
//   request: {
//     params?: object; // RouteParameter from Zod
//     body?: ZodRequestBody;
//     query?: object; // RouteParameter from Zod
//   };
//   responses?: {
//     [statusCode: string]: ResponseConfig;
//   };
//   // @TODO cookies & headers
// };

// fnName|method|path => OasRouteConfig
export const oasStore: Map<string, RouteConfig> = new Map();

const getRouteId = (
  fnName: string,
  method: SupportedVerb,
  path: string,
) => `${fnName}|${method}|${path}`;

/**
 * input: `/some/:foo/and/:bar`
 * output: `/some/{foo}/and/{bar}`
 */
const getOasCompatPath = (path: string) =>
  path.replace(
    /\/:([a-zA-Z0-9]*)/g,
    "/{$1}",
  );

/**
 * updates OpenApiSpec for a given API resource
 * identified (keyed) by the tuple (fnName + method + path);
 * @NOTE this function can be called multiple times
 * to accumulatively update the same API resources,
 * e.g. replace a "short path" with a "full path"
 */
export const updateOas = (
  fnName: string,
  method: SupportedVerb,
  path: string,
  specs?: Partial<OakOpenApiSpec>,
): void => {
  // if developer doesn't supply `specs` then bail early
  // because we don't want "documentation without consent"
  if (!specs) return;

  const oasRouteIdentifier = getRouteId(fnName, method, path);

  const oasPath = getOasCompatPath(path);

  const existing = oasStore.get(oasRouteIdentifier) || {
    method,
    path: oasPath,
    request: {},
    responses: {},
  };

  const updated = {
    ...existing,
    method,
    path: oasPath,
    request: {
      ...existing.request,
      ...specs?.request,
    },
    responses: {
      ...existing.responses,
      ...specs?.responses,
    },
  };

  debug(`OpenApiSpec: recording for [${method}] ${path}`);

  oasStore.set(oasRouteIdentifier, updated);
};

export const patchOasPath = (
  fnName: string,
  method: SupportedVerb,
  path: string,
) => {
  oasStore.forEach((storedSpecs, routeId) => {
    const [storedFnName, storedMethod, storedPath] = routeId.split("|");
    if (
      fnName === storedFnName &&
      method === storedMethod &&
      path.length > storedPath.length &&
      path.endsWith(storedPath)
    ) {
      debug(`OpenApiSpec: patching ${storedSpecs.path} to ${path}`);
      storedSpecs.path = getOasCompatPath(path);
    }
  });
};
