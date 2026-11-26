"use client";
import Link from "next/link";
import { useMemo, useState } from "react";
import TeamLogo from "./TeamLogo";
import { PlaceholderBadge } from "./Placeholder";
import { dayNum, fmtDay, fmtTime, monthKey, monthLabel, monthShort } from "@/lib/format";
import type { Match } from "@/lib/types";

type Props = { upcoming: Match[]; past: Match[]; us: string; clubLogo: string; initial?: "up" | "past"; showTabs?: boolean; limit?: number };

export default function MatchesPanel({ upcoming, past, us, clubLogo, initial = "up", showTabs = true, limit }: Props) {
  const [tab, setTab] = useState<"up" | "past">(initial);
  const [month, setMonth] = useState<number | null>(null);
  const list = tab === "up" ? upcoming : past;
  const months = useMemo(() => Array.from(new Set(list.map((m) => monthKey(m.date)))).sort((a, b) => (tab === "up" ? a - b : b - a)), [list, tab]);
  let shown = list.filter((m) => month == null || monthKey(m.date) === month);
  if (limit) shown = shown.slice(0, limit);

  return (
    <div>
      {showTabs && (
        <div className="mb-4 inline-flex border-2 border-red" role="tablist">
          {(["up", "past"] as const).map((t) => (
            <button key={t} role="tab" aria-selected={tab === t} onClick={() => { setTab(t); setMonth(null); }}
              className={`px-5 py-2.5 font-cond text-[15px] font-bold uppercase tracking-[.08em] ${tab === t ? "bg-red text-white" : "text-red hover:bg-red/5"}`}>
              {t === "up" ? "Nadolazeće" : "Prethodne"}
            </button>
          ))}
        </div>
      )}
      <div className="-mx-5 mb-5 flex gap-1.5 overflow-x-auto px-5 pb-1 md:mx-0 md:px-0" aria-label="Odabir mjeseca">
        <button onClick={() => setMonth(null)} className={`whitespace-nowrap border px-3.5 py-1.5 text-sm font-medium ${month == null ? "border-red bg-red text-white" : "border-charcoal/15 text-charcoal/70 hover:border-red hover:text-red"}`}>Sve</button>
        {months.map((k) => (
          <button key={k} onClick={() => setMonth(k)} className={`whitespace-nowrap border px-3.5 py-1.5 text-sm font-medium ${month === k ? "border-red bg-red text-white" : "border-charcoal/15 text-charcoal/70 hover:border-red hover:text-red"}`}>{monthLabel(k)}</button>
        ))}
      </div>
      <ul className="space-y-2.5">
        {shown.length === 0 && <li className="border border-dashed border-charcoal/20 p-8 text-center text-charcoal/60">Nema utakmica za odabrano razdoblje.</li>}
        {shown.map((m) => {
          const played = m.homeScore != null && m.awayScore != null;
          const usHome = m.homeTeam === us;
          const usScore = usHome ? m.homeScore! : m.awayScore!;
          const themScore = usHome ? m.awayScore! : m.homeScore!;
          const r = !played ? null : usScore > themScore ? "P" : usScore < themScore ? "I" : "N";
          return (
            <li key={m.id} className="group grid grid-cols-[64px_1fr] items-center border border-charcoal/10 bg-white transition hover:border-red hover:shadow-[0_8px_24px_rgba(200,16,46,.12)] sm:grid-cols-[76px_1fr]">
              <div className="flex h-full flex-col items-center justify-center bg-red py-3 text-white">
                <b className="font-cond text-3xl font-extrabold leading-none">{dayNum(m.date)}</b>
                <span className="font-cond text-sm font-bold uppercase">{monthShort(m.date)}</span>
              </div>
              <div className="px-3 py-3 sm:px-5">
                <div className="mb-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] uppercase tracking-[.1em] text-charcoal/55">
                  <span className="font-semibold text-red">{m.competition}</span>
                  <span>{fmtDay(m.date)}</span>
                  <span className="hidden sm:inline">{m.venue}</span>
                  <PlaceholderBadge show={!!m.placeholder} className="text-charcoal/50" />
                </div>
                <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 sm:gap-4">
                  <span className={`flex items-center gap-2 text-[15px] font-semibold ${m.homeTeam === us ? "text-red" : ""}`}>
                    <span className="text-red"><TeamLogo name={m.homeTeam} logo={m.homeLogo} clubLogo={clubLogo} isUs={m.homeTeam === us} size={34} /></span>
                    <span className="leading-tight">{m.homeTeam}</span>
                  </span>
                  <span className="min-w-[78px] text-center">
                    {played ? (
                      <span className="inline-flex items-center gap-1.5">
                        <b className="font-cond text-2xl font-extrabold">{m.homeScore}:{m.awayScore}</b>
                        <span className={`grid h-5 w-5 place-items-center text-[11px] font-bold text-white ${r === "P" ? "bg-emerald-600" : r === "I" ? "bg-charcoal" : "bg-charcoal/40"}`} title={r === "P" ? "Pobjeda" : r === "I" ? "Poraz" : "Neriješeno"}>{r}</span>
                      </span>
                    ) : (
                      <b className="font-cond text-2xl font-extrabold text-red">{fmtTime(m.date)}</b>
                    )}
                  </span>
                  <span className={`flex items-center justify-end gap-2 text-right text-[15px] font-semibold ${m.awayTeam === us ? "text-red" : ""}`}>
                    <span className="leading-tight">{m.awayTeam}</span>
                    <span className="text-red"><TeamLogo name={m.awayTeam} logo={m.awayLogo} clubLogo={clubLogo} isUs={m.awayTeam === us} size={34} /></span>
                  </span>
                </div>
                {played && m.reportSlug && (
                  <Link href={`/novosti/${m.reportSlug}`} className="mt-2 inline-block text-[13px] font-semibold text-red hover:underline">Izvještaj s utakmice →</Link>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
