import { useMemo, useState } from "react";
import { Caps, Chip, Plate, Toggle, TONES, lin, poly, nf } from "@/ui";

/* ═══════════════════════ shared report data for plate 74 ═══════════════════════ */
type Rep = { firm: string; who: string; date: string; rating: string; tgt: number; tone: "bull" | "neutral" | "bear"; head: string; quote: string; bullets: string[] };
const REPORTS: Rep[] = [
  {
    firm: "Barrow & Finch", who: "A. Whitcombe", date: "20 Feb 2026", rating: "Buy", tgt: 245, tone: "bull",
    head: "The grid-forming cycle is bigger than the market is modelling",
    quote: "We think consensus is still modelling Halcyon as an inverter company with a software option attached. It is now a software company that happens to ship iron.",
    bullets: [
      "Raise FY26 revenue to $5.62bn from $5.44bn on H-Series backlog of $840m.",
      "Storage & controls crosses 30% of revenue in FY27, taking group gross margin to 46.2%.",
      "Target raised to $245, 27× FY27 EPS of $8.62 — still a discount to its own five-year average multiple.",
    ],
  },
  {
    firm: "Morgan Keegan", who: "J. Sørensen", date: "24 Feb 2026", rating: "Overweight", tgt: 232, tone: "bull",
    head: "Guidance was conservative and the working-capital drag is temporary",
    quote: "Four beats in a row and a CFO who has just bought stock at $165. We would rather pay 34× for a management team that keeps being wrong in the same direction.",
    bullets: [
      "Working capital absorbed $182m; if DSO simply returns to 80 days that is $110m of one-off cash release.",
      "Pune takes imported content from 41% to 31% by end-2027 — a real, quantified tariff hedge.",
      "Estimates go to $5.6bn / $2.12 for FY26; target $232.",
    ],
  },
  {
    firm: "Cascadia Securities", who: "P. Raghunathan", date: "18 Feb 2026", rating: "Neutral", tgt: 186, tone: "bear",
    head: "The multiple already pays for four flawless years",
    quote: "Nothing in the fundamentals is wrong. Everything in the price assumes nothing goes wrong — and 38% of revenue sits with three customers, one of which renews in Q3.",
    bullets: [
      "34.2× trailing versus a five-year median of 26.4×; we cannot get above $186 on a probability-weighted DCF.",
      "Arden Supply is 17% of revenue and its renewal is the single largest binary event on the calendar.",
      "Tariff guidance of 150bp looks light against 41% imported bill of materials.",
    ],
  },
  {
    firm: "Stifel Europe", who: "N. Okada", date: "13 Feb 2026", rating: "Hold", tgt: 172, tone: "bear",
    head: "Storage share is slipping exactly where the growth is",
    quote: "Terradyne and Orbis are taking the C&I storage layer at prices Halcyon will not match. Halcyon's share of the fastest-growing segment fell from 24% to 22% in two years.",
    bullets: [
      "Segment share data suggests the pricing discipline that protects margin is costing volume.",
      "Inventory turns down to 3.0× — building ahead of demand you are losing is not a great trade.",
      "Maintain Hold; the risk-reward is symmetric from here.",
    ],
  },
  {
    firm: "RBC Capital Mkts", who: "T. Delacroix", date: "11 Feb 2026", rating: "Outperform", tgt: 226, tone: "bull",
    head: "Capital allocation is finally working for the shareholder",
    quote: "Diluted shares are down 6.4% in two years while free cash flow has nearly tripled. That combination is rare in this sector and it is not in the sell-side models yet.",
    bullets: [
      "$248m of buybacks at an average $164 — accretive to EPS by an estimated $0.09 in FY26.",
      "No maturities before 2029 and $600m undrawn; the balance sheet is no longer a constraint.",
      "Target $226 on 30× FY26 EPS of $2.10.",
    ],
  },
  {
    firm: "Bernstein Research", who: "E. Kowalczyk", date: "09 Feb 2026", rating: "Market Perform", tgt: 194, tone: "neutral",
    head: "Downgrading on valuation, not on the business",
    quote: "We have been wrong on the operating story for two years and right on the stock being expensive for two years. We prefer to own this on weakness below $160.",
    bullets: [
      "Outperform → Market Perform on relative valuation against Brightline at a lower multiple and higher ROIC.",
      "Estimates unchanged; the move is entirely about where the shares trade, not what they earn.",
      "Risk is that the April analyst day resets expectations higher again.",
    ],
  },
];

