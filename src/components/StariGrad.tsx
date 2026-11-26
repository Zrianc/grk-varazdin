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
// Crtano prema stvarnom izgledu Starog grada (pogled s perivoja, kao na fotografiji):
// slijeva niže krilo, okrugla kula sa stožastim krovom, ulazna kula s piramidalnim
// krovom i lučnim prolazom, dugo krilo palače s dimnjakom, desno masivna kula.
// Koordinate su u sustavu fotografije (širina ~1360, tlo na y=590), a u SVG
// (viewBox 0 0 1600 420, tlo na y=330) prenose se transformacijom INNER.
export const INNER = "translate(174 -201) scale(0.9)";

const GROUND = 590;
const R = (x: number, y: number, w: number) => `M${x} ${y}H${x + w}V${GROUND}H${x}Z`;

export const BUILDINGS = [
  // lijevo niže krilo
  R(168, 448, 110),
  "M160 452 L200 404 H285 L292 452 Z",
  // okrugla kula (lijevo) – tijelo i stožasti krov
  "M272 404 Q352 386 432 404 V" + GROUND + " H272 Z",
  "M262 408 Q300 380 355 318 Q410 380 444 408 Q352 392 262 408 Z",
  // krović spoja s ulaznom kulom
  "M424 424 L438 396 H458 V424 Z",
  // ulazna kula s predzidjem i lučnim prolazom
  "M430 470 H455 V386 H600 V" + GROUND + " H430 Z",
  "M446 390 L558 252 L668 390 Z",
  // dugo krilo palače
  R(598, 446, 364),
  "M590 452 L628 384 H930 L968 452 Z",
  // dimnjak / mala kula na krilu
  "M810 370 H846 V462 H810 Z",
  "M804 372 H852 V364 H804 Z",
  // desna masivna kula
  "M958 400 H1120 Q1176 392 1224 404 V" + GROUND + " H958 Z",
  "M932 452 L960 386 L992 318 H1150 L1228 408 L1222 408 Q1176 398 1120 404 H958 V452 Z",
];

/** Šiljci s kuglom na vrhovima krovova: [x, y, visina] */
export const SPIRES = [
  [355, 318, 16],
  [558, 252, 20],
] as const;

export type Win = [number, number, number, number, number?]; // x, y, w, h, luk
export const WINDOWS: Win[] = [
  // niže krilo
  [196, 468, 12, 18], [238, 468, 12, 18], [196, 512, 12, 18], [238, 512, 12, 18],
  // okrugla kula
  [306, 428, 14, 20], [398, 428, 14, 20], [306, 488, 14, 20], [378, 488, 14, 20], [342, 540, 22, 30, 1],
  // ulazna kula – dvostruki prozor i prozorčići
  [500, 412, 12, 26, 1], [516, 412, 12, 26, 1], [512, 470, 14, 20], [560, 410, 12, 18],
  // lučni prolaz
  [472, 480, 74, 110, 1],
  // krilo palače
  ...[612, 660, 706, 754, 860, 902, 940].map((x) => [x, 476, 14, 24] as Win),
  [776, 518, 20, 44, 1],
  // desna kula
  [1032, 424, 10, 26, 1], [1082, 424, 10, 26, 1], [1172, 436, 22, 12], [1158, 540, 24, 18], [982, 534, 16, 34, 1],
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
        <g transform={INNER} strokeWidth={strokeWidth / 0.9}>
          {BUILDINGS.map((d, i) => <path key={i} d={d} />)}
          {SPIRES.map(([x, y, h], i) => <path key={`s${i}`} d={`M${x} ${y}V${y - h}`} />)}
          {WINDOWS.map((w, i) => <path key={`w${i}`} d={winPath(w)} />)}
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
          <g transform={INNER}>{WINDOWS.map((w, i) => <path key={i} d={winPath(w)} fill="#000" />)}</g>
        </mask>
      </defs>
      <g mask={`url(#${id})`}>
        <g transform={INNER}>
          {BUILDINGS.map((d, i) => <path key={i} d={d} />)}
          {SPIRES.map(([x, y, h], i) => (
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
