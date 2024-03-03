type SupportedVerb = "get" | "post" | "put" | "delete" | "patch";

export const store: Map<string, Map<SupportedVerb, string>> = new Map();

export const register = (
  verb: SupportedVerb,
  path: string,
  fnName: string,
): void => {
  const normalizedVerb: SupportedVerb = verb.toLowerCase() as SupportedVerb;
  const existingPair = store.get(fnName);
  if (existingPair) {
    existingPair.set(normalizedVerb, path);
  } else {
    store.set(fnName, new Map([[normalizedVerb, path]]));
  }
};
