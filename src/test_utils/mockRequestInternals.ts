import { type BodyType, type Request } from "../../dev_deps.ts";

export type MockRequestBodyDefinition = {
  type: BodyType;
  value: unknown;
};

/**
 * enhance a given mock request with desirable search params and body
 * @NOTE best to remove the use of this if/when the `oak` framework
 * provides its own mocking util for Request
 */
export function mockRequestInternals(
  request: Request,
  {
    mockRequestPath,
    mockRequestQuery,
    mockRequestBody,
  }: {
    mockRequestPath?: string;
    mockRequestQuery?: Record<string, string>;
    mockRequestBody?: MockRequestBodyDefinition;
  },
) {
  if (mockRequestPath) {
    Object.assign(request, {
      url: new URL(mockRequestPath, "http://localhost/"),
    });
  }
  if (mockRequestBody) {
    Object.assign(request, {
      body: getMockRequestBody(mockRequestBody),
    });
  }
  for (const key in mockRequestQuery) {
    request.url.searchParams.append(key, mockRequestQuery[key]);
  }
}

/**
 * generate mock request body
 * @NOTE best to remove the use of this if/when the `oak` framework
 * provides its own mocking util for Request and/or RequestBody
 */
// deno-lint-ignore no-explicit-any
function getMockRequestBody(args: { type: BodyType; value: any }): {
  type: () => BodyType;
  json: () => Promise<Record<string, unknown>>;
  text: () => Promise<string>;
  blob: () => Promise<Blob>;
  form: () => Promise<URLSearchParams>;
  formData: () => Promise<FormData>;
  arrayBuffer: () => Promise<ArrayBuffer>;
} {
  const { type, value } = args;
  return {
    type: () => type,
    json: () => Promise.resolve(value),
    text: () => Promise.resolve(value),
    blob: () => Promise.resolve(value),
    form: () => Promise.resolve(value),
    formData: () => Promise.resolve(value),
    arrayBuffer: () => Promise.resolve(value),
  };
}
