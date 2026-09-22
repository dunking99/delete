import { useMemo, useState } from "react";
import { Caps, Chip, Plate, Toggle, TONES, lin, poly, nf } from "@/ui";
import { CO } from "@/data";

/* ═══════════════════════ shared catalyst data for plate 62 ═══════════════════════ */
type Cat = { d: string; day: number; t: string; k: string; impact: number; prob: number; note: string };
const CAT_C: Record<string, string> = { Earnings: "#8E1F2F", Macro: "#1B3A5C", Company: "#2E5E4A", Policy: "#D98324", Lockup: "#8A7F73" };
const CATS: Cat[] = [
  { d: "20 Mar", day: 2, t: "Quad-witching / March expiry", k: "Macro", impact: 2.1, prob: 1, note: "Quarterly options and futures expiry; roughly $1.4bn of HLG notional rolls." },
  { d: "27 Mar", day: 9, t: "DEF 14A filed", k: "Company", impact: 0.6, prob: 1, note: "Proxy for the 2026 annual meeting. Watch say-on-pay after last year's 78.4% support." },
  { d: "02 Apr", day: 15, t: "March PMI / ISM services", k: "Macro", impact: 1.4, prob: 1, note: "Industrial new orders component has led HLG orders by roughly one quarter." },
  { d: "09 Apr", day: 22, t: "Section 232 tariff determination", k: "Policy", impact: 4.8, prob: 0.7, note: "Commerce decision on electrical equipment imports; management has guided 150bp of gross-margin headwind." },
  { d: "23 Apr", day: 35, t: "Q1 2026 earnings", k: "Earnings", impact: 6.2, prob: 1, note: "Consensus $1.99bn revenue, $0.44 EPS. Options imply a ±5.8% move versus a 4.9% four-quarter average." },
  { d: "24 Apr", day: 36, t: "Analyst day / capital allocation update", k: "Company", impact: 3.4, prob: 0.8, note: "First update since the H-Series launch; a buyback authorisation increase is widely expected." },
  { d: "15 May", day: 58, t: "Arden Supply renewal window opens", k: "Company", impact: 5.1, prob: 0.4, note: "The $1.1bn, five-year contract expires Q3 2026; renewal terms likely disclosed in May." },
  { d: "01 Jun", day: 75, t: "Ohio phase-two commissioning", k: "Company", impact: 2.6, prob: 0.9, note: "Adds 34% to group capacity; capex completes and free cash flow inflects from Q3." },
  { d: "18 Jun", day: 92, t: "FOMC decision", k: "Macro", impact: 2.9, prob: 1, note: "Sector trades on the long end; a 25bp cut has historically added 1.8% to the group." },
  { d: "30 Jun", day: 104, t: "Index reconstitution (mid-cap)", k: "Lockup", impact: 3.7, prob: 0.6, note: "Eligible for Russell 2000 → 1000 reconstitution; an estimated $310m of index demand." },
];

/* ═══════════════════════ 62.a — 90-DAY CALENDAR ═══════════════════════ */
function A() {
  const t = TONES.paper;
  const [sel, setSel] = useState<Cat>(CATS[4]);
  const [kinds, setKinds] = useState<string[]>(Object.keys(CAT_C));
  const weeks = 16;
  const start = 18; // 18 Mar 2026
  const cellW = 52, cellH = 46;
  const wd = ["M", "T", "W", "T", "F"];
  const monthOf = (day: number) => {
    const d = new Date(2026, 2, start + day);
    return d.toLocaleDateString("en-GB", { month: "short" });
  };

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-end justify-between gap-4 border-b pb-3" style={{ borderColor: t.fg }}>
        <div>
          <Caps style={{ color: t.sub }}>Next 105 trading days · Halcyon Grid Technologies</Caps>
          <div className="mt-0.5 font-display text-[21px] italic">Ten scheduled events, $4.60 of expected movement, one of them this week.</div>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {Object.keys(CAT_C).map((k) => (
            <Chip key={k} t={t} on={kinds.includes(k)} onClick={() => setKinds((o) => (o.includes(k) ? o.filter((x) => x !== k) : [...o, k]))} color={CAT_C[k]}>
              {k}
            </Chip>
          ))}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_270px]">
        <div className="overflow-x-auto scroller">
          <div style={{ minWidth: weeks * cellW + 70 }}>
            <div className="mb-1 flex" style={{ paddingLeft: 66 }}>
              {Array.from({ length: weeks }).map((_, w) => {
                const day = w * 5;
                const m = w === 0 || monthOf(w * 5) !== monthOf((w - 1) * 5 + 4);
                return (
                  <div key={w} className="shrink-0 text-center" style={{ width: cellW }}>
                    <span className="font-mono text-[9.5px] uppercase tracking-[0.14em]" style={{ color: m ? t.fg : "transparent" }}>{monthOf(day)}</span>
                  </div>
                );
              })}
            </div>
            <div className="flex">
              <div className="shrink-0" style={{ width: 62 }}>
                {wd.map((d, i) => (
                  <div key={i} className="flex items-center justify-end pr-2 font-mono text-[10px]" style={{ height: cellH, color: t.sub }}>{d}</div>
                ))}
              </div>
              <div className="relative shrink-0" style={{ width: weeks * cellW, height: cellH * 5, border: `1px solid ${t.rule}` }}>
                {Array.from({ length: weeks }).map((_, w) =>
                  Array.from({ length: 5 }).map((_, d) => {
                    const day = w * 5 + d;
                    const ev = CATS.find((c) => c.day === day && kinds.includes(c.k));
                    const weekend = false;
                    const on = ev && sel.d === ev.d;
                    return (
                      <div
                        key={`${w}-${d}`}
                        onClick={() => ev && setSel(ev)}
                        className="absolute flex flex-col items-center justify-center transition-colors"
                        style={{
                          left: w * cellW, top: d * cellH, width: cellW, height: cellH,
                          borderRight: `1px solid ${t.rule}`, borderBottom: `1px solid ${t.rule}`,
                          background: on ? "rgba(142,31,47,0.12)" : weekend ? "rgba(22,18,14,0.03)" : "transparent",
                          cursor: ev ? "pointer" : "default",
                        }}
                      >
                        <span className="font-mono text-[9.5px]" style={{ color: ev ? t.fg : "rgba(22,18,14,0.3)" }}>
                          {new Date(2026, 2, start + day).getDate()}
                        </span>
                        {ev && (
                          <span
                            className="mt-0.5 transition-all"
                            style={{
                              width: 6 + ev.impact * 3, height: 6 + ev.impact * 3,
                              borderRadius: "50%", background: CAT_C[ev.k],
                              outline: on ? `2px solid ${t.fg}` : "none", outlineOffset: 1,
                            }}
                          />
                        )}
                      </div>
                    );
                  }),
                )}
              </div>
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-4 font-mono text-[10px]" style={{ color: t.sub }}>
              <span>circle size = expected move</span>
              {Object.entries(CAT_C).map(([k, c]) => (
                <span key={k} className="flex items-center gap-1.5"><span className="inline-block h-[9px] w-[9px] rounded-full" style={{ background: c }} />{k}</span>
              ))}
              <span className="ml-auto">today · {new Date(2026, 2, 18).toDateString().slice(4, 10)} 2026</span>
            </div>
          </div>
        </div>

        <aside style={{ borderLeft: `1px solid ${t.rule}` }} className="pl-5">
          <Caps style={{ color: CAT_C[sel.k] }}>{sel.k} · {sel.d} 2026</Caps>
          <div className="mt-1 font-display text-[22px] leading-tight">{sel.t}</div>
          <p className="mt-2 font-display text-[15.5px] italic leading-relaxed" style={{ color: "rgba(22,18,14,0.75)" }}>{sel.note}</p>
          <div className="mt-4 space-y-2 border-t pt-3" style={{ borderColor: t.rule }}>
            {[
              ["Days until", `${sel.day}`],
              ["Expected move", `±${sel.impact.toFixed(1)}%`],
              ["Probability", `${(sel.prob * 100).toFixed(0)}%`],
              ["Weighted impact", `${(sel.impact * sel.prob).toFixed(2)}%`],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between">
                <span className="font-mono text-[10px] uppercase tracking-[0.14em]" style={{ color: t.sub }}>{k}</span>
                <span className="tnum font-mono text-[13px]">{v}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 flex gap-2">
            <button className="flex-1 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em]" style={{ background: t.down, color: t.bg }}>Add to calendar</button>
            <button className="px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em]" style={{ border: `1px solid ${t.rule}`, color: t.sub }}>Alert</button>
          </div>
          <div className="mt-4 border-t pt-3" style={{ borderColor: t.rule }}>
            <Caps style={{ color: t.sub }}>Aggregate</Caps>
            <div className="tnum font-sans text-[28px] font-extrabold leading-none">±4.6%</div>
            <div className="font-mono text-[11px]" style={{ color: t.sub }}>root-sum-square of all open events</div>
          </div>
        </aside>
      </div>
    </div>
  );
}

