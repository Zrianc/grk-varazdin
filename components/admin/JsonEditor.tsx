"use client";
import { useState } from "react";
import { Save } from "lucide-react";

/** Uređivač strukturiranih postavki (JSON) s provjerom ispravnosti prije spremanja. */
export default function JsonEditor({ k, label, help, initial }: { k: string; label: string; help: string; initial: unknown }) {
  const [text, setText] = useState(JSON.stringify(initial, null, 2));
  const [msg, setMsg] = useState<{ ok: boolean; t: string } | null>(null);
  let parseErr = "";
  try { JSON.parse(text); } catch (e) { parseErr = (e as Error).message; }
  const save = async () => {
    const r = await fetch(`/api/admin/${k}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: text });
    const j = await r.json().catch(() => ({}));
    setMsg(r.ok ? { ok: true, t: "Spremljeno." } : { ok: false, t: j.error || "Greška." });
  };
  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <h1 className="mr-auto font-cond text-3xl font-extrabold uppercase text-red">{label}</h1>
        {msg && <span className={`text-sm ${msg.ok ? "text-emerald-700" : "text-red"}`}>{msg.t}</span>}
        <button onClick={save} disabled={!!parseErr} className="inline-flex items-center gap-1.5 bg-red px-4 py-2.5 text-sm font-bold text-white hover:bg-red-dark disabled:opacity-40"><Save className="h-4 w-4" />Spremi</button>
      </div>
      <p className="mb-4 max-w-3xl text-sm text-charcoal/70">{help}</p>
      {parseErr && <p className="mb-2 text-sm text-red">Neispravan JSON: {parseErr}</p>}
      <textarea value={text} onChange={(e) => { setText(e.target.value); setMsg(null); }} spellCheck={false} className="h-[70vh] w-full border bg-charcoal p-4 font-mono text-[13px] leading-relaxed text-white outline-none focus:border-red" />
    </div>
  );
}
