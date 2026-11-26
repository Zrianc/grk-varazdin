import Image from "next/image";
import Link from "next/link";
import StariGrad from "@/components/StariGrad";
import { getSettings } from "@/lib/content";

export default async function NotFoundContent() {
  const s = await getSettings();
  return (
    <section className="relative overflow-hidden bg-red py-24 text-center text-white">
      <StariGrad className="pointer-events-none absolute -bottom-1 left-1/2 w-[1600px] max-w-none -translate-x-1/2 text-red-dark/60" />
      <div className="container-site relative">
        <Image src={s.mascot} alt="Dabar – maskota GRK Varaždin" width={240} height={226} className="mx-auto mb-4 w-44 -rotate-6 drop-shadow-xl" />
        <p className="font-cond text-[120px] font-extrabold leading-none">404</p>
        <h1 className="font-cond text-4xl font-extrabold">Ova lopta je otišla u aut</h1>
        <p className="mt-3 text-white/85">Stranica koju tražite ne postoji ili je premještena.</p>
        <Link href="/" className="btn-white mt-8">Na naslovnicu</Link>
      </div>
    </section>
  );
}
