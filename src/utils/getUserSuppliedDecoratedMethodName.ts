import { ERR_UNSUPPORTED_CLASS_METHOD_DECORATOR_RUNTIME_BEHAVIOR } from "../Constants.ts";

export const getUserSuppliedDecoratedMethodName = (
  // deno-lint-ignore ban-types
  arg1: Function | object,
  arg2: ClassMethodDecoratorContext | string,
) => {
  if (typeof arg1 === "function" && typeof arg2 === "object") {
    return getUserSuppliedFnNameTypeStandard(arg1);
  } else if (typeof arg1 === "object" && typeof arg2 === "string") {
    return getUserSuppliedFnNameTypeCloudflareWorker(arg2);
  }
  throw new Error(ERR_UNSUPPORTED_CLASS_METHOD_DECORATOR_RUNTIME_BEHAVIOR);
};

// deno-lint-ignore ban-types
function getUserSuppliedFnNameTypeStandard(target: Function): string {
  return target.name;
}

function getUserSuppliedFnNameTypeCloudflareWorker(fnName: string): string {
  return fnName;
}
