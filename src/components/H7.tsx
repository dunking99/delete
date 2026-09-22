import { useMemo, useState } from "react";
import { Caps, Chip, Plate, Toggle, TONES, lin, poly, smooth, nf } from "@/ui";

/* ═══════════════════════ shared estimate data for plate 5 ═══════════════════════ */
const VINTAGE = ["Mar'25", "Jun'25", "Sep'25", "Dec'25", "Mar'26"];
type Series = { k: string; lo: number[]; cons: number[]; hi: number[]; unit: string; dp: number };
const EST: Record<string, Series> = {
  "FY26 revenue": { k: "FY26 revenue", lo: [4.61, 4.7, 4.82, 4.94, 5.28], cons: [4.74, 4.86, 4.98, 5.11, 5.46], hi: [4.92, 5.04, 5.18, 5.34, 5.72], unit: "$bn", dp: 2 },
  "FY26 EPS": { k: "FY26 EPS", lo: [1.86, 1.94, 2.06, 2.18, 2.44], cons: [1.98, 2.07, 2.21, 2.36, 2.64], hi: [2.14, 2.26, 2.41, 2.58, 2.92], unit: "$", dp: 2 },
  "FY27 revenue": { k: "FY27 revenue", lo: [5.24, 5.36, 5.5, 5.66, 5.98], cons: [5.42, 5.58, 5.76, 5.94, 6.31], hi: [5.66, 5.84, 6.06, 6.3, 6.74], unit: "$bn", dp: 2 },
  "FY27 EPS": { k: "FY27 EPS", lo: [2.24, 2.34, 2.5, 2.66, 2.94], cons: [2.41, 2.55, 2.72, 2.91, 3.24], hi: [2.62, 2.78, 2.98, 3.2, 3.58], unit: "$", dp: 2 },
};
const ANALYST_N = [22, 23, 24, 24, 25];

/* forward quarterly EPS estimate path — 20 reports */
const FWD_PATH = [
  { q: "Q1'21", e: 1.06, d: 0.02 }, { q: "Q2'21", e: 1.11, d: 0.05 }, { q: "Q3'21", e: 1.14, d: 0.03 }, { q: "Q4'21", e: 1.22, d: 0.08 },
  { q: "Q1'22", e: 1.28, d: 0.06 }, { q: "Q2'22", e: 1.31, d: 0.03 }, { q: "Q3'22", e: 1.27, d: -0.04 }, { q: "Q4'22", e: 1.24, d: -0.03 },
  { q: "Q1'23", e: 1.29, d: 0.05 }, { q: "Q2'23", e: 1.36, d: 0.07 }, { q: "Q3'23", e: 1.44, d: 0.08 }, { q: "Q4'23", e: 1.52, d: 0.08 },
  { q: "Q1'24", e: 1.58, d: 0.06 }, { q: "Q2'24", e: 1.68, d: 0.1 }, { q: "Q3'24", e: 1.79, d: 0.11 }, { q: "Q4'24", e: 1.92, d: 0.13 },
  { q: "Q1'25", e: 2.01, d: 0.09 }, { q: "Q2'25", e: 2.14, d: 0.13 }, { q: "Q3'25", e: 2.31, d: 0.17 }, { q: "Q4'25", e: 2.64, d: 0.28 },
];
const BREADTH = FWD_PATH.map((f, i) => ({ q: f.q, up: 6 + Math.round((f.d + 0.05) * 46) + (i % 3), dn: Math.max(1, Math.round((0.16 - f.d) * 34)) }));

/* revision board */
const BOARD = [
  { k: "Revenue FY26", cur: 5.46, m1: 5.32, m3: 5.11, m6: 4.98, m12: 4.74, u: "$bn", d: 2, n: "Raised on the H-Series backlog and Pune capacity." },
  { k: "Revenue FY27", cur: 6.31, m1: 6.14, m3: 5.94, m6: 5.76, m12: 5.42, u: "$bn", d: 2, n: "Two firms moved to a standalone software build for FY27." },
  { k: "EPS FY26", cur: 2.64, m1: 2.51, m3: 2.36, m6: 2.21, m12: 1.98, u: "$", d: 2, n: "Margin assumptions lifted from 21% to 24.5% operating." },
  { k: "EPS FY27", cur: 3.24, m1: 3.08, m3: 2.91, m6: 2.72, m12: 2.41, u: "$", d: 2, n: "Consensus now has FY27 EPS above the company's own guidance ceiling." },
  { k: "EBITDA FY26", cur: 1.28, m1: 1.22, m3: 1.15, m6: 1.11, m12: 1.04, u: "$bn", d: 2, n: "Stock-based compensation treated as an add-back by 19 of 25." },
  { k: "Free cash flow FY26", cur: 0.62, m1: 0.58, m3: 0.54, m6: 0.52, m12: 0.47, u: "$bn", d: 2, n: "Working-capital release assumed from Q3'26 onward." },
  { k: "Capex FY26", cur: 0.41, m1: 0.42, m3: 0.44, m6: 0.43, m12: 0.4, u: "$bn", d: 2, n: "Ohio phase two pulled forward by a quarter." },
  { k: "Dividend FY26", cur: 1.24, m1: 1.24, m3: 1.2, m6: 1.2, m12: 1.16, u: "$", d: 2, n: "Payout ratio guided to no more than 25% of earnings." },
];

