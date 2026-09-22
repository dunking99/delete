import { useState } from "react";
import { Caps, Chip, Plate, Toggle, TONES, lin, smooth, nf } from "@/ui";

/* ═══════════════════════ shared decade series for plate 36 ═══════════════════════ */
const YEARS = ["FY17", "FY18", "FY19", "FY20", "FY21", "FY22", "FY23", "FY24", "FY25", "FY26E", "FY27E"];
const REV = [1180, 1394, 1602, 1471, 1876, 2164, 2604, 3008, 3540, 4112, 4738];
const GM = [38.2, 39.1, 40.4, 38.6, 41.2, 42.0, 42.8, 43.4, 44.1, 44.8, 45.4];
const OM = [9.4, 10.2, 11.6, 7.1, 12.4, 13.8, 15.1, 16.4, 17.9, 19.3, 20.8];
const NM = [6.1, 6.8, 7.6, 4.2, 8.3, 9.1, 10.2, 11.4, 12.4, 13.6, 14.9];
const SEG = [
  { k: "Conversion", c: "#8E1F2F", v: [612, 734, 862, 788, 1024, 1216, 1498, 1762, 2084, 2402, 2741] },
  { k: "Storage", c: "#1B3A5C", v: [301, 366, 428, 402, 512, 618, 764, 916, 1114, 1326, 1566] },
  { k: "Service", c: "#D98324", v: [204, 224, 246, 231, 268, 274, 281, 279, 286, 304, 331] },
  { k: "Other", c: "#8A7F73", v: [63, 70, 66, 50, 72, 56, 62, 51, 56, 80, 100] },
];

