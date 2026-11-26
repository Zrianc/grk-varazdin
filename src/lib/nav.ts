export type NavItem = { label: string; href: string; children?: { label: string; href: string }[] };

export const MAIN_NAV: NavItem[] = [
  {
    label: "O klubu",
    href: "/o-klubu/povijest",
    children: [
      { label: "Povijest kluba", href: "/o-klubu/povijest" },
      { label: "Uprava kluba", href: "/o-klubu/uprava" },
      { label: "Stručni stožer", href: "/o-klubu/strucni-stozer" },
      { label: "Statut i dokumenti", href: "/o-klubu/dokumenti" },
    ],
  },
  {
    label: "Momčad",
    href: "/momcad/prva-momcad",
    children: [
      { label: "Prva momčad", href: "/momcad/prva-momcad" },
      { label: "Druga momčad", href: "/momcad/druga-momcad" },
      { label: "Mlađe kategorije", href: "/momcad/mlade-kategorije" },
    ],
  },
  {
    label: "Natjecanja",
    href: "/natjecanja/raspored",
    children: [
      { label: "Raspored utakmica", href: "/natjecanja/raspored" },
      { label: "Rezultati", href: "/natjecanja/rezultati" },
      { label: "Ljestvica", href: "/natjecanja/ljestvica" },
    ],
  },
  {
    label: "Škola rukometa",
    href: "/skola-rukometa",
    children: [
      { label: "O školi rukometa", href: "/skola-rukometa#o-skoli" },
      { label: "Treneri", href: "/skola-rukometa#treneri" },
      { label: "Termini treninga", href: "/skola-rukometa#termini" },
      { label: "Upisi", href: "/skola-rukometa#upisi" },
    ],
  },
  { label: "Novosti", href: "/novosti" },
  { label: "Multimedija", href: "/multimedija" },
  { label: "Sponzori", href: "/sponzori" },
];

export const TEAM_SLUGS = {
  "prva-momcad": "prva",
  "druga-momcad": "druga",
  "mlade-kategorije": "mlade",
} as const;
