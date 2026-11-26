import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { COLLECTIONS, read, write } from "@/lib/content";
import type { CollectionKey } from "@/lib/types";

type P = { params: Promise<{ collection: string }> };
const OBJECTS: CollectionKey[] = ["settings", "history"];

function key(c: string) {
  return (COLLECTIONS as string[]).includes(c) ? (c as CollectionKey) : null;
}

export async function GET(_: Request, { params }: P) {
  const k = key((await params).collection);
  if (!k) return NextResponse.json({ error: "Nepoznata zbirka." }, { status: 404 });
  return NextResponse.json(await read(k));
}

export async function PUT(req: Request, { params }: P) {
  const k = key((await params).collection);
  if (!k) return NextResponse.json({ error: "Nepoznata zbirka." }, { status: 404 });
  const body = await req.json().catch(() => null);
  const isObj = OBJECTS.includes(k);
  if (isObj ? !body || typeof body !== "object" || Array.isArray(body) : !Array.isArray(body))
    return NextResponse.json({ error: "Neispravan format podataka." }, { status: 400 });
  if (!isObj) {
    const ids = new Set<string>();
    for (const it of body as { id?: string; slug?: string }[]) {
      if (!it.id) return NextResponse.json({ error: "Svaki zapis mora imati id." }, { status: 400 });
      if (ids.has(it.id)) return NextResponse.json({ error: `Dvostruki id: ${it.id}` }, { status: 400 });
      ids.add(it.id);
    }
    const slugs = (body as { slug?: string }[]).map((x) => x.slug).filter(Boolean);
    if (new Set(slugs).size !== slugs.length) return NextResponse.json({ error: "Adrese (slug) moraju biti jedinstvene." }, { status: 400 });
  }
  await write(k, body);
  revalidatePath("/", "layout");
  return NextResponse.json({ ok: true });
}
