export const inspect = (obj: unknown, opts?: object): string =>
  globalThis.Deno ? Deno.inspect(obj, opts) : JSON.stringify(obj, undefined, 2);