/* ═══════════════════════ 36.a — STACKED BARS + MARGIN LINES ═══════════════════════ */
function A() {
  const t = TONES.paper;
  const [stack, setStack] = useState(true);
  const [hover, setHover] = useState<number>(8);
  const [margins, setMargins] = useState<string[]>(["Gross", "Operating"]);
  const W = 940, H = 380;
  const X = (i: number) => lin(i, 0, YEARS.length - 1, 52, W - 66);
  const bw = (W - 118) / YEARS.length - 12;
  const Y = (v: number) => lin(v, 0, 5000, H - 46, 24);
  const YM = (v: number) => lin(v, 0, 50, H - 46, 24);

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-end justify-between gap-4 border-b pb-3" style={{ borderColor: t.fg }}>
        <div>
          <Caps style={{ color: t.sub }}>Revenue by business line and margin, FY17 – FY27 · US$m</Caps>
          <div className="mt-0.5 font-display text-[21px] italic">Eleven years: three of contraction, seven of compounding, one of forecast.</div>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <Toggle opts={["stack", "total"] as const} value={stack ? "stack" : "total"} onChange={(v) => setStack(v === "stack")} t={t} size="sm" />
          <div className="flex flex-wrap gap-1.5">
            {["Gross", "Operating", "Net"].map((m) => (
              <Chip key={m} t={t} on={margins.includes(m)} onClick={() => setMargins((o) => (o.includes(m) ? o.filter((x) => x !== m) : [...o, m]))} color={m === "Gross" ? "#1B3A5C" : m === "Operating" ? "#D98324" : "#2E5E4A"}>
                {m}
              </Chip>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_216px]">
        <svg viewBox={`0 0 ${W} ${H}`} width="100%" className="block cursor-crosshair" onMouseLeave={() => setHover(8)}>
          {[0, 1000, 2000, 3000, 4000, 5000].map((v) => (
            <g key={v}>
              <line x1="52" x2={W - 66} y1={Y(v)} y2={Y(v)} stroke={t.rule} strokeDasharray="2 5" />
              <text x="46" y={Y(v) + 4} fontSize="10" fill={t.sub} textAnchor="end" fontFamily="IBM Plex Mono">{v}</text>
            </g>
          ))}
          {[0, 10, 20, 30, 40, 50].map((v) => (
            <text key={v} x={W - 60} y={YM(v) + 4} fontSize="10" fill="#1B3A5C" fontFamily="IBM Plex Mono">{v}%</text>
          ))}

          {REV.map((total, i) => {
            const forecast = i > 8;
            const x = X(i) - bw / 2;
            let acc = 0;
            return (
              <g key={i} onMouseEnter={() => setHover(i)}>
                <rect x={X(i) - bw / 2 - 6} y="20" width={bw + 12} height={H - 66} fill={hover === i ? "rgba(142,31,47,0.07)" : "transparent"} />
                {stack ? (
                  SEG.map((s) => {
                    const v = s.v[i];
                    const y0 = Y(acc + v), h = Y(acc) - Y(acc + v);
                    acc += v;
                    return (
                      <rect key={s.k} x={x} y={y0} width={bw} height={h} fill={s.c} opacity={forecast ? 0.45 : 0.92} stroke={forecast ? t.bg : "none"} strokeWidth="1" strokeDasharray={forecast ? "3 2" : ""} />
                    );
                  })
                ) : (
                  <rect x={x} y={Y(total)} width={bw} height={Y(0) - Y(total)} fill={forecast ? "transparent" : t.down} stroke={forecast ? t.down : "none"} strokeWidth="1.5" strokeDasharray={forecast ? "4 3" : ""} opacity={forecast ? 1 : 0.85} />
                )}
                <text x={X(i)} y={Y(total) - 7} fontSize="11" fill={t.fg} textAnchor="middle" fontFamily="IBM Plex Mono" fontWeight={hover === i ? 700 : 400}>
                  {nf(total)}
                </text>
                <text x={X(i)} y={H - 28} fontSize="10" fill={forecast ? t.down : t.sub} textAnchor="middle" fontFamily="IBM Plex Mono">{YEARS[i]}</text>
              </g>
            );
          })}

          {margins.map((m) => {
            const arr = m === "Gross" ? GM : m === "Operating" ? OM : NM;
            const c = m === "Gross" ? "#1B3A5C" : m === "Operating" ? "#D98324" : "#2E5E4A";
            return (
              <g key={m}>
                <path d={smooth(arr.map((v, i) => [X(i), YM(v)] as [number, number]))} fill="none" stroke={c} strokeWidth="2.4" strokeDasharray={m === "Operating" ? "" : m === "Gross" ? "" : "6 3"} />
                {arr.map((v, i) => (
                  <circle key={i} cx={X(i)} cy={YM(v)} r={hover === i ? 5 : 3} fill={c} />
                ))}
                <text x={X(arr.length - 1) + 6} y={YM(arr[arr.length - 1]) + 4} fontSize="10.5" fill={c} fontFamily="IBM Plex Mono">{arr[arr.length - 1].toFixed(0)}%</text>
              </g>
            );
          })}
          <line x1={X(8.5)} x2={X(8.5)} y1="20" y2={H - 40} stroke={t.fg} strokeDasharray="4 3" />
          <text x={X(8.5) + 5} y="32" fontSize="9.5" fill={t.sub} fontFamily="IBM Plex Mono">actual | forecast</text>
        </svg>

        <aside style={{ borderLeft: `1px solid ${t.rule}` }} className="pl-5">
          <Caps style={{ color: t.down }}>{YEARS[hover]}{hover > 8 ? " · consensus" : " · reported"}</Caps>
          <div className="tnum mt-1 font-sans text-[38px] font-extrabold leading-none tracking-tight">${nf(REV[hover])}m</div>
          <div className="mt-3 space-y-1.5">
            {SEG.map((s) => (
              <div key={s.k} className="flex items-center gap-2">
                <span className="h-[9px] w-[9px]" style={{ background: s.c }} />
                <span className="flex-1 text-[13px]">{s.k}</span>
                <span className="tnum font-mono text-[12px]">${nf(s.v[hover])}m</span>
                <span className="tnum font-mono text-[11px]" style={{ color: t.sub }}>{((s.v[hover] / REV[hover]) * 100).toFixed(0)}%</span>
              </div>
            ))}
          </div>
          <div className="mt-4 space-y-1.5 border-t pt-3" style={{ borderColor: t.rule }}>
            {[["Gross margin", GM[hover]], ["Operating margin", OM[hover]], ["Net margin", NM[hover]]].map(([k, v]) => (
              <div key={k as string} className="flex justify-between">
                <span className="font-mono text-[10px] uppercase tracking-[0.14em]" style={{ color: t.sub }}>{k as string}</span>
                <span className="tnum font-mono text-[13px]">{(v as number).toFixed(1)}%</span>
              </div>
            ))}
          </div>
          <div className="mt-4 border-t pt-3" style={{ borderColor: t.rule }}>
            <Caps style={{ color: t.sub }}>10-yr revenue CAGR</Caps>
            <div className="tnum font-sans text-[30px] font-extrabold leading-none" style={{ color: t.down }}>
              {(((REV[9] / REV[0]) ** (1 / 9) - 1) * 100).toFixed(1)}%
            </div>
            <p className="mt-2 font-display text-[14px] italic leading-snug" style={{ color: t.sub }}>
              Margins expanded in every year except FY20 — the pandemic and the FY21 freight spike.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}

/* ═══════════════════════ 36.b — SMALL MULTIPLES ═══════════════════════ */
function P36B() {
  const t = TONES.ink;
  const [metric, setMetric] = useState<string>("All");
  const panels = [
    { k: "Revenue", v: REV, unit: "$m", c: "#F0E9E1", hi: "22.9% CAGR" },
    { k: "Gross margin", v: GM, unit: "%", c: "#63C2A6", hi: "+720bp since FY17" },
    { k: "Operating margin", v: OM, unit: "%", c: "#D98324", hi: "+1,140bp since FY17" },
    { k: "Net margin", v: NM, unit: "%", c: "#E06B6B", hi: "+880bp since FY17" },
  ].filter((p) => metric === "All" || p.k === metric);

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-end justify-between gap-4">
        <div>
          <Caps style={{ color: t.sub }}>Four series, four axes — read the shape, not one shared scale</Caps>
          <div className="mt-0.5 font-display text-[20px] italic">Eleven years of revenue and the three margins that explain it.</div>
        </div>
        <Toggle opts={["All", "Revenue", "Gross margin", "Operating margin", "Net margin"] as const} value={metric} onChange={setMetric} t={t} size="sm" />
      </div>

      <div className={`grid gap-px ${panels.length === 1 ? "sm:grid-cols-1" : "sm:grid-cols-2"}`} style={{ background: t.rule }}>
        {panels.map((p) => {
          const lo = Math.min(...p.v) * 0.92, hi = Math.max(...p.v) * 1.04;
          const w = 420, h = 150;
          const pts = p.v.map((v, i) => [lin(i, 0, p.v.length - 1, 12, w - 44), lin(v, lo, hi, h - 24, 16)] as [number, number]);
          const chg = p.v[p.v.length - 1] - p.v[p.v.length - 5];
          return (
            <div key={p.k} className="p-5" style={{ background: t.bg }}>
              <div className="flex items-baseline justify-between">
                <span className="font-mono text-[10px] uppercase tracking-[0.18em]" style={{ color: t.sub }}>{p.k}</span>
                <span className="tnum font-sans text-[12px]" style={{ color: chg >= 0 ? t.up : t.down }}>{chg >= 0 ? "▲" : "▼"} {Math.abs(chg).toFixed(1)}{p.unit === "%" ? "pt" : ""} 3-yr</span>
              </div>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="tnum font-sans text-[34px] font-extrabold leading-none tracking-tight" style={{ color: p.c }}>
                  {p.unit === "$m" ? `$${nf(p.v[8])}m` : `${p.v[8].toFixed(1)}%`}
                </span>
                <span className="font-mono text-[11px]" style={{ color: t.sub }}>FY25</span>
              </div>
              <svg viewBox={`0 0 ${w} ${h}`} width="100%" className="mt-2 block">
                {[0, 0.5, 1].map((f) => (
                  <line key={f} x1="12" x2={w - 44} y1={16 + f * (h - 40)} y2={16 + f * (h - 40)} stroke={t.rule} strokeDasharray="2 5" />
                ))}
                <path d={`${smooth(pts)} L${w - 44},${h - 24} L12,${h - 24} Z`} fill={p.c} opacity="0.1" />
                <path d={smooth(pts)} fill="none" stroke={p.c} strokeWidth="2.4" />
                <path d={smooth(pts.slice(8))} fill="none" stroke={p.c} strokeWidth="2.4" strokeDasharray="5 4" opacity="0.75" />
                {pts.map((pt, i) => (
                  <circle key={i} cx={pt[0]} cy={pt[1]} r={i === 8 ? 4.5 : 2.4} fill={p.c} opacity={i > 8 ? 0.6 : 1} />
                ))}
                <text x={pts[8][0]} y={pts[8][1] - 11} fontSize="11" fill={p.c} textAnchor="middle" fontFamily="IBM Plex Mono" fontWeight="600">
                  {p.unit === "$m" ? nf(p.v[8]) : p.v[8].toFixed(1)}
                </text>
                {[0, 4, 8, 10].map((i) => (
                  <text key={i} x={pts[i][0]} y={h - 6} fontSize="9.5" fill={t.sub} textAnchor="middle" fontFamily="IBM Plex Mono">{YEARS[i]}</text>
                ))}
              </svg>
              <div className="mt-1 font-mono text-[10.5px]" style={{ color: t.sub }}>{p.hi}</div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 flex flex-wrap justify-between gap-4 border-t pt-3" style={{ borderColor: t.rule }}>
        <span className="font-display text-[15px] italic" style={{ color: t.sub }}>
          Solid to FY25, dashed to FY27E. Each panel owns its own vertical scale so a flat margin line reads as flat, not as growth.
        </span>
        <span className="font-mono text-[10.5px]" style={{ color: t.sub }}>Source: 10-K FY25, pp. 62–66 · FY26E/FY27E consensus</span>
      </div>
    </div>
  );
}

/* ═══════════════════════ 36.c — EDITORIAL COLUMNS + FORECAST ═══════════════════════ */
function P36C() {
  const t = TONES.sand;
  const [showFc, setShowFc] = useState(true);
  const [sel, setSel] = useState(8);
  const list = showFc ? REV : REV.slice(0, 9);
  const W = 900, H = 340;
  const X = (i: number) => lin(i, 0, list.length - 1, 54, W - 30);
  const bw = (W - 84) / list.length - 8;
  const Y = (v: number) => lin(v, 0, 5000, H - 44, 30);

  return (
    <div>
      <div className="mb-5 border-b-2 pb-3" style={{ borderColor: t.fg }}>
        <div className="font-mono text-[10px] uppercase tracking-[0.28em]" style={{ color: t.sub }}>Meridian · Company file · Halcyon Grid</div>
        <h3 className="mt-1 font-display text-[clamp(26px,3.6vw,42px)] leading-[1.04] tracking-tight">
          A decade of revenue, and the two points where the margin stopped expanding
        </h3>
      </div>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <div>
          <svg viewBox={`0 0 ${W} ${H}`} width="100%" className="block">
            {list.map((v, i) => {
              const fc = i > 8;
              return (
                <g key={i} onMouseEnter={() => setSel(i)}>
                  <rect x={X(i) - bw / 2} y={Y(v)} width={bw} height={Y(0) - Y(v)} fill={fc ? "transparent" : "#8E1F2F"} stroke={fc ? "#8E1F2F" : "none"} strokeWidth="1.5" strokeDasharray={fc ? "4 3" : ""} opacity={sel === i ? 1 : 0.78} />
                  <text x={X(i)} y={Y(v) - 8} fontSize="13" fill="#231B12" textAnchor="middle" fontFamily="Newsreader" fontWeight="500">{nf(v)}</text>
                  <text x={X(i)} y={H - 26} fontSize="11" fill={fc ? "#8E1F2F" : "rgba(35,27,18,0.6)"} textAnchor="middle" fontFamily="IBM Plex Mono">{YEARS[i]}</text>
                </g>
              );
            })}
            <line x1="54" x2={W - 30} y1={Y(0)} y2={Y(0)} stroke={t.fg} />
            {/* margin ribbon */}
            <path d={smooth((showFc ? GM : GM.slice(0, 9)).map((v, i) => [X(i), lin(v, 36, 48, H - 60, 44)] as [number, number]))} fill="none" stroke="#1B3A5C" strokeWidth="2.6" />
            <path d={`${smooth((showFc ? GM : GM.slice(0, 9)).map((v, i) => [X(i), lin(v, 36, 48, H - 60, 44)] as [number, number]))} L${X((showFc ? GM : GM.slice(0, 9)).length - 1)},${Y(0)} L54,${Y(0)} Z`} fill="#1B3A5C" opacity="0.07" />
            <text x="58" y={lin(GM[0], 36, 48, H - 60, 44) - 8} fontSize="12" fill="#1B3A5C" fontFamily="Newsreader" fontStyle="italic">gross margin</text>
            {[3, 6].map((i) => (
              <g key={i}>
                <circle cx={X(i)} cy={lin(GM[i], 36, 48, H - 60, 44)} r="6" fill="none" stroke="#D98324" strokeWidth="2.4" />
              </g>
            ))}
          </svg>

          <div className="mt-3 flex flex-wrap items-center justify-between gap-4 border-t pt-3" style={{ borderColor: t.rule }}>
            <div className="flex flex-wrap gap-1.5">
              {[["FY20", "pandemic volume"], ["FY22", "freight & input spike"]].map(([y, why]) => (
                <span key={y} className="flex items-center gap-2 px-2 py-[3px]" style={{ border: `1px solid #D98324` }}>
                  <span className="inline-block h-2 w-2 rounded-full" style={{ background: "#D98324" }} />
                  <span className="font-mono text-[10px]" style={{ color: "#8a6a30" }}>{y} · {why}</span>
                </span>
              ))}
            </div>
            <button onClick={() => setShowFc(!showFc)} className="px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em]" style={{ border: `1px solid ${t.fg}`, color: t.fg }}>
              {showFc ? "Hide" : "Show"} consensus forecast
            </button>
          </div>
        </div>

        <aside style={{ borderLeft: `1px solid ${t.rule}` }} className="pl-6">
          <div className="tnum font-sans text-[64px] font-extrabold leading-[0.85] tracking-[-0.05em]">{nf(list[sel])}</div>
          <div className="font-mono text-[11px] uppercase tracking-[0.16em]" style={{ color: t.sub }}>
            {YEARS[sel]} revenue, US$m {sel > 8 ? "· consensus" : "· reported"}
          </div>

          <div className="mt-5 space-y-3">
            {[
              ["Gross margin", GM[sel]],
              ["Operating margin", OM[sel]],
              ["Net margin", NM[sel]],
            ].map(([k, v]) => (
              <div key={k as string}>
                <div className="flex justify-between">
                  <span className="font-display text-[15px]">{k as string}</span>
                  <span className="tnum font-mono text-[13px]">{(v as number).toFixed(1)}%</span>
                </div>
                <div className="mt-1 h-[8px] w-full" style={{ background: "rgba(35,27,18,0.09)" }}>
                  <div className="h-full" style={{ width: `${((v as number) / 50) * 100}%`, background: "#1B3A5C" }} />
                </div>
              </div>
            ))}
          </div>

          <p className="mt-5 border-t pt-4 font-display text-[16px] leading-[1.55]" style={{ borderColor: t.rule, color: "rgba(35,27,18,0.82)" }}>
            {sel === 3 || sel === 5
              ? "This is one of the two years the margin line fell. Both were input-cost events rather than pricing events, and both were reversed within four quarters."
              : sel > 8
                ? "Consensus has the top line crossing $4bn next year and gross margin above 45% — a forecast that assumes software attach keeps rising while freight stays normal."
                : "Revenue compounded at 22.9% while gross margin rose 7.2 points: growth and mix, not price, did most of the work."}
          </p>

          <div className="mt-5 grid grid-cols-2 gap-4 border-t pt-4" style={{ borderColor: t.rule }}>
            {[
              ["Best year", "FY21 · +27.5%"],
              ["Worst year", "FY20 · −8.2%"],
              ["Margin range", "38.2 – 45.4%"],
              ["Forecast years", showFc ? "2 shown" : "hidden"],
            ].map(([k, v]) => (
              <div key={k}>
                <Caps style={{ color: t.sub }}>{k}</Caps>
                <div className="font-display text-[18px]">{v}</div>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}

export function C36() {
  const nm = "Revenue and margin trend";
  return (
    <>
      <Plate n={36} letter="a" name={nm} variant="Stacked revenue with three margin lines on a second axis" tone="paper" caption="Hover any year to get the full segment split in the margin rail; switch the stack to a single column; add or remove margin lines with the chips. Forecast years are drawn dashed and half-tone so the reader can never mistake estimate for fact.">
        <A />
      </Plate>
      <Plate n={36} letter="b" name={nm} variant="Small multiples — four panels, four scales" tone="ink" caption="One shared axis flatters revenue and flattens margins, so each series gets its own panel and its own range, with the last four years dashed forward. The filter collapses the grid to a single full-width panel.">
        <P36B />
      </Plate>
      <Plate n={36} letter="c" name={nm} variant="Broadsheet feature with the gross-margin ribbon" tone="sand" caption="An article rather than a widget: display headline, columns with the margin ribbon drawn through them, circled annotations on the two years it fell, and a giant numeral in the side column for whichever year you point at.">
        <P36C />
      </Plate>
    </>
  );
}

/* ═══════════════════════ shared call-sentiment series for plate 42 ═══════════════════════ */
const QS = ["Q1'22", "Q2'22", "Q3'22", "Q4'22", "Q1'23", "Q2'23", "Q3'23", "Q4'23", "Q1'24", "Q2'24", "Q3'24", "Q4'24", "Q1'25", "Q2'25", "Q3'25", "Q4'25"];
const TONE = [0.41, 0.38, 0.44, 0.52, 0.47, 0.51, 0.55, 0.62, 0.58, 0.61, 0.66, 0.71, 0.63, 0.58, 0.66, 0.74];
const THEMES = [
  { k: "Backlog & demand", c: "#8E1F2F", v: [18, 22, 26, 31, 28, 34, 38, 44, 41, 46, 52, 58, 49, 44, 51, 57] },
  { k: "Margins & mix", c: "#1B3A5C", v: [26, 24, 28, 27, 31, 30, 29, 33, 36, 34, 37, 41, 38, 42, 45, 48] },
  { k: "Supply chain", c: "#D98324", v: [34, 38, 42, 39, 44, 41, 36, 31, 27, 24, 21, 18, 22, 19, 16, 14] },
  { k: "Policy & tariffs", c: "#2E5E4A", v: [4, 6, 5, 8, 9, 12, 14, 16, 18, 22, 26, 31, 34, 38, 42, 46] },
  { k: "Capital return", c: "#8A7F73", v: [6, 7, 9, 11, 12, 14, 16, 17, 19, 21, 23, 26, 28, 31, 33, 35] },
];

const QUOTES = [
  { q: "Demand is no longer the constraint — qualified assembly labour is.", who: "R. E. Castellano, CEO", date: "12 Feb 2026", tone: 0.72 },
  { q: "We expect DSO to normalise to 78 to 80 days by the third quarter.", who: "M. Okonkwo, CFO", date: "12 Feb 2026", tone: 0.42 },
  { q: "Pune takes imported content to about 31% by the end of 2027.", who: "R. E. Castellano, CEO", date: "12 Feb 2026", tone: 0.55 },
  { q: "I would point to 99.4% on-time delivery over eight quarters.", who: "R. E. Castellano, CEO", date: "12 Feb 2026", tone: 0.68 },
];

/* ═══════════════════════ 42.a — TONE LINE + THEME STACK ═══════════════════════ */
function P42A() {
  const t = TONES.paper;
  const [hover, setHover] = useState(15);
  const [q, setQ] = useState(0);
  const W = 940, H = 330;
  const X = (i: number) => lin(i, 0, QS.length - 1, 56, W - 30);
  const YT = (v: number) => lin(v, 0, 1, 30, 150);
  const total = THEMES.map((_, i) => THEMES.reduce((s, th) => s + th.v[i], 0));

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-end justify-between gap-4 border-b pb-3" style={{ borderColor: t.fg }}>
        <div>
          <Caps style={{ color: t.sub }}>Tone of the earnings call, sixteen quarters · machine-scored, −1 to +1</Caps>
          <div className="mt-0.5 font-display text-[21px] italic">Sentiment has climbed for four straight quarters — and supply-chain language has halved.</div>
        </div>
        <div className="flex gap-5">
          {[["Latest tone", "0.74"], ["4-quarter change", "+0.16"], ["Words per call", "11,400"], ["Questions, Q4'25", "14"]].map(([k, v]) => (
            <div key={k}>
              <Caps style={{ color: t.sub }}>{k}</Caps>
              <div className="tnum font-sans text-[19px] font-bold">{v}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
        <svg viewBox={`0 0 ${W} ${H}`} width="100%" className="block" onMouseLeave={() => setHover(15)}>
          <rect x="56" y="30" width={W - 86} height={120} fill="rgba(46,94,74,0.06)" />
          {[0.3, 0.5, 0.7].map((v) => (
            <g key={v}>
              <line x1="56" x2={W - 30} y1={YT(v)} y2={YT(v)} stroke={t.rule} strokeDasharray="2 5" />
              <text x="50" y={YT(v) + 4} fontSize="10" fill={t.sub} textAnchor="end" fontFamily="IBM Plex Mono">{v.toFixed(1)}</text>
            </g>
          ))}
          <path d={smooth(TONE.map((v, i) => [X(i), YT(v)] as [number, number]))} fill="none" stroke={t.down} strokeWidth="2.6" className="drawIn" />
          {TONE.map((v, i) => (
            <g key={i} onMouseEnter={() => setHover(i)}>
              <rect x={X(i) - 24} y="24" width="48" height="200" fill={hover === i ? "rgba(142,31,47,0.08)" : "transparent"} />
              <circle cx={X(i)} cy={YT(v)} r={hover === i ? 6 : 3.4} fill={t.down} />
            </g>
          ))}
          <line x1="56" x2={W - 30} y1="176" y2="176" stroke={t.fg} />
          <text x="56" y="194" fontSize="10.5" fill={t.sub} fontFamily="IBM Plex Mono" letterSpacing="1.4">SHARE OF CALL MENTIONED (%)</text>
          {/* stacked theme ribbons */}
          {THEMES.map((th, ti) => {
            let acc = 0;
            return (
              <g key={th.k}>
                {th.v.map((v, i) => {
                  const y0 = 210 + ((acc) / total[i]) * 104;
                  const y1 = 210 + ((acc + v) / total[i]) * 104;
                  acc += v;
                  return (
                    <rect
                      key={i}
                      x={X(i) - ((W - 86) / QS.length) * 0.42}
                      y={y0}
                      width={((W - 86) / QS.length) * 0.84}
                      height={Math.max(1, y1 - y0)}
                      fill={th.c}
                      opacity={hover === i ? 1 : 0.7}
                      stroke={t.bg}
                      strokeWidth="0.7"
                    />
                  );
                })}
                <text x={W - 26} y={214 + ti * 0} fontSize="9" fill={th.c} />
              </g>
            );
          })}
          {QS.map((qq, i) => (
            <text key={qq} x={X(i)} y={H - 6} fontSize="9.5" fill={i === hover ? t.fg : t.sub} textAnchor="middle" fontFamily="IBM Plex Mono">{i % 2 === 0 || i === 15 ? qq : ""}</text>
          ))}
        </svg>

        <aside style={{ borderLeft: `1px solid ${t.rule}` }} className="pl-5">
          <Caps style={{ color: t.down }}>{QS[hover]} call</Caps>
          <div className="tnum mt-1 font-sans text-[44px] font-extrabold leading-none tracking-tight">{TONE[hover].toFixed(2)}</div>
          <div className="font-mono text-[11px]" style={{ color: t.sub }}>
            {TONE[hover] > 0.6 ? "positive" : TONE[hover] > 0.45 ? "neutral" : "guarded"} · {11 + (hover % 4)} speakers
          </div>

          <div className="mt-4">
            <Caps style={{ color: t.sub }}>Theme share</Caps>
            <div className="mt-2 space-y-2">
              {THEMES.map((th) => (
                <div key={th.k}>
                  <div className="flex justify-between">
                    <span className="flex items-center gap-1.5 font-mono text-[10.5px]"><span className="h-[8px] w-[8px]" style={{ background: th.c }} />{th.k}</span>
                    <span className="tnum font-mono text-[11.5px]">{th.v[hover]}</span>
                  </div>
                  <div className="mt-0.5 h-[6px] w-full" style={{ background: "rgba(22,18,14,0.08)" }}>
                    <div className="h-full transition-all duration-300" style={{ width: `${(th.v[hover] / 60) * 100}%`, background: th.c }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-5 border-t pt-3" style={{ borderColor: t.rule }}>
            <Caps style={{ color: t.sub }}>Quote of the quarter</Caps>
            <p className="mt-1 font-display text-[17px] italic leading-snug">“{QUOTES[q].q}”</p>
            <div className="mt-1 font-mono text-[10.5px]" style={{ color: t.sub }}>{QUOTES[q].who} · {QUOTES[q].date}</div>
            <div className="mt-2 flex gap-1.5">
              {QUOTES.map((_, i) => (
                <button key={i} onClick={() => setQ(i)} className="h-[10px] w-[10px]" style={{ background: q === i ? t.down : "rgba(22,18,14,0.18)" }} aria-label={`quote ${i + 1}`} />
              ))}
            </div>
          </div>
        </aside>
      </div>
      <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 border-t pt-2" style={{ borderColor: t.rule }}>
        {THEMES.map((th) => (
          <span key={th.k} className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.12em]" style={{ color: t.sub }}>
            <span className="inline-block h-[9px] w-[9px]" style={{ background: th.c }} /> {th.k}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════ 42.b — SPEAKER & WORD ANALYSIS ═══════════════════════ */
function P42B() {
  const t = TONES.ink;
  const [mode, setMode] = useState<"speakers" | "words">("speakers");
  const speakers = [
    { n: "R. E. Castellano", r: "CEO", tone: 0.79, w: 3120, calls: 16, delta: 0.11 },
    { n: "M. Okonkwo", r: "CFO", tone: 0.61, w: 2480, calls: 12, delta: 0.04 },
    { n: "S. Ahuja", r: "CTO", tone: 0.74, w: 1140, calls: 9, delta: 0.09 },
    { n: "Analyst panel", r: "14 firms", tone: 0.49, w: 5660, calls: 16, delta: -0.03 },
  ];
  const words = [
    { w: "backlog", p: 412, d: 68 }, { w: "grid-forming", p: 288, d: 141 }, { w: "tariff", p: 176, d: 94 },
    { w: "margin", p: 344, d: 37 }, { w: "inventory", p: 132, d: -48 }, { w: "Pune", p: 96, d: 71 },
    { w: "buyback", p: 88, d: 22 }, { w: "customer concentration", p: 64, d: 18 }, { w: "softness", p: 52, d: -36 },
    { w: "on-time delivery", p: 118, d: 44 },
  ];

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-end justify-between gap-4">
        <div>
          <Caps style={{ color: t.sub }}>Who says what, and how the language is moving</Caps>
          <div className="mt-0.5 font-display text-[21px] italic">Sixteen calls, 105,000 words, one score per speaker.</div>
        </div>
        <Toggle opts={["speakers", "words"] as const} value={mode} onChange={setMode} t={t} size="sm" />
      </div>

      {mode === "speakers" ? (
        <div className="grid gap-0 sm:grid-cols-2">
          {speakers.map((s, i) => (
            <div key={s.n} className="p-5" style={{ background: i % 2 ? "rgba(240,233,225,0.03)" : "transparent", borderRight: i % 2 === 0 ? `1px solid ${t.rule}` : "none", borderBottom: `1px solid ${t.rule}` }}>
              <div className="flex items-baseline justify-between">
                <div>
                  <div className="font-sans text-[17px] font-bold tracking-tight">{s.n}</div>
                  <div className="font-mono text-[10px] uppercase tracking-[0.16em]" style={{ color: t.sub }}>{s.r} · {s.calls} calls</div>
                </div>
                <div className="tnum font-sans text-[30px] font-extrabold leading-none" style={{ color: s.tone > 0.65 ? t.up : s.tone > 0.5 ? "#F0E9E1" : t.down }}>
                  {s.tone.toFixed(2)}
                </div>
              </div>
              <div className="mt-3 relative h-[10px]" style={{ background: "rgba(240,233,225,0.1)" }}>
                <div className="absolute top-0 h-full" style={{ width: `${s.tone * 100}%`, background: s.tone > 0.65 ? t.up : "#D98324" }} />
                <div className="absolute -top-1 h-[18px] w-px" style={{ left: "50%", background: "#F0E9E1" }} />
              </div>
              <div className="mt-1.5 flex justify-between font-mono text-[10.5px]" style={{ color: t.sub }}>
                <span>{nf(s.w)} words scored</span>
                <span style={{ color: s.delta >= 0 ? t.up : t.down }}>{s.delta >= 0 ? "▲" : "▼"} {Math.abs(s.delta).toFixed(2)} vs prior year</span>
              </div>
            </div>
          ))}
          <div className="sm:col-span-2 p-5" style={{ borderTop: `1px solid ${t.rule}` }}>
            <Caps style={{ color: t.sub }}>Sentiment by call segment</Caps>
            <div className="mt-3 flex flex-wrap gap-8">
              {[["Prepared remarks", 0.81], ["Q&A — management", 0.7], ["Q&A — analysts", 0.47], ["Guidance language", 0.76]].map(([k, v]) => (
                <div key={k as string}>
                  <div className="tnum font-sans text-[24px] font-extrabold" style={{ color: (v as number) > 0.65 ? t.up : "#F0E9E1" }}>{(v as number).toFixed(2)}</div>
                  <div className="font-mono text-[10px] uppercase tracking-[0.14em]" style={{ color: t.sub }}>{k as string}</div>
                  <div className="mt-1.5 h-[5px] w-[120px]" style={{ background: "rgba(240,233,225,0.1)" }}>
                    <div className="h-full" style={{ width: `${(v as number) * 100}%`, background: (v as number) > 0.65 ? t.up : "#D98324" }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div>
          <div className="mb-2 flex items-baseline justify-between">
            <Caps style={{ color: t.sub }}>Word frequency across the last four calls</Caps>
            <Caps style={{ color: t.sub }}>change vs a year earlier</Caps>
          </div>
          <div className="space-y-0">
            {words.map((w) => (
              <div key={w.w} className="grid items-center gap-4 py-2" style={{ gridTemplateColumns: "168px minmax(0,1fr) 74px 74px", borderBottom: `1px solid ${t.rule}` }}>
                <span className="font-display text-[17px]">{w.w}</span>
                <span className="relative h-[16px]" style={{ background: "rgba(240,233,225,0.06)" }}>
                  <span className="absolute left-0 top-0 h-full" style={{ width: `${(w.p / 420) * 100}%`, background: t.down, opacity: 0.85 }} />
                </span>
                <span className="tnum text-right font-mono text-[13px]">{w.p}</span>
                <span className="tnum text-right font-mono text-[13px]" style={{ color: w.d >= 0 ? t.up : t.down }}>{w.d >= 0 ? "+" : ""}{w.d}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap justify-between gap-4">
            <p className="max-w-[70ch] font-display text-[15.5px] italic" style={{ color: t.sub }}>
              “Grid-forming” has gone from a technical aside to the second most-used phrase in the call in two years; “inventory” has fallen by a third as the Ohio ramp normalised.
            </p>
            <span className="font-mono text-[10.5px]" style={{ color: t.sub }}>Stop-words removed · case-folded · stemming applied</span>
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════ 42.c — DIVERGING WORD BALANCE ═══════════════════════ */
function P42C() {
  const t = TONES.sand;
  const [sel, setSel] = useState(15);
  const rows = QS.map((qq, i) => ({
    q: qq,
    pos: Math.round(96 + TONE[i] * 320),
    neg: Math.round(240 - TONE[i] * 190),
    neu: Math.round(180 + Math.abs(Math.sin(i)) * 90),
    qs: 8 + (i % 7),
  }));
  const r = rows[sel];

  return (
    <div>
      <div className="mb-5 border-b-2 pb-3" style={{ borderColor: t.fg }}>
        <div className="font-mono text-[10px] uppercase tracking-[0.28em]" style={{ color: t.sub }}>Earnings call scorecard · Halcyon Grid</div>
        <h3 className="mt-1 font-display text-[clamp(26px,3.4vw,40px)] leading-none tracking-tight">
          Sixteen quarters of positive and negative language
        </h3>
      </div>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
        <div>
          <div className="mb-2 flex justify-between font-mono text-[10px] uppercase tracking-[0.16em]" style={{ color: t.sub }}>
            <span>◀ hedging / risk language</span>
            <span>confident / forward language ▶</span>
          </div>
          <div className="space-y-1">
            {rows.map((row, i) => {
              const on = i === sel;
              const mx = 460;
              return (
                <button
                  key={row.q}
                  onClick={() => setSel(i)}
                  className="grid w-full items-center gap-3 py-[3px]"
                  style={{ gridTemplateColumns: "64px minmax(0,1fr) 54px", background: on ? "rgba(35,27,18,0.08)" : "transparent" }}
                >
                  <span className="tnum text-left font-mono text-[11.5px]" style={{ color: on ? t.fg : "rgba(35,27,18,0.6)" }}>{row.q}</span>
                  <span className="relative flex h-[19px] items-stretch">
                    <span className="flex w-1/2 items-center justify-end" style={{ background: "rgba(27,58,92,0.06)" }}>
                      <span className="h-[13px]" style={{ width: `${(row.neg / mx) * 100}%`, background: "#1B3A5C", opacity: on ? 1 : 0.62 }} />
                    </span>
                    <span className="w-px" style={{ background: t.fg }} />
                    <span className="flex w-1/2 items-center" style={{ background: "rgba(142,31,47,0.05)" }}>
                      <span className="h-[13px]" style={{ width: `${(row.pos / mx) * 100}%`, background: "#2E5E4A", opacity: on ? 1 : 0.62 }} />
                    </span>
                  </span>
                  <span className="tnum text-right font-mono text-[12px]" style={{ color: row.pos > row.neg ? "#2E5E4A" : "#8E1F2F" }}>
                    {((row.pos / (row.pos + row.neg)) * 100).toFixed(0)}%
                  </span>
                </button>
              );
            })}
          </div>

          <div className="mt-5 grid grid-cols-2 gap-5 border-t pt-4 sm:grid-cols-4" style={{ borderColor: t.rule }}>
            {[
              ["Positive words", nf(r.pos)],
              ["Negative words", nf(r.neg)],
              ["Neutral / factual", nf(r.neu)],
              ["Analyst questions", `${r.qs}`],
            ].map(([k, v]) => (
              <div key={k}>
                <Caps style={{ color: t.sub }}>{k}</Caps>
                <div className="tnum font-sans text-[24px] font-extrabold tracking-tight">{v}</div>
              </div>
            ))}
          </div>
        </div>

        <aside style={{ borderLeft: `1px solid ${t.rule}` }} className="pl-6">
          <Caps style={{ color: t.sub }}>Representative language · {r.q}</Caps>
          <div className="mt-3 space-y-4">
            {QUOTES.slice(0, 3).map((qq, i) => (
              <div key={i}>
                <div className="flex items-center gap-2">
                  <span className="h-[9px] w-[9px] rotate-45" style={{ background: qq.tone > 0.6 ? "#2E5E4A" : "#D98324" }} />
                  <span className="font-mono text-[10px] uppercase tracking-[0.16em]" style={{ color: t.sub }}>{qq.tone > 0.6 ? "confident" : "hedged"}</span>
                </div>
                <p className="mt-1 font-display text-[18px] leading-snug">“{qq.q}”</p>
                <div className="font-mono text-[10.5px]" style={{ color: t.sub }}>{qq.who}</div>
              </div>
            ))}
          </div>
          <div className="mt-5 border-t pt-4" style={{ borderColor: t.rule }}>
            <Caps style={{ color: t.sub }}>Scorecard</Caps>
            <div className="mt-2 space-y-2">
              {[["Beats delivered", "11 of 16"], ["Guidance raised", "6 times"], ["Vague answers flagged", "3"], ["Refused to guide", "0"]].map(([k, v]) => (
                <div key={k} className="flex justify-between border-b pb-1" style={{ borderColor: t.rule }}>
                  <span className="font-display text-[15px]">{k}</span>
                  <span className="tnum font-mono text-[13px]">{v}</span>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

export function C42() {
  const nm = "Earnings call sentiment";
  return (
    <>
      <Plate n={42} letter="a" name={nm} variant="Tone line over a stacked ribbon of what was discussed" tone="paper" caption="Sixteen quarters of machine-scored tone on the top axis, with the share of call spent on each theme stacked underneath on the same time base, so a change in subject and a change in mood can be read together.">
        <P42A />
      </Plate>
      <Plate n={42} letter="b" name={nm} variant="Speaker panels and a word-frequency ledger" tone="ink" caption="Sentiment is not one number: management and analysts score very differently. Split by speaker, then switch to the word table to see which phrases are gaining and losing ground quarter on quarter.">
        <P42B />
      </Plate>
      <Plate n={42} letter="c" name={nm} variant="Diverging balance of confident against hedging language" tone="sand" caption="Every quarter drawn as a bar straddling a centre rule — risk language to the left, forward language to the right — with the win percentage at the end of the row and representative quotes in the margin.">
        <P42C />
      </Plate>
    </>
  );
}
