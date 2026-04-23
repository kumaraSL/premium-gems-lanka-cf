import { SignJWT, jwtVerify } from 'jose';

export interface JWTPayload {
  sub: string; // user id
  email: string;
  name: string;
  role: 'customer' | 'admin';
  iat?: number;
  exp?: number;
}

function getSecret(secret: string): Uint8Array {
  return new TextEncoder().encode(secret);
}

export async function signToken(payload: JWTPayload, secret: string): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(getSecret(secret));
}

export async function verifyToken(token: string, secret: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret(secret));
    return payload as unknown as JWTPayload;
  } catch {
    return null;
  }
}

export function getTokenFromRequest(request: Request): string | null {
  const authHeader = request.headers.get('Authorization');
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.slice(7);
  }
  const cookie = request.headers.get('Cookie');
  if (cookie) {
    const match = cookie.match(/auth_token=([^;]+)/);
    if (match) return match[1];
  }
  return null;
}

export function setAuthCookie(token: string): string {
  return `auth_token=${token}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=${7 * 24 * 60 * 60}`;
}

export function clearAuthCookie(): string {
  return `auth_token=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0`;
}
