/**
 * Preuzimanje rasporeda, rezultata i ljestvice s HRS-a.
 *
 * HRS (hrs.hr) podatke natjecanja objavljuje preko sustava Sportinfo centar:
 *   https://www.sportinfocentar2.com/coman/natjecanje<ID>.js   (var natjecanjeobjekt = {…})
 * ID natjecanja je isti kao na hrs.hr/natjecanje/?natjecanje=<ID>.
 * Ljestvica se računa iz rezultata (pobjeda 2, neriješeno 1, poraz 0) –
 * isto kao na HRS stranici.
 *
 * Modul nema ovisnosti o Next.js-u, pa ga koristi i skripta scripts/hrs-sync.ts (GitHub Actions)
 * i poslužitelj (automatsko osvježavanje).
 */
import { promises as fs } from "fs";
import path from "path";

export const HRS_DATA = "https://www.sportinfocentar2.com/coman/";
export const HRS_LOGO = "https://www.sportinfocentar2.com/coman/logo/";

export type HrsConfig = {
  enabled: boolean;
  /** ID natjecanja (hrs.hr/natjecanje/?natjecanje=…) */
  natjecanje: number;
  /** ID kluba u HRS sustavu */
  klub: number;
  /** Naziv natjecanja na stranici */
  naziv: string;
};

type HrsMatch = {
  broj: number; e1: string; e2: string; k1: number; k2: number;
  pc: string; r1: number | null; r2: number | null; st: number; kolo: number | null;
  mnaziv?: string; mmjesto?: string;
};
type HrsComp = { broj: number; naziv: string; lige: { broj: number; naziv: string; utakmice: HrsMatch[] }[] };

export async function fetchCompetition(id: number): Promise<HrsComp> {
  const res = await fetch(`${HRS_DATA}natjecanje${id}.js?${Date.now()}`, {
    headers: { "User-Agent": "GRK-Varazdin-web (automatsko preuzimanje rezultata)" },
    cache: "no-store",
    signal: AbortSignal.timeout(15000),
  });
  if (!res.ok) throw new Error(`HRS: HTTP ${res.status}`);
  return parseCompetition(await res.text());
}

/** „var natjecanjeobjekt = {…};” → objekt (samo JSON.parse, bez izvršavanja koda). */
export function parseCompetition(text: string): HrsComp {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start < 0 || end < start) throw new Error("HRS: neočekivan format podataka");
  const data = JSON.parse(text.slice(start, end + 1));
  if (!Array.isArray(data?.lige)) throw new Error("HRS: nema popisa liga");
  return data as HrsComp;
}

const finished = (m: HrsMatch) => m.st === 2 && typeof m.r1 === "number" && typeof m.r2 === "number";

/** Europe/Zagreb pomak za lokalni datum/vrijeme („2026-11-28T18:00:00”). */
function zagrebIso(local: string) {
  const guess = new Date(`${local}Z`);
  const zh = new Date(guess.toLocaleString("en-US", { timeZone: "Europe/Zagreb" }));
  const utc = new Date(guess.toLocaleString("en-US", { timeZone: "UTC" }));
  const off = Math.round((+zh - +utc) / 60000);
  const hh = String(Math.floor(Math.abs(off) / 60)).padStart(2, "0");
  const mm = String(Math.abs(off) % 60).padStart(2, "0");
  return `${local.slice(0, 19)}${off >= 0 ? "+" : "-"}${hh}:${mm}`;
}

function venue(m: HrsMatch) {
  const n = (m.mnaziv || "").trim();
  if (/arena/i.test(n) && /vara[žz]din/i.test(`${n} ${m.mmjesto}`)) return "Arena Varaždin";
  if (!m.mmjesto || n.toLowerCase().includes(m.mmjesto.toLowerCase())) return n;
  return n ? `${n}, ${m.mmjesto}` : m.mmjesto;
}

type Row = { id: string; hrsId: number; competition: string; club: string; logo: string; played: number; won: number; drawn: number; lost: number; goalsFor: number; goalsAgainst: number; points: number; placeholder: boolean };

