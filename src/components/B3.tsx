import { useMemo, useState } from "react";
import { Caps, Plate, Toggle, TONES, lin, poly, smooth, nf } from "@/ui";

/* ═══════════════════════ shared data for plate 53 ═══════════════════════ */
type Ind = { k: string; v: number; sig: "Buy" | "Sell" | "Neutral"; d: number; note: string; series: number[] };
const mk = (a: number[]) => a;
const INDS: Ind[] = [
  { k: "RSI (14)", v: 61.4, sig: "Neutral", d: 4.2, note: "Rising from 57, well short of overbought at 70.", series: mk([44, 48, 52, 49, 55, 58, 57, 61]) },
  { k: "MACD (12,26,9)", v: 2.84, sig: "Buy", d: 0.61, note: "Line crossed above signal on 06 Mar and has widened every session since.", series: mk([-1.2, -0.8, -0.3, 0.4, 1.1, 1.9, 2.3, 2.84]) },
  { k: "Stochastic %K", v: 74.2, sig: "Buy", d: 11.8, note: "Above %D for a ninth session — the longest such run since November.", series: mk([52, 58, 47, 61, 66, 70, 69, 74]) },
  { k: "ADX (14)", v: 28.6, sig: "Buy", d: 3.1, note: "Trend strength above 25 confirms the uptrend rather than a range.", series: mk([18, 20, 19, 22, 24, 25, 27, 29]) },
  { k: "ATR (14)", v: 4.62, sig: "Neutral", d: -0.34, note: "Average true range of $4.62 — 2.5% of price; position sizing on a 2% stop.", series: mk([3.9, 4.4, 5.1, 5.6, 5.2, 4.9, 4.8, 4.6]) },
  { k: "OBV trend", v: 1.94, sig: "Buy", d: 0.22, note: "On-balance volume slope positive for 24 of the last 34 sessions.", series: mk([1.1, 1.2, 1.35, 1.3, 1.5, 1.7, 1.8, 1.94]) },
  { k: "20 / 50 / 200 DMA", v: 1, sig: "Buy", d: 1, note: "Price above all three averages and the averages are stacked bullish.", series: mk([98, 104, 112, 118, 126, 138, 152, 168]) },
  { k: "Bollinger %B", v: 0.71, sig: "Neutral", d: 0.08, note: "Inside the upper band; not yet tagging it as it did in December.", series: mk([0.4, 0.55, 0.62, 0.5, 0.66, 0.78, 0.7, 0.71]) },
];
const TIMEFRAMES = ["5D", "1M", "3M", "6M", "1Y"];
const MATRIX: Record<string, Record<string, number>> = {
  "RSI (14)": { "5D": 4, "1M": 3, "3M": 3, "6M": 2, "1Y": 3 },
  "MACD": { "5D": 5, "1M": 4, "3M": 5, "6M": 5, "1Y": 4 },
  "Stochastic": { "5D": 5, "1M": 3, "3M": 4, "6M": 3, "1Y": 3 },
  "ADX": { "5D": 4, "1M": 4, "3M": 5, "6M": 4, "1Y": 5 },
  "Momentum": { "5D": 4, "1M": 5, "3M": 5, "6M": 4, "1Y": 5 },
  "On-balance volume": { "5D": 3, "1M": 4, "3M": 5, "6M": 5, "1Y": 4 },
  "20-day DMA": { "5D": 5, "1M": 5, "3M": 5, "6M": 5, "1Y": 5 },
  "50-day DMA": { "5D": 4, "1M": 5, "3M": 4, "6M": 5, "1Y": 4 },
  "200-day DMA": { "5D": 3, "1M": 4, "3M": 4, "6M": 4, "1Y": 5 },
  "CCI (20)": { "5D": 4, "1M": 3, "3M": 4, "6M": 3, "1Y": 3 },
  "Williams %R": { "5D": 5, "1M": 4, "3M": 3, "6M": 3, "1Y": 4 },
  "Aroon": { "5D": 4, "1M": 4, "3M": 5, "6M": 4, "1Y": 4 },
};

