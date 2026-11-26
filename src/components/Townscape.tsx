import { BUILDINGS, INNER, SPIRES, WINDOWS, winPath } from "./StariGrad";

/**
 * Panorama Varaždina u stilu donjeg dijela klupskog dresa:
 * barokne kuće i krovovi, toranj katedrale Uznesenja Marijina,
 * Gradska vijećnica sa satnim tornjem i, u središtu, Stari grad.
 *
 * variant="fill" – puna silueta (prozori izrezani), variant="line" – obrisi.
 */
type Props = { className?: string; variant?: "fill" | "line"; strokeWidth?: number; align?: string };

const G = 320; // linija tla
type Shape = { d: string; win?: string[] };

function rect(x: number, y: number, w: number, h: number) { return `M${x} ${y}h${w}v${h}h${-w}Z`; }

function house(x: number, w: number, h: number, roof: "gable" | "hip" | "mansard" | "baroque", floors = 2): Shape {
  const top = G - h;
  let r = "";
  if (roof === "gable") r = `M${x - 4} ${top} L${x + w / 2} ${top - w * 0.42} L${x + w + 4} ${top} Z`;
  if (roof === "hip") r = `M${x - 4} ${top} L${x + w * 0.22} ${top - 38} H${x + w * 0.78} L${x + w + 4} ${top} Z`;
  if (roof === "mansard") r = `M${x - 4} ${top} L${x + 8} ${top - 22} L${x + w * 0.3} ${top - 44} H${x + w * 0.7} L${x + w - 8} ${top - 22} L${x + w + 4} ${top} Z`;
  if (roof === "baroque")
    r = `M${x} ${top} V${top - 16} C${x + w * 0.2} ${top - 18} ${x + w * 0.28} ${top - 40} ${x + w * 0.38} ${top - 44} C${x + w * 0.42} ${top - 64} ${x + w * 0.58} ${top - 64} ${x + w * 0.62} ${top - 44} C${x + w * 0.72} ${top - 40} ${x + w * 0.8} ${top - 18} ${x + w} ${top - 16} V${top} Z`;
  const cols = Math.max(1, Math.floor((w - 16) / 34));
  const gap = (w - cols * 16) / (cols + 1);
  const win: string[] = [];
  for (let f = 0; f < floors; f++)
    for (let c = 0; c < cols; c++) win.push(rect(x + gap + c * (16 + gap), top + 18 + f * 44, 16, 24));
  return { d: `${rect(x, top, w, h)} ${r}`, win };
}

/** Toranj katedrale – barokna kapa (lukovica), lanterna i šiljak. */
function cathedral(x: number): Shape {
  const tw = 64, th = 250, top = G - th;
  const cx = x + tw / 2;
  const helmet = `M${x - 4} ${top} C${x - 6} ${top - 30} ${cx - 34} ${top - 44} ${cx - 14} ${top - 70} C${cx - 26} ${top - 86} ${cx - 10} ${top - 96} ${cx - 6} ${top - 104} V${top - 124} H${cx + 6} V${top - 104} C${cx + 10} ${top - 96} ${cx + 26} ${top - 86} ${cx + 14} ${top - 70} C${cx + 34} ${top - 44} ${x + tw + 6} ${top - 30} ${x + tw + 4} ${top} Z`;
  const spire = `M${cx - 2} ${top - 124} V${top - 156} H${cx + 2} V${top - 124} Z M${cx - 10} ${top - 146} H${cx + 10} V${top - 142} H${cx - 10} Z`;
  const nave = `${rect(x + tw, G - 130, 150, 130)} M${x + tw - 2} ${G - 130} L${x + tw + 75} ${G - 190} L${x + tw + 152} ${G - 130} Z`;
  const win = [winPath([x + 20, top + 30, 24, 40, 1]), winPath([x + 22, top + 110, 20, 34, 1]), rect(x + 24, top + 170, 16, 22), winPath([x + tw + 30, G - 110, 22, 60, 1]), winPath([x + tw + 98, G - 110, 22, 60, 1])];
  return { d: `${rect(x, top, tw, th)} ${helmet} ${spire} ${nave}`, win };
}

