import { useMemo, useState } from "react";
import { Caps, Chip, Plate, Toggle, TONES, lin, poly, smooth, nf } from "@/ui";
import { CO } from "@/data";

/* ═══════════════════════ shared debt data for plate 45 ═══════════════════════ */
type Debt = { n: string; amt: number; coupon: number; mat: number; type: "Senior notes" | "Term loan" | "Convertible" | "Finance lease"; coven: boolean; call: number | null };

const DEBTS: Debt[] = [
  { n: "4.25% senior notes due 2026", amt: 250, coupon: 4.25, mat: 2026, type: "Senior notes", coven: false, call: 2026.5 },
  { n: "3.75% senior notes due 2027", amt: 350, coupon: 3.75, mat: 2027, type: "Senior notes", coven: false, call: 2027.4 },
  { n: "Term Loan B — Bank of the Republic", amt: 400, coupon: 4.05, mat: 2028, type: "Term loan", coven: true, call: null },
  { n: "5.125% senior notes due 2029", amt: 420, coupon: 5.125, mat: 2029, type: "Senior notes", coven: false, call: 2029.1 },
  { n: "2026 convertible notes, 0.75%", amt: 180, coupon: 0.75, mat: 2031, type: "Convertible", coven: false, call: 2030.8 },
  { n: "Finance leases, various", amt: 62, coupon: 3.4, mat: 2030, type: "Finance lease", coven: false, call: null },
  { n: "Dresden green facility", amt: 96, coupon: 3.1, mat: 2032, type: "Term loan", coven: true, call: null },
];
const YEARS_M = [2026, 2027, 2028, 2029, 2030, 2031, 2032];
const TYPE_C: Record<string, string> = { "Senior notes": "#8E1F2F", "Term loan": "#1B3A5C", "Convertible": "#D98324", "Finance lease": "#8A7F73" };
const matYear = (d: Debt) => d.type === "Convertible" ? 2031 : d.mat;

