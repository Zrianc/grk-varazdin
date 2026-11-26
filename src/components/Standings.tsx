"use client";
import { useState } from "react";
import TeamLogo from "./TeamLogo";
import { PlaceholderBadge } from "./Placeholder";
import type { Settings, StandingRow } from "@/lib/types";

/**
 * Ljestvica. Izvor podataka:
 *  - "local": tablica iz administracije
 *  - "sofascore": ugrađeni widget (URL se postavlja po natjecanju u /admin → Postavke)
 * Za drugi API dovoljno je dohvatiti retke u obliku StandingRow i proslijediti ih ovdje.
 */
/** Iz zalijepljenog koda za ugradnju (<iframe src="…">) ili adrese izvuče adresu widgeta. */
function widgetSrc(v?: string) {
  if (!v) return "";
  const m = v.match(/src=["']([^"']+)["']/i);
  const url = (m ? m[1] : v).trim().replace(/&amp;/g, "&");
  return /^https:\/\/(widgets\.)?sofascore\.com\//.test(url) ? url : "";
}
function widgetHeight(v?: string) {
  const m = v?.match(/height=["']?(\d+)/i);
  return m ? Math.max(300, +m[1]) : 720;
}

export default function Standings({ rows, settings, compact = false }: { rows: StandingRow[]; settings: Settings; compact?: boolean }) {
  const comps = settings.standings.competitions;
  const [comp, setComp] = useState(comps[0]?.name ?? "");
  const cfg = comps.find((c) => c.name === comp);
  const data = rows.filter((r) => r.competition === comp);
  const us = settings.shortName;
  const src = settings.standings.provider === "sofascore" ? widgetSrc(cfg?.sofascoreWidgetUrl) : "";
  const anyPlaceholder = !src && data.some((r) => r.placeholder);

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-2">
        {comps.length > 1 ? (
          <select value={comp} onChange={(e) => setComp(e.target.value)} aria-label="Natjecanje" className="border-2 border-red bg-white px-3 py-2 font-cond font-bold uppercase text-red">
            {comps.map((c) => <option key={c.id}>{c.name}</option>)}
          </select>
        ) : (
          <span className="border-2 border-red bg-red px-4 py-2 font-cond text-[15px] font-bold uppercase tracking-[.08em] text-white">{comp}</span>
        )}
        <PlaceholderBadge show={anyPlaceholder} className="text-charcoal/50" />
      </div>

      {src ? (
        <iframe src={src} title={`Ljestvica – ${comp}`} style={{ height: widgetHeight(cfg?.sofascoreWidgetUrl) }} className="w-full border-0 bg-white" loading="lazy" scrolling="no" />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[420px] border-collapse text-[14px]">
            <thead>
              <tr className="bg-red-dark font-cond text-[13px] uppercase tracking-[.08em] text-white">
                <th className="w-10 px-2 py-3">#</th>
                <th className="px-2 py-3 text-left">Klub</th>
                <th className="px-2 py-3" title="Odigrane utakmice">UT</th>
                <th className="px-2 py-3" title="Pobjede">P</th>
                <th className="px-2 py-3" title="Neriješeno">N</th>
                <th className="px-2 py-3" title="Porazi">I</th>
                {!compact && <th className="px-2 py-3">Golovi</th>}
                <th className="px-2 py-3" title="Gol-razlika">+/-</th>
                <th className="px-2 py-3">Bod</th>
              </tr>
            </thead>
            <tbody>
              {data.map((r, i) => {
                const isUs = r.club === us;
                const gd = r.goalsFor - r.goalsAgainst;
                return (
                  <tr key={r.id} className={`border-b border-charcoal/10 text-center ${isUs ? "bg-red font-bold text-white" : i % 2 ? "bg-light" : "bg-white"}`}>
                    <td className="px-2 py-2.5 font-cond text-base font-bold">{i + 1}.</td>
                    <td className="px-2 py-2.5 text-left">
                      <span className="flex items-center gap-2.5">
                        <span className={isUs ? "text-white" : "text-red"}><TeamLogo name={r.club} logo={r.logo} clubLogo={settings.logo} isUs={isUs} size={26} /></span>
                        {r.club}
                      </span>
                    </td>
                    <td className="px-2 py-2.5">{r.played}</td>
                    <td className="px-2 py-2.5">{r.won}</td>
                    <td className="px-2 py-2.5">{r.drawn}</td>
                    <td className="px-2 py-2.5">{r.lost}</td>
                    {!compact && <td className="px-2 py-2.5">{r.goalsFor}:{r.goalsAgainst}</td>}
                    <td className="px-2 py-2.5">{gd > 0 ? `+${gd}` : gd}</td>
                    <td className="px-2 py-2.5 font-cond text-lg font-extrabold">{r.points}</td>
                  </tr>
                );
              })}
              {data.length === 0 && <tr><td colSpan={9} className="p-8 text-center text-charcoal/60">Ljestvica još nije unesena.</td></tr>}
            </tbody>
          </table>
        </div>
      )}
      {cfg?.sofascorePage && (
        <a href={cfg.sofascorePage} target="_blank" rel="noopener noreferrer" className="mt-3 inline-block text-[13px] text-charcoal/60 hover:text-red">
          Ljestvica, rezultati i statistika natjecanja na stranici HRS-a →
        </a>
      )}
    </div>
  );
}
