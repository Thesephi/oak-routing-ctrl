const doInspect = globalThis.Deno
  ? Deno.inspect
  : (await import("node:util")).inspect;

export const inspect = (obj: unknown, opts?: object): string =>
  doInspect(obj, opts);
