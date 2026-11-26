"use client";
import { useState } from "react";
import { Send } from "lucide-react";

/** Obrazac koji otvara e-mail klijent (mailto). Za slanje s poslužitelja dodajte API rutu i servis za e-poštu. */
export default function ContactForm({ to, subject, light = false }: { to: string; subject: string; light?: boolean }) {
  const [f, setF] = useState({ name: "", company: "", email: "", phone: "", message: "" });
  const valid = to && !to.startsWith("[");
  const input = `w-full border-2 px-4 py-3 outline-none transition focus:border-red ${light ? "border-white/30 bg-white/10 text-white placeholder:text-white/60 focus:border-white" : "border-charcoal/15 bg-white"}`;
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const body = `Ime i prezime: ${f.name}\nTvrtka: ${f.company}\nE-mail: ${f.email}\nTelefon: ${f.phone}\n\n${f.message}`;
    window.location.href = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };
  return (
    <form onSubmit={submit} className="grid gap-3 sm:grid-cols-2">
      <label className="sr-only" htmlFor="cf-name">Ime i prezime</label>
      <input id="cf-name" required placeholder="Ime i prezime *" className={input} value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} />
      <label className="sr-only" htmlFor="cf-company">Tvrtka</label>
      <input id="cf-company" placeholder="Tvrtka" className={input} value={f.company} onChange={(e) => setF({ ...f, company: e.target.value })} />
      <label className="sr-only" htmlFor="cf-email">E-mail</label>
      <input id="cf-email" required type="email" placeholder="E-mail *" className={input} value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} />
      <label className="sr-only" htmlFor="cf-phone">Telefon</label>
      <input id="cf-phone" placeholder="Telefon" className={input} value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} />
      <label className="sr-only" htmlFor="cf-msg">Poruka</label>
      <textarea id="cf-msg" required rows={5} placeholder="Poruka *" className={`${input} sm:col-span-2`} value={f.message} onChange={(e) => setF({ ...f, message: e.target.value })} />
      <div className="sm:col-span-2">
        <button type="submit" disabled={!valid} className={`${light ? "btn-white" : "btn-red"} disabled:cursor-not-allowed disabled:opacity-50`}><Send className="h-4 w-4" />Pošalji upit</button>
        {!valid && <p className={`mt-2 text-sm ${light ? "text-white/70" : "text-charcoal/60"}`}>Slanje će biti omogućeno kad se u administraciji unese službeni e-mail kluba.</p>}
      </div>
    </form>
  );
}
