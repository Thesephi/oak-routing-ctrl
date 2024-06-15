export { useOakServer } from "./src/useOakServer.ts";
export { Controller } from "./src/Controller.ts";
export {
  type ControllerMethodArg,
  ControllerMethodArgs,
} from "./src/ControllerMethodArgs.ts";
export { Get } from "./src/Get.ts";
export { Post } from "./src/Post.ts";
export { Put } from "./src/Put.ts";
export { Patch } from "./src/Patch.ts";
export { Delete } from "./src/Delete.ts";

// expore Application from @oak/oak in case
// developers wish to use the exact same `oak` version
// referenced by `oak-routing-ctrl`
export { Application } from "./deps.ts";