/* ═══════════════════════ 5.a — VINTAGE FAN CHART ═══════════════════════ */
function A5() {
  const t = TONES.paper;
  const [metric, setMetric] = useState<keyof typeof EST>("FY26 revenue");
  const [showNxt, setShowNxt] = useState(false);
  const s = EST[metric];
  const nxt = EST[metric.replace("26", "27") as keyof typeof EST];
  const W = 900, H = 340;
  const all = [...s.lo, ...s.hi, ...(showNxt ? [...nxt.lo, ...nxt.hi] : [])];
  const lo = Math.min(...all), hi = Math.max(...all);
  const X = (i: number) => lin(i, 0, 4, 78, W - 92);
  const Y = (v: number) => lin(v, lo, hi, H - 52, 30);
  const chg = ((s.cons[4] - s.cons[0]) / s.cons[0]) * 100;

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-end justify-between gap-4 border-b pb-3" style={{ borderColor: t.fg }}>
        <div>
          <Caps style={{ color: t.sub }}>Consensus by vintage · low–high range, band = dispersion · {s.unit}</Caps>
          <div className="mt-0.5 font-display text-[21px] italic">
            Every one of the last four quarters has moved the number up — never down.
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Toggle opts={Object.keys(EST) as [string, ...string[]]} value={metric} onChange={(v) => setMetric(v as keyof typeof EST)} t={t} size="sm" />
          <Chip t={t} on={showNxt} onClick={() => setShowNxt(!showNxt)} color="#8E1F2F">next year</Chip>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_248px]">
        <svg viewBox={`0 0 ${W} ${H}`} width="100%" className="block">
          {[0, 0.25, 0.5, 0.75, 1].map((f) => (
            <g key={f}>
              <line x1="78" x2={W - 92} y1={30 + f * (H - 82)} y2={30 + f * (H - 82)} stroke={t.rule} strokeDasharray="2 5" />
              <text x="72" y={34 + f * (H - 82)} fontSize="10" fill={t.sub} textAnchor="end" fontFamily="IBM Plex Mono">
                {(hi - f * (hi - lo)).toFixed(s.dp)}
              </text>
            </g>
          ))}
          {showNxt && (
            <g opacity="0.55">
              <path d={`${poly(nxt.hi.map((v, i) => [X(i), Y(v)] as [number, number]))} ${poly(nxt.lo.slice().reverse().map((v, i) => [X(4 - i), Y(v)] as [number, number])).replace(/^M/, "L")} Z`} fill="#1B3A5C" opacity="0.18" />
              <path d={smooth(nxt.cons.map((v, i) => [X(i), Y(v)] as [number, number]))} fill="none" stroke="#1B3A5C" strokeWidth="2.2" strokeDasharray="6 4" />
              <text x={X(4) + 8} y={Y(nxt.cons[4]) + 4} fontSize="11" fill="#1B3A5C" fontFamily="IBM Plex Mono">FY27</text>
            </g>
          )}
          <path d={`${poly(s.hi.map((v, i) => [X(i), Y(v)] as [number, number]))} ${poly(s.lo.slice().reverse().map((v, i) => [X(4 - i), Y(v)] as [number, number])).replace(/^M/, "L")} Z`} fill="#8E1F2F" opacity="0.17" />
          <path d={poly(s.hi.map((v, i) => [X(i), Y(v)] as [number, number]))} fill="none" stroke="#8E1F2F" strokeWidth="1.3" strokeDasharray="4 3" />
          <path d={poly(s.lo.map((v, i) => [X(i), Y(v)] as [number, number]))} fill="none" stroke="#8E1F2F" strokeWidth="1.3" strokeDasharray="4 3" />
          <path d={smooth(s.cons.map((v, i) => [X(i), Y(v)] as [number, number]))} fill="none" stroke={t.down} strokeWidth="3.2" className="drawIn" />
          {s.cons.map((v, i) => (
            <g key={i}>
              <circle cx={X(i)} cy={Y(v)} r="6" fill={t.down} stroke={t.bg} strokeWidth="2" />
              <text x={X(i)} y={Y(v) - 15} fontSize="12.5" fill={t.fg} textAnchor="middle" fontFamily="IBM Plex Mono" fontWeight="600">
                {v.toFixed(s.dp)}
              </text>
              <text x={X(i)} y={H - 30} fontSize="11" fill={t.sub} textAnchor="middle" fontFamily="IBM Plex Mono">{VINTAGE[i]}</text>
              <text x={X(i)} y={H - 15} fontSize="10" fill={t.sub} textAnchor="middle" fontFamily="IBM Plex Mono">{ANALYST_N[i]} est</text>
            </g>
          ))}
          <line x1="78" x2={W - 92} y1={H - 52} y2={H - 52} stroke={t.fg} />
          <text x="78" y="20" fontSize="10" fill={t.sub} fontFamily="IBM Plex Mono" letterSpacing="1.5">CONSENSUS HIGH ─ ─ &nbsp; LOW ─ ─ &nbsp; MEAN ●</text>
        </svg>

        <aside style={{ borderLeft: `1px solid ${t.rule}` }} className="pl-5">
          <Caps style={{ color: t.down }}>Since Mar'25</Caps>
          <div className="tnum font-sans text-[46px] font-extrabold leading-none tracking-tight" style={{ color: t.up }}>
            +{chg.toFixed(1)}%
          </div>
          <div className="font-mono text-[11.5px]" style={{ color: t.sub }}>
            {s.unit === "$" ? `$${s.cons[0].toFixed(2)} → $${s.cons[4].toFixed(2)}` : `$${s.cons[0].toFixed(2)}bn → $${s.cons[4].toFixed(2)}bn`}
          </div>

          <div className="mt-4 space-y-2">
            {VINTAGE.map((v, i) => {
              const d = i === 0 ? 0 : ((s.cons[i] - s.cons[i - 1]) / s.cons[i - 1]) * 100;
              return (
                <div key={v} className="flex items-center gap-3 border-b pb-1.5" style={{ borderColor: t.rule }}>
                  <span className="w-[52px] font-mono text-[11.5px]" style={{ color: t.sub }}>{v}</span>
                  <span className="tnum flex-1 font-mono text-[13px]">{s.cons[i].toFixed(s.dp)}</span>
                  <span className="tnum font-mono text-[12px]" style={{ color: i === 0 ? t.sub : t.up }}>
                    {i === 0 ? "—" : `+${d.toFixed(1)}%`}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="mt-4">
            <Caps style={{ color: t.sub }}>Dispersion</Caps>
            <svg width="100%" height="70" viewBox="0 0 220 70" className="mt-1 block">
              {s.hi.map((h, i) => {
                const w = ((h - s.lo[i]) / (hi - lo)) * 190;
                return (
                  <g key={i}>
                    <rect x="14" y={8 + i * 12} width={w} height="7" fill="#8E1F2F" opacity={0.25 + i * 0.16} />
                    <text x="8" y={14 + i * 12} fontSize="8.5" fill={t.sub} textAnchor="end" fontFamily="IBM Plex Mono">{VINTAGE[i].slice(0, 3)}</text>
                  </g>
                );
              })}
              <text x="14" y="68" fontSize="9" fill={t.sub} fontFamily="IBM Plex Mono">high − low, same scale as chart</text>
            </svg>
          </div>

          <p className="mt-3 font-display text-[15px] italic leading-relaxed" style={{ color: "rgba(22,18,14,0.74)" }}>
            Dispersion narrowed from {((s.hi[0] - s.lo[0])).toFixed(2)} to {((s.hi[4] - s.lo[4])).toFixed(2)} even as the mean rose — analysts are converging upward, not disagreeing more.
          </p>
        </aside>
      </div>
    </div>
  );
}

/* ═══════════════════════ 5.b — REVISION STEPPER ═══════════════════════ */
function B5() {
  const t = TONES.ink;
  const [sel, setSel] = useState(19);
  const [breadth, setBreadth] = useState(true);
  const W = 940, H = 300;
  const X = (i: number) => lin(i, 0, 19, 54, W - 44);
  const lo = 0.9, hi = 2.9;
  const Y = (v: number) => lin(v, lo, hi, H - 40, 26);
  const cur = FWD_PATH[sel];

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-end justify-between gap-4">
        <div>
          <Caps style={{ color: t.sub }}>Next-twelve-months EPS estimate, twenty reports · forward P/E anchor</Caps>
          <div className="mt-0.5 font-display text-[21px] italic">Every step is a report: the estimate after the print, not the print itself.</div>
        </div>
        <div className="flex gap-3">
          <button onClick={() => setBreadth(!breadth)} className="px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em]" style={{ border: `1px solid ${breadth ? t.down : t.rule}`, color: breadth ? t.down : t.sub }}>
            {breadth ? "hide" : "show"} revision breadth
          </button>
          <span className="px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em]" style={{ background: t.fg, color: t.bg }}>NTM EPS</span>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_248px]">
        <div>
          <svg viewBox={`0 0 ${W} ${H}`} width="100%" className="block" onMouseLeave={() => setSel(19)}>
            {[1.0, 1.5, 2.0, 2.5].map((v) => (
              <g key={v}>
                <line x1="54" x2={W - 44} y1={Y(v)} y2={Y(v)} stroke={t.rule} strokeDasharray="2 5" />
                <text x="48" y={Y(v) + 4} fontSize="10" fill={t.sub} textAnchor="end" fontFamily="IBM Plex Mono">${v.toFixed(2)}</text>
              </g>
            ))}
            {FWD_PATH.map((p, i) => {
              const x = X(i);
              const w = (W - 98) / 20;
              const prev = i === 0 ? p.e - p.d : FWD_PATH[i - 1].e;
              const up = p.d >= 0;
              const on = sel === i;
              return (
                <g key={p.q} onMouseEnter={() => setSel(i)} style={{ cursor: "pointer" }}>
                  <rect x={x - w / 2} y="20" width={w} height={H - 60} fill={on ? "rgba(240,233,225,0.06)" : "transparent"} />
                  <line x1={x - w / 2} x2={x} y1={Y(prev)} y2={Y(prev)} stroke="rgba(240,233,225,0.45)" strokeWidth="1.6" />
                  <line x1={x} x2={x + w / 2} y1={Y(p.e)} y2={Y(p.e)} stroke={up ? t.up : t.down} strokeWidth="2.6" />
                  <line x1={x} x2={x} y1={Y(prev)} y2={Y(p.e)} stroke={up ? t.up : t.down} strokeWidth="1.4" strokeDasharray="3 2" />
                  <text x={x} y={Y(p.e) - 7} fontSize="9.5" fill={up ? t.up : t.down} textAnchor="middle" fontFamily="IBM Plex Mono" fontWeight={on ? 700 : 400}>
                    {up ? "▲" : "▼"}
                  </text>
                  {i % 3 === 0 && <text x={x} y={H - 22} fontSize="9" fill={t.sub} textAnchor="middle" fontFamily="IBM Plex Mono">{p.q.slice(0, 3)}</text>}
                </g>
              );
            })}
            <path d={smooth(FWD_PATH.map((p, i) => [X(i), Y(p.e)] as [number, number]))} fill="none" stroke="#F0E9E1" strokeWidth="1.4" opacity="0.5" />
            <line x1="54" x2={W - 44} y1={H - 40} y2={H - 40} stroke={t.rule} />
          </svg>

          {breadth && (
            <div className="mt-2">
              <Caps style={{ color: t.sub }}>Revision breadth · analysts raising (green) against lowering (claret)</Caps>
              <div className="mt-2 flex items-end gap-[3px]" style={{ height: 62 }}>
                {BREADTH.map((b, i) => (
                  <div key={b.q} className="flex flex-1 flex-col justify-end" style={{ background: sel === i ? "rgba(240,233,225,0.06)" : "transparent" }}>
                    <div style={{ height: b.up * 2.4, background: t.up, opacity: sel === i ? 1 : 0.75 }} />
                    <div style={{ height: b.dn * 2.4, background: t.down, opacity: sel === i ? 1 : 0.75 }} />
                  </div>
                ))}
              </div>
              <div className="mt-1 flex justify-between font-mono text-[10px]" style={{ color: t.sub }}>
                <span>Q1'21</span>
                <span>{BREADTH[sel].up} raised · {BREADTH[sel].dn} lowered after {cur.q}</span>
                <span>Q4'25</span>
              </div>
            </div>
          )}
        </div>

        <aside style={{ borderLeft: `1px solid ${t.rule}` }} className="pl-5">
          <Caps style={{ color: cur.d >= 0 ? t.up : t.down }}>After {cur.q}</Caps>
          <div className="tnum font-sans text-[44px] font-extrabold leading-none tracking-tight">${cur.e.toFixed(2)}</div>
          <div className="font-mono text-[11.5px]" style={{ color: t.sub }}>NTM consensus EPS</div>
          <div className="mt-3 inline-block px-2.5 py-1 font-mono text-[13px]" style={{ background: cur.d >= 0 ? "rgba(87,184,148,0.18)" : "rgba(224,107,107,0.18)", color: cur.d >= 0 ? t.up : t.down }}>
            {cur.d >= 0 ? "+" : ""}{cur.d.toFixed(2)} this quarter
          </div>

          <div className="mt-4 space-y-2">
            {[["12-month change", `+${(((cur.e - FWD_PATH[Math.max(0, sel - 4)].e) / FWD_PATH[Math.max(0, sel - 4)].e) * 100).toFixed(1)}%`], ["Quarters raised", `${FWD_PATH.slice(0, sel + 1).filter((f) => f.d > 0).length} of ${sel + 1}`], ["Largest single step", "+$0.28 · Q4'25"], ["Implied forward P/E", `${(187.42 / cur.e).toFixed(1)}×`], ["Estimates in consensus", `${20 + Math.min(5, Math.floor(sel / 4))}`]].map(([k, v]) => (
              <div key={k} className="flex justify-between border-b pb-1.5" style={{ borderColor: t.rule }}>
                <span className="font-mono text-[10px] uppercase tracking-[0.14em]" style={{ color: t.sub }}>{k}</span>
                <span className="tnum font-mono text-[13px]">{v}</span>
              </div>
            ))}
          </div>

          <p className="mt-4 font-display text-[15px] italic leading-relaxed" style={{ color: t.sub }}>
            Two downgrades of consequence — Q3'22 and Q4'22, the input-cost year — and eighteen consecutive raises since. Estimate revisions of this shape are usually the earliest signal a compounder gives.
          </p>
        </aside>
      </div>
    </div>
  );
}

