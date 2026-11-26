import Townscape from "./Townscape";

/** Pojas kao donji dio klupskog dresa: crveno-bijele pruge, a ispod crna podloga s bijelom panoramom grada. */
export default function JerseyBand() {
  return (
    <div aria-hidden className="relative bg-charcoal">
      <div className="stripes h-3" />
      <div className="relative h-[110px] overflow-hidden sm:h-[150px] lg:h-[190px]">
        <Townscape variant="line" strokeWidth={3} className="absolute inset-0 h-full w-full text-white/90" />
      </div>
    </div>
  );
}
