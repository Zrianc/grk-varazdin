"use client";
import { useSearchParams } from "next/navigation";
import PageHero from "./PageHero";
import CategoryFilter from "./CategoryFilter";
import { NewsCard, NewsFeatured } from "./NewsCard";
import { NEWS_CATEGORIES, type NewsArticle } from "@/lib/types";
import { slugify } from "@/lib/format";

/** Popis vijesti s filtriranjem po kategoriji (?kategorija=…) – radi i u statičnoj verziji. */
export default function NewsBrowser({ news }: { news: NewsArticle[] }) {
  const kategorija = useSearchParams().get("kategorija");
  const category = NEWS_CATEGORIES.find((c) => slugify(c) === kategorija);
  const list = category ? news.filter((n) => n.category === category) : news;
  const [first, ...rest] = list;
  return (
    <>
      <PageHero title={category ?? "Novosti"} kicker="Klupske vijesti" crumbs={[{ label: "Novosti", href: category ? "/novosti" : undefined }, ...(category ? [{ label: category }] : [])]} />
      <section className="boxed bg-light py-14">
        <div className="container-site">
          <div className="mb-10"><CategoryFilter active={category} /></div>
          {list.length === 0 ? (
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
