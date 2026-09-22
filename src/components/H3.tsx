import { useMemo, useState } from "react";
import { Caps, Plate, Slider, TONES, lin, poly, smooth } from "@/ui";
import { CO, PEERS, PX_3Y, weekLabels } from "@/data";

/* ═══════════════════════ 3.a — THE SORTABLE LEDGER ═══════════════════════ */
type Col = { k: string; lab: string; get: (p: (typeof PEERS)[number]) => number; fmt: (v: number) => string; hi?: boolean; lo?: boolean };
const COLS: Col[] = [
  { k: "mcap", lab: "Mkt cap $bn", get: (p) => p.mcap, fmt: (v) => v.toFixed(1) },
  { k: "rev", lab: "Revenue $bn", get: (p) => p.rev, fmt: (v) => v.toFixed(2) },
  { k: "growth", lab: "Rev growth", get: (p) => p.growth, fmt: (v) => `${v.toFixed(1)}%`, hi: true },
  { k: "gm", lab: "Gross margin", get: (p) => p.gm, fmt: (v) => `${v.toFixed(1)}%`, hi: true },
  { k: "om", lab: "Op margin", get: (p) => p.om, fmt: (v) => `${v.toFixed(1)}%`, hi: true },
  { k: "pe", lab: "P/E fwd", get: (p) => p.pe, fmt: (v) => `${v.toFixed(1)}×`, lo: true },
  { k: "ev", lab: "EV/EBITDA", get: (p) => p.ev, fmt: (v) => `${v.toFixed(1)}×`, lo: true },
  { k: "roic", lab: "ROIC", get: (p) => p.roic, fmt: (v) => `${v.toFixed(1)}%`, hi: true },
  { k: "de", lab: "Net debt/EBITDA", get: (p) => p.de, fmt: (v) => `${v.toFixed(2)}×`, lo: true },
  { k: "beta", lab: "Beta 2y", get: (p) => p.beta, fmt: (v) => v.toFixed(2), lo: true },
];

