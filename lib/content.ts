import "server-only";
import { promises as fs } from "fs";
import path from "path";
import type { CollectionKey, ContentMap, Match, NewsArticle, Player, StaffGroup, TeamKey } from "./types";

/**
 * Sadržajni repozitorij.
 *
 * Trenutno čita/piše JSON datoteke u /data. Za prelazak na headless CMS
 * (Sanity, Strapi, Payload, Directus…) dovoljno je zamijeniti funkcije
 * `read` i `write` – ostatak aplikacije koristi samo ovaj modul.
 */
const DATA_DIR = path.join(process.cwd(), "data");

export const COLLECTIONS: CollectionKey[] = [
  "news",
  "players",
  "teams",
  "staff",
  "documents",
  "history",
  "matches",
  "standings",
  "sponsors",
  "media",
  "settings",
];

export async function read<K extends CollectionKey>(key: K): Promise<ContentMap[K]> {
  const raw = await fs.readFile(path.join(DATA_DIR, `${key}.json`), "utf8");
  return JSON.parse(raw) as ContentMap[K];
}

export async function write<K extends CollectionKey>(key: K, value: ContentMap[K]): Promise<void> {
  const file = path.join(DATA_DIR, `${key}.json`);
  const tmp = `${file}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(value, null, 2), "utf8");
  await fs.rename(tmp, file);
}

// ---------- upiti ----------

export async function getSettings() {
  return read("settings");
}

export async function getNews(opts: { category?: string; limit?: number } = {}): Promise<NewsArticle[]> {
  let list = (await read("news")).sort((a, b) => +new Date(b.date) - +new Date(a.date));
  if (opts.category) list = list.filter((n) => n.category === opts.category);
  return opts.limit ? list.slice(0, opts.limit) : list;
}

export async function getArticle(slug: string) {
  return (await read("news")).find((n) => n.slug === slug) ?? null;
}

export async function getFeaturedArticle() {
  const list = await getNews();
  return list.find((n) => n.featured) ?? list[0] ?? null;
}

export async function getPlayers(team: TeamKey = "prva"): Promise<Player[]> {
  return (await read("players")).filter((p) => p.team === team).sort((a, b) => a.number - b.number);
}

export async function getPlayer(slug: string) {
  return (await read("players")).find((p) => p.slug === slug) ?? null;
}

export async function getStaff(group: StaffGroup, team?: TeamKey) {
  return (await read("staff")).filter((s) => s.group === group && (!team || s.team === team));
}

export const isPlayed = (m: Match) => m.homeScore != null && m.awayScore != null;

export async function getMatches(kind: "upcoming" | "past" | "all" = "all", team?: TeamKey) {
  let list = await read("matches");
  if (team) list = list.filter((m) => m.team === team);
  if (kind === "upcoming") return list.filter((m) => !isPlayed(m)).sort((a, b) => +new Date(a.date) - +new Date(b.date));
  if (kind === "past") return list.filter(isPlayed).sort((a, b) => +new Date(b.date) - +new Date(a.date));
  return list.sort((a, b) => +new Date(a.date) - +new Date(b.date));
}

export async function getNextMatch() {
  const now = Date.now();
  const up = await getMatches("upcoming", "prva");
  return up.find((m) => +new Date(m.date) > now) ?? up[0] ?? null;
}

export async function getStandings(competition?: string) {
  const rows = await read("standings");
  return rows
    .filter((r) => !competition || r.competition === competition)
    .sort((a, b) => b.points - a.points || b.goalsFor - b.goalsAgainst - (a.goalsFor - a.goalsAgainst));
}

export async function getSponsors() {
  return read("sponsors");
}

export async function getMedia() {
  return (await read("media")).sort((a, b) => +new Date(b.date) - +new Date(a.date));
}

export async function getTeam(key: TeamKey) {
  return (await read("teams")).find((t) => t.key === key) ?? null;
}

export async function getDocuments() {
  return (await read("documents")).sort((a, b) => +new Date(b.date) - +new Date(a.date));
}

export async function getHistory() {
  return read("history");
}
