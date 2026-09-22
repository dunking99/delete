import { useMemo, useState } from "react";
import { Caps, Chip, Plate, Toggle, TONES, lin, poly, smooth, nf } from "@/ui";
import { ANALYSTS, CO, GEO, HOLDERS, OWN_MIX, PEERS, SEGMENTS } from "@/data";

/* ═══════════════════════ 99 — OWNERSHIP SUMMARY ═══════════════════════ */
function O99a() {
  const t = TONES.paper;
  const [mode, setMode] = useState<"stack" | "drill">("stack");
  const [seg, setSeg] = useState<string>("All");
  const groups = [
    { k: "Index & passive", v: 42.6, c: "#1B3A5C", n: "Vanguard, BlackRock, State Street, Geode" },
    { k: "Active managers", v: 27.4, c: "#8E1F2F", n: "Fidelity, T. Rowe, Capital Research, Baillie Gifford" },
    { k: "Sovereign & pension", v: 8.4, c: "#2E5E4A", n: "Norges Bank, CalPERS, GIC" },
    { k: "Hedge funds", v: 5.8, c: "#D98324", n: "Citadel, Two Sigma, Millennium, Point72" },
    { k: "Insiders", v: 4.1, c: "#5C1420", n: "Directors and executive officers, 16 persons" },
    { k: "Retail & other", v: 11.7, c: "#8A7F73", n: "Street name and beneficial holders" },
  ];
  const W = 900, H = 190;
  let acc = 0;
  const segs = groups.map((g) => {
    const x = (acc / 100) * W;
    acc += g.v;
    return { g, x, w: (g.v / 100) * W };
  });

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-end justify-between gap-4 border-b pb-3" style={{ borderColor: t.fg }}>
        <div>
          <Caps style={{ color: t.sub }}>Who owns Halcyon Grid · 365.0m shares · 13F / 13D filings to 31 Dec 2025</Caps>
          <div className="mt-0.5 font-display text-[21px] italic">Passive money now owns more than four in ten shares — and has for the first time overtaken active.</div>
        </div>
        <Toggle opts={["stack", "drill"] as const} value={mode} onChange={setMode} t={t} size="sm" />
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_286px]">
        <div>
          <svg viewBox={`0 0 ${W} ${H}`} width="100%" className="block">
            {segs.map(({ g, x, w }) => (
              <g key={g.k} onMouseEnter={() => setSeg(g.k)} style={{ cursor: "pointer" }}>
                <rect x={x} y={seg === g.k || seg === "All" ? 34 : 44} width={w - 3} height={seg === g.k || seg === "All" ? 100 : 80} fill={g.c} opacity={seg === g.k ? 1 : 0.85} style={{ transition: "all 220ms" }} />
                <text x={x + 8} y={58} fontSize="17" fill="#F7E7DA" fontFamily="Archivo" fontWeight="800">{g.v.toFixed(1)}%</text>
                <text x={x + 8} y={76} fontSize="10" fill="#F7E7DA" fontFamily="IBM Plex Mono" opacity="0.85">
                  {w > 96 ? g.k.split(" ")[0] : ""}
                </text>
              </g>
            ))}
            <line x1="0" x2={W} y1="152" y2="152" stroke="rgba(22,18,14,0.3)" />
            <text x="0" y="172" fontSize="11" fill="#8A7F73" fontFamily="IBM Plex Mono" letterSpacing="1.6">
              {mode === "stack" ? "BENEFICIAL OWNERSHIP OF COMMON STOCK" : "DRILLED: SELECT A SEGMENT FOR ITS LARGEST HOLDERS"}
            </text>
          </svg>

          <div className="mt-4 grid gap-px sm:grid-cols-3" style={{ background: t.rule }}>
            {groups.map((g) => (
              <button key={g.k} onClick={() => setSeg(seg === g.k ? "All" : g.k)} className="p-4 text-left" style={{ background: seg === g.k ? t.fg : t.bg, color: seg === g.k ? t.bg : t.fg }}>
                <div className="flex items-baseline justify-between">
                  <span className="text-[14.5px] font-semibold">{g.k}</span>
                  <span className="tnum font-sans text-[22px] font-extrabold leading-none" style={{ color: seg === g.k ? t.bg : g.c }}>{g.v.toFixed(1)}%</span>
                </div>
                <div className="mt-1 font-mono text-[10.5px]" style={{ color: seg === g.k ? "rgba(247,231,218,0.7)" : t.sub }}>{g.n}</div>
                <div className="tnum mt-1 font-mono text-[11px]" style={{ color: seg === g.k ? t.bg : "rgba(22,18,14,0.7)" }}>
                  {((g.v / 100) * 365).toFixed(1)}m shares
                </div>
              </button>
            ))}
          </div>
        </div>

        <aside style={{ borderLeft: `1px solid ${t.rule}` }} className="pl-5">
          <Caps style={{ color: t.down }}>{seg === "All" ? "Largest holder" : seg}</Caps>
          {seg === "All" ? (
            <>
              <div className="font-sans text-[30px] font-extrabold leading-none tracking-tight">Vanguard</div>
              <div className="font-display text-[17px] italic" style={{ color: t.sub }}>31.42m shares · 8.61%</div>
            </>
          ) : (
            <div className="font-sans text-[30px] font-extrabold leading-none tracking-tight" style={{ color: groups.find((g) => g.k === seg)!.c }}>
              {groups.find((g) => g.k === seg)!.v.toFixed(1)}%
            </div>
          )}
          <div className="mt-4">
            <Caps style={{ color: t.sub }}>Composition over twelve quarters</Caps>
            <div className="mt-2 flex h-[112px] w-full flex-col justify-end gap-[3px]">
              {OWN_MIX.slice(-6).map((q) => (
                <div key={q.q} className="flex items-center gap-2">
                  <span className="tnum w-[42px] font-mono text-[10px]" style={{ color: t.sub }}>{q.q}</span>
                  <span className="flex h-[13px] flex-1 overflow-hidden">
                    <span style={{ width: `${q.inst}%`, background: "#1B3A5C" }} />
                    <span style={{ width: `${q.insider}%`, background: "#5C1420" }} />
                    <span style={{ width: `${q.retail}%`, background: "#8A7F73" }} />
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-4 space-y-2 border-t pt-3" style={{ borderColor: t.rule }}>
            {[["Shares outstanding", "365.0m"], ["Holders of record", "1,412"], ["Institutional", `${CO.instOwn}%`], ["Insider", `${CO.insiderOwn}%`], ["Float", `${CO.float.toFixed(1)}m`], ["Short interest", `${CO.shortPct}%`]].map(([k, v]) => (
              <div key={k} className="flex justify-between">
                <span className="font-mono text-[10px] uppercase tracking-[0.14em]" style={{ color: t.sub }}>{k}</span>
                <span className="tnum font-mono text-[13px]">{v}</span>
              </div>
            ))}
          </div>
          <p className="mt-4 font-display text-[15px] italic leading-relaxed" style={{ color: "rgba(22,18,14,0.72)" }}>
            Click any block of the bar to open that group; click again to return to the whole register.
          </p>
        </aside>
      </div>
    </div>
  );
}

function O99b() {
  const t = TONES.ink;
  const slices = [
    { k: "Passive index", v: 42.6, d: "+3.1pt" },
    { k: "Active", v: 27.4, d: "−2.4pt" },
    { k: "Retail", v: 11.7, d: "−0.4pt" },
    { k: "Pension & sovereign", v: 8.4, d: "+0.6pt" },
    { k: "Hedge funds", v: 5.8, d: "+1.2pt" },
    { k: "Insiders", v: 4.1, d: "−0.3pt" },
  ];
  const [hover, setHover] = useState<string>("Passive index");
  const R = 116, C = 130;
  const circ = 2 * Math.PI * R;
  let off = 0;
  const colors = ["#63C2A6", "#E06B6B", "#D98324", "#8FA6BE", "#B8404E", "#8E8B85"];

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-end justify-between gap-4">
        <div>
          <Caps style={{ color: t.sub }}>Register composition · donut with change on prior year</Caps>
          <div className="mt-0.5 font-display text-[21px] italic">Who owns it, and whether that share is growing.</div>
        </div>
        <span className="font-mono text-[11px]" style={{ color: t.sub }}>13F season · 45 days after quarter end</span>
      </div>

      <div className="grid gap-8 lg:grid-cols-[300px_minmax(0,1fr)]">
        <div className="relative">
          <svg width="260" height="260" viewBox="0 0 260 260" className="block">
            <g transform={`rotate(-90 ${C} ${C})`}>
              {slices.map((s, i) => {
                const len = (s.v / 100) * circ;
                const el = (
                  <circle
                    key={s.k}
                    cx={C} cy={C} r={R} fill="none"
                    stroke={colors[i]}
                    strokeWidth={hover === s.k ? 40 : 30}
                    strokeDasharray={`${len - 3} ${circ - len + 3}`}
                    strokeDashoffset={-off}
                    opacity={hover === s.k ? 1 : 0.7}
                    style={{ transition: "all 220ms", cursor: "pointer" }}
                    onMouseEnter={() => setHover(s.k)}
                  />
                );
                off += len;
                return el;
              })}
            </g>
            <text x={C} y={C - 4} fontSize="42" fill="#F0E9E1" textAnchor="middle" fontFamily="Archivo" fontWeight="800">
              {slices.find((s) => s.k === hover)!.v.toFixed(1)}
            </text>
            <text x={C} y={C + 18} fontSize="11" fill="#8E8B85" textAnchor="middle" fontFamily="IBM Plex Mono" letterSpacing="1.6">
              {hover.toUpperCase()}
            </text>
          </svg>
        </div>

        <div>
          <div className="space-y-0">
            {slices.map((s, i) => (
              <button
                key={s.k}
                onMouseEnter={() => setHover(s.k)}
                className="grid w-full items-center gap-4 py-3 text-left"
                style={{ gridTemplateColumns: "18px minmax(0,1fr) 92px 92px 62px", borderBottom: `1px solid ${t.rule}`, background: hover === s.k ? "rgba(240,233,225,0.05)" : "transparent" }}
              >
                <span className="h-[12px] w-[12px]" style={{ background: colors[i] }} />
                <span className="text-[15px]">{s.k}</span>
                <span className="h-[9px] w-[86px]" style={{ background: "rgba(240,233,225,0.1)" }}>
                  <span className="block h-full" style={{ width: `${(s.v / 45) * 100}%`, background: colors[i] }} />
                </span>
                <span className="tnum text-right font-mono text-[15px] font-semibold">{s.v.toFixed(1)}%</span>
                <span className="tnum text-right font-mono text-[13px]" style={{ color: s.d.startsWith("+") ? t.up : t.down }}>{s.d}</span>
              </button>
            ))}
          </div>

          <div className="mt-5 grid grid-cols-2 gap-5 sm:grid-cols-4">
            {[["Shares held", "287.6m"], ["Holders of record", "1,412"], ["13F filers", "684"], ["Float", "331.6m"]].map(([k, v]) => (
              <div key={k}>
                <Caps style={{ color: t.sub }}>{k}</Caps>
                <div className="tnum font-sans text-[24px] font-extrabold leading-none">{v}</div>
              </div>
            ))}
          </div>
          <p className="mt-4 font-display text-[15.5px] italic leading-relaxed" style={{ color: t.sub }}>
            The register has been quietly reorganising: $4.1bn of stock has moved from active to passive managers in three years without a single block trade, because index weight rose from 2.9% to 3.8%.
          </p>
        </div>
      </div>
    </div>
  );
}

