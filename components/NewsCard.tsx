import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PhotoPlaceholder, PlaceholderBadge } from "./Placeholder";
import { fmtDate } from "@/lib/format";
import type { NewsArticle } from "@/lib/types";

const TONES = ["red", "dark", "bright"] as const;

export function NewsCard({ n, i = 0 }: { n: NewsArticle; i?: number }) {
  return (
    <article className="group flex flex-col bg-white">
      <Link href={`/novosti/${n.slug}`} className="relative block aspect-[16/11] overflow-hidden" tabIndex={-1} aria-hidden>
        <div className="h-full w-full transition-transform duration-500 group-hover:scale-105">
          {n.image ? <Image src={n.image} alt="" fill sizes="(min-width:1024px) 25vw, 100vw" className="object-cover" /> : <PhotoPlaceholder tone={TONES[i % 3]} />}
        </div>
        <span className="kicker absolute left-0 top-0">{n.category}</span>
      </Link>
      <div className="flex flex-1 flex-col border-b-4 border-red pt-4 pb-5">
        <div className="mb-2 flex items-center gap-2 text-[13px] text-charcoal/60">
          <time dateTime={n.date}>{fmtDate(n.date)}</time>
          <PlaceholderBadge show={!!n.placeholder} className="text-red" />
        </div>
        <h3 className="font-cond text-2xl font-bold leading-[1.05] text-charcoal transition-colors group-hover:text-red">
          <Link href={`/novosti/${n.slug}`}>{n.title}</Link>
        </h3>
        <p className="mt-2 line-clamp-2 text-[15px] text-charcoal/70">{n.excerpt}</p>
        <Link href={`/novosti/${n.slug}`} className="mt-auto inline-flex items-center gap-1.5 pt-4 font-cond text-sm font-bold uppercase tracking-[.1em] text-red">
          Pročitaj više <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden />
        </Link>
      </div>
    </article>
  );
}

export function NewsFeatured({ n }: { n: NewsArticle }) {
  return (
    <article className="group relative flex min-h-[460px] flex-col justify-end overflow-hidden bg-red text-white lg:row-span-2">
      <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-105">
        {n.image ? <Image src={n.image} alt="" fill sizes="(min-width:1024px) 50vw, 100vw" className="object-cover" /> : <PhotoPlaceholder tone="red" label="Naslovna fotografija" />}
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-red-dark via-red-dark/50 to-transparent" />
      <div className="relative p-6 md:p-10">
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <span className="kicker">{n.category}</span>
          <time dateTime={n.date} className="text-sm text-white/85">{fmtDate(n.date)}</time>
          <PlaceholderBadge show={!!n.placeholder} />
        </div>
        <h3 className="font-cond text-4xl font-extrabold leading-[.95] md:text-5xl">
          <Link href={`/novosti/${n.slug}`} className="after:absolute after:inset-0">{n.title}</Link>
        </h3>
        <p className="mt-3 max-w-xl text-white/90">{n.excerpt}</p>
        <span className="mt-5 inline-flex items-center gap-1.5 font-cond text-sm font-bold uppercase tracking-[.1em]">Pročitaj više <ArrowRight className="h-4 w-4" aria-hidden /></span>
      </div>
    </article>
  );
}
