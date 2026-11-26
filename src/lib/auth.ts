// Potpisani kolačić sesije (HMAC-SHA256, Web Crypto – radi i u middlewareu i u Node okruženju).
export const COOKIE = "grk_admin";
const TTL = 60 * 60 * 12; // 12 h

const enc = new TextEncoder();
const secret = () => process.env.ADMIN_SECRET || process.env.ADMIN_PASSWORD || "dev-secret-promijeni";

async function hmac(data: string) {
  const key = await crypto.subtle.importKey("raw", enc.encode(secret()), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(data));
  return Array.from(new Uint8Array(sig)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

export async function createToken() {
  const exp = Math.floor(Date.now() / 1000) + TTL;
  return `${exp}.${await hmac(String(exp))}`;
}

export async function verifyToken(token?: string) {
  if (!token) return false;
  const [exp, sig] = token.split(".");
  if (!exp || !sig || +exp < Date.now() / 1000) return false;
  const good = await hmac(exp);
  if (good.length !== sig.length) return false;
  let diff = 0;
  for (let i = 0; i < good.length; i++) diff |= good.charCodeAt(i) ^ sig.charCodeAt(i);
  return diff === 0;
}

export const cookieOptions = { httpOnly: true, sameSite: "lax" as const, secure: process.env.NODE_ENV === "production", path: "/", maxAge: TTL };