/** Ljestvica iz rezultata. Redoslijed: bodovi → međusobni susreti (bodovi, gol-razlika) → gol-razlika → dani golovi. */
export function computeStandings(matches: HrsMatch[], cfg: HrsConfig, clubName: string): Row[] {
  const rows = new Map<number, Row>();
  const row = (id: number, name: string) => {
    if (!rows.has(id))
      rows.set(id, { id: `hrs-${id}`, hrsId: id, competition: cfg.naziv, club: id === cfg.klub ? clubName : name, logo: `${HRS_LOGO}${id}.png`, played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, points: 0, placeholder: false });
    return rows.get(id)!;
  };
  for (const m of matches) {
    const a = row(m.k1, m.e1), b = row(m.k2, m.e2);
    if (!finished(m)) continue;
    const g1 = m.r1!, g2 = m.r2!;
    a.played++; b.played++;
    a.goalsFor += g1; a.goalsAgainst += g2; b.goalsFor += g2; b.goalsAgainst += g1;
    if (g1 > g2) { a.won++; b.lost++; a.points += 2; }
    else if (g1 < g2) { b.won++; a.lost++; b.points += 2; }
    else { a.drawn++; b.drawn++; a.points++; b.points++; }
  }
  const done = matches.filter(finished);
  const h2h = (ids: Set<number>) => {
    const t = new Map<number, { p: number; gd: number }>();
    ids.forEach((i) => t.set(i, { p: 0, gd: 0 }));
    for (const m of done) {
      if (!ids.has(m.k1) || !ids.has(m.k2)) continue;
      const a = t.get(m.k1)!, b = t.get(m.k2)!;
      a.gd += m.r1! - m.r2!; b.gd += m.r2! - m.r1!;
      if (m.r1! > m.r2!) a.p += 2; else if (m.r1! < m.r2!) b.p += 2; else { a.p++; b.p++; }
    }
    return t;
  };
  const list = [...rows.values()];
  const byPoints = new Map<number, Row[]>();
  list.forEach((r) => byPoints.set(r.points, [...(byPoints.get(r.points) || []), r]));
  const sorted: Row[] = [];
  [...byPoints.keys()].sort((x, y) => y - x).forEach((pts) => {
    const group = byPoints.get(pts)!;
    const t = h2h(new Set(group.map((r) => r.hrsId)));
    group.sort((x, y) =>
      t.get(y.hrsId)!.p - t.get(x.hrsId)!.p ||
      t.get(y.hrsId)!.gd - t.get(x.hrsId)!.gd ||
      (y.goalsFor - y.goalsAgainst) - (x.goalsFor - x.goalsAgainst) ||
      y.goalsFor - x.goalsFor ||
      x.club.localeCompare(y.club, "hr"));
    sorted.push(...group);
  });
  return sorted;
}

type SiteMatch = Record<string, unknown> & { id: string; hrsId?: number; placeholder?: boolean; reportSlug?: string };

export function clubMatches(matches: HrsMatch[], cfg: HrsConfig, clubName: string, existing: SiteMatch[]): SiteMatch[] {
  const prev = new Map(existing.filter((m) => m.hrsId).map((m) => [m.hrsId, m]));
  const name = (id: number, n: string) => (id === cfg.klub ? clubName : n);
  const logo = (id: number) => (id === cfg.klub ? "" : `${HRS_LOGO}${id}.png`);
  const fromHrs = matches
    .filter((m) => m.k1 === cfg.klub || m.k2 === cfg.klub)
    .map<SiteMatch>((m) => ({
      id: `hrs-${m.broj}`,
      hrsId: m.broj,
      date: zagrebIso(m.pc),
      competition: cfg.naziv,
      round: m.kolo ?? undefined,
      team: "prva",
      homeTeam: name(m.k1, m.e1),
      awayTeam: name(m.k2, m.e2),
      homeLogo: logo(m.k1),
      awayLogo: logo(m.k2),
      venue: venue(m),
      homeScore: finished(m) ? m.r1 : null,
      awayScore: finished(m) ? m.r2 : null,
      reportSlug: (prev.get(m.broj)?.reportSlug as string) || "",
      placeholder: false,
    }));
  // ručno unesene utakmice (npr. kup, prijateljske) ostaju; privremene se uklanjaju
  const manual = existing.filter((m) => !m.hrsId && !m.placeholder && m.competition !== cfg.naziv);
  return [...fromHrs, ...manual].sort((a, b) => +new Date(a.date as string) - +new Date(b.date as string));
}

/** Preuzme podatke i zapiše matches.json i standings.json u zadanu mapu. Vraća true ako je bilo promjena. */
export async function syncToDir(dir: string): Promise<{ changed: boolean; matches: number; teams: number }> {
  const settings = JSON.parse(await fs.readFile(path.join(dir, "settings.json"), "utf8"));
  const cfg: HrsConfig | undefined = settings.hrs;
  if (!cfg?.enabled) return { changed: false, matches: 0, teams: 0 };
  const comp = await fetchCompetition(cfg.natjecanje);
  const league = comp.lige.find((l) => l.utakmice?.some((m) => m.k1 === cfg.klub || m.k2 === cfg.klub)) ?? comp.lige[0];
  if (!league?.utakmice?.length) throw new Error("HRS: liga nema utakmica");
  const clubName = settings.shortName || "GRK Varaždin";

  const existingMatches = JSON.parse(await fs.readFile(path.join(dir, "matches.json"), "utf8"));
  const existingStandings = JSON.parse(await fs.readFile(path.join(dir, "standings.json"), "utf8"));
  const matches = clubMatches(league.utakmice, cfg, clubName, existingMatches);
  const standings = [
    ...computeStandings(league.utakmice, cfg, clubName),
    ...existingStandings.filter((r: Row) => r.competition !== cfg.naziv && !r.placeholder),
  ];
  if (standings.filter((r) => r.competition === cfg.naziv).length < 2) throw new Error("HRS: premalo klubova u ljestvici");

  let changed = false;
  for (const [file, value, old] of [["matches.json", matches, existingMatches], ["standings.json", standings, existingStandings]] as const) {
    const out = JSON.stringify(value, null, 2);
    if (out !== JSON.stringify(old, null, 2)) {
      await fs.writeFile(path.join(dir, file), out, "utf8");
      changed = true;
    }
  }
  return { changed, matches: matches.length, teams: standings.length };
}
