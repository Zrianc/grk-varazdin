export const dynamic = "force-static";
import type { MetadataRoute } from "next";
import { getNews, read } from "@/lib/content";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const statics = ["", "/novosti", "/momcad/prva-momcad", "/momcad/druga-momcad", "/momcad/mlade-kategorije", "/natjecanja/raspored", "/natjecanja/rezultati", "/natjecanja/ljestvica", "/skola-rukometa", "/o-klubu/povijest", "/o-klubu/uprava", "/o-klubu/strucni-stozer", "/o-klubu/dokumenti", "/multimedija", "/sponzori", "/kontakt", "/press"];
  const news = await getNews();
  const players = await read("players");
  return [
    ...statics.map((p) => ({ url: base + p, changeFrequency: "weekly" as const })),
    ...news.map((n) => ({ url: `${base}/novosti/${n.slug}`, lastModified: n.date })),
    ...players.map((p) => ({ url: `${base}/momcad/igrac/${p.slug}` })),
  ];
}
