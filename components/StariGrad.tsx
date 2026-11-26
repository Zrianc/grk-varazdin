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

// --- geometrija (viewBox 0 0 1600 420) -------------------------------------
export const BUILDINGS = [
  // ulazna kula – stražarnica
  "M332 330 V176 H412 V330 Z",
  "M320 178 L372 72 L424 178 Z",
  // most prema utvrdi
  "M412 296 H566 V312 H412 Z",
  // lijeva okrugla kula
  "M560 330 V206 Q605 196 650 206 V330 Z",
  "M550 208 L605 106 L660 208 Z",
  // lijevo krilo palače
  "M650 330 V214 H802 V330 Z",
  "M640 216 L684 148 H784 L812 216 Z",
  // središnja kula
  "M802 330 V124 H902 V330 Z",
  "M790 126 L852 26 L914 126 Z",
  // desno krilo palače
  "M902 330 V194 H1082 V330 Z",
  "M892 196 L934 124 H1052 L1092 196 Z",
  // desna okrugla kula
  "M1078 330 V186 Q1130 174 1182 186 V330 Z",
  "M1068 188 L1130 82 L1192 188 Z",
  // niža zgrada – dvorišno krilo
  "M1182 330 V254 H1292 V330 Z",
  "M1176 256 L1204 214 H1270 L1298 256 Z",
];

export const SPIRES = [
  [372, 72, 46],
  [852, 26, 22],
  [1130, 82, 22],
  [605, 106, 18],
] as const;

type Win = [number, number, number, number, number?]; // x, y, w, h, arch
export const WINDOWS: Win[] = [
  // stražarnica
  [360, 200, 24, 34, 1], [366, 250, 12, 22],
  // vrata stražarnice
  [356, 290, 32, 40, 1],
  // lijeva okrugla kula – puškarnice
  [598, 236, 10, 24], [598, 282, 10, 24],
  // lijevo krilo
  ...[668, 704, 740, 776].flatMap((x) => [[x - 6, 236, 18, 24] as Win, [x - 6, 280, 18, 24] as Win]),
  // središnja kula
  [836, 150, 32, 40, 1], [840, 216, 24, 30], [840, 268, 24, 30],
  // desno krilo – arkade u prizemlju
  ...[924, 962, 1000, 1038].map((x) => [x, 214, 20, 26] as Win),
  ...[920, 958, 996, 1034].map((x) => [x, 270, 28, 40, 1] as Win),
  // desna okrugla kula
  [1122, 214, 14, 28], [1122, 268, 14, 28],
  // dvorišno krilo
  [1206, 276, 18, 22], [1244, 276, 18, 22],
];

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
        {BUILDINGS.map((d, i) => <path key={i} d={d} />)}
        {SPIRES.map(([x, y, h], i) => <path key={`s${i}`} d={`M${x} ${y}V${y - h}`} />)}
        {WINDOWS.map((w, i) => <path key={`w${i}`} d={winPath(w)} />)}
        {/* zupci mosta */}
        {[440, 480, 520].map((x) => <path key={x} d={`M${x} 312 V330`} />)}
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
          {WINDOWS.map((w, i) => <path key={i} d={winPath(w)} fill="#000" />)}
        </mask>
      </defs>
      <g mask={`url(#${id})`}>
        {BUILDINGS.map((d, i) => <path key={i} d={d} />)}
        {SPIRES.map(([x, y, h], i) => (
          <g key={`s${i}`}>
            <rect x={x - 2} y={y - h} width="4" height={h} />
            <circle cx={x} cy={y - h} r="5" />
          </g>
        ))}
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
