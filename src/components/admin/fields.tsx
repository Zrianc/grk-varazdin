"use client";
import { useRef, useState } from "react";
import { Plus, Trash2, Upload, X } from "lucide-react";
import type { Field } from "@/lib/admin-schema";

export const inputCls = "w-full border border-charcoal/20 bg-white px-3 py-2 text-[15px] outline-none focus:border-red focus:ring-2 focus:ring-red/20";

// ISO (s pomakom) <-> vrijednost za datetime-local u zoni Europe/Zagreb
export function isoToLocal(iso?: string) {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(+d)) return "";
  const p = Object.fromEntries(new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Zagreb", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hour12: false }).formatToParts(d).map((x) => [x.type, x.value]));
  return `${p.year}-${p.month}-${p.day}T${p.hour === "24" ? "00" : p.hour}:${p.minute}`;
}
export function localToIso(v: string) {
  if (!v) return "";
  const guess = new Date(`${v}:00Z`);
  const zh = new Date(guess.toLocaleString("en-US", { timeZone: "Europe/Zagreb" }));
  const utc = new Date(guess.toLocaleString("en-US", { timeZone: "UTC" }));
  const off = Math.round((+zh - +utc) / 60000);
  const sign = off >= 0 ? "+" : "-";
  const hh = String(Math.floor(Math.abs(off) / 60)).padStart(2, "0");
  const mm = String(Math.abs(off) % 60).padStart(2, "0");
  return `${v}:00${sign}${hh}:${mm}`;
}

export async function uploadFile(file: File): Promise<string> {
  const fd = new FormData();
  fd.append("file", file);
  const r = await fetch("/api/admin/upload", { method: "POST", body: fd });
  const j = await r.json();
  if (!r.ok) throw new Error(j.error || "Prijenos nije uspio.");
  return j.url;
}

function UploadButton({ onDone, accept }: { onDone: (url: string) => void; accept: string }) {
  const ref = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  return (
    <>
      <input ref={ref} type="file" accept={accept} className="hidden" onChange={async (e) => {
        const f = e.target.files?.[0]; if (!f) return;
        setBusy(true); setErr("");
        try { onDone(await uploadFile(f)); } catch (x) { setErr((x as Error).message); }
        setBusy(false); e.target.value = "";
      }} />
      <button type="button" onClick={() => ref.current?.click()} className="inline-flex shrink-0 items-center gap-1.5 bg-charcoal px-3 py-2 text-sm font-semibold text-white hover:bg-red disabled:opacity-50" disabled={busy}>
        <Upload className="h-4 w-4" />{busy ? "Prijenos…" : "Učitaj"}
      </button>
      {err && <span className="text-sm text-red">{err}</span>}
    </>
  );
}

export function FieldInput({ f, value, onChange }: { f: Field; value: unknown; onChange: (v: unknown) => void }) {
  const v = value as never;
  switch (f.type) {
    case "textarea":
      return <textarea className={inputCls} rows={f.name === "body" ? 12 : 3} value={(v as string) ?? ""} onChange={(e) => onChange(e.target.value)} />;
    case "number":
      return <input type="number" className={inputCls} value={(v as number) ?? 0} onChange={(e) => onChange(e.target.value === "" ? 0 : Number(e.target.value))} />;
    case "score":
      return <input type="number" min={0} className={inputCls} value={v ?? ""} placeholder="–" onChange={(e) => onChange(e.target.value === "" ? null : Number(e.target.value))} />;
    case "datetime":
      return <input type="datetime-local" className={inputCls} value={isoToLocal(v)} onChange={(e) => onChange(localToIso(e.target.value))} />;
    case "date":
      return <input type="date" className={inputCls} value={((v as string) ?? "").slice(0, 10)} onChange={(e) => onChange(e.target.value)} />;
    case "select":
      return <select className={inputCls} value={(v as string) ?? ""} onChange={(e) => onChange(e.target.value)}>{f.options!.map((o) => <option key={o} value={o}>{o}</option>)}</select>;
    case "checkbox":
      return <input type="checkbox" className="h-5 w-5 accent-red" checked={!!v} onChange={(e) => onChange(e.target.checked)} />;
    case "image":
    case "file":
      return (
        <div className="flex flex-wrap items-center gap-2">
          {f.type === "image" && v && <img src={v} alt="" className="h-14 w-14 border object-cover" />}
          <input className={`${inputCls} min-w-[200px] flex-1`} value={(v as string) ?? ""} placeholder={f.type === "image" ? "/uploads/… ili /images/…" : "/uploads/dokument.pdf"} onChange={(e) => onChange(e.target.value)} />
          <UploadButton accept={f.type === "image" ? "image/*" : "application/pdf"} onDone={onChange} />
          {v && <button type="button" onClick={() => onChange("")} className="p-2 text-charcoal/50 hover:text-red" aria-label="Ukloni"><X className="h-4 w-4" /></button>}
        </div>
      );
    case "photos": {
      const list = (v as string[]) ?? [];
      return (
        <div>
          <div className="mb-2 flex flex-wrap gap-2">
            {list.map((u, i) => (
              <div key={u + i} className="relative">
                <img src={u} alt="" className="h-20 w-20 border object-cover" />
                <button type="button" onClick={() => onChange(list.filter((_, k) => k !== i))} className="absolute -right-2 -top-2 grid h-6 w-6 place-items-center bg-red text-white" aria-label="Ukloni"><X className="h-3 w-3" /></button>
              </div>
            ))}
          </div>
          <UploadButton accept="image/*" onDone={(u) => onChange([...list, u])} />
        </div>
      );
    }
    case "stats": {
      const list = (v as { label: string; value: string }[]) ?? [];
      const set = (i: number, k: "label" | "value", val: string) => onChange(list.map((x, j) => (j === i ? { ...x, [k]: val } : x)));
      return (
        <div className="space-y-2">
          {list.map((s, i) => (
            <div key={i} className="flex gap-2">
              <input className={inputCls} value={s.label} placeholder="Oznaka (npr. Golovi)" onChange={(e) => set(i, "label", e.target.value)} />
              <input className={inputCls} value={s.value} placeholder="Vrijednost" onChange={(e) => set(i, "value", e.target.value)} />
              <button type="button" onClick={() => onChange(list.filter((_, j) => j !== i))} className="px-2 text-charcoal/50 hover:text-red" aria-label="Ukloni"><Trash2 className="h-4 w-4" /></button>
            </div>
          ))}
          <button type="button" onClick={() => onChange([...list, { label: "", value: "" }])} className="inline-flex items-center gap-1 text-sm font-semibold text-red"><Plus className="h-4 w-4" />Dodaj stavku</button>
        </div>
      );
    }
    default:
      return <input className={inputCls} value={(v as string) ?? ""} onChange={(e) => onChange(e.target.value)} />;
  }
}
