// Središnji tipovi sadržaja. Isti oblik koristi JSON repozitorij i budući CMS.

export type TeamKey = "prva" | "druga" | "mlade";

export const NEWS_CATEGORIES = [
  "Prva momčad",
  "Najave utakmica",
  "Izvještaji s utakmica",
  "Mlađe kategorije",
  "Škola rukometa",
  "Klupske novosti",
] as const;
export type NewsCategory = (typeof NEWS_CATEGORIES)[number];

export interface NewsArticle {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  /** Tijelo članka; odlomci odvojeni praznim retkom. */
  body: string;
  category: NewsCategory;
  date: string; // ISO
  image?: string;
  featured?: boolean;
  placeholder?: boolean;
}

export const POSITIONS = [
  "Vratar",
  "Lijevo krilo",
  "Desno krilo",
  "Lijevi vanjski",
  "Srednji vanjski",
  "Desni vanjski",
  "Kružni napadač",
] as const;
export type Position = (typeof POSITIONS)[number];

/** Nazivi skupina na stranici momčadi (množina), istim redom kao POSITIONS. */
export const POSITION_GROUPS: Record<Position, string> = {
  Vratar: "Vratari",
  "Lijevo krilo": "Lijeva krila",
  "Desno krilo": "Desna krila",
  "Lijevi vanjski": "Lijevi vanjski",
  "Srednji vanjski": "Srednji vanjski",
  "Desni vanjski": "Desni vanjski",
  "Kružni napadač": "Kružni napadači",
};

export interface Player {
  id: string;
  slug: string;
  firstName: string;
  lastName: string;
  number: number;
  position: Position;
  team: TeamKey;
  image?: string;
  birthDate?: string;
  height?: string;
  nationality?: string;
  bio?: string;
  stats?: { label: string; value: string }[];
  placeholder?: boolean;
}

export interface Team {
  id: string;
  key: TeamKey;
  name: string;
  competition: string;
  description: string;
  placeholder?: boolean;
}

export interface ClubDocument {
  id: string;
  title: string;
  date: string;
  file: string;
  placeholder?: boolean;
}

export interface HistoryEntry {
  year: string;
  title: string;
  text: string;
  source?: string;
  placeholder?: boolean;
}

export interface History {
  intro: string;
  cityBond: string;
  timeline: HistoryEntry[];
  achievements: { title: string; placeholder?: boolean }[];
  notablePlayers: { name: string; note: string; placeholder?: boolean }[];
}

export const STAFF_GROUPS = ["Uprava kluba", "Stručni stožer", "Škola rukometa"] as const;
export type StaffGroup = (typeof STAFF_GROUPS)[number];

export interface StaffMember {
  id: string;
  name: string;
  role: string;
  group: StaffGroup;
  team: TeamKey;
  image?: string;
  placeholder?: boolean;
}

export interface Match {
  id: string;
  date: string; // ISO s vremenom
  competition: string;
  team: TeamKey;
  homeTeam: string;
  awayTeam: string;
  homeLogo?: string;
  awayLogo?: string;
  venue: string;
  homeScore?: number | null;
  awayScore?: number | null;
  reportSlug?: string;
  placeholder?: boolean;
}

export interface StandingRow {
  id: string;
  competition: string;
  club: string;
  logo?: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  points: number;
  placeholder?: boolean;
}

export const SPONSOR_TIERS = [
  "Generalni sponzor",
  "Glavni sponzori",
  "Službeni partneri",
  "Prijatelji kluba",
] as const;
export type SponsorTier = (typeof SPONSOR_TIERS)[number];

export interface Sponsor {
  id: string;
  name: string;
  tier: SponsorTier;
  logo?: string;
  url?: string;
  placeholder?: boolean;
}

export const MEDIA_TYPES = [
  "Utakmice",
  "Treninzi",
  "Videozapisi",
  "Intervjui",
  "Sažeci utakmica",
  "Klupska događanja",
  "Mlađe kategorije",
] as const;
export type MediaType = (typeof MEDIA_TYPES)[number];

export interface MediaItem {
  id: string;
  type: MediaType;
  title: string;
  date: string;
  image?: string;
  /** Dodatne fotografije galerije (otvaraju se preko cijelog zaslona). */
  photos?: string[];
  videoUrl?: string;
  placeholder?: boolean;
}

export interface AcademyCategory {
  name: string;
  ages: string;
  coach: string;
  schedule: string;
  location: string;
  placeholder?: boolean;
}

export interface Settings {
  clubName: string;
  shortName: string;
  founded: string;
  logo: string;
  /** Maskota (dabar iz grba) – škola rukometa, upisi, 404, kampanje. */
  mascot: string;
  address: string;
  arena: string;
  arenaAddress: string;
  email: string;
  phone: string;
  facebook: string;
  instagram: string;
  youtube: string;
  heroVideo: string;
  heroImage: string;
  /** Slogan naslovnice. */
  slogan: string;
  features: {
    /** Fan shop – skriveno dok usluga ne postoji. */
    shop: boolean;
    /** Ulaznice – skriveno dok usluga ne postoji. */
    tickets: boolean;
    /** GRK Varaždin TV – prikazuje se samo ako klub ima službeni kanal. */
    tv: boolean;
  };
  /** Stranica kluba na Sofascoreu – poveznica na sve rezultate i raspored. */
  sofascoreTeamUrl?: string;
  standings: {
    provider: "local" | "sofascore";
    competitions: {
      id: string;
      name: string;
      /** Sofascore widget: adresa ili cijeli kod za ugradnju (<iframe …>) s gumba „Embed live standings”. */
      sofascoreWidgetUrl?: string;
      /** Stranica natjecanja na Sofascoreu (poveznica „Izvor”). */
      sofascorePage?: string;
    }[];
  };
  academy: {
    intro: string;
    categories: AcademyCategory[];
    registration: string;
    contactName: string;
    contactPhone: string;
    contactEmail: string;
  };
}

export interface ContentMap {
  news: NewsArticle[];
  players: Player[];
  teams: Team[];
  staff: StaffMember[];
  documents: ClubDocument[];
  history: History;
  matches: Match[];
  standings: StandingRow[];
  sponsors: Sponsor[];
  media: MediaItem[];
  settings: Settings;
}
export type CollectionKey = keyof ContentMap;
