import { useState } from "react";
import { Caps, Plate, Toggle, TONES, nf, lin } from "@/ui";
import { CO } from "@/data";

type Comp = {
  t: string; name: string; share: number; growth: number; rev: number; tier: string; color: string; note: string;
};

const COMPS: Comp[] = [
  { t: "NVPT", name: "Novanta Power", share: 19.2, growth: 11.2, rev: 7.61, tier: "Utility", color: "#1B3A5C", note: "Scale incumbent; broadest installed base, oldest platform." },
  { t: "HLG", name: "Halcyon Grid", share: 14.8, growth: 18.6, rev: 4.82, tier: "Utility", color: "#8E1F2F", note: "Fastest share gainer in the top five; strongest software attach." },
  { t: "BLNE", name: "Brightline Electric", share: 12.6, growth: 14.1, rev: 5.42, tier: "Transmission", color: "#D98324", note: "Premium positioning in Japan and the Gulf; margins best in set." },
  { t: "TDNE", name: "Terradyne Energy", share: 9.4, growth: 24.9, rev: 3.94, tier: "Storage", color: "#2E5E4A", note: "Aggressive on price; winning volume at the cost of margin." },
  { t: "KSDL", name: "Kestrel Drives", share: 8.3, growth: 4.8, rev: 3.36, tier: "Industrial", color: "#5C1420", note: "Mature drive business; slow but very cash generative." },
  { t: "CNDR", name: "Cinder Works", share: 7.1, growth: 6.4, rev: 2.88, tier: "Industrial", color: "#8A7F73", note: "Regional player, over-indexed to US Midwest utilities." },
  { t: "ORBK", name: "Orbis Power Systems", share: 5.2, growth: 31.4, rev: 1.97, tier: "Storage", color: "#B8404E", note: "Challenger growing off a small base; venture-backed." },
  { t: "ASHG", name: "Ashgrove Capital", share: 3.4, growth: -2.1, rev: 1.21, tier: "Legacy", color: "#8A7F73", note: "Losing share to software-led competitors." },
];

const SEGMENTS = [
  { k: "Utility T&D equipment", size: 11.8, cells: [26, 21, 9, 6, 14, 8, 3, 2] },
  { k: "Transmission systems", size: 7.4, cells: [14, 17, 24, 8, 5, 6, 4, 1] },
  { k: "C&I storage", size: 6.2, cells: [9, 12, 7, 22, 3, 4, 16, 2] },
  { k: "Substation software", size: 3.1, cells: [11, 19, 12, 6, 4, 5, 7, 3] },
  { k: "Service & LTAs", size: 4.6, cells: [22, 18, 11, 7, 15, 9, 3, 2] },
];

