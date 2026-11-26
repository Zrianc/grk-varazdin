import { promises as fs } from "fs";
import path from "path";

const TYPES: Record<string, string> = { jpg: "image/jpeg", png: "image/png", webp: "image/webp", avif: "image/avif", svg: "image/svg+xml", pdf: "application/pdf" };

export async function GET(_: Request, { params }: { params: Promise<{ path: string[] }> }) {
  const parts = (await params).path;
  const name = parts.join("/");
  if (name.includes("..") || parts.length !== 1) return new Response("Not found", { status: 404 });
  const ext = name.split(".").pop() || "";
  try {
    const buf = await fs.readFile(path.join(process.cwd(), "data", "uploads", name));
    return new Response(new Uint8Array(buf), {
      headers: {
        "Content-Type": TYPES[ext] || "application/octet-stream",
        "Cache-Control": "public, max-age=31536000, immutable",
        ...(ext === "svg" ? { "Content-Security-Policy": "script-src 'none'" } : {}),
      },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
