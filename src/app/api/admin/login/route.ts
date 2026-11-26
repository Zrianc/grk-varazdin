import { NextResponse } from "next/server";
import { COOKIE, cookieOptions, createToken } from "@/lib/auth";

export async function POST(req: Request) {
  const { password } = await req.json().catch(() => ({ password: "" }));
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return NextResponse.json({ error: "ADMIN_PASSWORD nije postavljen na poslužitelju (.env.local)." }, { status: 500 });
  if (password !== expected) {
    await new Promise((r) => setTimeout(r, 800));
    return NextResponse.json({ error: "Pogrešna lozinka." }, { status: 401 });
  }
  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE, await createToken(), cookieOptions);
  return res;
}
