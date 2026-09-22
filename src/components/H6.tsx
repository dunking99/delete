import { useMemo, useState } from "react";
import { Caps, Chip, Plate, Toggle, TONES, lin, poly, smooth, nf } from "@/ui";
import { CO, EXPIRIES, STRIKES, chain } from "@/data";

/* ═══════════════════════ 17.a — THE FULL CHAIN ═══════════════════════ */
function A() {
  const t = TONES.bone;
  const [exp, setExp] = useState(3);
  const [side, setSide] = useState<"both" | "calls" | "puts">("both");
  const [hover, setHover] = useState<number | null>(null);
  const iv = 0.412 - exp * 0.018;
  const rows = useMemo(() => chain(STRIKES, EXPIRIES[exp], iv), [exp, iv]);

  const pc = rows.reduce((s, r) => s + r.cOI, 0);
  const pp = rows.reduce((s, r) => s + r.pOI, 0);
  const maxPain = rows.reduce((best, r) => {
    const cost = rows.reduce((s, x) => s + Math.max(0, r.k - x.k) * x.cOI + Math.max(0, x.k - r.k) * x.pOI, 0);
    return cost < best.cost ? { k: r.k, cost } : best;
  }, { k: rows[0].k, cost: Infinity }).k;

  const H = side === "both" ? 3 : 1;

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-end justify-between gap-4 border-b pb-3" style={{ borderColor: t.fg }}>
        <div className="flex flex-wrap items-center gap-1.5">
          <Caps style={{ color: t.sub, marginRight: 6 }}>Expiry</Caps>
          {EXPIRIES.map((e, i) => (
            <button
              key={e}
              onClick={() => setExp(i)}
              className="px-2.5 py-1 font-mono text-[10.5px] transition-all"
              style={{
                border: `1px solid ${exp === i ? t.down : t.rule}`,
                background: exp === i ? t.down : "transparent",
                color: exp === i ? t.bg : t.sub,
              }}
            >
              {e.slice(0, 6)}
              <span className="ml-1.5 opacity-70">{i === 0 ? "2d" : `${(i + 1) * 7}d`}</span>
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-5">
          {[
            ["Put / call ratio", (pp / pc).toFixed(2)],
            ["Max pain", `$${maxPain}`],
            ["IV (ATM)", `${(iv * 100).toFixed(1)}%`],
            ["IV rank", "34 / 100"],
            ["OI change", "+6.2%"],
          ].map(([k, v]) => (
            <div key={k}>
              <Caps style={{ color: t.sub }}>{k}</Caps>
              <div className="tnum font-sans text-[17px] font-bold tracking-tight">{v}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-3 flex items-center gap-3">
        <Toggle opts={["both", "calls", "puts"] as const} value={side} onChange={setSide} t={t} size="sm" />
        <span className="font-mono text-[10px]" style={{ color: t.sub }}>
          HLG ${CO.price.toFixed(2)} · expiry {EXPIRIES[exp]} · multiplier 100
        </span>
        <span className="ml-auto flex gap-4 font-mono text-[10px]" style={{ color: t.sub }}>
          <span>■ in the money</span>
          <span>◆ at the money</span>
        </span>
      </div>

      <div className="overflow-x-auto scroller">
        <table className="w-full min-w-[880px] border-collapse">
          <thead>
            <tr style={{ borderBottom: `2px solid ${t.fg}` }}>
              {side !== "puts" && (
                <>
                  <th className="pb-1.5 pr-2 text-right"><Caps style={{ color: t.down }}>Vol</Caps></th>
                  <th className="pb-1.5 px-2 text-right"><Caps style={{ color: t.down }}>OI</Caps></th>
                  <th className="pb-1.5 px-2 text-right"><Caps style={{ color: t.down }}>IV</Caps></th>
                  <th className="pb-1.5 pl-2 text-right"><Caps style={{ color: t.down }}>Bid / Ask</Caps></th>
                  <th className="pb-1.5 px-3 text-center" style={{ width: 86 }}>
                    <Caps style={{ color: t.sub }}>Strike</Caps>
                  </th>
                </>
              )}
              {side !== "calls" && (
                <>
                  <th className="pb-1.5 pr-2 text-left"><Caps style={{ color: "#1B3A5C" }}>Bid / Ask</Caps></th>
                  <th className="pb-1.5 px-2 text-right"><Caps style={{ color: "#1B3A5C" }}>IV</Caps></th>
                  <th className="pb-1.5 px-2 text-right"><Caps style={{ color: "#1B3A5C" }}>OI</Caps></th>
                  <th className="pb-1.5 pl-2 text-right"><Caps style={{ color: "#1B3A5C" }}>Vol</Caps></th>
                </>
              )}
            </tr>
            <tr style={{ borderBottom: `1px solid ${t.rule}` }}>
              {side !== "puts" && <th colSpan={4} className="pb-1 text-center"><span className="font-display text-[15px] italic" style={{ color: t.down }}>Calls</span></th>}
              {side !== "puts" && <th />}
              {side !== "calls" && <th />}
              {side !== "calls" && <th colSpan={4} className="pb-1 text-center"><span className="font-display text-[15px] italic" style={{ color: "#1B3A5C" }}>Puts</span></th>}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => {
              const on = hover === r.k;
              const moneyness = r.k === maxPain;
              const cell = (v: string, itm: boolean, align: "l" | "r") => (
                <td
                  className={`tnum py-[6px] font-mono text-[12.5px] ${align === "l" ? "pl-2" : "pr-2 text-right"}`}
                  style={{ background: itm ? "rgba(27,58,92,0.07)" : "transparent", color: itm ? t.fg : "rgba(22,18,14,0.72)" }}
                >
                  {v}
                </td>
              );
              return (
                <tr
                  key={r.k}
                  onMouseEnter={() => setHover(r.k)}
                  onMouseLeave={() => setHover(null)}
                  style={{ borderBottom: `1px solid ${t.rule}`, background: on ? "rgba(142,31,47,0.07)" : "transparent" }}
                >
                  {side !== "puts" && (
                    <>
                      {cell(nf(r.cVol), false, "r")}
                      <td className="tnum px-2 py-[6px] text-right font-mono text-[12.5px]" style={{ background: "rgba(27,58,92,0.07)" }}>
                        <span className="inline-block h-[7px]" style={{ width: Math.max(3, (r.cOI / 22000) * 46), background: "#1B3A5C", opacity: 0.65, verticalAlign: "middle", marginRight: 6 }} />
                        {nf(r.cOI)}
                      </td>
                      {cell(r.cIV.toFixed(3), false, "r")}
                      {cell(`${r.cBid.toFixed(2)} / ${r.cAsk.toFixed(2)}`, r.k < CO.price, "r")}
                    </>
                  )}
                  <td className="px-3 py-[6px] text-center" style={{ background: moneyness ? "rgba(142,31,47,0.16)" : "rgba(22,18,14,0.05)" }}>
                    <span className="tnum font-sans text-[14px] font-bold" style={{ color: moneyness ? t.down : t.fg }}>
                      {r.k}
                    </span>
                    {Math.abs(r.k - CO.price) < 3 && <span className="ml-1 text-[9px]" style={{ color: t.down }}>◆</span>}
                  </td>
                  {side !== "calls" && (
                    <>
                      {cell(`${r.pBid.toFixed(2)} / ${r.pAsk.toFixed(2)}`, r.k > CO.price, "l")}
                      {cell(r.pIV.toFixed(3), false, "r")}
                      <td className="tnum px-2 py-[6px] text-right font-mono text-[12.5px]" style={{ background: "rgba(27,58,92,0.07)" }}>
                        {nf(r.pOI)}
                        <span className="ml-1.5 inline-block h-[7px]" style={{ width: Math.max(3, (r.pOI / 18000) * 46), background: "#8E1F2F", opacity: 0.6, verticalAlign: "middle" }} />
                      </td>
                      {cell(nf(r.pVol), false, "r")}
                    </>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-3 border-t pt-2" style={{ borderColor: t.rule }}>
        <span className="font-display text-[14.5px] italic" style={{ color: t.sub }}>
          Open interest concentrates at 180 and 200 — the market is positioning for a $20 move either side of the print.
        </span>
        <div className="flex gap-2">
          {["Chain", "Strategy", "Calendar"].map((b, i) => (
            <span key={b} className="px-2.5 py-1 font-mono text-[9.5px] uppercase tracking-[0.14em]" style={i === 0 ? { background: t.fg, color: t.bg } : { border: `1px solid ${t.rule}`, color: t.sub }}>{b}</span>
          ))}
        </div>
      </div>
      <span className="sr-only">{H}</span>
    </div>
  );
}

/* ═══════════════════════ 17.b — OI PROFILE + SKEW ═══════════════════════ */
function P17B() {
  const t = TONES.ink;
  const [exp, setExp] = useState(3);
  const [hover, setHover] = useState<number | null>(null);
  const iv = 0.412 - exp * 0.018;
  const rows = chain(STRIKES, EXPIRIES[exp], iv);
  const maxOI = Math.max(...rows.map((r) => Math.max(r.cOI, r.pOI)));
  const W = 760, H = 300;
  const lo = 148, hi = 222;
  const X = (v: number) => lin(v, lo, hi, 96, W - 96);

  const maxPain = rows.reduce((best, r) => {
    const cost = rows.reduce((s, x) => s + Math.max(0, r.k - x.k) * x.cOI + Math.max(0, x.k - r.k) * x.pOI, 0);
    return cost < best.cost ? { k: r.k, cost } : best;
  }, { k: rows[0].k, cost: Infinity }).k;

  const skew = rows.map((r) => ({ k: r.k, iv: (r.cIV + r.pIV) / 2 }));
  const ivLo = Math.min(...skew.map((s) => s.iv)), ivHi = Math.max(...skew.map((s) => s.iv));

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-1.5">
          {EXPIRIES.map((e, i) => (
            <button key={e} onClick={() => setExp(i)} className="px-3 py-1 font-mono text-[10.5px]" style={{ border: `1px solid ${exp === i ? t.down : t.rule}`, background: exp === i ? t.down : "transparent", color: exp === i ? t.bg : t.sub }}>
              {e.slice(0, 6)}
            </button>
          ))}
        </div>
        <div className="flex gap-6">
          {[
            ["Total call OI", nf(rows.reduce((s, r) => s + r.cOI, 0))],
            ["Total put OI", nf(rows.reduce((s, r) => s + r.pOI, 0))],
            ["Max pain", `$${maxPain}`],
          ].map(([k, v]) => (
            <div key={k}>
              <Caps style={{ color: t.sub }}>{k}</Caps>
              <div className="tnum font-sans text-[18px] font-bold">{v}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-7 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
        <div>
          <Caps style={{ color: t.sub }}>Open interest by strike · puts left, calls right</Caps>
          <svg viewBox={`0 0 ${W} ${H}`} width="100%" className="mt-2 block">
            <rect x={X(CO.price) - 26} y="6" width="52" height={H - 44} fill={t.down} opacity="0.12" />
            <text x={X(CO.price)} y="18" fontSize="9.5" fill={t.down} textAnchor="middle" fontFamily="IBM Plex Mono">ATM</text>
            {rows.map((r, i) => {
              const y = 24 + i * 17.6;
              const cw = (r.cOI / maxOI) * (W / 2 - 96);
              const pw = (r.pOI / maxOI) * (W / 2 - 96);
              const on = hover === r.k;
              return (
                <g key={r.k} onMouseEnter={() => setHover(r.k)} onMouseLeave={() => setHover(null)}>
                  <rect x="0" y={y - 8} width={W} height="16" fill={on ? "rgba(240,233,225,0.07)" : "transparent"} />
                  <rect x={X(r.k) - pw} y={y - 6} width={pw} height="12" fill={t.down} opacity={on ? 1 : 0.72} />
                  <rect x={X(r.k)} y={y - 6} width={cw} height="12" fill={t.up} opacity={on ? 1 : 0.72} />
                  <rect x={X(r.k) - 21} y={y - 7} width="42" height="14" fill="#0E1014" />
                  <text x={X(r.k)} y={y + 4} fontSize="11" fill={r.k === maxPain ? t.down : "#F0E9E1"} textAnchor="middle" fontFamily="IBM Plex Mono" fontWeight={r.k === maxPain ? 700 : 400}>
                    {r.k}
                  </text>
                  {on && (
                    <>
                      <text x={X(r.k) - pw - 6} y={y + 4} fontSize="10.5" fill={t.down} textAnchor="end" fontFamily="IBM Plex Mono">{nf(r.pOI)}</text>
                      <text x={X(r.k) + cw + 6} y={y + 4} fontSize="10.5" fill={t.up} fontFamily="IBM Plex Mono">{nf(r.cOI)}</text>
                    </>
                  )}
                </g>
              );
            })}
            <line x1={X(maxPain)} x2={X(maxPain)} y1="6" y2={H - 20} stroke={t.down} strokeWidth="1.4" strokeDasharray="5 4" />
            <text x={X(maxPain)} y={H - 6} fontSize="10" fill={t.down} textAnchor="middle" fontFamily="IBM Plex Mono">max pain {maxPain}</text>
          </svg>
        </div>

        <div style={{ borderLeft: `1px solid ${t.rule}` }} className="pl-6">
          <Caps style={{ color: t.sub }}>Implied volatility smile · strike against IV</Caps>
          <svg viewBox="0 0 300 214" width="100%" className="mt-2 block">
            {[0, 0.25, 0.5, 0.75, 1].map((f) => (
              <line key={f} x1="34" x2="292" y1={14 + f * 158} y2={14 + f * 158} stroke={t.rule} strokeDasharray="2 4" />
            ))}
            {[ivHi, (ivHi + ivLo) / 2, ivLo].map((v) => (
              <text key={v} x="30" y={lin(v, ivLo - 0.01, ivHi + 0.01, 172, 14) + 4} fontSize="9.5" fill={t.sub} textAnchor="end" fontFamily="IBM Plex Mono">{(v * 100).toFixed(0)}%</text>
            ))}
            <path d={smooth(skew.map((s) => [X2(s.k, lo, hi, 34, 292), lin(s.iv, ivLo - 0.01, ivHi + 0.01, 172, 14)] as [number, number]))} fill="none" stroke={t.up} strokeWidth="2.2" />
            {skew.map((s) => (
              <circle key={s.k} cx={X2(s.k, lo, hi, 34, 292)} cy={lin(s.iv, ivLo - 0.01, ivHi + 0.01, 172, 14)} r={hover === s.k ? 5 : 3} fill={hover === s.k ? t.down : "#F0E9E1"} />
            ))}
            <line x1={X2(CO.price, lo, hi, 34, 292)} x2={X2(CO.price, lo, hi, 34, 292)} y1="14" y2="172" stroke={t.down} strokeWidth="1" />
            <line x1="34" x2="292" y1="172" y2="172" stroke={t.rule} />
            {[150, 170, 190, 210, 220].map((k) => (
              <text key={k} x={X2(k, lo, hi, 34, 292)} y="188" fontSize="9.5" fill={t.sub} textAnchor="middle" fontFamily="IBM Plex Mono">{k}</text>
            ))}
            <text x="163" y="206" fontSize="9.5" fill={t.sub} textAnchor="middle" fontFamily="IBM Plex Mono" letterSpacing="1.4">STRIKE</text>
            <text x="12" y="96" fontSize="9.5" fill={t.sub} textAnchor="middle" fontFamily="IBM Plex Mono" letterSpacing="1.4" transform="rotate(-90 12 96)">IMPLIED VOL</text>
          </svg>
          <div className="mt-3 space-y-2 border-t pt-3" style={{ borderColor: t.rule }}>
            {[
              ["25Δ put / call skew", "+4.2 vol pts"],
              ["Front-month IV", `${(iv * 100).toFixed(1)}%`],
              ["30-day realised", "36.8%"],
              ["Vol of vol", "0.91"],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between">
                <span className="font-mono text-[10px] uppercase tracking-[0.14em]" style={{ color: t.sub }}>{k}</span>
                <span className="tnum font-mono text-[12.5px]">{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
const X2 = (v: number, lo: number, hi: number, a: number, b: number) => lin(v, lo, hi, a, b);

/* ═══════════════════════ 17.c — STRATEGY BUILDER ═══════════════════════ */
function P17C() {
  const t = TONES.sand;
  const [legs, setLegs] = useState<{ k: number; type: "C" | "P"; dir: 1 | -1 }[]>([
    { k: 185, type: "C", dir: 1 },
    { k: 205, type: "C", dir: -1 },
  ]);
  const [exp] = useState(3);
  const iv = 0.412 - exp * 0.018;
  const rows = chain(STRIKES, EXPIRIES[exp], iv);
  const price = (k: number, type: "C" | "P") => {
    const r = rows.find((x) => x.k === k)!;
    return type === "C" ? (r.cBid + r.cAsk) / 2 : (r.pBid + r.pAsk) / 2;
  };
  const net = legs.reduce((s, l) => s - l.dir * price(l.k, l.type), 0);
  const payoff = (at: number) => legs.reduce((s, l) => s + l.dir * (l.type === "C" ? Math.max(0, at - l.k) : Math.max(0, l.k - at)), 0) + net;
  const breakevens = STRIKES.filter((k) => Math.sign(payoff(k)) !== Math.sign(payoff(k + 5)));
  const maxProfit = Math.max(...STRIKES.map(payoff));
  const maxLoss = Math.min(...STRIKES.map(payoff));

  const toggle = (k: number, type: "C" | "P") =>
    setLegs((ls) => (ls.some((l) => l.k === k && l.type === type) ? ls.filter((l) => !(l.k === k && l.type === type)) : [...ls, { k, type, dir: 1 }]));

  const W = 780, H = 220;
  const LO = 145, HI = 230;
  const X = (v: number) => lin(v, LO, HI, 44, W - 18);
  const YL = Math.min(maxLoss, -20), YH = Math.max(maxProfit, 20);
  const Y = (v: number) => lin(v, YL, YH, H - 30, 14);

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-end justify-between gap-4 border-b-2 pb-3" style={{ borderColor: t.fg }}>
        <div>
          <Caps style={{ color: t.sub }}>Strategy desk · {EXPIRIES[exp]} · click strikes to add or drop a leg</Caps>
          <div className="mt-0.5 font-display text-[24px] italic">
            {legs.length === 0 ? "No legs yet — pick a strike" : `${legs.map((l) => (l.dir > 0 ? "Buy" : "Sell")).join(" ")} ${legs.map((l) => `${l.k}${l.type}`).join(" / ")}`}
          </div>
        </div>
        <div className="flex gap-6">
          {[
            ["Debit / credit", `${net >= 0 ? "debit" : "credit"} $${Math.abs(net).toFixed(2)}`],
            ["Breakeven", breakevens.length ? `$${breakevens[0]}` : "—"],
            ["Max profit", `$${maxProfit.toFixed(0)}`],
            ["Max loss", `$${maxLoss.toFixed(0)}`],
          ].map(([k, v]) => (
            <div key={k}>
              <Caps style={{ color: t.sub }}>{k}</Caps>
              <div className="tnum font-sans text-[19px] font-bold tracking-tight" style={{ color: k === "Max loss" ? "#8E1F2F" : k === "Max profit" ? "#2E5E4A" : t.fg }}>{v}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-7 lg:grid-cols-[minmax(0,1fr)_330px]">
        <div>
          <Caps style={{ color: t.sub }}>Profit / loss at expiry · per share</Caps>
          <svg viewBox={`0 0 ${W} ${H}`} width="100%" className="mt-2 block">
            <rect x={X(LO)} y={Y(0)} width={X(HI) - X(LO)} height={Math.max(0, Y(YL) - Y(0))} fill="#8E1F2F" opacity="0.07" />
            <rect x={X(LO)} y={Y(YH)} width={X(HI) - X(LO)} height={Math.max(0, Y(0) - Y(YH))} fill="#2E5E4A" opacity="0.07" />
            <line x1={X(LO)} x2={X(HI)} y1={Y(0)} y2={Y(0)} stroke={t.fg} strokeWidth="1.4" />
            {STRIKES.map((k) => (
              <g key={k}>
                <line x1={X(k)} x2={X(k)} y1={Y(0) - 4} y2={Y(0) + 4} stroke={t.rule} />
                <text x={X(k)} y={H - 14} fontSize="10" fill={t.sub} textAnchor="middle" fontFamily="IBM Plex Mono">{k}</text>
              </g>
            ))}
            <path d={poly(STRIKES.map((k) => [X(k), Y(payoff(k))] as [number, number]))} fill="none" stroke={t.fg} strokeWidth="2.6" />
            {legs.map((l, i) => (
              <g key={i}>
                <line x1={X(l.k)} x2={X(l.k)} y1="14" y2={H - 30} stroke={l.dir > 0 ? "#2E5E4A" : "#8E1F2F"} strokeDasharray="4 4" strokeWidth="1.2" />
                <circle cx={X(l.k)} cy={Y(payoff(l.k))} r="5" fill={l.dir > 0 ? "#2E5E4A" : "#8E1F2F"} />
              </g>
            ))}
            <line x1={X(CO.price)} x2={X(CO.price)} y1="14" y2={H - 30} stroke="#1B3A5C" strokeWidth="1.6" />
            <text x={X(CO.price)} y="12" fontSize="10" fill="#1B3A5C" textAnchor="middle" fontFamily="IBM Plex Mono">spot {CO.price.toFixed(0)}</text>
            <text x="40" y={Y(0) - 6} fontSize="9.5" fill="#2E5E4A" fontFamily="IBM Plex Mono">$0</text>
          </svg>

          <div className="mt-4">
            <Caps style={{ color: t.sub }}>Select legs</Caps>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {STRIKES.filter((k) => k >= 165 && k <= 215).map((k) => (
                <button
                  key={k}
                  onClick={() => toggle(k, "C")}
                  className="px-2.5 py-1 font-mono text-[11px] transition-all"
                  style={{
                    border: `1px solid ${legs.some((l) => l.k === k) ? t.fg : t.rule}`,
                    background: legs.some((l) => l.k === k) ? t.fg : "transparent",
                    color: legs.some((l) => l.k === k) ? t.bg : t.sub,
                  }}
                >
                  {k}C
                </button>
              ))}
            </div>
            <div className="mt-2 flex gap-2">
              <button onClick={() => setLegs([])} className="px-3 py-1 font-mono text-[10px] uppercase tracking-[0.16em]" style={{ border: `1px solid ${t.rule}`, color: t.sub }}>Clear</button>
              <button onClick={() => setLegs([{ k: 185, type: "C", dir: 1 }, { k: 205, type: "C", dir: -1 }])} className="px-3 py-1 font-mono text-[10px] uppercase tracking-[0.16em]" style={{ border: `1px solid ${t.rule}`, color: t.sub }}>Bull spread</button>
              <button onClick={() => setLegs([{ k: 185, type: "P", dir: 1 }, { k: 170, type: "P", dir: -1 }])} className="px-3 py-1 font-mono text-[10px] uppercase tracking-[0.16em]" style={{ border: `1px solid ${t.rule}`, color: t.sub }}>Put spread</button>
            </div>
          </div>
        </div>

        <div style={{ borderLeft: `1px solid ${t.rule}` }} className="pl-6">
          <Caps style={{ color: t.sub }}>Chain · {EXPIRIES[exp]}</Caps>
          <div className="mt-2 max-h-[330px] overflow-y-auto scroller pr-1">
            <table className="w-full border-collapse">
              <thead>
                <tr style={{ borderBottom: `1px solid ${t.fg}` }}>
                  <th className="pb-1 text-left"><Caps style={{ color: t.sub }}>Strike</Caps></th>
                  <th className="pb-1 text-right"><Caps style={{ color: t.sub }}>Call</Caps></th>
                  <th className="pb-1 text-right"><Caps style={{ color: t.sub }}>Put</Caps></th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => {
                  const active = legs.some((l) => l.k === r.k);
                  return (
                    <tr key={r.k} style={{ borderBottom: `1px solid ${t.rule}`, background: active ? "rgba(142,31,47,0.1)" : "transparent" }}>
                      <td className="py-[5px]">
                        <button onClick={() => toggle(r.k, "C")} className="tnum font-sans text-[13.5px] font-bold" style={{ color: active ? "#8E1F2F" : t.fg, textDecoration: active ? "underline" : "none", textUnderlineOffset: 3 }}>
                          {r.k}
                        </button>
                      </td>
                      <td className="py-[5px] text-right">
                        <button onClick={() => toggle(r.k, "C")} className="tnum font-mono text-[12.5px]" style={{ color: legs.some((l) => l.k === r.k && l.type === "C") ? "#2E5E4A" : "rgba(35,27,18,0.78)" }}>
                          {r.cAsk.toFixed(2)}
                        </button>
                      </td>
                      <td className="py-[5px] text-right">
                        <button onClick={() => toggle(r.k, "P")} className="tnum font-mono text-[12.5px]" style={{ color: legs.some((l) => l.k === r.k && l.type === "P") ? "#1B3A5C" : "rgba(35,27,18,0.78)" }}>
                          {r.pAsk.toFixed(2)}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="mt-3 font-display text-[14px] italic leading-relaxed" style={{ color: "rgba(35,27,18,0.7)" }}>
            Every price in the payoff above is the mid of the quote shown here, so the diagram and the chain can never disagree.
          </p>
        </div>
      </div>
    </div>
  );
}

export function C17() {
  const nm = "Options chain";
  return (
    <>
      <Plate n={17} letter="a" name={nm} variant="Two-sided chain with max pain and put/call summary" tone="bone" caption="The classic, done properly: expiry chips, calls and puts mirrored around a struck-through strike column, in-the-money shading, horizontal OI bars inside the cells, and max pain computed from the live order book rather than quoted from a vendor.">
        <A />
      </Plate>
      <Plate n={17} letter="b" name={nm} variant="Open-interest profile and volatility smile" tone="ink" caption="Positioning instead of pricing: puts diverge left, calls right, from a shared strike axis, with max pain ruled through the whole stack and the IV smile plotted alongside on its own axis. Hovering any strike lights it in both charts.">
        <P17B />
      </Plate>
      <Plate n={17} letter="c" name={nm} variant="Strategy builder — click strikes, read the payoff" tone="sand" caption="Turns the chain into an instrument: click any strike to add a leg, watch the profit/loss diagram, breakeven, max profit and max loss recompute from mid-prices, and jump straight into a bull or put spread with one button.">
        <P17C />
      </Plate>
    </>
  );
}

/* ═══════════════════════ shared history for plate 26 ═══════════════════════ */
type Ev = { y: number; date: string; t: string; d: string; kind: string; px: number | null; move?: number };

const EVS: Ev[] = [
  { y: 1997, date: "Jun 1997", t: "Halcyon Power Electronics incorporated", d: "Founded in Reading, Pennsylvania by R. Halcyon and three engineers from Schenectady.", kind: "corporate", px: null },
  { y: 2004, date: "Mar 2004", t: "First utility-scale order", d: "A PJM transmission operator selects the H-200 inverter — $6.4m over four years.", kind: "product", px: null },
  { y: 2010, date: "14 Oct 2010", t: "IPO on NASDAQ", d: "12.5m shares priced at $14.00, raising $161m. First trade at $17.40.", kind: "capital", px: 17.4, move: 24.3 },
  { y: 2013, date: "22 Aug 2013", t: "Two-for-one stock split", d: "Split effected to bring the share price below $40 and widen the holder base.", kind: "capital", px: 31.2, move: 0 },
  { y: 2016, date: "09 Feb 2016", t: "Acquisition of Voltaric Controls", d: "$410m in cash and stock; adds the substation software business that is now 26% of revenue.", kind: "ma", px: 44.6, move: 8.1 },
  { y: 2018, date: "18 May 2018", t: "European hub opens in Dresden", d: "€180m plant, 900 employees — first manufacturing outside the United States.", kind: "operations", px: 61.8, move: 1.4 },
  { y: 2020, date: "26 Mar 2020", t: "COVID demand shock", d: "Q2'20 revenue falls 31% year on year; 9% of the workforce is furloughed or let go.", kind: "crisis", px: 34.1, move: -19.7 },
  { y: 2021, date: "07 Sep 2021", t: "Frostline short-seller report", d: "Alleges channel stuffing at two distributors. Stock falls 24% in a session; company refutes four days later.", kind: "crisis", px: 71.3, move: -24.0 },
  { y: 2022, date: "11 Apr 2022", t: "Ohio gigafactory announced", d: "$620m investment, 1,400 jobs, production from 2024. Funded entirely from operations and a term loan.", kind: "operations", px: 78.4, move: 5.2 },
  { y: 2023, date: "12 Sep 2023", t: "Spin-off of Halcyon Mobility", d: "EV charging division distributed to shareholders; HLG holders received one MOBL share for every six.", kind: "corporate", px: 96.7, move: -3.8 },
  { y: 2024, date: "23 Jul 2024", t: "Arden Supply agreement signed", d: "Five-year, $1.1bn supply agreement — the single largest contract in company history.", kind: "ma", px: 131.9, move: 11.6 },
  { y: 2025, date: "06 Feb 2025", t: "Pune plant opens", d: "Second Asia facility starts production eight weeks early; group capacity up 34%.", kind: "operations", px: 148.2, move: 4.4 },
  { y: 2026, date: "12 Feb 2026", t: "H-Series grid-forming launch", d: "Next-generation platform released with an $840m initial backlog; FY25 guidance beaten.", kind: "product", px: 187.4, move: 6.9 },
];

const KINDS: Record<string, { c: string; lab: string }> = {
  corporate: { c: "#8A7F73", lab: "Corporate" },
  product: { c: "#D98324", lab: "Product" },
  capital: { c: "#1B3A5C", lab: "Capital markets" },
  ma: { c: "#2E5E4A", lab: "M&A" },
  operations: { c: "#8E1F2F", lab: "Operations" },
  crisis: { c: "#5C1420", lab: "Crisis" },
};

// monthly-ish price path 2010 → 2026 for the timeline plates
const PATH: { x: number; p: number }[] = (() => {
  const anchors: [number, number][] = [
    [2010.0, 17.4], [2010.9, 24.1], [2011.9, 26.8], [2012.9, 21.3], [2013.9, 31.6], [2014.9, 37.2],
    [2015.9, 34.8], [2016.9, 47.9], [2017.9, 55.4], [2018.9, 66.1], [2019.9, 79.4], [2020.25, 41.2],
    [2020.9, 74.6], [2021.15, 92.4], [2021.7, 118.3], [2021.95, 74.1], [2022.4, 66.8], [2022.95, 88.5],
    [2023.4, 104.2], [2023.95, 92.7], [2024.4, 118.9], [2024.95, 142.6], [2025.45, 158.4], [2025.95, 174.2],
    [2026.2, 187.42],
  ];
  const out: { x: number; p: number }[] = [];
  for (let i = 0; i < anchors.length - 1; i++) {
    const [x0, p0] = anchors[i], [x1, p1] = anchors[i + 1];
    for (let s = 0; s < 6; s++) {
      const f = s / 6;
      out.push({ x: x0 + (x1 - x0) * f, p: p0 + (p1 - p0) * f + Math.sin((x0 + (x1 - x0) * f) * 11) * p0 * 0.035 });
    }
  }
  out.push({ x: 2026.2, p: 187.42 });
  return out;
})();

/* ═══════════════════════ 26.a — FLAG CHART ═══════════════════════ */
function P26A() {
  const t = TONES.paper;
  const [sel, setSel] = useState<Ev>(EVS[10]);
  const [kinds, setKinds] = useState<string[]>(Object.keys(KINDS));
  const W = 960, H = 400;
  const X = (x: number) => lin(x, 2010, 2026.4, 54, W - 24);
  const Y = (p: number) => lin(p, 0, 200, H - 44, 26);
  const shown = EVS.filter((e) => e.px !== null && kinds.includes(e.kind));

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-end justify-between gap-4">
        <div>
          <Caps style={{ color: t.sub }}>Halcyon Grid Technologies · sixteen years of the share price and what caused it</Caps>
          <div className="mt-0.5 font-display text-[22px] italic">Every flag is a day the company changed shape.</div>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {Object.entries(KINDS).map(([k, v]) => (
            <Chip key={k} t={t} on={kinds.includes(k)} onClick={() => setKinds((o) => (o.includes(k) ? o.filter((x) => x !== k) : [...o, k]))} color={v.c}>
              {v.lab}
            </Chip>
          ))}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_270px]">
        <svg viewBox={`0 0 ${W} ${H}`} width="100%" className="block">
          <defs>
            <linearGradient id="m26" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#8E1F2F" stopOpacity="0.28" />
              <stop offset="100%" stopColor="#8E1F2F" stopOpacity="0.02" />
            </linearGradient>
          </defs>
          {/* era bands */}
          {[
            [2010, 2016, "Building the platform"],
            [2016, 2021, "Scale & software"],
            [2021, 2026, "Contestation & compounding"],
          ].map(([a, b, lab], i) => (
            <g key={lab as string}>
              <rect x={X(a as number)} y={H - 40} width={X(b as number) - X(a as number)} height="16" fill={i % 2 ? "rgba(142,31,47,0.08)" : "rgba(27,58,92,0.07)"} />
              <text x={(X(a as number) + X(b as number)) / 2} y={H - 28} fontSize="9.5" fill={t.sub} textAnchor="middle" fontFamily="IBM Plex Mono" letterSpacing="1.2">
                {lab as string}
              </text>
            </g>
          ))}
          {[0, 50, 100, 150, 200].map((p) => (
            <g key={p}>
              <line x1="54" x2={W - 24} y1={Y(p)} y2={Y(p)} stroke={t.rule} strokeDasharray="2 5" />
              <text x="48" y={Y(p) + 4} fontSize="10" fill={t.sub} textAnchor="end" fontFamily="IBM Plex Mono">${p}</text>
            </g>
          ))}
          <path d={`${smooth(PATH.map((d) => [X(d.x), Y(d.p)] as [number, number]))} L${X(2026.2)},${H - 44} L${X(2010)},${H - 44} Z`} fill="url(#m26)" />
          <path d={smooth(PATH.map((d) => [X(d.x), Y(d.p)] as [number, number]))} fill="none" stroke={t.fg} strokeWidth="2.4" className="drawIn" />

          {shown.map((e, i) => {
            const x = X(e.px! > 0 && e.y > 2009 ? e.px! : 2010), y = Y(e.px!);
            const on = sel.t === e.t;
            const alt = i % 2 === 0;
            return (
              <g key={e.t} onMouseEnter={() => setSel(e)} onClick={() => setSel(e)} style={{ cursor: "pointer" }}>
                <line x1={x} x2={x} y1={y} y2={alt ? y - 40 : y + 34} stroke={KINDS[e.kind].c} strokeWidth="1.2" />
                <circle cx={x} cy={y} r={on ? 6.5 : 4.5} fill={KINDS[e.kind].c} stroke="#F7E7DA" strokeWidth="1.6" />
                <rect x={x - (on ? 62 : 52)} y={alt ? y - 58 : y + 34} width={on ? 124 : 104} height="19" fill={on ? KINDS[e.kind].c : "#F7E7DA"} stroke={KINDS[e.kind].c} strokeWidth="1" />
                <text
                  x={x}
                  y={alt ? y - 45 : y + 47}
                  fontSize="10.5"
                  fill={on ? "#F7E7DA" : t.fg}
                  textAnchor="middle"
                  fontFamily="IBM Plex Mono"
                >
                  {e.y} · {e.kind === "crisis" ? (e.move ?? 0).toFixed(0) + "%" : `${e.px!.toFixed(0)}`}
                </text>
              </g>
            );
          })}
          {[2010, 2013, 2016, 2019, 2022, 2025].map((y) => (
            <text key={y} x={X(y)} y={H - 48} fontSize="10.5" fill={t.sub} textAnchor="middle" fontFamily="IBM Plex Mono">{y}</text>
          ))}
        </svg>

        <aside style={{ borderLeft: `1px solid ${t.rule}` }} className="pl-5">
          <Caps style={{ color: KINDS[sel.kind].c }}>{KINDS[sel.kind].lab}</Caps>
          <div className="mt-1 font-sans text-[27px] font-extrabold leading-none tracking-tight">{sel.y}</div>
          <div className="mt-1.5 font-display text-[19px] leading-tight">{sel.t}</div>
          <p className="mt-2 font-display text-[15.5px] italic leading-relaxed" style={{ color: "rgba(22,18,14,0.74)" }}>{sel.d}</p>
          <div className="mt-4 space-y-2 border-t pt-3" style={{ borderColor: t.rule }}>
            {[
              ["Date", sel.date],
              ["Share price", sel.px ? `$${sel.px.toFixed(2)}` : "Private"],
              ["One-day move", sel.move !== undefined ? `${sel.move > 0 ? "+" : ""}${sel.move.toFixed(1)}%` : "n/a"],
              ["Price today", "$187.42"],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between">
                <span className="font-mono text-[10px] uppercase tracking-[0.14em]" style={{ color: t.sub }}>{k}</span>
                <span className="tnum font-mono text-[12.5px]" style={{ color: k === "One-day move" && (sel.move ?? 0) < 0 ? t.down : t.fg }}>{v}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 border-t pt-3" style={{ borderColor: t.rule }}>
            <Caps style={{ color: t.sub }}>Return since IPO</Caps>
            <div className="tnum font-sans text-[34px] font-extrabold leading-none" style={{ color: t.up }}>
              +{nf(Math.round((187.42 / 17.4 - 1) * 100))}%
            </div>
            <div className="font-mono text-[10.5px]" style={{ color: t.sub }}>16.1 years · 14.9% compound</div>
          </div>
        </aside>
      </div>
    </div>
  );
}

/* ═══════════════════════ 26.b — SWIMLANES ═══════════════════════ */
function P26B() {
  const t = TONES.blueprint;
  const [sel, setSel] = useState<string>(EVS[7].t);
  const [showPrice, setShowPrice] = useState(true);
  const lanes = Object.keys(KINDS);
  const W = 960, H = 420;
  const X = (x: number) => lin(x, 2010, 2026.4, 92, W - 22);
  const Y = (p: number) => lin(p, 0, 200, 40, H - 128);
  const laneY = (i: number) => H - 104 + i * 24;

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-baseline gap-4">
          <span className="font-mono text-[12px] tracking-[0.2em]" style={{ color: t.sub }}>CHART 26B</span>
          <span className="font-sans text-[17px] font-bold">Price history with six event lanes</span>
        </div>
        <div className="flex gap-2">
          {[["Price overlay", showPrice]].map(([lab, v]) => (
            <button
              key={lab as string}
              onClick={() => setShowPrice(!showPrice)}
              className="px-3 py-1 font-mono text-[9.5px] uppercase tracking-[0.14em]"
              style={{ border: `1px solid ${v ? t.down : t.rule}`, background: v ? t.down : "transparent", color: v ? "#12243A" : t.sub }}
            >
              {lab as string}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_260px]">
        <svg viewBox={`0 0 ${W} ${H}`} width="100%" className="block">
          {lanes.map((l, i) => (
            <g key={l}>
              <rect x="0" y={laneY(i) - 11} width={W} height="22" fill={i % 2 ? "rgba(230,237,245,0.035)" : "transparent"} />
              <text x="86" y={laneY(i) + 4} fontSize="9.5" fill={t.sub} textAnchor="end" fontFamily="IBM Plex Mono" letterSpacing="1.2">
                {KINDS[l].lab.toUpperCase()}
              </text>
              <line x1="92" x2={W - 22} y1={laneY(i)} y2={laneY(i)} stroke={t.rule} strokeWidth="0.7" />
            </g>
          ))}
          {[0, 50, 100, 150, 200].map((p) => (
            <g key={p}>
              <line x1="92" x2={W - 22} y1={Y(p)} y2={Y(p)} stroke={t.rule} strokeDasharray="1 6" />
              <text x="86" y={Y(p) + 4} fontSize="9.5" fill={t.sub} textAnchor="end" fontFamily="IBM Plex Mono">${p}</text>
            </g>
          ))}
          {showPrice && (
            <path d={smooth(PATH.map((d) => [X(d.x), Y(d.p)] as [number, number]))} fill="none" stroke="#E6EDF5" strokeWidth="2.2" className="drawIn" />
          )}

          {EVS.filter((e) => e.px !== null).map((e) => {
            const i = lanes.indexOf(e.kind);
            const x = X(e.y + 0.12);
            const on = sel === e.t;
            const topY = Y(e.px!);
            return (
              <g key={e.t} onMouseEnter={() => setSel(e.t)} onClick={() => setSel(e.t)} style={{ cursor: "pointer" }}>
                <line x1={x} x2={x} y1={topY} y2={laneY(i)} stroke={KINDS[e.kind].c} strokeWidth={on ? 1.6 : 0.8} strokeDasharray={on ? "" : "3 3"} opacity={on ? 1 : 0.5} />
                <rect x={x - 7} y={laneY(i) - 7} width="14" height="14" fill={on ? KINDS[e.kind].c : "#12243A"} stroke={KINDS[e.kind].c} strokeWidth="1.6" />
                <text x={x} y={laneY(i) + 3.5} fontSize="8.5" fill={on ? "#12243A" : KINDS[e.kind].c} textAnchor="middle" fontFamily="IBM Plex Mono" fontWeight="600">
                  {e.y.toString().slice(2)}
                </text>
                {showPrice && <circle cx={x} cy={topY} r={on ? 5.5 : 3} fill={KINDS[e.kind].c} stroke="#12243A" strokeWidth="1.4" />}
              </g>
            );
          })}
          {[2010, 2013, 2016, 2019, 2022, 2025].map((y) => (
            <g key={y}>
              <line x1={X(y)} x2={X(y)} y1="34" y2={H - 118} stroke={t.rule} strokeWidth="0.6" />
              <text x={X(y)} y={H - 124} fontSize="10" fill={t.sub} textAnchor="middle" fontFamily="IBM Plex Mono">{y}</text>
            </g>
          ))}
        </svg>

        <aside style={{ borderLeft: `1px solid ${t.rule}` }} className="pl-5">
          {(() => {
            const e = EVS.find((x) => x.t === sel)!;
            return (
              <>
                <Caps style={{ color: KINDS[e.kind].c }}>{KINDS[e.kind].lab}</Caps>
                <div className="mt-1 font-mono text-[12px]" style={{ color: t.sub }}>{e.date}</div>
                <div className="mt-1 font-display text-[20px] leading-tight">{e.t}</div>
                <p className="mt-2 font-display text-[15px] italic leading-relaxed" style={{ color: t.sub }}>{e.d}</p>
                <div className="mt-4 flex gap-5 border-t pt-3" style={{ borderColor: t.rule }}>
                  <div>
                    <Caps style={{ color: t.sub }}>Price</Caps>
                    <div className="tnum font-sans text-[22px] font-extrabold">{e.px ? `$${e.px.toFixed(2)}` : "—"}</div>
                  </div>
                  <div>
                    <Caps style={{ color: t.sub }}>Move</Caps>
                    <div className="tnum font-sans text-[22px] font-extrabold" style={{ color: (e.move ?? 0) >= 0 ? t.up : t.down }}>
                      {e.move !== undefined ? `${e.move > 0 ? "+" : ""}${e.move.toFixed(1)}%` : "—"}
                    </div>
                  </div>
                </div>
              </>
            );
          })()}
          <div className="mt-5 border-t pt-3" style={{ borderColor: t.rule }}>
            <Caps style={{ color: t.sub }}>All events</Caps>
            <div className="mt-1.5 max-h-[150px] space-y-1 overflow-y-auto scroller pr-1">
              {EVS.filter((e) => e.px !== null).map((e) => (
                <button key={e.t} onClick={() => setSel(e.t)} className="flex w-full items-baseline gap-2 text-left" style={{ color: sel === e.t ? "#E6EDF5" : t.sub }}>
                  <span className="tnum font-mono text-[10.5px]" style={{ color: KINDS[e.kind].c }}>{e.y}</span>
                  <span className="truncate font-display text-[14px]">{e.t}</span>
                </button>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

/* ═══════════════════════ 26.c — VERTICAL CHRONICLE ═══════════════════════ */
function P26C() {
  const t = TONES.sand;
  const [open, setOpen] = useState<string[]>(["Frostline short-seller report"]);
  const [filter, setFilter] = useState<string>("all");
  const list = EVS.filter((e) => filter === "all" || e.kind === filter);

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-end justify-between gap-4 border-b-2 pb-3" style={{ borderColor: t.fg }}>
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.28em]" style={{ color: t.sub }}>A chronicle of Halcyon Grid</div>
          <h3 className="mt-1 font-display text-[clamp(26px,3.4vw,40px)] leading-none tracking-tight">Thirteen days that made the multiple</h3>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {["all", ...Object.keys(KINDS)].map((k) => (
            <Chip key={k} t={t} on={filter === k} onClick={() => setFilter(k)} color={k === "all" ? t.fg : KINDS[k].c}>
              {k === "all" ? "All" : KINDS[k].lab}
            </Chip>
          ))}
        </div>
      </div>

      <div className="grid gap-0" style={{ gridTemplateColumns: "108px minmax(0,1fr) 96px" }}>
        {/* year gutter */}
        <div className="relative" style={{ borderRight: `1px solid ${t.fg}` }}>
          {list.map((e) => (
            <div key={e.t} className="text-right" style={{ paddingRight: 14, height: e.px === null ? 116 : 148 }}>
              <div className="tnum font-sans text-[34px] font-extrabold leading-none tracking-[-0.04em]" style={{ color: e.kind === "crisis" ? t.down : "rgba(35,27,18,0.24)" }}>
                {e.y}
              </div>
            </div>
          ))}
        </div>

        {/* entries */}
        <div className="pl-7">
          {list.map((e) => {
            const isOpen = open.includes(e.t);
            return (
              <div key={e.t} onClick={() => setOpen((o) => (isOpen ? o.filter((x) => x !== e.t) : [...o, e.t]))} className="cursor-pointer" style={{ height: e.px === null ? 116 : 148 }}>
                <div className="flex items-center gap-3">
                  <span className="inline-block h-[9px] w-[9px] rotate-45" style={{ background: KINDS[e.kind].c }} />
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em]" style={{ color: KINDS[e.kind].lab === "Crisis" ? t.down : t.sub }}>
                    {KINDS[e.kind].lab}
                  </span>
                  <span className="h-px flex-1" style={{ background: t.rule }} />
                  <span className="font-mono text-[10.5px]" style={{ color: t.sub }}>{e.date}</span>
                </div>
                <div className="mt-1.5 font-display text-[23px] leading-tight">{e.t}</div>
                <p className="mt-1 max-w-[74ch] text-[15px] leading-relaxed" style={{ color: "rgba(35,27,18,0.78)" }}>
                  {isOpen ? e.d : `${e.d.slice(0, 96)}${e.d.length > 96 ? "…" : ""}`}
                </p>
                <div className="mt-2 flex flex-wrap items-center gap-4">
                  <span className="tnum font-mono text-[12.5px]" style={{ color: t.down }}>
                    {e.px ? `$${e.px.toFixed(2)}` : "private"}
                  </span>
                  {e.move !== undefined && (
                    <span className="tnum font-mono text-[12.5px]" style={{ color: e.move >= 0 ? t.up : t.down }}>
                      {e.move > 0 ? "▲" : "▼"} {Math.abs(e.move).toFixed(1)}% on the day
                    </span>
                  )}
                  <span className="font-mono text-[10px] uppercase tracking-[0.16em]" style={{ color: t.sub }}>{isOpen ? "less" : "more"}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* margin sparkline */}
        <div className="relative pl-6" style={{ borderLeft: `1px solid ${t.rule}` }}>
          <svg viewBox="0 0 76 640" width="100%" height="640" preserveAspectRatio="none" className="block">
            <path d={smooth(PATH.map((d) => [lin(d.p, 0, 200, 4, 72), lin(d.x, 2010, 2026.4, 0, 640)] as [number, number]))} fill="none" stroke={t.down} strokeWidth="1.6" />
            {EVS.filter((e) => e.px !== null).map((e) => (
              <circle key={e.t} cx={lin(e.px!, 0, 200, 4, 72)} cy={lin(e.y + 0.12, 2010, 2026.4, 0, 640)} r={open.includes(e.t) ? 4 : 2.4} fill={KINDS[e.kind].c} />
            ))}
          </svg>
          <div className="mt-2 font-mono text-[9.5px] leading-relaxed" style={{ color: t.sub }}>
            Share price, 2010 – 2026, running down the margin. Markers align with the entry alongside.
          </div>
        </div>
      </div>

      <div className="mt-5 border-t-2 pt-3" style={{ borderColor: t.fg }}>
        <div className="flex flex-wrap gap-x-8 gap-y-2">
          {[
            ["Entries shown", `${list.length} of ${EVS.length}`],
            ["Worst single day", "−24.0% · 07 Sep 2021"],
            ["Best single day", "+11.6% · 23 Jul 2024"],
            ["IPO to today", "+1,104%"],
          ].map(([k, v]) => (
            <div key={k}>
              <Caps style={{ color: t.sub }}>{k}</Caps>
              <div className="tnum font-sans text-[19px] font-bold tracking-tight">{v}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function C26() {
  const nm = "Milestones timeline";
  return (
    <>
      <Plate n={26} letter="a" name={nm} variant="Flag chart — events pinned to the price that followed" tone="paper" caption="Sixteen years of price with era bands beneath it and a flag for every event that mattered. Filter by event type with the chips, and the right rail gives the full entry, its one-day move and the return since IPO.">
        <P26A />
      </Plate>
      <Plate n={26} letter="b" name={nm} variant="Swimlanes — six categories of event against one price line" tone="blueprint" caption="Separating events into lanes stops the flags colliding and lets you read frequency as well as timing: the crisis lane is short, the operations lane is not. Drop the price overlay to see the lanes on their own.">
        <P26B />
      </Plate>
      <Plate n={26} letter="c" name={nm} variant="Vertical chronicle with the price running down the margin" tone="sand" caption="Set as a printed chronicle: oversized year numerals in the gutter, entries that expand on click, a hairline rule through each, and the share price drawn down the outer margin with a marker aligned to every entry.">
        <P26C />
      </Plate>
    </>
  );
}