/* ═══════════════════════ 45.a — MATURITY WALL ═══════════════════════ */
function A() {
  const t = TONES.paper;
  const [gross, setGross] = useState(true);
  const [types, setTypes] = useState<string[]>(Object.keys(TYPE_C));
  const [hover, setHover] = useState<number | null>(null);
  const cash = 1489;

  const byYear = useMemo(
    () => YEARS_M.map((y) => ({
      y,
      parts: DEBTS.filter((d) => types.includes(d.type) && matYear(d) === y).reduce((acc, d) => {
        const cur = acc.find((a) => a.k === d.type);
        if (cur) cur.v += d.amt; else acc.push({ k: d.type, v: d.amt });
        return acc;
      }, [] as { k: string; v: number }[]),
      total: DEBTS.filter((d) => types.includes(d.type) && matYear(d) === y).reduce((s, d) => s + d.amt, 0),
    })),
    [types],
  );
  const outstanding = DEBTS.filter((d) => types.includes(d.type)).reduce((s, d) => s + d.amt, 0);
  const covered = gross ? cash : cash + 842;

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-end justify-between gap-4 border-b pb-3" style={{ borderColor: t.fg }}>
        <div>
          <Caps style={{ color: t.sub }}>Debt maturity schedule · US$m · as at 31 Dec 2025</Caps>
          <div className="mt-0.5 font-display text-[21px] italic">Nothing due this year, and nothing above $420m in any single year to 2032.</div>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <Toggle opts={["cash", "cash+ocf"] as const} value={gross ? "cash" : "cash+ocf"} onChange={(v) => setGross(v === "cash")} t={t} size="sm" />
          <div className="flex flex-wrap gap-1.5">
            {Object.keys(TYPE_C).map((k) => (
              <Chip key={k} t={t} on={types.includes(k)} onClick={() => setTypes((o) => (o.includes(k) ? o.filter((x) => x !== k) : [...o, k]))} color={TYPE_C[k]}>
                {k}
              </Chip>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_250px]">
        <svg viewBox="0 0 900 340" width="100%" className="block" onMouseLeave={() => setHover(null)}>
          {[0, 100, 200, 300, 400].map((v) => (
            <g key={v}>
              <line x1="52" x2="878" y1={lin(v, 0, 450, 292, 24)} y2={lin(v, 0, 450, 292, 24)} stroke={t.rule} strokeDasharray="2 5" />
              <text x="46" y={lin(v, 0, 450, 292, 24) + 4} fontSize="10" fill={t.sub} textAnchor="end" fontFamily="IBM Plex Mono">{v}</text>
            </g>
          ))}
          {byYear.map((b, i) => {
            const bw = 88;
            const x = 76 + i * 116;
            let acc = 0;
            return (
              <g key={b.y} onMouseEnter={() => setHover(i)}>
                <rect x={x - 12} y="18" width={bw + 24} height="296" fill={hover === i ? "rgba(142,31,47,0.06)" : "transparent"} />
                {b.parts.map((p) => {
                  const h = (p.v / 450) * 268;
                  const y = 292 - acc - h;
                  acc += h;
                  return <rect key={p.k} x={x} y={y} width={bw} height={h} fill={TYPE_C[p.k]} opacity={0.9} />;
                })}
                <text x={x + bw / 2} y={292 - acc - 8} fontSize="13" fill={t.fg} textAnchor="middle" fontFamily="IBM Plex Mono" fontWeight="600">
                  {b.total ? nf(b.total) : "—"}
                </text>
                <text x={x + bw / 2} y={312} fontSize="12" fill={b.y === 2026 ? t.down : t.sub} textAnchor="middle" fontFamily="IBM Plex Mono">{b.y}</text>
                <text x={x + bw / 2} y={327} fontSize="9.5" fill={t.sub} textAnchor="middle" fontFamily="IBM Plex Mono">
                  {b.total ? `${((b.total / outstanding) * 100).toFixed(0)}%` : "none"}
                </text>
              </g>
            );
          })}
          <line x1="52" x2="878" y1="292" y2="292" stroke={t.fg} strokeWidth="1.4" />
          <line x1="52" x2="878" y1={lin(covered, 0, 450, 292, 24)} y2={lin(covered, 0, 450, 292, 24)} stroke="#2E5E4A" strokeWidth="2.4" strokeDasharray="7 4" />
          <text x="56" y={lin(covered, 0, 450, 292, 24) - 6} fontSize="11" fill="#2E5E4A" fontFamily="IBM Plex Mono">
            {gross ? "cash & equivalents" : "cash + LTM operating cash flow"} · {nf(covered)}
          </text>
        </svg>

        <aside style={{ borderLeft: `1px solid ${t.rule}` }} className="pl-5">
          <Caps style={{ color: t.down }}>{hover !== null ? YEARS_M[hover] : "Total debt"}</Caps>
          <div className="tnum font-sans text-[40px] font-extrabold leading-none tracking-tight">
            ${hover !== null ? nf(byYear[hover].total) : nf(outstanding)}m
          </div>
          <div className="mt-1 font-mono text-[11px]" style={{ color: t.sub }}>
            {hover !== null ? `${byYear[hover].parts.length} instrument(s) maturing` : "gross debt outstanding"}
          </div>

          <div className="mt-4">
            <Caps style={{ color: t.sub }}>Instruments</Caps>
            <div className="mt-2 space-y-2">
              {DEBTS.filter((d) => types.includes(d.type) && (hover === null || matYear(d) === YEARS_M[hover])).map((d) => (
                <div key={d.n} className="border-l-2 pl-2.5" style={{ borderColor: TYPE_C[d.type] }}>
                  <div className="text-[13.5px] leading-tight">{d.n}</div>
                  <div className="font-mono text-[10.5px]" style={{ color: t.sub }}>
                    ${nf(d.amt)}m · {d.coven ? "financial maintenance covenant" : "no maintenance covenant"}
                    {d.call !== null && ` · callable ${d.call}`}
                  </div>
                </div>
              ))}
              {hover !== null && byYear[hover].total === 0 && (
                <div className="font-display text-[16px] italic" style={{ color: t.sub }}>Nothing matures in {YEARS_M[hover]}.</div>
              )}
            </div>
          </div>

          <div className="mt-4 space-y-2 border-t pt-3" style={{ borderColor: t.rule }}>
            {[["Weighted avg coupon", "4.02%"], ["Weighted avg maturity", "4.1 yrs"], ["Net debt / EBITDA", "1.4×"], ["Interest cover", "8.8×"], ["Credit ratings", "BBB / Baa2"]].map(([k, v]) => (
              <div key={k} className="flex justify-between">
                <span className="font-mono text-[10px] uppercase tracking-[0.14em]" style={{ color: t.sub }}>{k}</span>
                <span className="tnum font-mono text-[13px]">{v}</span>
              </div>
            ))}
          </div>
        </aside>
      </div>
      <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 border-t pt-2" style={{ borderColor: t.rule }}>
        {Object.entries(TYPE_C).map(([k, c]) => (
          <span key={k} className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.12em]" style={{ color: t.sub }}>
            <span className="inline-block h-[9px] w-[9px]" style={{ background: c }} /> {k}
          </span>
        ))}
        <span className="ml-auto font-mono text-[10.5px]" style={{ color: t.sub }}>Unamortised issuance costs of $18m excluded</span>
      </div>
    </div>
  );
}

