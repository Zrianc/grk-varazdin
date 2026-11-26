/** Putanja do datoteke iz /public uz BASE_PATH (za <a href>, <video src> i sl.). */
export const asset = (p: string) => (p && p.startsWith("/") ? `${process.env.NEXT_PUBLIC_BASE_PATH || ""}${p}` : p);
export const isStatic = process.env.NEXT_PUBLIC_STATIC === "1";