/* ═══════════════════════ 74.a — REPORT STACK ═══════════════════════ */
function A() {
  const t = TONES.paper;
  const [open, setOpen] = useState<string[]>(["Barrow & Finch"]);
  const [filter, setFilter] = useState<string>("all");
  const [sort, setSort] = useState<"date" | "tgt">("date");
  const toneC: Record<string, string> = { bull: "#2E5E4A", neutral: "#8A7F73", bear: "#8E1F2F" };

  const rows = useMemo(() => {
    const r = REPORTS.filter((x) => filter === "all" || x.tone === filter);
    return [...r].sort((a, b) => (sort === "tgt" ? b.tgt - a.tgt : new Date(b.date).getTime() - new Date(a.date).getTime()));
  }, [filter, sort]);

  const avg = REPORTS.reduce((s, r) => s + r.tgt, 0) / REPORTS.length;

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-end justify-between gap-4 border-b-2 pb-3" style={{ borderColor: t.fg }}>
        <div>
          <Caps style={{ color: t.sub }}>Sell-side research · 6 reports in the last 30 days · Halcyon Grid</Caps>
          <div className="mt-0.5 font-display text-[21px] italic">Consensus $214.50 · range $172 – $245 · 3 bulls, 2 neutral, 1 bear.</div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex gap-1.5">
            {["all", "bull", "neutral", "bear"].map((f) => (
              <Chip key={f} t={t} on={filter === f} onClick={() => setFilter(f)} color={f === "all" ? t.fg : toneC[f]}>
                {f === "all" ? `All ${REPORTS.length}` : `${f} · ${REPORTS.filter((r) => r.tone === f).length}`}
              </Chip>
            ))}
          </div>
          <Toggle opts={["date", "tgt"] as const} value={sort} onChange={setSort} t={t} size="sm" />
        </div>
      </div>

      <div className="space-y-0">
        {rows.map((r) => {
          const isOpen = open.includes(r.firm);
          return (
            <div key={r.firm} style={{ borderBottom: `1px solid ${t.rule}` }}>
              <button onClick={() => setOpen((o) => (isOpen ? o.filter((x) => x !== r.firm) : [...o, r.firm]))} className="grid w-full gap-4 py-4 text-left" style={{ gridTemplateColumns: "188px minmax(0,1fr) 128px" }}>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="h-[10px] w-[10px] rotate-45" style={{ background: toneC[r.tone] }} />
                    <span className="font-sans text-[15px] font-bold tracking-tight">{r.firm}</span>
                  </div>
                  <div className="mt-0.5 font-mono text-[10.5px]" style={{ color: t.sub }}>{r.who}</div>
                  <div className="mt-1.5 font-mono text-[10.5px]" style={{ color: t.sub }}>{r.date}</div>
                  <div className="mt-2 inline-block px-2 py-[3px] font-mono text-[10px] uppercase tracking-[0.14em]" style={{ border: `1px solid ${toneC[r.tone]}`, color: toneC[r.tone] }}>
                    {r.rating}
                  </div>
                </div>
                <div className="min-w-0">
                  <div className="font-display text-[22px] leading-tight">{r.head}</div>
                  <p className="mt-1.5 border-l-2 pl-3 font-display text-[16px] italic leading-snug" style={{ borderColor: toneC[r.tone], color: "rgba(22,18,14,0.74)" }}>
                    “{r.quote}”
                  </p>
                  <div className="overflow-hidden transition-all duration-300" style={{ maxHeight: isOpen ? 200 : 0 }}>
                    <ul className="mt-3 space-y-1.5">
                      {r.bullets.map((b, i) => (
                        <li key={i} className="flex gap-2 text-[14.5px] leading-snug" style={{ color: "rgba(22,18,14,0.82)" }}>
                          <span className="font-mono text-[11px]" style={{ color: toneC[r.tone] }}>{String(i + 1).padStart(2, "0")}</span>
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="text-right">
                  <Caps style={{ color: t.sub }}>Target</Caps>
                  <div className="tnum font-sans text-[32px] font-extrabold leading-none tracking-tight" style={{ color: r.tgt > 187.42 ? t.up : t.down }}>
                    ${r.tgt}
                  </div>
                  <div className="font-mono text-[11px]" style={{ color: t.sub }}>
                    {((r.tgt / 187.42 - 1) * 100).toFixed(1)}% vs price
                  </div>
                  <div className="mt-3 flex items-center justify-end gap-1">
                    <div className="relative h-[7px] w-[104px]" style={{ background: "rgba(22,18,14,0.1)" }}>
                      <div className="absolute top-0 h-full" style={{ left: `${((r.tgt - 160) / 100) * 100}%`, width: "3px", background: toneC[r.tone] }} />
                      <div className="absolute top-0 h-full w-px" style={{ left: `${((187.42 - 160) / 100) * 100}%`, background: t.fg }} />
                    </div>
                  </div>
                  <div className="mt-2 font-mono text-[9.5px] uppercase tracking-[0.14em]" style={{ color: t.down }}>
                    {isOpen ? "hide thesis" : "read thesis"}
                  </div>
                </div>
              </button>
            </div>
          );
        })}
      </div>

      <div className="mt-4 flex flex-wrap items-end justify-between gap-5 border-t pt-3" style={{ borderColor: t.rule }}>
        <div className="flex gap-7">
          {[["Average target", `$${avg.toFixed(2)}`], ["Implied upside", `${((avg / 187.42 - 1) * 100).toFixed(1)}%`], ["Bulls / neutral / bears", "3 / 2 / 1"], ["Estimate revisions, 90d", "+7.4%"]].map(([k, v]) => (
            <div key={k}>
              <Caps style={{ color: t.sub }}>{k}</Caps>
              <div className="tnum font-sans text-[22px] font-bold tracking-tight" style={{ color: k === "Estimate revisions, 90d" ? t.up : t.fg }}>{v}</div>
            </div>
          ))}
        </div>
        <span className="font-mono text-[10.5px]" style={{ color: t.sub }}>Excerpts reproduced under fair use · full reports available in the filings archive</span>
      </div>
    </div>
  );
}

/* ═══════════════════════ 74.b — QUOTE WALL ═══════════════════════ */
function P74B() {
  const t = TONES.ink;
  const [stance, setStance] = useState<string>("all");
  const [hl, setHl] = useState<string>("multiple");
  const terms = ["multiple", "tariff", "backlog", "working capital", "share"];
  const toneC: Record<string, string> = { bull: t.up, neutral: "#F0E9E1", bear: t.down };

  const mark = (s: string) => {
    const i = s.toLowerCase().indexOf(hl);
    if (i < 0) return s;
    return (
      <>
        {s.slice(0, i)}
        <mark style={{ background: hl === "multiple" ? "#D98324" : hl === "tariff" ? "#E06B6B" : "#63C2A6", color: "#0E1014", padding: "0 3px" }}>
          {s.slice(i, i + hl.length)}
        </mark>
        {s.slice(i + hl.length)}
      </>
    );
  };

  const cards = REPORTS.filter((r) => stance === "all" || r.tone === stance);

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-end justify-between gap-4">
        <div>
          <Caps style={{ color: t.sub }}>Excerpts pulled from six notes · highlighted by theme</Caps>
          <div className="mt-0.5 font-display text-[21px] italic">Choose a theme and every mention lights up across the wall.</div>
        </div>
        <div className="flex flex-wrap gap-3">
          <div className="flex gap-1.5">
            {terms.map((x) => (
              <Chip key={x} t={t} on={hl === x} onClick={() => setHl(x)} color="#D98324">{x}</Chip>
            ))}
          </div>
          <div className="flex gap-1.5">
            {["all", "bull", "neutral", "bear"].map((s) => (
              <Chip key={s} t={t} on={stance === s} onClick={() => setStance(s)} color={toneC[s]}>{s}</Chip>
            ))}
          </div>
        </div>
      </div>

      <div className="columns-1 gap-5 sm:columns-2 xl:columns-3">
        {cards.map((r, i) => (
          <div
            key={r.firm}
            className="mb-5 break-inside-avoid border p-5 transition-colors"
            style={{ borderColor: i % 3 === 0 ? toneC[r.tone] : t.rule, background: i % 4 === 1 ? "rgba(240,233,225,0.03)" : "transparent" }}
          >
            <div className="flex items-baseline justify-between">
              <span className="font-sans text-[15px] font-bold tracking-tight">{r.firm}</span>
              <span className="font-mono text-[10.5px]" style={{ color: toneC[r.tone] }}>{r.rating}</span>
            </div>
            <div className="font-mono text-[10px]" style={{ color: t.sub }}>{r.date} · target ${r.tgt}</div>
            <div className="mt-3 font-display text-[25px] leading-[1.15]" style={{ color: toneC[r.tone] }}>
              “{r.quote}”
            </div>
            <p className="mt-3 text-[14px] leading-relaxed" style={{ color: "rgba(240,233,225,0.66)" }}>
              {mark(r.head)}. {mark(r.bullets[0])}
            </p>
            <div className="mt-3 flex items-center justify-between border-t pt-2" style={{ borderColor: t.rule }}>
              <span className="font-mono text-[10.5px]" style={{ color: t.sub }}>{r.who}</span>
              <span className="font-mono text-[10px] uppercase tracking-[0.14em]" style={{ color: t.down }}>open ↗</span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-4 border-t pt-3" style={{ borderColor: t.rule }}>
        <div className="flex items-center gap-4">
          <Caps style={{ color: t.sub }}>Mentions of “{hl}”</Caps>
          <span className="tnum font-sans text-[26px] font-extrabold" style={{ color: "#D98324" }}>
            {cards.reduce((s, r) => s + ((r.head + r.quote + r.bullets.join(" ")).toLowerCase().match(new RegExp(hl, "g")) || []).length, 0)}
          </span>
        </div>
        <span className="font-mono text-[10.5px]" style={{ color: t.sub }}>
          {cards.length} of {REPORTS.length} notes shown · {stance} stance
        </span>
      </div>
    </div>
  );
}

/* ═══════════════════════ 74.c — CLIPPINGS ═══════════════════════ */
function P74C() {
  const t = TONES.sand;
  const [focus, setFocus] = useState<string>("all");
  const [saved, setSaved] = useState<string[]>(["Barrow & Finch"]);
  const list = REPORTS.filter((r) => focus === "all" || r.tone === focus);

  return (
    <div>
      <div className="border-b-2 pb-3" style={{ borderColor: t.fg }}>
        <div className="font-mono text-[10px] uppercase tracking-[0.28em]" style={{ color: t.sub }}>Clippings · sell-side notes on Halcyon Grid · February 2026</div>
        <h3 className="mt-1 font-display text-[clamp(26px,3.6vw,44px)] leading-[1.03] tracking-tight">
          Three analysts raised their targets. One of them lowered his rating instead.
        </h3>
        <p className="mt-2 max-w-[80ch] font-display text-[17px] italic" style={{ color: "rgba(35,27,18,0.68)" }}>
          The disagreement is not about the business — everyone in this set thinks revenue compounds mid-teens. It is about what41× forward deserves.
        </p>
      </div>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {["all", "bull", "neutral", "bear"].map((f) => (
          <Chip key={f} t={t} on={focus === f} onClick={() => setFocus(f)} color={f === "all" ? t.fg : f === "bull" ? "#2E5E4A" : f === "bear" ? "#8E1F2F" : "#8A7F73"}>
            {f === "all" ? "All clippings" : f}
          </Chip>
        ))}
      </div>

      <div className="mt-5 grid gap-0 md:grid-cols-2 xl:grid-cols-3">
        {list.map((r, i) => {
          const isSaved = saved.includes(r.firm);
          const col = r.tone === "bull" ? "#2E5E4A" : r.tone === "bear" ? "#8E1F2F" : "#8A7F73";
          return (
            <article
              key={r.firm}
              className="flex flex-col p-6"
              style={{
                borderRight: `1px solid ${t.rule}`,
                borderBottom: `1px solid ${t.rule}`,
                background: i % 2 === 0 ? "rgba(255,255,255,0.32)" : "transparent",
              }}
            >
              <div className="flex items-baseline justify-between border-b pb-2" style={{ borderColor: col }}>
                <span className="font-mono text-[10px] uppercase tracking-[0.2em]" style={{ color: col }}>{r.rating}</span>
                <span className="tnum font-sans text-[24px] font-extrabold leading-none" style={{ color: col }}>${r.tgt}</span>
              </div>
              <div className="mt-2 font-sans text-[14px] font-bold tracking-tight">{r.firm}</div>
              <div className="font-mono text-[10.5px]" style={{ color: t.sub }}>{r.who} · {r.date}</div>

              <p className="mt-3 font-display text-[26px] leading-[1.12] tracking-tight">
                {r.head}
              </p>

              <p className="mt-3 font-display text-[16.5px] italic leading-relaxed" style={{ color: "rgba(35,27,18,0.76)" }}>
                “{r.quote}”
              </p>

              <ul className="mt-3 space-y-1.5 border-t pt-3" style={{ borderColor: t.rule }}>
                {r.bullets.slice(0, 2).map((b, j) => (
                  <li key={j} className="flex gap-2 text-[14px] leading-snug" style={{ color: "rgba(35,27,18,0.8)" }}>
                    <span style={{ color: col }}>—</span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-auto flex items-center justify-between pt-4">
                <span className="tnum font-mono text-[11.5px]" style={{ color: ((r.tgt / 187.42 - 1) * 100) >= 0 ? "#2E5E4A" : "#8E1F2F" }}>
                  {((r.tgt / 187.42 - 1) * 100) >= 0 ? "+" : ""}{((r.tgt / 187.42 - 1) * 100).toFixed(1)}% to price
                </span>
                <button
                  onClick={() => setSaved((s) => (s.includes(r.firm) ? s.filter((x) => x !== r.firm) : [...s, r.firm]))}
                  className="px-2.5 py-1 font-mono text-[9.5px] uppercase tracking-[0.14em] transition-colors"
                  style={{ border: `1px solid ${isSaved ? col : t.rule}`, background: isSaved ? col : "transparent", color: isSaved ? t.bg : t.sub }}
                >
                  {isSaved ? "★ clipped" : "☆ clip"}
                </button>
              </div>
            </article>
          );
        })}
      </div>

      <div className="mt-5 flex flex-wrap items-end justify-between gap-5 border-t-2 pt-4" style={{ borderColor: t.fg }}>
        <div>
          <Caps style={{ color: t.sub }}>Coverage balance</Caps>
          <div className="mt-1 flex h-[24px] w-[280px] overflow-hidden" style={{ border: `1px solid ${t.fg}` }}>
            <div className="flex items-center justify-center" style={{ width: "50%", background: "#2E5E4A", color: t.bg }}>
              <span className="font-mono text-[10px]">3 constructive</span>
            </div>
            <div className="flex items-center justify-center" style={{ width: "33.3%", background: "rgba(35,27,18,0.14)" }}>
              <span className="font-mono text-[10px]">2 neutral</span>
            </div>
            <div className="flex items-center justify-center" style={{ width: "16.7%", background: "#8E1F2F", color: t.bg }}>
              <span className="font-mono text-[10px]">1</span>
            </div>
          </div>
          <div className="mt-1.5 font-mono text-[11px]" style={{ color: t.sub }}>
            {saved.length} clipping{saved.length === 1 ? "" : "s"} saved · {list.length} shown
          </div>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 font-mono text-[10px] uppercase tracking-[0.16em]" style={{ border: `1px solid ${t.fg}`, color: t.fg }}>Export notes</button>
          <button className="px-4 py-2 font-mono text-[10px] uppercase tracking-[0.16em]" style={{ background: t.fg, color: t.bg }}>Compare all targets</button>
        </div>
      </div>
      <span className="sr-only">{nf(list.length)}</span>
    </div>
  );
}

export function C74() {
  const nm = "Analyst report highlights";
  return (
    <>
      <Plate n={74} letter="a" name={nm} variant="Report stack with expanding thesis bullets" tone="paper" caption="Six notes as rows: firm, rating, date and headline on the left, the pull quote always visible, the numbered thesis only on expansion, and a target marker on a shared $160–$260 scale at the right.">
        <A />
      </Plate>
      <Plate n={74} letter="b" name={nm} variant="Quote wall with theme highlighting" tone="ink" caption="Masonry of excerpts with the pull quote set large in the stance colour. Pick a theme and every occurrence is marked in place across all cards, with a live mention count at the foot.">
        <P74B />
      </Plate>
      <Plate n={74} letter="c" name={nm} variant="Clippings page — signed excerpts you can keep" tone="sand" caption="Built as a newspaper clipping page: display headline across the full measure, three-column ruled articles, two-bullet summaries, and a star that physically clips a note to your file.">
        <P74C />
      </Plate>
    </>
  );
}

/* ═══════════════════════ shared cost data for plate 81 ═══════════════════════ */
const CY = ["FY21", "FY22", "FY23", "FY24", "FY25"];
const COSTS = [
  { k: "Materials & components", c: "#8E1F2F", v: [1024, 1196, 1362, 1541, 1746] },
  { k: "Direct labour", c: "#1B3A5C", v: [268, 302, 344, 386, 428] },
  { k: "Manufacturing overhead", c: "#D98324", v: [184, 216, 251, 278, 316] },
  { k: "R&D", c: "#2E5E4A", v: [371, 419, 496, 528, 561] },
  { k: "Selling & distribution", c: "#8A7F73", v: [284, 312, 352, 384, 424] },
  { k: "G&A and other", c: "#5C1420", v: [446, 492, 548, 612, 678] },
];
const REVT = [3412, 3927, 4604, 5256, 6144];

/* ═══════════════════════ 81.a — STACKED COST BARS ═══════════════════════ */
function P81A() {
  const t = TONES.paper;
  const [mode, setMode] = useState<"pct" | "abs">("pct");
  const [sel, setSel] = useState<string>("Materials & components");
  const W = 900, H = 360;
  const totals = CY.map((_, i) => COSTS.reduce((s, c) => s + c.v[i], 0));
  const X = (i: number) => lin(i, 0, CY.length - 1, 64, W - 74);
  const Y = (v: number) => lin(v, 0, mode === "abs" ? 4400 : 100, H - 46, 24);

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-end justify-between gap-4 border-b pb-3" style={{ borderColor: t.fg }}>
        <div>
          <Caps style={{ color: t.sub }}>Where the money goes · cost of revenue and operating expense, FY21 – FY25</Caps>
          <div className="mt-0.5 font-display text-[21px] italic">Materials still take 35 cents of every revenue dollar — down from 30… no, up in absolute terms, down as a share.</div>
        </div>
        <div className="flex items-center gap-3">
          <Toggle opts={["pct", "abs"] as const} value={mode} onChange={setMode} t={t} size="sm" />
          <span className="font-mono text-[11px]" style={{ color: t.sub }}>total costs ${nf(totals[4])}m</span>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_254px]">
        <svg viewBox={`0 0 ${W} ${H}`} width="100%" className="block" onMouseLeave={() => setSel("Materials & components")}>
          {(mode === "pct" ? [0, 25, 50, 75, 100] : [0, 1100, 2200, 3300, 4400]).map((v) => (
            <g key={v}>
              <line x1="64" x2={W - 74} y1={Y(v)} y2={Y(v)} stroke={t.rule} strokeDasharray="2 5" />
              <text x="58" y={Y(v) + 4} fontSize="10" fill={t.sub} textAnchor="end" fontFamily="IBM Plex Mono">{mode === "pct" ? `${v}%` : nf(v)}</text>
            </g>
          ))}
          {CY.map((y, i) => {
            const bw = 92;
            const x = X(i) - bw / 2;
            let acc = 0;
            return (
              <g key={y}>
                {COSTS.map((c) => {
                  const raw = c.v[i];
                  const val = mode === "pct" ? (raw / REVT[i]) * 100 : raw;
                  const y0 = Y(acc + val), h = Y(acc) - Y(acc + val);
                  acc += val;
                  return (
                    <rect
                      key={c.k}
                      x={x}
                      y={y0}
                      width={bw}
                      height={h}
                      fill={c.c}
                      opacity={sel === c.k ? 1 : 0.72}
                      stroke={t.bg}
                      strokeWidth="1"
                      onMouseEnter={() => setSel(c.k)}
                      style={{ cursor: "pointer" }}
                    />
                  );
                })}
                <text x={X(i)} y={H - 28} fontSize="11.5" fill={t.sub} textAnchor="middle" fontFamily="IBM Plex Mono">{y}</text>
                <text x={X(i)} y={Y(acc) - 9} fontSize="12" fill={t.fg} textAnchor="middle" fontFamily="IBM Plex Mono" fontWeight="600">
                  {mode === "pct" ? `${acc.toFixed(0)}%` : nf(Math.round(acc))}
                </text>
              </g>
            );
          })}
          <line x1="64" x2={W - 74} y1={Y(0)} y2={Y(0)} stroke={t.fg} />
          <text x="64" y={H - 8} fontSize="10" fill={t.sub} fontFamily="IBM Plex Mono" letterSpacing="1.4">
            SHARE OF REVENUE — TOTAL COST OF THE BUSINESS
          </text>
        </svg>

        <aside style={{ borderLeft: `1px solid ${t.rule}` }} className="pl-5">
          <Caps style={{ color: t.down }}>{sel}</Caps>
          {(() => {
            const c = COSTS.find((x) => x.k === sel)!;
            const share = c.v.map((v, i) => (v / REVT[i]) * 100);
            return (
              <>
                <div className="tnum font-sans text-[42px] font-extrabold leading-none tracking-tight">${nf(c.v[4])}m</div>
                <div className="mt-1 font-mono text-[11px]" style={{ color: t.sub }}>
                  {share[4].toFixed(1)}% of revenue · {((c.v[4] / c.v[0] - 1) * 100).toFixed(0)}% since FY21
                </div>
                <svg width="100%" height="86" viewBox="0 0 220 86" className="mt-3 block">
                  {share.map((v, i) => {
                    const bw = 34;
                    const x = 8 + i * 42;
                    return (
                      <g key={i}>
                        <rect x={x} y={70 - (v / 45) * 60} width={bw} height={(v / 45) * 60} fill={c.c} opacity={i === 4 ? 1 : 0.5} />
                        <text x={x + bw / 2} y={82} fontSize="9" fill={t.sub} textAnchor="middle" fontFamily="IBM Plex Mono">{CY[i]}</text>
                      </g>
                    );
                  })}
                  <line x1="4" x2="216" y1="70" y2="70" stroke={t.rule} />
                </svg>
                <div className="mt-3 space-y-1.5">
                  {[["Change in share", `${(share[4] - share[0]).toFixed(1)}pt`], ["Per $ of revenue", `$${share[4].toFixed(1)}`], ["YoY growth", `${((c.v[4] / c.v[3] - 1) * 100).toFixed(1)}%`], ["vs revenue growth", "+16.9%"]].map(([k, v]) => (
                    <div key={k} className="flex justify-between border-b pb-1" style={{ borderColor: t.rule }}>
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

      <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 border-t pt-2" style={{ borderColor: t.rule }}>
        {COSTS.map((c) => (
          <span key={c.k} className="flex cursor-pointer items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.1em]" style={{ color: sel === c.k ? t.fg : t.sub }} onMouseEnter={() => setSel(c.k)}>
            <span className="inline-block h-[9px] w-[9px]" style={{ background: c.c }} /> {c.k}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════ 81.b — COST LADDER ═══════════════════════ */
function P81B() {
  const t = TONES.ink;
  const [sel, setSel] = useState<string>("Materials & components");
  const total = COSTS.reduce((s, c) => s + c.v[4], 0);
  const parts = [...COSTS].sort((a, b) => b.v[4] - a.v[4]);
  let acc = 0;
  const segs = parts.map((c) => {
    const pctv = (c.v[4] / total) * 100;
    const o = acc;
    acc += pctv;
    return { c, pctv, o };
  });
  const drivers: [string, number, string][] = [
    ["Volume", 412, "units shipped +19.2%"],
    ["Input price inflation", 168, "semiconductors, copper, magnetics"],
    ["Wage inflation", 74, "3.8% average settlement"],
    ["Mix to software", -132, "storage & controls attach"],
    ["Productivity", -96, "Pune and Ohio yield gains"],
    ["FX", -31, "EUR, JPY translation"],
  ];
  const net = drivers.reduce((s, d) => s + d[1], 0);
  const mxC = Math.max(...drivers.map((d) => Math.abs(d[1])));

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-end justify-between gap-4 border-b pb-3" style={{ borderColor: t.fg }}>
        <div>
          <Caps style={{ color: t.sub }}>FY25 cost structure · ${nf(total)}m · {((total / REVT[4]) * 100).toFixed(1)}% of revenue</Caps>
          <div className="mt-0.5 font-display text-[21px] italic">Six categories, one bar — and what moved it this year.</div>
        </div>
        <div className="flex gap-5">
          {[["Cost / revenue", `${((total / REVT[4]) * 100).toFixed(1)}%`], ["Gross cost", "$2,490m"], ["Operating cost", "$1,665m"], ["YoY change", "+13.9%"]].map(([k, v]) => (
            <div key={k}>
              <Caps style={{ color: t.sub }}>{k}</Caps>
              <div className="tnum font-sans text-[18px] font-bold">{v}</div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="flex h-[62px] w-full overflow-hidden">
          {segs.map(({ c, pctv, o }) => (
            <button
              key={c.k}
              onMouseEnter={() => setSel(c.k)}
              onClick={() => setSel(c.k)}
              className="relative h-full transition-all duration-200"
              style={{ width: `${pctv}%`, background: c.c, opacity: sel === c.k ? 1 : 0.7, outline: sel === c.k ? "2px solid #F0E9E1" : "none", outlineOffset: "-2px" }}
              title={`${c.k} · ${pctv.toFixed(1)}%`}
            >
              <span className="absolute left-2 top-2 font-mono text-[11px] font-semibold" style={{ color: "#0E1014" }}>{pctv.toFixed(1)}%</span>
              <span className="absolute bottom-2 left-2 font-mono text-[9.5px] uppercase" style={{ color: "#0E1014", opacity: 0.75 }}>
                {pctv > 8 ? c.k.split(" ")[0] : ""}
              </span>
              <span className="sr-only">{o.toFixed(1)}</span>
            </button>
          ))}
        </div>
        <div className="mt-1.5 flex justify-between font-mono text-[10.5px]" style={{ color: t.sub }}>
          <span>0%</span>
          <span>every category sized by its share of total cost</span>
          <span>100%</span>
        </div>
      </div>

      <div className="mt-6 grid gap-7 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div>
          <Caps style={{ color: t.down }}>What moved costs in FY25 · US$m</Caps>
          <div className="mt-3 space-y-2.5">
            {drivers.map(([k, v, why]) => (
              <div key={k} className="grid items-center gap-3" style={{ gridTemplateColumns: "170px minmax(0,1fr) 74px" }}>
                <div>
                  <div className="text-[14px]">{k}</div>
                  <div className="font-mono text-[10px]" style={{ color: t.sub }}>{why}</div>
                </div>
                <div className="relative h-[22px]" style={{ background: "rgba(240,233,225,0.05)" }}>
                  <div className="absolute top-0 h-full w-px" style={{ left: "50%", background: t.rule }} />
                  <div
                    className="absolute top-[3px] h-[16px]"
                    style={{
                      left: v >= 0 ? "50%" : `${50 - (Math.abs(v) / mxC) * 50}%`,
                      width: `${(Math.abs(v) / mxC) * 50}%`,
                      background: v >= 0 ? t.down : t.up,
                    }}
                  />
                </div>
                <div className="tnum text-right font-mono text-[13.5px]" style={{ color: v >= 0 ? t.down : t.up }}>
                  {v >= 0 ? "+" : "−"}{Math.abs(v)}
                </div>
              </div>
            ))}
            <div className="grid items-center gap-3 border-t pt-2" style={{ gridTemplateColumns: "170px minmax(0,1fr) 74px", borderColor: t.rule }}>
              <span className="font-sans text-[14px] font-bold">Net change in cost</span>
              <span />
              <span className="tnum text-right font-mono text-[15px] font-semibold" style={{ color: net >= 0 ? t.down : t.up }}>
                {net >= 0 ? "+" : "−"}{Math.abs(net)}
              </span>
            </div>
          </div>
        </div>

        <aside style={{ borderLeft: `1px solid ${t.rule}` }} className="pl-6">
          <Caps style={{ color: t.sub }}>Category detail</Caps>
          {(() => {
            const c = COSTS.find((x) => x.k === sel)!;
            return (
              <>
                <div className="mt-1 font-display text-[24px] leading-tight">{c.k}</div>
                <div className="tnum mt-2 font-sans text-[44px] font-extrabold leading-none tracking-tight" style={{ color: c.c }}>
                  ${nf(c.v[4])}m
                </div>
                <div className="mt-1 font-mono text-[11.5px]" style={{ color: t.sub }}>
                  {((c.v[4] / total) * 100).toFixed(1)}% of total cost · {((c.v[4] / REVT[4]) * 100).toFixed(1)}% of revenue
                </div>
                <div className="mt-4">
                  <Caps style={{ color: t.sub }}>Five-year path</Caps>
                  <svg width="100%" height="96" viewBox="0 0 240 96" className="mt-1 block">
                    <path d={poly(c.v.map((v, i) => [lin(i, 0, 4, 10, 230), lin(v, 0, Math.max(...COSTS.map((x) => Math.max(...x.v))), 84, 8)] as [number, number]))} fill="none" stroke={c.c} strokeWidth="2.4" />
                    {c.v.map((v, i) => (
                      <g key={i}>
                        <circle cx={lin(i, 0, 4, 10, 230)} cy={lin(v, 0, Math.max(...COSTS.map((x) => Math.max(...x.v))), 84, 8)} r="3.6" fill={c.c} />
                        <text x={lin(i, 0, 4, 10, 230)} y={94} fontSize="9" fill={t.sub} textAnchor="middle" fontFamily="IBM Plex Mono">{CY[i]}</text>
                      </g>
                    ))}
                    <line x1="10" x2="230" y1="84" y2="84" stroke={t.rule} />
                  </svg>
                </div>
                <div className="mt-3 space-y-1.5">
                  {[["CAGR", `${(((c.v[4] / c.v[0]) ** 0.25 - 1) * 100).toFixed(1)}%`], ["YoY", `${((c.v[4] / c.v[3] - 1) * 100).toFixed(1)}%`], ["Share of total cost", `${((c.v[4] / total) * 100).toFixed(1)}%`]].map(([k, v]) => (
                    <div key={k} className="flex justify-between border-b pb-1" style={{ borderColor: t.rule }}>
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

/* ═══════════════════════ 81.c — UNIT COST TABLE + YoY BRIDGE ═══════════════════════ */
function P81C() {
  const t = TONES.sand;
  const [sel, setSel] = useState("Materials & components");
  const rows = COSTS.map((c) => ({
    ...c,
    share: c.v.map((v, i) => (v / REVT[i]) * 100),
    yoy: (c.v[4] / c.v[3] - 1) * 100,
    perK: (c.v[4] / 96.4) * 1000,
  }));
  const bridge: [string, number][] = [
    ["FY24 total cost", 4347],
    ["Volume", 824],
    ["Input prices", 336],
    ["Wages", 148],
    ["Software mix", -264],
    ["Productivity", -192],
    ["FX", -62],
    ["FY25 total cost", 6137],
  ];
  let running = 0;
  const bars = bridge.map((b, i) => {
    if (i === 0) { running = b[1]; return { b, y0: 0, y1: b[1], tot: true }; }
    if (i === bridge.length - 1) return { b, y0: 0, y1: b[1], tot: true };
    const from = running; running += b[1];
    return { b, y0: Math.min(from, running), y1: Math.max(from, running), tot: false };
  });

  return (
    <div>
      <div className="mb-5 border-b-2 pb-3" style={{ borderColor: t.fg }}>
        <div className="font-mono text-[10px] uppercase tracking-[0.28em]" style={{ color: t.sub }}>Cost file · Halcyon Grid · unit economics and drivers</div>
        <h3 className="mt-1 font-display text-[clamp(26px,3.4vw,40px)] leading-none tracking-tight">
          What each revenue dollar pays for, and why that changed
        </h3>
      </div>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
        <div className="overflow-x-auto scroller">
          <table className="w-full min-w-[560px] border-collapse">
            <thead>
              <tr style={{ borderBottom: `2px solid ${t.fg}` }}>
                <th className="pb-2 text-left"><Caps style={{ color: t.sub }}>Cost line</Caps></th>
                {CY.map((y) => (
                  <th key={y} className="pb-2 pl-3 text-right"><span className="font-mono text-[10.5px]">{y}</span></th>
                ))}
                <th className="pb-2 pl-3 text-right"><Caps style={{ color: t.sub }}>% rev</Caps></th>
                <th className="pb-2 pl-3 text-right"><Caps style={{ color: t.sub }}>YoY</Caps></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr
                  key={r.k}
                  onMouseEnter={() => setSel(r.k)}
                  style={{ borderBottom: `1px solid ${t.rule}`, background: sel === r.k ? "rgba(35,27,18,0.07)" : "transparent", boxShadow: sel === r.k ? `inset 3px 0 0 ${t.down}` : "none" }}
                >
                  <td className="py-2.5 pr-3">
                    <span className="flex items-center gap-2 text-[14.5px]">
                      <span className="h-[10px] w-[10px]" style={{ background: r.c }} />
                      {r.k}
                    </span>
                  </td>
                  {r.v.map((v, i) => (
                    <td key={i} className="tnum py-2.5 pl-3 text-right font-mono text-[13px]">{nf(v)}</td>
                  ))}
                  <td className="tnum py-2.5 pl-3 text-right font-mono text-[13px]">{r.share[4].toFixed(1)}</td>
                  <td className="tnum py-2.5 pl-3 text-right font-mono text-[13px]" style={{ color: r.yoy > 16 ? t.down : "rgba(35,27,18,0.8)" }}>
                    +{r.yoy.toFixed(1)}%
                  </td>
                </tr>
              ))}
              <tr style={{ borderTop: `2px solid ${t.fg}` }}>
                <td className="pt-2 pr-4 font-sans text-[15px] font-bold">Total cost</td>
                {CY.map((y, i) => (
                  <td key={y} className="tnum pt-2 pl-3 text-right font-sans text-[15px] font-bold">{nf(COSTS.reduce((s, c) => s + c.v[i], 0))}</td>
                ))}
                <td className="tnum pt-2 pl-3 text-right font-sans text-[15px] font-bold">{((6137 / REVT[4]) * 100).toFixed(1)}</td>
                <td className="tnum pt-2 pl-3 text-right font-sans text-[15px] font-bold" style={{ color: t.down }}>+16.7%</td>
              </tr>
              <tr>
                <td className="pt-2 pr-4 font-sans text-[15px]">Revenue</td>
                {CY.map((y, i) => (
                  <td key={y} className="tnum pt-2 pl-3 text-right font-mono text-[13.5px]">{nf(REVT[i])}</td>
                ))}
                <td className="tnum pt-2 pl-3 text-right font-mono text-[13.5px]">100</td>
                <td className="tnum pt-2 pl-3 text-right font-mono text-[13.5px]">+16.9%</td>
              </tr>
            </tbody>
          </table>

          <div className="mt-5">
            <Caps style={{ color: t.sub }}>Cost of every unit sold · US$ per shipped kilowatt</Caps>
            <div className="mt-2 grid grid-cols-3 gap-4 sm:grid-cols-6">
              {rows.map((r) => (
                <div key={r.k} onMouseEnter={() => setSel(r.k)} className="cursor-pointer">
                  <div className="tnum font-sans text-[21px] font-extrabold leading-none">{r.perK.toFixed(1)}</div>
                  <div className="mt-1 h-[34px] w-full" style={{ background: "rgba(35,27,18,0.08)" }}>
                    <div className="w-full" style={{ height: `${Math.min(100, (r.perK / 19) * 100)}%`, background: r.c, marginTop: `${Math.max(0, 100 - Math.min(100, (r.perK / 19) * 100))}%` }} />
                  </div>
                  <div className="mt-1 font-mono text-[9px] uppercase leading-tight" style={{ color: t.sub }}>{r.k.split(" ")[0]}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <aside style={{ borderLeft: `1px solid ${t.rule}` }} className="pl-6">
          <Caps style={{ color: t.down }}>Why costs changed · FY24 → FY25 · US$m</Caps>
          <svg viewBox="0 0 400 300" width="100%" className="mt-3 block">
            {bars.map((x, i) => {
              const w = 40;
              const cx = 20 + i * 47;
              const Y = (v: number) => lin(v, 0, 7000, 250, 30);
              const y = x.tot ? Y(x.b[1]) : Y(x.y1);
              const h = Math.max(3, (x.tot ? Y(0) : Y(x.y0)) - y);
              const col = x.tot ? "#1B3A5C" : x.b[1] >= 0 ? "#8E1F2F" : "#2E5E4A";
              return (
                <g key={x.b[0]}>
                  <rect x={cx} y={y} width={w} height={h} fill={col} opacity={x.tot ? 0.9 : 0.78} />
                  <text x={cx + w / 2} y={y - 6} fontSize="10.5" fill="#231B12" textAnchor="middle" fontFamily="IBM Plex Mono" fontWeight="600">
                    {x.tot ? nf(x.b[1]) : `${x.b[1] > 0 ? "+" : ""}${x.b[1]}`}
                  </text>
                  <text x={cx + w / 2} y={266} fontSize="9" fill="#7E705E" textAnchor="middle" fontFamily="IBM Plex Mono" transform={`rotate(-38 ${cx + w / 2} 266)`}>
                    {x.b[0]}
                  </text>
                </g>
              );
            })}
            <line x1="14" x2="392" y1="250" y2="250" stroke={t.fg} />
          </svg>
          <div className="mt-4 space-y-2 border-t pt-3" style={{ borderColor: t.rule }}>
            {[["Net cost increase", "+$1,790m"], ["Revenue increase", "+$888m"], ["Incremental margin", "−101% on the increment"], ["Excluding volume", "−$34m of structural saving"]].map(([k, v]) => (
              <div key={k} className="flex justify-between border-b pb-1" style={{ borderColor: t.rule }}>
                <span className="font-mono text-[10px] uppercase tracking-[0.14em]" style={{ color: t.sub }}>{k}</span>
                <span className="tnum font-mono text-[13px]" style={{ color: v.startsWith("−") ? t.up : undefined }}>{v}</span>
              </div>
            ))}
          </div>
          <p className="mt-4 font-display text-[15.5px] italic leading-relaxed" style={{ color: "rgba(35,27,18,0.76)" }}>
            Volume growth costs money; mix and productivity have to out-run it. In FY25 they did not, on a gross basis — but software attach is what pulled the reported gross margin up anyway.
          </p>
        </aside>
      </div>
      <span className="sr-only">{nf(sel.length)}</span>
    </div>
  );
}

export function C81() {
  const nm = "Cost structure breakdown";
  return (
    <>
      <Plate n={81} letter="a" name={nm} variant="Stacked cost columns, share or absolute" tone="paper" caption="Six cost lines stacked as a share of revenue — or as dollars — with click-to-focus: the selected category holds full opacity while the rest recede, and the rail draws its five-year share trend.">
        <P81A />
      </Plate>
      <Plate n={81} letter="b" name={nm} variant="One 100% bar plus a driver bridge" tone="ink" caption="The whole cost base in a single proportional bar, then the decomposition of the year's change: volume and input prices pushing up, mix and productivity pulling down, drawn as a diverging bridge from a centre rule.">
        <P81B />
      </Plate>
      <Plate n={81} letter="c" name={nm} variant="Unit-cost table with a YoY cost waterfall" tone="sand" caption="The dense version: five years per line with share-of-revenue and growth columns, a per-unit strip beneath, and the year-on-year cost change broken into its six drivers in the margin.">
        <P81C />
      </Plate>
    </>
  );
}