/* ═══════════════════════ 8.a — PERCEPTUAL MAP ═══════════════════════ */
function A() {
  const t = TONES.bone;
  const [sel, setSel] = useState<string>("HLG");
  const [mode, setMode] = useState<"growth" | "margin">("growth");
  const W = 860, H = 430;
  const X = (v: number) => lin(v, 0, 22, 56, W - 130);
  const Y = (v: number) => lin(v, mode === "growth" ? -5 : 4, mode === "growth" ? 35 : 26, H - 54, 30);
  const cur = COMPS.find((c) => c.t === sel)!;
  const marginOf = (c: Comp) => 6 + c.share * 0.42 + (c.t === "HLG" ? 5.4 : 0);

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <Caps style={{ color: t.sub }}>Global grid interconnection equipment · FY2025 · share of $33.1bn served market</Caps>
          <div className="mt-1 font-display text-[21px] italic">Position on share against {mode === "growth" ? "growth" : "profitability"}; bubble area is revenue.</div>
        </div>
        <Toggle opts={["growth", "margin"] as const} value={mode} onChange={setMode} t={t} size="sm" />
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_236px]">
        <svg viewBox={`0 0 ${W} ${H}`} width="100%" className="block">
          {/* quadrants */}
          <rect x={X(11)} y={30} width={W - 130 - X(11)} height={Y(mode === "growth" ? 15 : 15) - 30} fill="#8E1F2F" opacity="0.05" />
          <rect x={56} y={Y(mode === "growth" ? 15 : 15)} width={X(11) - 56} height={H - 54 - Y(mode === "growth" ? 15 : 15)} fill="#1B3A5C" opacity="0.05" />
          <line x1={X(11)} x2={X(11)} y1="30" y2={H - 54} stroke={t.rule} strokeDasharray="5 4" />
          <line x1="56" x2={W - 130} y1={Y(mode === "growth" ? 15 : 15)} y2={Y(mode === "growth" ? 15 : 15)} stroke={t.rule} strokeDasharray="5 4" />
          <text x={W - 126} y="46" fontSize="11" fill={t.down} fontFamily="IBM Plex Mono" letterSpacing="1.6">SCALE + SPEED</text>
          <text x="62" y={H - 60} fontSize="11" fill={t.sub} fontFamily="IBM Plex Mono" letterSpacing="1.6">DEFENDING</text>
          <text x="62" y="46" fontSize="11" fill={t.sub} fontFamily="IBM Plex Mono" letterSpacing="1.6">CHALLENGERS</text>
          <text x={W - 126} y={H - 60} fontSize="11" fill={t.sub} fontFamily="IBM Plex Mono" letterSpacing="1.6">SCALE, SLOWING</text>

          {/* axes */}
          <line x1="56" x2={W - 130} y1={H - 54} y2={H - 54} stroke={t.fg} />
          <line x1="56" x2="56" y1="30" y2={H - 54} stroke={t.fg} />
          {[0, 5, 10, 15, 20].map((v) => (
            <g key={v}>
              <line x1={X(v)} x2={X(v)} y1={H - 54} y2={H - 48} stroke={t.fg} />
              <text x={X(v)} y={H - 34} fontSize="11" fill={t.sub} textAnchor="middle" fontFamily="IBM Plex Mono">{v}%</text>
            </g>
          ))}
          {(mode === "growth" ? [0, 10, 20, 30] : [5, 10, 15, 20, 25]).map((v) => (
            <g key={v}>
              <line x1="50" x2="56" y1={Y(v)} y2={Y(v)} stroke={t.fg} />
              <text x="46" y={Y(v) + 4} fontSize="11" fill={t.sub} textAnchor="end" fontFamily="IBM Plex Mono">{v}%</text>
            </g>
          ))}
          <text x={(W - 130 + 56) / 2} y={H - 10} fontSize="11.5" fill={t.sub} textAnchor="middle" fontFamily="IBM Plex Mono" letterSpacing="2">
            MARKET SHARE →
          </text>
          <text x="16" y={(H - 54 + 30) / 2} fontSize="11.5" fill={t.sub} textAnchor="middle" fontFamily="IBM Plex Mono" letterSpacing="2" transform={`rotate(-90 16 ${(H - 54 + 30) / 2})`}>
            {mode === "growth" ? "REVENUE GROWTH YoY" : "OPERATING MARGIN"}
          </text>

          {COMPS.map((c) => {
            const r = 10 + Math.sqrt(c.rev) * 8.5;
            const yv = mode === "growth" ? c.growth : marginOf(c);
            const on = sel === c.t;
            return (
              <g key={c.t} onMouseEnter={() => setSel(c.t)} onClick={() => setSel(c.t)} style={{ cursor: "pointer" }}>
                <circle cx={X(c.share)} cy={Y(yv)} r={r} fill={c.color} opacity={on ? 0.5 : 0.24} />
                <circle cx={X(c.share)} cy={Y(yv)} r={r} fill="none" stroke={c.color} strokeWidth={on ? 2.6 : 1.4} />
                <text x={X(c.share)} y={Y(yv) - r - 8} fontSize="13" fill={t.fg} textAnchor="middle" fontFamily="Archivo" fontWeight="700">{c.t}</text>
                <text x={X(c.share)} y={Y(yv) + 4} fontSize="11" fill={t.fg} textAnchor="middle" fontFamily="IBM Plex Mono">{c.share}%</text>
                {on && <circle cx={X(c.share)} cy={Y(yv)} r={r + 7} fill="none" stroke={t.down} strokeWidth="1.5" strokeDasharray="4 3" />}
              </g>
            );
          })}
          <g transform={`translate(${W - 118},60)`}>
            <text x="0" y="0" fontSize="9.5" fill={t.sub} fontFamily="IBM Plex Mono" letterSpacing="1.6">REVENUE SCALE</text>
            {[2, 5, 8].map((v, i) => (
              <g key={v} transform={`translate(30,${26 + i * 44})`}>
                <circle r={10 + Math.sqrt(v) * 8.5} fill="none" stroke={t.sub} />
                <text x="0" y={4} fontSize="9.5" fill={t.sub} textAnchor="middle" fontFamily="IBM Plex Mono">${v}bn</text>
              </g>
            ))}
          </g>
        </svg>

        <aside style={{ borderLeft: `1px solid ${t.rule}` }} className="pl-5">
          <Caps style={{ color: t.down }}>Selected</Caps>
          <div className="mt-1 font-sans text-[24px] font-extrabold leading-none tracking-tight">{cur.t}</div>
          <div className="font-display text-[16px] italic">{cur.name}</div>
          <div className="mt-4 space-y-2">
            {[
              ["Market share", `${cur.share}%`],
              ["Growth YoY", `${cur.growth > 0 ? "+" : ""}${cur.growth.toFixed(1)}%`],
              ["Revenue", `$${cur.rev.toFixed(2)}bn`],
              ["Position", cur.tier],
            ].map(([k, v]) => (
              <div key={k} className="flex items-baseline justify-between border-b pb-1.5" style={{ borderColor: t.rule }}>
                <span className="font-mono text-[10px] uppercase tracking-[0.14em]" style={{ color: t.sub }}>{k}</span>
                <span className="tnum font-mono text-[13px]">{v}</span>
              </div>
            ))}
          </div>
          <p className="mt-4 font-display text-[15px] italic leading-relaxed" style={{ color: "rgba(22,18,14,0.7)" }}>{cur.note}</p>
          <div className="mt-4">
            <Caps style={{ color: t.sub }}>Halcyon share, 4 years</Caps>
            <div className="mt-1 flex items-end gap-1.5">
              {[10.9, 12.1, 13.4, 14.8].map((v, i) => (
                <div key={i} className="flex-1" style={{ height: `${v * 5}px`, background: i === 3 ? t.down : "rgba(142,31,47,0.3)" }} />
              ))}
            </div>
            <div className="mt-1 flex justify-between font-mono text-[9.5px]" style={{ color: t.sub }}>
              {["2022", "2023", "2024", "2025"].map((y) => <span key={y}>{y}</span>)}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

