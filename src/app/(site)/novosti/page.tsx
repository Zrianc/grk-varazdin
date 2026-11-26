import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import CategoryFilter from "@/components/CategoryFilter";
import { NewsCard, NewsFeatured } from "@/components/NewsCard";
import { getNews } from "@/lib/content";
import { NEWS_CATEGORIES } from "@/lib/types";
import { slugify } from "@/lib/format";

export const metadata: Metadata = { title: "Novosti", description: "Najnovije vijesti GRK Varaždin – prva momčad, najave i izvještaji s utakmica, mlađe kategorije i škola rukometa." };

export default async function NewsPage({ searchParams }: { searchParams: Promise<{ kategorija?: string }> }) {
  const { kategorija } = await searchParams;
  const category = NEWS_CATEGORIES.find((c) => slugify(c) === kategorija);
  const news = await getNews({ category });
  const [first, ...rest] = news;
  return (
    <>
      <PageHero title={category ?? "Novosti"} kicker="Klupske vijesti" crumbs={[{ label: "Novosti", href: category ? "/novosti" : undefined }, ...(category ? [{ label: category }] : [])]} />
      <section className="boxed bg-light py-14">
        <div className="container-site">
          <div className="mb-10"><CategoryFilter active={category} /></div>
          {news.length === 0 ? (
            <p className="border border-dashed border-charcoal/20 p-12 text-center text-charcoal/60">U ovoj kategoriji još nema vijesti.</p>
          ) : (
            <>
              <div className="mb-8 grid"><NewsFeatured n={first} /></div>
              <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
                {rest.map((n, i) => <NewsCard key={n.id} n={n} i={i} />)}
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
}
