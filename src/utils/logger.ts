/**
 * proxies to `console.debug` but acts as a no-op unless the `DEBUG`
 * env var is declared
 */
export const debug = (...data: any[]): void => {
  if (Deno.env.get("DEBUG")) {
    console.debug(...data);
  }
};