/* ═══════════════════════ 8.b — SHARE TREEMAP ═══════════════════════ */
function B() {
  const t = TONES.ledger;
  const [seg, setSeg] = useState<string | null>(null);
  const [sel, setSel] = useState<string>("HLG");

  const total = SEGMENTS.reduce((s, x) => s + x.size, 0);
  let x0 = 0;
  const layout = SEGMENTS.map((s) => {
    const w = (s.size / total) * 100;
    const item = { ...s, x: x0, w };
    x0 += w;
    return item;
  });

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <Caps style={{ color: t.sub }}>Interconnection market map · area = segment revenue · colour = share momentum</Caps>
          <div className="mt-1 font-display text-[21px] italic">
            {seg ? `${seg} — ${nf(SEGMENTS.find((s) => s.k === seg)!.size, 1)}bn` : "Click a segment to open it"}
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setSeg(null)} className="px-3 py-1 font-mono text-[10px] uppercase tracking-[0.16em]" style={{ border: `1px solid ${t.rule}`, color: seg ? t.sub : t.up }}>
            All segments
          </button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_246px]">
        <div>
          <div className="relative h-[400px] w-full" style={{ border: `1px solid ${t.rule}` }}>
            {layout.map((s) => {
              const dim = seg && seg !== s.k;
              let y0 = 0;
              const tot = s.cells.reduce((a, b) => a + b, 0);
              return (
                <div
                  key={s.k}
                  className="absolute top-0 h-full transition-all duration-300"
                  style={{ left: `${s.x}%`, width: `${s.w}%`, opacity: dim ? 0.3 : 1, borderRight: `1px solid ${t.rule}` }}
                >
                  <button
                    onClick={() => setSeg(seg === s.k ? null : s.k)}
                    className="absolute left-0 top-0 z-10 w-full px-2 py-1.5 text-left"
                    style={{ background: seg === s.k ? t.up : "rgba(15,36,25,0.86)", borderBottom: `1px solid ${t.rule}` }}
                  >
                    <span className="block truncate font-mono text-[9.5px] uppercase tracking-[0.12em]" style={{ color: seg === s.k ? "#0F2419" : "#E8F0EA" }}>
                      {s.k}
                    </span>
                    <span className="tnum block font-sans text-[14px] font-bold" style={{ color: seg === s.k ? "#0F2419" : "#69C39B" }}>
                      ${s.size.toFixed(1)}bn
                    </span>
                  </button>
                  <div className="flex h-full flex-col pt-[52px]">
                    {s.cells.map((c, i) => {
                      const h = (c / tot) * 100;
                      const pc = COMPS[i];
                      const on = sel === pc.t;
                      const grow = pc.growth;
                      const y = y0;
                      y0 += h;
                      return (
                        <button
                          key={pc.t}
                          onClick={() => setSel(pc.t)}
                          className="relative w-full overflow-hidden text-left transition-all duration-200"
                          style={{
                            height: `${h}%`,
                            background: grow > 15 ? "rgba(105,195,155,0.9)" : grow > 8 ? "rgba(105,195,155,0.55)" : grow > 0 ? "rgba(232,128,115,0.45)" : "rgba(232,128,115,0.85)",
                            borderBottom: `1px solid rgba(15,36,25,0.55)`,
                            outline: on ? `2px solid #E8F0EA` : "none",
                            outlineOffset: "-2px",
                            filter: on ? "brightness(1.25)" : "none",
                          }}
                          title={`${pc.name} — ${c}% of ${s.k}`}
                        >
                          <span className="absolute left-1.5 top-1 font-mono text-[10.5px] font-semibold" style={{ color: "#0F2419" }}>{pc.t}</span>
                          <span className="tnum absolute bottom-1 right-1.5 font-mono text-[10.5px]" style={{ color: "#0F2419" }}>{c}%</span>
                          <span className="sr-only">{y}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-4 font-mono text-[10px]" style={{ color: t.sub }}>
            <span><span style={{ color: "#69C39B" }}>■</span> share gaining</span>
            <span><span style={{ color: "#E88A73" }}>■</span> share losing</span>
            <span className="ml-auto">Total served market ${total.toFixed(1)}bn · FY2025</span>
          </div>
        </div>

        <aside style={{ borderLeft: `1px solid ${t.rule}` }} className="pl-5">
          <Caps style={{ color: t.up }}>Player</Caps>
          <div className="font-sans text-[26px] font-extrabold leading-none">{sel}</div>
          <div className="font-display text-[16px] italic" style={{ color: t.sub }}>{COMPS.find((c) => c.t === sel)!.name}</div>
          <div className="mt-4">
            <Caps style={{ color: t.sub }}>Presence by segment</Caps>
            <div className="mt-2 space-y-2">
              {SEGMENTS.map((s) => {
                const v = s.cells[COMPS.findIndex((c) => c.t === sel)];
                const mx = Math.max(...s.cells);
                return (
                  <div key={s.k}>
                    <div className="flex justify-between">
                      <span className="font-mono text-[10.5px]" style={{ color: t.sub }}>{s.k}</span>
                      <span className="tnum font-mono text-[11.5px]">{v}%</span>
                    </div>
                    <div className="mt-0.5 h-[6px] w-full" style={{ background: "rgba(232,240,234,0.1)" }}>
                      <div className="h-full" style={{ width: `${(v / mx) * 100}%`, background: v === mx ? t.up : "rgba(232,240,234,0.45)" }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <p className="mt-4 border-t pt-3 font-display text-[14.5px] italic leading-relaxed" style={{ borderColor: t.rule, color: t.sub }}>
            {COMPS.find((c) => c.t === sel)!.note}
          </p>
        </aside>
      </div>
    </div>
  );
}

/* ═══════════════════════ 8.c — PRESENCE MATRIX ═══════════════════════ */
function C() {
  const t = TONES.paper;
  const [row, setRow] = useState<string>("HLG");
  const [col, setCol] = useState<string | null>(null);
  const [metric, setMetric] = useState<"share" | "rev">("share");
  const ranks = SEGMENTS.map((s) => ({ ...s, order: s.cells.map((c, i) => ({ i, c })).sort((a, b) => b.c - a.c) }));

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <Caps style={{ color: t.sub }}>Who plays where · cell = share of that segment · dark = segment leader</Caps>
          <div className="mt-1 font-display text-[21px] italic">Eight players, five segments, one page — and the leaders are not the same in each.</div>
        </div>
        <Toggle opts={["share", "rev"] as const} value={metric} onChange={setMetric} t={t} size="sm" />
      </div>

      <div className="overflow-x-auto scroller">
        <table className="w-full min-w-[820px] border-collapse">
          <thead>
            <tr style={{ borderBottom: `2px solid ${t.fg}` }}>
              <th className="pb-2 pr-4 text-left align-bottom">
                <Caps style={{ color: t.sub }}>Player</Caps>
              </th>
              {SEGMENTS.map((s) => (
                <th
                  key={s.k}
                  onMouseEnter={() => setCol(s.k)}
                  onMouseLeave={() => setCol(null)}
                  className="pb-2 align-bottom"
                  style={{ background: col === s.k ? t.soft : "transparent" }}
                >
                  <div className="mx-auto w-[86px] text-center">
                    <div className="font-display text-[13.5px] leading-tight">{s.k}</div>
                    <div className="tnum font-mono text-[9.5px]" style={{ color: t.sub }}>${s.size.toFixed(1)}bn</div>
                  </div>
                </th>
              ))}
              <th className="pb-2 pl-3 text-right align-bottom"><Caps style={{ color: t.sub }}>Total</Caps></th>
            </tr>
          </thead>
          <tbody>
            {COMPS.map((c, ri) => {
              const self = c.t === CO.ticker;
              return (
                <tr
                  key={c.t}
                  onMouseEnter={() => setRow(c.t)}
                  style={{
                    borderBottom: `1px solid ${t.rule}`,
                    background: row === c.t ? t.soft : self ? "rgba(142,31,47,0.06)" : "transparent",
                    boxShadow: self ? `inset 3px 0 0 ${t.down}` : "none",
                  }}
                >
                  <td className="py-1.5 pr-4">
                    <div className="flex items-baseline gap-2">
                      <span className="font-mono text-[12.5px] font-semibold" style={{ color: self ? t.down : t.fg }}>{c.t}</span>
                      <span className="truncate text-[12.5px]" style={{ color: "rgba(22,18,14,0.72)" }}>{c.name}</span>
                    </div>
                  </td>
                  {SEGMENTS.map((s, ci) => {
                    const v = s.cells[ri];
                    const leader = ranks[ci].order[0].i === ri;
                    const f = v / Math.max(...s.cells);
                    return (
                      <td
                        key={s.k}
                        onMouseEnter={() => { setCol(s.k); setRow(c.t); }}
                        className="p-[3px]"
                        style={{ background: col === s.k ? "rgba(142,31,47,0.05)" : undefined }}
                      >
                        <div
                          className="flex h-[38px] w-[86px] items-center justify-center transition-transform duration-200"
                          style={{
                            background: `rgba(142,31,47,${0.07 + f * 0.62})`,
                            outline: leader ? `1.5px solid ${t.down}` : "none",
                            outlineOffset: "-1.5px",
                            transform: row === c.t ? "scale(1.04)" : "none",
                          }}
                        >
                          <span className="tnum font-mono text-[13px] font-semibold" style={{ color: f > 0.55 ? "#F7E7DA" : t.fg }}>
                            {metric === "share" ? `${v}%` : `$${((v / 100) * s.size).toFixed(1)}b`}
                          </span>
                        </div>
                      </td>
                    );
                  })}
                  <td className="py-1.5 pl-3 text-right">
                    <span className="tnum font-mono text-[13px]" style={{ color: self ? t.down : t.fg }}>{c.share}%</span>
                    <div className="tnum font-mono text-[9.5px]" style={{ color: t.sub }}>#{[...COMPS].sort((a, b) => b.share - a.share).findIndex((z) => z.t === c.t) + 1}</div>
                  </td>
                </tr>
              );
            })}
            <tr style={{ borderTop: `2px solid ${t.fg}` }}>
              <td className="pt-2 pr-4"><Caps style={{ color: t.sub }}>Segment leader</Caps></td>
              {ranks.map((s) => (
                <td key={s.k} className="pt-2 text-center">
                  <span className="font-mono text-[11.5px] font-semibold" style={{ color: t.down }}>{COMPS[s.order[0].i].t}</span>
                </td>
              ))}
              <td />
            </tr>
          </tbody>
        </table>
      </div>

      <div className="mt-4 grid gap-5 border-t pt-4 sm:grid-cols-3" style={{ borderColor: t.rule }}>
        {[
          ["Halcyon leads 2 of 5 segments", "Storage software and utility T&D growth — not yet scale leadership."],
          ["Concentration is falling", "Top-three share moved from 48.6% to 46.6% in three years as challengers took the storage layer."],
          ["The contested cell", "C&I storage is where six of eight players overlap; price discipline there sets the sector's margin."],
        ].map(([h, b]) => (
          <div key={h}>
            <div className="font-sans text-[14px] font-bold tracking-tight">{h}</div>
            <p className="mt-1 font-display text-[14.5px] italic leading-relaxed" style={{ color: "rgba(22,18,14,0.7)" }}>{b}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function C8() {
  const nm = "Competitive landscape map";
  return (
    <>
      <Plate n={8} letter="a" name={nm} variant="Perceptual map — share against growth, bubble = revenue" tone="bone" caption="Quadrants are labelled in the language of strategy, not analytics. Hover any bubble to pull its dossier into the right rail; switch the vertical axis to operating margin and the story changes from scale to quality.">
        <A />
      </Plate>
      <Plate n={8} letter="b" name={nm} variant="Segment treemap — click through the market" tone="ledger" caption="Area encodes revenue, fill encodes whether a player is gaining or losing share, and every segment column opens on click. The right rail shows the selected player's presence profile across all five segments.">
        <B />
      </Plate>
      <Plate n={8} letter="c" name={nm} variant="Presence matrix — leaders differ by segment" tone="paper" caption="A grid rather than a chart: cells are shaded by share within each segment, the segment leader is ringed, and toggling to dollar terms turns the same grid into a revenue map. Row and column cross-highlight on hover.">
        <C />
      </Plate>
    </>
  );
}

/* ═══════════════════════ shared argument data for plate 11 ═══════════════════════ */
type Arg = { topic: string; claim: string; ev: string; weight: number; source: string };

const BULL: Arg[] = [
  { topic: "Demand", claim: "Grid interconnection queues are a decade long; equipment is the bottleneck, not software.", ev: "North American interconnection queue reached 2,380 GW at end-2025 (LBNL), up 61% in three years. Halcyon's backlog of $2.1bn covers 18 months of that demand.", weight: 5, source: "LBNL Queues report, Jan 2026" },
  { topic: "Mix", claim: "Storage & controls software is now 26% of revenue at ~72% gross margin.", ev: "Software revenue grew 23.8% in FY25 while equipment grew 20.5%; each point of mix shift is worth roughly 55bp of group gross margin.", weight: 4, source: "10-K p.71; Meridian estimates" },
  { topic: "Returns", claim: "ROIC of 17.4% is above an estimated 9.1% cost of capital — the fourth straight year of value creation.", ev: "EVA positive since FY22; invested capital turns 1.34×, up from 1.12× in FY21.", weight: 4, source: "Meridian return-on-capital model" },
  { topic: "Balance sheet", claim: "Net debt/EBITDA of 1.4× with $1.9bn liquidity funds growth without dilution.", ev: "Interest cover 8.8×; no maturities before 2029; buybacks retired 6.4% of the share count over two years.", weight: 3, source: "10-K p.84" },
  { topic: "Management", claim: "Ohio and Pune plants both delivered ahead of plan; guidance has beaten four quarters running.", ev: "Cumulative four-year EPS surprise of +7.9%; CFO bought $1.4m of stock in February.", weight: 4, source: "Earnings history; Form 4" },
];

const BEAR: Arg[] = [
  { topic: "Valuation", claim: "At 34× trailing earnings the stock already discounts four more years of flawless execution.", ev: "34.2× vs a five-year median of 26.4× and a peer median of 29.8×; 21.4× EV/EBITDA is an 18% premium to the group.", weight: 5, source: "Meridian multiples screen" },
  { topic: "Customer risk", claim: "The top three customers represent 38% of revenue and one contract renews in Q3 2026.", ev: "Arden Supply alone is 17% of revenue; losing it would remove roughly $810m and an estimated $0.34 of EPS.", weight: 4, source: "10-K p.19; Meridian model" },
  { topic: "Policy", claim: "Tariff and domestic-content rules could take 200–400bp off gross margin.", ev: "Approximately 41% of bill of materials is imported; management guided to 150bp of headwind for FY26 and did not quantify beyond that.", weight: 3, source: "Q4'25 call, p.6" },
  { topic: "Competition", claim: "Terradyne and Orbis are buying share in storage at prices Halcyon refuses to match.", ev: "Halcyon's storage share slipped from 24% to 22% in two years while the segment grew 31% CAGR.", weight: 3, source: "Meridian market map" },
  { topic: "Working capital", claim: "Receivables and inventory grew faster than revenue for a second year — a quality warning.", ev: "DSO rose from 80 to 84 days; inventory turns fell to 3.0×; working capital absorbed $182m of the $842m operating cash flow.", weight: 4, source: "Cash flow statement" },
];

/* ═══════════════════════ 11.a — SPLIT LEDGER ═══════════════════════ */
function P11A() {
  const t = TONES.bone;
  const [open, setOpen] = useState<string[]>(["Demand"]);
  const [side, setSide] = useState<"both" | "bull" | "bear">("both");
  const [votes, setVotes] = useState<Record<string, "b" | "n" | "h">>({});
  const bw = BULL.reduce((s, a) => s + a.weight, 0);
  const rw = BEAR.reduce((s, a) => s + a.weight, 0);

  const col = (arr: Arg[], kind: "b" | "r") => (
    <div
      className={
        side !== "both" && ((side === "bull" && kind === "r") || (side === "bear" && kind === "b"))
          ? "hidden"
          : kind === "r"
            ? "lg:border-l lg:pl-8"
            : ""
      }
      style={kind === "r" ? { borderColor: t.rule } : undefined}
    >
      <div className="flex items-baseline justify-between border-b-2 pb-2" style={{ borderColor: kind === "b" ? "#2E5E4A" : "#8E1F2F" }}>
        <span className="font-sans text-[22px] font-extrabold tracking-tight" style={{ color: kind === "b" ? "#2E5E4A" : "#8E1F2F" }}>
          {kind === "b" ? "THE BULL CASE" : "THE BEAR CASE"}
        </span>
        <span className="tnum font-mono text-[12px]" style={{ color: t.sub }}>
          {arr.length} points · weight {kind === "b" ? bw : rw}/25
        </span>
      </div>
      <div>
        {arr.map((a) => {
          const key = a.topic + kind;
          const isOpen = open.includes(key);
          const v = votes[key] ?? "h";
          return (
            <div key={key} style={{ borderBottom: `1px solid ${t.rule}` }}>
              <button onClick={() => setOpen((o) => (isOpen ? o.filter((x) => x !== key) : [...o, key]))} className="flex w-full items-start gap-3 py-3 text-left">
                <span className="mt-1 flex w-[14px] shrink-0 justify-center font-mono text-[13px]" style={{ color: kind === "b" ? "#2E5E4A" : "#8E1F2F" }}>
                  {isOpen ? "−" : "+"}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-baseline gap-2">
                    <span className="font-mono text-[9.5px] uppercase tracking-[0.16em]" style={{ color: t.sub }}>{a.topic}</span>
                    <span className="ml-auto flex gap-[3px]">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span key={i} className="inline-block h-[9px] w-[4px]" style={{ background: i < a.weight ? (kind === "b" ? "#2E5E4A" : "#8E1F2F") : "rgba(22,18,14,0.14)" }} />
                      ))}
                    </span>
                  </span>
                  <span className="mt-1 block font-display text-[17px] leading-snug">{a.claim}</span>
                </span>
              </button>
              {isOpen && (
                <div className="ml-[26px] pb-4">
                  <p className="border-l-2 pl-3 text-[13.5px] leading-relaxed" style={{ borderColor: kind === "b" ? "#2E5E4A" : "#8E1F2F", color: "rgba(22,18,14,0.76)" }}>
                    {a.ev}
                  </p>
                  <div className="mt-2 flex flex-wrap items-center gap-3">
                    <span className="font-mono text-[10px]" style={{ color: t.sub }}>SOURCE · {a.source}</span>
                    <span className="ml-auto inline-flex gap-1">
                      {(["b", "n", "h"] as const).map((o) => (
                        <button
                          key={o}
                          onClick={() => setVotes((p) => ({ ...p, [key]: o }))}
                          className="px-2 py-[2px] font-mono text-[9.5px] uppercase tracking-[0.12em]"
                          style={{
                            border: `1px solid ${v === o ? (kind === "b" ? "#2E5E4A" : "#8E1F2F") : t.rule}`,
                            background: v === o ? (kind === "b" ? "#2E5E4A" : "#8E1F2F") : "transparent",
                            color: v === o ? "#F3EFE6" : t.sub,
                          }}
                        >
                          {o === "b" ? "persuaded" : o === "n" ? "doubt it" : "unheard"}
                        </button>
                      ))}
                    </span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b pb-3" style={{ borderColor: t.fg }}>
        <div>
          <Caps style={{ color: t.sub }}>Halcyon Grid Technologies · investment committee note · 18 Mar 2026</Caps>
          <div className="font-display text-[26px] leading-tight">Ten arguments, weighed</div>
        </div>
        <div className="flex items-center gap-3">
          <Toggle opts={["both", "bull", "bear"] as const} value={side} onChange={setSide} t={t} size="sm" />
          <div className="flex h-[26px] w-[168px] overflow-hidden" style={{ border: `1px solid ${t.rule}` }}>
            <div className="flex items-center justify-center transition-all duration-500" style={{ width: `${(bw / (bw + rw)) * 100}%`, background: "#2E5E4A", color: "#F3EFE6" }}>
              <span className="font-mono text-[10px]">{((bw / (bw + rw)) * 100).toFixed(0)}%</span>
            </div>
            <div className="flex flex-1 items-center justify-center" style={{ background: "#8E1F2F", color: "#F3EFE6" }}>
              <span className="font-mono text-[10px]">{((rw / (bw + rw)) * 100).toFixed(0)}%</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {col(BULL, "b")}
        {col(BEAR, "r")}
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-4 border-t pt-3" style={{ borderColor: t.rule }}>
        <span className="font-display text-[15px] italic" style={{ color: t.sub }}>
          Weighing: {Object.values(votes).filter((v) => v === "b").length} persuaded · {Object.values(votes).filter((v) => v === "n").length} unconvinced · {10 - Object.keys(votes).length} unheard
        </span>
        <span className="font-mono text-[11px]" style={{ color: t.sub }}>Bars show the committee's own weight, not the market's</span>
      </div>
    </div>
  );
}

/* ═══════════════════════ 11.b — TOPIC DEBATE ═══════════════════════ */
function P11B() {
  const t = TONES.ink;
  const [lean, setLean] = useState<number[]>([3, 3, 3, 3, 3]);
  const [pick, setPick] = useState<string | null>(null);
  const topics = BULL.map((b, i) => ({ topic: b.topic, b, r: BEAR[i] }));
  const net = lean.reduce((s, v) => s + (v - 3), 0);
  const verdict = net > 3 ? "Constructive" : net < -3 ? "Cautious" : "Balanced";

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-end justify-between gap-4">
        <div>
          <Caps style={{ color: t.sub }}>Meridian · thesis board · live</Caps>
          <div className="font-display text-[24px] italic">Where do you sit on each question?</div>
        </div>
        <div className="text-right">
          <Caps style={{ color: t.sub }}>Board stance</Caps>
          <div className="font-sans text-[30px] font-extrabold leading-none" style={{ color: net > 3 ? t.up : net < -3 ? t.down : "#F0E9E1" }}>
            {verdict}
          </div>
          <div className="font-mono text-[11px]" style={{ color: t.sub }}>net {net > 0 ? "+" : ""}{net} of ±10</div>
        </div>
      </div>

      <div className="mb-4 h-[10px] w-full overflow-hidden" style={{ border: `1px solid ${t.rule}` }}>
        <div className="h-full transition-all duration-500" style={{ width: `${50 + net * 5}%`, background: net >= 0 ? t.up : t.down }} />
        <div className="relative -mt-[10px] h-[10px]">
          <div className="absolute left-1/2 top-0 h-full w-px" style={{ background: "#F0E9E1" }} />
        </div>
      </div>

      <div className="space-y-0">
        {topics.map((tp, i) => (
          <div key={tp.topic} style={{ borderBottom: `1px solid ${t.rule}` }}>
            <div className="grid items-center gap-4 py-3" style={{ gridTemplateColumns: "minmax(0,1fr) 178px minmax(0,1fr)" }}>
              <button
                onClick={() => setPick(pick === tp.topic + "b" ? null : tp.topic + "b")}
                className="text-right transition-opacity"
                style={{ opacity: pick && pick !== tp.topic + "b" ? 0.45 : 1 }}
              >
                <span className="font-mono text-[9.5px] uppercase tracking-[0.16em]" style={{ color: t.up }}>{tp.b.topic} · bull</span>
                <span className="mt-0.5 block font-display text-[16.5px] leading-snug" style={{ color: pick === tp.topic + "b" ? t.up : "#F0E9E1" }}>
                  {tp.b.claim}
                </span>
              </button>

              <div className="px-2">
                <div className="mb-1 text-center font-mono text-[9.5px] uppercase tracking-[0.16em]" style={{ color: t.sub }}>
                  {lean[i] > 3 ? "leans bull" : lean[i] < 3 ? "leans bear" : "undecided"}
                </div>
                <input
                  type="range"
                  min={1}
                  max={5}
                  step={1}
                  value={lean[i]}
                  onChange={(e) => setLean((p) => p.map((x, j) => (j === i ? +e.target.value : x)))}
                  className="w-full"
                  style={{ color: lean[i] >= 3 ? t.up : t.down }}
                  aria-label={`${tp.topic} lean`}
                />
                <div className="mt-1 flex justify-between font-mono text-[9px]" style={{ color: t.sub }}>
                  <span>bear</span>
                  <span className="tnum" style={{ color: lean[i] > 3 ? t.up : lean[i] < 3 ? t.down : t.sub }}>{lean[i]}</span>
                  <span>bull</span>
                </div>
              </div>

              <button
                onClick={() => setPick(pick === tp.topic + "r" ? null : tp.topic + "r")}
                className="transition-opacity"
                style={{ opacity: pick && pick !== tp.topic + "r" ? 0.45 : 1 }}
              >
                <span className="font-mono text-[9.5px] uppercase tracking-[0.16em]" style={{ color: t.down }}>{tp.r.topic} · bear</span>
                <span className="mt-0.5 block font-display text-[16.5px] leading-snug" style={{ color: pick === tp.topic + "r" ? t.down : "#F0E9E1" }}>
                  {tp.r.claim}
                </span>
              </button>
            </div>
            {pick?.startsWith(tp.topic) && (
              <div className="grid gap-4 pb-4" style={{ gridTemplateColumns: "minmax(0,1fr) 178px minmax(0,1fr)" }}>
                <p className="text-right text-[12.5px] leading-relaxed" style={{ color: t.sub }}>{pick.endsWith("b") ? tp.b.ev : ""}</p>
                <div />
                <p className="text-[12.5px] leading-relaxed" style={{ color: t.sub }}>{pick.endsWith("r") ? tp.r.ev : ""}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap gap-x-8 gap-y-2">
        {[["Bull points", `${bw2()} · five arguments`], ["Bear points", `${rw2()} · five arguments`], ["Your net lean", `${net > 0 ? "+" : ""}${net}`]].map(([k, v]) => (
          <div key={k}>
            <Caps style={{ color: t.sub }}>{k}</Caps>
            <div className="tnum font-sans text-[17px] font-bold">{v}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
const bw2 = () => BULL.reduce((s, a) => s + a.weight, 0);
const rw2 = () => BEAR.reduce((s, a) => s + a.weight, 0);

/* ═══════════════════════ 11.c — BROADSHEET OP-ED ═══════════════════════ */
function P11C() {
  const t = TONES.sand;
  const [ballot, setBallot] = useState<Record<string, number>>({});
  const avg = (Object.values(ballot).reduce((a, b) => a + b, 0)) / (Object.keys(ballot).length || 1);

  return (
    <div>
      <div className="border-b-2 pb-3" style={{ borderColor: t.fg }}>
        <div className="font-mono text-[10px] uppercase tracking-[0.28em]" style={{ color: t.sub }}>
          Meridian Research · Contended · No. 47
        </div>
        <h3 className="mt-1 font-display text-[clamp(30px,4vw,46px)] leading-[1.02] tracking-tight">
          Halcyon Grid: four years of compounding, or three years of multiple?
        </h3>
        <p className="mt-2 font-display text-[17px] italic" style={{ color: "rgba(35,27,18,0.68)" }}>
          Two of our analysts put the case in writing and answer each other point by point.
        </p>
      </div>

      <div className="mt-6 grid gap-0 lg:grid-cols-2">
        {[
          { side: "FOR", arr: BULL, color: "#2E5E4A", by: "H. Marchetti, Director of Research" },
          { side: "AGAINST", arr: BEAR, color: "#8E1F2F", by: "P. Raghunathan, Senior Analyst" },
        ].map((c, ci) => (
          <div key={c.side} className={ci === 0 ? "pb-6 lg:pr-8" : "border-t pt-6 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0"} style={ci === 0 ? undefined : { borderColor: t.rule }}>
            <div className="flex items-baseline gap-3 border-b pb-2" style={{ borderColor: c.color }}>
              <span className="font-sans text-[20px] font-extrabold tracking-[0.06em]" style={{ color: c.color }}>{c.side}</span>
              <span className="font-mono text-[10px]" style={{ color: t.sub }}>{c.by}</span>
            </div>
            <div className="mt-4 columns-1 gap-7">
              {c.arr.map((a, i) => (
                <div key={a.topic} className="mb-5 break-inside-avoid">
                  <div className="flex items-baseline gap-2">
                    <span className="tnum font-sans text-[13px] font-extrabold" style={{ color: c.color }}>{i + 1}.</span>
                    <span className="font-mono text-[9.5px] uppercase tracking-[0.18em]" style={{ color: t.sub }}>{a.topic}</span>
                  </div>
                  <p className="mt-1 font-display text-[17px] leading-[1.42]">
                    <span className="font-medium">{a.claim}</span>{" "}
                    <span style={{ color: "rgba(35,27,18,0.72)" }}>{a.ev}</span>
                  </p>
                  <div className="mt-2 flex items-center gap-3">
                    <span className="font-mono text-[9.5px]" style={{ color: t.sub }}>{a.source}</span>
                    <span className="ml-auto flex gap-1">
                      {[1, 2, 3, 4, 5].map((n) => (
                        <button
                          key={n}
                          onClick={() => setBallot((p) => ({ ...p, [a.topic]: n }))}
                          className="h-[15px] w-[15px] font-mono text-[9px] leading-none transition-colors"
                          style={{
                            border: `1px solid ${t.rule}`,
                            background: (ballot[a.topic] ?? 0) >= n ? c.color : "transparent",
                            color: (ballot[a.topic] ?? 0) >= n ? "#E9DCC4" : t.sub,
                          }}
                          aria-label={`rate ${n}`}
                        >
                          {n}
                        </button>
                      ))}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 border-t-2 pt-4" style={{ borderColor: t.fg }}>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <Caps style={{ color: t.sub }}>Your reader's verdict</Caps>
            <div className="flex items-baseline gap-3">
              <span className="tnum font-sans text-[54px] font-extrabold leading-none tracking-tight" style={{ color: avg >= 3 ? "#2E5E4A" : avg > 0 ? "#D98324" : "#8E1F2F" }}>
                {Object.keys(ballot).length ? avg.toFixed(1) : "—"}
              </span>
              <span className="font-display text-[17px] italic" style={{ color: "rgba(35,27,18,0.7)" }}>
                {Object.keys(ballot).length
                  ? avg >= 3.5 ? "you side with the bulls" : avg >= 2.5 ? "you read it as finely balanced" : "you side with the bears"
                  : "rate each of the ten arguments to score this debate"}
              </span>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setBallot({})} className="px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em]" style={{ border: `1px solid ${t.fg}` }}>
              Clear ballot
            </button>
            <button className="px-4 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em]" style={{ background: t.fg, color: t.bg }}>
              Publish note
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function C11() {
  const nm = "Bull vs bear case";
  return (
    <>
      <Plate n={11} letter="a" name={nm} variant="Split ledger — ten weighed arguments, evidence on demand" tone="bone" caption="Symmetrical columns divided by a single rule. Each point carries a five-bar weight, opens to its evidence and source, and can be marked persuaded / doubt it / unheard; the header bar tallies the committee's overall lean.">
        <P11A />
      </Plate>
      <Plate n={11} letter="b" name={nm} variant="Topic debate — a slider for every disagreement" tone="ink" caption="Rather than two lists, five head-to-head questions with a lean control in the centre gutter. The net stance bar at the top and the verdict word update live; click either claim to open its evidence in place.">
        <P11B />
      </Plate>
      <Plate n={11} letter="c" name={nm} variant="Broadsheet op-ed — two signed columns and a reader ballot" tone="sand" caption="Set as a Contended column: display headline, two signed arguments in newsprint measure, numbered claims with source lines, and a five-square rating on each that scores the reader's own verdict at the foot.">
        <P11C />
      </Plate>
    </>
  );
}