/** Gradska vijećnica – satni toranj sa šiljastim krovom. */
function townHall(x: number): Shape {
  const w = 210, h = 120, top = G - h;
  const tx = x + w / 2 - 26;
  const tower = `${rect(tx, top - 120, 52, 120)} M${tx - 6} ${top - 120} L${tx + 26} ${top - 200} L${tx + 58} ${top - 120} Z M${tx + 24} ${top - 200} V${top - 226} H${tx + 28} V${top - 200} Z`;
  const roof = `M${x - 4} ${top} L${x + 26} ${top - 34} H${x + w - 26} L${x + w + 4} ${top} Z`;
  const win: string[] = [];
  for (let c = 0; c < 6; c++) { if (c === 2 || c === 3) continue; win.push(winPath([x + 16 + c * 32, top + 20, 18, 30, 1]), rect(x + 16 + c * 32, top + 70, 18, 26)); }
  win.push(winPath([x + w / 2 - 16, G - 50, 32, 50, 1]));
  win.push(`M${tx + 26} ${top - 92} m-14 0 a14 14 0 1 0 28 0 a14 14 0 1 0 -28 0`);
  return { d: `${rect(x, top, w, h)} ${roof} ${tower}`, win };
}

const SHAPES: Shape[] = [
  house(0, 90, 96, "gable"), house(90, 120, 110, "baroque"), house(210, 80, 88, "hip"),
  cathedral(300),
  house(520, 110, 104, "mansard"), house(630, 80, 84, "gable", 1), house(710, 90, 70, "hip", 1),
  // Stari grad u središtu (umetnut zasebno)
  house(1600, 100, 92, "hip"), house(1700, 130, 116, "baroque"),
  townHall(1850),
  house(2070, 90, 96, "gable"), house(2160, 120, 108, "mansard"), house(2280, 120, 90, "hip"),
];

// Stari grad: izvorni viewBox 1600×420, tlo na 330 → skaliran i postavljen na tlo
const CASTLE_S = 0.78;
const CASTLE_X = 760 - 250 * CASTLE_S;
const CASTLE_T = `translate(${CASTLE_X} ${G - 330 * CASTLE_S}) scale(${CASTLE_S}) ${INNER}`;

export default function Townscape({ className, variant = "fill", strokeWidth = 2, align = "xMidYMax slice" }: Props) {
  if (variant === "line") {
    return (
      <svg viewBox="0 0 2400 320" className={className} preserveAspectRatio={align} fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinejoin="round" aria-hidden="true">
        {SHAPES.map((s, i) => <g key={i}><path d={s.d} />{s.win?.map((w, j) => <path key={j} d={w} />)}</g>)}
        <g transform={CASTLE_T} strokeWidth={strokeWidth / CASTLE_S / 0.9}>
          {BUILDINGS.map((d, i) => <path key={i} d={d} />)}
          {WINDOWS.map((w, i) => <path key={`w${i}`} d={winPath(w)} />)}
          {SPIRES.map(([x, y, h], i) => <path key={`s${i}`} d={`M${x} ${y}V${y - h}`} />)}
        </g>
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 2400 320" className={className} preserveAspectRatio={align} fill="currentColor" aria-hidden="true">
      <defs>
        <mask id="townscape-mask">
          <rect width="2400" height="320" fill="#fff" />
          {SHAPES.flatMap((s, i) => (s.win ?? []).map((w, j) => <path key={`${i}-${j}`} d={w} fill="#000" />))}
          <g transform={CASTLE_T}>{WINDOWS.map((w, i) => <path key={i} d={winPath(w)} fill="#000" />)}</g>
        </mask>
      </defs>
      <g mask="url(#townscape-mask)">
        {SHAPES.map((s, i) => <path key={i} d={s.d} />)}
        <g transform={CASTLE_T}>
          {BUILDINGS.map((d, i) => <path key={i} d={d} />)}
          {SPIRES.map(([x, y, h], i) => <g key={i}><rect x={x - 2} y={y - h} width="4" height={h} /><circle cx={x} cy={y - h} r="5" /></g>)}
        </g>
      </g>
    </svg>
  );
}
