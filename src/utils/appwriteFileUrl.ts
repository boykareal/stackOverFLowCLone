import "server-only";

import env from "@/app/env";

/**
 * Returns the public Appwrite file-view endpoint without requesting image
 * transformations. Public question attachments can be displayed on every
 * Appwrite plan, including plans without preview transformations.
 */
export function getPublicFileViewUrl(bucketId: string, fileId: string) {
  const endpoint = env.appwrite.endpoint.replace(/\/$/, "");
  const bucket = encodeURIComponent(bucketId);
  const file = encodeURIComponent(fileId);
  const project = encodeURIComponent(env.appwrite.projectId);

  return `${endpoint}/storage/buckets/${bucket}/files/${file}/view?project=${project}`;
}