/* ═══════════════════════ 5.c — REVISION BOARD ═══════════════════════ */
function C5b() {
  const t = TONES.sand;
  const [sort, setSort] = useState<"line" | "chg">("chg");
  const [open, setOpen] = useState<string>("EPS FY26");
  const rows = useMemo(() => {
    const r = BOARD.map((b) => ({ ...b, chg: ((b.cur - b.m12) / b.m12) * 100 }));
    return sort === "chg" ? [...r].sort((a, b) => b.chg - a.chg) : r;
  }, [sort]);

  return (
    <div>
      <div className="mb-5 border-b-2 pb-3" style={{ borderColor: t.fg }}>
        <div className="font-mono text-[10px] uppercase tracking-[0.28em]" style={{ color: t.sub }}>Consensus estimate board · Halcyon Grid · 18 Mar 2026</div>
        <h3 className="mt-1 font-display text-[clamp(26px,3.4vw,42px)] leading-none tracking-tight">
          Every line, five vintages, one direction
        </h3>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 pb-2">
        <Caps style={{ color: t.sub }}>25 contributing analysts · figures as published the morning after each quarter</Caps>
        <Toggle opts={["chg", "line"] as const} value={sort} onChange={setSort} t={t} size="sm" />
      </div>

      <div className="overflow-x-auto scroller">
        <table className="w-full min-w-[760px] border-collapse">
          <thead>
            <tr style={{ borderBottom: `2px solid ${t.fg}` }}>
              <th className="pb-2 text-left"><Caps style={{ color: t.sub }}>Estimate line</Caps></th>
              {["Now", "1m ago", "3m ago", "6m ago", "12m ago"].map((h) => (
                <th key={h} className="pb-2 pl-4 text-right"><Caps style={{ color: t.sub }}>{h}</Caps></th>
              ))}
              <th className="pb-2 pl-4 text-right"><Caps style={{ color: t.sub }}>12m Δ</Caps></th>
              <th className="pb-2 pl-5 text-right"><Caps style={{ color: t.sub }}>Shape</Caps></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((b) => {
              const isOpen = open === b.k;
              const hist = [b.m12, b.m6, b.m3, b.m1, b.cur];
              return (
                <>
                  <tr
                    key={b.k}
                    onClick={() => setOpen(isOpen ? "" : b.k)}
                    className="cursor-pointer"
                    style={{ borderBottom: isOpen ? "none" : `1px solid ${t.rule}`, background: isOpen ? "rgba(35,27,18,0.07)" : "transparent" }}
                  >
                    <td className="py-2.5 pr-3">
                      <span className="flex items-center gap-2 text-[15px]">
                        <span className="font-mono text-[11px]" style={{ color: t.down }}>{isOpen ? "–" : "+"}</span>
                        {b.k}
                      </span>
                    </td>
                    {[b.cur, b.m1, b.m3, b.m6, b.m12].map((v, i) => (
                      <td key={i} className="tnum py-2.5 pl-4 text-right font-mono text-[14px]" style={{ fontWeight: i === 0 ? 700 : 400, color: i === 0 ? t.fg : "rgba(35,27,18,0.7)" }}>
                        {b.u === "$bn" ? v.toFixed(2) : `${b.u}${v.toFixed(2)}`}
                      </td>
                    ))}
                    <td className="tnum py-2.5 pl-4 text-right font-mono text-[14px] font-semibold" style={{ color: b.chg >= 0 ? "#2E5E4A" : "#8E1F2F" }}>
                      {b.chg >= 0 ? "▲ +" : "▼ "}{b.chg.toFixed(1)}%
                    </td>
                    <td className="py-2.5 pl-5">
                      <svg width="86" height="24" viewBox="0 0 86 24" className="ml-auto block">
                        <path d={sparkOf(hist)} fill="none" stroke={b.chg >= 0 ? "#2E5E4A" : "#8E1F2F"} strokeWidth="2" />
                        <circle cx="82" cy={lin(hist[4], Math.min(...hist), Math.max(...hist), 20, 4)} r="3" fill={b.chg >= 0 ? "#2E5E4A" : "#8E1F2F"} />
                      </svg>
                    </td>
                  </tr>
                  {isOpen && (
                    <tr key={b.k + "n"} style={{ borderBottom: `1px solid ${t.rule}`, background: "rgba(35,27,18,0.05)" }}>
                      <td colSpan={9} className="py-3 pl-8">
                        <div className="flex flex-wrap items-baseline gap-x-7 gap-y-2">
                          <p className="max-w-[70ch] font-display text-[17px] italic leading-snug" style={{ color: "rgba(35,27,18,0.8)" }}>“{b.n}”</p>
                          <span className="font-mono text-[11px]" style={{ color: t.sub }}>highest ${b.cur.toFixed(2)} · lowest ${(b.cur * 0.91).toFixed(2)}</span>
                          <span className="font-mono text-[11px]" style={{ color: t.sub }}>next revision window: 23 Apr 2026</span>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-5 flex flex-wrap gap-x-8 gap-y-3 border-t-2 pt-4" style={{ borderColor: t.fg }}>
        {[
          ["Lines raised, 12 months", "7 of 8"],
          ["Largest upgrade", "EPS FY26 · +33.3%"],
          ["Only line cut", "Capex FY26 · +2.5%"],
          ["Consensus vs guidance", "FY26 EPS 17% above the company's own ceiling"],
        ].map(([k, v]) => (
          <div key={k}>
            <Caps style={{ color: t.sub }}>{k}</Caps>
            <div className="tnum font-sans text-[21px] font-bold tracking-tight">{v}</div>
          </div>
        ))}
      </div>
      <span className="sr-only">{nf(rows.length)}</span>
    </div>
  );
}
const sparkOf = (v: number[]) =>
  smooth(v.map((x, i) => [lin(i, 0, v.length - 1, 4, 82), lin(x, Math.min(...v), Math.max(...v), 20, 4)] as [number, number]));

export function C5() {
  const nm = "Analyst estimates trend";
  return (
    <>
      <Plate n={5} letter="a" name={nm} variant="Vintage fan chart — the range as well as the mean" tone="paper" caption="Each vintage plotted as a low–high band around the mean, so dispersion travels with the estimate. Four series are switchable, the next fiscal year overlays in dashed blue, and the rail reports the twelve-month move and the narrowing of the range.">
        <A5 />
      </Plate>
      <Plate n={5} letter="b" name={nm} variant="Revision staircase with breadth underneath" tone="ink" caption="Twenty reports drawn as steps: the flat run to each report, then the jump to the new estimate. Direction colours the step, and the breadth strip below shows how many analysts raised against how many lowered after each print.">
        <B5 />
      </Plate>
      <Plate n={5} letter="c" name={nm} variant="Revision board — eight lines, five vintages" tone="sand" caption="Not a chart at all: the whole consensus surface as a printed table with a shape column, sortable by twelve-month change, each row expanding into the reasoning and the next revision window.">
        <C5b />
      </Plate>
    </>
  );
}

/* ═══════════════════════ shared earnings-history data for plate 7 ═══════════════════════ */
type EH = { q: string; guide: number; cons: number; act: number; rev: number; revG: number; move: number; note: string };
const HISTORY: EH[] = [
  { q: "Q1'23", guide: 0.18, cons: 0.19, act: 0.2, rev: 742, revG: 12.1, move: 3.2, note: "First beat after two in-line quarters; management raised the full-year range." },
  { q: "Q2'23", guide: 0.2, cons: 0.21, act: 0.23, rev: 806, revG: 14.8, move: 6.1, note: "Gross margin 41.6% against 40.4% guided — freight normalisation arriving early." },
  { q: "Q3'23", guide: 0.22, cons: 0.23, act: 0.24, rev: 864, revG: 16.4, move: 2.4, note: "Backlog disclosed for the first time at $980m." },
  { q: "Q4'23", guide: 0.24, cons: 0.25, act: 0.27, rev: 1192, revG: 18.9, move: 7.8, note: "Ohio plant confirmed on schedule; FY24 guidance set above consensus." },
  { q: "Q1'24", guide: 0.14, cons: 0.13, act: 0.16, rev: 878, revG: 18.3, move: 5.4, note: "Guidance deliberately conservative — the only quarter guided above the street." },
  { q: "Q2'24", guide: 0.17, cons: 0.17, act: 0.19, rev: 964, revG: 19.6, move: 4.1, note: "Storage attach rate reached 24% of shipments." },
  { q: "Q3'24", guide: 0.2, cons: 0.2, act: 0.21, rev: 1012, revG: 17.1, move: -1.2, note: "A beat met with a mild sell-off: Europe order intake came in light." },
  { q: "Q4'24", guide: 0.24, cons: 0.24, act: 0.27, rev: 1210, revG: 1.5, move: 9.6, note: "FY25 guidance of $4.6–4.7bn was 4% above consensus." },
  { q: "Q1'25", guide: 0.22, cons: 0.22, act: 0.24, rev: 1046, revG: 19.1, move: 3.7, note: "Tariff headwind quantified for the first time at 120bp." },
  { q: "Q2'25", guide: 0.26, cons: 0.26, act: 0.29, rev: 1164, revG: 20.7, move: 5.9, note: "Pune opened eight weeks early; capacity guided up 34%." },
  { q: "Q3'25", guide: 0.3, cons: 0.3, act: 0.32, rev: 1218, revG: 20.4, move: 2.8, note: "Working-capital absorption flagged; the market shrugged." },
  { q: "Q4'25", guide: 0.36, cons: 0.36, act: 0.41, rev: 1392, revG: 15.0, move: 6.9, note: "H-Series launched with $840m initial backlog; FY26 guide above the street." },
];
const beats = HISTORY.filter((h) => h.act > h.guide).length;

/* ═══════════════════════ 7.a — GUIDED VS DELIVERED ═══════════════════════ */
function A7() {
  const t = TONES.paper;
  const [sel, setSel] = useState(11);
  const [metric, setMetric] = useState<"eps" | "rev">("eps");
  const rows = [...HISTORY].reverse();
  const cur = HISTORY[sel];
  const fmtv = (v: number) => (metric === "eps" ? `$${v.toFixed(2)}` : `$${nf(v)}m`);

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-end justify-between gap-4 border-b pb-3" style={{ borderColor: t.fg }}>
        <div>
          <Caps style={{ color: t.sub }}>Guidance given → result delivered · twelve reported quarters · 2023 – 2025</Caps>
          <div className="mt-0.5 font-display text-[21px] italic">{beats} beats in twelve quarters, and the size of the beat is growing.</div>
        </div>
        <Toggle opts={["eps", "rev"] as const} value={metric} onChange={setMetric} t={t} size="sm" />
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_262px]">
        <div>
          <div className="mb-2 grid gap-3" style={{ gridTemplateColumns: "76px minmax(0,1fr) 92px" }}>
            <Caps style={{ color: t.sub }}>Quarter</Caps>
            <div className="relative">
              <Caps style={{ color: t.sub }}>{metric === "eps" ? "guided ● ─── ● delivered" : "guided ─── delivered"}</Caps>
            </div>
            <Caps style={{ color: t.sub, textAlign: "right" }}>Surprise</Caps>
          </div>

          <div className="space-y-0">
            {rows.map((h) => {
              const gi = HISTORY.indexOf(h);
              const on = sel === gi;
              const lo = metric === "eps" ? 0.1 : 700;
              const hi = metric === "eps" ? 0.45 : 1450;
              const g = metric === "eps" ? h.guide : h.rev * 0.985;
              const a = metric === "eps" ? h.act : h.rev;
              const xg = ((g - lo) / (hi - lo)) * 100;
              const xa = ((a - lo) / (hi - lo)) * 100;
              const beat = a > g;
              return (
                <div
                  key={h.q}
                  onClick={() => setSel(gi)}
                  className="grid cursor-pointer items-center gap-3 py-2"
                  style={{ gridTemplateColumns: "76px minmax(0,1fr) 92px", borderBottom: `1px solid ${t.rule}`, background: on ? "rgba(142,31,47,0.07)" : "transparent" }}
                >
                  <span className="tnum font-mono text-[13px]" style={{ color: on ? t.down : t.fg, fontWeight: on ? 700 : 400 }}>{h.q}</span>
                  <span className="relative h-[26px]">
                    <span className="absolute top-1/2 h-px w-full" style={{ background: "rgba(22,18,14,0.1)" }} />
                    <span className="absolute top-1/2 h-[3px] -translate-y-1/2 transition-all duration-500" style={{ left: `${Math.min(xg, xa)}%`, width: `${Math.abs(xa - xg)}%`, background: beat ? "#2E5E4A" : "#8E1F2F" }} />
                    <span className="absolute top-1/2 h-[13px] w-[13px] -translate-y-1/2 rounded-full" style={{ left: `calc(${xg}% - 6.5px)`, background: t.bg, border: `2px solid ${t.sub}` }} />
                    <span className="absolute top-1/2 h-[15px] w-[15px] -translate-y-1/2 rounded-full" style={{ left: `calc(${xa}% - 7.5px)`, background: beat ? "#2E5E4A" : "#8E1F2F" }} />
                    <span className="absolute top-1/2 -translate-y-1/2 font-mono text-[11px]" style={{ left: `calc(${xa}% + 12px)`, color: beat ? "#2E5E4A" : "#8E1F2F" }}>
                      {fmtv(a)}
                    </span>
                  </span>
                  <span className="text-right">
                    <span className="tnum font-sans text-[15px] font-extrabold" style={{ color: beat ? t.up : t.down }}>
                      +{(((h.act - h.guide) / h.guide) * 100).toFixed(1)}%
                    </span>
                  </span>
                </div>
              );
            })}
          </div>

          <div className="mt-3 flex flex-wrap items-center justify-between gap-4 border-t pt-3" style={{ borderColor: t.rule }}>
            <div className="flex gap-7">
              {[["Beats", `${beats}/12`], ["Avg EPS surprise", "+9.4%"], ["Largest beat", "+13.9% · Q4'25"], ["Misses", "0"]].map(([k, v]) => (
                <span key={k}>
                  <Caps style={{ color: t.sub }}>{k}</Caps>
                  <span className="tnum block font-sans text-[19px] font-bold">{v}</span>
                </span>
              ))}
            </div>
            <span className="font-mono text-[10.5px]" style={{ color: t.sub }}>hollow dot = guidance issued, solid = delivered</span>
          </div>
        </div>

        <aside style={{ borderLeft: `1px solid ${t.rule}` }} className="pl-5">
          <Caps style={{ color: t.down }}>{cur.q} · the guidance given</Caps>
          <div className="mt-1 font-display text-[21px] leading-tight">
            “{cur.q === "Q4'25" ? "We expect first-quarter revenue of $1.34 to $1.38 billion and earnings of 36 to 38 cents." : `Guided EPS of $${cur.guide.toFixed(2)} on revenue of approximately $${nf(cur.rev)}m.`}
          </div>
          <div className="mt-4 space-y-2">
            {[["Guided EPS", `$${cur.guide.toFixed(2)}`], ["Consensus at the time", `$${cur.cons.toFixed(2)}`], ["Delivered EPS", `$${cur.act.toFixed(2)}`], ["Beat vs guidance", `+${(((cur.act - cur.guide) / cur.guide) * 100).toFixed(1)}%`], ["Revenue", `$${nf(cur.rev)}m`], ["Revenue growth", `+${cur.revG.toFixed(1)}%`], ["One-day move", `${cur.move >= 0 ? "+" : ""}${cur.move.toFixed(1)}%`]].map(([k, v]) => (
              <div key={k} className="flex justify-between border-b pb-1.5" style={{ borderColor: t.rule }}>
                <span className="font-mono text-[10px] uppercase tracking-[0.14em]" style={{ color: t.sub }}>{k}</span>
                <span className="tnum font-mono text-[13.5px]" style={{ color: k === "One-day move" ? (cur.move >= 0 ? t.up : t.down) : t.fg }}>{v}</span>
              </div>
            ))}
          </div>
          <p className="mt-4 border-t pt-3 font-display text-[15.5px] italic leading-relaxed" style={{ borderColor: t.rule, color: "rgba(22,18,14,0.74)" }}>
            {cur.note}
          </p>
          <div className="mt-3 flex gap-1.5">
            {HISTORY.map((h, i) => (
              <button key={h.q} onClick={() => setSel(i)} className="h-[14px] flex-1" style={{ background: i === sel ? t.down : "rgba(22,18,14,0.16)" }} aria-label={h.q} />
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}

/* ═══════════════════════ 7.b — SURPRISE HEAT GRID ═══════════════════════ */
function B7() {
  const t = TONES.ink;
  const [sel, setSel] = useState(11);
  const [metric, setMetric] = useState<"surprise" | "move">("surprise");
  const vals = HISTORY.map((h) => (metric === "surprise" ? ((h.act - h.guide) / h.guide) * 100 : h.move));
  const mx = Math.max(...vals.map(Math.abs));
  const cell = (v: number) => {
    const f = Math.abs(v) / mx;
    return v >= 0 ? `rgba(87,184,148,${0.16 + f * 0.72})` : `rgba(224,107,107,${0.16 + f * 0.72})`;
  };
  const cur = HISTORY[sel];

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-end justify-between gap-4">
        <div>
          <Caps style={{ color: t.sub }}>Twelve quarters · colour = magnitude · click any cell for the guidance that was given</Caps>
          <div className="mt-0.5 font-display text-[21px] italic">Not one claret cell — but the market reaction is a different colour story.</div>
        </div>
        <Toggle opts={["surprise", "move"] as const} value={metric} onChange={setMetric} t={t} size="sm" />
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_274px]">
        <div>
          <div className="grid grid-cols-3 gap-px sm:grid-cols-4" style={{ background: t.rule }}>
            {HISTORY.map((h, i) => {
              const v = metric === "surprise" ? ((h.act - h.guide) / h.guide) * 100 : h.move;
              const on = sel === i;
              return (
                <button key={h.q} onClick={() => setSel(i)} className="p-4 text-left transition-all" style={{ background: cell(v), outline: on ? `2px solid #F0E9E1` : "none", outlineOffset: "-2px" }}>
                  <div className="flex items-baseline justify-between">
                    <span className="font-mono text-[11.5px] uppercase tracking-[0.14em]" style={{ color: on ? "#0E1014" : "rgba(240,233,225,0.72)" }}>{h.q}</span>
                    <span className="font-mono text-[10px]" style={{ color: on ? "#0E1014" : "rgba(240,233,225,0.6)" }}>${h.act.toFixed(2)}</span>
                  </div>
                  <div className="tnum mt-2 font-sans text-[34px] font-extrabold leading-none tracking-tight" style={{ color: on ? "#0E1014" : "#F0E9E1" }}>
                    {v >= 0 ? "+" : ""}{v.toFixed(1)}%
                  </div>
                  <div className="mt-1.5 flex h-[5px] w-full" style={{ background: on ? "rgba(14,16,20,0.25)" : "rgba(240,233,225,0.14)" }}>
                    <div style={{ width: `${(h.act / 0.45) * 100}%`, background: on ? "#0E1014" : "#F0E9E1", opacity: 0.65 }} />
                  </div>
                  <div className="mt-1 font-mono text-[9.5px]" style={{ color: on ? "#0E1014" : "rgba(240,233,225,0.6)" }}>
                    guide ${h.guide.toFixed(2)}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-4 border-t pt-3" style={{ borderColor: t.rule }}>
            <div className="flex items-center gap-3">
              <Caps style={{ color: t.sub }}>Scale</Caps>
              {[-12, -6, 0, 6, 12].map((v) => (
                <span key={v} className="tnum flex h-[24px] w-[44px] items-center justify-center font-mono text-[11px]" style={{ background: cell(v), color: "#0E1014" }}>
                  {v > 0 ? "+" : ""}{v}%
                </span>
              ))}
            </div>
            <span className="font-mono text-[10.5px]" style={{ color: t.sub }}>
              {metric === "surprise" ? "surprise = delivered against guidance issued" : "one-day total return on the print"}
            </span>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[["Beat rate", "100%"], ["Average surprise", "+9.4%"], ["Average reaction", "+4.7%"], ["Worst reaction", "−1.2% · Q3'24"]].map(([k, v]) => (
              <div key={k}>
                <Caps style={{ color: t.sub }}>{k}</Caps>
                <div className="tnum font-sans text-[22px] font-bold">{v}</div>
              </div>
            ))}
          </div>
        </div>

        <aside style={{ borderLeft: `1px solid ${t.rule}` }} className="pl-5">
          <Caps style={{ color: t.down }}>{cur.q} detail</Caps>
          <div className="tnum font-sans text-[40px] font-extrabold leading-none tracking-tight">${cur.act.toFixed(2)}</div>
          <div className="font-mono text-[11.5px]" style={{ color: t.sub }}>delivered EPS · guided ${cur.guide.toFixed(2)}</div>

          <div className="mt-4">
            <Caps style={{ color: t.sub }}>Guidance ladder</Caps>
            <div className="mt-2 space-y-2">
              {[
                ["Guidance issued", cur.guide, "rgba(240,233,225,0.35)"],
                ["Street consensus", cur.cons, "#D98324"],
                ["Delivered", cur.act, t.up],
              ].map(([k, v, c]) => (
                <div key={k as string}>
                  <div className="flex justify-between">
                    <span className="font-mono text-[11px]" style={{ color: t.sub }}>{k as string}</span>
                    <span className="tnum font-mono text-[13px]">${(v as number).toFixed(2)}</span>
                  </div>
                  <div className="mt-1 h-[9px] w-full" style={{ background: "rgba(240,233,225,0.09)" }}>
                    <div className="h-full" style={{ width: `${((v as number) / 0.45) * 100}%`, background: c as string }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 space-y-2 border-t pt-3" style={{ borderColor: t.rule }}>
            {[["Revenue", `$${nf(cur.rev)}m`], ["Revenue growth", `+${cur.revG.toFixed(1)}%`], ["Next-day move", `${cur.move >= 0 ? "+" : ""}${cur.move.toFixed(1)}%`], ["Consensus at print", `$${cur.cons.toFixed(2)}`]].map(([k, v]) => (
              <div key={k} className="flex justify-between">
                <span className="font-mono text-[10px] uppercase tracking-[0.14em]" style={{ color: t.sub }}>{k}</span>
                <span className="tnum font-mono text-[13px]">{v}</span>
              </div>
            ))}
          </div>
          <p className="mt-4 font-display text-[15.5px] italic leading-relaxed" style={{ color: t.sub }}>{cur.note}</p>
        </aside>
      </div>
    </div>
  );
}

/* ═══════════════════════ 7.c — THE RECORD ═══════════════════════ */
function C7b() {
  const t = TONES.sand;
  const [sel, setSel] = useState(11);
  const [only, setOnly] = useState("all");
  const rows = HISTORY.filter((h) => (only === "all" ? true : h.move >= 5)).slice().reverse();
  const cur = HISTORY[sel];

  return (
    <div>
      <div className="border-b-2 pb-4" style={{ borderColor: t.fg }}>
        <div className="font-mono text-[10px] uppercase tracking-[0.3em]" style={{ color: t.sub }}>The record · Halcyon Grid Technologies · twelve prints</div>
        <h3 className="mt-2 font-display text-[clamp(30px,4.6vw,56px)] leading-[0.98] tracking-[-0.02em]">
          Eleven beats, one in-line, <span style={{ color: t.down }}>no misses</span>
        </h3>
        <p className="mt-2 max-w-[86ch] font-display text-[18px] italic" style={{ color: "rgba(35,27,18,0.68)" }}>
          Guidance has been conservative every time — and the market has rewarded it with an average of 4.7% on the day.
        </p>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-1.5">
          {["all", "big reactions"].map((f) => (
            <Chip key={f} t={t} on={only === (f === "all" ? "all" : "big")} onClick={() => setOnly(f === "all" ? "all" : "big")} color="#8E1F2F">
              {f}
            </Chip>
          ))}
        </div>
        <Caps style={{ color: t.sub }}>click any row to pull its guidance quote</Caps>
      </div>

      <div className="mt-3 overflow-x-auto scroller">
        <table className="w-full min-w-[760px] border-collapse">
          <thead>
            <tr style={{ borderBottom: `2px solid ${t.fg}` }}>
              {["Quarter", "Guided", "Consensus", "Delivered", "Surprise", "Revenue", "One-day", "Shape"].map((h, i) => (
                <th key={h} className={`pb-2 ${i === 0 ? "text-left" : "text-right"}`}><Caps style={{ color: t.sub }}>{h}</Caps></th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((h) => {
              const gi = HISTORY.indexOf(h);
              const on = sel === gi;
              const s = ((h.act - h.guide) / h.guide) * 100;
              return (
                <>
                  <tr
                    key={h.q}
                    onClick={() => setSel(gi)}
                    className="cursor-pointer"
                    style={{ borderBottom: on ? "none" : `1px solid ${t.rule}`, background: on ? "rgba(35,27,18,0.08)" : "transparent" }}
                  >
                    <td className="py-3 pr-3">
                      <span className="tnum font-sans text-[17px] font-bold" style={{ color: on ? t.down : t.fg }}>{h.q}</span>
                    </td>
                    <td className="tnum py-3 pl-4 text-right font-mono text-[14px]" style={{ color: "rgba(35,27,18,0.66)" }}>${h.guide.toFixed(2)}</td>
                    <td className="tnum py-3 pl-4 text-right font-mono text-[14px]" style={{ color: "#1B3A5C" }}>${h.cons.toFixed(2)}</td>
                    <td className="tnum py-3 pl-4 text-right font-sans text-[19px] font-extrabold">${h.act.toFixed(2)}</td>
                    <td className="tnum py-3 pl-4 text-right font-mono text-[14px] font-semibold" style={{ color: "#2E5E4A" }}>+{s.toFixed(1)}%</td>
                    <td className="tnum py-3 pl-4 text-right font-mono text-[14px]">${nf(h.rev)}m</td>
                    <td className="py-3 pl-4 text-right">
                      <span className="inline-flex items-center justify-end gap-2">
                        <span className="block h-[9px]" style={{ width: Math.abs(h.move) * 7, background: h.move >= 0 ? "#2E5E4A" : "#8E1F2F" }} />
                        <span className="tnum font-mono text-[13.5px]" style={{ width: 52, textAlign: "right", color: h.move >= 0 ? "#2E5E4A" : "#8E1F2F" }}>
                          {h.move >= 0 ? "+" : ""}{h.move.toFixed(1)}%
                        </span>
                      </span>
                    </td>
                    <td className="py-3 pl-4 text-right">
                      <svg width="78" height="22" viewBox="0 0 78 22" className="ml-auto block">
                        <rect x="2" y="4" width="74" height="14" fill="rgba(35,27,18,0.08)" />
                        <rect x={2 + ((h.guide - 0.1) / 0.35) * 74} y="4" width="2" height="14" fill="#1B3A5C" />
                        <rect x={2 + ((h.act - 0.1) / 0.35) * 74} y="2" width="4" height="18" fill="#2E5E4A" />
                      </svg>
                    </td>
                  </tr>
                  {on && (
                    <tr key={h.q + "q"} style={{ borderBottom: `1px solid ${t.rule}`, background: "rgba(35,27,18,0.05)" }}>
                      <td colSpan={8} className="py-4 pl-4">
                        <div className="grid gap-5 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
                          <div>
                            <Caps style={{ color: t.sub }}>What management said when they guided</Caps>
                            <p className="mt-1 max-w-[76ch] border-l-2 pl-3 font-display text-[19px] italic leading-snug" style={{ borderColor: t.down }}>
                              “{cur.q === "Q4'25" ? "First-quarter revenue of $1.34 to $1.38 billion, earnings of 36 to 38 cents, and free cash flow conversion of at least 95% of net income." : `We are guiding to earnings of $${h.guide.toFixed(2)} for ${h.q}, with revenue of approximately $${nf(h.rev)} million.`}
                              ”
                            </p>
                            <div className="mt-1.5 font-mono text-[11px]" style={{ color: t.sub }}>{h.q} call · prepared remarks · {h.note}</div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            {[["Beat vs guidance", `+${s.toFixed(1)}%`], ["Beat vs consensus", `+${(((h.act - h.cons) / h.cons) * 100).toFixed(1)}%`], ["Revenue growth", `+${h.revG.toFixed(1)}%`], ["Next-day move", `${h.move >= 0 ? "+" : ""}${h.move.toFixed(1)}%`]].map(([k, v]) => (
                              <div key={k}>
                                <Caps style={{ color: t.sub }}>{k}</Caps>
                                <div className="tnum font-sans text-[24px] font-extrabold leading-none" style={{ color: v.startsWith("−") || v.startsWith("-") ? t.down : "#2E5E4A" }}>{v}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-5 flex flex-wrap gap-x-9 gap-y-3 border-t-2 pt-4" style={{ borderColor: t.fg }}>
        {[["Beat rate", "12 / 12"], ["Average surprise", "+9.4%"], ["Average reaction", "+4.7%"], ["Total 3-yr reaction", "+56.1%"], ["Guidance raised", "6 times"]].map(([k, v]) => (
          <div key={k}>
            <Caps style={{ color: t.sub }}>{k}</Caps>
            <div className="tnum font-sans text-[26px] font-extrabold tracking-tight">{v}</div>
          </div>
        ))}
      </div>
      <span className="sr-only">{nf(beats)}</span>
    </div>
  );
}

export function C7() {
  const nm = "Earnings history";
  return (
    <>
      <Plate n={7} letter="a" name={nm} variant="Guided to delivered — a dot and a line for every quarter" tone="paper" caption="Hollow dot is the guidance issued, solid dot the result: the length of the connector is the beat. Newest first, switchable between EPS and revenue, with the selected quarter's full guidance quote in the margin.">
        <A7 />
      </Plate>
      <Plate n={7} letter="b" name={nm} variant="Surprise heat grid with a guidance ladder" tone="ink" caption="Twelve cells coloured by magnitude, switchable between surprise and market reaction — which is the point, since they are not the same story. Selecting a cell breaks the print into guidance, consensus and delivered as three bars.">
        <B7 />
      </Plate>
      <Plate n={7} letter="c" name={nm} variant="The record — a broadsheet table with expandable quotes" tone="sand" caption="Set as a results record: display headline stating the streak, a seven-column table with a reaction bar and a guide-versus-delivered strip, and a row that opens onto the words management actually used when they set the number.">
        <C7b />
      </Plate>
    </>
  );
}
