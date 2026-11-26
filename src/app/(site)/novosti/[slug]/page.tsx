import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Facebook } from "lucide-react";
import PageHero from "@/components/PageHero";
import { NewsCard } from "@/components/NewsCard";
import { PhotoPlaceholder, PlaceholderBadge } from "@/components/Placeholder";
import StariGrad from "@/components/StariGrad";
import { getArticle, getNews } from "@/lib/content";
import { fmtDateLong } from "@/lib/format";

type P = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return (await getNews()).map((n) => ({ slug: n.slug }));
}

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const n = await getArticle((await params).slug);
  if (!n) return {};
  return {
    title: n.title,
    description: n.excerpt,
    alternates: { canonical: `/novosti/${n.slug}` },
    openGraph: { type: "article", title: n.title, description: n.excerpt, publishedTime: n.date, images: n.image ? [n.image] : undefined },
  };
}

export default async function ArticlePage({ params }: P) {
  const n = await getArticle((await params).slug);
  if (!n) notFound();
  const related = (await getNews()).filter((x) => x.id !== n.id).slice(0, 4);
  const site = process.env.NEXT_PUBLIC_SITE_URL || "";
  const jsonLd = {
    "@context": "https://schema.org", "@type": "NewsArticle", headline: n.title, description: n.excerpt, datePublished: n.date,
    image: n.image ? [site + n.image] : undefined, publisher: { "@type": "SportsOrganization", name: "GRK Varaždin" },
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <PageHero title={n.title} kicker={n.category} crumbs={[{ label: "Novosti", href: "/novosti" }, { label: n.category }]}>
        <div className="flex items-center gap-3 text-base">
          <time dateTime={n.date}>{fmtDateLong(n.date)}</time>
          <PlaceholderBadge show={!!n.placeholder} />
        </div>
      </PageHero>
      <article className="boxed relative overflow-hidden bg-white pb-16">
        <StariGrad variant="line" className="pointer-events-none absolute bottom-0 left-1/2 w-[1600px] max-w-none -translate-x-1/2 text-red/[.06]" />
        <div className="container-site relative">
          <div className="relative -mt-0 aspect-[16/8] w-full overflow-hidden md:mx-auto md:max-w-5xl">
            {n.image ? <Image src={n.image} alt={n.title} fill priority sizes="(min-width:1024px) 1000px, 100vw" className="object-cover" /> : <PhotoPlaceholder label="Naslovna fotografija vijesti" tone="dark" />}
          </div>
          <div className="mx-auto mt-10 max-w-3xl">
            <p className="mb-8 border-l-4 border-red pl-5 text-xl font-medium leading-relaxed">{n.excerpt}</p>
            <div className="prose-club">{n.body.split(/\n\s*\n/).map((p, i) => <p key={i}>{p}</p>)}</div>
            <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-charcoal/10 pt-6">
              <Link href="/novosti" className="inline-flex items-center gap-2 font-cond font-bold uppercase text-red"><ArrowLeft className="h-4 w-4" />Sve novosti</Link>
              <a className="inline-flex items-center gap-2 bg-red px-4 py-2 text-sm font-semibold text-white" target="_blank" rel="noopener noreferrer" href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`${site}/novosti/${n.slug}`)}`}><Facebook className="h-4 w-4" />Podijeli</a>
            </div>
          </div>
        </div>
      </article>
      <section className="boxed bg-light py-16">
        <div className="container-site">
          <h2 className="mb-8 font-cond text-4xl font-extrabold text-red">Pročitajte još</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">{related.map((r, i) => <NewsCard key={r.id} n={r} i={i} />)}</div>
        </div>
      </section>
    </>
  );
}
