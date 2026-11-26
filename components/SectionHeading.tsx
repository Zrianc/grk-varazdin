import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function SectionHeading({ title, href, linkLabel, light = false, children }: { title: string; href?: string; linkLabel?: string; light?: boolean; children?: React.ReactNode }) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4 md:mb-10">
      <h2 className={`section-title ${light ? "text-white" : "text-red"}`}>
        {title}
        <span className={`mt-3 block h-2 w-24 ${light ? "stripes" : "stripes ring-1 ring-red"}`} />
      </h2>
      <div className="flex flex-wrap items-center gap-4">
        {children}
        {href && (
          <Link href={href} className={`link-more ${light ? "border-white text-white" : "border-red text-red"}`}>
            {linkLabel} <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        )}
      </div>
    </div>
  );
}
