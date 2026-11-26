"use client";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Expand, Play, X } from "lucide-react";
import { PhotoPlaceholder, PlaceholderBadge } from "./Placeholder";
import { fmtDate } from "@/lib/format";
import { MEDIA_TYPES, type MediaItem, type MediaType } from "@/lib/types";

const VIDEO_TYPES: MediaType[] = ["Videozapisi", "Intervjui", "Sažeci utakmica"];

/** Pretvara YouTube/Facebook poveznicu u adresu za ugradnju. */
function embedUrl(u: string) {
  const yt = u.match(/(?:youtu\.be\/|v=|shorts\/)([\w-]{11})/);
  if (yt) return `https://www.youtube-nocookie.com/embed/${yt[1]}?autoplay=1`;
  if (u.includes("facebook.com")) return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(u)}&autoplay=true`;
  return u;
}

export default function MediaGallery({ items }: { items: MediaItem[] }) {
  const [filter, setFilter] = useState<MediaType | null>(null);
  const [open, setOpen] = useState<{ item: MediaItem; idx: number } | null>(null);
  const list = items.filter((i) => !filter || i.type === filter);

  const slides = (it: MediaItem) => (it.photos?.length ? it.photos : it.image ? [it.image] : [""]);
  const close = useCallback(() => setOpen(null), []);
  const step = useCallback((d: number) => setOpen((o) => (o ? { ...o, idx: (o.idx + d + slides(o.item).length) % slides(o.item).length } : o)), []);

  useEffect(() => {
    if (!open) return;
    const k = (e: KeyboardEvent) => { if (e.key === "Escape") close(); if (e.key === "ArrowRight") step(1); if (e.key === "ArrowLeft") step(-1); };
    document.addEventListener("keydown", k); document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", k); document.body.style.overflow = ""; };
  }, [open, close, step]);

  const btn = (on: boolean) => `whitespace-nowrap border-2 px-4 py-2 font-cond text-sm font-bold uppercase tracking-[.08em] ${on ? "border-red bg-red text-white" : "border-red/25 text-red hover:border-red"}`;

  return (
    <>
      <div className="-mx-5 mb-10 flex gap-2 overflow-x-auto px-5 pb-1 md:mx-0 md:flex-wrap md:px-0">
        <button className={btn(!filter)} onClick={() => setFilter(null)}>Sve</button>
        {MEDIA_TYPES.map((t) => <button key={t} className={btn(filter === t)} onClick={() => setFilter(t)}>{t}</button>)}
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((it, i) => {
          const isVideo = !!it.videoUrl || VIDEO_TYPES.includes(it.type);
          return (
            <button key={it.id} onClick={() => setOpen({ item: it, idx: 0 })} className={`group relative block overflow-hidden bg-red text-left text-white ${i % 5 === 0 ? "sm:col-span-2 sm:row-span-2" : ""}`} aria-label={`Otvori: ${it.title}`}>
              <div className={`relative w-full ${i % 5 === 0 ? "aspect-[4/3] sm:h-full sm:aspect-auto sm:min-h-[420px]" : "aspect-[4/3]"}`}>
                <div className="absolute inset-0 transition-transform duration-500 group-hover:scale-105">
                  {it.image ? <Image src={it.image} alt="" fill sizes="(min-width:1024px) 33vw, 100vw" className="object-cover" /> : <PhotoPlaceholder tone={(["red", "dark", "bright"] as const)[i % 3]} label={it.type} />}
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-red-dark/95 via-transparent" />
                <span className="absolute right-3 top-3 grid h-11 w-11 place-items-center bg-white text-red">{isVideo ? <Play className="h-5 w-5 fill-current" /> : <Expand className="h-5 w-5" />}</span>
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <span className="kicker mb-2">{it.type}</span>
                  <b className="block font-cond text-2xl font-bold uppercase leading-tight">{it.title}</b>
                  <span className="text-sm text-white/75">{fmtDate(it.date)} {it.photos?.length ? `· ${it.photos.length} fotografija` : ""}</span>
                  <PlaceholderBadge show={!!it.placeholder} className="ml-2" />
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {open && (
        <div className="fixed inset-0 z-[100] flex flex-col bg-black/95 text-white" role="dialog" aria-modal="true" aria-label={open.item.title}>
          <div className="flex items-center justify-between gap-4 p-4">
            <span className="font-cond text-xl font-bold uppercase">{open.item.title}</span>
            <button onClick={close} aria-label="Zatvori" className="grid h-11 w-11 place-items-center bg-red"><X className="h-6 w-6" /></button>
          </div>
          <div className="relative flex flex-1 items-center justify-center px-4 pb-6">
            {open.item.videoUrl ? (
              <iframe src={embedUrl(open.item.videoUrl)} title={open.item.title} className="aspect-video w-full max-w-5xl" allow="autoplay; encrypted-media; fullscreen" allowFullScreen />
            ) : (
              <>
                <div className="relative h-full max-h-[80vh] w-full max-w-6xl">
                  {slides(open.item)[open.idx] ? <Image src={slides(open.item)[open.idx]} alt={open.item.title} fill sizes="100vw" className="object-contain" /> : <PhotoPlaceholder label="Fotografija će biti dodana" />}
                </div>
                {slides(open.item).length > 1 && (
                  <>
                    <button onClick={() => step(-1)} aria-label="Prethodna" className="absolute left-4 grid h-12 w-12 place-items-center bg-red"><ChevronLeft /></button>
                    <button onClick={() => step(1)} aria-label="Sljedeća" className="absolute right-4 grid h-12 w-12 place-items-center bg-red"><ChevronRight /></button>
                    <span className="absolute bottom-2 text-sm text-white/70">{open.idx + 1} / {slides(open.item).length}</span>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
