import { useMemo, useState } from "react";
import { Caps, Plate, Toggle, TONES, nf, poly, lin, type Tone } from "@/ui";
import { BALANCE, CASHFLOW, FY, INCOME, type Row } from "@/data";

type StmtKey = "inc" | "bal" | "cfs";
const STMTS: { k: StmtKey; label: string; rows: Row[] }[] = [
  { k: "inc", label: "Income statement", rows: INCOME },
  { k: "bal", label: "Balance sheet", rows: BALANCE },
  { k: "cfs", label: "Cash flow", rows: CASHFLOW },
];
type Disp = "abs" | "pct" | "yoy";
const baseOf = (k: StmtKey) => (k === "bal" ? 7144 : 4820);



/* ═══════════════════════ 1.a — THE LEDGER ═══════════════════════ */
function A() {
  const t = TONES.paper;
  const [stmt, setStmt] = useState<StmtKey>("inc");
  const [disp, setDisp] = useState<Disp>("abs");
  const [open, setOpen] = useState<string[]>(["Revenue", "Cost of revenue"]);
  const rows = STMTS.find((s) => s.k === stmt)!.rows;
  const base = baseOf(stmt);
  const toggle = (k: string) =>
    setOpen((o) => (o.includes(k) ? o.filter((x) => x !== k) : [...o, k]));

  const cell = (r: Row, i: number) => {
    if (disp === "abs") return nf(Math.abs(r.v[i]), r.k.includes("EPS") ? 2 : 0);
    if (disp === "pct") return `${((Math.abs(r.v[i]) / base) * 100).toFixed(1)}%`;
    if (i === 0) return "—";
    const g = ((r.v[i] - r.v[i - 1]) / Math.abs(r.v[i - 1] || 1)) * 100;
    return `${g > 0 ? "+" : ""}${g.toFixed(1)}%`;
  };

  const render = (list: Row[], depth: number): React.ReactNode[] =>
    list.flatMap((r) => {
      const isOpen = open.includes(r.k + stmt);
      return [
        <tr
          key={r.k}
          onClick={() => r.sub && toggle(r.k + stmt)}
          className="group"
          style={{
            borderBottom: `1px solid ${t.rule}`,
            background: isOpen ? t.soft : "transparent",
            cursor: r.sub ? "pointer" : "default",
          }}
        >
          <td className="py-[7px] pr-3 align-top" style={{ paddingLeft: depth * 22 }}>
            <span className="flex items-baseline gap-1.5">
              {r.sub ? (
                <span
                  className="inline-block w-2 shrink-0 font-mono text-[10px] transition-transform"
                  style={{ color: t.down, transform: isOpen ? "rotate(90deg)" : "none" }}
                >
                  ▸
                </span>
              ) : (
                <span className="inline-block w-2 shrink-0" />
              )}
              <span
                className={`text-[13px] leading-snug ${r.strong ? "font-semibold" : ""}`}
                style={{ color: r.strong ? t.fg : "rgba(22,18,14,0.8)" }}
              >
                {r.k}
              </span>
            </span>
          </td>
          {FY.map((_, i) => (
            <td
              key={i}
              className="tnum py-[7px] pl-3 text-right font-mono text-[12.5px]"
              style={{
                color: r.strong ? t.fg : "rgba(22,18,14,0.78)",
                fontWeight: r.strong ? 600 : 400,
                borderLeft: i === FY.length - 1 ? `1px solid ${t.rule}` : "none",
                background: i === FY.length - 1 ? "rgba(142,31,47,0.04)" : "transparent",
              }}
            >
              {r.k.includes("Diluted") ? "" : r.v[i] < 0 && disp === "abs" ? "(" : ""}
              {cell(r, i)}
              {r.k.includes("Diluted") ? "" : r.v[i] < 0 && disp === "abs" ? ")" : ""}
            </td>
          ))}
          <td className="w-[70px] py-[7px] pl-3 text-right">
            {r.sub ? (
              <span className="font-mono text-[9.5px] tracking-[0.14em]" style={{ color: t.sub }}>
                {r.sub.length} DETAIL
              </span>
            ) : null}
          </td>
        </tr>,
        ...(isOpen && r.sub
          ? r.sub.map((s) => (
              <tr key={s.k} style={{ borderBottom: `1px dashed ${t.rule}`, background: "rgba(142,31,47,0.03)" }}>
                <td className="py-[5px] pr-3" style={{ paddingLeft: (depth + 1) * 22 + 14 }}>
                  <span className="font-display text-[13px] italic" style={{ color: "rgba(22,18,14,0.62)" }}>
                    {s.k}
                  </span>
                </td>
                {FY.map((_, i) => (
                  <td key={i} className="tnum py-[5px] pl-3 text-right font-mono text-[12px]" style={{ color: "rgba(22,18,14,0.6)" }}>
                    {cell(s, i)}
                  </td>
                ))}
                <td />
              </tr>
            ))
          : []),
      ];
    });

  return (
    <>
      <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
        <div className="flex items-end gap-5 border-b" style={{ borderColor: t.rule }}>
          {STMTS.map((s) => (
            <button
              key={s.k}
              onClick={() => setStmt(s.k)}
              className="relative -mb-px pb-2 font-sans text-[13px] font-semibold tracking-tight transition-colors"
              style={{ color: stmt === s.k ? t.fg : t.sub }}
            >
              {s.label}
              {stmt === s.k && <span className="absolute -bottom-px left-0 h-[3px] w-full" style={{ background: t.down }} />}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <Caps style={{ color: t.sub }}>Show</Caps>
          <Toggle opts={["abs", "pct", "yoy"] as const} value={disp} onChange={setDisp} t={t} size="sm" />
        </div>
      </div>

      <div className="overflow-x-auto scroller">
        <table className="w-full min-w-[760px] border-collapse">
          <thead>
            <tr style={{ borderBottom: `2px solid ${t.fg}` }}>
              <th className="pb-2 text-left">
                <Caps style={{ color: t.sub }}>US$ millions, year ended 31 Dec</Caps>
              </th>
              {FY.map((y, i) => (
                <th key={y} className="pb-2 pl-3 text-right">
                  <span className="font-mono text-[10.5px] tracking-[0.14em]" style={{ color: i === 4 ? t.down : t.fg }}>
                    {y}
                    {i === 4 && " ★"}
                  </span>
                </th>
              ))}
              <th className="pb-2 pl-3" />
            </tr>
          </thead>
          <tbody>{render(rows, 0)}</tbody>
        </table>
      </div>

      <div className="mt-5 flex flex-wrap gap-x-8 gap-y-2 border-t pt-3" style={{ borderColor: t.rule }}>
        {[
          ["Gross margin", "44.8%", "+80bp"],
          ["Operating margin", "21.3%", "+310bp"],
          ["Free cash flow", "$456m", "+43.0%"],
          ["Net debt / EBITDA", "1.4×", "−0.3×"],
        ].map(([k, v, d]) => (
          <div key={k}>
            <Caps style={{ color: t.sub }}>{k}</Caps>
            <div className="tnum font-sans text-[17px] font-bold">
              {v} <span className="font-mono text-[11px] font-normal" style={{ color: t.up }}>{d}</span>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

/* ═══════════════════════ 1.b — TERMINAL INSPECTOR ═══════════════════════ */
function B() {
  const t = TONES.ink;
  const [stmt, setStmt] = useState<StmtKey>("inc");
  const [sel, setSel] = useState<Row>(INCOME[0]);
  const rows = STMTS.find((s) => s.k === stmt)!.rows;
  const base = baseOf(stmt);
  const spark = sel.v.map((v) => Math.abs(v));
  const w = 236, h = 62;
  const pts = spark.map((v, i) => [lin(i, 0, spark.length - 1, 2, w - 2), lin(v, Math.min(...spark), Math.max(...spark), h - 4, 4)] as [number, number]);
  const cagr = (Math.pow(Math.abs(sel.v[4]) / Math.abs(sel.v[0] || 1), 1 / 4) - 1) * 100;

  return (
    <div className="grid gap-0" style={{ gridTemplateColumns: "214px minmax(0,1fr) 264px" }}>
      {/* tree */}
      <div className="pr-4" style={{ borderRight: `1px solid ${t.rule}` }}>
        <Caps style={{ color: t.sub }}>Statements</Caps>
        <div className="mt-3 space-y-4">
          {STMTS.map((s) => (
            <div key={s.k}>
              <button
                onClick={() => { setStmt(s.k); setSel(s.rows[0]); }}
                className="flex w-full items-center justify-between py-1 text-left font-sans text-[12.5px] font-semibold"
                style={{ color: stmt === s.k ? "#F0E9E1" : t.sub }}
              >
                {s.label}
                <span className="font-mono text-[9px]">{stmt === s.k ? "●" : "○"}</span>
              </button>
              {stmt === s.k && (
                <div className="mt-1 space-y-px pl-2">
                  {s.rows.filter((r) => !r.sub).slice(0, 8).map((r) => (
                    <button
                      key={r.k}
                      onClick={() => setSel(r)}
                      className="block w-full truncate px-2 py-[3px] text-left font-mono text-[10.5px] transition-colors"
                      style={{
                        color: sel.k === r.k ? t.bg : "rgba(240,233,225,0.6)",
                        background: sel.k === r.k ? "rgba(224,107,107,0.9)" : "transparent",
                      }}
                    >
                      {r.k}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="mt-6 border-t pt-3" style={{ borderColor: t.rule }}>
          <Caps style={{ color: t.sub }}>Quick keys</Caps>
          <div className="mt-2 space-y-1 font-mono text-[10px]" style={{ color: "rgba(240,233,225,0.5)" }}>
            <div>[1/2/3] statement</div>
            <div>[E] export CSV</div>
            <div>[F] as % of base</div>
          </div>
        </div>
      </div>

      {/* table */}
      <div className="min-w-0 px-5">
        <div className="mb-3 flex items-center justify-between">
          <span className="font-sans text-[14px] font-bold tracking-tight">{STMTS.find((s) => s.k === stmt)!.label}</span>
          <Caps style={{ color: t.sub }}>FY21 – FY25 · US$m</Caps>
        </div>
        <div className="overflow-x-auto scroller">
          <table className="w-full min-w-[520px] border-collapse">
            <thead>
              <tr style={{ borderBottom: `1px solid ${t.rule}` }}>
                <th className="pb-1.5 text-left"><Caps style={{ color: t.sub }}>Line item</Caps></th>
                {FY.map((y) => (
                  <th key={y} className="pb-1.5 pl-2 text-right font-mono text-[10px]" style={{ color: t.sub }}>{y}</th>
                ))}
                <th className="pb-1.5 pl-3 text-right"><Caps style={{ color: t.sub }}>Trend</Caps></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => {
                const on = sel.k === r.k;
                const mx = Math.max(...r.v.map(Math.abs));
                return (
                  <tr
                    key={r.k}
                    onClick={() => setSel(r)}
                    className="cursor-pointer"
                    style={{
                      borderBottom: `1px solid ${t.rule}`,
                      background: on ? "rgba(224,107,107,0.12)" : "transparent",
                      boxShadow: on ? `inset 2px 0 0 ${t.down}` : "none",
                    }}
                  >
                    <td className="py-[6px] pr-2">
                      <span className="truncate text-[12.5px]" style={{ color: r.strong ? "#F0E9E1" : "rgba(240,233,225,0.72)", fontWeight: r.strong ? 600 : 400 }}>
                        {r.k}
                      </span>
                    </td>
                    {r.v.map((v, i) => (
                      <td key={i} className="tnum py-[6px] pl-2 text-right font-mono text-[11.5px]" style={{ color: r.strong ? "#F0E9E1" : "rgba(240,233,225,0.66)" }}>
                        {nf(v, r.k.includes("EPS") ? 2 : 0)}
                      </td>
                    ))}
                    <td className="py-[6px] pl-3">
                      <svg width="76" height="14" className="block">
                        {r.v.map((v, i) => (
                          <rect
                            key={i}
                            x={i * 15.4}
                            y={14 - (Math.abs(v) / mx) * 14}
                            width="11"
                            height={(Math.abs(v) / mx) * 14}
                            fill={i === 4 ? t.down : "rgba(240,233,225,0.32)"}
                          />
                        ))}
                      </svg>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* inspector */}
      <div className="pl-5" style={{ borderLeft: `1px solid ${t.rule}` }}>
        <Caps style={{ color: t.down }}>Inspecting</Caps>
        <div className="mt-1 font-sans text-[15px] font-bold leading-tight">{sel.k}</div>
        <svg width={w} height={h + 18} className="mt-4 block">
          <path d={poly(pts)} fill="none" stroke={t.down} strokeWidth="2" />
          {pts.map((p, i) => (
            <circle key={i} cx={p[0]} cy={p[1]} r="2.6" fill={i === 4 ? t.down : "#F0E9E1"} />
          ))}
          {FY.map((y, i) => (
            <text key={y} x={lin(i, 0, 4, 6, w - 6)} y={h + 12} fontSize="9" fill={t.sub} textAnchor="middle" fontFamily="IBM Plex Mono">
              {y}
            </text>
          ))}
        </svg>
        <div className="mt-3 grid grid-cols-2 gap-3">
          {[
            ["4-yr CAGR", `${cagr.toFixed(1)}%`],
            ["FY25 vs FY21", `${(((Math.abs(sel.v[4]) - Math.abs(sel.v[0])) / Math.abs(sel.v[0] || 1)) * 100).toFixed(0)}%`],
            ["% of base", `${((Math.abs(sel.v[4]) / base) * 100).toFixed(1)}%`],
            ["Share of Δ", `${(Math.abs(sel.v[4] - sel.v[3]) / 9.1).toFixed(0)}%`],
          ].map(([k, v]) => (
            <div key={k}>
              <Caps style={{ color: t.sub }}>{k}</Caps>
              <div className="tnum font-mono text-[15px]" style={{ color: "#F0E9E1" }}>{v}</div>
            </div>
          ))}
        </div>
        <div className="mt-4 border-t pt-3 text-[11.5px] leading-relaxed" style={{ borderColor: t.rule, color: "rgba(240,233,225,0.62)" }}>
          <span className="font-display italic" style={{ color: t.sub }}>Note — </span>
          {sel.sub ? `${sel.sub.length} disclosed sub-components; click the row label in the ledger to expand.` : "Single disclosed line item; no sub-component detail in the filing."}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════ 1.c — BROADSHEET PAGE ═══════════════════════ */
function C() {
  const t = TONES.sand;
  const [stmt, setStmt] = useState<StmtKey>("inc");
  const rows = STMTS.find((s) => s.k === stmt)!.rows;
  const [open, setOpen] = useState<string[]>([]);

  const d = useMemo(
    () => rows.filter((r) => r.strong).map((r) => ({ k: r.k, v: r.v[4] - r.v[3] })),
    [rows],
  );
  void baseOf(stmt);
  const mx = Math.max(...d.map((x) => Math.abs(x.v)), 1);

  return (
    <>
      <div className="mb-6 flex flex-wrap items-baseline gap-6 border-b-2 pb-2" style={{ borderColor: t.fg }}>
        <span className="font-display text-[26px] leading-none">Statements of Halcyon Grid Technologies</span>
        <div className="ml-auto flex gap-1">
          {STMTS.map((s) => (
            <button
              key={s.k}
              onClick={() => setStmt(s.k)}
              className="px-3 py-1 font-mono text-[10px] uppercase tracking-[0.16em] transition-colors"
              style={{
                background: stmt === s.k ? t.fg : "transparent",
                color: stmt === s.k ? t.bg : "rgba(35,27,18,0.55)",
                border: `1px solid ${stmt === s.k ? t.fg : t.rule}`,
              }}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)]">
        <div>
          <table className="w-full border-collapse">
            <thead>
              <tr style={{ borderBottom: `1px solid ${t.fg}` }}>
                <th className="pb-1.5 text-left font-display text-[13px] italic" style={{ color: t.sub }}>
                  For the year ended 31 December
                </th>
                {FY.map((y) => (
                  <th key={y} className="pb-1.5 pl-4 text-right font-display text-[15px] tabular-nums">{y}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => {
                const isOpen = open.includes(r.k);
                return (
                  <>
                    <tr
                      key={r.k}
                      onClick={() => r.sub && setOpen((o) => (isOpen ? o.filter((x) => x !== r.k) : [...o, r.k]))}
                      style={{ borderBottom: `1px solid ${t.rule}`, cursor: r.sub ? "pointer" : "default" }}
                    >
                      <td className="py-[9px] pr-3">
                        <span className="flex items-baseline gap-2">
                          <span className="font-mono text-[10px]" style={{ color: r.sub ? t.down : "transparent" }}>
                            {r.sub ? (isOpen ? "–" : "+") : "·"}
                          </span>
                          <span
                            className={`font-display ${r.strong ? "text-[17px] font-medium" : "text-[15.5px]"}`}
                            style={{ color: r.strong ? t.fg : "rgba(35,27,18,0.82)" }}
                          >
                            {r.k}
                          </span>
                        </span>
                      </td>
                      {r.v.map((v, i) => (
                        <td
                          key={i}
                          className="py-[9px] pl-4 text-right font-display text-[16px] tabular-nums"
                          style={{ fontWeight: r.strong ? 500 : 400, color: v < 0 ? "#8E1F2F" : t.fg }}
                        >
                          {r.k.includes("EPS") ? v.toFixed(2) : nf(Math.abs(v))}
                          {v < 0 && <span className="ml-0.5 text-[11px]">▾</span>}
                        </td>
                      ))}
                    </tr>
                    {isOpen &&
                      r.sub?.map((s) => (
                        <tr key={s.k} style={{ background: "rgba(35,27,18,0.045)" }}>
                          <td className="py-[6px] pl-7 pr-3 font-display text-[14px] italic" style={{ color: "rgba(35,27,18,0.66)" }}>
                            {s.k}
                          </td>
                          {s.v.map((v, i) => (
                            <td key={i} className="py-[6px] pl-4 text-right font-mono text-[12.5px] tabular-nums" style={{ color: "rgba(35,27,18,0.7)" }}>
                              {nf(Math.abs(v))}
                            </td>
                          ))}
                        </tr>
                      ))}
                  </>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* margin column */}
        <aside style={{ borderLeft: `1px solid ${t.rule}` }} className="pl-6">
          <Caps style={{ color: t.sub }}>Margin note — change on prior year</Caps>
          <div className="mt-4 space-y-3">
            {d.map((x) => (
              <div key={x.k}>
                <div className="flex items-baseline justify-between gap-2">
                  <span className="font-display text-[14.5px]">{x.k}</span>
                  <span className="font-mono text-[12px] tabular-nums" style={{ color: x.v >= 0 ? t.up : t.down }}>
                    {x.v >= 0 ? "+" : "−"}
                    {nf(Math.abs(x.v))}
                  </span>
                </div>
                <div className="mt-1 h-[9px] w-full" style={{ background: "rgba(35,27,18,0.08)" }}>
                  <div
                    className="h-full"
                    style={{
                      width: `${(Math.abs(x.v) / mx) * 100}%`,
                      background: x.v >= 0 ? t.up : t.down,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
          <p className="mt-6 border-t pt-4 font-display text-[15px] italic leading-relaxed" style={{ borderColor: t.rule, color: "rgba(35,27,18,0.72)" }}>
            {stmt === "inc"
              ? "Operating income more than doubled year on year, and every point of it came from mix: software attach on the storage line and 80bp of gross margin recovered from freight normalisation."
              : stmt === "bal"
                ? "Receivables grew faster than revenue for a second year — worth watching. Inventory turns slipped to 3.0× as the Pune ramp built ahead of demand."
                : "Working capital absorbed $182m while capex stepped up to $386m; free cash flow still rose 43%, funding $248m of buybacks without new debt."}
          </p>
          <div className="mt-5 grid grid-cols-2 gap-x-4 gap-y-3">
            {[
              ["Revenue / total assets", "0.68×"],
              ["Current ratio", "2.10×"],
              ["Cash conversion", "0.54×"],
              ["Effective tax rate", "21.0%"],
            ].map(([k, v]) => (
              <div key={k}>
                <Caps style={{ color: t.sub }}>{k}</Caps>
                <div className="font-display text-[19px] tabular-nums">{v}</div>
              </div>
            ))}
          </div>
          <p className="mt-5 font-mono text-[10px] leading-relaxed" style={{ color: t.sub }}>
            Source: Form 10-K filed 13 Feb 2026, pp. 62–88. Selected non-GAAP reconciliations omitted.
            <br />
            Base for percentages: {stmt === "bal" ? "total assets, $7,144m" : "revenue, $4,820m"}.
          </p>
        </aside>
      </div>
    </>
  );
}

export default function C1() {
  const nm = "Financial statement explorer";
  return (
    <>
      <Plate n={1} letter="a" name={nm} variant="The ledger — three statements, five years, every subtotal expands" tone="paper" caption="Traditional broadsheet accounting: hairline rules, no boxes, parenthesised negatives, and a single claret column marking the year in hand. Disclosure depth is shown explicitly rather than hidden behind an icon.">
        <A />
      </Plate>
      <Plate n={1} letter="b" name={nm} variant="Terminal inspector — pick a line item, read its shape" tone="ink" caption="Density over decoration. The left tree mirrors the filing's own structure, the right rail turns the selected line into a five-year shape with CAGR, base share and a written note. Micro-bars in the trend column let the eye scan direction without reading a digit.">
        <B />
      </Plate>
      <Plate n={1} letter="c" name={nm} variant="Broadsheet page with a margin column of commentary" tone="sand" caption="Set like an annual-report spread: serif figures, italic margin notes, and a year-on-year change bar for every headline subtotal. The commentary changes with the statement, so the plate reads as an analyst's marked-up printout.">
        <C />
      </Plate>
    </>
  );
}
export type { StmtKey };
export { STMTS };
export type { Tone };