/* ═══════════════════════ 62.b — IMPACT LADDER ═══════════════════════ */
function P62B() {
  const t = TONES.ink;
  const [kinds, setKinds] = useState<string[]>(Object.keys(CAT_C));
  const [sel, setSel] = useState<string>(CATS[4].t);
  const rows = CATS.filter((c) => kinds.includes(c.k)).map((c) => ({ ...c, w: c.impact * c.prob })).sort((a, b) => b.w - a.w);
  const total = rows.reduce((s, r) => s + r.w, 0);

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-end justify-between gap-4">
        <div>
          <Caps style={{ color: t.sub }}>Ranked by weighted expected move · the ladder</Caps>
          <div className="mt-0.5 font-display text-[21px] italic">Two events carry 45% of everything that could happen before July.</div>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {Object.keys(CAT_C).map((k) => (
            <Chip key={k} t={t} on={kinds.includes(k)} onClick={() => setKinds((o) => (o.includes(k) ? o.filter((x) => x !== k) : [...o, k]))} color={CAT_C[k]}>
              {k}
            </Chip>
          ))}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_264px]">
        <div>
          <div className="grid gap-3 pb-2" style={{ gridTemplateColumns: "26px 92px minmax(0,1fr) 74px 66px", borderBottom: `2px solid ${t.fg}` }}>
            {["#", "Date", "Event", "Weighted", "Raw"].map((h, i) => (
              <Caps key={h} style={{ color: t.sub, gridColumn: i >= 2 && i <= 2 ? undefined : undefined }}>{h}</Caps>
            ))}
          </div>
          {rows.map((r, i) => {
            const on = sel === r.t;
            return (
              <div
                key={r.t}
                onClick={() => setSel(r.t)}
                className="grid cursor-pointer items-center gap-3 py-2.5"
                style={{ gridTemplateColumns: "26px 92px minmax(0,1fr) 74px 66px", borderBottom: `1px solid ${t.rule}`, background: on ? "rgba(240,233,225,0.06)" : "transparent", boxShadow: on ? `inset 3px 0 0 ${t.down}` : "none" }}
              >
                <span className="tnum font-sans text-[20px] font-extrabold leading-none" style={{ color: on ? t.down : "rgba(240,233,225,0.3)" }}>{i + 1}</span>
                <span className="tnum font-mono text-[12px]" style={{ color: t.sub }}>{r.d}</span>
                <span className="min-w-0">
                  <span className="block truncate text-[14px]" style={{ color: "#F0E9E1" }}>{r.t}</span>
                  <span className="mt-1 flex h-[9px] w-full">
                    <span style={{ width: `${(r.w / (rows[0]?.w || 1)) * 100}%`, background: CAT_C[r.k] }} />
                    <span style={{ flex: 1, background: "rgba(240,233,225,0.08)" }} />
                  </span>
                  <span className="mt-1 block font-mono text-[9.5px] uppercase tracking-[0.14em]" style={{ color: t.sub }}>{r.k} · prob {(r.prob * 100).toFixed(0)}%</span>
                </span>
                <span className="tnum text-right font-mono text-[15px] font-semibold" style={{ color: t.down }}>±{r.w.toFixed(2)}%</span>
                <span className="tnum text-right font-mono text-[13px]" style={{ color: t.sub }}>±{r.impact.toFixed(1)}%</span>
              </div>
            );
          })}
          <div className="mt-3 flex flex-wrap items-center justify-between gap-4 border-t pt-3" style={{ borderColor: t.rule }}>
            <div className="flex items-center gap-3">
              <Caps style={{ color: t.sub }}>Total weighted</Caps>
              <span className="tnum font-sans text-[26px] font-extrabold" style={{ color: t.down }}>±{total.toFixed(2)}%</span>
              <span className="font-mono text-[11px]" style={{ color: t.sub }}>≈ ${((CO.price * total) / 100).toFixed(2)} per share</span>
            </div>
            <div className="flex gap-2">
              {["Week", "Month", "Quarter"].map((b, i) => (
                <span key={b} className="px-2.5 py-1 font-mono text-[9.5px] uppercase tracking-[0.14em]" style={i === 2 ? { background: t.fg, color: t.bg } : { border: `1px solid ${t.rule}`, color: t.sub }}>{b}</span>
              ))}
            </div>
          </div>
        </div>

        <aside style={{ borderLeft: `1px solid ${t.rule}` }} className="pl-5">
          {(() => {
            const r = CATS.find((c) => c.t === sel)!;
            return (
              <>
                <Caps style={{ color: CAT_C[r.k] }}>{r.k}</Caps>
                <div className="mt-1 font-display text-[21px] leading-tight">{r.t}</div>
                <div className="tnum mt-2 font-sans text-[46px] font-extrabold leading-none tracking-tight" style={{ color: t.down }}>
                  ±{(r.impact * r.prob).toFixed(2)}%
                </div>
                <div className="font-mono text-[11px]" style={{ color: t.sub }}>weighted from ±{r.impact.toFixed(1)}% at {(r.prob * 100).toFixed(0)}% probability</div>
                <p className="mt-3 font-display text-[15.5px] italic leading-relaxed" style={{ color: t.sub }}>{r.note}</p>
                <div className="mt-4 space-y-2 border-t pt-3" style={{ borderColor: t.rule }}>
                  {[["Date", `${r.d} 2026`], ["Days until", `${r.day}`], ["Position in ladder", `#${rows.findIndex((x) => x.t === r.t) + 1}`], ["Share of total", `${((r.impact * r.prob / total) * 100).toFixed(0)}%`]].map(([k, v]) => (
                    <div key={k} className="flex justify-between">
                      <span className="font-mono text-[10px] uppercase tracking-[0.14em]" style={{ color: t.sub }}>{k}</span>
                      <span className="tnum font-mono text-[13px]">{v}</span>
                    </div>
                  ))}
                </div>
              </>
            );
          })()}
        </aside>
      </div>
    </div>
  );
}