/* ═══════════════════════ 53.a — COMPOSITE DASHBOARD ═══════════════════════ */
function A() {
  const t = TONES.paper;
  const [open, setOpen] = useState<string>("MACD (12,26,9)");
  const [tf, setTf] = useState("3M");
  const score = 68;
  const buys = INDS.filter((i) => i.sig === "Buy").length;
  const cur = INDS.find((i) => i.k === open)!;

  return (
    <div>
      <div className="mb-5 grid gap-6 border-b pb-4 lg:grid-cols-[280px_minmax(0,1fr)]" style={{ borderColor: t.fg }}>
        <div className="flex items-center gap-5">
          <svg width="118" height="118" viewBox="0 0 118 118">
            <circle cx="59" cy="59" r="48" fill="none" stroke={t.rule} strokeWidth="13" />
            <circle
              cx="59" cy="59" r="48" fill="none" stroke={t.down} strokeWidth="13" strokeDasharray={`${(score / 100) * 301.6} 301.6`}
              strokeLinecap="butt" transform="rotate(-90 59 59)"
            />
            <text x="59" y="62" fontSize="34" fill={t.fg} textAnchor="middle" fontFamily="Archivo" fontWeight="800">{score}</text>
            <text x="59" y="79" fontSize="9.5" fill={t.sub} textAnchor="middle" fontFamily="IBM Plex Mono" letterSpacing="1.4">OF 100</text>
          </svg>
          <div>
            <Caps style={{ color: t.sub }}>Composite technical score</Caps>
            <div className="font-sans text-[30px] font-extrabold leading-none tracking-tight" style={{ color: t.down }}>BUY</div>
            <div className="mt-1 font-mono text-[11px]" style={{ color: t.sub }}>
              {buys} buy · {INDS.filter((i) => i.sig === "Neutral").length} neutral · {INDS.filter((i) => i.sig === "Sell").length} sell
            </div>
          </div>
        </div>
        <div className="flex flex-col justify-center gap-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="font-display text-[19px] italic">Eight indicators, one reading — click any card to open its reasoning.</span>
            <Toggle opts={["5D", "1M", "3M", "6M", "1Y"] as const} value={tf} onChange={setTf} t={t} size="sm" />
          </div>
          <div className="flex h-[26px] w-full overflow-hidden" style={{ border: `1px solid ${t.rule}` }}>
            <div className="flex items-center justify-center" style={{ width: `${(buys / 8) * 100}%`, background: "#2E5E4A", color: "#F7E7DA" }}>
              <span className="font-mono text-[10px]">BUY {buys}</span>
            </div>
            <div className="flex items-center justify-center" style={{ width: `${(4 / 8) * 100}%`, background: "rgba(22,18,14,0.14)" }}>
              <span className="font-mono text-[10px]">NEUTRAL 4</span>
            </div>
            <div className="flex items-center justify-center" style={{ width: "0%", background: "#8E1F2F" }} />
          </div>
          <div className="grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-4">
            {[["Above 20-day", "Yes"], ["Above 50-day", "Yes"], ["Above 200-day", "Yes"], ["52-wk percentile", "91st"]].map(([k, v]) => (
              <div key={k}>
                <Caps style={{ color: t.sub }}>{k}</Caps>
                <div className="font-sans text-[17px] font-bold">{v}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-px sm:grid-cols-2 lg:grid-cols-4" style={{ background: t.rule }}>
        {INDS.map((i) => {
          const on = open === i.k;
          const col = i.sig === "Buy" ? "#2E5E4A" : i.sig === "Sell" ? "#8E1F2F" : "#8A7F73";
          const lo = Math.min(...i.series), hi = Math.max(...i.series);
          return (
            <button
              key={i.k}
              onClick={() => setOpen(on ? "" : i.k)}
              className="p-4 text-left transition-colors"
              style={{ background: on ? "#FBF1E9" : t.bg, boxShadow: on ? `inset 0 -3px 0 ${col}` : "none" }}
            >
              <div className="flex items-baseline justify-between">
                <span className="font-mono text-[10px] uppercase tracking-[0.14em]" style={{ color: t.sub }}>{i.k}</span>
                <span className="h-[9px] w-[9px] rounded-full" style={{ background: col }} />
              </div>
              <div className="tnum mt-1 font-sans text-[26px] font-extrabold leading-none tracking-tight">
                {i.k.startsWith("20 /") ? "Bull" : i.v.toFixed(i.v > 10 ? 1 : 2)}
              </div>
              <div className="font-mono text-[10.5px]" style={{ color: i.d >= 0 ? t.up : t.down }}>
                {i.d >= 0 ? "▲" : "▼"} {Math.abs(i.d).toFixed(2)} over {tf}
              </div>
              <svg width="100%" height="42" viewBox="0 0 160 42" className="mt-2 block" preserveAspectRatio="none">
                <path d={poly(i.series.map((v, j) => [lin(j, 0, i.series.length - 1, 3, 157), lin(v, lo, hi, 37, 5)] as [number, number]))} fill="none" stroke={col} strokeWidth="2" />
                <path d={`${poly(i.series.map((v, j) => [lin(j, 0, i.series.length - 1, 3, 157), lin(v, lo, hi, 37, 5)] as [number, number]))} L157,41 L3,41 Z`} fill={col} opacity="0.12" />
              </svg>
              <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.14em]" style={{ color: col }}>{i.sig}</div>
            </button>
          );
        })}
      </div>

      <div className="mt-4 border-t pt-3" style={{ borderColor: t.rule }}>
        <Caps style={{ color: t.down }}>{cur.k}</Caps>
        <p className="mt-1 max-w-[86ch] font-display text-[17px] italic leading-relaxed">{cur.note}</p>
        <div className="mt-2 flex flex-wrap gap-5 font-mono text-[11px]" style={{ color: t.sub }}>
          <span>Period {tf}</span>
          <span>Value {cur.v.toFixed(2)}</span>
          <span>Signal {cur.sig}</span>
          <span>Last computed 18 Mar 2026, 15:42 ET on adjusted closes</span>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════ 53.b — DENSE SIGNAL TABLE ═══════════════════════ */
function P53B() {
  const t = TONES.ink;
  const [filter, setFilter] = useState<"all" | "Buy" | "Sell" | "Neutral">("all");
  const [sortKey, setSortKey] = useState<"name" | "strength">("strength");
  const rows = useMemo(() => {
    const r = INDS.filter((i) => filter === "all" || i.sig === filter);
    return sortKey === "name" ? [...r].sort((a, b) => a.k.localeCompare(b.k)) : [...r].sort((a, b) => (b.sig === "Buy" ? 1 : 0) - (a.sig === "Buy" ? 1 : 0) || b.d - a.d);
  }, [filter, sortKey]);
  const overall = 68;

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-end justify-between gap-4">
        <div>
          <Caps style={{ color: t.sub }}>HLG · daily technicals · 18 Mar 2026</Caps>
          <div className="mt-0.5 font-display text-[21px] italic">Eight readings, three periods, one verdict per row.</div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="inline-flex" style={{ border: `1px solid ${t.rule}` }}>
            {(["all", "Buy", "Neutral", "Sell"] as const).map((f, i) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className="px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em]"
                style={{ background: filter === f ? t.down : "transparent", color: filter === f ? t.bg : t.sub, borderLeft: i ? `1px solid ${t.rule}` : "none" }}
              >
                {f}
              </button>
            ))}
          </div>
          <Toggle opts={["name", "strength"] as const} value={sortKey} onChange={setSortKey} t={t} size="sm" />
        </div>
      </div>

      <div className="overflow-x-auto scroller">
        <table className="w-full min-w-[860px] border-collapse">
          <thead>
            <tr style={{ borderBottom: `2px solid ${t.fg}` }}>
              {["Indicator", "Value", "1 week ago", "1 month ago", "Change", "Signal", "Strength", "Note"].map((h, i) => (
                <th key={h} className={`pb-2 ${i === 7 ? "text-left" : "text-right"} ${i === 0 ? "text-left" : ""}`} style={{ width: i === 7 ? "auto" : undefined }}>
                  <Caps style={{ color: t.sub }}>{h}</Caps>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => {
              const col = r.sig === "Buy" ? t.up : r.sig === "Sell" ? t.down : t.sub;
              const strength = r.sig === "Buy" ? 60 + r.d * 6 : r.sig === "Sell" ? 40 : 50;
              return (
                <tr key={r.k} style={{ borderBottom: `1px solid ${t.rule}` }}>
                  <td className="py-2.5 pr-3">
                    <span className="font-mono text-[12.5px]" style={{ color: "#F0E9E1" }}>{r.k}</span>
                  </td>
                  <td className="tnum py-2.5 pl-3 text-right font-mono text-[13.5px]" style={{ color: "#F0E9E1", fontWeight: 600 }}>
                    {r.k.startsWith("20 /") ? "Bull" : r.v.toFixed(2)}
                  </td>
                  <td className="tnum py-2.5 pl-3 text-right font-mono text-[12.5px]" style={{ color: t.sub }}>
                    {(r.v - r.d * 0.4).toFixed(2)}
                  </td>
                  <td className="tnum py-2.5 pl-3 text-right font-mono text-[12.5px]" style={{ color: t.sub }}>
                    {(r.v - r.d * 1.6).toFixed(2)}
                  </td>
                  <td className="tnum py-2.5 pl-3 text-right font-mono text-[12.5px]" style={{ color: r.d >= 0 ? t.up : t.down }}>
                    {r.d >= 0 ? "▲" : "▼"} {Math.abs(r.d).toFixed(2)}
                  </td>
                  <td className="py-2.5 pl-3 text-right">
                    <span className="inline-flex items-center gap-1.5 font-mono text-[11.5px]" style={{ color: col }}>
                      <span className="h-[8px] w-[8px] rounded-full" style={{ background: col }} />
                      {r.sig}
                    </span>
                  </td>
                  <td className="py-2.5 pl-3">
                    <div className="ml-auto flex w-[92px] gap-[2px]">
                      {Array.from({ length: 10 }).map((_, i) => (
                        <span key={i} className="h-[12px] flex-1" style={{ background: i < Math.round(strength / 10) ? col : "rgba(240,233,225,0.14)" }} />
                      ))}
                    </div>
                  </td>
                  <td className="py-2.5 pl-4 text-[12.5px]" style={{ color: "rgba(240,233,225,0.62)" }}>{r.note}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-4 border-t pt-3" style={{ borderColor: t.rule }}>
        <div className="flex items-center gap-4">
          <Caps style={{ color: t.sub }}>Overall</Caps>
          <div className="flex h-[24px] w-[260px] overflow-hidden" style={{ border: `1px solid ${t.rule}` }}>
            <div style={{ width: `${overall}%`, background: t.up }} />
            <div style={{ width: `${100 - overall}%`, background: "rgba(224,107,107,0.4)" }} />
          </div>
          <span className="tnum font-sans text-[20px] font-extrabold" style={{ color: t.up }}>{overall}</span>
          <span className="font-mono text-[11px]" style={{ color: t.sub }}>moderate buy</span>
        </div>
        <span className="font-mono text-[10.5px]" style={{ color: t.sub }}>
          Adjusted closes, split-adjusted · 14-period defaults · computed nightly
        </span>
      </div>
    </div>
  );
}

/* ═══════════════════════ 53.c — SIGNAL MATRIX ═══════════════════════ */
function P53C() {
  const t = TONES.blueprint;
  const [sel, setSel] = useState<string | null>(null);
  const keys = Object.keys(MATRIX);
  const cellColor = (v: number) => v >= 5 ? "#63C2A6" : v >= 4 ? "rgba(99,194,166,0.55)" : v >= 3 ? "rgba(230,237,245,0.16)" : v >= 2 ? "rgba(232,138,122,0.5)" : "#E88A7A";
  const counts = TIMEFRAMES.map((tf) => keys.filter((k) => MATRIX[k][tf] >= 4).length);

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-end justify-between gap-4">
        <div>
          <Caps style={{ color: t.sub }}>Signal strength by indicator and lookback · 1 = strong sell, 5 = strong buy</Caps>
          <div className="mt-0.5 font-display text-[21px] italic">Sixty readings on one grid — where the signals agree, and where they fight.</div>
        </div>
        <div className="flex gap-4">
          {TIMEFRAMES.map((tf, i) => (
            <div key={tf} className="text-center">
              <div className="tnum font-sans text-[24px] font-extrabold leading-none" style={{ color: counts[i] >= 9 ? t.up : counts[i] >= 6 ? "#E6EDF5" : t.down }}>
                {counts[i]}
              </div>
              <div className="font-mono text-[9.5px] uppercase tracking-[0.14em]" style={{ color: t.sub }}>{tf}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto scroller">
        <table className="w-full min-w-[720px] border-collapse">
          <thead>
            <tr>
              <th className="pb-2 pr-4 text-left"><Caps style={{ color: t.sub }}>Indicator</Caps></th>
              {TIMEFRAMES.map((tf) => (
                <th key={tf} className="pb-2 text-center" style={{ width: 92 }}>
                  <span className="font-mono text-[11px] tracking-[0.16em]" style={{ color: t.sub }}>{tf}</span>
                </th>
              ))}
              <th className="pb-2 pl-4 text-right"><Caps style={{ color: t.sub }}>Average</Caps></th>
            </tr>
          </thead>
          <tbody>
            {keys.map((k) => {
              const avg = TIMEFRAMES.reduce((s, tf) => s + MATRIX[k][tf], 0) / TIMEFRAMES.length;
              return (
                <tr key={k} onMouseEnter={() => setSel(k)} onMouseLeave={() => setSel(null)} style={{ borderBottom: `1px solid ${t.rule}` }}>
                  <td className="py-1 pr-4 text-[13px]" style={{ color: sel === k ? "#E6EDF5" : "rgba(230,237,245,0.78)" }}>{k}</td>
                  {TIMEFRAMES.map((tf) => {
                    const v = MATRIX[k][tf];
                    const on = sel === k;
                    return (
                      <td key={tf} className="p-[3px]">
                        <div
                          className="flex h-[34px] items-center justify-center transition-transform duration-200"
                          style={{ background: cellColor(v), transform: on ? "scale(1.06)" : "none", outline: on ? "1.5px solid #E6EDF5" : "none" }}
                        >
                          <span className="tnum font-mono text-[13px] font-semibold" style={{ color: v >= 4 ? "#12243A" : v >= 3 ? "#E6EDF5" : "#12243A" }}>{v}</span>
                        </div>
                      </td>
                    );
                  })}
                  <td className="py-1 pl-4 text-right">
                    <span className="tnum font-mono text-[13px]" style={{ color: avg >= 4 ? t.up : avg >= 3 ? "#E6EDF5" : t.down }}>{avg.toFixed(1)}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr style={{ borderTop: `2px solid ${t.fg}` }}>
              <td className="pt-2 pr-4"><Caps style={{ color: t.down }}>Buy signals</Caps></td>
              {TIMEFRAMES.map((tf, i) => (
                <td key={tf} className="pt-2 text-center">
                  <span className="tnum font-sans text-[18px] font-extrabold" style={{ color: counts[i] >= 9 ? t.up : "#E6EDF5" }}>{counts[i]}</span>
                </td>
              ))}
              <td className="pt-2 pl-4 text-right font-mono text-[12px]" style={{ color: t.sub }}>/ 12</td>
            </tr>
          </tfoot>
        </table>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-4 border-t pt-3" style={{ borderColor: t.rule }}>
        <div className="flex items-center gap-2">
          <Caps style={{ color: t.sub }}>Scale</Caps>
          {[1, 2, 3, 4, 5].map((v) => (
            <span key={v} className="flex h-[22px] w-[34px] items-center justify-center font-mono text-[11px]" style={{ background: cellColor(v), color: v >= 4 || v < 3 ? "#12243A" : "#E6EDF5" }}>
              {v}
            </span>
          ))}
          <span className="font-mono text-[10px]" style={{ color: t.sub }}>sell → buy</span>
        </div>
        <p className="max-w-[60ch] font-display text-[15px] italic" style={{ color: t.sub }}>
          {sel
            ? `${sel} is ${MATRIX[sel][TIMEFRAMES[0]] >= 4 ? "positive" : "soft"} on the short lookback and ${MATRIX[sel]["1Y"] >= 4 ? "positive" : "soft"} over a year.`
            : "Point at a row to read that indicator across all five lookbacks at once."}
        </p>
      </div>
    </div>
  );
}

export function C53() {
  const nm = "Technical indicator panel";
  return (
    <>
      <Plate n={53} letter="a" name={nm} variant="Composite score with eight expandable indicator cards" tone="paper" caption="A ring gauge for the headline, a stacked bar for the tally, and a card grid where each tile carries its own eight-session sparkline. Clicking a card opens the reasoning in place rather than navigating away.">
        <A />
      </Plate>
      <Plate n={53} letter="b" name={nm} variant="Dense signal table with a ten-segment strength bar" tone="ink" caption="The same eight readings as a working table: current, week and month values, direction, signal dot, a segmented strength meter, and a written note. Filter by verdict or sort by strength.">
        <P53B />
      </Plate>
      <Plate n={53} letter="c" name={nm} variant="Indicator × timeframe heat matrix" tone="blueprint" caption="Twelve indicators against five lookbacks, sixty cells, one colour scale. The foot of the table counts buy signals per lookback, so disagreement between short and long horizons becomes visible in a single row of numbers.">
        <P53C />
      </Plate>
    </>
  );
}

/* ═══════════════════════ shared data for plate 57 ═══════════════════════ */
const MY = ["2018", "2019", "2020", "2021", "2022", "2023", "2024", "2025"];
const SHARE = [
  { t: "NVPT", n: "Novanta Power", c: "#1B3A5C", v: [24.1, 23.4, 22.6, 21.8, 21.0, 20.2, 19.7, 19.2] },
  { t: "HLG", n: "Halcyon Grid", c: "#8E1F2F", v: [9.4, 10.1, 10.9, 11.8, 12.6, 13.4, 14.1, 14.8] },
  { t: "BLNE", n: "Brightline Electric", c: "#D98324", v: [13.8, 13.6, 13.4, 13.1, 12.9, 12.8, 12.7, 12.6] },
  { t: "TDNE", n: "Terradyne Energy", c: "#2E5E4A", v: [5.2, 5.9, 6.6, 7.4, 8.1, 8.7, 9.0, 9.4] },
  { t: "KSDL", n: "Kestrel Drives", c: "#5C1420", v: [9.8, 9.6, 9.4, 9.2, 8.9, 8.6, 8.5, 8.3] },
  { t: "CNDR", n: "Cinder Works", c: "#8A7F73", v: [8.6, 8.4, 8.2, 7.9, 7.6, 7.4, 7.2, 7.1] },
  { t: "ORBK", n: "Orbis Power", c: "#B8404E", v: [1.8, 2.2, 2.7, 3.3, 3.9, 4.4, 4.8, 5.2] },
  { t: "Other", n: "Everyone else", c: "rgba(138,127,115,0.42)", v: [27.3, 26.8, 26.2, 25.4, 25.0, 24.5, 23.3, 23.4] },
];

/* ═══════════════════════ 57.a — STACKED SHARE AREA ═══════════════════════ */
function P57A() {
  const t = TONES.paper;
  const [year, setYear] = useState(7);
  const [mode, setMode] = useState<"pct" | "abs">("pct");
  const [hover, setHover] = useState<number | null>(null);
  const W = 940, H = 400;
  const X = (i: number) => lin(i, 0, MY.length - 1, 58, W - 130);
  const totalRev = [21.4, 22.8, 21.2, 24.6, 26.9, 29.4, 31.6, 33.1];
  const Y = (v: number) => lin(v, 0, 100, H - 44, 24);

  let acc = new Array(MY.length).fill(0) as number[];
  const bands = SHARE.map((s) => {
    const bottom = [...acc];
    const val = s.v.map((v, i) => (mode === "pct" ? v : (v / 100) * totalRev[i]));
    acc = acc.map((a, i) => a + val[i]);
    return { s, bottom, val };
  });

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-end justify-between gap-4 border-b pb-3" style={{ borderColor: t.fg }}>
        <div>
          <Caps style={{ color: t.sub }}>Global interconnection equipment · share of served market, 2018 – 2025</Caps>
          <div className="mt-0.5 font-display text-[21px] italic">Halcyon has taken 5.4 points of share in seven years; Novanta has given up 4.9.</div>
        </div>
        <div className="flex items-center gap-4">
          <Toggle opts={["pct", "abs"] as const} value={mode} onChange={setMode} t={t} size="sm" />
          <div className="flex gap-1.5">
            {MY.map((y, i) => (
              <button key={y} onClick={() => { setYear(i); setHover(i); }} className="px-2 py-1 font-mono text-[10px]" style={{ border: `1px solid ${year === i ? t.down : t.rule}`, color: year === i ? t.bg : t.sub, background: year === i ? t.down : "transparent" }}>
                {y.slice(2)}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_246px]">
        <svg viewBox={`0 0 ${W} ${H}`} width="100%" className="block" onMouseLeave={() => setHover(null)}>
          {[0, 25, 50, 75, 100].map((v) => (
            <g key={v}>
              <line x1="58" x2={W - 130} y1={Y(v)} y2={Y(v)} stroke={t.rule} strokeDasharray="2 5" />
              <text x="52" y={Y(v) + 4} fontSize="10" fill={t.sub} textAnchor="end" fontFamily="IBM Plex Mono">{v}{mode === "pct" ? "%" : "bn"}</text>
            </g>
          ))}
          {bands.map(({ s, bottom, val }) => {
            const top = bottom.map((b, i) => b + val[i]);
            const d =
              `${poly(top.map((v, i) => [X(i), Y(mode === "pct" ? v : (v / totalRev[i]) * 100)] as [number, number]))} ` +
              `${poly(bottom.slice().reverse().map((v, i) => [X(MY.length - 1 - i), Y(mode === "pct" ? v : (v / totalRev[MY.length - 1 - i]) * 100)] as [number, number])).replace(/^M/, "L")}`;
            const mid = (Y(mode === "pct" ? (top[7] + bottom[7]) / 2 : ((top[7] + bottom[7]) / 2 / totalRev[7]) * 100));
            return (
              <g key={s.t} onMouseEnter={() => setHover(7)}>
                <path d={d} fill={s.c} opacity={0.88} />
                <text x={W - 124} y={mid + 4} fontSize="12" fill={t.fg} fontFamily="IBM Plex Mono" fontWeight={s.t === "HLG" ? 700 : 500}>
                  {s.t} {s.v[7].toFixed(1)}
                </text>
              </g>
            );
          })}
          {(hover !== null ? [hover] : []).map((i) => (
            <g key={i}>
              <line x1={X(i)} x2={X(i)} y1="18" y2={H - 44} stroke={t.fg} strokeWidth="1.4" />
              <text x={X(i)} y="14" fontSize="11" fill={t.fg} textAnchor="middle" fontFamily="IBM Plex Mono" fontWeight="700">{MY[i]}</text>
            </g>
          ))}
          <line x1="58" x2={W - 130} y1={H - 44} y2={H - 44} stroke={t.fg} />
          {MY.map((y, i) => (
            <text key={y} x={X(i)} y={H - 26} fontSize="10.5" fill={i === year ? t.down : t.sub} textAnchor="middle" fontFamily="IBM Plex Mono">{y}</text>
          ))}
        </svg>

        <aside style={{ borderLeft: `1px solid ${t.rule}` }} className="pl-5">
          <Caps style={{ color: t.down }}>{MY[hover ?? year]} share</Caps>
          <div className="mt-1 space-y-2">
            {[...SHARE].sort((a, b) => b.v[hover ?? year] - a.v[hover ?? year]).map((s) => {
              const v = s.v[hover ?? year];
              const prev = s.v[Math.max(0, (hover ?? year) - 1)];
              return (
                <div key={s.t}>
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="flex items-center gap-1.5 text-[13px]">
                      <span className="h-[9px] w-[9px]" style={{ background: s.c }} />
                      {s.t === "HLG" ? <strong>Halcyon</strong> : s.n}
                    </span>
                    <span className="tnum font-mono text-[12.5px]">{v.toFixed(1)}%</span>
                  </div>
                  <div className="mt-0.5 flex items-center gap-2">
                    <div className="h-[6px] flex-1" style={{ background: "rgba(22,18,14,0.08)" }}>
                      <div className="h-full" style={{ width: `${(v / 28) * 100}%`, background: s.c }} />
                    </div>
                    <span className="tnum font-mono text-[10px]" style={{ color: v - prev >= 0 ? t.up : t.down }}>
                      {v - prev >= 0 ? "+" : ""}{(v - prev).toFixed(1)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-4 border-t pt-3" style={{ borderColor: t.rule }}>
            <Caps style={{ color: t.sub }}>Served market</Caps>
            <div className="tnum font-sans text-[30px] font-extrabold leading-none">${totalRev[hover ?? year].toFixed(1)}bn</div>
            <div className="font-mono text-[11px]" style={{ color: t.sub }}>
              Halcyon revenue implies {(SHARE[1].v[hover ?? year] * 0).toFixed(0)}<span />
              ${(33.1 * (SHARE[1].v[7] / 100)).toFixed(1)}bn at 2025 share
            </div>
          </div>
        </aside>
      </div>
      <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 border-t pt-2" style={{ borderColor: t.rule }}>
        {SHARE.map((s) => (
          <span key={s.t} className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.12em]" style={{ color: t.sub }}>
            <span className="inline-block h-[9px] w-[9px]" style={{ background: s.c }} /> {s.t}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════ 57.b — RANK BUMP CHART ═══════════════════════ */
function P57B() {
  const t = TONES.ledger;
  const [sel, setSel] = useState<string>("HLG");
  const W = 900, H = 400;
  const ranks: Record<string, number[]> = {};
  MY.forEach((_, i) => {
    const sorted = [...SHARE].sort((a, b) => b.v[i] - a.v[i]);
    sorted.forEach((s, r) => {
      ranks[s.t] = ranks[s.t] ?? [];
      ranks[s.t][i] = r + 1;
    });
  });
  const X = (i: number) => lin(i, 0, MY.length - 1, 132, W - 92);
  const Y = (r: number) => lin(r, 1, SHARE.length, 40, H - 46);

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-end justify-between gap-4 border-b pb-3" style={{ borderColor: t.fg }}>
        <div>
          <Caps style={{ color: t.sub }}>Rank by market share · line crossing = position exchanged</Caps>
          <div className="mt-0.5 font-display text-[21px] italic">Positions are easier to feel than percentages: Halcyon has climbed from sixth to second.</div>
        </div>
        <div className="flex gap-4">
          {[["Biggest rise", "Halcyon +4 places"], ["Biggest fall", "Novanta −1, Cinder −2"], ["Unchanged", "Brightline at 3"]].map(([k, v]) => (
            <div key={k}>
              <Caps style={{ color: t.sub }}>{k}</Caps>
              <div className="font-display text-[16px]">{v}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_240px]">
        <svg viewBox={`0 0 ${W} ${H}`} width="100%" className="block">
          {SHARE.map((_, r) => (
            <g key={r}>
              <line x1="120" x2={W - 84} y1={Y(r + 1)} y2={Y(r + 1)} stroke={t.rule} strokeDasharray="2 6" />
              <text x="112" y={Y(r + 1) + 4} fontSize="10" fill={t.sub} textAnchor="end" fontFamily="IBM Plex Mono">#{r + 1}</text>
            </g>
          ))}
          {SHARE.map((s) => {
            const on = sel === s.t;
            const pts = ranks[s.t].map((r, i) => [X(i), Y(r)] as [number, number]);
            return (
              <g key={s.t} onMouseEnter={() => setSel(s.t)} style={{ cursor: "pointer" }}>
                <path d={smooth(pts)} fill="none" stroke={s.c} strokeWidth={on ? 4 : 2} opacity={sel === s.t ? 1 : 0.42} />
                {pts.map((p, i) => (
                  <circle key={i} cx={p[0]} cy={p[1]} r={on ? 5.5 : 3.4} fill={s.c} opacity={sel === s.t ? 1 : 0.5} />
                ))}
                <text x={X(0) - 14} y={pts[0][1] + 4} fontSize="12" fill={on ? "#E8F0EA" : t.sub} textAnchor="end" fontFamily="IBM Plex Mono" fontWeight={on ? 700 : 400}>
                  {s.t}
                </text>
                <text x={X(MY.length - 1) + 12} y={pts[pts.length - 1][1] + 4} fontSize="12" fill={on ? "#E8F0EA" : t.sub} fontFamily="IBM Plex Mono" fontWeight={on ? 700 : 400}>
                  {s.t} {s.v[7].toFixed(1)}
                </text>
              </g>
            );
          })}
          {MY.map((y, i) => (
            <text key={y} x={X(i)} y={H - 22} fontSize="10.5" fill={t.sub} textAnchor="middle" fontFamily="IBM Plex Mono">{y}</text>
          ))}
        </svg>

        <aside style={{ borderLeft: `1px solid ${t.rule}` }} className="pl-5">
          <Caps style={{ color: t.up }}>{SHARE.find((s) => s.t === sel)!.n}</Caps>
          <div className="mt-1 font-sans text-[30px] font-extrabold leading-none tracking-tight">
            #{ranks[sel][0]} → #{ranks[sel][7]}
          </div>
          <div className="mt-3 space-y-2">
            {[["Share 2018", `${SHARE.find((s) => s.t === sel)!.v[0].toFixed(1)}%`], ["Share 2025", `${SHARE.find((s) => s.t === sel)!.v[7].toFixed(1)}%`], ["Change", `${(SHARE.find((s) => s.t === sel)!.v[7] - SHARE.find((s) => s.t === sel)!.v[0]).toFixed(1)} pts`], ["CAGR of share", `${(((SHARE.find((s) => s.t === sel)!.v[7] / SHARE.find((s) => s.t === sel)!.v[0]) ** (1 / 7) - 1) * 100).toFixed(1)}%`]].map(([k, v]) => (
              <div key={k} className="flex justify-between border-b pb-1.5" style={{ borderColor: t.rule }}>
                <span className="font-mono text-[10px] uppercase tracking-[0.14em]" style={{ color: t.sub }}>{k}</span>
                <span className="tnum font-mono text-[13px]">{v}</span>
              </div>
            ))}
          </div>
          <p className="mt-4 font-display text-[15px] italic leading-relaxed" style={{ color: t.sub }}>
            {sel === "HLG"
              ? "Sixth to second in seven years, and the crossings with Kestrel in 2021 and Brightline in 2023 were both won in the storage layer."
              : sel === "NVPT"
                ? "Still the largest, but the line has not risen since 2018 and the gap to second has closed from 14.7 points to 4.4."
                : `Select any line to read its seven-year path in ${sel}.`}
          </p>
        </aside>
      </div>
    </div>
  );
}

/* ═══════════════════════ 57.c — WAFFLE COMPOSITION ═══════════════════════ */
function P57C() {
  const t = TONES.sand;
  const [year, setYear] = useState(7);
  const [sel, setSel] = useState<string>("HLG");
  const cur = SHARE.map((s) => ({ ...s, v: s.v[year] }));
  const cells = useMemo(() => {
    const out: string[] = [];
    let carry = 0;
    cur.forEach((s) => {
      const exact = (s.v / 100) * 100 + carry;
      const n = Math.round(exact);
      carry = exact - n;
      for (let i = 0; i < n; i++) out.push(s.t);
    });
    while (out.length < 100) out.push("Other");
    return out.slice(0, 100);
  }, [cur]);
  const cell = 34, gap = 5;

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-end justify-between gap-4 border-b-2 pb-3" style={{ borderColor: t.fg }}>
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.28em]" style={{ color: t.sub }}>One hundred squares · one hundred per cent of the market</div>
          <h3 className="mt-1 font-display text-[clamp(26px,3.4vw,40px)] leading-none tracking-tight">
            {MY[year]}: every square is one point of market share
          </h3>
        </div>
        <div className="flex items-center gap-5">
          <Caps style={{ color: t.sub }}>Drag the year</Caps>
          <input
            type="range"
            min={0}
            max={7}
            step={1}
            value={year}
            onChange={(e) => setYear(+e.target.value)}
            className="w-[220px]"
            style={{ color: "#8E1F2F" }}
            aria-label="Year"
          />
          <span className="tnum font-sans text-[32px] font-extrabold leading-none" style={{ color: t.down }}>{MY[year]}</span>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div>
          <div className="flex flex-wrap" style={{ gap: gap }}>
            {cells.map((tk, i) => {
              const s = SHARE.find((x) => x.t === tk)!;
              const on = sel === tk;
              return (
                <button
                  key={i}
                  onClick={() => setSel(tk)}
                  onMouseEnter={() => setSel(tk)}
                  className="transition-all duration-200"
                  style={{
                    width: cell, height: cell,
                    background: s.c,
                    opacity: on ? 1 : 0.82,
                    outline: on ? `2.5px solid ${t.fg}` : "none",
                    outlineOffset: "-2.5px",
                    transform: on ? "scale(1.08)" : "none",
                  }}
                  aria-label={`${s.n} share square ${i + 1}`}
                />
              );
            })}
          </div>
          <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1">
            {SHARE.map((s) => (
              <span key={s.t} className="flex items-center gap-1.5 font-mono text-[10.5px] uppercase tracking-[0.1em]" style={{ color: sel === s.t ? t.fg : t.sub }}>
                <span className="inline-block h-[10px] w-[10px]" style={{ background: s.c }} />
                {s.t} {s.v[year].toFixed(1)}
              </span>
            ))}
          </div>
          <p className="mt-4 max-w-[78ch] font-display text-[16px] italic leading-relaxed" style={{ color: "rgba(35,27,18,0.74)" }}>
            Sweep the slider and the composition rearranges square by square: Novanta's block visibly thins from the top left while Halcyon's grows from the second row. Because every square is the same size, a one-point shift is a one-square shift — no area judgement required.
          </p>
        </div>

        <aside style={{ borderLeft: `1px solid ${t.rule}` }} className="pl-6">
          <Caps style={{ color: t.down }}>{SHARE.find((s) => s.t === sel)!.n}</Caps>
          <div className="tnum font-sans text-[56px] font-extrabold leading-none tracking-[-0.045em]">
            {SHARE.find((s) => s.t === sel)!.v[year].toFixed(1)}
          </div>
          <div className="font-mono text-[11px] uppercase tracking-[0.16em]" style={{ color: t.sub }}>points of share · {MY[year]}</div>

          <div className="mt-5">
            <Caps style={{ color: t.sub }}>Every year</Caps>
            <div className="mt-2 flex items-end gap-1.5" style={{ height: 96 }}>
              {SHARE.find((s) => s.t === sel)!.v.map((v, i) => (
                <button
                  key={i}
                  onClick={() => setYear(i)}
                  className="flex-1 transition-all"
                  style={{ height: `${(v / 28) * 96}px`, background: i === year ? t.down : "rgba(35,27,18,0.25)" }}
                  title={`${MY[i]} · ${v}%`}
                />
              ))}
            </div>
            <div className="mt-1 flex justify-between font-mono text-[9.5px]" style={{ color: t.sub }}>
              <span>{MY[0]}</span>
              <span>{SHARE.find((s) => s.t === sel)!.v[0].toFixed(1)} → {SHARE.find((s) => s.t === sel)!.v[7].toFixed(1)}</span>
              <span>{MY[7]}</span>
            </div>
          </div>

          <div className="mt-5 space-y-2 border-t pt-3" style={{ borderColor: t.rule }}>
            {[["Concentration (HHI)", year === 7 ? "1,142" : "1,268"], ["Top three share", `${(SHARE[0].v[year] + SHARE[2].v[year] + SHARE[1].v[year]).toFixed(1)}%`], ["Players above 5%", `${SHARE.filter((s) => s.v[year] > 5).length}`], ["Served market", `$${(21.4 + (year * (33.1 - 21.4)) / 7).toFixed(1)}bn`]].map(([k, v]) => (
              <div key={k} className="flex justify-between">
                <span className="font-mono text-[10px] uppercase tracking-[0.14em]" style={{ color: t.sub }}>{k}</span>
                <span className="tnum font-mono text-[13px]">{v}</span>
              </div>
            ))}
          </div>
        </aside>
      </div>
      <span className="sr-only">{nf(year)}</span>
    </div>
  );
}

export function C57() {
  const nm = "Competitive market share";
  return (
    <>
      <Plate n={57} letter="a" name={nm} variant="Stacked share band with a scrubbable year" tone="paper" caption="Eight years of composition as one continuous band, right-hand labels aligned to each band's centre, and eight year buttons that rule a cursor through the whole chart and repopulate the ranked table.">
        <P57A />
      </Plate>
      <Plate n={57} letter="b" name={nm} variant="Rank bump chart — who overtook whom" tone="ledger" caption="Percentages hide the story; rank reveals it. Lines that cross are positions exchanged, and the left and right gutters carry the ticker at both ends so the direction of travel needs no legend.">
        <P57B />
      </Plate>
      <Plate n={57} letter="c" name={nm} variant="One hundred squares, one per cent of share" tone="sand" caption="A waffle on newsprint with a year slider: dragging it makes the market rearrange one square at a time, which is the only way a one-point shift ever looks like what it actually is. Click any square to pull that player's seven-year bar.">
        <P57C />
      </Plate>
    </>
  );
}
