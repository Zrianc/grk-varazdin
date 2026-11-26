import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { slugify } from "@/lib/format";

const ALLOWED: Record<string, string> = {
  "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp", "image/avif": "avif", "image/svg+xml": "svg", "application/pdf": "pdf",
};
const MAX = 10 * 1024 * 1024;

/** Sprema datoteku u /data/uploads; poslužuje je ruta /uploads/[...path]. Za produkciju u oblaku zamijenite S3/R2/Cloudinary pohranom. */
export async function POST(req: Request) {
  const form = await req.formData();
  const file = form.get("file");
  if (!(file instanceof File)) return NextResponse.json({ error: "Nije poslana datoteka." }, { status: 400 });
  const ext = ALLOWED[file.type];
  if (!ext) return NextResponse.json({ error: "Dopušteni su JPG, PNG, WEBP, AVIF, SVG i PDF." }, { status: 400 });
  if (file.size > MAX) return NextResponse.json({ error: "Najveća veličina je 10 MB." }, { status: 400 });
  const base = slugify(file.name.replace(/\.[^.]+$/, "")).slice(0, 50) || "datoteka";
  const name = `${Date.now()}-${base}.${ext}`;
  const dir = path.join(process.cwd(), "data", "uploads");
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(path.join(dir, name), Buffer.from(await file.arrayBuffer()));
  return NextResponse.json({ url: `/uploads/${name}` });
}