/* ═══════════════════════ 62.c — AGENDA ═══════════════════════ */
function P62C() {
  const t = TONES.sand;
  const [open, setOpen] = useState<string[]>(["Q1 2026 earnings"]);
  const [only, setOnly] = useState<string>("all");
  const months = ["March", "April", "May", "June"];
  const list = CATS.filter((c) => only === "all" || c.k === only);
  const monthIdx = (day: number) => Math.min(3, Math.floor((day + 1) / 31));

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-end justify-between gap-4 border-b-2 pb-3" style={{ borderColor: t.fg }}>
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.28em]" style={{ color: t.sub }}>Investor agenda · Halcyon Grid · spring 2026</div>
          <h3 className="mt-1 font-display text-[clamp(26px,3.4vw,40px)] leading-none tracking-tight">What is scheduled, and what it is worth</h3>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {["all", ...Object.keys(CAT_C)].map((k) => (
            <Chip key={k} t={t} on={only === k} onClick={() => setOnly(k)} color={k === "all" ? t.fg : CAT_C[k]}>
              {k === "all" ? "Everything" : k}
            </Chip>
          ))}
        </div>
      </div>

      <div className="grid gap-0 lg:grid-cols-[minmax(0,1fr)_270px]">
        <div className="pr-7">
          {months.map((m, mi) => {
            const items = list.filter((c) => monthIdx(c.day) === mi);
            if (!items.length) return null;
            return (
              <div key={m} className="mb-6">
                <div className="mb-2 flex items-baseline gap-3">
                  <span className="font-sans text-[15px] font-extrabold uppercase tracking-[0.18em]">{m}</span>
                  <span className="h-px flex-1" style={{ background: t.rule }} />
                  <span className="tnum font-mono text-[11px]" style={{ color: t.sub }}>{items.length} event{items.length > 1 ? "s" : ""}</span>
                </div>
                {items.map((c) => {
                  const isOpen = open.includes(c.t);
                  return (
                    <div
                      key={c.t}
                      onClick={() => setOpen((o) => (isOpen ? o.filter((x) => x !== c.t) : [...o, c.t]))}
                      className="grid cursor-pointer items-start gap-5 py-3"
                      style={{ gridTemplateColumns: "76px minmax(0,1fr) 96px", borderTop: `1px solid ${t.rule}`, background: isOpen ? "rgba(35,27,18,0.05)" : "transparent" }}
                    >
                      <div className="text-right">
                        <div className="tnum font-sans text-[34px] font-extrabold leading-none tracking-[-0.04em]" style={{ color: isOpen ? t.down : "rgba(35,27,18,0.75)" }}>
                          {c.d.split(" ")[0]}
                        </div>
                        <div className="font-mono text-[10px] uppercase tracking-[0.16em]" style={{ color: t.sub }}>
                          in {c.day} days
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="inline-block h-[9px] w-[9px] rotate-45" style={{ background: CAT_C[c.k] }} />
                          <span className="font-mono text-[9.5px] uppercase tracking-[0.18em]" style={{ color: t.sub }}>{c.k}</span>
                        </div>
                        <div className="mt-0.5 font-display text-[21px] leading-tight">{c.t}</div>
                        <div className="overflow-hidden transition-all duration-300" style={{ maxHeight: isOpen ? 130 : 0 }}>
                          <p className="pt-1.5 text-[14.5px] leading-relaxed" style={{ color: "rgba(35,27,18,0.76)" }}>{c.note}</p>
                          <div className="mt-1.5 flex gap-2">
                            <span className="px-2 py-[3px] font-mono text-[9.5px] uppercase tracking-[0.14em]" style={{ border: `1px solid ${t.rule}`, color: t.sub }}>Set alert</span>
                            <span className="px-2 py-[3px] font-mono text-[9.5px] uppercase tracking-[0.14em]" style={{ border: `1px solid ${t.rule}`, color: t.sub }}>Add note</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="tnum font-sans text-[22px] font-extrabold leading-none" style={{ color: c.impact > 4 ? t.down : "rgba(35,27,18,0.8)" }}>
                          ±{c.impact.toFixed(1)}%
                        </div>
                        <div className="mt-1 flex justify-end gap-[3px]">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <span key={i} className="inline-block h-[10px] w-[4px]" style={{ background: i < Math.round(c.impact) ? CAT_C[c.k] : "rgba(35,27,18,0.14)" }} />
                          ))}
                        </div>
                        <div className="mt-1 font-mono text-[10px]" style={{ color: t.sub }}>{(c.prob * 100).toFixed(0)}% likely</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}
          {!list.length && (
            <div className="py-12 text-center font-display text-[18px] italic" style={{ color: t.sub }}>
              Nothing scheduled in this category before July.
            </div>
          )}
        </div>

        <aside style={{ borderLeft: `1px solid ${t.rule}` }} className="pl-6">
          <Caps style={{ color: t.down }}>Countdown</Caps>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="tnum font-sans text-[64px] font-extrabold leading-none tracking-[-0.05em]">35</span>
            <span className="font-display text-[19px] italic">days</span>
          </div>
          <div className="font-mono text-[11px] uppercase tracking-[0.16em]" style={{ color: t.sub }}>to Q1 2026 earnings · 23 Apr</div>

          <div className="mt-5">
            <Caps style={{ color: t.sub }}>Expected vs realised, last four</Caps>
            <div className="mt-2 space-y-2">
              {[["Q4'25", 5.4, 6.9], ["Q3'25", 5.1, -1.8], ["Q2'25", 4.8, 4.4], ["Q1'25", 4.6, 3.1]].map(([q, exp, act]) => (
                <div key={q as string}>
                  <div className="flex justify-between font-mono text-[11px]">
                    <span style={{ color: t.sub }}>{q as string}</span>
                    <span className="tnum" style={{ color: (act as number) >= 0 ? t.up : t.down }}>
                      exp ±{(exp as number).toFixed(1)} · act {(act as number) > 0 ? "+" : ""}{(act as number).toFixed(1)}%
                    </span>
                  </div>
                  <div className="relative mt-0.5 h-[10px]" style={{ background: "rgba(35,27,14,0.08)" }}>
                    <div className="absolute top-0 h-full" style={{ left: "50%", width: `${Math.min(50, Math.abs(act as number) * 5)}%`, background: (act as number) >= 0 ? t.up : t.down, transform: (act as number) >= 0 ? "none" : "translateX(-100%)" }} />
                    <div className="absolute top-0 h-full w-px" style={{ left: "50%", background: t.fg }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <p className="mt-5 border-t pt-3 font-display text-[15px] italic leading-relaxed" style={{ borderColor: t.rule, color: "rgba(35,27,18,0.74)" }}>
            The stock has finished outside the implied range in three of the last four prints — options have been underpricing the reaction, not overpricing it.
          </p>
        </aside>
      </div>
    </div>
  );
}

export function C62() {
  const nm = "Upcoming catalysts";
  return (
    <>
      <Plate n={62} letter="a" name={nm} variant="105-day calendar with sized event markers" tone="paper" caption="A trading-day grid rather than a month grid: circle area encodes expected move, colour encodes category, clicking pulls the full note into the right rail. Category chips filter the whole calendar.">
        <A />
      </Plate>
      <Plate n={62} letter="b" name={nm} variant="Impact ladder ranked by weighted expected move" tone="ink" caption="Probability × impact gives one number to sort on, so the ladder tells you where to spend attention. The rail breaks the selected event back into its raw and weighted components and its share of the total.">
        <P62B />
      </Plate>
      <Plate n={62} letter="c" name={nm} variant="Month-grouped agenda with days-until numerals" tone="sand" caption="Set like a diary: oversized day numbers, month rules, expandable entries with alert and note affordances, five-segment impact bars, and a countdown to the next print alongside the last four expected-versus-realised reactions.">
        <P62C />
      </Plate>
    </>
  );
}

/* ═══════════════════════ shared candidate data for plate 66 ═══════════════════════ */
type Cand = { t: string; n: string; mcap: number; g: number; om: number; roic: number; beta: number; reg: string };
const CANDS: Cand[] = [
  { t: "HLG", n: "Halcyon Grid", mcap: 68.4, g: 18.6, om: 21.3, roic: 17.4, beta: 1.34, reg: "US" },
  { t: "NVPT", n: "Novanta Power", mcap: 91.2, g: 11.2, om: 17.8, roic: 13.9, beta: 1.11, reg: "US" },
  { t: "TDNE", n: "Terradyne Energy", mcap: 42.7, g: 24.9, om: 14.2, roic: 11.2, beta: 1.52, reg: "DE" },
  { t: "CNDR", n: "Cinder Works", mcap: 27.9, g: 6.4, om: 12.6, roic: 15.6, beta: 0.94, reg: "US" },
  { t: "BLNE", n: "Brightline Electric", mcap: 55.3, g: 14.1, om: 19.4, roic: 18.8, beta: 1.19, reg: "JP" },
  { t: "ORBK", n: "Orbis Power", mcap: 18.6, g: 31.4, om: 9.1, roic: 7.4, beta: 1.71, reg: "SE" },
  { t: "KSDL", n: "Kestrel Drives", mcap: 33.1, g: 4.8, om: 13.9, roic: 14.1, beta: 0.86, reg: "UK" },
  { t: "ASHG", n: "Ashgrove Capital", mcap: 12.4, g: -2.1, om: 8.2, roic: 9.8, beta: 0.72, reg: "US" },
  { t: "ALDF", n: "Alderon Flow", mcap: 24.8, g: 17.6, om: 16.2, roic: 12.4, beta: 1.28, reg: "CA" },
  { t: "NDWL", n: "Nordwall Systems", mcap: 37.2, g: 21.3, om: 15.1, roic: 13.6, beta: 1.44, reg: "SE" },
  { t: "PNDC", n: "Pinnacle Drive", mcap: 19.4, g: 8.9, om: 11.4, roic: 10.9, beta: 0.91, reg: "US" },
  { t: "VIRC", n: "Vireo Controls", mcap: 8.7, g: 36.2, om: 6.4, roic: 5.1, beta: 1.83, reg: "IN" },
  { t: "SBTX", n: "Sable Transmission", mcap: 46.5, g: 12.7, om: 20.1, roic: 17.2, beta: 1.06, reg: "AU" },
  { t: "CVRG", n: "Corvus Grid", mcap: 13.9, g: 27.8, om: 10.3, roic: 8.6, beta: 1.57, reg: "FR" },
];
const H = CANDS[0];
const score = (c: Cand, w: { g: number; m: number; r: number; b: number; s: number }) => {
  const norm = (v: number, lo: number, hi: number) => Math.max(0, Math.min(1, (v - lo) / (hi - lo || 1)));
  const dist =
    Math.abs(norm(c.g, -5, 40) - norm(H.g, -5, 40)) * w.g +
    Math.abs(norm(c.mcap, 5, 100) - norm(H.mcap, 5, 100)) * w.s +
    Math.abs(norm(c.om, 5, 25) - norm(H.om, 5, 25)) * w.m +
    Math.abs(norm(c.roic, 4, 22) - norm(H.roic, 4, 22)) * w.r +
    Math.abs(norm(c.beta, 0.6, 2) - norm(H.beta, 0.6, 2)) * w.b;
  return Math.max(0, 100 - (dist / (w.g + w.m + w.r + w.b + w.s)) * 100);
};

/* ═══════════════════════ 66.a — FILTER RAIL + RESULTS ═══════════════════════ */
function P66A() {
  const t = TONES.paper;
  const [minCap, setMinCap] = useState(5);
  const [minG, setMinG] = useState(-5);
  const [maxBeta, setMaxBeta] = useState(2);
  const [regs, setRegs] = useState<string[]>(["US", "DE", "JP", "SE", "UK", "CA", "IN", "AU", "FR"]);
  const [sort, setSort] = useState<"match" | "mcap" | "g">("match");

  const rows = useMemo(() => {
    const r = CANDS.filter((c) => c.mcap >= minCap && c.g >= minG && c.beta <= maxBeta && regs.includes(c.reg));
    return [...r].sort((a, b) => (sort === "match" ? score(b, { g: 3, m: 2, r: 2, b: 1, s: 1 }) - score(a, { g: 3, m: 2, r: 2, b: 1, s: 1 }) : sort === "mcap" ? b.mcap - a.mcap : b.g - a.g));
  }, [minCap, minG, maxBeta, regs, sort]);

  const regions = ["US", "DE", "JP", "SE", "UK", "CA", "IN", "AU", "FR"];

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-end justify-between gap-4 border-b pb-3" style={{ borderColor: t.fg }}>
        <div>
          <Caps style={{ color: t.sub }}>Similarity screen · built around {H.t} · {rows.length} of {CANDS.length} pass</Caps>
          <div className="mt-0.5 font-display text-[21px] italic">Set the tolerances and the shortlist assembles itself.</div>
        </div>
        <div className="flex gap-3">
          <Toggle opts={["match", "mcap", "g"] as const} value={sort} onChange={setSort} t={t} size="sm" />
          <button
            onClick={() => { setMinCap(5); setMinG(-5); setMaxBeta(2); setRegs(regions); }}
            className="px-3 py-1 font-mono text-[10px] uppercase tracking-[0.14em]"
            style={{ border: `1px solid ${t.rule}`, color: t.sub }}
          >
            Reset
          </button>
        </div>
      </div>

      <div className="grid gap-7 lg:grid-cols-[268px_minmax(0,1fr)]">
        <div className="pr-7" style={{ borderRight: `1px solid ${t.rule}` }}>
          <div className="space-y-5">
            {[
              { lab: "Minimum market cap", v: minCap, set: setMinCap, min: 5, max: 100, step: 1, fmt: (v: number) => `$${v}bn` },
              { lab: "Minimum revenue growth", v: minG, set: setMinG, min: -5, max: 40, step: 1, fmt: (v: number) => `${v}%` },
              { lab: "Maximum beta", v: maxBeta, set: setMaxBeta, min: 0.6, max: 2, step: 0.01, fmt: (v: number) => v.toFixed(2) },
            ].map((s) => (
              <label key={s.lab} className="block">
                <div className="mb-1.5 flex items-baseline justify-between">
                  <Caps style={{ color: t.sub }}>{s.lab}</Caps>
                  <span className="tnum font-mono text-[13px]">{s.fmt(s.v)}</span>
                </div>
                <input type="range" min={s.min} max={s.max} step={s.step} value={s.v} onChange={(e) => s.set(+e.target.value)} className="w-full" style={{ color: t.down }} aria-label={s.lab} />
              </label>
            ))}
          </div>
          <div className="mt-5">
            <Caps style={{ color: t.sub }}>Domicile</Caps>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {regions.map((r) => (
                <Chip key={r} t={t} on={regs.includes(r)} onClick={() => setRegs((o) => (o.includes(r) ? o.filter((x) => x !== r) : [...o, r]))}>{r}</Chip>
              ))}
            </div>
          </div>
          <div className="mt-5 border-t pt-3" style={{ borderColor: t.rule }}>
            <Caps style={{ color: t.sub }}>Passing</Caps>
            <div className="tnum font-sans text-[46px] font-extrabold leading-none tracking-tight" style={{ color: t.down }}>{rows.length}</div>
            <div className="font-mono text-[11px]" style={{ color: t.sub }}>of {CANDS.length} screened names</div>
          </div>
        </div>

        <div className="min-w-0">
          <div className="overflow-x-auto scroller">
            <table className="w-full min-w-[660px] border-collapse">
              <thead>
                <tr style={{ borderBottom: `2px solid ${t.fg}` }}>
                  <th className="pb-2 text-left"><Caps style={{ color: t.sub }}>Company</Caps></th>
                  {["Match", "Mkt cap", "Growth", "Op margin", "ROIC", "Beta"].map((h) => (
                    <th key={h} className="pb-2 pl-3 text-right"><Caps style={{ color: t.sub }}>{h}</Caps></th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((c) => {
                  const m = score(c, { g: 3, m: 2, r: 2, b: 1, s: 1 });
                  const self = c.t === "HLG";
                  return (
                    <tr key={c.t} style={{ borderBottom: `1px solid ${t.rule}`, background: self ? "rgba(142,31,47,0.07)" : "transparent", boxShadow: self ? `inset 3px 0 0 ${t.down}` : "none" }}>
                      <td className="py-2.5 pr-3">
                        <div className="flex items-baseline gap-2">
                          <span className="font-mono text-[12.5px] font-semibold" style={{ color: self ? t.down : t.fg }}>{c.t}</span>
                          <span className="text-[13px]" style={{ color: "rgba(22,18,14,0.75)" }}>{c.n}</span>
                          <span className="font-mono text-[9.5px]" style={{ color: t.sub }}>{c.reg}</span>
                        </div>
                      </td>
                      <td className="py-2.5 pl-3">
                        <div className="flex items-center justify-end gap-2">
                          <div className="h-[7px] w-[74px]" style={{ background: "rgba(22,18,14,0.09)" }}>
                            <div className="h-full" style={{ width: `${m}%`, background: m > 70 ? t.down : "rgba(27,58,92,0.7)" }} />
                          </div>
                          <span className="tnum font-mono text-[12.5px] font-semibold" style={{ width: 34, textAlign: "right" }}>{m.toFixed(0)}</span>
                        </div>
                      </td>
                      {[c.mcap.toFixed(1), `${c.g.toFixed(1)}%`, `${c.om.toFixed(1)}%`, `${c.roic.toFixed(1)}%`, c.beta.toFixed(2)].map((v, i) => (
                        <td key={i} className="tnum py-2.5 pl-3 text-right font-mono text-[12.5px]">{v}</td>
                      ))}
                    </tr>
                  );
                })}
                {!rows.length && (
                  <tr>
                    <td colSpan={7} className="py-12 text-center">
                      <div className="font-display text-[19px] italic" style={{ color: t.sub }}>No listed company clears all four filters.</div>
                      <button onClick={() => { setMinCap(5); setMinG(-5); setMaxBeta(2); setRegs(regions); }} className="mt-2 font-mono text-[10px] uppercase tracking-[0.16em]" style={{ color: t.down }}>
                        widen the screen
                      </button>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <p className="mt-3 font-display text-[15px] italic" style={{ color: "rgba(22,18,14,0.7)" }}>
            Match scores Halcyon against the five screened criteria at once: growth and scale are weighted heaviest, beta least. Move a slider and every score re-ranks.
          </p>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════ 66.b — MATCH CARDS ═══════════════════════ */
function P66B() {
  const t = TONES.ink;
  const [sort, setSort] = useState<"match" | "g" | "roic">("match");
  const [sel, setSel] = useState<string>("NDWL");
  const w = { g: 3, m: 2, r: 2, b: 1, s: 1 };
  const cards = useMemo(
    () => CANDS.filter((c) => c.t !== "HLG").map((c) => ({ c, m: score(c, w) })).sort((a, b) => (sort === "match" ? b.m - a.m : sort === "g" ? b.c.g - a.c.g : b.c.roic - a.c.roic)),
    [sort],
  );
  const crit: [string, keyof Cand][] = [["Growth", "g"], ["Op margin", "om"], ["ROIC", "roic"], ["Size", "mcap"], ["Beta", "beta"]];
  const ranges: Record<string, [number, number]> = { g: [-5, 40], om: [5, 25], roic: [4, 22], mcap: [5, 100], beta: [0.6, 2] };
  const cur = cards.find((x) => x.c.t === sel) ?? cards[0];

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-end justify-between gap-4">
        <div>
          <Caps style={{ color: t.sub }}>Fourteen screened names, ranked by how closely they track {H.t}</Caps>
          <div className="mt-0.5 font-display text-[21px] italic">Each card carries its own five-criterion profile against the subject company.</div>
        </div>
        <Toggle opts={["match", "g", "roic"] as const} value={sort} onChange={setSort} t={t} size="sm" />
      </div>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_280px]">
        <div className="grid gap-px sm:grid-cols-2 xl:grid-cols-3" style={{ background: t.rule }}>
          {cards.slice(0, 9).map(({ c, m }) => {
            const on = sel === c.t;
            return (
              <button
                key={c.t}
                onClick={() => setSel(c.t)}
                className="p-4 text-left transition-colors"
                style={{ background: on ? "rgba(224,107,107,0.14)" : t.bg, boxShadow: on ? `inset 0 -3px 0 ${t.down}` : "none" }}
              >
                <div className="flex items-baseline justify-between">
                  <span className="font-mono text-[13px] font-semibold">{c.t}</span>
                  <span className="tnum font-sans text-[22px] font-extrabold leading-none" style={{ color: m > 72 ? t.down : "#F0E9E1" }}>{m.toFixed(0)}</span>
                </div>
                <div className="truncate font-display text-[15px]" style={{ color: "rgba(240,233,225,0.8)" }}>{c.n}</div>
                <div className="mt-2 flex h-[34px] items-end gap-1.5">
                  {crit.map(([lab, key]) => {
                    const [lo, hi] = ranges[key as string];
                    const v = ((c[key] as number) - lo) / (hi - lo);
                    const hv = ((H[key] as number) - lo) / (hi - lo);
                    return (
                      <div key={lab} className="relative flex-1" style={{ height: "100%", background: "rgba(240,233,225,0.07)" }}>
                        <div className="absolute bottom-0 w-full" style={{ height: `${Math.max(4, v * 100)}%`, background: t.down, opacity: 0.75 }} />
                        <div className="absolute left-0 w-full" style={{ bottom: `${hv * 100}%`, height: "1.5px", background: "#F0E9E1" }} />
                      </div>
                    );
                  })}
                </div>
                <div className="mt-1 flex justify-between font-mono text-[9px] uppercase tracking-[0.1em]" style={{ color: t.sub }}>
                  {crit.map(([lab]) => <span key={lab}>{lab.slice(0, 4)}</span>)}
                </div>
              </button>
            );
          })}
        </div>

        <aside style={{ borderLeft: `1px solid ${t.rule}` }} className="pl-5">
          <Caps style={{ color: t.down }}>Closest match</Caps>
          <div className="font-sans text-[30px] font-extrabold leading-none tracking-tight">{cur.c.t}</div>
          <div className="font-display text-[17px] italic" style={{ color: t.sub }}>{cur.c.n}</div>
          <div className="tnum mt-3 font-sans text-[52px] font-extrabold leading-none tracking-[-0.045em]" style={{ color: t.down }}>{cur.m.toFixed(0)}</div>
          <div className="font-mono text-[11px] uppercase tracking-[0.16em]" style={{ color: t.sub }}>similarity score / 100</div>

          <div className="mt-4 space-y-2.5">
            {crit.map(([lab, key]) => {
              const v = cur.c[key] as number;
              const hv = H[key] as number;
              return (
                <div key={lab}>
                  <div className="flex justify-between font-mono text-[11px]">
                    <span style={{ color: t.sub }}>{lab}</span>
                    <span className="tnum">{v.toFixed(key === "mcap" ? 1 : 1)} vs {hv.toFixed(1)}</span>
                  </div>
                  <div className="relative mt-1 h-[8px]" style={{ background: "rgba(240,233,225,0.09)" }}>
                    <div className="absolute top-0 h-full" style={{ width: `${Math.abs(v - hv) < 0.01 ? 100 : 100 - Math.abs(v - hv) * 3}%`, background: t.up, opacity: 0.75 }} />
                    <div className="absolute top-0 h-full w-px" style={{ left: "50%", background: "#F0E9E1" }} />
                  </div>
                </div>
              );
            })}
          </div>
          <p className="mt-4 border-t pt-3 font-display text-[15px] italic leading-relaxed" style={{ borderColor: t.rule, color: t.sub }}>
            White line on each mini bar is Halcyon's own level, so the bar reads as distance from the subject rather than absolute size.
          </p>
        </aside>
      </div>
      <span className="sr-only">{nf(cards.length)}</span>
    </div>
  );
}

/* ═══════════════════════ 66.c — QUADRANT SCATTER ═══════════════════════ */
function P66C() {
  const t = TONES.blueprint;
  const [quad, setQuad] = useState<string>("all");
  const [sel, setSel] = useState<string>("NDWL");
  const W = 900, H0 = 430;
  const X = (v: number) => lin(v, -5, 40, 74, W - 40);
  const Y = (v: number) => lin(v, 4, 22, H0 - 56, 30);
  const inQuad = (c: Cand) => {
    const fast = c.g >= 15, good = c.roic >= 13;
    if (quad === "all") return true;
    if (quad === "compounders") return fast && good;
    if (quad === "challengers") return fast && !good;
    if (quad === "quality") return !fast && good;
    return !fast && !good;
  };
  const quads: [string, string, number, number][] = [
    ["compounders", "COMPOUNDERS", 26, 8],
    ["challengers", "CHALLENGERS", -3, 8],
    ["quality", "QUALITY, SLOWING", 26, 19],
    ["strugglers", "UNDER PRESSURE", -3, 19],
  ];

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-end justify-between gap-4">
        <div>
          <Caps style={{ color: t.sub }}>Growth against return on invested capital · bubble = market cap</Caps>
          <div className="mt-0.5 font-display text-[21px] italic">Click a quadrant to keep only the companies in it.</div>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {["all", "compounders", "challengers", "quality", "strugglers"].map((q) => (
            <Chip key={q} t={t} on={quad === q} onClick={() => setQuad(q)}>
              {q === "all" ? "All 14" : q}
            </Chip>
          ))}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_270px]">
        <svg viewBox={`0 0 ${W} ${H0}`} width="100%" className="block">
          <rect x={X(15)} y={Y(22)} width={X(40) - X(15)} height={Y(13) - Y(22)} fill="#63C2A6" opacity="0.1" />
          <rect x={X(-5)} y={Y(22)} width={X(15) - X(-5)} height={Y(13) - Y(22)} fill="#63C2A6" opacity="0.05" />
          <line x1={X(15)} x2={X(15)} y1="30" y2={H0 - 56} stroke={t.rule} strokeDasharray="6 4" />
          <line x1="74" x2={W - 40} y1={Y(13)} y2={Y(13)} stroke={t.rule} strokeDasharray="6 4" />
          {quads.map(([k, lab, x, y]) => (
            <text key={k} x={X(x)} y={Y(y)} fontSize="10.5" fill={quad === k || quad === "all" ? t.sub : "rgba(143,166,190,0.35)"} fontFamily="IBM Plex Mono" letterSpacing="1.6">
              {lab}
            </text>
          ))}
          {[0, 10, 20, 30, 40].map((v) => (
            <g key={v}>
              <line x1={X(v)} x2={X(v)} y1={H0 - 56} y2={H0 - 50} stroke={t.rule} />
              <text x={X(v)} y={H0 - 34} fontSize="10" fill={t.sub} textAnchor="middle" fontFamily="IBM Plex Mono">{v}%</text>
            </g>
          ))}
          {[5, 10, 15, 20].map((v) => (
            <g key={v}>
              <line x1="68" x2="74" y1={Y(v)} y2={Y(v)} stroke={t.rule} />
              <text x="64" y={Y(v) + 4} fontSize="10" fill={t.sub} textAnchor="end" fontFamily="IBM Plex Mono">{v}%</text>
            </g>
          ))}
          <text x={(74 + W - 40) / 2} y={H0 - 12} fontSize="10.5" fill={t.sub} textAnchor="middle" fontFamily="IBM Plex Mono" letterSpacing="1.8">REVENUE GROWTH YoY →</text>
          <text x="20" y={(H0 - 56 + 30) / 2} fontSize="10.5" fill={t.sub} textAnchor="middle" fontFamily="IBM Plex Mono" letterSpacing="1.8" transform={`rotate(-90 20 ${(H0 - 56 + 30) / 2})`}>ROIC →</text>

          {CANDS.map((c) => {
            const vis = inQuad(c);
            const r = 7 + Math.sqrt(c.mcap) * 1.9;
            const self = c.t === "HLG";
            const on = sel === c.t;
            return (
              <g
                key={c.t}
                onMouseEnter={() => setSel(c.t)}
                onClick={() => setSel(c.t)}
                style={{ cursor: "pointer", opacity: vis ? 1 : 0.16, transition: "opacity 240ms" }}
              >
                <circle cx={X(c.g)} cy={Y(c.roic)} r={r} fill={self ? "#E88A7A" : "#63C2A6"} opacity={self ? 0.5 : 0.26} />
                <circle cx={X(c.g)} cy={Y(c.roic)} r={r} fill="none" stroke={self ? "#E88A7A" : on ? "#E6EDF5" : "#63C2A6"} strokeWidth={self || on ? 2.4 : 1.2} />
                <text x={X(c.g)} y={Y(c.roic) - r - 6} fontSize="11" fill={self ? "#E88A7A" : "#E6EDF5"} textAnchor="middle" fontFamily="IBM Plex Mono" fontWeight={self ? 700 : 400}>
                  {c.t}
                </text>
              </g>
            );
          })}
          <line x1="74" x2={W - 40} y1={H0 - 56} y2={H0 - 56} stroke={t.rule} />
          <line x1="74" x2="74" y1="30" y2={H0 - 56} stroke={t.rule} />
        </svg>

        <aside style={{ borderLeft: `1px solid ${t.rule}` }} className="pl-5">
          <Caps style={{ color: t.down }}>{CANDS.find((c) => c.t === sel)?.n ?? "—"}</Caps>
          <div className="font-sans text-[30px] font-extrabold leading-none tracking-tight">{sel}</div>
          <div className="mt-3 space-y-2">
            {CANDS.filter((c) => c.t === sel).flatMap((c) =>
              [["Revenue growth", `${c.g.toFixed(1)}%`], ["ROIC", `${c.roic.toFixed(1)}%`], ["Operating margin", `${c.om.toFixed(1)}%`], ["Market cap", `$${c.mcap.toFixed(1)}bn`], ["Beta", c.beta.toFixed(2)], ["Domicile", c.reg], ["Quadrant", c.g >= 15 ? (c.roic >= 13 ? "Compounder" : "Challenger") : c.roic >= 13 ? "Quality, slowing" : "Under pressure"]].map(([k, v]) => (
                <div key={k} className="flex justify-between border-b pb-1.5" style={{ borderColor: t.rule }}>
                  <span className="font-mono text-[10px] uppercase tracking-[0.14em]" style={{ color: t.sub }}>{k}</span>
                  <span className="tnum font-mono text-[13px]">{v}</span>
                </div>
              ))
            )}
          </div>
          <div className="mt-4 border-t pt-3" style={{ borderColor: t.rule }}>
            <Caps style={{ color: t.sub }}>In this quadrant</Caps>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {CANDS.filter(inQuad).map((c) => (
                <span key={c.t} className="px-2 py-[3px] font-mono text-[11px]" style={{ border: `1px solid ${c.t === sel ? "#E6EDF5" : t.rule}`, color: c.t === sel ? "#E6EDF5" : t.sub }}>
                  {c.t}
                </span>
              ))}
            </div>
          </div>
          <p className="mt-4 font-display text-[15px] italic leading-relaxed" style={{ color: t.sub }}>
            Only Brightline, Sable and Halcyon sit in the compounder quadrant — growth above 12% with returns above 17%.
          </p>
        </aside>
      </div>
      <span className="sr-only">{nf(W + H0)}</span>
    </div>
  );
}

export function C66() {
  const nm = "Similar-company screener";
  return (
    <>
      <Plate n={66} letter="a" name={nm} variant="Filter rail and live shortlist with a match column" tone="paper" caption="Three sliders, a domicile chip group and four sorting rules. Everything filters in place, match scores recompute on every move, and the empty state offers a way back rather than a blank table.">
        <P66A />
      </Plate>
      <Plate n={66} letter="b" name={nm} variant="Match cards, each with a five-bar profile" tone="ink" caption="Candidates as tiles rather than rows: every card carries a mini bar chart where the white line marks Halcyon's own level, so distance from the subject is read at a glance. Selecting a card opens the full comparison in the rail.">
        <P66B />
      </Plate>
      <Plate n={66} letter="c" name={nm} variant="Growth × return quadrant with click-to-filter" tone="blueprint" caption="Position rather than rank: four labelled quadrants, bubble area as market cap, and clicking a quadrant drops everything outside it. The subject company is ringed in claret wherever it lands.">
        <P66C />
      </Plate>
    </>
  );
}
export { poly };
