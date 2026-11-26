/**
 * Stilizirana vektorska silueta varaždinskog Starog grada.
 *
 * Kompozicija prati prepoznatljivi pogled iz perivoja: zemljani bedemi u
 * prvom planu, ulazna kula (stražarnica) s visokim piramidalnim krovom i
 * mostom, te glavna utvrda – okrugle kule sa stožastim krovovima, središnja
 * četverokutna kula i krila palače sa strmim krovovima i nizovima prozora.
 *
 * NAPOMENA: ako klub ima izvorni grafički motiv s dresova, zamijenite
 * sadržaj ove komponente tim SVG-om (zadržite viewBox i props).
 *
 * variant="fill" – puna silueta (prozori su izrezani maskom)
 * variant="line" – arhitektonske linije
 */
type Props = {
  variant?: "fill" | "line";
  className?: string;
  /** prikaz bedema u prvom planu */
  ramparts?: boolean;
  strokeWidth?: number;
};

// --- geometrija ------------------------------------------------------------
// Obrisi su iscrtani iz fotografije Starog grada (krovovi, zidovi, prozori, dimnjaci),
// u koordinatama fotografije (tlo na y=590). U SVG (viewBox 0 0 1600 420, tlo na y=330)
// prenose se transformacijom INNER.
import { CASTLE_OUTLINE, CASTLE_ROOFS, CASTLE_SPIRES, CASTLE_WINDOWS } from "./stari-grad-paths";
export { CASTLE_OUTLINE, CASTLE_ROOFS, CASTLE_SPIRES, CASTLE_WINDOWS };
export const INNER = "translate(160 -201) scale(0.9)";

type Win = [number, number, number, number, number?]; // x, y, w, h, luk
const RAMPART =
  "M0 420 V372 C120 366 190 338 270 330 H1340 C1420 338 1490 366 1600 372 V420 Z";
const RAMPART_LINE =
  "M0 372 C120 366 190 338 270 330 H1340 C1420 338 1490 366 1600 372";

export function winPath([x, y, w, h, arch]: Win) {
  if (!arch) return `M${x} ${y}h${w}v${h}h${-w}Z`;
  const r = w / 2;
  return `M${x} ${y + h}V${y + r}A${r} ${r} 0 0 1 ${x + w} ${y + r}V${y + h}Z`;
}

export default function StariGrad({ variant = "fill", className, ramparts = true, strokeWidth = 2 }: Props) {
  const id = `sg-mask-${variant}`;
  if (variant === "line") {
    return (
      <svg viewBox="0 0 1600 420" className={className} fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinejoin="round" aria-hidden="true" preserveAspectRatio="xMidYMax meet">
        <g transform={INNER} strokeWidth={strokeWidth / 0.9}>
          <path d={CASTLE_OUTLINE} />
          {CASTLE_ROOFS.map((d, i) => <path key={i} d={d} />)}
          {CASTLE_SPIRES.map(([x, y, h], i) => <path key={`s${i}`} d={`M${x} ${y}V${y - h}`} />)}
          {CASTLE_WINDOWS.map((d, i) => <path key={`w${i}`} d={d} />)}
        </g>
        {ramparts && <path d={RAMPART_LINE} />}
        <path d="M0 330 H1600" strokeOpacity=".4" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 1600 420" className={className} fill="currentColor" aria-hidden="true" preserveAspectRatio="xMidYMax meet">
      <defs>
        <mask id={id}>
          <rect width="1600" height="420" fill="#fff" />
          <g transform={INNER}>{CASTLE_WINDOWS.map((d, i) => <path key={i} d={d} fill="#000" />)}</g>
        </mask>
      </defs>
      <g mask={`url(#${id})`}>
        <g transform={INNER}>
          <path d={CASTLE_OUTLINE} />
          {CASTLE_SPIRES.map(([x, y, h], i) => (
            <g key={`s${i}`}>
              <rect x={x - 2} y={y - h} width="4" height={h} />
              <circle cx={x} cy={y - h} r="5" />
            </g>
          ))}
        </g>
        <rect x="0" y="326" width="1600" height="8" />
        {ramparts && <path d={RAMPART} />}
      </g>
    </svg>
  );
}

/** Okomite pruge s klupskog dresa (boja = currentColor, koristiti s niskom prozirnošću). */
export function JerseyStripes({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 400" className={className} aria-hidden="true" preserveAspectRatio="none">
      <g fill="currentColor">
        {[0, 80, 160, 240, 320].map((x) => <rect key={x} x={x} y="0" width="40" height="400" />)}
      </g>
    </svg>
  );
}
