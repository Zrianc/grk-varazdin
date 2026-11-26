import type { Metadata } from "next";
import { Suspense } from "react";
import NewsBrowser from "@/components/NewsBrowser";
import { getNews } from "@/lib/content";

export const metadata: Metadata = { title: "Novosti", description: "Najnovije vijesti GRK Varaždin – prva momčad, najave i izvještaji s utakmica, mlađe kategorije i škola rukometa." };

export default async function NewsPage() {
  const news = await getNews();
  return (
    <Suspense>
      <NewsBrowser news={news} />
    </Suspense>
  );
}
