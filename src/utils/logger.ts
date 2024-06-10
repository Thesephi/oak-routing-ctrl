/**
 * proxies to `console.debug` but acts as a no-op unless the `DEBUG`
 * env var is declared
 */
export const debug = (...data: unknown[]): void => {
  const potentialDebugEnv = globalThis.Deno?.env.get("DEBUG")?.toLowerCase();
  if (
    potentialDebugEnv === "true" ||
    potentialDebugEnv?.includes("oak-routing-ctrl")
  ) {
    console.debug(...data);
  }
};
