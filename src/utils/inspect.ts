export const inspect = (obj: unknown, opts?: { depth?: number }): string =>
  globalThis.Deno ? Deno.inspect(obj, opts) : JSON.stringify(obj, undefined, 2);
