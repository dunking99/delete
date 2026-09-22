import { useState } from "react";
import { Caps, Chip, Plate, Toggle, TONES, lin, poly, smooth, nf } from "@/ui";
import { ANALYSTS, CO, GEO, PEERS, QUARTERS, SEGMENTS } from "@/data";

/* ═══════════════════════ 86 — COMPANY SNAPSHOT ═══════════════════════ */
function S86a() {
  const t = TONES.paper;
  const [tab, setTab] = useState<"about" | "structure">("about");
  return (
    <div className="grid gap-7 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
      <div>
        <div className="flex items-start gap-5">
          <div className="flex h-[64px] w-[64px] shrink-0 items-center justify-center" style={{ background: t.down }}>
            <span className="font-sans text-[30px] font-extrabold" style={{ color: t.bg }}>H</span>
          </div>
          <div className="min-w-0">
            <h3 className="font-display text-[34px] leading-none tracking-tight">{CO.name}</h3>
            <div className="mt-1.5 flex flex-wrap items-center gap-3 font-mono text-[11px]" style={{ color: t.sub }}>
              <span style={{ color: t.down, fontWeight: 600 }}>{CO.exchange}: {CO.ticker}</span>
              <span>ISIN {CO.isin}</span>
              <span>{CO.ccy}</span>
              <span>{CO.hq}</span>
              <span>founded {CO.founded}</span>
            </div>
          </div>
        </div>

        <div className="mt-5 flex gap-1.5">
          {(["about", "structure"] as const).map((k) => (
            <button key={k} onClick={() => setTab(k)} className="px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em]" style={tab === k ? { background: t.fg, color: t.bg } : { border: `1px solid ${t.rule}`, color: t.sub }}>
              {k === "about" ? "What it does" : "Structure"}
            </button>
          ))}
        </div>

        {tab === "about" ? (
          <>
            <p className="mt-3 max-w-[74ch] font-display text-[18px] leading-[1.55]">{CO.desc}</p>
            <p className="mt-2 max-w-[74ch] font-display text-[17px] leading-[1.55]" style={{ color: "rgba(22,18,14,0.72)" }}>
              Halcyon sells into transmission and distribution capital budgets rather than consumer cycles, which is why the order book covers 18 months and why the stock trades on power prices and interconnection queues rather than on retail sentiment.
            </p>
          </>
        ) : (
          <div className="mt-4 space-y-0">
            {[
              ["Halcyon Grid Technologies (parent)", "100%", "NASDAQ: HLG"],
              ["Halcyon Mobility — EV charging", "spun off", "distributed 12 Sep 2023"],
              ["Halcyon Software GmbH", "100%", "substation controls, Berlin"],
              ["Halcyon Power India Pvt", "100%", "Pune plant, opened Feb 2025"],
              ["Voltaric Controls", "100%", "acquired 2016, $410m"],
              ["Dresden Energietechnik", "100%", "green facility, €96m"],
            ].map(([k, v, n]) => (
              <div key={k} className="grid items-baseline gap-3 py-2" style={{ gridTemplateColumns: "minmax(0,1fr) 88px 200px", borderBottom: `1px solid ${t.rule}` }}>
                <span className="text-[14.5px]">{k}</span>
                <span className="tnum text-right font-mono text-[13px]" style={{ color: v === "100%" ? t.fg : t.down }}>{v}</span>
                <span className="font-mono text-[11px]" style={{ color: t.sub }}>{n}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <aside style={{ borderLeft: `1px solid ${t.rule}` }} className="pl-6">
        <div className="flex items-end justify-between">
          <div>
            <Caps style={{ color: t.sub }}>Last price</Caps>
            <div className="tnum font-sans text-[46px] font-extrabold leading-none tracking-[-0.04em]">${CO.price.toFixed(2)}</div>
          </div>
          <div className="text-right">
            <span className="tnum font-sans text-[19px] font-bold" style={{ color: t.up }}>▲ {CO.chgPct.toFixed(2)}%</span>
            <div className="font-mono text-[11px]" style={{ color: t.sub }}>{CO.chg.toFixed(2)} today</div>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-x-5 gap-y-3">
          {[["Market cap", `$${CO.mktCap.toFixed(1)}bn`], ["Enterprise value", `$${CO.ev.toFixed(1)}bn`], ["Sector", "Industrials"], ["Industry", "Electrical equipment"], ["Employees", nf(CO.employees)], ["Shares out", `${CO.shares.toFixed(1)}m`], ["52-week range", `${CO.lo52} – ${CO.hi52}`], ["Avg volume", `${CO.avgVol.toFixed(2)}m`]].map(([k, v]) => (
            <div key={k}>
              <Caps style={{ color: t.sub }}>{k}</Caps>
              <div className="text-[15px] font-semibold leading-tight">{v}</div>
            </div>
          ))}
        </div>
        <div className="mt-5 border-t pt-3" style={{ borderColor: t.rule }}>
          <Caps style={{ color: t.sub }}>Peer set</Caps>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {PEERS.slice(1, 7).map((p) => <Chip key={p.t} t={t}>{p.t}</Chip>)}
          </div>
        </div>
      </aside>
    </div>
  );
}

function S86b() {
  const t = TONES.ink;
  return (
    <div>
      <div className="mb-4 flex flex-wrap items-baseline justify-between gap-4 border-b pb-3" style={{ borderColor: t.rule }}>
        <div className="flex items-baseline gap-4">
          <span className="font-sans text-[44px] font-extrabold leading-none tracking-[-0.045em]">{CO.ticker}</span>
          <span className="font-display text-[24px]" style={{ color: t.sub }}>{CO.name}</span>
        </div>
        <div className="flex items-baseline gap-6">
          <span className="tnum font-sans text-[38px] font-extrabold leading-none" style={{ color: t.up }}>${CO.price.toFixed(2)}</span>
          <span className="tnum font-mono text-[16px]" style={{ color: t.up }}>+{CO.chg} +{CO.chgPct}%</span>
        </div>
      </div>
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
        <div>
          <Caps style={{ color: t.sub }}>Identity</Caps>
          <div className="mt-3 space-y-2.5">
            {[["Exchange", `${CO.exchange} · ${CO.ccy}`], ["ISIN", CO.isin], ["Sector / industry", CO.sector], ["Headquarters", CO.hq], ["Fiscal year end", "31 December"], ["Index membership", "S&P MidCap 400"], ["Report currency", "USD (functional EUR, INR)"]].map(([k, v]) => (
              <div key={k} className="flex justify-between border-b pb-2" style={{ borderColor: t.rule }}>
                <span className="font-mono text-[10px] uppercase tracking-[0.16em]" style={{ color: t.sub }}>{k}</span>
                <span className="text-right font-mono text-[12.5px]">{v}</span>
              </div>
            ))}
          </div>
          <div className="mt-5">
            <Caps style={{ color: t.down }}>Valuation at a glance</Caps>
            <div className="mt-2 grid grid-cols-3 gap-3">
              {[["P/E", `${CO.pe}×`], ["EV/EBITDA", `${CO.evEbitda}×`], ["P/S", `${CO.ps}×`], ["Fwd P/E", `${CO.fwdPe}×`], ["P/B", `${CO.pb}×`], ["Yield", `${CO.divYield}%`]].map(([k, v]) => (
                <div key={k} className="px-2.5 py-2" style={{ background: "rgba(240,233,225,0.05)" }}>
                  <Caps style={{ color: t.sub }}>{k}</Caps>
                  <div className="tnum font-sans text-[20px] font-bold">{v}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div>
          <Caps style={{ color: t.sub }}>The description, in three numbers</Caps>
          <div className="mt-3 grid grid-cols-3 gap-4">
            {[["$4.82bn", "revenue, FY25"], ["+18.6%", "year on year"], ["14,200", "employees"]].map(([v, k]) => (
              <div key={k}>
                <div className="tnum font-sans text-[34px] font-extrabold leading-none tracking-tight" style={{ color: t.down }}>{v}</div>
                <div className="mt-1 font-mono text-[10.5px]" style={{ color: t.sub }}>{k}</div>
              </div>
            ))}
          </div>
          <p className="mt-4 font-display text-[18px] leading-[1.55]">{CO.desc}</p>
          <div className="mt-4 grid grid-cols-2 gap-4 border-t pt-3" style={{ borderColor: t.rule }}>
            {[["Revenue by segment", SEGMENTS.map((s) => s.name.split(" ")[0]).join(" · ")], ["Revenue by region", GEO.slice(0, 3).map((g) => g.name.split(" ")[0]).join(" · ")]].map(([k, v]) => (
              <div key={k}>
                <Caps style={{ color: t.sub }}>{k}</Caps>
                <div className="mt-1 text-[14.5px] leading-snug">{v}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function S86c() {
  const t = TONES.sand;
  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_300px]">
      <div>
        <div className="font-mono text-[10px] uppercase tracking-[0.3em]" style={{ color: t.sub }}>Company file 0417 · Halcyon Grid</div>
        <div className="mt-2 grid items-end gap-5" style={{ gridTemplateColumns: "minmax(0,1fr) auto" }}>
          <h3 className="font-display text-[clamp(34px,5vw,62px)] leading-[0.95] tracking-[-0.02em]">
            Halcyon Grid<br /><span style={{ color: t.down }}>Technologies</span>
          </h3>
          <div className="text-right">
            <div className="tnum font-sans text-[clamp(40px,6vw,72px)] font-extrabold leading-[0.85] tracking-[-0.05em]">
              ${CO.price.toFixed(2)}
            </div>
            <div className="tnum font-mono text-[15px]" style={{ color: t.up }}>▲ {CO.chg} · {CO.chgPct}%</div>
          </div>
        </div>
        <div className="mt-4 h-px w-full" style={{ background: t.fg }} />
        <div className="mt-3 grid grid-cols-2 gap-x-7 gap-y-4 sm:grid-cols-4">
          {[["Ticker", `${CO.exchange}: ${CO.ticker}`], ["Market cap", `$${CO.mktCap.toFixed(1)}bn`], ["Sector", "Industrials"], ["Industry", "Electrical equipment"], ["P/E", `${CO.pe}×`], ["EV/EBITDA", `${CO.evEbitda}×`], ["Dividend yield", `${CO.divYield}%`], ["Beta", CO.beta.toFixed(2)]].map(([k, v]) => (
            <div key={k} className="border-t pt-2" style={{ borderColor: t.rule }}>
              <Caps style={{ color: t.sub }}>{k}</Caps>
              <div className="mt-0.5 text-[17px] font-semibold">{v}</div>
            </div>
          ))}
        </div>
        <p className="mt-5 max-w-[78ch] font-display text-[19px] leading-[1.5]">{CO.desc}</p>
        <p className="mt-3 max-w-[78ch] font-display text-[17px] italic leading-[1.5]" style={{ color: "rgba(35,27,18,0.7)" }}>
          Halcyon is a mid-cap industrial with a software tail: 74% of revenue comes from equipment sold into regulated utility capital budgets, and the fastest-growing quarter of the business is the subscription controls layer that ships with it.
        </p>
      </div>
      <aside style={{ borderLeft: `1px solid ${t.fg}` }} className="pl-6">
        <Caps style={{ color: t.sub }}>At a glance</Caps>
        <div className="mt-3 space-y-2">
          {[["Founded", "1997"], ["Headquarters", CO.hq], ["Employees", nf(CO.employees)], ["Shares out", `${CO.shares.toFixed(1)}m`], ["Float", `${CO.float.toFixed(1)}m`], ["Net debt", `$${CO.netDebt.toFixed(1)}bn`], ["Institutional", `${CO.instOwn}%`], ["Short interest", `${CO.shortPct}%`], ["ESG score", `${CO.esg} / 100`], ["Consensus", "Buy · $214.50"]].map(([k, v]) => (
            <div key={k} className="flex items-baseline justify-between border-b pb-1.5" style={{ borderColor: t.rule }}>
              <span className="font-mono text-[10px] uppercase tracking-[0.16em]" style={{ color: t.sub }}>{k}</span>
              <span className="tnum font-mono text-[13px]">{v}</span>
            </div>
          ))}
        </div>
        <div className="mt-5">
          <Caps style={{ color: t.sub }}>One-year price</Caps>
          <svg width="100%" height="70" viewBox="0 0 240 70" className="mt-1 block">
            <path
              d={smooth(
                Array.from({ length: 52 }, (_, i) => [
                  (i / 51) * 240,
                  62 - (i / 51) * 44 + Math.sin(i * 1.7) * 5,
                ] as [number, number]),
              )}
              fill="none"
              stroke={t.down}
              strokeWidth="2.4"
            />
            <line x1="0" x2="240" y1="64" y2="64" stroke={t.rule} />
            <text x="0" y="69" fontSize="9" fill={t.sub} fontFamily="IBM Plex Mono">Mar '25</text>
            <text x="240" y="69" fontSize="9" fill={t.sub} textAnchor="end" fontFamily="IBM Plex Mono">Mar '26</text>
          </svg>
        </div>
      </aside>
    </div>
  );
}

export function C86() {
  const nm = "Company snapshot";
  return (
    <>
      <Plate n={86} letter="a" name={nm} variant="Identity block, description tabs, valuation rail" tone="paper" caption="Mark, wordmark, identifiers and price in one band; the description switches between what the company does and how it is owned; the right rail carries the headline figures and the peer tickers.">
        <S86a />
      </Plate>
      <Plate n={86} letter="b" name={nm} variant="Terminal header with identity table and six multiples" tone="ink" caption="No prose on the left — identifiers and index membership as a definition list — while the description sits on the right above a two-by-three multiple grid. Reads like a security master record.">
        <S86b />
      </Plate>
      <Plate n={86} letter="c" name={nm} variant="Front-page masthead with an oversized price" tone="sand" caption="The company name at display size against an equally oversized price on the same baseline, a full-width rule beneath, then identifiers in a four-column block and the description in a single editorial measure.">
        <S86c />
      </Plate>
    </>
  );
}

/* ═══════════════════════ 88 — QUARTERLY REVENUE AND EPS ═══════════════════════ */
function Q88a() {
  const t = TONES.paper;
  const [hover, setHover] = useState(7);
  const W = 900, H = 320;
  const X = (i: number) => lin(i, 0, 7, 70, W - 66);
  const maxR = 1500;
  const Y = (v: number) => lin(v, 0, maxR, H - 46, 26);
  const YE = (v: number) => lin(v, 0, 0.5, H - 46, 26);
  const cur = QUARTERS[hover];

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-end justify-between gap-4 border-b pb-3" style={{ borderColor: t.fg }}>
        <div>
          <Caps style={{ color: t.sub }}>Eight reported quarters · revenue bars, diluted EPS line</Caps>
          <div className="mt-0.5 font-display text-[21px] italic">Eight beats on EPS, and the gap to guidance has widened every quarter.</div>
        </div>
        <div className="flex gap-6">
          {[["Latest revenue", `$${QUARTERS[7].rev}m`], ["Latest EPS", `$${QUARTERS[7].eps.toFixed(2)}`], ["Surprise", `+${(((QUARTERS[7].eps - QUARTERS[7].epsG) / QUARTERS[7].epsG) * 100).toFixed(1)}%`], ["8-qtr CAGR", "+17.3%"]].map(([k, v]) => (
            <div key={k}>
              <Caps style={{ color: t.sub }}>{k}</Caps>
              <div className="tnum font-sans text-[21px] font-bold tracking-tight" style={{ color: k === "Surprise" ? t.up : t.fg }}>{v}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_232px]">
        <svg viewBox={`0 0 ${W} ${H}`} width="100%" className="block" onMouseLeave={() => setHover(7)}>
          {[0, 500, 1000, 1500].map((v) => (
            <g key={v}>
              <line x1="70" x2={W - 66} y1={Y(v)} y2={Y(v)} stroke={t.rule} strokeDasharray="2 5" />
              <text x="64" y={Y(v) + 4} fontSize="10" fill={t.sub} textAnchor="end" fontFamily="IBM Plex Mono">{v}</text>
            </g>
          ))}
          {[0, 0.25, 0.5].map((v) => (
            <text key={v} x={W - 60} y={YE(v) + 4} fontSize="10" fill={t.down} fontFamily="IBM Plex Mono">${v.toFixed(2)}</text>
          ))}
          {QUARTERS.map((q, i) => {
            const bw = 62;
            return (
              <g key={q.q} onMouseEnter={() => setHover(i)}>
                <rect x={X(i) - bw / 2 - 8} y="20" width={bw + 16} height={H - 66} fill={hover === i ? "rgba(142,31,47,0.07)" : "transparent"} />
                <rect x={X(i) - bw / 2} y={Y(q.rev)} width={bw} height={Y(0) - Y(q.rev)} fill={hover === i ? t.down : "rgba(142,31,47,0.62)"} />
                <text x={X(i)} y={Y(q.rev) - 7} fontSize="12" fill={t.fg} textAnchor="middle" fontFamily="IBM Plex Mono" fontWeight={hover === i ? 700 : 500}>{q.rev}</text>
                <text x={X(i)} y={H - 28} fontSize="11" fill={hover === i ? t.fg : t.sub} textAnchor="middle" fontFamily="IBM Plex Mono">{q.q}</text>
              </g>
            );
          })}
          <path d={smooth(QUARTERS.map((q, i) => [X(i), YE(q.eps)] as [number, number]))} fill="none" stroke={t.down} strokeWidth="2.8" />
          <path d={smooth(QUARTERS.map((q, i) => [X(i), YE(q.epsG)] as [number, number]))} fill="none" stroke="#1B3A5C" strokeWidth="2" strokeDasharray="6 4" />
          {QUARTERS.map((q, i) => (
            <g key={i}>
              <circle cx={X(i)} cy={YE(q.eps)} r={hover === i ? 6 : 4} fill={t.down} stroke={t.bg} strokeWidth="1.5" />
              <circle cx={X(i)} cy={YE(q.epsG)} r="3" fill="#1B3A5C" />
            </g>
          ))}
          <text x="76" y="34" fontSize="10.5" fill="#1B3A5C" fontFamily="IBM Plex Mono">— guidance</text>
          <text x="164" y="34" fontSize="10.5" fill={t.down} fontFamily="IBM Plex Mono">● reported</text>
          <line x1="70" x2={W - 66} y1={Y(0)} y2={Y(0)} stroke={t.fg} />
        </svg>

        <aside style={{ borderLeft: `1px solid ${t.rule}` }} className="pl-5">
          <Caps style={{ color: t.down }}>{cur.q}</Caps>
          <div className="tnum font-sans text-[40px] font-extrabold leading-none tracking-tight">${cur.rev}m</div>
          <div className="font-mono text-[11px]" style={{ color: t.sub }}>revenue · fiscal quarter</div>
          <div className="mt-4 space-y-2">
            {[["Diluted EPS", `$${cur.eps.toFixed(2)}`], ["Guided EPS", `$${cur.epsG.toFixed(2)}`], ["Surprise", `+${(((cur.eps - cur.epsG) / cur.epsG) * 100).toFixed(1)}%`], ["Gross margin", `${cur.gm.toFixed(1)}%`], ["Implied net income", `$${Math.round(cur.rev * cur.eps / (cur.rev / 1000 * 0)) || Math.round(cur.eps * 365)}m`]].map(([k, v]) => (
            <div key={k} className="flex justify-between border-b pb-1.5" style={{ borderColor: t.rule }}>
              <span className="font-mono text-[10px] uppercase tracking-[0.14em]" style={{ color: t.sub }}>{k}</span>
              <span className="tnum font-mono text-[13px]" style={{ color: k === "Surprise" ? t.up : t.fg }}>{v}</span>
            </div>
          ))}
          </div>
          <div className="mt-4 flex h-[26px] overflow-hidden" style={{ border: `1px solid ${t.rule}` }}>
            <div className="flex items-center justify-center" style={{ width: `${(cur.epsG / cur.eps) * 100}%`, background: "rgba(27,58,92,0.5)" }}>
              <span className="font-mono text-[9.5px]" style={{ color: t.bg }}>guided</span>
            </div>
            <div className="flex items-center justify-center" style={{ flex: 1, background: t.up }}>
              <span className="font-mono text-[9.5px]" style={{ color: t.bg }}>beat</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Q88b() {
  const t = TONES.ink;
  const [metric, setMetric] = useState<"rev" | "eps" | "gm">("rev");
  const rows = [...QUARTERS].reverse();
  return (
    <div>
      <div className="mb-4 flex flex-wrap items-end justify-between gap-4">
        <div>
          <Caps style={{ color: t.sub }}>Halcyon Grid · last eight reported quarters · newest first</Caps>
          <div className="mt-0.5 font-display text-[21px] italic">Every cell carries its own bar, so the trend is visible without a chart.</div>
        </div>
        <Toggle opts={["rev", "eps", "gm"] as const} value={metric} onChange={setMetric} t={t} size="sm" />
      </div>

      <div className="overflow-x-auto scroller">
        <table className="w-full min-w-[760px] border-collapse">
          <thead>
            <tr style={{ borderBottom: `2px solid ${t.fg}` }}>
              <th className="pb-2 text-left"><Caps style={{ color: t.sub }}>Quarter</Caps></th>
              {["Revenue", "YoY", "Gross margin", "EPS", "Guided", "Surprise", "Revs vs cons."].map((h) => (
                <th key={h} className="pb-2 pl-4 text-right"><Caps style={{ color: t.sub }}>{h}</Caps></th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((q, idx) => {
              const i = 7 - idx;
              const yoy = i >= 4 ? ((q.rev / QUARTERS[i - 4].rev - 1) * 100) : ((q.rev / (q.rev * 0.86) - 1) * 100);
              const surprise = ((q.eps - q.epsG) / q.epsG) * 100;
              const mx = 1500;
              const barW = metric === "rev" ? (q.rev / mx) * 100 : metric === "eps" ? (q.eps / 0.5) * 100 : (q.gm / 50) * 100;
              return (
                <tr key={q.q} style={{ borderBottom: `1px solid ${t.rule}` }}>
                  <td className="py-2.5 pr-3 font-mono text-[13px]" style={{ color: idx === 0 ? t.down : "#F0E9E1", fontWeight: idx === 0 ? 700 : 400 }}>
                    {q.q}{idx === 0 && " ★"}
                  </td>
                  <td className="py-2.5 pl-4 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <div className="h-[8px] w-[140px]" style={{ background: "rgba(240,233,225,0.08)" }}>
                        <div className="h-full transition-all duration-500" style={{ width: `${barW}%`, background: idx === 0 ? t.down : "rgba(224,107,107,0.75)" }} />
                      </div>
                      <span className="tnum font-mono text-[13.5px]" style={{ width: 62, textAlign: "right" }}>
                        {metric === "rev" ? `$${q.rev}m` : metric === "eps" ? `$${q.eps.toFixed(2)}` : `${q.gm.toFixed(1)}%`}
                      </span>
                    </div>
                  </td>
                  <td className="tnum py-2.5 pl-4 text-right font-mono text-[13px]" style={{ color: yoy >= 15 ? t.up : "#F0E9E1" }}>+{yoy.toFixed(1)}%</td>
                  <td className="tnum py-2.5 pl-4 text-right font-mono text-[13px]">{q.gm.toFixed(1)}%</td>
                  <td className="tnum py-2.5 pl-4 text-right font-mono text-[13.5px]">${q.eps.toFixed(2)}</td>
                  <td className="tnum py-2.5 pl-4 text-right font-mono text-[13px]" style={{ color: t.sub }}>${q.epsG.toFixed(2)}</td>
                  <td className="py-2.5 pl-4 text-right">
                    <span className="tnum px-2 py-[3px] font-mono text-[12px] font-semibold" style={{ background: "rgba(87,184,148,0.16)", color: t.up }}>
                      +{surprise.toFixed(1)}%
                    </span>
                  </td>
                  <td className="tnum py-2.5 pl-4 text-right font-mono text-[13px]" style={{ color: t.up }}>
                    +{(2.1 + (i % 4) * 0.9).toFixed(1)}%
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-4 border-t pt-3" style={{ borderColor: t.rule }}>
        <div className="flex items-center gap-4">
          <Caps style={{ color: t.sub }}>Eight-quarter record</Caps>
          <span className="font-display text-[17px] italic">8 beats, 0 misses · cumulative surprise +34.6% · average +4.3%</span>
        </div>
        <span className="font-mono text-[10.5px]" style={{ color: t.sub }}>GAAP diluted EPS · estimates as of the evening before each print</span>
      </div>
    </div>
  );
}

function Q88c() {
  const t = TONES.sand;
  const [sel, setSel] = useState(7);
  const cur = QUARTERS[sel];
  return (
    <div>
      <div className="mb-5 border-b-2 pb-3" style={{ borderColor: t.fg }}>
        <div className="font-mono text-[10px] uppercase tracking-[0.28em]" style={{ color: t.sub }}>Quarter by quarter · Halcyon Grid Technologies</div>
        <h3 className="mt-1 font-display text-[clamp(26px,3.4vw,42px)] leading-none tracking-tight">
          Four years, eight prints, one direction
        </h3>
      </div>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)]">
        <div className="grid grid-cols-2 gap-px sm:grid-cols-4" style={{ background: t.rule }}>
          {QUARTERS.map((q, i) => {
            const on = i === sel;
            return (
              <button key={q.q} onClick={() => setSel(i)} className="p-4 text-left transition-colors" style={{ background: on ? t.fg : t.bg, color: on ? t.bg : t.fg }}>
                <div className="font-mono text-[11px] uppercase tracking-[0.18em]" style={{ color: on ? t.bg : t.sub }}>{q.q}</div>
                <div className="tnum mt-1 font-sans text-[30px] font-extrabold leading-none tracking-tight">${q.eps.toFixed(2)}</div>
                <div className="tnum font-mono text-[12px]" style={{ color: on ? t.bg : "rgba(35,27,18,0.7)" }}>${q.rev}m</div>
                <div className="mt-2 flex h-[6px] w-full" style={{ background: on ? "rgba(233,220,196,0.3)" : "rgba(35,27,18,0.1)" }}>
                  <div style={{ width: `${(q.epsG / q.eps) * 100}%`, background: on ? "#E9DCC4" : "#1B3A5C" }} />
                  <div style={{ flex: 1, background: on ? "#E9DCC4" : "#2E5E4A" }} />
                </div>
                <div className="mt-1 font-mono text-[10.5px]" style={{ color: on ? t.bg : t.up }}>
                  +{(((q.eps - q.epsG) / q.epsG) * 100).toFixed(1)}% vs guide
                </div>
              </button>
            );
          })}
        </div>

        <aside style={{ borderLeft: `1px solid ${t.rule}` }} className="pl-6">
          <Caps style={{ color: t.down }}>{cur.q} · reported</Caps>
          <div className="mt-1 grid grid-cols-2 gap-4">
            {[["Revenue", `$${cur.rev}m`], ["Diluted EPS", `$${cur.eps.toFixed(2)}`], ["Guided EPS", `$${cur.epsG.toFixed(2)}`], ["Gross margin", `${cur.gm.toFixed(1)}%`]].map(([k, v]) => (
              <div key={k}>
                <Caps style={{ color: t.sub }}>{k}</Caps>
                <div className="tnum font-sans text-[27px] font-extrabold leading-none tracking-tight">{v}</div>
              </div>
            ))}
          </div>
          <svg width="100%" height="120" viewBox="0 0 320 120" className="mt-4 block">
            {QUARTERS.map((q, i) => {
              const bw = 30;
              const x = 8 + i * 39;
              const h = (q.eps / 0.5) * 84;
              return (
                <g key={q.q} onMouseEnter={() => setSel(i)}>
                  <rect x={x} y={96 - h} width={bw} height={h} fill={i === sel ? t.down : "rgba(35,27,18,0.35)"} />
                  <rect x={x} y={96 - (q.epsG / 0.5) * 84} width={bw} height="3" fill="#1B3A5C" />
                  <text x={x + bw / 2} y={110} fontSize="9" fill={i === sel ? t.fg : t.sub} textAnchor="middle" fontFamily="IBM Plex Mono">{q.q.slice(0, 2)}</text>
                </g>
              );
            })}
            <line x1="4" x2="316" y1="96" y2="96" stroke={t.fg} />
            <text x="4" y="16" fontSize="10" fill={t.sub} fontFamily="IBM Plex Mono">BLUE RULE = GUIDANCE, BAR = REPORTED</text>
          </svg>
          <p className="mt-3 font-display text-[16px] italic leading-relaxed" style={{ color: "rgba(35,27,18,0.76)" }}>
            {cur.gm > 44
              ? "Gross margin above 44% — mix, not price. Storage and controls is carrying the group."
              : "Earlier quarters carried the freight and semiconductor cost spike; every one of them still beat."}
          </p>
        </aside>
      </div>
    </div>
  );
}

export function C88() {
  const nm = "Quarterly revenue and EPS";
  return (
    <>
      <Plate n={88} letter="a" name={nm} variant="Revenue bars with reported and guided EPS lines" tone="paper" caption="Bars for the top line, two lines for EPS — dashed for guidance, solid for the print — so the beat is literally the gap between them. Hover any quarter for its full detail card.">
        <Q88a />
      </Plate>
      <Plate n={88} letter="b" name={nm} variant="Newest-first table with an in-cell bar" tone="ink" caption="Eight quarters as rows, and one metric chosen at a time drawn as a bar inside the revenue cell. The beat is a green chip in the row, not a footnote, and the current quarter is starred in claret.">
        <Q88b />
      </Plate>
      <Plate n={88} letter="c" name={nm} variant="Eight cards on a rule, plus a guidance comparison" tone="sand" caption="Quarters as a grid of tiles that invert when selected, each showing EPS, revenue, the guided/reported split as a two-colour bar and the surprise percentage. The margin panel repeats the comparison as bars with guidance rules.">
        <Q88c />
      </Plate>
    </>
  );
}

/* ═══════════════════════ 91 — GROWTH RATES ═══════════════════════ */
const GROWTH = {
  "Revenue": [18.6, 20.4, 27.7, 16.9, 14.8],
  "Gross profit": [32.2, 30.1, 32.9, 17.1, 16.9],
  "Operating income": [71.6, 64.8, 33.6, 56.0, 28.9],
  "Net income": [84.9, 100.7, 30.9, 66.8, 22.7],
  "Earnings per share": [83.0, 102.6, 30.0, 66.0, 21.4],
  "Operating cash flow": [41.5, 60.6, 40.3, 41.5, 33.4],
  "Free cash flow": [96.6, 135.7, 93.4, 42.7, 26.1],
  "Capital expenditure": [39.2, 34.0, 27.5, 18.4, 21.9],
};

function G91a() {
  const t = TONES.paper;
  const [period, setPeriod] = useState<"1Y" | "3Y" | "5Y">("1Y");
  const [sel, setSel] = useState<string>("Revenue");
  const idx = period === "1Y" ? 0 : period === "3Y" ? 2 : 4;
  const keys = Object.keys(GROWTH) as (keyof typeof GROWTH)[];
  const vals = keys.map((k) => GROWTH[k][idx]);
  const mx = Math.max(...vals.map(Math.abs));
  const mn = Math.min(...vals);

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-end justify-between gap-4 border-b pb-3" style={{ borderColor: t.fg }}>
        <div>
          <Caps style={{ color: t.sub }}>Growth rates · compound and single-period · Halcyon Grid</Caps>
          <div className="mt-0.5 font-display text-[21px] italic">Pick the horizon: one year is noisy, five years is the character.</div>
        </div>
        <Toggle opts={["1Y", "3Y", "5Y"] as const} value={period} onChange={setPeriod} t={t} />
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_264px]">
        <div>
          <div className="space-y-1">
            {keys.map((k) => {
              const v = GROWTH[k][idx];
              const neg = v < 0;
              const w = (Math.abs(v) / mx) * 50;
              return (
                <button
                  key={k}
                  onMouseEnter={() => setSel(k)}
                  onClick={() => setSel(k)}
                  className="grid w-full items-center gap-3 py-1.5 text-left"
                  style={{ gridTemplateColumns: "190px minmax(0,1fr) 84px", borderBottom: `1px solid ${t.rule}`, background: sel === k ? t.soft : "transparent" }}
                >
                  <span className="text-[14.5px]">{k}</span>
                  <span className="relative h-[22px]" style={{ background: "rgba(22,18,14,0.05)" }}>
                    <span className="absolute left-1/2 top-0 h-full w-px" style={{ background: t.fg }} />
                    <span
                      className="absolute top-[3px] h-[16px] transition-all duration-500"
                      style={{ left: neg ? `${50 - w}%` : "50%", width: `${w}%`, background: neg ? t.down : t.up, opacity: sel === k ? 1 : 0.72 }}
                    />
                  </span>
                  <span className="tnum text-right font-mono text-[14px]" style={{ color: neg ? t.down : t.fg, fontWeight: sel === k ? 700 : 400 }}>
                    {v > 0 ? "+" : ""}{v.toFixed(1)}%
                  </span>
                </button>
              );
            })}
          </div>
          <div className="mt-3 grid grid-cols-4 gap-4 border-t pt-3" style={{ borderColor: t.rule }}>
            {(["1Y", "3Y", "5Y"] as const).map((p) => {
              return (
                <div key={p}>
                  <Caps style={{ color: p === period ? t.down : t.sub }}>{p} revenue CAGR</Caps>
                  <div className="tnum font-sans text-[22px] font-bold" style={{ color: p === period ? t.down : t.fg }}>
                    {(((4820 / (p === "1Y" ? 4064 : p === "3Y" ? 3117 : 2684)) ** (1 / (p === "1Y" ? 1 : p === "3Y" ? 3 : 5)) - 1) * 100).toFixed(1)}%
                  </div>
                </div>
              );
            })}
            <div>
              <Caps style={{ color: t.sub }}>Best / worst line</Caps>
              <div className="font-sans text-[16px] font-bold" style={{ color: t.up }}>{keys[vals.indexOf(mx)]}</div>
              <div className="font-mono text-[12px]" style={{ color: t.down }}>{keys[vals.indexOf(mn)]}</div>
            </div>
          </div>
        </div>

        <aside style={{ borderLeft: `1px solid ${t.rule}` }} className="pl-5">
          <Caps style={{ color: t.down }}>{sel}</Caps>
          <div className="mt-1 space-y-2">
            {(["1Y", "3Y", "5Y"] as const).map((p) => {
              const i = p === "1Y" ? 0 : p === "3Y" ? 2 : 4;
              const v = GROWTH[sel as keyof typeof GROWTH][i];
              return (
                <div key={p} className="flex items-baseline justify-between border-b pb-1.5" style={{ borderColor: t.rule }}>
                  <span className="font-mono text-[11px] uppercase tracking-[0.14em]" style={{ color: t.sub }}>{p}</span>
                  <span className="tnum font-sans text-[24px] font-extrabold leading-none" style={{ color: v < 0 ? t.down : t.fg }}>
                    {v > 0 ? "+" : ""}{v.toFixed(1)}%
                  </span>
                </div>
              );
            })}
          </div>
          <svg width="100%" height="110" viewBox="0 0 240 110" className="mt-4 block">
            {[...GROWTH[sel as keyof typeof GROWTH]].reverse().map((v, i) => {
              const bw = 32;
              const x = 14 + i * 46;
              const h = (Math.abs(v) / 140) * 74;
              return (
                <g key={i}>
                  <rect x={x} y={88 - h} width={bw} height={h} fill={v >= 0 ? t.up : t.down} opacity={0.35 + i * 0.2} />
                  <text x={x + bw / 2} y={102} fontSize="9.5" fill={t.sub} textAnchor="middle" fontFamily="IBM Plex Mono">{`FY${25 - i}`}</text>
                  <text x={x + bw / 2} y={84 - h} fontSize="9.5" fill={t.fg} textAnchor="middle" fontFamily="IBM Plex Mono">{v.toFixed(0)}</text>
                </g>
              );
            })}
            <line x1="8" x2="232" y1="88" y2="88" stroke={t.fg} />
          </svg>
          <p className="mt-3 font-display text-[15.5px] italic leading-relaxed" style={{ color: "rgba(22,18,14,0.74)" }}>
            {sel === "Free cash flow"
              ? "Cash flow grows faster than profit in almost every period — the working-capital drag is episodic, not structural."
              : "Compare each line against revenue: anything growing faster than the top line is either operating leverage or mix."}
          </p>
        </aside>
      </div>
    </div>
  );
}

function G91b() {
  const t = TONES.blueprint;
  const keys = Object.keys(GROWTH);
  const [hover, setHover] = useState<string | null>(null);
  const cells = ["1Q", "2Q", "3Q", "4Q", "1Y", "3Y", "5Y"];
  const val = (k: string, c: string) => {
    const base = GROWTH[k as keyof typeof GROWTH];
    if (c === "1Y") return base[0];
    if (c === "3Y") return base[2];
    if (c === "5Y") return base[4];
    const i = cells.indexOf(c);
    return base[4 - (i % 4)] * (0.7 + i * 0.11) - 4 + i * 3;
  };

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-end justify-between gap-4">
        <div>
          <Caps style={{ color: t.sub }}>Growth across eight metrics and seven horizons · %</Caps>
          <div className="mt-0.5 font-display text-[21px] italic">One grid, one colour scale, no axes to read.</div>
        </div>
        <div className="flex items-center gap-2">
          <Caps style={{ color: t.sub }}>Scale</Caps>
          {[-10, 0, 10, 25, 50].map((v) => (
            <span key={v} className="tnum flex h-[24px] w-[44px] items-center justify-center font-mono text-[11px]" style={{ background: cellBg(v), color: v >= 25 ? "#12243A" : "#E6EDF5" }}>{v}</span>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto scroller">
        <table className="w-full min-w-[760px] border-collapse">
          <thead>
            <tr>
              <th className="pb-2 pr-4 text-left"><Caps style={{ color: t.sub }}>Metric</Caps></th>
              {cells.map((c) => (
                <th key={c} className="pb-2 text-center" style={{ width: 86 }}>
                  <span className="font-mono text-[11px] tracking-[0.16em]" style={{ color: t.sub }}>{c}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {keys.map((k) => (
              <tr key={k} onMouseEnter={() => setHover(k)} onMouseLeave={() => setHover(null)} style={{ borderBottom: `1px solid ${t.rule}` }}>
                <td className="py-1 pr-4 text-[13.5px]" style={{ color: hover === k ? "#E6EDF5" : "rgba(230,237,245,0.8)" }}>{k}</td>
                {cells.map((c) => {
                  const v = val(k, c);
                  return (
                    <td key={c} className="p-[3px]">
                      <div className="flex h-[36px] items-center justify-center transition-transform duration-150" style={{ background: cellBg(v), transform: hover === k ? "scale(1.05)" : "none" }}>
                        <span className="tnum font-mono text-[12.5px]" style={{ color: Math.abs(v) >= 25 ? "#12243A" : "#E6EDF5" }}>
                          {v > 0 ? "+" : ""}{v.toFixed(1)}
                        </span>
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-4 border-t pt-3" style={{ borderColor: t.rule }}>
        <p className="max-w-[70ch] font-display text-[15.5px] italic" style={{ color: t.sub }}>
          {hover ? `${hover} — hover off to return to the overview; the darkest cells are the four quarters in which cash flow outran revenue.` : "Point at a row to isolate it across all seven horizons."}
        </p>
        <span className="font-mono text-[10.5px]" style={{ color: t.sub }}>YoY unless marked · TTM for 3Y and 5Y columns</span>
      </div>
    </div>
  );
}
const cellBg = (v: number) =>
  v >= 40 ? "#63C2A6" : v >= 25 ? "rgba(99,194,166,0.6)" : v >= 10 ? "rgba(99,194,166,0.28)" : v >= 0 ? "rgba(230,237,245,0.1)" : "rgba(232,138,122,0.6)";

function G91c() {
  const t = TONES.ink;
  const keys = Object.keys(GROWTH);
  const [mode, setMode] = useState<"rank" | "value">("rank");
  const [hover, setHover] = useState<string | null>(null);
  const hist = [0, 1, 2, 3, 4];
  return (
    <div>
      <div className="mb-4 flex flex-wrap items-end justify-between gap-4">
        <div>
          <Caps style={{ color: t.sub }}>Which line is growing fastest, year by year</Caps>
          <div className="mt-0.5 font-display text-[21px] italic">Rank, not magnitude — the ordering is the insight.</div>
        </div>
        <Toggle opts={["rank", "value"] as const} value={mode} onChange={setMode} t={t} size="sm" />
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_240px]">
        <svg viewBox="0 0 860 340" width="100%" className="block">
          {[0, 1, 2, 3, 4].map((r) => (
            <g key={r}>
              <line x1="196" x2="820" y1={lin(r, 0, 7, 46, 300)} y2={lin(r, 0, 7, 46, 300)} stroke={t.rule} strokeDasharray="2 6" />
              <text x="188" y={lin(r, 0, 7, 46, 300) + 4} fontSize="10" fill={t.sub} textAnchor="end" fontFamily="IBM Plex Mono">#{r + 1}</text>
            </g>
          ))}
          {hist.map((h) => (
            <text key={h} x={lin(h, 0, 4, 220, 800)} y="30" fontSize="11" fill={t.sub} textAnchor="middle" fontFamily="IBM Plex Mono">{`FY${21 + h}`}</text>
          ))}
          {keys.map((k) => {
            const ranksByYear = hist.map((h) => {
              const sorted = [...keys].sort((a, b) => GROWTH[b as keyof typeof GROWTH][h] - GROWTH[a as keyof typeof GROWTH][h]);
              return sorted.indexOf(k);
            });
            const pts = ranksByYear.map((r, h) => [lin(h, 0, 4, 220, 800), lin(r, 0, 7, 46, 300)] as [number, number]);
            const col = ["#63C2A6", "#E6EDF5", "#E88A7A", "#D98324", "#8FA6BE", "#B8404E", "#69C39B", "#8E8B85"][keys.indexOf(k)];
            return (
              <g key={k} onMouseEnter={() => setHover(k)} onMouseLeave={() => setHover(null)} style={{ cursor: "pointer" }}>
                <path d={smooth(pts)} fill="none" stroke={col} strokeWidth={hover === k ? 4 : 2} opacity={hover && hover !== k ? 0.3 : 1} />
                {pts.map((p, i) => (
                  <circle key={i} cx={p[0]} cy={p[1]} r={hover === k ? 5.5 : 3.4} fill={col} opacity={hover && hover !== k ? 0.3 : 1} />
                ))}
                <text x="204" y={pts[0][1] + 4} fontSize="11.5" fill={col} textAnchor="end" fontFamily="IBM Plex Mono" fontWeight={hover === k ? 700 : 400}>
                  {k}
                </text>
                <text x={pts[4][0] + 14} y={pts[4][1] + 4} fontSize="11.5" fill={col} fontFamily="IBM Plex Mono">
                  {mode === "rank" ? `#${ranksByYear[4] + 1}` : `+${GROWTH[k as keyof typeof GROWTH][4].toFixed(1)}%`}
                </text>
              </g>
            );
          })}
        </svg>

        <aside style={{ borderLeft: `1px solid ${t.rule}` }} className="pl-5">
          <Caps style={{ color: t.down }}>{hover ?? "Overview"}</Caps>
          {hover ? (
            <>
              <div className="tnum font-sans text-[40px] font-extrabold leading-none">+{GROWTH[hover as keyof typeof GROWTH][4].toFixed(1)}%</div>
              <div className="font-mono text-[11px]" style={{ color: t.sub }}>latest full year</div>
              <div className="mt-3 space-y-1.5">
                {hist.map((h) => (
                  <div key={h} className="flex justify-between border-b pb-1" style={{ borderColor: t.rule }}>
                    <span className="font-mono text-[11px]" style={{ color: t.sub }}>FY{21 + h}</span>
                    <span className="tnum font-mono text-[13px]">+{GROWTH[hover as keyof typeof GROWTH][h].toFixed(1)}%</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <p className="font-display text-[17px] italic leading-relaxed" style={{ color: t.sub }}>
              Cash flow has sat at or near the top of the ranking in four of five years; capital expenditure sits at the bottom throughout, which is exactly what a company building capacity should look like.
            </p>
          )}
        </aside>
      </div>
    </div>
  );
}

export function C91() {
  const nm = "Growth rates";
  return (
    <>
      <Plate n={91} letter="a" name={nm} variant="Diverging bars around a centre rule, one horizon at a time" tone="paper" caption="Eight measures, positive to the right of the rule and negative to the left, with a 1Y / 3Y / 5Y switch that re-scales the whole set. Selecting a line opens its three horizons and a five-year history in the margin.">
        <G91a />
      </Plate>
      <Plate n={91} letter="b" name={nm} variant="Growth heat grid — metrics by horizon" tone="blueprint" caption="Seven horizons across, eight metrics down, colour carrying magnitude so no axis needs reading. The three long columns deliberately use compound rates, which is why they read cooler than the quarterly columns.">
        <G91b />
      </Plate>
      <Plate n={91} letter="c" name={nm} variant="Rank bump — which line is growing fastest" tone="ink" caption="Magnitude flatters everything in a growth year; ordering does not. Each metric is re-ranked in every year and drawn as a crossing line, with the final rank or the actual rate printed at the right-hand end.">
        <G91c />
      </Plate>
    </>
  );
}

/* ═══════════════════════ 95 — ANALYST RATING SUMMARY ═══════════════════════ */
function R95a() {
  const t = TONES.paper;
  const [tier, setTier] = useState<string>("all");
  const counts = { Buy: 5, Hold: 4, Sell: 1 };
  const total = 10;
  const norm = (r: string) => (r.includes("Over") || r === "Buy" || r === "Outperform" ? "Buy" : r === "Hold" || r === "Market Perform" || r === "Neutral" ? "Hold" : "Sell");
  const rows = ANALYSTS.filter((a) => tier === "all" || norm(a.rating) === tier);

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-end justify-between gap-4 border-b pb-3" style={{ borderColor: t.fg }}>
        <div>
          <Caps style={{ color: t.sub }}>Consensus from {total} covering analysts · as at 18 Mar 2026</Caps>
          <div className="mt-0.5 font-display text-[21px] italic">Consensus rating: Buy — but four of the ten have not changed a rating in a year.</div>
        </div>
        <div className="flex items-center gap-6">
          {[["Buy", counts.Buy, "#2E5E4A"], ["Hold", counts.Hold, "#8A7F73"], ["Sell", counts.Sell, "#8E1F2F"]].map(([k, v, c]) => (
            <div key={k as string} className="text-center">
              <div className="tnum font-sans text-[38px] font-extrabold leading-none" style={{ color: c as string }}>{v as number}</div>
              <div className="font-mono text-[10px] uppercase tracking-[0.16em]" style={{ color: t.sub }}>{k as string}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-5 flex h-[54px] w-full overflow-hidden" style={{ border: `1px solid ${t.fg}` }}>
        {([["Buy", counts.Buy, "#2E5E4A"], ["Hold", counts.Hold, "#8A7F73"], ["Sell", counts.Sell, "#8E1F2F"]] as [string, number, string][]).map(([k, v, c]) => (
          <button
            key={k}
            onClick={() => setTier(tier === k ? "all" : k)}
            className="flex h-full items-center justify-center gap-3 transition-all"
            style={{ width: `${(v / total) * 100}%`, background: tier === k || tier === "all" ? c : "rgba(22,18,14,0.12)", color: t.bg }}
          >
            <span className="font-sans text-[22px] font-extrabold">{((v / total) * 100).toFixed(0)}%</span>
            <span className="font-mono text-[11px] uppercase tracking-[0.16em]">{k}</span>
          </button>
        ))}
      </div>

      <div className="overflow-x-auto scroller">
        <table className="w-full min-w-[700px] border-collapse">
          <thead>
            <tr style={{ borderBottom: `2px solid ${t.fg}` }}>
              {["Firm", "Analyst", "Rating", "Change", "Target", "vs price", "Dated", "Weight"].map((h, i) => (
                <th key={h} className={`pb-2 ${i === 0 || i === 1 ? "text-left" : "text-right"}`}><Caps style={{ color: t.sub }}>{h}</Caps></th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((a) => {
              const n = norm(a.rating);
              const c = n === "Buy" ? "#2E5E4A" : n === "Hold" ? "#8A7F73" : "#8E1F2F";
              const changed = a.rating !== a.prior;
              return (
                <tr key={a.firm} style={{ borderBottom: `1px solid ${t.rule}` }}>
                  <td className="py-2 pr-4">
                    <span className="flex items-center gap-2 text-[14.5px] font-semibold">
                      <span className="h-[9px] w-[9px] rotate-45" style={{ background: c }} />
                      {a.firm}
                    </span>
                  </td>
                  <td className="py-2 pr-4 text-[14px]" style={{ color: "rgba(22,18,14,0.72)" }}>{a.analyst}</td>
                  <td className="py-2 pr-4 text-right">
                    <span className="px-2 py-[3px] font-mono text-[11px] uppercase tracking-[0.12em]" style={{ background: c, color: t.bg }}>{a.rating}</span>
                  </td>
                  <td className="py-2 pr-4 text-right font-mono text-[12px]" style={{ color: changed ? t.down : t.sub }}>
                    {changed ? `from ${a.prior}` : "reiterated"}
                  </td>
                  <td className="tnum py-2 pr-4 text-right font-mono text-[14px] font-semibold">${a.tgt}</td>
                  <td className="tnum py-2 pr-4 text-right font-mono text-[13px]" style={{ color: a.tgt > 187.42 ? t.up : t.down }}>
                    {((a.tgt / 187.42 - 1) * 100).toFixed(1)}%
                  </td>
                  <td className="py-2 pr-4 text-right font-mono text-[12px]" style={{ color: t.sub }}>{a.date}</td>
                  <td className="py-2 pr-1 text-right">
                    <span className="ml-auto block h-[8px]" style={{ width: a.fw * 26, background: "rgba(27,58,92,0.55)" }} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-4 border-t pt-3" style={{ borderColor: t.rule }}>
        <span className="font-mono text-[11px]" style={{ color: t.sub }}>
          {tier === "all" ? "Showing all ten analysts" : `Filtered to ${tier} — click the segment again to clear`}
        </span>
        <span className="font-display text-[16px] italic">Mean target $214.50 · median $220 · range $172 – $255</span>
      </div>
    </div>
  );
}

function R95b() {
  const t = TONES.ink;
  const [showDelta, setShowDelta] = useState(true);
  const buckets = [
    { k: "Strong buy", v: 3, c: "#57B894" },
    { k: "Buy", v: 4, c: "#57B894" },
    { k: "Hold", v: 2, c: "#D98324" },
    { k: "Underperform", v: 1, c: "#E06B6B" },
    { k: "Sell", v: 0, c: "#E06B6B" },
  ];
  const hist = [
    { q: "Q1'24", b: 5, h: 4, s: 1 },
    { q: "Q2'24", b: 5, h: 4, s: 1 },
    { q: "Q3'24", b: 6, h: 3, s: 1 },
    { q: "Q4'24", b: 6, h: 3, s: 1 },
    { q: "Q1'25", b: 7, h: 2, s: 1 },
    { q: "Q2'25", b: 7, h: 2, s: 1 },
    { q: "Q3'25", b: 6, h: 3, s: 1 },
    { q: "Q4'25", b: 5, h: 4, s: 1 },
    { q: "Q1'26", b: 5, h: 4, s: 1 },
  ];

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-end justify-between gap-4">
        <div>
          <Caps style={{ color: t.sub }}>Rating distribution and how it has moved</Caps>
          <div className="mt-0.5 font-display text-[21px] italic">Buys peaked at seven in early 2025 and have drifted back to five.</div>
        </div>
        <button onClick={() => setShowDelta(!showDelta)} className="px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em]" style={{ border: `1px solid ${showDelta ? t.down : t.rule}`, color: showDelta ? t.down : t.sub }}>
          show 12-month change
        </button>
      </div>

      <div className="grid gap-7 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div>
          <div className="grid grid-cols-5 gap-px" style={{ background: t.rule }}>
            {buckets.map((b) => (
              <div key={b.k} className="flex flex-col justify-end p-3" style={{ background: t.bg, height: 168 }}>
                <div className="tnum font-sans text-[34px] font-extrabold leading-none" style={{ color: b.c }}>{b.v}</div>
                <div className="mt-1 font-mono text-[9.5px] uppercase tracking-[0.12em]" style={{ color: t.sub }}>{b.k}</div>
                <div className="mt-2 w-full" style={{ height: b.v * 20, background: b.c, opacity: 0.85 }} />
              </div>
            ))}
          </div>

          <div className="mt-5">
            <Caps style={{ color: t.sub }}>Distribution over nine quarters</Caps>
            <div className="mt-2 space-y-1">
              {hist.map((h) => (
                <div key={h.q} className="grid items-center gap-3" style={{ gridTemplateColumns: "64px minmax(0,1fr) 116px" }}>
                  <span className="tnum font-mono text-[11.5px]" style={{ color: t.sub }}>{h.q}</span>
                  <span className="flex h-[18px] w-full overflow-hidden">
                    <span style={{ width: `${(h.b / 10) * 100}%`, background: "#57B894" }} />
                    <span style={{ width: `${(h.h / 10) * 100}%`, background: "rgba(217,131,36,0.8)" }} />
                    <span style={{ width: `${(h.s / 10) * 100}%`, background: "#E06B6B" }} />
                  </span>
                  <span className="tnum text-right font-mono text-[12px]" style={{ color: t.sub }}>
                    {h.b} buy · {h.h} hold · {h.s} sell
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <aside style={{ borderLeft: `1px solid ${t.rule}` }} className="pl-6">
          <Caps style={{ color: t.down }}>Consensus</Caps>
          <div className="font-sans text-[34px] font-extrabold leading-none tracking-tight">BUY</div>
          <div className="mt-1 font-mono text-[11.5px]" style={{ color: t.sub }}>5 / 4 / 1 · mean score 3.4 of 5</div>

          <div className="mt-4 space-y-2">
            {[["Buy, 12 months ago", "6"], ["Change", "−1"], ["Upgrades, 90d", "1"], ["Downgrades, 90d", "2"], ["Coverage added", "1 (Vireo)"], ["Avg days since action", "63"]].map(([k, v]) => (
              <div key={k} className="flex justify-between border-b pb-1.5" style={{ borderColor: t.rule }}>
                <span className="font-mono text-[10px] uppercase tracking-[0.14em]" style={{ color: t.sub }}>{k}</span>
                <span className="tnum font-mono text-[13px]" style={{ color: v.startsWith("−") ? t.down : "#F0E9E1" }}>{v}</span>
              </div>
            ))}
          </div>

          <div className="mt-5">
            <Caps style={{ color: t.sub }}>Most recent action</Caps>
            <div className="mt-1.5 p-3" style={{ background: "rgba(87,184,148,0.12)" }}>
              <div className="font-sans text-[15px] font-bold">Morgan Keegan · 24 Feb</div>
              <div className="font-mono text-[12px]" style={{ color: "#57B894" }}>Neutral → Overweight · target $214 → $232</div>
            </div>
          </div>
          <p className="mt-4 font-display text-[15.5px] italic leading-relaxed" style={{ color: t.sub }}>
            Two downgrades in ninety days against one upgrade — the consensus rating is stable while the direction of travel is not.
          </p>
        </aside>
      </div>
    </div>
  );
}

function R95c() {
  const t = TONES.sand;
  const [sel, setSel] = useState<string>("all");
  const norm = (r: string) => (r.includes("Over") || r === "Buy" || r === "Outperform" ? "Buy" : r === "Hold" || r === "Market Perform" || r === "Neutral" ? "Hold" : "Sell");
  const shown = ANALYSTS.filter((a) => sel === "all" || norm(a.rating) === sel);

  return (
    <div>
      <div className="border-b-2 pb-4" style={{ borderColor: t.fg }}>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.3em]" style={{ color: t.sub }}>Analyst consensus · Halcyon Grid Technologies</div>
            <div className="mt-2 flex items-baseline gap-5">
              <span className="font-display text-[clamp(48px,8vw,104px)] font-medium leading-[0.8] tracking-[-0.04em]" style={{ color: t.down }}>
                BUY
              </span>
              <div>
                <div className="tnum font-sans text-[30px] font-extrabold leading-none">3.4<span className="text-[18px] font-normal" style={{ color: t.sub }}>/5</span></div>
                <div className="font-mono text-[11px]" style={{ color: t.sub }}>mean of 10 ratings</div>
              </div>
            </div>
          </div>
          <div className="flex gap-1.5">
            {["all", "Buy", "Hold", "Sell"].map((k) => (
              <Chip key={k} t={t} on={sel === k} onClick={() => setSel(k)} color={k === "Buy" ? "#2E5E4A" : k === "Sell" ? "#8E1F2F" : k === "Hold" ? "#8A7F73" : t.fg}>
                {k === "all" ? `All ${ANALYSTS.length}` : `${k} ${ANALYSTS.filter((a) => norm(a.rating) === k).length}`}
              </Chip>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-5 grid gap-0 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((a) => {
          const n = norm(a.rating);
          const c = n === "Buy" ? "#2E5E4A" : n === "Hold" ? "#8A7F73" : "#8E1F2F";
          const changed = a.rating !== a.prior;
          return (
            <div key={a.firm} className="border-b p-5" style={{ borderColor: t.rule, borderRight: `1px solid ${t.rule}` }}>
              <div className="flex items-baseline justify-between">
                <span className="font-display text-[19px] leading-tight">{a.firm}</span>
                <span className="font-mono text-[10.5px]" style={{ color: t.sub }}>{a.date}</span>
              </div>
              <div className="font-mono text-[11px]" style={{ color: t.sub }}>{a.analyst}</div>
              <div className="mt-3 flex items-end justify-between">
                <span className="px-2.5 py-1 font-mono text-[11px] uppercase tracking-[0.14em]" style={{ background: c, color: t.bg }}>{a.rating}</span>
                <span className="tnum font-sans text-[30px] font-extrabold leading-none" style={{ color: a.tgt > 187.42 ? "#2E5E4A" : t.down }}>${a.tgt}</span>
              </div>
              <div className="mt-3 flex items-center justify-between border-t pt-2" style={{ borderColor: t.rule }}>
                <span className="font-mono text-[10.5px]" style={{ color: changed ? t.down : t.sub }}>
                  {changed ? `▲ changed from ${a.prior}` : `reiterated ${a.prior}`}
                </span>
                <span className="tnum font-mono text-[11.5px]">{((a.tgt / 187.42 - 1) * 100).toFixed(0)}%</span>
              </div>
            </div>
          );
        })}
      </div>

      {!shown.length && (
        <div className="py-14 text-center font-display text-[20px] italic" style={{ color: t.sub }}>
          No analyst currently rates Halcyon a {sel.toLowerCase()} — clear the filter to see all ten.
        </div>
      )}

      <div className="mt-5 flex flex-wrap gap-x-8 gap-y-3 border-t-2 pt-4" style={{ borderColor: t.fg }}>
        {[["Consensus", "Buy"], ["Mean target", "$214.50"], ["Implied upside", "+14.5%"], ["Range", "$172 – $255"], ["Ratings changed, 90d", "3 of 10"]].map(([k, v]) => (
          <div key={k}>
            <Caps style={{ color: t.sub }}>{k}</Caps>
            <div className="tnum font-sans text-[24px] font-extrabold tracking-tight">{v}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function C95() {
  const nm = "Analyst rating summary";
  return (
    <>
      <Plate n={95} letter="a" name={nm} variant="Segmented consensus bar that filters the analyst table" tone="paper" caption="The three proportions are also three buttons: click a segment to filter the ten-row table underneath, and click again to clear. Rating normalisation is explicit, and every change of call is flagged in claret.">
        <R95a />
      </Plate>
      <Plate n={95} letter="b" name={nm} variant="Distribution buckets with nine quarters of history" tone="ink" caption="Five rating buckets as vertical columns, then the same distribution drawn as stacked bars quarter by quarter, so a drifting consensus shows up as a colour moving rather than a number changing.">
        <R95b />
      </Plate>
      <Plate n={95} letter="c" name={nm} variant="Display headline with a card for every analyst" tone="sand" caption="The rating set at display size, then one card per covering analyst carrying firm, analyst, rating chip, target and whether the call changed. Filter by tier, and the empty state is written rather than blank.">
        <R95c />
      </Plate>
    </>
  );
}
export { poly };
