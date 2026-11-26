const MONTHS = ["siječnja","veljače","ožujka","travnja","svibnja","lipnja","srpnja","kolovoza","rujna","listopada","studenoga","prosinca"];
export const MONTHS_NOM = ["Siječanj","Veljača","Ožujak","Travanj","Svibanj","Lipanj","Srpanj","Kolovoz","Rujan","Listopad","Studeni","Prosinac"];
export const MONTHS_SHORT = ["Sij","Velj","Ožu","Tra","Svi","Lip","Srp","Kol","Ruj","Lis","Stu","Pro"];
const DAYS = ["Nedjelja","Ponedjeljak","Utorak","Srijeda","Četvrtak","Petak","Subota"];
const TZ = "Europe/Zagreb";

function parts(iso: string) {
  const d = new Date(iso);
  const f = new Intl.DateTimeFormat("en-GB", { timeZone: TZ, year: "numeric", month: "numeric", day: "numeric", hour: "2-digit", minute: "2-digit", weekday: "short", hour12: false });
  const p = Object.fromEntries(f.formatToParts(d).map((x) => [x.type, x.value]));
  const wd = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].indexOf(p.weekday);
  return { y: +p.year, m: +p.month - 1, d: +p.day, time: `${p.hour}:${p.minute}`, wd };
}

/** 26.11.2026. */
export const fmtDate = (iso: string) => { const p = parts(iso); return `${p.d}.${p.m + 1}.${p.y}.`; };
/** 26. studenoga 2026. */
export const fmtDateLong = (iso: string) => { const p = parts(iso); return `${p.d}. ${MONTHS[p.m]} ${p.y}.`; };
export const fmtTime = (iso: string) => parts(iso).time;
export const fmtDay = (iso: string) => DAYS[parts(iso).wd];
export const dayNum = (iso: string) => parts(iso).d;
export const monthShort = (iso: string) => MONTHS_SHORT[parts(iso).m];
export const monthKey = (iso: string) => { const p = parts(iso); return p.y * 12 + p.m; };
export const monthLabel = (key: number) => `${MONTHS_NOM[key % 12]} ${Math.floor(key / 12)}.`;

export const slugify = (s: string) =>
  s.toLowerCase()
    .replace(/[čć]/g, "c").replace(/đ/g, "d").replace(/š/g, "s").replace(/ž/g, "z")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export const initials = (name: string) =>
  name.replace(/[\[\]]/g, "").split(/\s+/).filter(Boolean).map((w) => w[0]).join("").slice(0, 3).toUpperCase();