/* ═══════════════════════ 45.b — INSTRUMENT LADDER ═══════════════════════ */
function P45B() {
  const t = TONES.blueprint;
  const [sort, setSort] = useState<"mat" | "coupon">("mat");
  const [sel, setSel] = useState<string>(DEBTS[2].n);
  const list = [...DEBTS].sort((a, b) => (sort === "mat" ? a.mat - b.mat || a.coupon - b.coupon : b.coupon - a.coupon));
  const X = (y: number) => lin(y, 2025, 2033, 210, 940);
  const cur = DEBTS.find((d) => d.n === sel)!;

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-end justify-between gap-4">
        <div>
          <Caps style={{ color: t.sub }}>Every instrument drawn from issue to maturity · bar length = remaining life</Caps>
          <div className="mt-0.5 font-display text-[21px] italic">Seven instruments, 4.02% blended, none callable inside eighteen months.</div>
        </div>
        <Toggle opts={["mat", "coupon"] as const} value={sort} onChange={setSort} t={t} size="sm" />
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_268px]">
        <div className="overflow-x-auto scroller">
          <div style={{ minWidth: 960 }}>
            <div className="relative mb-2 h-[22px]" style={{ borderBottom: `1px solid ${t.rule}` }}>
              {Array.from({ length: 9 }).map((_, i) => 2025 + i).map((y) => (
                <span key={y} className="absolute top-0 font-mono text-[10.5px]" style={{ left: X(y), color: y === 2026 ? t.down : t.sub, transform: "translateX(-50%)" }}>
                  {y}
                </span>
              ))}
            </div>
            {list.map((d) => {
              const on = sel === d.n;
              const w = X(matYear(d)) - X(2025.1);
              return (
                <div
                  key={d.n}
                  onClick={() => setSel(d.n)}
                  className="grid cursor-pointer items-center gap-3 py-[7px]"
                  style={{ gridTemplateColumns: "196px minmax(0,1fr)", borderBottom: `1px solid ${t.rule}`, background: on ? "rgba(230,237,245,0.07)" : "transparent" }}
                >
                  <div className="truncate">
                    <div className="font-mono text-[12.5px]" style={{ color: on ? "#E6EDF5" : t.sub }}>{d.n}</div>
                  </div>
                  <div className="relative h-[26px]">
                    {Array.from({ length: 9 }).map((_, i) => 2025 + i).map((y) => (
                      <span key={y} className="absolute top-0 h-full w-px" style={{ left: X(y) - 210, background: t.rule, opacity: 0.55 }} />
                    ))}
                    <div
                      className="absolute top-[4px] h-[18px] transition-all duration-300"
                      style={{
                        left: 0,
                        width: w,
                        background: TYPE_C[d.type],
                        opacity: on ? 1 : 0.72,
                        outline: on ? `1.5px solid #E6EDF5` : "none",
                        outlineOffset: "-1.5px",
                      }}
                    />
                    <span className="absolute top-[4px] h-[18px] w-[3px]" style={{ left: X(matYear(d)) - 210, background: "#E6EDF5" }} />
                    <span className="tnum absolute top-[6px] font-mono text-[11px]" style={{ left: w + 8, color: on ? "#E6EDF5" : t.sub }}>
                      ${nf(d.amt)}m · {d.coupon.toFixed(d.coupon % 1 ? 3 : 2)}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <aside style={{ borderLeft: `1px solid ${t.rule}` }} className="pl-5">
          <Caps style={{ color: t.down }}>Instrument detail</Caps>
          <div className="mt-1 font-display text-[21px] leading-tight">{cur.n}</div>
          <div className="mt-4 space-y-2">
            {[
              ["Principal", `$${nf(cur.amt)}m`],
              ["Coupon", `${cur.coupon.toFixed(3)}%`],
              ["Type", cur.type],
              ["Matures", `${matYear(cur)}`],
              ["Callable", cur.call !== null ? `Jan ${Math.floor(cur.call)}` : "non-callable"],
              ["Covenant", cur.coven ? "6.00× net leverage" : "none"],
              ["% of debt", `${((cur.amt / 1758) * 100).toFixed(1)}%`],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between border-b pb-1.5" style={{ borderColor: t.rule }}>
                <span className="font-mono text-[10px] uppercase tracking-[0.14em]" style={{ color: t.sub }}>{k}</span>
                <span className="tnum font-mono text-[13px]">{v}</span>
              </div>
            ))}
          </div>
          <div className="mt-4">
            <Caps style={{ color: t.sub }}>Cost to refinance at market</Caps>
            <div className="tnum font-sans text-[30px] font-extrabold leading-none" style={{ color: "#E88A7A" }}>
              +${nf(Math.round((cur.amt * (6.42 - cur.coupon)) / 100))}m
            </div>
            <div className="font-mono text-[11px]" style={{ color: t.sub }}>
              at 6.42% indicative BBB yield — {(6.42 - cur.coupon) > 0 ? "more" : "less"} than today's coupon
            </div>
          </div>
          <p className="mt-4 border-t pt-3 font-display text-[15px] italic leading-relaxed" style={{ borderColor: t.rule, color: t.sub }}>
            {cur.coven
              ? "This facility carries the only maintenance covenant in the stack; headroom at 31 Dec 2025 was 4.6 turns of leverage."
              : "Unsecured and covenant-free; the only constraint on this instrument is the change-of-control provision."}
          </p>
        </aside>
      </div>
    </div>
  );
}

/* ═══════════════════════ 45.c — WALL VS LIQUIDITY ═══════════════════════ */
function P45C() {
  const t = TONES.ledger;
  const [mode, setMode] = useState<"wall" | "coverage">("wall");
  const [showGov, setShowGov] = useState(true);
  const walls = [164, 350, 400, 420, 242, 118, 96];
  const capacity = [842, 842, 842, 842, 842, 842, 842];
  const w = 900, h = 320;
  const X = (i: number) => lin(i, 0, 6, 60, w - 60);
  const Y = (v: number) => lin(v, 0, 1000, h - 56, 26);
  const cum = walls.reduce<number[]>((a, v) => [...a, (a[a.length - 1] ?? 0) + v], []);

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-end justify-between gap-4 border-b pb-3" style={{ borderColor: t.fg }}>
        <div>
          <Caps style={{ color: t.sub }}>Maturity wall against available liquidity · US$m</Caps>
          <div className="mt-0.5 font-display text-[21px] italic">Every year of maturities sits inside one year of operating cash flow.</div>
        </div>
        <div className="flex items-center gap-3">
          <Toggle opts={["wall", "coverage"] as const} value={mode} onChange={setMode} t={t} size="sm" />
          <button onClick={() => setShowGov(!showGov)} className="px-3 py-1 font-mono text-[10px] uppercase tracking-[0.14em]" style={{ border: `1px solid ${showGov ? t.up : t.rule}`, color: showGov ? t.up : t.sub }}>
            covenants
          </button>
        </div>
      </div>

      <svg viewBox={`0 0 ${w} ${h}`} width="100%" className="block">
        {[0, 250, 500, 750, 1000].map((v) => (
          <g key={v}>
            <line x1="60" x2={w - 60} y1={Y(v)} y2={Y(v)} stroke={t.rule} strokeDasharray="2 6" />
            <text x="54" y={Y(v) + 4} fontSize="10" fill={t.sub} textAnchor="end" fontFamily="IBM Plex Mono">{v}</text>
          </g>
        ))}
        <rect x="60" y={Y(842)} width={w - 120} height={Y(0) - Y(842)} fill={t.up} opacity="0.12" />
        <line x1="60" x2={w - 60} y1={Y(842)} y2={Y(842)} stroke={t.up} strokeWidth="2" strokeDasharray="6 4" />
        <text x="66" y={Y(842) - 7} fontSize="11" fill={t.up} fontFamily="IBM Plex Mono">cash & equivalents $1,489m</text>

        {walls.map((v, i) => {
          const bw = 66;
          const ratio = capacity[i] / v;
          return (
            <g key={i}>
              <rect x={X(i) - bw / 2} y={Y(v)} width={bw} height={Y(0) - Y(v)} fill={mode === "wall" ? (ratio > 2 ? t.up : ratio > 1 ? "#E8C46A" : t.down) : "rgba(232,240,234,0.35)"} opacity="0.88" />
              <rect x={X(i) - bw / 2} y={Y(cum[i])} width={bw} height={Math.max(1, Y(v) - Y(cum[i]))} fill="none" stroke="#E8F0EA" strokeWidth="1" strokeDasharray="3 3" />
              <text x={X(i)} y={Y(v) - 7} fontSize="12" fill="#E8F0EA" textAnchor="middle" fontFamily="IBM Plex Mono" fontWeight="600">{v}</text>
              <text x={X(i)} y={h - 36} fontSize="11" fill={t.sub} textAnchor="middle" fontFamily="IBM Plex Mono">{2026 + i}</text>
              <text x={X(i)} y={h - 20} fontSize="10" fill={ratio > 2 ? t.up : "#E8C46A"} textAnchor="middle" fontFamily="IBM Plex Mono">{ratio.toFixed(1)}×</text>
              {showGov && i === 0 && (
                <g>
                  <line x1={X(i)} x2={X(i)} y1={Y(0)} y2={h - 52} stroke="#E8C46A" strokeWidth="1.5" strokeDasharray="4 3" />
                  <text x={X(i) + 7} y={h - 54} fontSize="10" fill="#E8C46A" fontFamily="IBM Plex Mono">leverage covenant tested 30 Jun</text>
                </g>
              )}
            </g>
          );
        })}
        {mode === "coverage" && (
          <path d={smooth(cum.map((v, i) => [X(i), Y(v)] as [number, number]))} fill="none" stroke="#E8F0EA" strokeWidth="2.4" strokeDasharray="6 4" />
        )}
        <line x1="60" x2={w - 60} y1={Y(0)} y2={Y(0)} stroke={t.fg} strokeWidth="1.4" />
        <text x="60" y={h - 4} fontSize="10" fill={t.sub} fontFamily="IBM Plex Mono" letterSpacing="1.4">
          {mode === "wall" ? "BAR = MATURING DEBT · DASHED OUTLINE = CUMULATIVE" : "DASHED LINE = CUMULATIVE MATURITIES"}
        </text>
      </svg>

      <div className="mt-4 grid gap-5 border-t pt-4 sm:grid-cols-4" style={{ borderColor: t.rule }}>
        {[
          ["Covered by cash", "100% of maturities to 2032"],
          ["Covered by one year of OCF", "4.6× the largest year"],
          ["Undrawn revolver", "$600m to Sep 2028"],
          ["Headroom to covenant", "4.6 turns of 6.00× limit"],
        ].map(([k, v]) => (
          <div key={k}>
            <Caps style={{ color: t.sub }}>{k}</Caps>
            <div className="font-display text-[17px] leading-tight">{v}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function C45() {
  const nm = "Debt maturity schedule";
  return (
    <>
      <Plate n={45} letter="a" name={nm} variant="Stacked maturity wall with a liquidity line across it" tone="paper" caption="Stacked by instrument type, filtered by chip, with cash — or cash plus a year of operating flow — drawn across the whole chart as a dashed green line so coverage is read, not calculated.">
        <A />
      </Plate>
      <Plate n={45} letter="b" name={nm} variant="Instrument ladder — every loan drawn to scale" tone="blueprint" caption="One row per instrument, bar length equal to remaining life, year grid behind. Select a row for its covenant, call date and — most usefully — what refinancing it at today's market yield would actually cost.">
        <P45B />
      </Plate>
      <Plate n={45} letter="c" name={nm} variant="Wall against liquidity, with covenant tests marked" tone="ledger" caption="Bars coloured by coverage ratio rather than by issuer, cumulative maturities drawn as a dashed outline, and the year in which the leverage covenant is actually tested called out on the chart.">
        <P45C />
      </Plate>
    </>
  );
}

/* ═══════════════════════ shared FCF bridge data for plate 46 ═══════════════════════ */
type Step = { k: string; v: number; kind: "start" | "delta" | "end" };
const BRIDGE: Record<string, Step[]> = {
  "FY25": [
    { k: "Net income", v: 553, kind: "start" },
    { k: "D&A", v: 274, kind: "delta" },
    { k: "Stock compensation", v: 197, kind: "delta" },
    { k: "Deferred tax & other", v: -48, kind: "delta" },
    { k: "Receivables", v: -169, kind: "delta" },
    { k: "Inventory", v: -134, kind: "delta" },
    { k: "Payables & accruals", v: 111, kind: "delta" },
    { k: "Operating cash flow", v: 842, kind: "end" },
    { k: "Capital expenditure", v: -386, kind: "delta" },
    { k: "Free cash flow", v: 456, kind: "end" },
  ],
  "FY24": [
    { k: "Net income", v: 304, kind: "start" },
    { k: "D&A", v: 248, kind: "delta" },
    { k: "Stock compensation", v: 173, kind: "delta" },
    { k: "Deferred tax & other", v: 6, kind: "delta" },
    { k: "Receivables", v: -96, kind: "delta" },
    { k: "Inventory", v: -71, kind: "delta" },
    { k: "Payables & accruals", v: 71, kind: "delta" },
    { k: "Operating cash flow", v: 631, kind: "end" },
    { k: "Capital expenditure", v: -312, kind: "delta" },
    { k: "Free cash flow", v: 319, kind: "end" },
  ],
};

/* ═══════════════════════ 46.a — CLASSIC WATERFALL ═══════════════════════ */
function P46A() {
  const t = TONES.paper;
  const [yr, setYr] = useState<"FY25" | "FY24">("FY25");
  const [sel, setSel] = useState<string>("Inventory");
  const steps = BRIDGE[yr];
  const W = 940, H = 380;
  const bw = (W - 70) / steps.length - 14;
  const max = 900;
  const Y = (v: number) => lin(v, 0, max, H - 56, 24);

  let run = 0;
  const bars = steps.map((s, i) => {
    if (s.kind !== "delta") {
      run = s.v;
      return { ...s, y0: 0, y1: s.v, i };
    }
    const from = run;
    run += s.v;
    return { ...s, y0: Math.min(from, run), y1: Math.max(from, run), i };
  });

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-end justify-between gap-4 border-b pb-3" style={{ borderColor: t.fg }}>
        <div>
          <Caps style={{ color: t.sub }}>From reported profit to free cash flow · US$m</Caps>
          <div className="mt-0.5 font-display text-[21px] italic">
            {yr}: $456m of free cash from $553m of net income — an 82% conversion.
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Toggle opts={["FY25", "FY24"] as const} value={yr} onChange={setYr} t={t} size="sm" />
          <span className="font-mono text-[11px]" style={{ color: t.sub }}>FCF conversion {yr === "FY25" ? "82.5%" : "104.9%"}</span>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_254px]">
        <svg viewBox={`0 0 ${W} ${H}`} width="100%" className="block" onMouseLeave={() => setSel("Inventory")}>
          {[0, 200, 400, 600, 800].map((v) => (
            <g key={v}>
              <line x1="46" x2={W - 12} y1={Y(v)} y2={Y(v)} stroke={t.rule} strokeDasharray="2 5" />
              <text x="40" y={Y(v) + 4} fontSize="10" fill={t.sub} textAnchor="end" fontFamily="IBM Plex Mono">{v}</text>
            </g>
          ))}
          {bars.map((b, i) => {
            const x = 58 + i * ((W - 76) / steps.length);
            const isTot = b.kind !== "delta";
            const posv = b.v >= 0;
            const y = Y(b.kind === "delta" ? b.y1 : b.v);
            const h = Math.max(2, Y(b.kind === "delta" ? b.y0 : 0) - Y(b.kind === "delta" ? b.y1 : b.v));
            const on = sel === b.k;
            return (
              <g key={b.k} onMouseEnter={() => setSel(b.k)}>
                <rect x={x - 4} y="18" width={bw + 8} height={H - 74} fill={on ? "rgba(142,31,47,0.07)" : "transparent"} />
                <rect
                  x={x}
                  y={y}
                  width={bw}
                  height={h}
                  fill={isTot ? (b.k === "Free cash flow" ? "#8E1F2F" : "#1B3A5C") : posv ? "#2E5E4A" : "#B8404E"}
                  opacity={isTot ? 0.92 : on ? 1 : 0.78}
                  className="barGrow"
                  style={{ transformOrigin: `0px ${Y(0)}px` }}
                />
                {i > 0 && (
                  <line
                    x1={x - ((W - 76) / steps.length - bw)}
                    x2={x}
                    y1={Y(bars[i - 1].kind === "delta" ? bars[i - 1].y1 : bars[i - 1].v)}
                    y2={Y(bars[i - 1].kind === "delta" ? bars[i - 1].y1 : bars[i - 1].v)}
                    stroke={t.sub}
                    strokeWidth="1"
                    strokeDasharray="3 3"
                  />
                )}
                <text x={x + bw / 2} y={y - 7} fontSize="12" fill={t.fg} textAnchor="middle" fontFamily="IBM Plex Mono" fontWeight={on ? 700 : 500}>
                  {b.kind === "delta" && b.v > 0 ? "+" : ""}
                  {nf(b.v)}
                </text>
                <text x={x + bw / 2} y={H - 34} fontSize="10.5" fill={on ? t.fg : t.sub} textAnchor="middle" fontFamily="IBM Plex Mono">
                  {b.k.length > 13 ? b.k.slice(0, 12) + "…" : b.k}
                </text>
                <text x={x + bw / 2} y={H - 18} fontSize="9.5" fill={t.sub} textAnchor="middle" fontFamily="IBM Plex Mono">
                  {b.kind === "delta" ? `${((Math.abs(b.v) / 842) * 100).toFixed(0)}% of OCF` : "subtotal"}
                </text>
              </g>
            );
          })}
          <line x1="46" x2={W - 12} y1={Y(0)} y2={Y(0)} stroke={t.fg} strokeWidth="1.4" />
        </svg>

        <aside style={{ borderLeft: `1px solid ${t.rule}` }} className="pl-5">
          <Caps style={{ color: t.down }}>{sel}</Caps>
          {(() => {
            const s = steps.find((x) => x.k === sel) ?? steps[4];
            return (
              <>
                <div className="tnum font-sans text-[44px] font-extrabold leading-none tracking-tight" style={{ color: s.v >= 0 ? t.fg : "#8E1F2F" }}>
                  {s.v >= 0 ? "+" : "−"}${nf(Math.abs(s.v))}m
                </div>
                <div className="mt-1 font-mono text-[11px]" style={{ color: t.sub }}>
                  {s.kind === "delta" ? `${((Math.abs(s.v) / 842) * 100).toFixed(0)}% of operating cash flow` : "subtotal"}
                </div>
                <p className="mt-3 font-display text-[15.5px] italic leading-relaxed" style={{ color: "rgba(22,18,14,0.75)" }}>
                  {sel === "Inventory"
                    ? "Inventory absorbed $134m as the Pune plant built ahead of demand — the single largest use of working capital this year."
                    : sel === "Receivables"
                      ? "Receivables grew faster than revenue; DSO moved from 80 to 84 days. Management guides it back to 78 by Q3."
                      : sel === "Capital expenditure"
                        ? "Capex of $386m is 8.0% of revenue, funding the Pune ramp and the Ohio second phase."
                        : "Click any bar in the bridge to read what sits behind the number."}
                </p>
              </>
            );
          })()}
          <div className="mt-5 space-y-2 border-t pt-3" style={{ borderColor: t.rule }}>
            {[["Cash conversion", "82.5%"], ["FCF / revenue", "9.5%"], ["Capex intensity", "8.0%"], ["Prior year FCF", "$319m"], ["Change", "+43.0%"]].map(([k, v]) => (
              <div key={k} className="flex justify-between">
                <span className="font-mono text-[10px] uppercase tracking-[0.14em]" style={{ color: t.sub }}>{k}</span>
                <span className="tnum font-mono text-[13px]">{v}</span>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}

/* ═══════════════════════ 46.b — RUNNING TOTAL BRIDGE ═══════════════════════ */
function P46B() {
  const t = TONES.ink;
  const [yr, setYr] = useState<"FY25" | "FY24">("FY25");
  const [hover, setHover] = useState<number | null>(null);
  const steps = BRIDGE[yr];
  const W = 900;
  const run: number[] = [];
  let acc = 0;
  steps.forEach((s) => {
    if (s.kind !== "delta") { acc = s.v; run.push(acc); }
    else { acc += s.v; run.push(acc); }
  });
  const H = 320;
  const X = (i: number) => lin(i, 0, steps.length - 1, 44, W - 40);
  const Y = (v: number) => lin(v, -50, 950, H - 60, 26);

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-end justify-between gap-4 border-b pb-3" style={{ borderColor: t.fg }}>
        <div>
          <Caps style={{ color: t.sub }}>The same bridge, read as a running total</Caps>
          <div className="mt-0.5 font-display text-[20px] italic">Where the cash peaks, and what takes it away.</div>
        </div>
        <Toggle opts={["FY25", "FY24"] as const} value={yr} onChange={setYr} t={t} size="sm" />
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_240px]">
        <div>
          <svg viewBox={`0 0 ${W} ${H}`} width="100%" className="block" onMouseLeave={() => setHover(null)}>
            {[0, 250, 500, 750, 1000].map((v) => (
              <g key={v}>
                <line x1="44" x2={W - 40} y1={Y(v)} y2={Y(v)} stroke={t.rule} strokeDasharray="2 5" />
                <text x="38" y={Y(v) + 4} fontSize="10" fill={t.sub} textAnchor="end" fontFamily="IBM Plex Mono">{v}</text>
              </g>
            ))}
            <path d={`${poly(run.map((v, i) => [X(i), Y(v)] as [number, number]))} L${X(run.length - 1)},${Y(0)} L${X(0)},${Y(0)} Z`} fill={t.up} opacity="0.14" />
            <path d={poly(run.map((v, i) => [X(i), Y(v)] as [number, number]))} fill="none" stroke={t.up} strokeWidth="2.6" />
            {run.map((v, i) => {
              const prev = i === 0 ? 0 : run[i - 1];
              const d = v - prev;
              return (
                <g key={i} onMouseEnter={() => setHover(i)}>
                  <rect x={X(i) - 22} y="20" width="44" height={H - 78} fill={hover === i ? "rgba(240,233,225,0.07)" : "transparent"} />
                  <line x1={X(i)} x2={X(i)} y1={Y(prev)} y2={Y(v)} stroke={d >= 0 ? t.up : t.down} strokeWidth="10" opacity={hover === i ? 1 : 0.55} />
                  <circle cx={X(i)} cy={Y(v)} r={hover === i ? 6 : 3.6} fill={hover === i ? t.down : "#F0E9E1"} />
                  <text x={X(i)} y={Y(v) - 13} fontSize="11.5" fill="#F0E9E1" textAnchor="middle" fontFamily="IBM Plex Mono" fontWeight={hover === i ? 700 : 400}>
                    {d !== 0 && steps[i].kind === "delta" ? `${d > 0 ? "+" : ""}${d}` : nf(v)}
                  </text>
                  <text x={X(i)} y={H - 34} fontSize="9.5" fill={t.sub} textAnchor="middle" fontFamily="IBM Plex Mono" transform={`rotate(-32 ${X(i)} ${H - 34})`}>
                    {steps[i].k}
                  </text>
                </g>
              );
            })}
            <line x1="44" x2={W - 40} y1={Y(0)} y2={Y(0)} stroke={t.fg} strokeWidth="1.3" />
          </svg>

          <div className="mt-2 flex flex-wrap items-center justify-between gap-3 border-t pt-2" style={{ borderColor: t.rule }}>
            <span className="font-mono text-[10.5px]" style={{ color: t.sub }}>
              Peak running balance ${nf(Math.max(...run))}m at step {run.indexOf(Math.max(...run)) + 1} · ending ${nf(run[run.length - 1])}m
            </span>
            <div className="flex gap-2">
              {["Per share", "As % revenue"].map((b, i) => (
                <span key={b} className="px-2.5 py-1 font-mono text-[9.5px] uppercase tracking-[0.14em]" style={i === 0 ? { background: t.fg, color: t.bg } : { border: `1px solid ${t.rule}`, color: t.sub }}>{b}</span>
              ))}
            </div>
          </div>
        </div>

        <aside style={{ borderLeft: `1px solid ${t.rule}` }} className="pl-5">
          <Caps style={{ color: t.down }}>{hover !== null ? steps[hover].k : "Summary"}</Caps>
          {hover !== null ? (
            <>
              <div className="tnum font-sans text-[38px] font-extrabold leading-none tracking-tight">
                {steps[hover].v >= 0 ? "+" : "−"}${nf(Math.abs(steps[hover].v))}m
              </div>
              <div className="mt-3 space-y-2">
                {[["Running total", `$${nf(run[hover])}m`], ["Share of OCF", `${((Math.abs(steps[hover].v) / 842) * 100).toFixed(1)}%`], ["Direction", steps[hover].v >= 0 ? "source" : "use"], ["Per share", `$${(steps[hover].v / 365).toFixed(2)}`]].map(([k, v]) => (
                  <div key={k} className="flex justify-between border-b pb-1.5" style={{ borderColor: t.rule }}>
                    <span className="font-mono text-[10px] uppercase tracking-[0.14em]" style={{ color: t.sub }}>{k}</span>
                    <span className="tnum font-mono text-[13px]">{v}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="font-display text-[17px] italic leading-relaxed" style={{ color: t.sub }}>
              Point at any node on the line to read its step, its share of operating cash flow and its per-share value.
            </div>
          )}
          <div className="mt-5 border-t pt-3" style={{ borderColor: t.rule }}>
            <Caps style={{ color: t.sub }}>Working capital drag</Caps>
            <div className="tnum font-sans text-[30px] font-extrabold leading-none" style={{ color: t.down }}>
              −${nf(yr === "FY25" ? 182 : 94)}m
            </div>
            <div className="font-mono text-[11px]" style={{ color: t.sub }}>
              {yr === "FY25" ? "21.6% of operating cash flow" : "14.9% of operating cash flow"}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

/* ═══════════════════════ 46.c — SANKEY ═══════════════════════ */
function P46C() {
  const t = TONES.sand;
  const [sel, setSel] = useState<string | null>(null);
  const W = 940, H = 400;
  // four conserving stages: sources → operating cash → free cash → uses
  const COLS: { x: number; nodes: { k: string; v: number; c: string }[] }[] = [
    { x: 44, nodes: [
      { k: "Net income", v: 553, c: "#8E1F2F" },
      { k: "Depreciation & amortisation", v: 274, c: "#D98324" },
      { k: "Stock compensation", v: 197, c: "#1B3A5C" },
    ] },
    { x: 286, nodes: [
      { k: "Working capital absorbed", v: 182, c: "#B8404E" },
      { k: "Operating cash flow", v: 842, c: "#2E5E4A" },
    ] },
    { x: 528, nodes: [
      { k: "Capital expenditure", v: 386, c: "#8A7F73" },
      { k: "Free cash flow", v: 456, c: "#8E1F2F" },
    ] },
    { x: 770, nodes: [
      { k: "Share buybacks", v: 248, c: "#1B3A5C" },
      { k: "Dividends", v: 64, c: "#D98324" },
      { k: "Debt repayment", v: 68, c: "#2E5E4A" },
      { k: "Cash retained", v: 76, c: "#8A7F73" },
    ] },
  ];
  const LINKS: [number, string, number, string, number, string][] = [
    [0, "Net income", 1, "Working capital absorbed", 143, "#B8404E"],
    [0, "Net income", 1, "Operating cash flow", 410, "#8E1F2F"],
    [0, "Depreciation & amortisation", 1, "Working capital absorbed", 22, "#D98324"],
    [0, "Depreciation & amortisation", 1, "Operating cash flow", 252, "#D98324"],
    [0, "Stock compensation", 1, "Operating cash flow", 180, "#1B3A5C"],
    [1, "Operating cash flow", 2, "Capital expenditure", 386, "#8A7F73"],
    [1, "Operating cash flow", 2, "Free cash flow", 456, "#8E1F2F"],
    [2, "Free cash flow", 3, "Share buybacks", 248, "#1B3A5C"],
    [2, "Free cash flow", 3, "Dividends", 64, "#D98324"],
    [2, "Free cash flow", 3, "Debt repayment", 68, "#2E5E4A"],
    [2, "Free cash flow", 3, "Cash retained", 76, "#8A7F73"],
  ];
  const GAP = 46, TOP = 62;
  const pos: Record<string, { x: number; y0: number; y1: number }> = {};
  const outOff: Record<string, number> = {};
  const inOff: Record<string, number> = {};
  COLS.forEach((col) => {
    const tot = col.nodes.reduce((s, n) => s + n.v, 0);
    const scale = (H - TOP - 46 - GAP * (col.nodes.length - 1)) / tot;
    let y = TOP;
    col.nodes.forEach((n) => {
      const h = n.v * scale;
      pos[n.k] = { x: col.x, y0: y, y1: y + h };
      outOff[n.k] = y;
      inOff[n.k] = y;
      y += h + GAP;
    });
  });
  const ribbons = LINKS.map(([ci, from, ti, to, v, c]) => {
    const a = pos[from], b = pos[to];
    const sa = a.y1 - a.y0, sb = b.y1 - b.y0;
    const ha = (v / (COLS[ci].nodes.find((n) => n.k === from)!.v)) * sa;
    const hb = (v / (COLS[ti].nodes.find((n) => n.k === to)!.v)) * sb;
    const y0 = outOff[from]; outOff[from] += ha;
    const y1 = inOff[to]; inOff[to] += hb;
    const x0 = a.x + 13, x1 = b.x;
    const mx = (x0 + x1) / 2;
    return {
      k: `${from}→${to}`,
      d: `M${x0},${y0} C${mx},${y0} ${mx},${y1} ${x1},${y1} L${x1},${y1 + hb} C${mx},${y1 + hb} ${mx},${y0 + ha} ${x0},${y0 + ha} Z`,
      c,
    };
  });

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-end justify-between gap-4 border-b pb-3" style={{ borderColor: t.fg }}>
        <div>
          <Caps style={{ color: t.sub }}>From net income to uses of cash · US$m · FY2025</Caps>
          <div className="mt-0.5 font-display text-[21px] italic">
            Revenue $4,820m → operating profit $755m → net income $553m → operating cash $842m → free cash $456m.
          </div>
        </div>
        <div className="flex gap-4 font-mono text-[11px]" style={{ color: t.sub }}>
          <span>margin 17.5%</span>
          <span>FCF conversion 82.5%</span>
          <span>returned 68%</span>
        </div>
      </div>

      <div className="overflow-x-auto scroller">
        <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ minWidth: 860 }}>
          {ribbons.map((r) => (
            <path
              key={r.k}
              d={r.d}
              fill={r.c}
              opacity={sel && !r.k.includes(sel) ? 0.12 : 0.42}
              style={{ transition: "opacity 200ms" }}
              onMouseEnter={() => setSel(r.k.split("→")[0])}
              onMouseLeave={() => setSel(null)}
            />
          ))}
          {COLS.map((col, ci) => (
            <g key={ci}>
              <text x={col.x} y="34" fontSize="10" fill="#8A7F73" fontFamily="IBM Plex Mono" letterSpacing="1.6">
                {["SOURCES", "OPERATING CASH", "ALLOCATION", "SHAREHOLDERS"][ci]}
              </text>
              <line x1={col.x} x2={col.x + 150} y1="44" y2="44" stroke="rgba(35,27,18,0.3)" />
              {col.nodes.map((n) => {
                const p = pos[n.k];
                const on = sel === n.k;
                return (
                  <g key={n.k} onMouseEnter={() => setSel(n.k)} onMouseLeave={() => setSel(null)} style={{ cursor: "pointer" }}>
                    <rect x={p.x} y={p.y0} width="13" height={p.y1 - p.y0} fill={n.c} opacity={sel && !on ? 0.45 : 1} />
                    <rect x={p.x - 3} y={p.y0 - 4} width={176} height={p.y1 - p.y0 + 8} fill={on ? "rgba(35,27,18,0.07)" : "transparent"} />
                    <text x={p.x + 20} y={p.y0 + 14} fontSize="11.5" fill="#231B12" fontFamily="IBM Plex Mono" fontWeight={on ? 700 : 500}>
                      {n.k.length > 22 ? n.k.slice(0, 21) + "…" : n.k}
                    </text>
                    <text x={p.x + 20} y={p.y0 + 31} fontSize="15" fill={n.c} fontFamily="Newsreader" fontWeight="600">${nf(n.v)}m</text>
                  </g>
                );
              })}
            </g>
          ))}
        </svg>
      </div>

      <div className="mt-4 grid gap-5 border-t pt-4 sm:grid-cols-4" style={{ borderColor: t.rule }}>
        {[
          ["Revenue → operating profit", "18.3% retained"],
          ["Operating profit → cash", "96% converted"],
          ["Cash → free cash flow", "54% survives capex"],
          ["Free cash flow → shareholders", "68% returned"],
        ].map(([k, v]) => (
          <div key={k}>
            <Caps style={{ color: t.sub }}>{k}</Caps>
            <div className="font-display text-[18px]">{v}</div>
          </div>
        ))}
      </div>
      <p className="mt-3 font-display text-[15px] italic" style={{ color: "rgba(35,27,18,0.7)" }}>
        {sel ? `Following “${sel}” — ribbons that do not touch it fade out.` : "Ribbons are drawn to scale; column heights are normalised so narrow stages stay legible."}
      </p>
      <span className="sr-only">{CO.ticker}</span>
      <span className="sr-only">{nf(W + H)}</span>
    </div>
  );
}

export function C46() {
  const nm = "Free cash flow bridge";
  return (
    <>
      <Plate n={46} letter="a" name={nm} variant="Waterfall — profit to free cash, one bar per adjustment" tone="paper" caption="Subtotals in solid colour, adjustments in green or claret, dotted connectors carrying the running balance between bars. Switch years to compare, and click any bar for its share of operating cash and a written explanation.">
        <P46A />
      </Plate>
      <Plate n={46} letter="b" name={nm} variant="Running total read as a line with step deltas" tone="ink" caption="The same adjustments plotted as a cumulative path: you can see where cash peaks after operating flow and how much capex takes back. Each node lights its own delta in the rail on hover.">
        <P46B />
      </Plate>
      <Plate n={46} letter="c" name={nm} variant="Sankey — follow the money through the business" tone="sand" caption="The widest stage to the narrowest: revenue splits into cost and profit, profit converts to cash, cash converts to free cash and then to shareholders. Hover any node or ribbon to isolate its path.">
        <P46C />
      </Plate>
    </>
  );
}