function A() {
  const t = TONES.paper;
  const [sort, setSort] = useState<string>("mcap");
  const [dir, setDir] = useState<-1 | 1>(-1);
  const [hover, setHover] = useState<string | null>(null);
  const col = COLS.find((c) => c.k === sort)!;
  const rows = useMemo(() => [...PEERS].sort((a, b) => (col.get(a) - col.get(b)) * dir), [col, dir]);

  const med = (c: Col) => {
    const s = [...PEERS].map(c.get).sort((a, b) => a - b);
    return (s[3] + s[4]) / 2;
  };

  const click = (k: string) => {
    if (k === sort) setDir((d) => (d === 1 ? -1 : 1));
    else { setSort(k); setDir(-1); }
  };

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <Caps style={{ color: t.sub }}>Peer set · Grid-scale power conversion · sorted by {col.lab}</Caps>
          <div className="mt-1 font-display text-[20px] italic">
            Eight names, ten metrics, one screen — {dir === -1 ? "highest first" : "lowest first"}.
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="font-mono text-[10px]" style={{ color: t.sub }}>
            BEST <span style={{ color: t.down }}>●</span> &nbsp; WORST <span style={{ color: "#8A7F73" }}>○</span>
          </span>
          <button
            className="px-3 py-1 font-mono text-[10px] uppercase tracking-[0.16em]"
            style={{ border: `1px solid ${t.rule}`, color: t.sub }}
            onClick={() => { setSort("mcap"); setDir(-1); }}
          >
            Reset
          </button>
        </div>
      </div>

      <div className="overflow-x-auto scroller">
        <table className="w-full min-w-[980px] border-collapse">
          <thead>
            <tr style={{ borderBottom: `2px solid ${t.fg}` }}>
              <th className="pb-2 pr-4 text-left"><Caps style={{ color: t.sub }}>Company</Caps></th>
              {COLS.map((c) => {
                const vals = PEERS.map(c.get);
                const best = c.hi ? Math.max(...vals) : c.lo ? Math.min(...vals) : null;
                const worst = c.hi ? Math.min(...vals) : c.lo ? Math.max(...vals) : null;
                const on = c.k === sort;
                return (
                  <th
                    key={c.k}
                    onMouseEnter={() => setHover(c.k)}
                    onMouseLeave={() => setHover(null)}
                    onClick={() => click(c.k)}
                    className="cursor-pointer pb-2 pl-4 text-right transition-colors"
                    style={{ background: hover === c.k ? t.soft : "transparent" }}
                  >
                    <div className="flex items-baseline justify-end gap-1">
                      <Caps style={{ color: on ? t.down : t.sub, fontWeight: on ? 600 : 400 }}>
                        {c.lab}
                      </Caps>
                      <span className="font-mono text-[9px]" style={{ color: on ? t.down : "transparent" }}>
                        {dir === -1 ? "▼" : "▲"}
                      </span>
                    </div>
                    <div className="mt-0.5 font-mono text-[9px]" style={{ color: t.sub }}>
                      best {c.fmt(best as number)} · worst {c.fmt(worst as number)}
                    </div>
                    <span className="sr-only">{c.fmt(best as number)}</span>
                    <span className="sr-only">{c.fmt(worst as number)}</span>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {rows.map((p) => {
              const self = p.t === CO.ticker;
              return (
                <tr
                  key={p.t}
                  onMouseEnter={() => setHover(p.t)}
                  onMouseLeave={() => setHover(null)}
                  style={{
                    borderBottom: `1px solid ${t.rule}`,
                    background: self ? "rgba(142,31,47,0.07)" : hover === p.t ? t.soft : "transparent",
                    boxShadow: self ? `inset 3px 0 0 ${t.down}` : "none",
                  }}
                >
                  <td className="py-2.5 pr-4">
                    <div className="flex items-baseline gap-2">
                      <span className="tnum font-mono text-[12.5px] font-semibold" style={{ color: self ? t.down : t.fg }}>
                        {p.t}
                      </span>
                      <span className="truncate text-[13px]" style={{ color: self ? t.fg : "rgba(22,18,14,0.75)" }}>
                        {p.name}
                      </span>
                      <span className="font-mono text-[9px]" style={{ color: t.sub }}>{p.region}</span>
                    </div>
                  </td>
                  {COLS.map((c) => {
                    const v = c.get(p);
                    const vals = PEERS.map(c.get);
                    const best = c.hi ? Math.max(...vals) : c.lo ? Math.min(...vals) : null;
                    const worst = c.hi ? Math.min(...vals) : c.lo ? Math.max(...vals) : null;
                    const isBest = v === best;
                    const isWorst = v === worst;
                    return (
                      <td
                        key={c.k}
                        onMouseEnter={() => setHover(c.k)}
                        onMouseLeave={() => setHover(null)}
                        className="tnum py-2.5 pl-4 text-right font-mono text-[12.5px]"
                        style={{
                          background: hover === c.k ? "rgba(142,31,47,0.05)" : undefined,
                          color: isBest ? t.fg : isWorst ? "#8A7F73" : "rgba(22,18,14,0.8)",
                          fontWeight: isBest ? 600 : 400,
                          textDecoration: c.k === sort ? `underline` : undefined,
                          textUnderlineOffset: 4,
                          textDecorationColor: c.k === sort ? t.down : undefined,
                        }}
                      >
                        {c.fmt(v)}
                        {isBest && <span className="ml-1.5" style={{ color: t.down }}>●</span>}
                        {isWorst && <span className="ml-1.5" style={{ color: "#8A7F73" }}>○</span>}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
            <tr style={{ borderTop: `2px solid ${t.fg}` }}>
              <td className="pt-2 pr-4"><Caps style={{ color: t.sub }}>Median ex-HLG</Caps></td>
              {COLS.map((c) => (
                <td key={c.k} className="tnum pt-2 pl-4 text-right font-mono text-[12.5px]" style={{ color: t.sub }}>
                  {c.fmt(med(c))}
                </td>
              ))}
            </tr>
            <tr>
              <td className="pt-1.5 pr-4"><Caps style={{ color: t.down }}>HLG premium / (discount)</Caps></td>
              {COLS.map((c) => {
                const d = ((c.get(PEERS[0]) - med(c)) / Math.abs(med(c))) * 100;
                return (
                  <td key={c.k} className="tnum pt-1.5 pl-4 text-right font-mono text-[12px]" style={{ color: d >= 0 ? t.up : t.down }}>
                    {d >= 0 ? "+" : ""}{d.toFixed(0)}%
                  </td>
                );
              })}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ═══════════════════════ 3.b — TRANSPOSED MATRIX ═══════════════════════ */
type Group = "valuation" | "growth" | "quality" | "risk";
const GROUPS: Record<Group, { lab: string; rows: [string, (p: (typeof PEERS)[number]) => number, (v: number) => string, "hi" | "lo"][] }> = {
  valuation: { lab: "Valuation", rows: [
    ["Forward P/E", (p) => p.pe, (v) => `${v.toFixed(1)}×`, "lo"],
    ["EV / EBITDA", (p) => p.ev, (v) => `${v.toFixed(1)}×`, "lo"],
    ["EV / Sales", (p) => (p.mcap * 1.09) / p.rev, (v) => `${v.toFixed(1)}×`, "lo"],
    ["Free cash flow yield", (p) => 100 / p.pe, (v) => `${v.toFixed(1)}%`, "hi"],
  ]},
  growth: { lab: "Growth", rows: [
    ["Revenue growth YoY", (p) => p.growth, (v) => `${v.toFixed(1)}%`, "hi"],
    ["3-yr revenue CAGR", (p) => p.growth * 0.78, (v) => `${v.toFixed(1)}%`, "hi"],
    ["EPS growth fwd", (p) => p.growth * 1.12, (v) => `${v.toFixed(1)}%`, "hi"],
    ["Revenue $bn", (p) => p.rev, (v) => v.toFixed(2), "hi"],
  ]},
  quality: { lab: "Quality", rows: [
    ["Gross margin", (p) => p.gm, (v) => `${v.toFixed(1)}%`, "hi"],
    ["Operating margin", (p) => p.om, (v) => `${v.toFixed(1)}%`, "hi"],
    ["ROIC", (p) => p.roic, (v) => `${v.toFixed(1)}%`, "hi"],
    ["Market cap $bn", (p) => p.mcap, (v) => v.toFixed(1), "hi"],
  ]},
  risk: { lab: "Risk", rows: [
    ["Beta (2-yr)", (p) => p.beta, (v) => v.toFixed(2), "lo"],
    ["Net debt / EBITDA", (p) => p.de, (v) => `${v.toFixed(2)}×`, "lo"],
    ["Earnings volatility", (p) => (p.beta * 8.4), (v) => `±${v.toFixed(1)}%`, "lo"],
    ["Short interest % float", (p) => 1.4 + p.de * 2.1, (v) => `${v.toFixed(1)}%`, "lo"],
  ]},
};

function B() {
  const t = TONES.ink;
  const [g, setG] = useState<Group>("valuation");
  const [pin, setPin] = useState<string | null>(null);
  const rows = GROUPS[g].rows;

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="inline-flex" style={{ border: `1px solid ${t.rule}` }}>
          {(Object.keys(GROUPS) as Group[]).map((k, i) => (
            <button
              key={k}
              onClick={() => setG(k)}
              className="px-3.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] transition-colors"
              style={{
                background: g === k ? t.down : "transparent",
                color: g === k ? t.bg : t.sub,
                borderLeft: i ? `1px solid ${t.rule}` : "none",
              }}
            >
              {GROUPS[k].lab}
            </button>
          ))}
        </div>
        <Caps style={{ color: t.sub }}>Shading = percentile within set · click a column to pin</Caps>
      </div>

      <div className="overflow-x-auto scroller">
        <table className="w-full min-w-[900px] border-collapse">
          <thead>
            <tr>
              <th className="pb-2 pr-3 text-left align-bottom"><Caps style={{ color: t.sub }}>Metric</Caps></th>
              {PEERS.map((p) => {
                const self = p.t === CO.ticker;
                return (
                  <th
                    key={p.t}
                    onClick={() => setPin(pin === p.t ? null : p.t)}
                    className="cursor-pointer pb-2 align-bottom transition-colors"
                    style={{
                      background: self ? "rgba(224,107,107,0.14)" : pin === p.t ? "rgba(240,233,225,0.08)" : "transparent",
                      borderBottom: self ? `2px solid ${t.down}` : `1px solid ${t.rule}`,
                    }}
                  >
                    <div className="px-2 pb-1 text-center font-mono text-[12px] font-semibold" style={{ color: self ? t.down : "#F0E9E1" }}>{p.t}</div>
                    <div className="px-2 pb-1 text-center font-mono text-[8.5px] uppercase tracking-[0.1em]" style={{ color: t.sub }}>
                      {p.region}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {rows.map(([lab, get, fmt, dirn]) => {
              const vals = PEERS.map(get);
              const sorted = [...vals].sort((a, b) => (dirn === "hi" ? b - a : a - b));
              return (
                <tr key={lab} style={{ borderBottom: `1px solid ${t.rule}` }}>
                  <td className="py-0 pr-3 text-[12.5px]" style={{ color: "rgba(240,233,225,0.78)" }}>{lab}</td>
                  {PEERS.map((p, i) => {
                    const v = vals[i];
                    const rank = sorted.indexOf(v);
                    const pctile = 1 - rank / (vals.length - 1);
                    const self = p.t === CO.ticker;
                    const bar = (Math.abs(v) / Math.max(...vals.map(Math.abs))) * 100;
                    return (
                      <td
                        key={p.t}
                        className="relative px-0 py-0"
                        style={{
                          background: self ? "rgba(224,107,107,0.12)" : pin === p.t ? "rgba(240,233,225,0.06)" : "transparent",
                          borderBottom: "none",
                        }}
                      >
                        <div className="relative h-[42px] w-full overflow-hidden">
                          <div
                            className="absolute bottom-0 left-0 w-full transition-all duration-500"
                            style={{ height: `${bar}%`, background: t.down, opacity: 0.14 + pctile * 0.3 }}
                          />
                          <div className="relative flex h-full flex-col items-center justify-center gap-1">
                            <span className="tnum font-mono text-[13px]" style={{ color: self ? t.down : "#F0E9E1", fontWeight: self ? 600 : 400 }}>
                              {fmt(v)}
                            </span>
                            <span
                              className="inline-block h-[3px] rounded-full"
                              style={{ width: `${12 + pctile * 26}px`, background: rank === 0 ? t.up : "rgba(240,233,225,0.35)" }}
                            />
                          </div>
                        </div>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
            <tr>
              <td className="pt-3 pr-3"><Caps style={{ color: t.down }}>Rank on {GROUPS[g].lab}</Caps></td>
              {PEERS.map((p) => {
                const scores = PEERS.map((_q, qi) =>
                  rows.reduce((s, [, get, , dirn]) => {
                    const vs = PEERS.map(get);
                    const r = [...vs].sort((a, b) => (dirn === "hi" ? b - a : a - b)).indexOf(vs[qi]);
                    return s + r;
                  }, 0),
                );
                const rank = [...scores].sort((a, b) => a - b).indexOf(scores[PEERS.indexOf(p)]) + 1;
                const self = p.t === CO.ticker;
                return (
                  <td key={p.t} className="pt-3 text-center" style={{ background: self ? "rgba(224,107,107,0.12)" : "transparent" }}>
                    <span className="tnum font-sans text-[19px] font-extrabold" style={{ color: self ? t.down : rank <= 3 ? t.up : "rgba(240,233,225,0.5)" }}>
                      {rank}
                    </span>
                  </td>
                );
              })}
            </tr>
          </tbody>
        </table>
      </div>
      <p className="mt-3 font-display text-[13.5px] italic" style={{ color: t.sub }}>
        {g === "valuation"
          ? "Halcyon is the second most expensive name on forward earnings — the premium is the price of 19% growth and a cleaner balance sheet than the cheap names at the right of the table."
          : g === "growth"
            ? "Only Orbis grows faster, and Orbis does it at a 9% operating margin. On growth-adjusted terms Halcyon is the cheapest compounder in the set."
            : g === "quality"
              ? "Best-in-set gross margin and ROIC; Cinder and Kestrel trade at half the multiple for half the return on capital."
              : "Beta and leverage both sit mid-pack: the risk here is idiosyncratic (customer concentration, tariffs), not financial."}
      </p>
    </div>
  );
}

/* ═══════════════════════ 3.c — WEIGHTED SCORECARD ═══════════════════════ */
const CRIT: [string, (p: (typeof PEERS)[number]) => number, "hi" | "lo"][] = [
  ["Growth", (p) => p.growth, "hi"],
  ["Profitability", (p) => p.om, "hi"],
  ["Returns", (p) => p.roic, "hi"],
  ["Valuation", (p) => p.pe, "lo"],
  ["Balance sheet", (p) => p.de, "lo"],
  ["Momentum", (p) => p.beta * 6 + p.growth * 0.4, "hi"],
];

function C() {
  const t = TONES.sand;
  const [w, setW] = useState<number[]>([3, 2, 2, 2, 1, 1]);
  const [sel, setSel] = useState<string>(CO.ticker);

  const scored = useMemo(() => {
    const norm = CRIT.map(([, get, dirn]) => {
      const vs = PEERS.map(get);
      const lo = Math.min(...vs), hi = Math.max(...vs);
      return vs.map((v) => (dirn === "hi" ? (v - lo) / (hi - lo || 1) : (hi - v) / (hi - lo || 1)));
    });
    const tot = w.reduce((a, b) => a + b, 0) || 1;
    return PEERS.map((p, i) => ({
      p,
      parts: norm.map((arr) => arr[i]),
      score: (norm.reduce((s, arr, j) => s + arr[i] * w[j], 0) / tot) * 100,
    })).sort((a, b) => b.score - a.score);
  }, [w]);

  return (
    <div className="grid gap-8 lg:grid-cols-[264px_minmax(0,1fr)]">
      <div className="pr-7" style={{ borderRight: `1px solid ${t.rule}` }}>
        <Caps style={{ color: t.down }}>How much do you care?</Caps>
        <p className="mt-1 mb-4 font-display text-[14px] italic leading-snug" style={{ color: "rgba(35,27,18,0.7)" }}>
          Weight the six criteria and the league table re-ranks live.
        </p>
        <div className="space-y-4">
          {CRIT.map(([lab], i) => (
            <Slider
              key={lab}
              label={lab}
              value={w[i]}
              min={0}
              max={5}
              step={1}
              t={t}
              onChange={(v) => setW((prev) => prev.map((x, j) => (j === i ? v : x)))}
              fmt={(v) => (v === 0 ? "ignore" : `${v}×`)}
            />
          ))}
        </div>
        <button
          onClick={() => setW([3, 2, 2, 2, 1, 1])}
          className="mt-5 w-full py-1.5 font-mono text-[10px] uppercase tracking-[0.16em]"
          style={{ border: `1px solid ${t.fg}`, color: t.fg }}
        >
          House weighting
        </button>
        <div className="mt-5 border-t pt-3" style={{ borderColor: t.rule }}>
          <Caps style={{ color: t.sub }}>Unweighted score</Caps>
          {scored.slice(0, 3).map((s, i) => (
            <div key={s.p.t} className="mt-1 flex items-baseline justify-between">
              <span className="font-mono text-[12px]">{i + 1}. {s.p.t}</span>
              <span className="tnum font-mono text-[12px]" style={{ color: t.sub }}>
                {(s.parts.reduce((a, b) => a + b, 0) / 6 * 100).toFixed(0)}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="min-w-0">
        <div className="grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-2">
          {scored.map((s) => {
            const on = sel === s.p.t;
            const self = s.p.t === CO.ticker;
            return (
              <button
                key={s.p.t}
                onClick={() => setSel(s.p.t)}
                className="grid items-center gap-3 px-2 py-2 text-left transition-colors"
                style={{
                  gridTemplateColumns: "26px minmax(0,1fr) 44px",
                  background: on ? "rgba(35,27,18,0.09)" : self ? "rgba(142,31,47,0.07)" : "transparent",
                  borderBottom: `1px solid ${t.rule}`,
                }}
              >
                <span className="tnum font-sans text-[20px] font-extrabold leading-none" style={{ color: self ? t.down : "rgba(35,27,18,0.35)" }}>
                  {s.score.toFixed(0)}
                </span>
                <span className="min-w-0">
                  <span className="flex items-baseline gap-2">
                    <span className="font-mono text-[12.5px] font-semibold">{s.p.t}</span>
                    <span className="truncate text-[13px]" style={{ color: "rgba(35,27,18,0.78)" }}>{s.p.name}</span>
                  </span>
                  <span className="mt-1 flex h-[7px] w-full overflow-hidden">
                    {s.parts.map((v, j) => (
                      <span key={j} style={{ width: `${(v * w[j]) / (Math.max(...w) * 6 || 1) * 100}%`, background: ["#8E1F2F", "#1B3A5C", "#D98324", "#2E5E4A", "#8A7F73", "#5C1420"][j] }} />
                    ))}
                  </span>
                </span>
                <span className="text-right font-mono text-[10px]" style={{ color: t.sub }}>{s.p.region}</span>
              </button>
            );
          })}
        </div>

        <div className="mt-6 border-t pt-4" style={{ borderColor: t.fg }}>
          <div className="flex items-baseline justify-between">
            <div>
              <Caps style={{ color: t.sub }}>Selected —</Caps>
              <span className="ml-2 font-display text-[19px] italic">{scored.find((s) => s.p.t === sel)!.p.name}</span>
            </div>
            <span className="tnum font-sans text-[30px] font-extrabold" style={{ color: t.down }}>
              {scored.find((s) => s.p.t === sel)!.score.toFixed(1)}
            </span>
          </div>
          <div className="mt-3 grid grid-cols-6 gap-2">
            {CRIT.map(([lab], j) => {
              const item = scored.find((s) => s.p.t === sel)!;
              return (
                <div key={lab}>
                  <div className="h-[46px] w-full" style={{ background: "rgba(35,27,18,0.07)" }}>
                    <div className="w-full" style={{ height: `${item.parts[j] * 100}%`, marginTop: `${(1 - item.parts[j]) * 100}%`, background: "#8E1F2F", opacity: w[j] === 0 ? 0.2 : 0.85 }} />
                  </div>
                  <div className="mt-1 font-mono text-[8.5px] uppercase tracking-[0.1em]" style={{ color: t.sub }}>{lab}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export function C3() {
  const nm = "Peer comparison table";
  return (
    <>
      <Plate n={3} letter="a" name={nm} variant="Sortable ledger with best-in-set marks and a premium row" tone="paper" caption="Everything at once, no tabs: click a column head to re-sort, hover to cross-highlight row against column, and the footer computes Halcyon's premium to the ex-HLG median on every metric automatically.">
        <A />
      </Plate>
      <Plate n={3} letter="b" name={nm} variant="Transposed matrix — metrics as rows, percentile shading as bars" tone="ink" caption="Flipping the axes lets one highlighted column carry the subject company. Metric families become tabs, each cell shows value plus a percentile stub, and an overall rank rolls up at the foot of the matrix.">
        <B />
      </Plate>
      <Plate n={3} letter="c" name={nm} variant="Weighted scorecard — the reader sets the criteria" tone="sand" caption="A comparison table as an opinion: six weight sliders re-rank the peer set live, each row draws a stacked bar of where its score comes from, and selecting a name breaks its composite into six normalised components.">
        <C />
      </Plate>
    </>
  );
}

/* ═══════════════════════ shared chart maths for plate 4 ═══════════════════════ */
const W = 940;
function ma(vals: number[], n: number) {
  return vals.map((_, i) => {
    const s = Math.max(0, i - n + 1);
    const sl = vals.slice(s, i + 1);
    return sl.reduce((a, b) => a + b, 0) / sl.length;
  });
}
function std(vals: number[], n: number) {
  return vals.map((_, i) => {
    const sl = vals.slice(Math.max(0, i - n + 1), i + 1);
    const m = sl.reduce((a, b) => a + b, 0) / sl.length;
    return Math.sqrt(sl.reduce((a, b) => a + (b - m) ** 2, 0) / sl.length);
  });
}
function rsi(vals: number[], n = 14) {
  const out: number[] = [];
  for (let i = 0; i < vals.length; i++) {
    if (i < n) { out.push(50); continue; }
    let up = 0, dn = 0;
    for (let j = i - n + 1; j <= i; j++) {
      const d = vals[j] - vals[j - 1];
      if (d > 0) up += d; else dn -= d;
    }
    const rs = dn === 0 ? 100 : up / dn;
    out.push(100 - 100 / (1 + rs));
  }
  return out;
}
function macd(vals: number[]) {
  const e12 = ema(vals, 12), e26 = ema(vals, 26);
  const line = e12.map((v, i) => v - e26[i]);
  const sig = ema(line, 9);
  return { line, sig, hist: line.map((v, i) => v - sig[i]) };
}
function ema(vals: number[], n: number) {
  const k = 2 / (n + 1);
  let prev = vals[0];
  return vals.map((v, i) => (i === 0 ? (prev = v) : (prev = v * k + prev * (1 - k))));
}

const EVENTS = [
  { i: 40, lab: "Q4'23 beat", kind: "e" },
  { i: 62, lab: "Ohio plant online", kind: "m" },
  { i: 86, lab: "Tariff review", kind: "n" },
  { i: 111, lab: "Spin-off", kind: "m" },
  { i: 134, lab: "Q4'25 beat", kind: "e" },
  { i: 150, lab: "H-Series launch", kind: "m" },
];
const LAB = weekLabels(156);

/* ═══════════════════════ 4.a — FULL TERMINAL CHART ═══════════════════════ */
function P4A() {
  const t = TONES.ink;
  const [range, setRange] = useState<"1Y" | "2Y" | "3Y">("3Y");
  const [ov, setOv] = useState<string[]>(["MA50", "MA200"]);
  const [sub, setSub] = useState<"vol" | "rsi" | "macd" | "none">("vol");
  const [x, setX] = useState<number | null>(null);

  const n = range === "1Y" ? 52 : range === "2Y" ? 104 : 156;
  const px = PX_3Y.slice(-n);
  const labels = LAB.slice(-n);
  const m50 = ma(px, 10), m200 = ma(px, 40), sd20 = std(px, 20);
  const R = rsi(px), M = macd(px);

  const H = 300, SH = 76;
  const top = 14, priceH = H;
  const lo = Math.min(...px) * 0.97, hi = Math.max(...px) * 1.03;
  const X = (i: number) => lin(i, 0, px.length - 1, 0, W);
  const Y = (v: number) => lin(v, lo, hi, priceH - 26, top);
  const idx = x === null ? null : Math.max(0, Math.min(px.length - 1, Math.round((x / W) * (px.length - 1))));
  const cur = idx === null ? null : { p: px[idx], l: labels[idx], m: m50[idx] };

  const toggle = (k: string) => setOv((o) => (o.includes(k) ? o.filter((z) => z !== k) : [...o, k]));

  const osc =
    sub === "rsi"
      ? { series: [{ v: R, c: t.down }], lines: [[30, "oversold"], [70, "overbought"]] as [number, string][], min: 0, max: 100 }
      : sub === "macd"
        ? { series: [{ v: M.line, c: t.down }, { v: M.sig, c: t.up }], lines: [] as [number, string][], min: Math.min(...M.hist) * 1.4, max: Math.max(...M.hist) * 1.4 }
        : null;

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-baseline gap-3">
          <span className="font-sans text-[26px] font-extrabold tracking-tight">{CO.ticker}</span>
          <span className="tnum font-mono text-[22px]">${CO.price.toFixed(2)}</span>
          <span className="tnum font-mono text-[13px]" style={{ color: t.up }}>▲ {CO.chg.toFixed(2)} ({CO.chgPct.toFixed(2)}%)</span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {["MA20", "MA50", "MA200", "BOLL", "EVENTS"].map((k) => (
            <button
              key={k}
              onClick={() => toggle(k)}
              className="px-2.5 py-1 font-mono text-[9.5px] uppercase tracking-[0.14em] transition-colors"
              style={{
                border: `1px solid ${ov.includes(k) ? t.down : t.rule}`,
                color: ov.includes(k) ? t.bg : t.sub,
                background: ov.includes(k) ? t.down : "transparent",
              }}
            >
              {k}
            </button>
          ))}
          <div className="ml-1 inline-flex" style={{ border: `1px solid ${t.rule}` }}>
            {(["1Y", "2Y", "3Y"] as const).map((r, i) => (
              <button
                key={r}
                onClick={() => setRange(r)}
                className="px-3 py-1 font-mono text-[9.5px] tracking-[0.1em]"
                style={{ background: range === r ? "rgba(240,233,225,0.9)" : "transparent", color: range === r ? t.bg : t.sub, borderLeft: i ? `1px solid ${t.rule}` : "none" }}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between border-y py-1.5" style={{ borderColor: t.rule }}>
        <div className="font-mono text-[11px]" style={{ color: t.sub }}>
          {cur ? (
            <>
              <span style={{ color: t.fg }}>{cur.l}</span> &nbsp; O {cur.p.toFixed(2)} H {(cur.p * 1.012).toFixed(2)} L {(cur.p * 0.988).toFixed(2)} C{" "}
              <span style={{ color: t.up }}>{cur.p.toFixed(2)}</span> &nbsp;·&nbsp; MA50 {cur.m.toFixed(2)} &nbsp;·&nbsp; vol {(3 + (idx! % 7) * 0.6).toFixed(2)}m
            </>
          ) : (
            "Hover the plot for an OHLC readout"
          )}
        </div>
        <div className="flex gap-2">
          {(["vol", "rsi", "macd", "none"] as const).map((s) => (
            <button key={s} onClick={() => setSub(s)} className="font-mono text-[9.5px] uppercase tracking-[0.14em]" style={{ color: sub === s ? t.down : t.sub }}>
              {s}
            </button>
          ))}
        </div>
      </div>

      <svg
        viewBox={`0 0 ${W} ${H + (sub !== "none" ? SH + 12 : 0)}`}
        width="100%"
        className="block cursor-crosshair select-none"
        onMouseMove={(e) => {
          const r = (e.currentTarget as SVGSVGElement).getBoundingClientRect();
          setX(((e.clientX - r.left) / r.width) * W);
        }}
        onMouseLeave={() => setX(null)}
      >
        {[0, 0.25, 0.5, 0.75, 1].map((f) => (
          <g key={f}>
            <line x1="0" x2={W} y1={top + f * (priceH - 26 - top)} y2={top + f * (priceH - 26 - top)} stroke={t.rule} strokeDasharray="2 4" />
            <text x={W - 2} y={top + f * (priceH - 26 - top) - 4} fontSize="9.5" fill={t.sub} textAnchor="end" fontFamily="IBM Plex Mono">
              {(hi - f * (hi - lo)).toFixed(0)}
            </text>
          </g>
        ))}

        {/* volume */}
        {sub === "vol" && (
          <g transform={`translate(0,${H + 4})`}>
            {px.map((_p, i) => {
              const h = ((3 + (i % 7) * 0.6) / 8) * SH;
              return <rect key={i} x={X(i) - (W / px.length) * 0.36} y={SH - h} width={(W / px.length) * 0.72} height={h} fill={i > 0 && px[i] >= px[i - 1] ? t.up : t.down} opacity="0.45" />;
            })}
            <text x="0" y="10" fontSize="9" fill={t.sub} fontFamily="IBM Plex Mono">VOLUME</text>
          </g>
        )}

        {/* price */}
        <path d={smooth(px.map((v, i) => [X(i), Y(v)] as [number, number]))} fill="none" stroke="#F0E9E1" strokeWidth="2.2" className="drawIn" />
        {ov.includes("BOLL") && (
          <>
            <path d={smooth(px.map((v, i) => [X(i), Y(v + sd20[i] * 2)] as [number, number]))} fill="none" stroke={t.sub} strokeWidth="1" strokeDasharray="3 3" />
            <path d={smooth(px.map((v, i) => [X(i), Y(v - sd20[i] * 2)] as [number, number]))} fill="none" stroke={t.sub} strokeWidth="1" strokeDasharray="3 3" />
          </>
        )}
        {ov.includes("MA20") && <path d={smooth(m50.map((v, i) => [X(i), Y(v * 0.995)] as [number, number]))} fill="none" stroke="#D98324" strokeWidth="1.2" />}
        {ov.includes("MA50") && <path d={smooth(m50.map((v, i) => [X(i), Y(v)] as [number, number]))} fill="none" stroke="#63C2A6" strokeWidth="1.6" />}
        {ov.includes("MA200") && <path d={smooth(m200.map((v, i) => [X(i), Y(v)] as [number, number]))} fill="none" stroke="#B8404E" strokeWidth="1.6" strokeDasharray="6 3" />}

        {/* events */}
        {ov.includes("EVENTS") &&
          EVENTS.filter((e) => e.i >= 156 - n).map((e) => {
            const i = e.i - (156 - n);
            return (
              <g key={e.lab}>
                <line x1={X(i)} x2={X(i)} y1={top} y2={priceH - 26} stroke={e.kind === "e" ? "#D98324" : e.kind === "m" ? "#63C2A6" : "#E06B6B"} strokeWidth="1" strokeDasharray="3 3" opacity="0.75" />
                <circle cx={X(i)} cy={Y(px[i])} r="4" fill={e.kind === "e" ? "#D98324" : e.kind === "m" ? "#63C2A6" : "#E06B6B"} stroke="#0E1014" strokeWidth="1.5" />
                <text x={X(i) + 5} y={top + 12} fontSize="9" fill={t.sub} fontFamily="IBM Plex Mono">{e.lab}</text>
              </g>
            );
          })}

        {/* oscillator */}
        {osc && (
          <g transform={`translate(0,${H + (sub === "vol" ? SH + 12 : 4)})`}>
            <line x1="0" x2={W} y1="0" y2="0" stroke={t.rule} />
            {osc.lines.map(([lv, lab]) => (
              <g key={lab}>
                <line x1="0" x2={W} y1={lin(lv, osc.min, osc.max, SH, 0)} y2={lin(lv, osc.min, osc.max, SH, 0)} stroke={t.rule} strokeDasharray="4 4" />
                <text x={W - 2} y={lin(lv, osc.min, osc.max, SH, 0) - 3} fontSize="8.5" fill={t.sub} textAnchor="end" fontFamily="IBM Plex Mono">{lab} {lv}</text>
              </g>
            ))}
            {sub === "macd" &&
              M.hist.map((h, i) => (
                <rect key={i} x={X(i) - 2} y={lin(0, osc.min, osc.max, SH, 0)} width="4" height={Math.abs(lin(h, osc.min, osc.max, SH, 0) - lin(0, osc.min, osc.max, SH, 0))} fill={h > 0 ? t.up : t.down} opacity="0.6" />
              ))}
            {osc.series.map((s, k) => (
              <path key={k} d={poly(s.v.map((v, i) => [X(i), lin(v, osc.min, osc.max, SH, 0)] as [number, number]))} fill="none" stroke={s.c} strokeWidth="1.4" />
            ))}
            <text x="0" y="10" fontSize="9" fill={t.sub} fontFamily="IBM Plex Mono">{sub.toUpperCase()}</text>
          </g>
        )}

        {/* crosshair */}
        {idx !== null && (
          <g pointerEvents="none">
            <line x1={X(idx)} x2={X(idx)} y1={top} y2={H + (sub !== "none" ? SH + 12 : 0)} stroke="#F0E9E1" strokeWidth="0.8" opacity="0.55" />
            <line x1="0" x2={W} y1={Y(px[idx])} y2={Y(px[idx])} stroke="#F0E9E1" strokeWidth="0.8" opacity="0.35" strokeDasharray="4 4" />
            <circle cx={X(idx)} cy={Y(px[idx])} r="4.5" fill="#F0E9E1" />
            <rect x={Math.min(X(idx) + 8, W - 74)} y={Y(px[idx]) - 22} width="72" height="18" fill="#F0E9E1" />
            <text x={Math.min(X(idx) + 14, W - 68)} y={Y(px[idx]) - 9} fontSize="11" fill="#0E1014" fontFamily="IBM Plex Mono" fontWeight="600">
              ${px[idx].toFixed(2)}
            </text>
          </g>
        )}

        <line x1="0" x2={W} y1={priceH - 26} y2={priceH - 26} stroke={t.rule} />
        {labels.map((l, i) =>
          i % Math.ceil(labels.length / 8) === 0 ? (
            <text key={i} x={X(i)} y={priceH - 10} fontSize="9.5" fill={t.sub} textAnchor="middle" fontFamily="IBM Plex Mono">{l}</text>
          ) : null,
        )}
      </svg>

      <div className="mt-2 flex flex-wrap gap-4 border-t pt-2 font-mono text-[10px]" style={{ borderColor: t.rule, color: t.sub }}>
        <span><span style={{ color: "#63C2A6" }}>—</span> MA50 {ma(px, 10).at(-1)!.toFixed(2)}</span>
        <span><span style={{ color: "#B8404E" }}>--</span> MA200 {ma(px, 40).at(-1)!.toFixed(2)}</span>
        <span><span style={{ color: "#D98324" }}>—</span> MA20</span>
        <span className="ml-auto">52w range {CO.lo52} – {CO.hi52} · shares outstanding 365.0m</span>
      </div>
    </div>
  );
}

/* ═══════════════════════ 4.b — EDITORIAL / ANNOTATED ═══════════════════════ */
function P4B() {
  const t = TONES.paper;
  const [ov, setOv] = useState<string[]>(["50-day", "Drawdown"]);
  const [hover, setHover] = useState<number | null>(null);
  const px = PX_3Y.slice(-104);
  const labels = LAB.slice(-104);
  const H = 292;
  const lo = Math.min(...px) * 0.96, hi = Math.max(...px) * 1.04;
  const X = (i: number) => lin(i, 0, px.length - 1, 6, W - 60);
  const Y = (v: number) => lin(v, lo, hi, H - 34, 22);
  const m50 = ma(px, 10);

  const notes = [
    { i: 18, up: true, txt: "Ohio plant comes online — capacity +34%" },
    { i: 52, up: false, txt: "Tariff review takes 400bp off the estimate" },
    { i: 84, up: true, txt: "H-Series launch: $840m initial backlog" },
  ];
  const draw = ov.includes("Drawdown");

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-end justify-between gap-4 border-b pb-3" style={{ borderColor: t.fg }}>
        <div>
          <div className="font-display text-[34px] leading-none tracking-tight">Halcyon Grid Technologies</div>
          <div className="mt-1 font-mono text-[11px] tracking-[0.14em]" style={{ color: t.sub }}>
            NASDAQ · HLG · TWO-YEAR CLOSING PRICE, US$
          </div>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {["50-day", "200-day", "Drawdown", "Volume", "Annotations"].map((k) => (
            <button
              key={k}
              onClick={() => setOv((o) => (o.includes(k) ? o.filter((z) => z !== k) : [...o, k]))}
              className="px-2.5 py-[3px] font-mono text-[10px] transition-all"
              style={{
                border: `1px solid ${ov.includes(k) ? t.down : t.rule}`,
                background: ov.includes(k) ? t.down : "transparent",
                color: ov.includes(k) ? t.bg : t.sub,
              }}
            >
              {k}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_186px]">
        <svg viewBox={`0 0 ${W} ${H}`} width="100%" className="block" onMouseLeave={() => setHover(null)}>
          <defs>
            <linearGradient id="fillB" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#8E1F2F" stopOpacity="0.24" />
              <stop offset="100%" stopColor="#8E1F2F" stopOpacity="0.02" />
            </linearGradient>
          </defs>
          {[0, 1, 2, 3, 4].map((f) => (
            <g key={f}>
              <line x1="6" x2={W - 60} y1={Y(lo + (f / 4) * (hi - lo))} y2={Y(lo + (f / 4) * (hi - lo))} stroke={t.rule} />
              <text x={W - 54} y={Y(lo + (f / 4) * (hi - lo)) + 4} fontSize="11" fill={t.sub} fontFamily="Newsreader">{(lo + (f / 4) * (hi - lo)).toFixed(0)}</text>
            </g>
          ))}
          {draw &&
            px.map((v, i) => {
              const peak = Math.max(...px.slice(0, i + 1));
              const dd = ((v - peak) / peak) * 100;
              return dd < -3 ? <rect key={i} x={X(i)} y={Y(peak)} width={W / px.length} height={Math.max(2, Y(v) - Y(peak))} fill="#1B3A5C" opacity="0.14" /> : null;
            })}
          <path d={`${smooth(px.map((v, i) => [X(i), Y(v)] as [number, number]))} L${X(px.length - 1)},${H - 34} L${X(0)},${H - 34} Z`} fill="url(#fillB)" />
          <path d={smooth(px.map((v, i) => [X(i), Y(v)] as [number, number]))} fill="none" stroke={t.fg} strokeWidth="2.4" className="drawIn" />
          {ov.includes("50-day") && <path d={smooth(m50.map((v, i) => [X(i), Y(v)] as [number, number]))} fill="none" stroke="#D98324" strokeWidth="1.6" />}
          {ov.includes("200-day") && <path d={smooth(ma(px, 40).map((v, i) => [X(i), Y(v)] as [number, number]))} fill="none" stroke="#1B3A5C" strokeWidth="1.6" strokeDasharray="7 4" />}
          {ov.includes("Volume") &&
            px.map((_v, i) => {
              const h = ((3 + (i % 7) * 0.6) / 8) * 26;
              return <rect key={i} x={X(i)} y={H - 34 - h} width={W / px.length - 2} height={h} fill={t.fg} opacity="0.16" />;
            })}

          {ov.includes("Annotations") &&
            notes.map((nn) => (
              <g key={nn.i}>
                <line x1={X(nn.i)} x2={X(nn.i)} y1={Y(px[nn.i])} y2={nn.up ? Y(px[nn.i]) - 46 : Y(px[nn.i]) + 46} stroke={t.down} strokeWidth="1" />
                <circle cx={X(nn.i)} cy={Y(px[nn.i])} r="4.5" fill={t.down} />
                <text
                  x={Math.min(X(nn.i) + 7, W - 240)}
                  y={nn.up ? Y(px[nn.i]) - 50 : Y(px[nn.i]) + 50}
                  fontSize="14"
                  fill={t.fg}
                  fontFamily="Newsreader"
                  fontStyle="italic"
                >
                  {nn.txt}
                </text>
              </g>
            ))}

          {hover !== null && (
            <g>
              <line x1={X(hover)} x2={X(hover)} y1="14" y2={H - 34} stroke={t.fg} strokeWidth="0.7" opacity="0.5" />
              <circle cx={X(hover)} cy={Y(px[hover])} r="5" fill={t.down} />
            </g>
          )}
          {px.map((_v, i) => (
            <rect key={i} x={X(i) - W / px.length / 2} y="0" width={W / px.length} height={H - 34} fill="transparent" onMouseEnter={() => setHover(i)} />
          ))}
          <line x1="6" x2={W - 60} y1={H - 34} y2={H - 34} stroke={t.fg} />
          {labels.map((l, i) =>
            i % 13 === 0 ? <text key={i} x={X(i)} y={H - 16} fontSize="11" fill={t.sub} textAnchor="middle" fontFamily="Newsreader">{l}</text> : null,
          )}
          <text x={W - 54} y={Y(px.at(-1)!) + 4} fontSize="13" fill={t.down} fontFamily="IBM Plex Mono" fontWeight="600">
            {px.at(-1)!.toFixed(2)}
          </text>
        </svg>

        <aside style={{ borderLeft: `1px solid ${t.rule}` }} className="pl-5">
          <Caps style={{ color: t.sub }}>{hover !== null ? labels[hover] : "Period summary"}</Caps>
          <div className="tnum mt-1 font-sans text-[42px] font-extrabold leading-none tracking-tight">
            {hover !== null ? `$${px[hover].toFixed(2)}` : `$${px.at(-1)!.toFixed(2)}`}
          </div>
          <div className="mt-4 space-y-2.5">
            {(hover !== null
              ? [
                  ["Return vs start", `${(((px[hover] - px[0]) / px[0]) * 100).toFixed(1)}%`],
                  ["50-day avg", m50[hover].toFixed(2)],
                  ["Off peak", `${(((px[hover] - Math.max(...px.slice(0, hover + 1))) / Math.max(...px.slice(0, hover + 1))) * 100).toFixed(1)}%`],
                ]
              : [
                  ["Two-year return", `${(((px.at(-1)! - px[0]) / px[0]) * 100).toFixed(1)}%`],
                  ["Best month", "+22.4% · Nov 25"],
                  ["Worst month", "−17.1% · Mar 25"],
                  ["Peak drawdown", "−21.6%"],
                  ["Days to new high", "9"],
                ]
            ).map(([k, v]) => (
              <div key={k} className="flex items-baseline justify-between gap-2 border-b pb-1.5" style={{ borderColor: t.rule }}>
                <span className="font-display text-[14.5px]">{k}</span>
                <span className="tnum font-mono text-[12.5px]">{v}</span>
              </div>
            ))}
          </div>
          <p className="mt-4 font-display text-[14px] italic leading-relaxed" style={{ color: t.sub }}>
            Hover anywhere on the plot to freeze the plate on a single day.
          </p>
        </aside>
      </div>
    </div>
  );
}

/* ═══════════════════════ 4.c — BLUEPRINT / SUBPANELS ═══════════════════════ */
function P4C() {
  const t = TONES.blueprint;
  const [panels, setPanels] = useState<string[]>(["Volume", "RSI"]);
  const [x, setX] = useState<number | null>(null);
  const px = PX_3Y.slice(-78);
  const labels = LAB.slice(-78);
  const R = rsi(px);
  const lo = Math.min(...px) * 0.98, hi = Math.max(...px) * 1.02;
  const PH = 230, SH = 62;
  const X = (i: number) => lin(i, 0, px.length - 1, 46, W - 52);
  const Y = (v: number) => lin(v, lo, hi, PH - 22, 16);

  const rows = panels.length;
  const H = PH + rows * (SH + 14);
  const toggle = (k: string) => setPanels((p) => (p.includes(k) ? p.filter((z) => z !== k) : [...p, k]));
  const off = PH + 12;

  const marks = [
    { i: 12, lab: "1 · Q3 beat" },
    { i: 33, lab: "2 · Peer upgrade" },
    { i: 58, lab: "3 · Q4 beat" },
  ];

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-baseline gap-4">
          <span className="font-mono text-[13px] tracking-[0.2em]" style={{ color: t.sub }}>CHART 4C</span>
          <span className="font-sans text-[20px] font-bold tracking-tight">HLG / NASDAQ · 78 sessions</span>
        </div>
        <div className="flex gap-1.5">
          {["Volume", "RSI", "MACD", "MA ribbon", "Event rules"].map((k) => (
            <button
              key={k}
              onClick={() => toggle(k)}
              className="px-2.5 py-1 font-mono text-[9.5px] uppercase tracking-[0.14em]"
              style={{
                border: `1px solid ${panels.includes(k) ? t.down : t.rule}`,
                color: panels.includes(k) ? "#12243A" : t.sub,
                background: panels.includes(k) ? t.down : "transparent",
              }}
            >
              {k}
            </button>
          ))}
        </div>
      </div>

      <div style={{ border: `1px solid ${t.rule}`, background: "rgba(230,237,245,0.03)" }}>
        <svg
          viewBox={`0 0 ${W} ${H}`}
          width="100%"
          className="block"
          onMouseMove={(e) => {
            const r = (e.currentTarget as SVGSVGElement).getBoundingClientRect();
            const px_ = ((e.clientX - r.left) / r.width) * W;
            setX(Math.max(46, Math.min(W - 52, px_)));
          }}
          onMouseLeave={() => setX(null)}
        >
          {/* engineering grid */}
          {Array.from({ length: 14 }).map((_, i) => (
            <line key={`v${i}`} x1={46 + i * ((W - 98) / 13)} x2={46 + i * ((W - 98) / 13)} y1="8" y2={H - 8} stroke={t.rule} strokeWidth="0.5" opacity="0.5" />
          ))}
          {[0, 1, 2, 3, 4].map((f) => (
            <g key={f}>
              <line x1="46" x2={W - 52} y1={Y(lo + (f / 4) * (hi - lo))} y2={Y(lo + (f / 4) * (hi - lo))} stroke={t.rule} strokeDasharray="1 5" />
              <text x="42" y={Y(lo + (f / 4) * (hi - lo)) + 3.5} fontSize="10" fill={t.sub} textAnchor="end" fontFamily="IBM Plex Mono">
                {(lo + (f / 4) * (hi - lo)).toFixed(0)}
              </text>
            </g>
          ))}

          {/* MA ribbon */}
          {panels.includes("MA ribbon") && (
            <path
              d={`${smooth(ma(px, 5).map((v, i) => [X(i), Y(v)] as [number, number]))} L${[...ma(px, 20)].reverse().map((v, i) => `${X(px.length - 1 - i)},${Y(v)}`).join(" L")} Z`}
              fill={t.up}
              opacity="0.22"
            />
          )}

          <path d={smooth(px.map((v, i) => [X(i), Y(v)] as [number, number]))} fill="none" stroke="#E6EDF5" strokeWidth="1.9" className="drawIn" />

          {/* event rules */}
          {panels.includes("Event rules") &&
            marks.map((m, k) => (
              <g key={m.lab}>
                <line x1={X(m.i)} x2={X(m.i)} y1="8" y2={H - 8} stroke="#E88A7A" strokeWidth="1" strokeDasharray="6 3" />
                <circle cx={X(m.i)} cy="18" r="8" fill="#E88A7A" />
                <text x={X(m.i)} y="21.5" fontSize="10" fill="#12243A" textAnchor="middle" fontFamily="IBM Plex Mono" fontWeight="600">{k + 1}</text>
              </g>
            ))}

          <line x1="46" x2={W - 52} y1={PH - 4} y2={PH - 4} stroke={t.rule} />

          {/* sub panels */}
          {panels.map((p, k) => {
            const oy = off + k * (SH + 14);
            return (
              <g key={p} transform={`translate(0,${oy})`}>
                <rect x="46" y="0" width={W - 98} height={SH} fill="rgba(230,237,245,0.04)" stroke={t.rule} strokeWidth="0.5" />
                <text x="4" y="12" fontSize="9.5" fill={t.sub} fontFamily="IBM Plex Mono" letterSpacing="1.4">{p.toUpperCase()}</text>
                {p === "Volume" &&
                  px.map((_v, i) => {
                    const h = ((3 + (i % 7) * 0.6) / 8) * (SH - 8);
                    return <rect key={i} x={X(i) - 4} y={SH - 4 - h} width="8" height={h} fill={i && px[i] < px[i - 1] ? t.down : t.up} opacity="0.8" />;
                  })}
                {p === "RSI" && (
                  <>
                    <rect x="46" y={lin(70, 0, 100, SH, 0)} width={W - 98} height={lin(30, 0, 100, SH, 0) - lin(70, 0, 100, SH, 0)} fill={t.up} opacity="0.08" />
                    <path d={poly(R.map((v, i) => [X(i), lin(v, 0, 100, SH - 4, 4)] as [number, number]))} fill="none" stroke="#E6EDF5" strokeWidth="1.4" />
                    <text x={W - 48} y={lin(70, 0, 100, SH, 0) + 9} fontSize="8.5" fill={t.sub} fontFamily="IBM Plex Mono">70</text>
                    <text x={W - 48} y={lin(30, 0, 100, SH, 0) - 3} fontSize="8.5" fill={t.sub} fontFamily="IBM Plex Mono">30</text>
                  </>
                )}
                {p === "MACD" &&
                  (() => {
                    const M2 = macd(px);
                    const mn = Math.min(...M2.hist) * 1.3, mx2 = Math.max(...M2.hist) * 1.3;
                    return (
                      <>
                        {M2.hist.map((h, i) => (
                          <rect key={i} x={X(i) - 4} y={lin(Math.max(0, h), mn, mx2, SH - 4, 4)} width="8" height={Math.abs(lin(h, mn, mx2, SH - 4, 4) - lin(0, mn, mx2, SH - 4, 4))} fill={h > 0 ? t.up : t.down} />
                        ))}
                        <path d={poly(M2.line.map((v, i) => [X(i), lin(v, mn, mx2, SH - 4, 4)] as [number, number]))} fill="none" stroke="#E6EDF5" strokeWidth="1.3" />
                        <path d={poly(M2.sig.map((v, i) => [X(i), lin(v, mn, mx2, SH - 4, 4)] as [number, number]))} fill="none" stroke="#E88A7A" strokeWidth="1.3" />
                      </>
                    );
                  })()}
              </g>
            );
          })}

          {/* crosshair */}
          {x !== null && (
            <g pointerEvents="none">
              <line x1={x} x2={x} y1="8" y2={H - 8} stroke="#E6EDF5" strokeWidth="0.7" strokeDasharray="3 3" opacity="0.7" />
              <rect x={Math.min(x + 6, W - 96)} y="6" width="90" height="34" fill="#E6EDF5" />
              <text x={Math.min(x + 12, W - 90)} y="20" fontSize="11" fill="#12243A" fontFamily="IBM Plex Mono" fontWeight="600">
                {labels[Math.round(lin(x, 46, W - 52, 0, px.length - 1))]}
              </text>
              <text x={Math.min(x + 12, W - 90)} y="34" fontSize="11" fill="#12243A" fontFamily="IBM Plex Mono">
                ${(px[Math.round(lin(x, 46, W - 52, 0, px.length - 1))] ?? 0).toFixed(2)}
              </text>
            </g>
          )}

          {labels.map((l, i) =>
            i % 11 === 0 ? <text key={i} x={X(i)} y={H - 6} fontSize="9.5" fill={t.sub} textAnchor="middle" fontFamily="IBM Plex Mono">{l}</text> : null,
          )}
        </svg>
      </div>

      <div className="mt-3 grid gap-3 sm:grid-cols-3" style={{ borderTop: `1px solid ${t.rule}`, paddingTop: 10 }}>
        {marks.map((m, k) => (
          <div key={m.lab} className="flex items-baseline gap-2">
            <span className="inline-flex h-[17px] w-[17px] items-center justify-center rounded-full font-mono text-[10px]" style={{ background: "#E88A7A", color: "#12243A" }}>{k + 1}</span>
            <span className="font-mono text-[10.5px]" style={{ color: t.sub }}>{m.lab}</span>
          </div>
        ))}
      </div>
      <div className="mt-2 flex justify-between font-mono text-[10px]" style={{ color: t.sub }}>
        <span>Sub-panels: {panels.length ? panels.join(" · ") : "none"} — toggle above</span>
        <span>Total plot height {H}px · {rows} panel{rows === 1 ? "" : "s"}</span>
      </div>
    </div>
  );
}

export function C4() {
  const nm = "Price chart with overlays";
  return (
    <>
      <Plate n={4} letter="a" name={nm} variant="Terminal chart — candles, moving averages, events, one switchable study" tone="ink" caption="A working trader's plate: crosshair readout in the header bar, five overlay switches, three ranges, and a single study slot that swaps between volume, RSI and MACD so the chart never outgrows its box.">
        <P4A />
      </Plate>
      <Plate n={4} letter="b" name={nm} variant="Annotated essay — the chart argues its own history" tone="paper" caption="The same data set as a piece of writing: a gridded area, italic annotations hung on leader lines, drawdowns shaded in ink-blue, and a right-hand rail that swaps between period summary and the hovered day.">
        <P4B />
      </Plate>
      <Plate n={4} letter="c" name={nm} variant="Engineering drawing with stackable sub-panels" tone="blueprint" caption="Drawn like a plot from a technical manual: dashed construction grid, price gutter on the left, numbered event rules with a legend beneath, and independently switchable volume / RSI / MACD panels that re-flow the drawing.">
        <P4C />
      </Plate>
    </>
  );
}

