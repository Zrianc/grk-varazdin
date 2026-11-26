// Učitavač slika za statičnu verziju: lokalnim putanjama dodaje BASE_PATH (GitHub Pages).
export default function imageLoader({ src }: { src: string; width: number; quality?: number }) {
  if (src.startsWith("/")) return `${process.env.NEXT_PUBLIC_BASE_PATH || ""}${src}`;
  return src;
}
