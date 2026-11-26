import { MEDIA_TYPES, NEWS_CATEGORIES, POSITIONS, SPONSOR_TIERS, STAFF_GROUPS, type CollectionKey } from "./types";

export type FieldType = "text" | "textarea" | "number" | "datetime" | "date" | "select" | "checkbox" | "image" | "file" | "stats" | "photos" | "score";
export type Field = { name: string; label: string; type: FieldType; options?: readonly string[]; required?: boolean; help?: string; wide?: boolean };
export type CollectionSchema = {
  key: CollectionKey;
  label: string;
  singular: string;
  /** polja prikazana u popisu */
  columns: string[];
  /** polje iz kojeg se generira slug */
  slugFrom?: string[];
  fields: Field[];
  defaults: Record<string, unknown>;
};

const TEAMS = ["prva", "druga", "mlade"] as const;
const PH: Field = { name: "placeholder", label: "Privremeni podatak (prikazuje oznaku „Privremeno”)", type: "checkbox", wide: true };

export const SCHEMAS: CollectionSchema[] = [
  {
    key: "news", label: "Vijesti", singular: "vijest", columns: ["title", "category", "date"], slugFrom: ["title"],
    defaults: { category: "Klupske novosti", featured: false, placeholder: false, image: "", body: "", excerpt: "" },
    fields: [
      { name: "title", label: "Naslov", type: "text", required: true, wide: true },
      { name: "slug", label: "Adresa (slug)", type: "text", help: "Prazno = automatski iz naslova" },
      { name: "category", label: "Kategorija", type: "select", options: NEWS_CATEGORIES },
      { name: "date", label: "Datum objave", type: "datetime", required: true },
      { name: "featured", label: "Istaknuta vijest (naslovnica)", type: "checkbox" },
      { name: "image", label: "Naslovna fotografija", type: "image", wide: true },
      { name: "excerpt", label: "Kratak opis (SEO opis)", type: "textarea", wide: true },
      { name: "body", label: "Tekst članka (odlomci odvojeni praznim retkom)", type: "textarea", wide: true },
      PH,
    ],
  },
  {
    key: "players", label: "Igrači", singular: "igrač", columns: ["number", "firstName", "lastName", "position", "team"], slugFrom: ["firstName", "lastName"],
    defaults: { team: "prva", position: "Vratar", number: 0, image: "", stats: [], placeholder: false },
    fields: [
      { name: "firstName", label: "Ime", type: "text", required: true },
      { name: "lastName", label: "Prezime", type: "text", required: true },
      { name: "number", label: "Broj dresa", type: "number", required: true },
      { name: "position", label: "Pozicija", type: "select", options: POSITIONS },
      { name: "team", label: "Momčad", type: "select", options: TEAMS },
      { name: "slug", label: "Adresa (slug)", type: "text", help: "Prazno = automatski" },
      { name: "image", label: "Fotografija (portret)", type: "image", wide: true },
      { name: "birthDate", label: "Datum rođenja", type: "text" },
      { name: "height", label: "Visina", type: "text" },
      { name: "nationality", label: "Državljanstvo", type: "text" },
      { name: "bio", label: "Biografija", type: "textarea", wide: true },
      { name: "stats", label: "Statistika", type: "stats", wide: true },
      PH,
    ],
  },
  {
    key: "teams", label: "Momčadi", singular: "momčad", columns: ["name", "competition"],
    defaults: { key: "prva", placeholder: false },
    fields: [
      { name: "name", label: "Naziv", type: "text", required: true },
      { name: "key", label: "Ključ", type: "select", options: TEAMS },
      { name: "competition", label: "Natjecanje", type: "text" },
      { name: "description", label: "Opis", type: "textarea", wide: true },
      PH,
    ],
  },
  {
    key: "staff", label: "Uprava i stožer", singular: "osoba", columns: ["name", "role", "group"],
    defaults: { group: "Stručni stožer", team: "prva", image: "", placeholder: false },
    fields: [
      { name: "name", label: "Ime i prezime", type: "text", required: true },
      { name: "role", label: "Uloga", type: "text", required: true },
      { name: "group", label: "Skupina", type: "select", options: STAFF_GROUPS },
      { name: "team", label: "Momčad", type: "select", options: TEAMS },
      { name: "image", label: "Fotografija", type: "image", wide: true },
      PH,
    ],
  },
  {
    key: "matches", label: "Utakmice i rezultati", singular: "utakmica", columns: ["date", "homeTeam", "awayTeam", "homeScore", "awayScore"],
    defaults: { competition: "1. HRL Sjever", team: "prva", homeTeam: "GRK Varaždin", venue: "Arena Varaždin", homeScore: null, awayScore: null, placeholder: false },
    fields: [
      { name: "date", label: "Datum i vrijeme", type: "datetime", required: true },
      { name: "competition", label: "Natjecanje", type: "text", required: true },
      { name: "team", label: "Momčad", type: "select", options: TEAMS },
      { name: "venue", label: "Lokacija", type: "text" },
      { name: "homeTeam", label: "Domaćin", type: "text", required: true },
      { name: "awayTeam", label: "Gost", type: "text", required: true },
      { name: "homeLogo", label: "Grb domaćina", type: "image" },
      { name: "awayLogo", label: "Grb gosta", type: "image" },
      { name: "homeScore", label: "Golovi domaćina", type: "score", help: "Prazno = utakmica još nije odigrana" },
      { name: "awayScore", label: "Golovi gosta", type: "score" },
      { name: "reportSlug", label: "Izvještaj (slug vijesti)", type: "text" },
      PH,
    ],
  },
  {
    key: "standings", label: "Ljestvice", singular: "redak ljestvice", columns: ["competition", "club", "played", "points"],
    defaults: { competition: "1. HRL Sjever", played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, points: 0, placeholder: false },
    fields: [
      { name: "competition", label: "Natjecanje", type: "text", required: true },
      { name: "club", label: "Klub", type: "text", required: true, help: "Za isticanje upišite točno „GRK Varaždin”" },
      { name: "logo", label: "Grb", type: "image" },
      { name: "played", label: "Odigrano", type: "number" },
      { name: "won", label: "Pobjede", type: "number" },
      { name: "drawn", label: "Neriješeno", type: "number" },
      { name: "lost", label: "Porazi", type: "number" },
      { name: "goalsFor", label: "Dani golovi", type: "number" },
      { name: "goalsAgainst", label: "Primljeni golovi", type: "number" },
      { name: "points", label: "Bodovi", type: "number" },
      PH,
    ],
  },
  {
    key: "media", label: "Fotografije i video", singular: "galerija / video", columns: ["title", "type", "date"],
    defaults: { type: "Utakmice", photos: [], placeholder: false },
    fields: [
      { name: "title", label: "Naslov", type: "text", required: true, wide: true },
      { name: "type", label: "Vrsta", type: "select", options: MEDIA_TYPES },
      { name: "date", label: "Datum", type: "datetime", required: true },
      { name: "image", label: "Naslovna fotografija", type: "image", wide: true },
      { name: "photos", label: "Fotografije galerije", type: "photos", wide: true },
      { name: "videoUrl", label: "Video (YouTube / Facebook poveznica)", type: "text", wide: true },
      PH,
    ],
  },
  {
    key: "sponsors", label: "Sponzori", singular: "sponzor", columns: ["name", "tier"],
    defaults: { tier: "Službeni partneri", placeholder: false },
    fields: [
      { name: "name", label: "Naziv", type: "text", required: true },
      { name: "tier", label: "Kategorija", type: "select", options: SPONSOR_TIERS },
      { name: "logo", label: "Logotip", type: "image", wide: true },
      { name: "url", label: "Web adresa", type: "text", wide: true },
      PH,
    ],
  },
  {
    key: "documents", label: "Klupski dokumenti", singular: "dokument", columns: ["title", "date"],
    defaults: { placeholder: false },
    fields: [
      { name: "title", label: "Naziv", type: "text", required: true, wide: true },
      { name: "date", label: "Datum", type: "date" },
      { name: "file", label: "Datoteka (PDF)", type: "file", wide: true },
      PH,
    ],
  },
];

export const OBJECT_EDITORS: { key: CollectionKey; label: string; help: string }[] = [
  { key: "history", label: "Povijest kluba", help: "Uvod, kronologija, uspjesi i značajni igrači. Unosite samo provjerene podatke i navedite izvor." },
  { key: "settings", label: "Postavke", help: "Podaci o klubu, kontakti, društvene mreže, škola rukometa, uključivanje trgovine/ulaznica/TV-a i izvor ljestvice." },
];

export const ADMIN_NAV = [...SCHEMAS.map((s) => ({ key: s.key, label: s.label })), ...OBJECT_EDITORS.map((o) => ({ key: o.key, label: o.label }))];
