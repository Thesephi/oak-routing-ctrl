export const debug = (...data: any[]): void => {
  if (Deno.env.get("DEBUG")) {
    console.debug(...data);
  }
};
