import { useMemo, useState } from "react";
import { Caps, Chip, Plate, Slider, Toggle, TONES, bn, nf } from "@/ui";
import { CO } from "@/data";

/* Shared model maths ------------------------------------------------- */
type Assum = {
  g1: number; g2: number; g3: number; g4: number; g5: number;
  term: number; wacc: number; tax: number; margin: number; da: number; capex: number; nwc: number;
};
const BASE: Assum = { g1: 26, g2: 24, g3: 21, g4: 18, g5: 16, term: 3.9, wacc: 7.0, tax: 21, margin: 34, da: 6.0, capex: 7.0, nwc: 8 };

const REV0 = 4820;
function model(a: Assum) {
  const gs = [a.g1, a.g2, a.g3, a.g4, a.g5];
  let rev = REV0;
  const rows: { rev: number; ebit: number; nopat: number; da: number; capex: number; nwc: number; fcf: number }[] = [];
  for (let i = 0; i < 5; i++) {
    const prev = rev;
    rev = rev * (1 + gs[i] / 100);
    const ebit = rev * (a.margin / 100);
    const nopat = ebit * (1 - a.tax / 100);
    const da = rev * (a.da / 100);
    const capex = rev * (a.capex / 100);
    const nwc = (rev - prev) * (a.nwc / 100);
    rows.push({ rev, ebit, nopat, da, capex, nwc, fcf: nopat + da - capex - nwc });
  }
  const pv = rows.reduce((s, r, i) => s + r.fcf / Math.pow(1 + a.wacc / 100, i + 1), 0);
  const last = rows[4].fcf;
  const tv = (last * (1 + a.term / 100)) / (a.wacc / 100 - a.term / 100);
  const pvTv = tv / Math.pow(1 + a.wacc / 100, 5);
  const ev = pv + pvTv;
  const eq = ev - CO.netDebt * 1000;
  const share = eq / (CO.shares * 1000);
  return { rows, pv, tv, pvTv, ev, eq, ps: share, tvShare: (pvTv / ev) * 100, upside: (share / CO.price - 1) * 100 };
}

