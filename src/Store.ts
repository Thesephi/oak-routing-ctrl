export type SupportedVerb =
  | "get"
  | "post"
  | "put"
  | "delete"
  | "patch"
  | "head"
  | "options";

export const store: Map<string, Map<string, SupportedVerb>> = new Map();

/**
 * internal library helper method, used to keep track of the declared
 * handler functions and their corresponding HTTP methods and paths
 */
export const register = (
  verb: SupportedVerb,
  path: string,
  fnName: string,
): void => {
  const normalizedVerb: SupportedVerb = verb.toLowerCase() as SupportedVerb;
  const existingPair = store.get(fnName);
  if (existingPair) {
    // @NOTE that we intentionally allow multiple paths registered on the
    // same verb e.g.
    // - @Get('/foo') AND @Get('/foo/bar')
    // - @Get('/foo') AND @Get('/bar')
    // - @Get('/foo/:bar') AND @Get('/foo/bar')
    existingPair.set(path, normalizedVerb);
  } else {
    store.set(fnName, new Map([[path, normalizedVerb]]));
  }
};
