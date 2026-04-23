export interface R2Env {
  MEDIA_BUCKET: R2Bucket;
}

export async function uploadToR2(
  bucket: R2Bucket,
  file: File,
  folder: string
): Promise<string> {
  const ext = file.name.split('.').pop() || 'bin';
  const key = `${folder}/${Date.now()}_${crypto.randomUUID()}.${ext}`;
  await bucket.put(key, file.stream(), {
    httpMetadata: { contentType: file.type },
  });
  return key;
}

export function getPublicUrl(key: string, publicBaseUrl: string): string {
  return `${publicBaseUrl}/${key}`;
}

export async function deleteFromR2(bucket: R2Bucket, key: string): Promise<void> {
  await bucket.delete(key);
}

export async function serveR2Object(
  bucket: R2Bucket,
  key: string
): Promise<Response> {
  const obj = await bucket.get(key);
  if (!obj) {
    return new Response('Not Found', { status: 404 });
  }
  const headers = new Headers();
  obj.writeHttpMetadata(headers);
  headers.set('etag', obj.httpEtag);
  headers.set('Cache-Control', 'public, max-age=31536000');
  return new Response(obj.body, { headers });
}