/* ═══════════════════════ 2.a — THE LIVE MODEL ═══════════════════════ */
function A() {
  const t = TONES.paper;
  const [a, setA] = useState<Assum>({ ...BASE });
  const m = useMemo(() => model(a), [a]);
  const set = (k: keyof Assum) => (v: number) => setA((p) => ({ ...p, [k]: v }));
  const w = 520, h = 168;
  const fcf = m.rows.map((r) => r.fcf);
  const mx = Math.max(...fcf) * 1.12;

  const presets: Record<string, Assum> = {
    bear: { ...BASE, g1: 20, g2: 18, g3: 16, g4: 14, g5: 12, wacc: 8.2, margin: 31, term: 3.4 },
    base: BASE,
    bull: { ...BASE, g1: 30, g2: 27, g3: 23, g4: 20, g5: 18, wacc: 6.8, margin: 35, term: 4.0 },
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[300px_minmax(0,1fr)]">
      {/* assumptions */}
      <div className="pr-7" style={{ borderRight: `1px solid ${t.rule}` }}>
        <div className="mb-4 flex items-center justify-between">
          <Caps style={{ color: t.down }}>Assumptions</Caps>
          <Toggle opts={["bear", "base", "bull"] as const} value={(Object.keys(presets).find((k) => JSON.stringify(presets[k]) === JSON.stringify(a)) as "base") ?? "base"} onChange={(k) => setA({ ...presets[k] })} t={t} size="sm" />
        </div>
        <div className="space-y-4">
          {([["g1", "Revenue growth — yr 1"], ["g2", "Revenue growth — yr 2"], ["g3", "Revenue growth — yr 3"], ["g4", "Revenue growth — yr 4"], ["g5", "Revenue growth — yr 5"]] as const).map(([k, l]) => (
            <Slider key={k} label={l} value={a[k]} min={-5} max={40} step={0.5} onChange={set(k)} t={t} fmt={(v) => `${v.toFixed(1)}%`} />
          ))}
          <div className="h-px" style={{ background: t.rule }} />
          <Slider label="Terminal growth" value={a.term} min={0} max={5} step={0.1} onChange={set("term")} t={t} fmt={(v) => `${v.toFixed(1)}%`} />
          <Slider label="WACC (discount rate)" value={a.wacc} min={5} max={14} step={0.1} onChange={set("wacc")} t={t} fmt={(v) => `${v.toFixed(1)}%`} />
          <Slider label="Operating margin — yr 5" value={a.margin} min={12} max={40} step={0.5} onChange={set("margin")} t={t} fmt={(v) => `${v.toFixed(1)}%`} />
          <Slider label="Tax rate" value={a.tax} min={10} max={32} step={0.5} onChange={set("tax")} t={t} fmt={(v) => `${v.toFixed(1)}%`} />
          <div className="grid grid-cols-3 gap-3 pt-1">
            {([["capex", "% rev"], ["da", "% rev"], ["nwc", "% Δrev"]] as const).map(([k, u]) => (
              <label key={k}>
                <Caps style={{ color: t.sub }}>{k}</Caps>
                <input
                  type="number"
                  value={a[k]}
                  onChange={(e) => set(k)(parseFloat(e.target.value) || 0)}
                  className="tnum mt-1 w-full bg-transparent pb-1 font-mono text-[13px] outline-none"
                  style={{ borderBottom: `1px solid ${t.rule}`, color: t.fg }}
                />
                <span className="font-mono text-[9px]" style={{ color: t.sub }}>{u}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* output */}
      <div className="min-w-0">
        <div className="grid grid-cols-2 gap-x-8 gap-y-4 border-b pb-5 sm:grid-cols-4" style={{ borderColor: t.rule }}>
          <div className="col-span-2">
            <Caps style={{ color: t.sub }}>Fair value per share</Caps>
            <div className="tnum -ml-1 font-sans text-[clamp(46px,6vw,76px)] font-extrabold leading-[0.86] tracking-[-0.045em]" style={{ color: t.down }}>
              ${m.ps.toFixed(2)}
            </div>
            <div className="mt-1.5 font-display text-[15px] italic">
              vs ${CO.price.toFixed(2)} today ·{" "}
              <span style={{ color: m.upside >= 0 ? t.up : t.down }}>
                {m.upside >= 0 ? "▲" : "▼"} {Math.abs(m.upside).toFixed(1)}% implied
              </span>
            </div>
          </div>
          {[
            ["Enterprise value", bn(m.ev / 1000, 1)],
            ["Equity value", bn(m.eq / 1000, 1)],
            ["Terminal value share", `${m.tvShare.toFixed(0)}%`],
            [`${(m.ev / m.rows[4].rev).toFixed(1)}× EV/Sales yr 5`, `EV/EBITDA ${(m.ev / (m.rows[4].rev * (a.margin / 100))).toFixed(1)}×`],
          ].map(([k, v]) => (
            <div key={k}>
              <Caps style={{ color: t.sub }}>{k}</Caps>
              <div className="tnum font-sans text-[21px] font-bold tracking-tight">{v}</div>
            </div>
          ))}
        </div>

        <div className="mt-5 grid gap-7 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <div>
            <Caps style={{ color: t.sub }}>Unlevered free cash flow, FY26–FY30 · US$m</Caps>
            <svg width="100%" viewBox={`0 0 ${w} ${h}`} className="mt-2 block" preserveAspectRatio="none" style={{ height: h }}>
              {[0, 0.25, 0.5, 0.75, 1].map((f) => (
                <line key={f} x1="0" x2={w} y1={h - 26 - f * (h - 40)} y2={h - 26 - f * (h - 40)} stroke={t.rule} strokeWidth="1" />
              ))}
              {m.rows.map((r, i) => {
                const bw = 54;
                const x = i * (w / 5) + 12;
                const bh = (r.fcf / mx) * (h - 46);
                return (
                  <g key={i}>
                    <rect x={x} y={h - 26 - bh} width={bw} height={bh} fill={t.down} opacity={0.85} className="barGrow" style={{ transformOrigin: `0px ${h - 26}px` }} />
                    <text x={x + bw / 2} y={h - 12} textAnchor="middle" fontSize="10" fill={t.sub} fontFamily="IBM Plex Mono">{`FY${26 + i}`}</text>
                    <text x={x + bw / 2} y={h - 32 - bh} textAnchor="middle" fontSize="11" fill={t.fg} fontFamily="IBM Plex Mono" fontWeight="600">{nf(r.fcf)}</text>
                  </g>
                );
              })}
            </svg>
          </div>
          <div>
            <Caps style={{ color: t.sub }}>Projection detail · US$m</Caps>
            <table className="mt-2 w-full border-collapse">
              <thead>
                <tr style={{ borderBottom: `1px solid ${t.fg}` }}>
                  <th className="pb-1 text-left"><Caps style={{ color: t.sub }}>Line</Caps></th>
                  {m.rows.map((_, i) => (
                    <th key={i} className="pb-1 pl-2 text-right font-mono text-[10px]" style={{ color: t.sub }}>{`FY${26 + i}`}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {([["Revenue", "rev"], ["EBIT", "ebit"], ["NOPAT", "nopat"], ["+ D&A", "da"], ["− Capex", "capex"], ["− ΔNWC", "nwc"], ["= FCF", "fcf"]] as const).map(([lab, key]) => (
                  <tr key={lab} style={{ borderBottom: `1px solid ${t.rule}`, background: key === "fcf" ? t.soft : "transparent" }}>
                    <td className="py-[5px] pr-2 text-[12.5px]" style={{ fontWeight: key === "fcf" ? 600 : 400 }}>{lab}</td>
                    {m.rows.map((r, i) => (
                      <td key={i} className="tnum py-[5px] pl-2 text-right font-mono text-[11.5px]" style={{ fontWeight: key === "fcf" ? 600 : 400 }}>
                        {nf(Math.round(r[key]))}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="mt-3 font-display text-[13.5px] italic leading-snug" style={{ color: t.sub }}>
              Terminal value contributes {m.tvShare.toFixed(0)}% of enterprise value — {m.tvShare > 88 ? "most of the answer is beyond the forecast: treat it with suspicion." : m.tvShare > 78 ? "on the high side; the exit multiple is doing the work." : "a defensible weighting for a compounder."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════ 2.b — MODEL GRID + SENSITIVITY ═══════════════════════ */
function B() {
  const t = TONES.blueprint;
  const [a, setA] = useState<Assum>({ ...BASE });
  const [edit, setEdit] = useState<keyof Assum>("wacc");
  const m = useMemo(() => model(a), [a]);
  const waccs = [7.0, 7.5, 8.0, 8.6, 9.0, 9.5, 10.0];
  const terms = [2.0, 2.6, 3.2, 3.8, 4.4];
  const cell = (wv: number, tv: number) => model({ ...a, wacc: wv, term: tv }).ps;
  const all = waccs.flatMap((wv) => terms.map((tv) => cell(wv, tv)));
  const lo = Math.min(...all), hi = Math.max(...all);

  const inputs: [keyof Assum, string, string][] = [
    ["g1", "Growth y1", "%"], ["g2", "Growth y2", "%"], ["g3", "Growth y3", "%"], ["g4", "Growth y4", "%"], ["g5", "Growth y5", "%"],
    ["margin", "EBIT margin", "%"], ["tax", "Tax rate", "%"], ["capex", "Capex / rev", "%"], ["da", "D&A / rev", "%"], ["nwc", "ΔNWC / Δrev", "%"],
    ["term", "Terminal g", "%"], ["wacc", "WACC", "%"],
  ];

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Caps style={{ color: t.sub }}>Halcyon Grid · DCF v4.2 · analyst working model</Caps>
          <Chip t={t} on>⌘ live</Chip>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setA({ ...BASE })} className="px-3 py-1 font-mono text-[10px] uppercase tracking-[0.16em]" style={{ border: `1px solid ${t.rule}`, color: t.sub }}>Reset</button>
          <button className="px-3 py-1 font-mono text-[10px] uppercase tracking-[0.16em]" style={{ background: t.down, color: t.bg }}>Save scenario</button>
        </div>
      </div>

      <div className="grid gap-0 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
        {/* input grid */}
        <div className="pr-6" style={{ borderRight: `1px solid ${t.rule}` }}>
          <div className="grid grid-cols-2 gap-x-5 gap-y-0 sm:grid-cols-3">
            {inputs.map(([k, lab, u]) => (
              <div
                key={k}
                onClick={() => setEdit(k)}
                className="cursor-pointer px-2 py-2 transition-colors"
                style={{
                  borderBottom: `1px solid ${t.rule}`,
                  background: edit === k ? "rgba(232,138,122,0.14)" : "transparent",
                  boxShadow: edit === k ? `inset 0 -2px 0 ${t.down}` : "none",
                }}
              >
                <Caps style={{ color: edit === k ? t.down : t.sub }}>{lab}</Caps>
                <div className="flex items-baseline gap-1">
                  <input
                    type="number"
                    step={0.1}
                    value={a[k]}
                    onChange={(e) => setA((p) => ({ ...p, [k]: parseFloat(e.target.value) || 0 }))}
                    onClick={(e) => e.stopPropagation()}
                    className="tnum w-full bg-transparent font-mono text-[19px] font-medium outline-none"
                    style={{ color: "#E6EDF5" }}
                  />
                  <span className="font-mono text-[11px]" style={{ color: t.sub }}>{u}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6">
            <Caps style={{ color: t.sub }}>Sensitivity — fair value per share, WACC × terminal growth</Caps>
            <div className="mt-2 overflow-x-auto scroller">
              <table className="w-full border-collapse" style={{ minWidth: 460 }}>
                <thead>
                  <tr>
                    <th className="p-1 text-left font-mono text-[9.5px]" style={{ color: t.sub }}>WACC ↓ / g →</th>
                    {terms.map((tv) => (
                      <th key={tv} className="p-1 text-center font-mono text-[10px]" style={{ color: t.sub }}>{tv.toFixed(1)}%</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {waccs.map((wv) => (
                    <tr key={wv}>
                      <td className="tnum p-1 font-mono text-[10.5px]" style={{ color: wv === a.wacc ? t.down : t.sub, fontWeight: wv === a.wacc ? 600 : 400 }}>
                        {wv.toFixed(1)}%
                      </td>
                      {terms.map((tv) => {
                        const v = cell(wv, tv);
                        const f = (v - lo) / (hi - lo || 1);
                        const isBase = Math.abs(wv - a.wacc) < 0.26 && Math.abs(tv - a.term) < 0.31;
                        return (
                          <td
                            key={tv}
                            onClick={() => setA((p) => ({ ...p, wacc: wv, term: tv }))}
                            className="tnum cursor-pointer p-1 text-center font-mono text-[11.5px] transition-transform"
                            style={{
                              background: `rgba(99,194,166,${0.06 + f * 0.4})`,
                              color: f > 0.55 ? "#0B1A26" : "#E6EDF5",
                              outline: isBase ? `2px solid ${t.down}` : "none",
                              outlineOffset: "-2px",
                              fontWeight: isBase ? 700 : 400,
                            }}
                          >
                            {v.toFixed(0)}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-2 font-mono text-[10px]" style={{ color: t.sub }}>
              Click any cell to adopt it as the working case. Base case outlined.
            </div>
          </div>
        </div>

        {/* output */}
        <div className="pl-6">
          <Caps style={{ color: t.down }}>Output</Caps>
          <div className="tnum font-sans text-[clamp(44px,5.5vw,70px)] font-extrabold leading-[0.85] tracking-[-0.05em]">
            ${m.ps.toFixed(2)}
          </div>
          <div className="mt-1 font-mono text-[12px]" style={{ color: t.sub }}>
            equity {bn(m.eq / 1000, 1)} · EV {bn(m.ev / 1000, 1)}
          </div>
          <div
            className="mt-3 inline-block px-2.5 py-1 font-mono text-[13px] font-medium"
            style={{ background: m.upside >= 0 ? "rgba(99,194,166,0.2)" : "rgba(232,138,122,0.2)", color: m.upside >= 0 ? t.up : t.down }}
          >
            {m.upside >= 0 ? "▲" : "▼"} {Math.abs(m.upside).toFixed(1)}% vs market
          </div>

          <div className="mt-5" style={{ borderTop: `1px solid ${t.rule}` }}>
            {([["PV of explicit FCF", m.pv], ["PV of terminal value", m.pvTv], ["Less: net debt", -CO.netDebt * 1000], ["Equity value", m.eq]] as const).map(([k, v]) => (
              <div key={k} className="flex items-baseline justify-between py-[7px]" style={{ borderBottom: `1px solid ${t.rule}` }}>
                <span className="text-[12.5px]" style={{ color: "rgba(230,237,245,0.75)" }}>{k}</span>
                <span className="tnum font-mono text-[13px]" style={{ color: k === "Equity value" ? t.down : "#E6EDF5", fontWeight: k === "Equity value" ? 600 : 400 }}>
                  {nf(Math.round(v))}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-4">
            <Caps style={{ color: t.sub }}>Value bridge</Caps>
            <svg width="100%" viewBox="0 0 300 74" className="mt-1 block">
              <rect x="0" y={74 - (m.pv / m.ev) * 66} width="88" height={(m.pv / m.ev) * 66} fill={t.up} opacity="0.75" />
              <rect x="104" y={74 - (m.pvTv / m.ev) * 66} width="88" height={(m.pvTv / m.ev) * 66} fill={t.down} opacity="0.8" />
              <rect x="208" y={74 - (m.eq / m.ev) * 66} width="88" height={(m.eq / m.ev) * 66} fill="#E6EDF5" opacity="0.35" />
              {["Explicit", "Terminal", "Equity"].map((l, i) => (
                <text key={l} x={i * 104 + 44} y="72" fontSize="9" fill={t.sub} textAnchor="middle" fontFamily="IBM Plex Mono">{l}</text>
              ))}
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════ 2.c — ASSUMPTIONS + FOOTBALL FIELD ═══════════════════════ */
function C() {
  const t = TONES.bone;
  const [a, setA] = useState<Assum>({ ...BASE });
  const [open, setOpen] = useState<string[]>(["growth", "returns"]);
  const m = useMemo(() => model(a), [a]);
  const set = (k: keyof Assum) => (v: number) => setA((p) => ({ ...p, [k]: v }));
  const flip = (k: string) => setOpen((o) => (o.includes(k) ? o.filter((x) => x !== k) : [...o, k]));

  const bands = [
    { k: "Discounted cash flow", lo: m.ps * 0.9, hi: m.ps * 1.14, mid: m.ps, tone: "#8E1F2F" },
    { k: "EV / EBITDA — peers", lo: 168, hi: 232, mid: 197, tone: "#1B3A5C" },
    { k: "PEG — growth adjusted", lo: 152, hi: 214, mid: 181, tone: "#D98324" },
    { k: "Sum of the parts", lo: 196, hi: 258, mid: 224, tone: "#2E5E4A" },
    { k: "Precedent transactions", lo: 184, hi: 246, mid: 212, tone: "#8A7F73" },
    { k: "Analyst target range", lo: CO.targetLow, hi: CO.targetHigh, mid: CO.target, tone: "#5C1420" },
  ];
  const lo = 120, hi = 275;

  const groups: [string, string, [keyof Assum, string, number, number, number, (v: number) => string][]][] = [
    ["growth", "Growth", [
      ["g1", "Year 1 revenue growth", -5, 40, 0.5, (v) => `${v.toFixed(1)}%`],
      ["g2", "Year 2 revenue growth", -5, 40, 0.5, (v) => `${v.toFixed(1)}%`],
      ["g3", "Year 3 revenue growth", -5, 40, 0.5, (v) => `${v.toFixed(1)}%`],
      ["g4", "Year 4 revenue growth", -5, 40, 0.5, (v) => `${v.toFixed(1)}%`],
      ["g5", "Year 5 revenue growth", -5, 40, 0.5, (v) => `${v.toFixed(1)}%`],
    ]],
    ["returns", "Returns & discount", [
      ["margin", "Terminal operating margin", 12, 40, 0.5, (v) => `${v.toFixed(1)}%`],
      ["wacc", "WACC", 5, 14, 0.1, (v) => `${v.toFixed(1)}%`],
      ["term", "Terminal growth", 0, 5, 0.1, (v) => `${v.toFixed(1)}%`],
      ["tax", "Effective tax rate", 10, 32, 0.5, (v) => `${v.toFixed(1)}%`],
    ]],
  ];

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,340px)_minmax(0,1fr)]">
      <div className="pr-7" style={{ borderRight: `1px solid ${t.rule}` }}>
        <div className="flex items-center justify-between pb-3">
          <Caps style={{ color: t.down }}>Working assumptions</Caps>
          <button onClick={() => setA({ ...BASE })} className="font-mono text-[10px] uppercase tracking-[0.16em]" style={{ color: t.sub, textDecoration: "underline", textUnderlineOffset: 3 }}>
            revert
          </button>
        </div>
        {groups.map(([key, title, fields]) => {
          const on = open.includes(key);
          return (
            <div key={key} style={{ borderTop: `1px solid ${t.rule}` }}>
              <button onClick={() => flip(key)} className="flex w-full items-center justify-between py-2.5 text-left">
                <span className="font-sans text-[13.5px] font-semibold tracking-tight">{title}</span>
                <span className="font-mono text-[14px]" style={{ color: t.down }}>{on ? "−" : "+"}</span>
              </button>
              {on && (
                <div className="space-y-3.5 pb-4">
                  {fields.map(([k, lab, mn, mx2, st, f]) => (
                    <Slider key={k} label={lab} value={a[k]} min={mn} max={mx2} step={st} onChange={set(k)} t={t} fmt={f} />
                  ))}
                </div>
              )}
            </div>
          );
        })}
        <div className="mt-4 flex gap-2">
          {(["bear", "base", "bull"] as const).map((s) => {
            const p = s === "bear" ? { ...BASE, g1: 20, g2: 18, g3: 16, g4: 14, g5: 12, wacc: 8.2, margin: 31, term: 3.4 } : s === "bull" ? { ...BASE, g1: 30, g2: 27, g3: 23, g4: 20, g5: 18, wacc: 6.8, margin: 35, term: 4.0 } : BASE;
            return (
              <button key={s} onClick={() => setA(p)} className="flex-1 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] transition-colors" style={{ border: `1px solid ${t.rule}`, color: t.sub }}>
                {s}
              </button>
            );
          })}
        </div>
      </div>

      <div className="min-w-0">
        <div className="flex flex-wrap items-end justify-between gap-4 border-b pb-3" style={{ borderColor: t.fg }}>
          <div>
            <Caps style={{ color: t.sub }}>Model output per share</Caps>
            <div className="tnum font-sans text-[54px] font-extrabold leading-none tracking-[-0.045em]">${m.ps.toFixed(0)}</div>
          </div>
          <div className="text-right">
            <Caps style={{ color: t.sub }}>Blended fair value</Caps>
            <div className="tnum font-sans text-[54px] font-extrabold leading-none tracking-[-0.045em]" style={{ color: t.down }}>
              ${Math.round(bands.reduce((s, b) => s + b.mid, 0) / bands.length)}
            </div>
          </div>
        </div>

        <div className="mt-6">
          <Caps style={{ color: t.sub }}>Valuation range by method · US$ per share</Caps>
          <div className="mt-4 space-y-3.5">
            {bands.map((b) => (
              <div key={b.k} className="grid items-center gap-3" style={{ gridTemplateColumns: "168px minmax(0,1fr) 86px" }}>
                <span className="font-display text-[15px] leading-tight">{b.k}</span>
                <div className="relative h-[26px]" style={{ background: "rgba(22,18,14,0.05)" }}>
                  <div className="absolute top-0 h-full" style={{ left: `${((b.lo - lo) / (hi - lo)) * 100}%`, width: `${((b.hi - b.lo) / (hi - lo)) * 100}%`, background: b.tone, opacity: 0.28 }} />
                  <div className="absolute top-0 h-full w-[2px]" style={{ left: `${((b.mid - lo) / (hi - lo)) * 100}%`, background: b.tone }} />
                </div>
                <span className="tnum text-right font-mono text-[11.5px]" style={{ color: t.sub }}>
                  {b.lo}–{b.hi}
                </span>
              </div>
            ))}
            <div className="grid items-center gap-3 pt-1" style={{ gridTemplateColumns: "168px minmax(0,1fr) 86px" }}>
              <span />
              <div className="relative">
                <div className="absolute -top-1 h-[calc(100%+8px)] w-[2px]" style={{ left: `${((CO.price - lo) / (hi - lo)) * 100}%`, background: t.fg }} />
                <div className="flex justify-between pt-3 font-mono text-[10px]" style={{ color: t.sub }}>
                  {[125, 150, 175, 200, 225, 250, 270].map((v) => <span key={v}>{v}</span>)}
                </div>
              </div>
              <span className="tnum text-right font-mono text-[11.5px] font-semibold">${CO.price}</span>
            </div>
          </div>
        </div>

        <div className="mt-7 grid gap-5 border-t pt-4 sm:grid-cols-3" style={{ borderColor: t.rule }}>
          {[
            ["Implied FY27 EV/Sales", `${((m.ev / 1000 / (m.rows[1].rev / 1000))).toFixed(1)}×`],
            ["Years to double from here", `${(Math.log(2) / Math.log(1 + a.g3 / 100)).toFixed(1)} yrs`],
            ["Margin of safety", `${(((m.ps - CO.price) / m.ps) * 100).toFixed(0)}%`],
          ].map(([k, v]) => (
            <div key={k}>
              <Caps style={{ color: t.sub }}>{k}</Caps>
              <div className="tnum font-sans text-[24px] font-bold tracking-tight">{v}</div>
            </div>
          ))}
        </div>
        <p className="mt-4 font-display text-[14px] italic leading-relaxed" style={{ color: "rgba(22,18,14,0.66)" }}>
          Weighted equally across five methods, the blended value sits {(m.ps > CO.price ? "above" : "below")} today's quote. Drag any assumption and every band, headline and ratio above re-solves immediately — the model is never stale.
        </p>
      </div>
    </div>
  );
}

export default function C2() {
  const nm = "Valuation model";
  return (
    <>
      <Plate n={2} letter="a" name={nm} variant="A discounted cash flow you can actually drive" tone="paper" caption="THE MOMENT OF THE BOOK: drag a slider and the headline fair value, the implied upside, the FCF bars and the projection table all re-solve together on salmon paper. Presets snap the whole assumption set to a bull, base or bear view.">
        <A />
      </Plate>
      <Plate n={2} letter="b" name={nm} variant="Working model grid with a live sensitivity matrix" tone="blueprint" caption="Built like the analyst's own file: click any input cell to make it active, type straight into it, and read the two-way WACC × terminal-growth table underneath. Clicking a sensitivity cell adopts it as the working case and the output rail follows.">
        <B />
      </Plate>
      <Plate n={2} letter="c" name={nm} variant="Assumption stack beside a football field of methods" tone="bone" caption="Grouped, collapsible assumption drawers on the left; on the right the DCF result is placed in context against four other methods and the actual analyst target range, with today's price ruled in black.">
        <C />
      </Plate>
    </>
  );
}
export { BASE, model };
export type { Assum };
