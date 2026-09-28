/**
 * Recursively converts objects (such as those returned by node-appwrite,
 * which parse JSON with null prototypes via json-bigint) into standard plain
 * JavaScript objects compatible with Next.js Server Components serialization.
 */
export function toPlainObject<T>(data: T): T {
  if (data === undefined || data === null) {
    return data;
  }
  return JSON.parse(JSON.stringify(data)) as T;
}
