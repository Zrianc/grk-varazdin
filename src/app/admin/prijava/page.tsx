"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock } from "lucide-react";
import StariGrad from "@/components/StariGrad";

export default function Login() {
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const router = useRouter();
  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setBusy(true); setErr("");
    const r = await fetch("/api/admin/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password: pw }) });
    setBusy(false);
    if (r.ok) router.push("/admin"); else setErr((await r.json()).error || "Greška.");
  };
  return (
    <div className="relative grid min-h-screen place-items-center overflow-hidden bg-red p-6">
      <StariGrad className="pointer-events-none absolute -bottom-1 left-1/2 w-[1600px] max-w-none -translate-x-1/2 text-red-dark/60" />
      <form onSubmit={submit} className="relative w-full max-w-sm bg-white p-8 shadow-2xl">
        <Lock className="mb-4 h-8 w-8 text-red" />
        <h1 className="font-cond text-3xl font-extrabold uppercase text-red">Administracija</h1>
        <p className="mb-6 text-sm text-charcoal/60">GRK Varaždin – upravljanje sadržajem</p>
        <label htmlFor="pw" className="mb-1 block text-sm font-semibold">Lozinka</label>
        <input id="pw" type="password" autoFocus value={pw} onChange={(e) => setPw(e.target.value)} className="w-full border-2 border-charcoal/15 px-3 py-2.5 outline-none focus:border-red" />
        {err && <p className="mt-2 text-sm text-red">{err}</p>}
        <button disabled={busy} className="btn-red mt-6 w-full justify-center disabled:opacity-50">{busy ? "Prijava…" : "Prijava"}</button>
      </form>
    </div>
  );
}
