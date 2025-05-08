import type { RouteConfig } from "@asteasolutions/zod-to-openapi";
import type { OakOpenApiSpec } from "./utils/schema_utils.ts";
import type { SupportedVerb } from "./Store.ts";
import { debug } from "./utils/logger.ts";

type TheRouteConfig = RouteConfig & {
  tags?: string[];
};

const TMP_CTRL_NAME = "FILLED_LATER";

// ctrlName|fnName|method|path => OasRouteConfig
export const oasStore: Map<string, TheRouteConfig> = new Map();

const getRouteId = (
  ctrlName: string,
  fnName: string,
  method: SupportedVerb,
  path: string,
) => `${ctrlName}|${fnName}|${method}|${path}`;

/**
 * input: `/some/:foo/and/:bar`
 * output: `/some/{foo}/and/{bar}`
 */
const getOasCompatPath = (path: string) =>
  path.replace(
    /\/:([a-zA-Z0-9_]*)/g,
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

  const oasRouteIdentifier = getRouteId(TMP_CTRL_NAME, fnName, method, path);

  const oasPath = getOasCompatPath(path);

  const existing = oasStore.get(oasRouteIdentifier) || {
    method,
    path: oasPath,
    request: {},
    responses: {},
  };

  const updated = {
    ...existing,
    ...specs,
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
    operationId: specs?.operationId,
    tags: specs?.tags,
  };

  debug(`[${TMP_CTRL_NAME}] OpenApiSpec: recording for [${method}] ${path}`);

  oasStore.set(oasRouteIdentifier, updated);
};

/**
 * patch the Open API Spec config, designed to be invoked in the context of the `@Controller` decorator
 * @param ctrlName the name of the class being decorated with `@Controller`
 * @param fnName the name of the function being decorated with e.g. `@Get`, `@Post`, and so on
 */
export const patchOasPath = (
  ctrlName: string,
  fnName: string,
  method: SupportedVerb,
  path: string,
) => {
  for (const [routeId, storedSpecs] of oasStore) {
    const [storedCtrlName, storedFnName, storedMethod, storedPath] = routeId
      .split("|");

    if (
      storedCtrlName === TMP_CTRL_NAME &&
      fnName === storedFnName &&
      method === storedMethod &&
      path.length >= storedPath.length &&
      path.endsWith(storedPath)
    ) {
      storedSpecs.path = getOasCompatPath(path);
      const newRouteId = getRouteId(ctrlName, fnName, method, path);
      oasStore.delete(routeId);
      oasStore.set(newRouteId, storedSpecs);
      debug(
        `[${ctrlName}] OpenApiSpec: patched [${method}] ${storedPath} to ${path}`,
      );
      break;
    }
  }
};

export const _internal = {
  getRouteId,
  getOasCompatPath,
};