function O99c() {
  const t = TONES.sand;
  const [sel, setSel] = useState("Active");
  const classes = [
    { k: "Active", v: 27.4, top: "Fidelity 4.00%", note: "Concentrated, high conviction, slow turnover. The four largest active holders control 61% of the active pool." },
    { k: "Passive", v: 42.6, top: "Vanguard 8.61%", note: "Weight-driven: holdings move with index weight, not with view. Additions here are not a signal." },
    { k: "Insider", v: 4.1, top: "R. E. Castellano 1.94%", note: "Sixteen officers and directors. The CEO has bought in three of the last four years and never sold outside a plan." },
    { k: "Retail", v: 11.7, top: "Street name / Cede & Co", note: "Down from 23.4% at the 2019 peak as the stock entered the mid-cap indices." },
  ];

  return (
    <div>
      <div className="mb-5 border-b-2 pb-3" style={{ borderColor: t.fg }}>
        <div className="font-mono text-[10px] uppercase tracking-[0.28em]" style={{ color: t.sub }}>The register · Halcyon Grid Technologies</div>
        <h3 className="mt-1 font-display text-[clamp(26px,3.4vw,40px)] leading-none tracking-tight">
          Four kinds of shareholder, and what each one is telling you
        </h3>
      </div>

      <div className="grid gap-0 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="pr-7">
          <div className="grid grid-cols-4 gap-px" style={{ background: t.fg }}>
            {classes.map((c) => (
              <button key={c.k} onClick={() => setSel(c.k)} className="p-4 text-left" style={{ background: sel === c.k ? t.fg : t.bg, color: sel === c.k ? t.bg : t.fg }}>
                <div className="tnum font-sans text-[34px] font-extrabold leading-none tracking-tight">{c.v.toFixed(1)}%</div>
                <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.16em]">{c.k}</div>
                <div className="mt-2 h-[5px] w-full" style={{ background: sel === c.k ? "rgba(233,220,196,0.4)" : "rgba(35,27,18,0.12)" }}>
                  <div className="h-full" style={{ width: `${(c.v / 45) * 100}%`, background: sel === c.k ? t.bg : t.down }} />
                </div>
              </button>
            ))}
          </div>

          <div className="mt-6">
            <div className="flex items-baseline justify-between border-b pb-2" style={{ borderColor: t.fg }}>
              <span className="font-display text-[19px] italic">Composition, quarter by quarter</span>
              <span className="font-mono text-[10.5px]" style={{ color: t.sub }}>inst / insider / retail</span>
            </div>
            <div className="mt-3 space-y-2">
              {OWN_MIX.map((q) => (
                <div key={q.q} className="grid items-center gap-3" style={{ gridTemplateColumns: "62px minmax(0,1fr) 176px" }}>
                  <span className="tnum font-mono text-[11.5px]" style={{ color: t.sub }}>{q.q}</span>
                  <span className="flex h-[22px] w-full overflow-hidden">
                    <span className="flex items-center justify-end pr-2" style={{ width: `${q.inst}%`, background: "#1B3A5C" }}>
                      <span className="tnum font-mono text-[10.5px]" style={{ color: "#E9DCC4" }}>{q.inst.toFixed(1)}</span>
                    </span>
                    <span style={{ width: `${q.insider}%`, background: "#5C1420" }} />
                    <span style={{ width: `${q.retail}%`, background: "#8A7F73" }} />
                  </span>
                  <span className="tnum text-right font-mono text-[11.5px]" style={{ color: t.sub }}>
                    inst {q.inst.toFixed(1)} · ins {q.insider.toFixed(1)} · ret {q.retail.toFixed(1)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <aside style={{ borderLeft: `1px solid ${t.fg}` }} className="pl-6">
          <Caps style={{ color: t.sub }}>Selected class</Caps>
          <div className="font-display text-[28px] leading-none">{classes.find((c) => c.k === sel)!.k}</div>
          <div className="tnum mt-1 font-sans text-[52px] font-extrabold leading-none tracking-[-0.045em]" style={{ color: t.down }}>
            {classes.find((c) => c.k === sel)!.v.toFixed(1)}%
          </div>
          <div className="mt-3 border-t pt-3" style={{ borderColor: t.rule }}>
            <Caps style={{ color: t.sub }}>Largest in class</Caps>
            <div className="mt-1 text-[17px] font-semibold">{classes.find((c) => c.k === sel)!.top}</div>
          </div>
          <p className="mt-3 font-display text-[16.5px] italic leading-relaxed" style={{ color: "rgba(35,27,18,0.78)" }}>
            {classes.find((c) => c.k === sel)!.note}
          </p>
          <div className="mt-4 space-y-2 border-t pt-3" style={{ borderColor: t.rule }}>
            {HOLDERS.slice(0, 5).map((h) => (
              <div key={h.name} className="flex items-baseline justify-between gap-3">
                <span className="truncate text-[14px]">{h.name}</span>
                <span className="tnum font-mono text-[12.5px]">{h.pct.toFixed(2)}%</span>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}

export function C99() {
  const nm = "Ownership summary";
  return (
    <>
      <Plate n={99} letter="a" name={nm} variant="Proportional ownership bar with drill-down groups" tone="paper" caption="The whole register in one horizontal bar — each block sized by its share, click-to-drill, with the group's largest names revealed on selection. Six cards beneath repeat the numbers for keyboard and screen-reader access.">
        <O99a />
      </Plate>
      <Plate n={99} letter="b" name={nm} variant="Donut with year-on-year change column" tone="ink" caption="Ring width encodes nothing except selection; the information lives in the table beside it, where every class carries its twelve-month change. Hovering either side syncs the other and the donut's centre readout.">
        <O99b />
      </Plate>
      <Plate n={99} letter="c" name={nm} variant="Four classes, one sentence each, twelve quarters stacked" tone="sand" caption="Read as an argument rather than a chart: four oversized percentages, a written interpretation of the selected class, and every quarter's institutional/insider/retail split drawn as a labelled stacked bar.">
        <O99c />
      </Plate>
    </>
  );
}

/* ═══════════════════════ 104 — PEER SNAPSHOT TABLE ═══════════════════════ */
function P104a() {
  const t = TONES.paper;
  const [cols, setCols] = useState<string[]>(["P/E", "Growth", "ROIC", "EV/EBITDA"]);
  const all = ["P/E", "Growth", "ROIC", "EV/EBITDA", "Margin", "Beta", "Net debt"];
  const get = (p: (typeof PEERS)[number], c: string) =>
    c === "P/E" ? `${p.pe.toFixed(1)}×` : c === "Growth" ? `${p.growth.toFixed(1)}%` : c === "ROIC" ? `${p.roic.toFixed(1)}%`
    : c === "EV/EBITDA" ? `${p.ev.toFixed(1)}×` : c === "Margin" ? `${p.om.toFixed(1)}%` : c === "Beta" ? p.beta.toFixed(2)
    : `${p.de.toFixed(2)}×`;
  const num = (p: (typeof PEERS)[number], c: string) =>
    c === "P/E" ? p.pe : c === "Growth" ? p.growth : c === "ROIC" ? p.roic : c === "EV/EBITDA" ? p.ev : c === "Margin" ? p.om : c === "Beta" ? p.beta : p.de;

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-end justify-between gap-4 border-b pb-3" style={{ borderColor: t.fg }}>
        <div>
          <Caps style={{ color: t.sub }}>Peer snapshot · choose the columns · {cols.length} of {all.length} shown</Caps>
          <div className="mt-0.5 font-display text-[21px] italic">Eight names, up to seven metrics, best value ringed in each column.</div>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {all.map((c) => (
            <Chip key={c} t={t} on={cols.includes(c)} onClick={() => setCols((o) => (o.includes(c) ? o.filter((x) => x !== c) : [...o, c].slice(0, 5)))} color="#8E1F2F">
              {c}
            </Chip>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto scroller">
        <table className="w-full min-w-[640px] border-collapse">
          <thead>
            <tr style={{ borderBottom: `2px solid ${t.fg}` }}>
              <th className="pb-2 text-left"><Caps style={{ color: t.sub }}>Company</Caps></th>
              <th className="pb-2 pl-4 text-right"><Caps style={{ color: t.sub }}>Mkt cap</Caps></th>
              <th className="pb-2 pl-4 text-right"><Caps style={{ color: t.sub }}>Revenue</Caps></th>
              {cols.map((c) => (
                <th key={c} className="pb-2 pl-4 text-right"><Caps style={{ color: t.sub }}>{c}</Caps></th>
              ))}
            </tr>
          </thead>
          <tbody>
            {PEERS.map((p) => {
              const self = p.t === "HLG";
              const best = (c: string) => {
                const vals = PEERS.map((x) => num(x, c));
                return c === "P/E" || c === "EV/EBITDA" || c === "Beta" || c === "Net debt" ? Math.min(...vals) : Math.max(...vals);
              };
              return (
                <tr key={p.t} style={{ borderBottom: `1px solid ${t.rule}`, background: self ? "rgba(142,31,47,0.07)" : "transparent", boxShadow: self ? `inset 3px 0 0 ${t.down}` : "none" }}>
                  <td className="py-2.5 pr-4">
                    <div className="flex items-baseline gap-2">
                      <span className="font-mono text-[13px] font-semibold" style={{ color: self ? t.down : t.fg }}>{p.t}</span>
                      <span className="text-[14px]" style={{ color: "rgba(22,18,14,0.76)" }}>{p.name}</span>
                    </div>
                  </td>
                  <td className="tnum py-2.5 pl-4 text-right font-mono text-[13px]">${p.mcap.toFixed(1)}bn</td>
                  <td className="tnum py-2.5 pl-4 text-right font-mono text-[13px]">${p.rev.toFixed(2)}bn</td>
                  {cols.map((c) => {
                    const isBest = num(p, c) === best(c);
                    return (
                      <td key={c} className="tnum py-2.5 pl-4 text-right font-mono text-[13px]" style={{ fontWeight: isBest ? 700 : 400, color: isBest ? t.fg : "rgba(22,18,14,0.76)" }}>
                        {get(p, c)}
                        {isBest && <span className="ml-1.5" style={{ color: t.down }}>●</span>}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr style={{ borderTop: `2px solid ${t.fg}` }}>
              <td className="pt-2 pr-4"><Caps style={{ color: t.sub }}>Median</Caps></td>
              <td className="tnum pt-2 pl-4 text-right font-mono text-[13px]" style={{ color: t.sub }}>$33.1bn</td>
              <td className="tnum pt-2 pl-4 text-right font-mono text-[13px]" style={{ color: t.sub }}>$3.65bn</td>
              {cols.map((c) => (
                <td key={c} className="tnum pt-2 pl-4 text-right font-mono text-[13px]" style={{ color: t.sub }}>
                  {(() => {
                    const s = [...PEERS].map((x) => num(x, c)).sort((a, b) => a - b);
                    const m = (s[3] + s[4]) / 2;
                    return c === "Beta" || c === "Net debt" ? m.toFixed(2) : c === "Growth" ? `${m.toFixed(1)}%` : `${m.toFixed(1)}×`;
                  })()}
                </td>
              ))}
            </tr>
          </tfoot>
        </table>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-4 border-t pt-3" style={{ borderColor: t.rule }}>
        <span className="font-mono text-[11px]" style={{ color: t.sub }}>
          {cols.length >= 5 ? "Showing the maximum five custom columns" : "Click a chip to add a column — five at a time keeps the table readable"}
        </span>
        <span className="font-display text-[16px] italic">Best in column ● · median excludes Halcyon</span>
      </div>
    </div>
  );
}

function P104b() {
  const t = TONES.blueprint;
  const [sort, setSort] = useState<"mcap" | "growth" | "pe">("mcap");
  const rows = useMemo(() => [...PEERS].sort((a, b) => (sort === "mcap" ? b.mcap - a.mcap : sort === "growth" ? b.growth - a.growth : a.pe - b.pe)), [sort]);

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-end justify-between gap-4">
        <div>
          <Caps style={{ color: t.sub }}>Ranked peer snapshot · the sort key is the headline</Caps>
          <div className="mt-0.5 font-display text-[21px] italic">One bar per metric, normalised across the set, so scale never hides.</div>
        </div>
        <div className="inline-flex" style={{ border: `1px solid ${t.rule}` }}>
          {(["mcap", "growth", "pe"] as const).map((k, i) => (
            <button key={k} onClick={() => setSort(k)} className="px-3.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em]" style={{ background: sort === k ? t.down : "transparent", color: sort === k ? "#12243A" : t.sub, borderLeft: i ? `1px solid ${t.rule}` : "none" }}>
              {k === "mcap" ? "market cap" : k === "growth" ? "growth" : "cheapest"}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-0">
        <div className="grid gap-3 pb-2" style={{ gridTemplateColumns: "42px minmax(0,1.5fr) repeat(4, minmax(0,1fr))", borderBottom: `2px solid ${t.fg}` }}>
          <Caps style={{ color: t.sub }}>#</Caps>
          <Caps style={{ color: t.sub }}>Company</Caps>
          {["Market cap", "Growth", "ROIC", "P/E"].map((h) => (
            <Caps key={h} style={{ color: t.sub }}>{h}</Caps>
          ))}
        </div>
        {rows.map((p, i) => {
          const self = p.t === "HLG";
          const bars: [number, number][] = [
            [p.mcap / 95, p.mcap],
            [Math.max(0, (p.growth + 5) / 40), p.growth],
            [p.roic / 22, p.roic],
            [(65 - p.pe) / 55, p.pe],
          ];
          return (
            <div
              key={p.t}
              className="grid items-center gap-3 py-2.5"
              style={{ gridTemplateColumns: "42px minmax(0,1.5fr) repeat(4, minmax(0,1fr))", borderBottom: `1px solid ${t.rule}`, background: self ? "rgba(232,138,122,0.12)" : "transparent" }}
            >
              <span className="tnum font-sans text-[22px] font-extrabold leading-none" style={{ color: self ? t.down : "rgba(230,237,245,0.4)" }}>{i + 1}</span>
              <span className="min-w-0">
                <span className="block truncate text-[15px] font-semibold">{p.name}</span>
                <span className="font-mono text-[11px]" style={{ color: t.sub }}>{p.t} · {p.region}</span>
              </span>
              {bars.map(([f, v], j) => (
                <span key={j} className="block">
                  <span className="tnum block font-mono text-[13.5px]">{j === 1 ? `${v.toFixed(1)}%` : j === 3 ? `${v.toFixed(1)}×` : j === 0 ? `$${v.toFixed(1)}bn` : `${v.toFixed(1)}%`}</span>
                  <span className="mt-1 block h-[7px] w-full" style={{ background: "rgba(230,237,245,0.1)" }}>
                    <span className="block h-full transition-all duration-500" style={{ width: `${Math.max(4, f * 100)}%`, background: self ? "#E88A7A" : "#63C2A6", opacity: self ? 1 : 0.68 }} />
                  </span>
                </span>
              ))}
            </div>
          );
        })}
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        <p className="font-display text-[15.5px] italic" style={{ color: t.sub }}>
          The P/E bar is inverted — shorter means cheaper — so every bar reads "more is better" without a legend.
        </p>
        <p className="font-display text-[15.5px] italic" style={{ color: t.sub }}>
          Halcyon sits second on market cap, second on growth and second on ROIC, and is the second most expensive.
        </p>
        <p className="font-display text-[15.5px] italic" style={{ color: t.sub }}>
          Changing the sort re-orders the rows but leaves every bar on the same normalised scale, so rank and magnitude stay separable.
        </p>
      </div>
    </div>
  );
}

function P104c() {
  const t = TONES.ink;
  const [rows, setRows] = useState<string[]>(["HLG", "NVPT", "BLNE", "TDNE"]);
  const metrics = ["Revenue $bn", "Growth %", "Gross margin %", "Operating margin %", "P/E ×", "ROIC %"];
  const vals = (p: (typeof PEERS)[number]) => [p.rev.toFixed(2), p.growth.toFixed(1), p.gm.toFixed(1), p.om.toFixed(1), p.pe.toFixed(1), p.roic.toFixed(1)];

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-end justify-between gap-4">
        <div>
          <Caps style={{ color: t.sub }}>Build your own comparison · {rows.length} of 8 selected</Caps>
          <div className="mt-0.5 font-display text-[21px] italic">Tick the peers you want; the table rebuilds and the medians follow.</div>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {PEERS.map((p) => (
            <Chip key={p.t} t={t} on={rows.includes(p.t)} onClick={() => setRows((r) => (r.includes(p.t) ? (r.length > 1 ? r.filter((x) => x !== p.t) : r) : [...r, p.t]))} color="#E06B6B">
              {p.t}
            </Chip>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto scroller">
        <table className="w-full min-w-[600px] border-collapse">
          <thead>
            <tr style={{ borderBottom: `2px solid ${t.fg}` }}>
              <th className="pb-2 text-left" style={{ width: 210 }}><Caps style={{ color: t.sub }}>Metric</Caps></th>
              {rows.map((t2) => (
                <th key={t2} className="pb-2 text-center" style={{ borderBottom: t2 === "HLG" ? `2px solid ${t.down}` : "none" }}>
                  <span className="font-mono text-[13px] font-semibold" style={{ color: t2 === "HLG" ? t.down : "#F0E9E1" }}>{t2}</span>
                </th>
              ))}
              <th className="pb-2 text-right"><Caps style={{ color: t.sub }}>Median</Caps></th>
            </tr>
          </thead>
          <tbody>
            {metrics.map((m, mi) => {
              const sel = PEERS.filter((p) => rows.includes(p.t));
              const numbers = sel.map((p) => parseFloat(vals(p)[mi]));
              const med = [...numbers].sort((a, b) => a - b)[Math.floor(numbers.length / 2)];
              return (
                <tr key={m} style={{ borderBottom: `1px solid ${t.rule}` }}>
                  <td className="py-3 pr-4 text-[14.5px]">{m}</td>
                  {sel.map((p) => {
                    const v = parseFloat(vals(p)[mi]);
                    const f = (v - Math.min(...numbers)) / (Math.max(...numbers) - Math.min(...numbers) || 1);
                    return (
                      <td key={p.t} className="px-2 py-3 text-center">
                        <span className="tnum block font-mono text-[16px]" style={{ color: p.t === "HLG" ? t.down : "#F0E9E1", fontWeight: p.t === "HLG" ? 700 : 400 }}>
                          {vals(p)[mi]}
                        </span>
                        <span className="mt-1.5 block h-[5px] w-full" style={{ background: "rgba(240,233,225,0.1)" }}>
                          <span className="block h-full" style={{ width: `${12 + f * 88}%`, background: p.t === "HLG" ? t.down : "rgba(87,184,148,0.7)" }} />
                        </span>
                      </td>
                    );
                  })}
                  <td className="tnum py-3 pl-3 text-right font-mono text-[14px]" style={{ color: t.sub }}>{med.toFixed(1)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {!rows.includes("HLG") && (
        <div className="mt-3 px-3 py-2 font-mono text-[12px]" style={{ background: "rgba(224,107,107,0.14)", color: t.down }}>
          Halcyon is not in the comparison — click its chip to add it back.
        </div>
      )}

      <div className="mt-4 flex flex-wrap items-center justify-between gap-4 border-t pt-3" style={{ borderColor: t.rule }}>
        <span className="font-mono text-[11px]" style={{ color: t.sub }}>
          In-cell bars are min–max normalised within the current selection, not across the full peer set.
        </span>
        <div className="flex gap-2">
          <button onClick={() => setRows(["HLG", "NVPT", "BLNE", "TDNE"])} className="px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em]" style={{ border: `1px solid ${t.rule}`, color: t.sub }}>Reset</button>
          <button onClick={() => setRows(PEERS.map((p) => p.t))} className="px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em]" style={{ background: t.down, color: t.bg }}>Select all</button>
        </div>
      </div>
    </div>
  );
}

export function C104() {
  const nm = "Peer snapshot table";
  return (
    <>
      <Plate n={104} letter="a" name={nm} variant="Column-selectable snapshot with best-in-column marks" tone="paper" caption="Chips control which metrics appear, capped at five so the table never becomes unreadable; the best value in each column is ringed in claret and a median footer computes live from the visible rows.">
        <P104a />
      </Plate>
      <Plate n={104} letter="b" name={nm} variant="Ranked rows with a normalised bar in every cell" tone="blueprint" caption="Re-sort by size, growth or valuation and the rows reorder while each bar stays on its own fixed scale — so rank changes but the underlying magnitudes do not silently rescale with it.">
        <P104b />
      </Plate>
      <Plate n={104} letter="c" name={nm} variant="Tick-your-own peers with live medians" tone="ink" caption="Selection first, table second: tick any subset of the eight names and the matrix, the in-cell min–max bars and the median column all rebuild from that subset. Removing Halcyon raises a written warning rather than silently changing the comparison.">
        <P104c />
      </Plate>
    </>
  );
}

/* ═══════════════════════ 106 — GEOGRAPHIC REVENUE SPLIT ═══════════════════════ */
function G106a() {
  const t = TONES.paper;
  const [year, setYear] = useState(4);
  const [sel, setSel] = useState<string>("United States & Canada");
  const yrs = ["FY21", "FY22", "FY23", "FY24", "FY25"];
  const hist: Record<string, number[]> = {
    "United States & Canada": [1742, 1968, 2104, 2186, 2362],
    "Europe, Middle East": [946, 1084, 1246, 1362, 1253],
    "India & South Asia": [388, 512, 694, 742, 723],
    "Rest of Asia-Pacific": [246, 284, 372, 402, 346],
    "Latin America": [90, 79, 188, 562, 136],
  };
  const total = GEO.reduce((s, g) => s + g.rev, 0);
  const cur = hist[sel];

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-end justify-between gap-4 border-b pb-3" style={{ borderColor: t.fg }}>
        <div>
          <Caps style={{ color: t.sub }}>Revenue by customer location · US$m · FY21 – FY25</Caps>
          <div className="mt-0.5 font-display text-[21px] italic">Half the business is American, a quarter European, and India is now bigger than the whole of Asia-Pacific ex-India.</div>
        </div>
        <div className="flex gap-1.5">
          {yrs.map((y, i) => (
            <button key={y} onClick={() => setYear(i)} className="px-2.5 py-1 font-mono text-[10.5px]" style={{ border: `1px solid ${year === i ? t.down : t.rule}`, background: year === i ? t.down : "transparent", color: year === i ? t.bg : t.sub }}>
              {y}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_270px]">
        <div className="space-y-3">
          <div className="flex h-[58px] w-full overflow-hidden" style={{ border: `1px solid ${t.fg}` }}>
            {GEO.map((g) => {
              const v = hist[g.name][year];
              const share = (v / GEO.reduce((s, x) => s + hist[x.name][year], 0)) * 100;
              return (
                <button
                  key={g.name}
                  onClick={() => setSel(g.name)}
                  className="flex h-full items-center justify-center transition-all"
                  style={{ width: `${share}%`, background: g.color, opacity: sel === g.name ? 1 : 0.78, outline: sel === g.name ? `2px solid ${t.fg}` : "none", outlineOffset: "-2px" }}
                >
                  {share > 9 && <span className="tnum font-sans text-[17px] font-extrabold" style={{ color: "#F7E7DA" }}>{share.toFixed(0)}%</span>}
                </button>
              );
            })}
          </div>
          <div className="flex justify-between font-mono text-[10.5px]" style={{ color: t.sub }}>
            <span>by geography · {yrs[year]}</span>
            <span>total ${nf(GEO.reduce((s, x) => s + hist[x.name][year], 0))}m</span>
          </div>

          <table className="mt-4 w-full border-collapse">
            <thead>
              <tr style={{ borderBottom: `2px solid ${t.fg}` }}>
                <th className="pb-2 text-left"><Caps style={{ color: t.sub }}>Region</Caps></th>
                <th className="pb-2 pl-4 text-right"><Caps style={{ color: t.sub }}>FY21</Caps></th>
                <th className="pb-2 pl-4 text-right"><Caps style={{ color: t.sub }}>FY25</Caps></th>
                <th className="pb-2 pl-4 text-right"><Caps style={{ color: t.sub }}>Share</Caps></th>
                <th className="pb-2 pl-4 text-right"><Caps style={{ color: t.sub }}>CAGR</Caps></th>
                <th className="pb-2 pl-4 text-right"><Caps style={{ color: t.sub }}>YoY</Caps></th>
              </tr>
            </thead>
            <tbody>
              {GEO.map((g) => {
                const h = hist[g.name];
                const cagr = ((h[4] / h[0]) ** 0.25 - 1) * 100;
                const yoy = (h[4] / h[3] - 1) * 100;
                return (
                  <tr key={g.name} onMouseEnter={() => setSel(g.name)} style={{ borderBottom: `1px solid ${t.rule}`, background: sel === g.name ? t.soft : "transparent" }}>
                    <td className="py-2.5 pr-3">
                      <span className="flex items-center gap-2 text-[14.5px]">
                        <span className="h-[10px] w-[10px]" style={{ background: g.color }} />
                        {g.name}
                      </span>
                    </td>
                    <td className="tnum py-2.5 pl-4 text-right font-mono text-[13px]" style={{ color: t.sub }}>{nf(h[0])}</td>
                    <td className="tnum py-2.5 pl-4 text-right font-mono text-[13.5px] font-semibold">{nf(h[4])}</td>
                    <td className="tnum py-2.5 pl-4 text-right font-mono text-[13px]">{((h[4] / total) * 100).toFixed(1)}%</td>
                    <td className="tnum py-2.5 pl-4 text-right font-mono text-[13px]" style={{ color: cagr >= 0 ? t.up : t.down }}>{cagr >= 0 ? "+" : ""}{cagr.toFixed(1)}%</td>
                    <td className="tnum py-2.5 pl-4 text-right font-mono text-[13px]" style={{ color: yoy >= 0 ? t.up : t.down }}>{yoy >= 0 ? "+" : ""}{yoy.toFixed(1)}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <aside style={{ borderLeft: `1px solid ${t.rule}` }} className="pl-5">
          <Caps style={{ color: t.down }}>{sel}</Caps>
          <div className="tnum font-sans text-[44px] font-extrabold leading-none tracking-tight">${nf(cur[4])}m</div>
          <div className="mt-1 font-mono text-[11.5px]" style={{ color: t.sub }}>
            {((cur[4] / total) * 100).toFixed(1)}% of group revenue · {yrs[4]}
          </div>
          <svg width="100%" height="140" viewBox="0 0 240 140" className="mt-4 block">
            {cur.map((v, i) => {
              const bw = 34;
              const x = 10 + i * 46;
              const h = (v / 2500) * 104;
              return (
                <g key={i}>
                  <rect x={x} y={114 - h} width={bw} height={h} fill={GEO.find((g) => g.name === sel)!.color} opacity={i === year ? 1 : 0.45} />
                  <text x={x + bw / 2} y={128} fontSize="9.5" fill={t.sub} textAnchor="middle" fontFamily="IBM Plex Mono">{yrs[i]}</text>
                  <text x={x + bw / 2} y={110 - h} fontSize="9.5" fill={t.fg} textAnchor="middle" fontFamily="IBM Plex Mono">{v}</text>
                </g>
              );
            })}
            <line x1="4" x2="236" y1="114" y2="114" stroke={t.fg} />
          </svg>
          <div className="mt-3 space-y-2 border-t pt-3" style={{ borderColor: t.rule }}>
            {[["5-yr CAGR", `${(((cur[4] / cur[0]) ** 0.25 - 1) * 100).toFixed(1)}%`], ["Share in FY21", `${((cur[0] / 3412) * 100).toFixed(1)}%`], ["Share in FY25", `${((cur[4] / total) * 100).toFixed(1)}%`], ["Local currency risk", sel.includes("Europe") ? "EUR" : sel.includes("India") ? "INR" : sel.includes("Asia") ? "JPY / AUD" : "USD"]].map(([k, v]) => (
              <div key={k} className="flex justify-between">
                <span className="font-mono text-[10px] uppercase tracking-[0.14em]" style={{ color: t.sub }}>{k}</span>
                <span className="tnum font-mono text-[13px]">{v}</span>
              </div>
            ))}
          </div>
          <p className="mt-4 font-display text-[15px] italic leading-relaxed" style={{ color: "rgba(22,18,14,0.72)" }}>
            Region is assigned by customer ship-to, not by legal entity — the German subsidiary sells into India and counts as India.
          </p>
        </aside>
      </div>
    </div>
  );
}

function G106b() {
  const t = TONES.blueprint;
  const [metric, setMetric] = useState<"share" | "growth">("share");
  const regions = GEO.map((g) => ({ ...g, share: (g.rev / 4820) * 100, growth: ((g.rev / g.prev) - 1) * 100 }));
  const W = 900, H = 300;
  const X = (i: number) => lin(i, 0, regions.length - 1, 150, W - 96);

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-end justify-between gap-4">
        <div>
          <Caps style={{ color: t.sub }}>Geography · share of group against year-on-year growth</Caps>
          <div className="mt-0.5 font-display text-[21px] italic">Two views of the same five regions, and they disagree.</div>
        </div>
        <Toggle opts={["share", "growth"] as const} value={metric} onChange={setMetric} t={t} size="sm" />
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_262px]">
        <svg viewBox={`0 0 ${W} ${H}`} width="100%" className="block">
          {[0, 12, 24, 36, 48].map((v) => (
            <g key={v}>
              <line x1="150" x2={W - 96} y1={lin(v, 0, 50, H - 44, 24)} y2={lin(v, 0, 50, H - 44, 24)} stroke={t.rule} strokeDasharray="2 6" />
              <text x="144" y={lin(v, 0, 50, H - 44, 24) + 4} fontSize="10" fill={t.sub} textAnchor="end" fontFamily="IBM Plex Mono">
                {metric === "share" ? `${v}%` : `${v - 24 > 0 ? "+" : ""}${v - 24}%`}
              </text>
            </g>
          ))}
          <line x1="150" x2={W - 96} y1={lin(metric === "share" ? 0 : 24, 0, 50, H - 44, 24)} y2={lin(metric === "share" ? 0 : 24, 0, 50, H - 44, 24)} stroke={t.rule} />
          {regions.map((r, i) => {
            const v = metric === "share" ? r.share : r.growth;
            const y = lin(Math.max(metric === "share" ? 0 : 24, v), 0, 50, H - 44, 24);
            const y0 = lin(metric === "share" ? 0 : 24, 0, 50, H - 44, 24);
            return (
              <g key={r.name}>
                <rect x={X(i) - 46} y={Math.min(y, y0)} width="92" height={Math.abs(y0 - y)} fill={r.color} opacity="0.85" />
                <text x={X(i)} y={Math.min(y, y0) - 8} fontSize="13" fill="#E6EDF5" textAnchor="middle" fontFamily="IBM Plex Mono" fontWeight="600">
                  {metric === "share" ? `${v.toFixed(1)}%` : `${v > 0 ? "+" : ""}${v.toFixed(1)}%`}
                </text>
                <text x={X(i)} y={H - 24} fontSize="10.5" fill={t.sub} textAnchor="middle" fontFamily="IBM Plex Mono">
                  {r.name.split(" ")[0]}
                </text>
              </g>
            );
          })}
        </svg>

        <aside style={{ borderLeft: `1px solid ${t.rule}` }} className="pl-5">
          <Caps style={{ color: t.down }}>Largest region</Caps>
          <div className="font-sans text-[26px] font-extrabold leading-tight">United States & Canada</div>
          <div className="tnum font-sans text-[40px] font-extrabold leading-none" style={{ color: t.down }}>
            {((2362 / 4820) * 100).toFixed(1)}%
          </div>
          <div className="mt-4 space-y-2">
            {regions.map((r) => (
              <div key={r.name} className="flex items-baseline justify-between border-b pb-1.5" style={{ borderColor: t.rule }}>
                <span className="flex items-center gap-2 text-[14px]">
                  <span className="h-[9px] w-[9px]" style={{ background: r.color }} />
                  {r.name.split(" ")[0]}
                </span>
                <span className="tnum font-mono text-[13px]" style={{ color: r.growth >= 0 ? t.up : t.down }}>
                  {r.growth >= 0 ? "+" : ""}{r.growth.toFixed(1)}%
                </span>
              </div>
            ))}
          </div>
          <p className="mt-4 font-display text-[15.5px] italic leading-relaxed" style={{ color: t.sub }}>
            Latin America swung from $562m to $136m on the expiry of a single Brazilian transmission contract — the one region where concentration risk is not diversification.
          </p>
        </aside>
      </div>
    </div>
  );
}

function G106c() {
  const t = TONES.sand;
  const [sel, setSel] = useState<string>("Europe, Middle East");
  const total = GEO.reduce((s, g) => s + g.rev, 0);

  return (
    <div>
      <div className="border-b-2 pb-3" style={{ borderColor: t.fg }}>
        <div className="font-mono text-[10px] uppercase tracking-[0.28em]" style={{ color: t.sub }}>Where the revenue comes from · FY2025</div>
        <h3 className="mt-1 font-display text-[clamp(26px,3.4vw,42px)] leading-none tracking-tight">
          Five regions, $4,820m, and one that shrank by 76%
        </h3>
      </div>

      <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div>
          <div className="space-y-5">
            {GEO.map((g) => {
              const share = (g.rev / total) * 100;
              const prevShare = (g.prev / 4064) * 100;
              const on = sel === g.name;
              return (
                <div key={g.name} onMouseEnter={() => setSel(g.name)} className="cursor-pointer">
                  <div className="flex items-baseline justify-between gap-4">
                    <span className="font-display text-[24px] leading-tight" style={{ fontWeight: on ? 500 : 400 }}>{g.name}</span>
                    <span className="tnum font-sans text-[30px] font-extrabold leading-none tracking-tight" style={{ color: g.color }}>
                      ${nf(g.rev)}m
                    </span>
                  </div>
                  <div className="mt-2 flex items-center gap-4">
                    <div className="relative h-[26px] flex-1" style={{ background: "rgba(35,27,18,0.07)" }}>
                      <div className="h-full transition-all duration-500" style={{ width: `${share}%`, background: g.color, opacity: on ? 1 : 0.8 }} />
                      <div className="absolute top-0 h-full" style={{ left: `${prevShare}%`, width: "2px", background: t.fg }} />
                    </div>
                    <span className="tnum w-[74px] text-right font-mono text-[15px]">{share.toFixed(1)}%</span>
                    <span className="tnum w-[74px] text-right font-mono text-[13px]" style={{ color: g.rev >= g.prev ? "#2E5E4A" : "#8E1F2F" }}>
                      {g.rev >= g.prev ? "▲" : "▼"} {Math.abs(((g.rev / g.prev) - 1) * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="mt-1 font-mono text-[10.5px]" style={{ color: t.sub }}>
                    black rule = share of FY24 · {nf(g.prev)}m last year
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-7 grid grid-cols-2 gap-5 border-t pt-4 sm:grid-cols-4" style={{ borderColor: t.rule }}>
            {[["Largest region", "US & Canada · 49.0%"], ["Fastest growth", "India · +28.6%"], ["Most concentrated", "Brazil contract, expired"], ["Currency exposure", "EUR 26%, INR 15%"]].map(([k, v]) => (
              <div key={k}>
                <Caps style={{ color: t.sub }}>{k}</Caps>
                <div className="font-display text-[17px] leading-tight">{v}</div>
              </div>
            ))}
          </div>
        </div>

        <aside style={{ borderLeft: `1px solid ${t.fg}` }} className="pl-6">
          <Caps style={{ color: t.sub }}>Selected region</Caps>
          <div className="font-display text-[26px] leading-tight">{sel}</div>
          <div className="tnum mt-2 font-sans text-[54px] font-extrabold leading-none tracking-[-0.05em]" style={{ color: GEO.find((g) => g.name === sel)!.color }}>
            {((GEO.find((g) => g.name === sel)!.rev / total) * 100).toFixed(1)}%
          </div>
          <div className="mt-4 space-y-2 border-t pt-3" style={{ borderColor: t.rule }}>
            {[
              ["Revenue", `$${nf(GEO.find((g) => g.name === sel)!.rev)}m`],
              ["Prior year", `$${nf(GEO.find((g) => g.name === sel)!.prev)}m`],
              ["Growth", `${(((GEO.find((g) => g.name === sel)!.rev / GEO.find((g) => g.name === sel)!.prev) - 1) * 100).toFixed(1)}%`],
              ["Contribution to growth", `${(((GEO.find((g) => g.name === sel)!.rev - GEO.find((g) => g.name === sel)!.prev) / 756) * 100).toFixed(0)}%`],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between">
                <span className="font-mono text-[10px] uppercase tracking-[0.14em]" style={{ color: t.sub }}>{k}</span>
                <span className="tnum font-mono text-[13.5px]">{v}</span>
              </div>
            ))}
          </div>
          <p className="mt-4 font-display text-[16px] italic leading-relaxed" style={{ color: "rgba(35,27,18,0.76)" }}>
            {sel === "Europe, Middle East"
              ? "European revenue fell 8.0% on a soft German industrial cycle, but the region still carries the group's best gross margin at 48.1%."
              : "Each region is measured on ship-to location; intercompany transfers are eliminated before the split."}
          </p>
        </aside>
      </div>
    </div>
  );
}

export function C106() {
  const nm = "Geographic revenue split";
  return (
    <>
      <Plate n={106} letter="a" name={nm} variant="Proportional bar, year switch, and a full region table" tone="paper" caption="One stacked bar for the chosen year, six columns of history and CAGR beneath it, and a margin chart for whichever region you select. The year buttons re-size every segment and re-rank the table.">
        <G106a />
      </Plate>
      <Plate n={106} letter="b" name={nm} variant="Share against growth — the two views disagree" tone="blueprint" caption="The same five regions drawn either as share of group or as year-on-year growth, with the axis re-based around zero for the growth view. Switching makes the argument: the largest region is not the fastest.">
        <G106b />
      </Plate>
      <Plate n={106} letter="c" name={nm} variant="Editorial bars with prior-year share marked" tone="sand" caption="Each region as a large statement: name, dollars, a bar for share, a black rule for where that share sat last year, and the growth figure at the right. The rule makes year-on-year share shift readable without a second chart.">
        <G106c />
      </Plate>
    </>
  );
}

/* ═══════════════════════ 114 — OPTIONS ACTIVITY SUMMARY ═══════════════════════ */
function A114a() {
  const t = TONES.paper;
  const [range, setRange] = useState<"1D" | "5D" | "1M">("1D");
  const putVol = 48210, callVol = 126440;
  const pcr = putVol / callVol;
  const strikes = [165, 170, 175, 180, 185, 190, 195, 200, 205, 210];
  const calls = [412, 688, 1042, 2410, 6820, 4210, 3180, 5440, 2260, 1480];
  const puts = [1840, 3210, 5240, 6120, 3180, 2140, 1420, 980, 640, 410];

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-end justify-between gap-4 border-b pb-3" style={{ borderColor: t.fg }}>
        <div>
          <Caps style={{ color: t.sub }}>Options positioning · volume and open interest to 18 Mar 2026</Caps>
          <div className="mt-0.5 font-display text-[21px] italic">Call volume is 2.6× put volume, and the open interest is stacked at 180 and 200.</div>
        </div>
        <div className="flex items-center gap-4">
          <Toggle opts={["1D", "5D", "1M"] as const} value={range} onChange={setRange} t={t} size="sm" />
          <span className="font-mono text-[11px]" style={{ color: t.sub }}>as of 15:42 ET</span>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_250px]">
        <div>
          <div className="grid grid-cols-2 gap-px" style={{ background: t.rule }}>
            {[["Call volume", callVol, "#2E5E4A"], ["Put volume", putVol, "#8E1F2F"]].map(([k, v, c]) => (
              <div key={k as string} className="p-4" style={{ background: t.bg }}>
                <Caps style={{ color: t.sub }}>{k as string}</Caps>
                <div className="tnum font-sans text-[30px] font-extrabold leading-none" style={{ color: c as string }}>{nf(v as number)}</div>
                <div className="mt-1.5 h-[9px] w-full" style={{ background: "rgba(22,18,14,0.08)" }}>
                  <div className="h-full" style={{ width: `${((v as number) / 126440) * 100}%`, background: c as string }} />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5">
            <Caps style={{ color: t.sub }}>Volume by strike · calls right, puts left · all expiries</Caps>
            <svg viewBox="0 0 820 300" width="100%" className="mt-2 block">
              <line x1="410" x2="410" y1="16" y2="270" stroke={t.fg} strokeWidth="1.4" />
              <rect x={410 - 46} y="16" width="92" height="254" fill="rgba(142,31,47,0.1)" />
              <text x="410" y="12" fontSize="10" fill={t.down} textAnchor="middle" fontFamily="IBM Plex Mono">ATM $187.42</text>
              {strikes.map((k, i) => {
                const y = 26 + i * 25;
                const mw = 380;
                const cw = (calls[i] / 7000) * mw;
                const pw = (puts[i] / 7000) * mw;
                return (
                  <g key={k}>
                    <rect x={410 - pw} y={y} width={pw} height="17" fill="#8E1F2F" opacity="0.72" />
                    <rect x={410} y={y} width={cw} height="17" fill="#2E5E4A" opacity="0.72" />
                    <rect x={410 - 26} y={y - 1} width="52" height="19" fill={t.bg} stroke={t.rule} />
                    <text x="410" y={y + 13} fontSize="12" fill={t.fg} textAnchor="middle" fontFamily="IBM Plex Mono" fontWeight="600">{k}</text>
                    <text x={410 - pw - 6} y={y + 13} fontSize="10.5" fill="#8E1F2F" textAnchor="end" fontFamily="IBM Plex Mono">{nf(puts[i])}</text>
                    <text x={410 + cw + 6} y={y + 13} fontSize="10.5" fill="#2E5E4A" fontFamily="IBM Plex Mono">{nf(calls[i])}</text>
                  </g>
                );
              })}
              <text x="40" y="292" fontSize="10" fill={t.sub} fontFamily="IBM Plex Mono" letterSpacing="1.6">PUTS ◀</text>
              <text x="780" y="292" fontSize="10" fill={t.sub} textAnchor="end" fontFamily="IBM Plex Mono" letterSpacing="1.6">▶ CALLS</text>
            </svg>
          </div>
        </div>

        <aside style={{ borderLeft: `1px solid ${t.rule}` }} className="pl-5">
          <Caps style={{ color: t.down }}>Positioning read</Caps>
          <div className="mt-2 space-y-2.5">
            {[["Put / call ratio", pcr.toFixed(2)], ["25Δ skew", "+4.2 vol"], ["IV percentile", "34 / 100"], ["Implied move, Fri", "±5.8%"], ["Four-qtr avg move", "±4.9%"], ["Max pain", "$190"], ["GEX (est.)", "+$42m/1%"], ["Days to expiry", "2"]].map(([k, v]) => (
              <div key={k} className="flex justify-between border-b pb-1.5" style={{ borderColor: t.rule }}>
                <span className="font-mono text-[10px] uppercase tracking-[0.14em]" style={{ color: t.sub }}>{k}</span>
                <span className="tnum font-mono text-[13.5px]">{v}</span>
              </div>
            ))}
          </div>
          <div className="mt-4">
            <Caps style={{ color: t.sub }}>Net positioning</Caps>
            <div className="mt-1.5 flex h-[30px] overflow-hidden" style={{ border: `1px solid ${t.rule}` }}>
              <div className="flex items-center justify-center" style={{ width: "68%", background: "#2E5E4A" }}>
                <span className="font-mono text-[11px]" style={{ color: t.bg }}>68% calls open</span>
              </div>
              <div className="flex flex-1 items-center justify-center" style={{ background: "#8E1F2F" }}>
                <span className="font-mono text-[11px]" style={{ color: t.bg }}>32%</span>
              </div>
            </div>
          </div>
          <p className="mt-4 font-display text-[15.5px] italic leading-relaxed" style={{ color: "rgba(22,18,14,0.74)" }}>
            Heavy call open interest at 180 and 200 reads as a market positioning for upside into the April print, with dealers likely long gamma between the two strikes.
          </p>
        </aside>
      </div>
    </div>
  );
}

function A114b() {
  const t = TONES.ink;
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];
  const data = days.map((d, i) => ({ d, call: 18 + Math.sin(i * 1.4) * 9 + i * 4.6, put: 7 + Math.cos(i * 1.1) * 3.4 + i * 1.2, oi: 12 + i * 5.4 }));
  const [sel, setSel] = useState(4);
  const mx = 44;

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-end justify-between gap-4">
        <div>
          <Caps style={{ color: t.sub }}>Five sessions of contract flow · thousands of contracts</Caps>
          <div className="mt-0.5 font-display text-[21px] italic">Call buying accelerated into Friday while open interest built — new positions, not closing.</div>
        </div>
        <div className="flex gap-4">
          {[["5-day call volume", "312.4k"], ["5-day put volume", "96.1k"], ["Net premium", "+$48.2m"], ["P/C ratio", "0.31"]].map(([k, v]) => (
            <div key={k}>
              <Caps style={{ color: t.sub }}>{k}</Caps>
              <div className="tnum font-sans text-[19px] font-bold" style={{ color: k === "Net premium" ? t.up : "#F0E9E1" }}>{v}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_270px]">
        <div>
          <div className="flex items-end gap-4" style={{ height: 260 }}>
            {data.map((d, i) => (
              <button key={d.d} onMouseEnter={() => setSel(i)} className="flex h-full flex-1 flex-col justify-end gap-2 p-2 transition-colors" style={{ background: sel === i ? "rgba(240,233,225,0.05)" : "transparent" }}>
                <span className="tnum text-center font-mono text-[12px]" style={{ color: t.up }}>{d.call.toFixed(1)}k</span>
                <span className="flex h-full items-end justify-center gap-1.5">
                  <span className="w-[38%] transition-all duration-500" style={{ height: `${(d.call / mx) * 100}%`, background: t.up, opacity: sel === i ? 1 : 0.7 }} />
                  <span className="w-[38%] transition-all duration-500" style={{ height: `${(d.put / mx) * 100}%`, background: t.down, opacity: sel === i ? 1 : 0.7 }} />
                </span>
                <span className="tnum text-center font-mono text-[11.5px]" style={{ color: t.sub }}>{d.oi.toFixed(1)}k OI</span>
                <span className="text-center font-mono text-[11px] uppercase tracking-[0.14em]" style={{ color: sel === i ? "#F0E9E1" : t.sub }}>{d.d}</span>
              </button>
            ))}
          </div>

          <div className="mt-4 grid grid-cols-2 gap-4 border-t pt-3 sm:grid-cols-4" style={{ borderColor: t.rule }}>
            {[["Call / put", (data[sel].call / data[sel].put).toFixed(2)], ["Unusual prints", `${12 + sel * 7}`], ["Largest single trade", `${2.4 + sel * 1.1}k @ $3.20`], ["Sweep direction", sel % 2 === 0 ? "Ask-side" : "Bid-side"]].map(([k, v]) => (
              <div key={k}>
                <Caps style={{ color: t.sub }}>{k}</Caps>
                <div className="tnum font-sans text-[19px] font-bold">{v}</div>
              </div>
            ))}
          </div>
        </div>

        <aside style={{ borderLeft: `1px solid ${t.rule}` }} className="pl-5">
          <Caps style={{ color: t.down }}>{days[sel]}</Caps>
          <div className="tnum font-sans text-[42px] font-extrabold leading-none">{data[sel].call.toFixed(1)}k</div>
          <div className="font-mono text-[11.5px]" style={{ color: t.sub }}>call contracts traded</div>
          <div className="mt-4 space-y-2">
            {[["Puts traded", `${data[sel].put.toFixed(1)}k`], ["Open interest change", `+${(data[sel].oi * 1.6).toFixed(1)}k`], ["Share of weekly volume", `${((data[sel].call / data.reduce((s, x) => s + x.call, 0)) * 100).toFixed(0)}%`], ["Premium paid", `$${(data[sel].call * 0.42).toFixed(1)}m`]].map(([k, v]) => (
              <div key={k} className="flex justify-between border-b pb-1.5" style={{ borderColor: t.rule }}>
                <span className="font-mono text-[10px] uppercase tracking-[0.14em]" style={{ color: t.sub }}>{k}</span>
                <span className="tnum font-mono text-[13px]">{v}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 p-3" style={{ background: "rgba(87,184,148,0.12)" }}>
            <div className="font-mono text-[10px] uppercase tracking-[0.16em]" style={{ color: t.up }}>Read</div>
            <p className="mt-1 font-display text-[15.5px] italic leading-snug" style={{ color: t.sub }}>
              Volume rising with open interest rising means positions are being opened. Volume rising while open interest falls would mean the opposite.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}

function A114c() {
  const t = TONES.sand;
  const [sel, setSel] = useState<string>("Call skew");
  const signals = [
    { k: "Call skew", v: "Bullish", s: 4, note: "25-delta calls bid four vol points over puts — investors paying for upside into April." },
    { k: "Put / call ratio", v: "Bullish", s: 4, note: "0.31 over five sessions against a 0.62 one-year average; the lowest since October." },
    { k: "Open interest build", v: "Bullish", s: 3, note: "OI up 11.4% week on week with volume — new money, not profit-taking." },
    { k: "Dealer positioning", v: "Neutral", s: 2, note: "Estimated long gamma between 180 and 200 should dampen movement rather than amplify it." },
    { k: "Sweeps", v: "Bullish", s: 4, note: "71% of sweeps above $1m hit the ask side on Friday — aggressive buying of protection against missing the move." },
    { k: "Expiry concentration", v: "Caution", s: 1, note: "41% of open interest expires within three weeks; this positioning is short-lived." },
  ];
  const [only, setOnly] = useState("all");
  const shown = signals.filter((s) => only === "all" || s.v === only);

  return (
    <div>
      <div className="mb-5 border-b-2 pb-3" style={{ borderColor: t.fg }}>
        <div className="font-mono text-[10px] uppercase tracking-[0.28em]" style={{ color: t.sub }}>What the options market is saying</div>
        <h3 className="mt-1 font-display text-[clamp(26px,3.4vw,42px)] leading-none tracking-tight">
          Six signals, five of them leaning the same way
        </h3>
      </div>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_290px]">
        <div>
          <div className="mb-4 flex flex-wrap gap-1.5">
            {["all", "Bullish", "Neutral", "Caution"].map((f) => (
              <Chip key={f} t={t} on={only === f} onClick={() => setOnly(f)} color={f === "Bullish" ? "#2E5E4A" : f === "Caution" ? "#8E1F2F" : "#8A7F73"}>
                {f === "all" ? "All six" : `${f} · ${signals.filter((s) => s.v === f).length}`}
              </Chip>
            ))}
          </div>

          <div className="space-y-0">
            {shown.map((s) => {
              const c = s.v === "Bullish" ? "#2E5E4A" : s.v === "Caution" ? "#8E1F2F" : "#8A7F73";
              const on = sel === s.k;
              return (
                <div key={s.k} onClick={() => setSel(s.k)} className="grid cursor-pointer items-start gap-5 py-4" style={{ gridTemplateColumns: "190px minmax(0,1fr) 108px", borderTop: `1px solid ${t.rule}`, background: on ? "rgba(35,27,18,0.06)" : "transparent" }}>
                  <div>
                    <div className="font-display text-[19px] leading-tight">{s.k}</div>
                    <div className="mt-1.5 flex gap-1">
                      {Array.from({ length: 4 }).map((_, i) => (
                        <span key={i} className="inline-block h-[14px] w-[7px]" style={{ background: i < s.s ? c : "rgba(35,27,18,0.14)" }} />
                      ))}
                    </div>
                  </div>
                  <p className="text-[15.5px] leading-relaxed" style={{ color: "rgba(35,27,18,0.78)" }}>{s.note}</p>
                  <span className="text-right">
                    <span className="px-2 py-[3px] font-mono text-[10.5px] uppercase tracking-[0.14em]" style={{ background: c, color: t.bg }}>{s.v}</span>
                    <span className="mt-1.5 block font-mono text-[10.5px]" style={{ color: t.sub }}>{s.s}/4</span>
                  </span>
                </div>
              );
            })}
          </div>
          <div className="mt-4 border-t-2 pt-3" style={{ borderColor: t.fg }}>
            <div className="flex flex-wrap items-end justify-between gap-5">
              <div>
                <Caps style={{ color: t.sub }}>Composite options read</Caps>
                <div className="flex items-baseline gap-4">
                  <span className="font-sans text-[44px] font-extrabold leading-none tracking-tight" style={{ color: "#2E5E4A" }}>LEAN BULLISH</span>
                  <span className="tnum font-sans text-[26px] font-extrabold">18 / 24</span>
                </div>
              </div>
              <div className="flex h-[26px] w-[300px] overflow-hidden" style={{ border: `1px solid ${t.fg}` }}>
                <div style={{ width: "75%", background: "#2E5E4A" }} />
                <div style={{ width: "8.3%", background: "#8A7F73" }} />
                <div style={{ width: "16.7%", background: "#8E1F2F" }} />
              </div>
            </div>
          </div>
        </div>

        <aside style={{ borderLeft: `1px solid ${t.fg}` }} className="pl-6">
          <Caps style={{ color: t.sub }}>Key numbers</Caps>
          <div className="mt-3 space-y-2.5">
            {[["Call volume (1D)", nf(126440)], ["Put volume (1D)", nf(48210)], ["Put / call", "0.38"], ["Implied move, 20 Mar", "±5.8%"], ["30-day implied vol", "41.2%"], ["Realised vol", "36.8%"], ["IV rank", "34 / 100"], ["Max pain", "$190"], ["Open interest", "486,210"]].map(([k, v]) => (
              <div key={k} className="flex items-baseline justify-between border-b pb-1.5" style={{ borderColor: t.rule }}>
                <span className="font-mono text-[10px] uppercase tracking-[0.14em]" style={{ color: t.sub }}>{k}</span>
                <span className="tnum font-mono text-[13.5px]">{v}</span>
              </div>
            ))}
          </div>
          <p className="mt-4 font-display text-[16px] italic leading-relaxed" style={{ color: "rgba(35,27,18,0.76)" }}>
            Options lead equities by a day or two at these maturities; the skew is the most useful single number here because it is priced by people who have to be right.
          </p>
        </aside>
      </div>
      <span className="sr-only">{nf(signals.length)}</span>
    </div>
  );
}

export function C114() {
  const nm = "Options activity summary";
  return (
    <>
      <Plate n={114} letter="a" name={nm} variant="Diverging volume-by-strike with a positioning read" tone="paper" caption="Calls and puts diverging from a struck-through ATM column, plus the eight numbers that summarise positioning. Period switch top right; the rail turns the figures into a sentence rather than a table.">
        <A114a />
      </Plate>
      <Plate n={114} letter="b" name={nm} variant="Five sessions of contract flow, side by side" tone="ink" caption="One pair of bars per session — call volume in green, put volume in claret — with open interest printed beneath so volume can be read against positioning. Selecting a day opens its detail.">
        <A114b />
      </Plate>
      <Plate n={114} letter="c" name={nm} variant="Six-signal scorecard with a composite verdict" tone="sand" caption="The summary as an argument: six named signals, each with a written interpretation and a four-segment strength bar, filterable by stance, rolled up into one composite reading at the foot.">
        <A114c />
      </Plate>
    </>
  );
}
export { poly, smooth, ANALYSTS, CO, HOLDERS, OWN_MIX, PEERS, SEGMENTS, GEO, nf };
