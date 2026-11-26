"use client";
import { useMemo, useState } from "react";
import { Copy, Plus, Save, Search, Trash2 } from "lucide-react";
import { FieldInput, inputCls } from "./fields";
import type { CollectionSchema } from "@/lib/admin-schema";
import { slugify } from "@/lib/format";

type Item = Record<string, unknown> & { id: string };

const display = (v: unknown) => {
  if (v == null || v === "") return "–";
  if (typeof v === "string" && /^\d{4}-\d{2}-\d{2}T/.test(v)) return new Date(v).toLocaleString("hr-HR", { timeZone: "Europe/Zagreb", dateStyle: "short", timeStyle: "short" });
  return String(v);
};

export default function CollectionEditor({ schema, initial }: { schema: CollectionSchema; initial: Item[] }) {
  const [items, setItems] = useState<Item[]>(initial);
  const [sel, setSel] = useState<string | null>(initial[0]?.id ?? null);
  const [q, setQ] = useState("");
  const [dirty, setDirty] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; t: string } | null>(null);
  const [saving, setSaving] = useState(false);

  const filtered = useMemo(() => items.filter((it) => !q || schema.columns.some((c) => String(it[c] ?? "").toLowerCase().includes(q.toLowerCase()))), [items, q, schema.columns]);
  const cur = items.find((i) => i.id === sel) ?? null;

  const update = (name: string, v: unknown) => {
    setItems((list) => list.map((it) => (it.id === sel ? { ...it, [name]: v } : it)));
    setDirty(true); setMsg(null);
  };
  const add = (from?: Item) => {
    const id = `${schema.key.slice(0, 2)}${Date.now().toString(36)}`;
    const base: Item = from ? { ...structuredClone(from), id, slug: "" } : { ...structuredClone(schema.defaults), id };
    if (!from && schema.fields.some((f) => f.type === "datetime")) base.date = new Date().toISOString();
    setItems((l) => [base, ...l]); setSel(id); setDirty(true);
  };
  const remove = () => {
    if (!cur || !confirm(`Obrisati ${schema.singular}?`)) return;
    setItems((l) => l.filter((i) => i.id !== cur.id)); setSel(null); setDirty(true);
  };
  const save = async () => {
    for (const it of items) {
      for (const f of schema.fields) if (f.required && (it[f.name] === "" || it[f.name] == null)) {
        setSel(it.id); setMsg({ ok: false, t: `Polje „${f.label}” je obavezno.` }); return;
      }
    }
    const out = items.map((it) => schema.slugFrom && "slug" in it && !it.slug ? { ...it, slug: slugify(schema.slugFrom.map((k) => it[k]).join(" ")) || it.id } : it);
    setSaving(true);
    const r = await fetch(`/api/admin/${schema.key}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(out) });
    const j = await r.json().catch(() => ({}));
    setSaving(false);
    if (r.ok) { setItems(out); setDirty(false); setMsg({ ok: true, t: "Spremljeno. Promjene su vidljive na stranici." }); }
    else setMsg({ ok: false, t: j.error || "Spremanje nije uspjelo." });
  };

  return (
    <div>
      <div className="sticky top-0 z-10 -mx-6 mb-6 flex flex-wrap items-center gap-3 border-b bg-white/95 px-6 py-3 backdrop-blur">
        <h1 className="mr-auto font-cond text-3xl font-extrabold uppercase text-red">{schema.label}</h1>
        {msg && <span className={`text-sm font-medium ${msg.ok ? "text-emerald-700" : "text-red"}`}>{msg.t}</span>}
        {dirty && !msg && <span className="text-sm text-amber-700">Nespremljene promjene</span>}
        <button onClick={() => add()} className="inline-flex items-center gap-1.5 border-2 border-red px-4 py-2 text-sm font-bold text-red hover:bg-red hover:text-white"><Plus className="h-4 w-4" />Dodaj</button>
        <button onClick={save} disabled={!dirty || saving} className="inline-flex items-center gap-1.5 bg-red px-4 py-2.5 text-sm font-bold text-white hover:bg-red-dark disabled:opacity-40"><Save className="h-4 w-4" />{saving ? "Spremanje…" : "Spremi promjene"}</button>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(320px,420px)_1fr]">
        <div className="border bg-white">
          <div className="flex items-center gap-2 border-b p-2">
            <Search className="ml-1 h-4 w-4 text-charcoal/40" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Pretraži…" className="w-full py-1.5 text-sm outline-none" />
            <span className="whitespace-nowrap px-2 text-xs text-charcoal/50">{filtered.length} / {items.length}</span>
          </div>
          <ul className="max-h-[70vh] overflow-y-auto">
            {filtered.map((it) => (
              <li key={it.id}>
                <button onClick={() => setSel(it.id)} className={`flex w-full items-start gap-2 border-b px-3 py-2.5 text-left text-sm ${it.id === sel ? "bg-red text-white" : "hover:bg-light"}`}>
                  <span className="flex-1">
                    <b className="block">{display(it[schema.columns[0]])} {schema.columns.slice(1, 3).map((c) => display(it[c])).join(" · ")}</b>
                    <span className={it.id === sel ? "text-white/75" : "text-charcoal/55"}>{schema.columns.slice(3).map((c) => display(it[c])).join(" · ")}</span>
                  </span>
                  {it.placeholder === true && <span className={`shrink-0 border border-dashed px-1 text-[10px] uppercase ${it.id === sel ? "border-white" : "border-charcoal/40 text-charcoal/60"}`}>Privr.</span>}
                </button>
              </li>
            ))}
            {filtered.length === 0 && <li className="p-6 text-center text-sm text-charcoal/50">Nema zapisa.</li>}
          </ul>
        </div>

        <div className="border bg-white p-6">
          {cur ? (
            <>
              <div className="mb-5 flex items-center justify-between gap-3">
                <h2 className="font-cond text-xl font-bold uppercase text-charcoal/70">Uređivanje: {schema.singular}</h2>
                <div className="flex gap-2">
                  <button onClick={() => add(cur)} className="inline-flex items-center gap-1 px-3 py-1.5 text-sm text-charcoal/70 hover:text-red"><Copy className="h-4 w-4" />Dupliciraj</button>
                  <button onClick={remove} className="inline-flex items-center gap-1 px-3 py-1.5 text-sm text-red hover:bg-red/5"><Trash2 className="h-4 w-4" />Obriši</button>
                </div>
              </div>
              <div className="grid gap-5 md:grid-cols-2">
                {schema.fields.map((f) => (
                  <label key={f.name} className={`block ${f.wide ? "md:col-span-2" : ""} ${f.type === "checkbox" ? "flex flex-row-reverse items-center justify-end gap-3" : ""}`}>
                    <span className="mb-1 block text-sm font-semibold">{f.label}{f.required && <span className="text-red"> *</span>}</span>
                    <FieldInput f={f} value={cur[f.name]} onChange={(v) => update(f.name, v)} />
                    {f.help && <span className="mt-1 block text-xs text-charcoal/55">{f.help}</span>}
                  </label>
                ))}
              </div>
            </>
          ) : (
            <p className="py-20 text-center text-charcoal/50">Odaberite zapis s popisa ili dodajte novi.</p>
          )}
        </div>
      </div>
      <input type="hidden" className={inputCls} />
    </div>
  );
}
