import { useState } from "react";
import { Caps, Chip, Plate, TONES, lin, smooth, type ToneSpec } from "@/ui";
import { CO, PX_30D } from "@/data";

/* ═══════════════════════ shared helpers ═══════════════════════ */
const spark = (vals: number[], w: number, h: number, pad = 2) =>
  smooth(vals.map((v, i) => [lin(i, 0, vals.length - 1, pad, w - pad), lin(v, Math.min(...vals), Math.max(...vals), h - pad, pad)] as [number, number]));

function Frame({ t, label, children, note }: { t: ToneSpec; label: string; children: React.ReactNode; note?: string }) {
  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
      <div className="flex min-h-[150px] flex-col items-start justify-center gap-3 border p-6" style={{ borderColor: t.rule, background: t.panel }}>
        {children}
      </div>
      <div>
        <Caps style={{ color: t.sub }}>{label}</Caps>
        <p className="mt-1 font-display text-[15px] italic leading-relaxed" style={{ color: t.sub }}>{note}</p>
      </div>
    </div>
  );
}

/* ═══════════════════════ 116 — PRICE AND CHANGE ═══════════════════════ */
function P116a() {
  const t = TONES.paper;
  const [mode, setMode] = useState<"last" | "bid">("last");
  const price = mode === "last" ? CO.price : CO.price - 0.04;
  return (
    <Frame t={t} label="Design note" note="The price as a masthead: giant tabular figure, change beneath in claret-on-green, and a two-state last/bid toggle that actually moves the number.">
      <div className="flex flex-wrap items-end gap-6">
        <div>
          <Caps style={{ color: t.sub }}>NASDAQ · HLG</Caps>
          <div className="tnum font-sans text-[clamp(56px,9vw,104px)] font-extrabold leading-[0.82] tracking-[-0.055em]">
            {price.toFixed(2)}
          </div>
        </div>
        <div className="pb-2">
          <div className="tnum font-sans text-[34px] font-extrabold leading-none" style={{ color: t.up }}>
            ▲ {CO.chg.toFixed(2)}
          </div>
          <div className="tnum font-sans text-[26px] font-bold leading-none" style={{ color: t.up }}>
            +{CO.chgPct.toFixed(2)}%
          </div>
          <div className="mt-1 font-mono text-[11px]" style={{ color: t.sub }}>vs prev close {CO.prev.toFixed(2)}</div>
        </div>
        <div className="flex gap-1.5 pb-3">
          {(["last", "bid"] as const).map((m) => (
            <button key={m} onClick={() => setMode(m)} className="px-3 py-1 font-mono text-[10px] uppercase tracking-[0.16em]" style={mode === m ? { background: t.fg, color: t.bg } : { border: `1px solid ${t.rule}`, color: t.sub }}>
              {m}
            </button>
          ))}
        </div>
      </div>
      <div className="flex flex-wrap gap-x-7 gap-y-1 border-t pt-3" style={{ borderColor: t.rule }}>
        {[["Open", CO.open], ["High", CO.high], ["Low", CO.low], ["Prev", CO.prev]].map(([k, v]) => (
          <span key={k as string} className="font-mono text-[11.5px]" style={{ color: t.sub }}>
            {k as string} <span className="tnum" style={{ color: t.fg }}>{(v as number).toFixed(2)}</span>
          </span>
        ))}
      </div>
    </Frame>
  );
}

function P116b() {
  const t = TONES.ink;
  const [flash, setFlash] = useState(false);
  return (
    <Frame t={t} label="Design note" note="Terminal treatment: monospaced, sign-first, with a session-tick flash. The whole tile is a button — pressing it replays the last tick so the interaction is legible in a static comp.">
      <button
        onClick={() => { setFlash(true); setTimeout(() => setFlash(false), 500); }}
        className="flex items-center gap-5 px-5 py-4 transition-colors"
        style={{ border: `1px solid ${t.rule}`, background: flash ? "rgba(87,184,148,0.22)" : "transparent" }}
      >
        <span className="flex h-[42px] w-[42px] items-center justify-center font-sans text-[20px] font-extrabold" style={{ background: t.down, color: t.bg }}>H</span>
        <span className="text-left">
          <span className="block font-mono text-[11px] uppercase tracking-[0.2em]" style={{ color: t.sub }}>HLG · NASDAQ · USD</span>
          <span className="tnum block font-mono text-[38px] font-medium leading-tight" style={{ color: "#F0E9E1" }}>
            {CO.price.toFixed(2)}
          </span>
        </span>
        <span className="text-right">
          <span className="tnum block font-mono text-[17px]" style={{ color: t.up }}>+{CO.chg.toFixed(2)}</span>
          <span className="tnum block font-mono text-[17px]" style={{ color: t.up }}>+{CO.chgPct.toFixed(2)}%</span>
          <span className="block font-mono text-[10px]" style={{ color: t.sub }}>15:42:07 ET</span>
        </span>
        <span className="ml-2" style={{ color: t.up }}>▲</span>
      </button>
      <div className="flex gap-6 font-mono text-[11px]" style={{ color: t.sub }}>
        <span>last trade 5,842 sh</span>
        <span>NBBO 187.40 × 187.44</span>
        <span>venue ARCA</span>
      </div>
    </Frame>
  );
}

function P116c() {
  const t = TONES.sand;
  const [compare, setCompare] = useState(false);
  const pts = PX_30D;
  return (
    <Frame t={t} label="Design note" note="Price as a printed figure with the last thirty sessions drawn through the baseline; toggling comparison overlays the sector index as a dashed line and reports the spread.">
      <div className="relative w-full">
        <svg viewBox="0 0 620 120" width="100%" className="absolute inset-0 h-full w-full" preserveAspectRatio="none">
          <path d={spark(pts, 620, 120, 6)} fill="none" stroke={t.fg} strokeWidth="1.6" opacity="0.35" />
          {compare && <path d={spark(pts.map((v, i) => v * (0.94 + Math.sin(i / 6) * 0.02)), 620, 120, 6)} fill="none" stroke={t.down} strokeWidth="1.6" strokeDasharray="5 4" />}
        </svg>
        <div className="relative flex flex-wrap items-end justify-between gap-5">
          <div>
            <div className="font-display text-[27px] leading-none">Halcyon Grid Technologies</div>
            <div className="tnum font-sans text-[clamp(44px,7vw,76px)] font-extrabold leading-[0.85] tracking-[-0.05em]" style={{ color: t.down }}>
              ${CO.price.toFixed(2)}
            </div>
          </div>
          <div className="text-right">
            <div className="tnum font-sans text-[27px] font-extrabold leading-none" style={{ color: t.up }}>+{CO.chgPct.toFixed(2)}%</div>
            <button onClick={() => setCompare(!compare)} className="mt-2 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.16em]" style={{ border: `1px solid ${compare ? t.down : t.rule}`, color: compare ? t.down : t.sub }}>
              {compare ? "vs sector: +2.4pt" : "compare vs sector"}
            </button>
          </div>
        </div>
      </div>
    </Frame>
  );
}

/* ═══════════════════════ 118 — 52-WEEK RANGE ═══════════════════════ */
function R118a() {
  const t = TONES.paper;
  const [hover, setHover] = useState<number | null>(null);
  const pos = ((CO.price - CO.lo52) / (CO.hi52 - CO.lo52)) * 100;
  const at = hover ?? pos;
  return (
    <Frame t={t} label="Design note" note="The classic two-point bar, drawn as a hairline scale: drag or hover along it to read the price at any percentile, with the current position marked by a claret block rather than a dot.">
      <div className="w-full">
        <div className="flex items-baseline justify-between">
          <Caps style={{ color: t.sub }}>52-week range</Caps>
          <span className="font-mono text-[11.5px]" style={{ color: t.down }}>
            {hover === null ? "current position" : `hovering · ${at.toFixed(0)}th percentile`}
          </span>
        </div>
        <div
          className="relative mt-4 h-[34px] w-full cursor-ew-resize"
          onMouseMove={(e) => {
            const r = e.currentTarget.getBoundingClientRect();
            setHover(Math.max(0, Math.min(100, ((e.clientX - r.left) / r.width) * 100)));
          }}
          onMouseLeave={() => setHover(null)}
          style={{ background: `linear-gradient(to right, rgba(142,31,47,0.28) 0%, rgba(142,31,47,0.05) 100%)`, borderTop: `1px solid ${t.rule}`, borderBottom: `1px solid ${t.rule}` }}
        >
          {Array.from({ length: 11 }).map((_, i) => (
            <span key={i} className="absolute top-0 h-[7px] w-px" style={{ left: `${i * 10}%`, background: t.rule }} />
          ))}
          <span className="absolute top-0 h-full w-[7px]" style={{ left: `calc(${at}% - 3.5px)`, background: t.down }} />
          <span className="absolute -top-1 h-[42px] w-px" style={{ left: `${pos}%`, background: t.fg }} />
        </div>
        <div className="mt-2 flex items-baseline justify-between">
          <span>
            <span className="tnum block font-sans text-[30px] font-extrabold leading-none">${CO.lo52}</span>
            <Caps style={{ color: t.sub }}>52-week low · 14 Mar 2025</Caps>
          </span>
          <span className="text-center">
            <span className="tnum block font-sans text-[22px] font-bold leading-none" style={{ color: t.down }}>{pos.toFixed(0)}%</span>
            <Caps style={{ color: t.sub }}>of range</Caps>
          </span>
          <span className="text-right">
            <span className="tnum block font-sans text-[30px] font-extrabold leading-none">${CO.hi52}</span>
            <Caps style={{ color: t.sub }}>52-week high · 09 Jan 2026</Caps>
          </span>
        </div>
      </div>
    </Frame>
  );
}

function R118b() {
  const t = TONES.ink;
  const buckets = [4, 7, 12, 19, 26, 31, 28, 22, 17, 11, 6, 3];
  const lo = CO.lo52, hi = CO.hi52;
  const idx = Math.min(11, Math.floor(((CO.price - lo) / (hi - lo)) * 12));
  return (
    <Frame t={t} label="Design note" note="Range as a distribution: how many sessions were spent at each level, so the current price can be read against where the stock actually lived rather than against two extremes.">
      <div className="w-full">
        <div className="flex items-baseline justify-between">
          <Caps style={{ color: t.sub }}>Days spent by price level · 252 sessions</Caps>
          <span className="tnum font-mono text-[13px]" style={{ color: t.up }}>now ${CO.price.toFixed(2)}</span>
        </div>
        <div className="mt-4 flex h-[96px] items-end gap-[3px]">
          {buckets.map((b, i) => (
            <div key={i} className="relative flex-1" style={{ height: `${(b / 31) * 100}%`, background: i === idx ? t.down : "rgba(240,233,225,0.26)" }}>
              {i === idx && <span className="absolute -top-5 left-1/2 -translate-x-1/2 font-mono text-[10px]" style={{ color: t.down }}>now</span>}
            </div>
          ))}
        </div>
        <div className="mt-2 flex justify-between border-t pt-2 font-mono text-[11.5px]" style={{ borderColor: t.rule }}>
          <span className="tnum" style={{ color: t.sub }}>low ${lo}</span>
          <span className="tnum" style={{ color: t.sub }}>
            median ${(168.4).toFixed(2)} · percentile {(((CO.price - lo) / (hi - lo)) * 100).toFixed(0)}
          </span>
          <span className="tnum" style={{ color: t.sub }}>high ${hi}</span>
        </div>
        <div className="mt-3 flex gap-6 font-mono text-[11px]" style={{ color: t.sub }}>
          <span>days above $187: <span className="tnum" style={{ color: "#F0E9E1" }}>41</span></span>
          <span>days below $140: <span className="tnum" style={{ color: "#F0E9E1" }}>58</span></span>
          <span>range width: <span className="tnum" style={{ color: "#F0E9E1" }}>${(hi - lo).toFixed(2)}</span></span>
        </div>
      </div>
    </Frame>
  );
}

function R118c() {
  const t = TONES.sand;
  const [quarter, setQuarter] = useState("All");
  const lo = quarter === "Q1'25" ? 108.94 : quarter === "Q2'25" ? 132.1 : quarter === "Q3'25" ? 151.4 : quarter === "Q4'25" ? 162.2 : CO.lo52;
  const hi = quarter === "Q1'25" ? 131.4 : quarter === "Q2'25" ? 156.8 : quarter === "Q3'25" ? 174.9 : quarter === "Q4'25" ? 183.6 : CO.hi52;
  const now = quarter === "All" ? CO.price : (lo + hi) / 2;
  const pos = ((now - lo) / (hi - lo)) * 100;

  return (
    <Frame t={t} label="Design note" note="Range re-scoped by period: switching quarters re-draws the same rail with that quarter's extremes, so you can see the stock at the top of its own recent range rather than its year.">
      <div className="w-full">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="font-display text-[23px] italic">Where it has traded</div>
          <div className="flex gap-1.5">
            {["All", "Q1'25", "Q2'25", "Q3'25", "Q4'25"].map((q) => (
              <Chip key={q} t={t} on={quarter === q} onClick={() => setQuarter(q)} color="#8E1F2F">{q}</Chip>
            ))}
          </div>
        </div>

        <div className="mt-5 flex items-center gap-5">
          <div className="text-center">
            <div className="tnum font-sans text-[30px] font-extrabold leading-none">${lo.toFixed(2)}</div>
            <Caps style={{ color: t.sub }}>low</Caps>
          </div>
          <div className="relative h-[46px] flex-1">
            <div className="absolute top-1/2 h-[4px] w-full -translate-y-1/2" style={{ background: "rgba(35,27,18,0.16)" }} />
            <div className="absolute top-1/2 h-[4px] -translate-y-1/2" style={{ left: 0, width: `${pos}%`, background: t.down }} />
            <div className="absolute top-1/2 flex h-[34px] w-[34px] -translate-y-1/2 items-center justify-center rounded-full" style={{ left: `calc(${pos}% - 17px)`, background: t.down, boxShadow: `0 0 0 3px ${t.bg}` }}>
              <span className="h-[10px] w-[10px] rounded-full" style={{ background: t.bg }} />
            </div>
            <span className="absolute top-0 font-mono text-[10px]" style={{ left: `${pos}%`, transform: "translateX(-50%)", color: t.down }}>
              {pos.toFixed(0)}%
            </span>
          </div>
          <div className="text-center">
            <div className="tnum font-sans text-[30px] font-extrabold leading-none">${hi.toFixed(2)}</div>
            <Caps style={{ color: t.sub }}>high</Caps>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-x-7 gap-y-1 border-t pt-3" style={{ borderColor: t.rule }}>
          {[["Spread", `$${(hi - lo).toFixed(2)}`], ["Midpoint", `$${((lo + hi) / 2).toFixed(2)}`], ["Vs midpoint", `${(((now - (lo + hi) / 2) / ((lo + hi) / 2)) * 100).toFixed(1)}%`], ["Period", quarter]].map(([k, v]) => (
            <span key={k as string} className="font-mono text-[11.5px]" style={{ color: t.sub }}>
              {k as string} <span className="tnum" style={{ color: t.fg }}>{v as string}</span>
            </span>
          ))}
        </div>
      </div>
    </Frame>
  );
}

/* ═══════════════════════ 121 — NEXT EARNINGS DATE ═══════════════════════ */
function E121a() {
  const t = TONES.paper;
  const [set, setSet] = useState(true);
  const days = 36;
  return (
    <Frame t={t} label="Design note" note="A calendar leaf: the date set large, the countdown as a proportioned bar, and working toggles for reminders and the calendar-file affordance.">
      <div className="flex flex-wrap items-center gap-7">
        <div className="flex items-stretch" style={{ border: `1.5px solid ${t.fg}` }}>
          <div className="flex w-[86px] flex-col items-center justify-center px-3 py-3" style={{ background: t.down }}>
            <span className="font-mono text-[11px] uppercase tracking-[0.2em]" style={{ color: t.bg }}>Apr</span>
            <span className="tnum font-sans text-[46px] font-extrabold leading-none" style={{ color: t.bg }}>23</span>
            <span className="font-mono text-[10px]" style={{ color: t.bg }}>2026</span>
          </div>
          <div className="px-4 py-3">
            <Caps style={{ color: t.sub }}>Next earnings · Q1 2026</Caps>
            <div className="font-display text-[22px] leading-tight">Halcyon Grid reports before the open</div>
            <div className="font-mono text-[11.5px]" style={{ color: t.sub }}>08:30 ET · call at 09:00 ET · 68 min expected</div>
            <div className="mt-2 flex gap-2">
              <button onClick={() => setSet(!set)} className="px-3 py-1 font-mono text-[10px] uppercase tracking-[0.14em]" style={set ? { background: t.fg, color: t.bg } : { border: `1px solid ${t.rule}`, color: t.sub }}>
                {set ? "✓ reminder set" : "set reminder"}
              </button>
              <span className="px-3 py-1 font-mono text-[10px] uppercase tracking-[0.14em]" style={{ border: `1px solid ${t.rule}`, color: t.sub }}>add to calendar</span>
            </div>
          </div>
        </div>

        <div>
          <Caps style={{ color: t.sub }}>Countdown</Caps>
          <div className="flex items-baseline gap-2">
            <span className="tnum font-sans text-[64px] font-extrabold leading-none tracking-[-0.05em]" style={{ color: t.down }}>{days}</span>
            <span className="font-display text-[22px] italic">days</span>
          </div>
          <div className="mt-2 h-[8px] w-[240px]" style={{ background: "rgba(22,18,14,0.1)" }}>
            <div className="h-full" style={{ width: `${((90 - days) / 90) * 100}%`, background: t.down }} />
          </div>
          <div className="mt-1 font-mono text-[10.5px]" style={{ color: t.sub }}>of a 90-day quarter elapsed</div>
        </div>

        <div>
          <Caps style={{ color: t.sub }}>Implied move</Caps>
          <div className="tnum font-sans text-[42px] font-extrabold leading-none">±5.8%</div>
          <div className="font-mono text-[11px]" style={{ color: t.sub }}>≈ ${((CO.price * 0.058).toFixed(2))} · vs 4-qtr avg 4.9%</div>
        </div>
      </div>
    </Frame>
  );
}

function E121b() {
  const t = TONES.ink;
  const events = [
    { d: "23 Apr", t: "Q1 2026 earnings", k: "Earnings", days: 36 },
    { d: "24 Apr", t: "Analyst day", k: "Company", days: 37 },
    { d: "15 May", t: "Arden renewal window", k: "Contract", days: 58 },
    { d: "18 Jun", t: "FOMC decision", k: "Macro", days: 92 },
  ];
  const [sel, setSel] = useState(0);
  return (
    <Frame t={t} label="Design note" note="Earnings as the first row of a forward calendar rather than an isolated fact — the countdown sits beside three other dates that matter, with the nearest highlighted.">
      <div className="w-full">
        <div className="mb-3 flex items-baseline justify-between border-b pb-2" style={{ borderColor: t.rule }}>
          <Caps style={{ color: t.sub }}>Forward calendar · next four events</Caps>
          <span className="font-mono text-[11px]" style={{ color: t.up }}>HLG calendar synced</span>
        </div>
        <div className="space-y-0">
          {events.map((e, i) => (
            <button key={e.t} onClick={() => setSel(i)} className="grid w-full items-center gap-4 py-2.5 text-left" style={{ gridTemplateColumns: "76px minmax(0,1fr) 92px 64px", borderBottom: `1px solid ${t.rule}`, background: sel === i ? "rgba(224,107,107,0.1)" : "transparent" }}>
              <span className="tnum font-sans text-[19px] font-extrabold" style={{ color: sel === i ? t.down : "#F0E9E1" }}>{e.d}</span>
              <span className="truncate text-[15px]">{e.t}</span>
              <span className="font-mono text-[10.5px] uppercase tracking-[0.14em]" style={{ color: t.sub }}>{e.k}</span>
              <span className="tnum text-right font-mono text-[13px]" style={{ color: e.days < 40 ? t.down : t.sub }}>{e.days}d</span>
            </button>
          ))}
        </div>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <span className="font-display text-[15.5px] italic" style={{ color: t.sub }}>
            Earnings in {events[0].days} days · consensus $0.44 EPS on $1.99bn
          </span>
          <span className="px-3 py-1 font-mono text-[10px] uppercase tracking-[0.14em]" style={{ background: t.down, color: t.bg }}>Export .ics</span>
        </div>
      </div>
    </Frame>
  );
}

function E121c() {
  const t = TONES.sand;
  const [tz, setTz] = useState<"ET" | "UTC" | "IST">("ET");
  const times: Record<string, string> = { ET: "08:30", UTC: "12:30", IST: "18:00" };
  return (
    <Frame t={t} label="Design note" note="Treated as an appointment rather than a statistic: house-style numerals, a time-zone switch, and the practical details an analyst actually needs on the morning.">
      <div className="flex flex-wrap items-end gap-9">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.3em]" style={{ color: t.sub }}>Reporting date</div>
          <div className="flex items-baseline gap-4">
            <span className="tnum font-sans text-[clamp(56px,9vw,96px)] font-extrabold leading-[0.8] tracking-[-0.05em]">23</span>
            <span className="font-display text-[44px] leading-none">April</span>
            <span className="tnum font-display text-[30px] italic" style={{ color: t.down }}>2026</span>
          </div>
        </div>

        <div>
          <Caps style={{ color: t.sub }}>Time</Caps>
          <div className="flex items-baseline gap-3">
            <span className="tnum font-sans text-[44px] font-extrabold leading-none">{times[tz]}</span>
            <div className="flex gap-1">
              {(["ET", "UTC", "IST"] as const).map((z) => (
                <button key={z} onClick={() => setTz(z)} className="px-2.5 py-1 font-mono text-[11px]" style={tz === z ? { background: t.fg, color: t.bg } : { border: `1px solid ${t.rule}`, color: t.sub }}>
                  {z}
                </button>
              ))}
            </div>
          </div>
          <div className="mt-1 font-mono text-[11.5px]" style={{ color: t.sub }}>before the open · conference call 09:00</div>
        </div>

        <div>
          <Caps style={{ color: t.sub }}>Days remaining</Caps>
          <div className="flex gap-1">
            {Array.from({ length: 36 }).map((_, i) => (
              <span key={i} className="w-[5px] h-[30px]" style={{ background: i < 20 ? t.down : "rgba(35,27,18,0.16)" }} />
            ))}
          </div>
          <div className="mt-1 font-mono text-[11.5px]" style={{ color: t.sub }}>36 of 90 elapsed</div>
        </div>

        <div className="font-display text-[17px] italic leading-snug" style={{ color: "rgba(35,27,18,0.72)", maxWidth: 260 }}>
          Last time: Q4'25 reported 12 Feb 2026, beat by $0.05, shares +6.9%.
        </div>
      </div>
    </Frame>
  );
}

/* ═══════════════════════ 123 — PRICE TARGET VS CURRENT ═══════════════════════ */
function T123a() {
  const t = TONES.paper;
  const up = ((CO.target / CO.price - 1) * 100);
  const [showRange, setShowRange] = useState(true);
  return (
    <Frame t={t} label="Design note" note="The gap drawn as a distance: current price at the baseline, mean target above it, and the full analyst range behind — one number, one arrow, one honest spread.">
      <div className="w-full">
        <div className="flex flex-wrap items-end justify-between gap-5">
          <div>
            <Caps style={{ color: t.sub }}>Mean analyst target</Caps>
            <div className="tnum font-sans text-[clamp(44px,7vw,74px)] font-extrabold leading-[0.85] tracking-[-0.05em]">
              ${CO.target.toFixed(2)}
            </div>
          </div>
          <div className="pb-2 text-right">
            <div className="tnum font-sans text-[38px] font-extrabold leading-none" style={{ color: t.up }}>+{up.toFixed(1)}%</div>
            <div className="font-mono text-[11.5px]" style={{ color: t.sub }}>implied from ${CO.price.toFixed(2)}</div>
          </div>
        </div>

        <div className="relative mt-5 h-[64px]">
          {showRange && (
            <div className="absolute top-[14px] h-[26px]" style={{ left: `${((CO.targetLow - 140) / 130) * 100}%`, width: `${((CO.targetHigh - CO.targetLow) / 130) * 100}%`, background: "rgba(142,31,47,0.16)", border: `1px dashed ${t.down}` }}>
              <span className="absolute -top-5 left-0 font-mono text-[10px]" style={{ color: t.down }}>low ${CO.targetLow}</span>
              <span className="absolute -top-5 right-0 font-mono text-[10px]" style={{ color: t.down }}>high ${CO.targetHigh}</span>
            </div>
          )}
          <div className="absolute top-[42px] h-[26px] w-full" style={{ borderTop: `1px solid ${t.rule}` }}>
            <span className="absolute top-2 h-[16px] w-[7px]" style={{ left: `${((CO.price - 140) / 130) * 100}%`, background: t.fg }} />
            <span className="absolute top-2 h-[16px] w-[7px]" style={{ left: `${((CO.target - 140) / 130) * 100}%`, background: t.up }} />
            <span className="absolute top-[20px] font-mono text-[10.5px]" style={{ left: `${((CO.price - 140) / 130) * 100}%`, transform: "translateX(-50%)" }}>
              price ${CO.price.toFixed(2)}
            </span>
            <span className="absolute top-[38px] font-mono text-[10.5px]" style={{ left: `${((CO.target - 140) / 130) * 100}%`, transform: "translateX(-50%)", color: t.up }}>
              target
            </span>
          </div>
        </div>

        <button onClick={() => setShowRange(!showRange)} className="mt-3 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.16em]" style={{ border: `1px solid ${showRange ? t.down : t.rule}`, color: showRange ? t.down : t.sub }}>
          {showRange ? "hide" : "show"} full target range
        </button>
      </div>
    </Frame>
  );
}

function T123b() {
  const t = TONES.ink;
  const [basis, setBasis] = useState<"mean" | "median" | "high" | "low">("mean");
  const val = basis === "mean" ? CO.target : basis === "median" ? 220 : basis === "high" ? CO.targetHigh : CO.targetLow;
  const up = (val / CO.price - 1) * 100;
  const dist = [2, 3, 5, 9, 14, 17, 14, 11, 7, 4, 2, 1];
  const mx = Math.max(...dist);

  return (
    <Frame t={t} label="Design note" note="Four different targets, one switch: the number, the percentage and the distribution behind it all recompute, and the histogram shows why the mean is not the median.">
      <div className="w-full">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex gap-1.5">
            {(["mean", "median", "high", "low"] as const).map((b) => (
              <button key={b} onClick={() => setBasis(b)} className="px-3 py-1 font-mono text-[10px] uppercase tracking-[0.16em]" style={basis === b ? { background: t.down, color: t.bg } : { border: `1px solid ${t.rule}`, color: t.sub }}>
                {b}
              </button>
            ))}
          </div>
          <span className="font-mono text-[11px]" style={{ color: t.sub }}>10 analysts · updated 18 Mar 2026</span>
        </div>

        <div className="mt-4 flex flex-wrap items-end gap-8">
          <div>
            <div className="tnum font-sans text-[clamp(46px,7vw,80px)] font-extrabold leading-[0.85] tracking-[-0.05em]" style={{ color: up >= 0 ? t.up : t.down }}>
              {up >= 0 ? "+" : ""}{up.toFixed(1)}%
            </div>
            <div className="font-mono text-[12px]" style={{ color: t.sub }}>
              {basis} target ${val.toFixed(2)} · price ${CO.price.toFixed(2)}
            </div>
          </div>
          <div className="flex-1" style={{ minWidth: 260 }}>
            <div className="flex h-[74px] items-end gap-[3px]">
              {dist.map((d, i) => {
                const level = 140 + i * 11;
                const here = level >= CO.price && level <= val;
                return <div key={i} className="flex-1" style={{ height: `${(d / mx) * 100}%`, background: here ? t.up : "rgba(240,233,225,0.2)" }} title={`$${level}`} />;
              })}
            </div>
            <div className="mt-1.5 flex justify-between border-t pt-1.5 font-mono text-[10.5px]" style={{ borderColor: t.rule, color: t.sub }}>
              <span>$140</span><span>targets by level</span><span>$261</span>
            </div>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1 font-mono text-[11px]" style={{ color: t.sub }}>
          <span>spread ${(CO.targetHigh - CO.targetLow).toFixed(0)}</span>
          <span>std dev $26.40</span>
          <span>dispersion 12.3%</span>
          <span style={{ color: t.up }}>{CO.targetHigh > CO.price ? "9 of 10 above price" : "majority below price"}</span>
        </div>
      </div>
    </Frame>
  );
}

function T123c() {
  const t = TONES.sand;
  const [basis, setBasis] = useState<"consensus" | "meridian">("consensus");
  const val = basis === "consensus" ? CO.target : 198;
  const up = (val / CO.price - 1) * 100;
  return (
    <Frame t={t} label="Design note" note="Two houses' targets side by side — the street's and Meridian's own — with the distance expressed as an editorial sentence rather than only a percentage.">
      <div className="w-full">
        <div className="flex flex-wrap items-end justify-between gap-5 border-b-2 pb-3" style={{ borderColor: t.fg }}>
          <div className="font-display text-[26px] italic">How far is it to fair value?</div>
          <div className="flex gap-1.5">
            {(["consensus", "meridian"] as const).map((b) => (
              <Chip key={b} t={t} on={basis === b} onClick={() => setBasis(b)} color="#8E1F2F">
                {b === "consensus" ? "Street $214.50" : "Meridian $198.00"}
              </Chip>
            ))}
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-baseline gap-6">
          <span className="tnum font-sans text-[clamp(48px,8vw,86px)] font-extrabold leading-none tracking-[-0.05em]" style={{ color: up >= 0 ? t.down : "#2E5E4A" }}>
            {up >= 0 ? "+" : ""}{up.toFixed(1)}%
          </span>
          <span className="max-w-[46ch] font-display text-[21px] leading-snug">
            {up >= 0
              ? `The street says Halcyon is worth ${up.toFixed(0)}% more than it costs today — ${((val - CO.price)).toFixed(2)} dollars a share.`
              : `Meridian's own work says the shares are ${Math.abs(up).toFixed(0)}% ahead of themselves.`}
          </span>
        </div>

        <div className="mt-5 flex items-center gap-4">
          <span className="tnum font-mono text-[13px]">${CO.price.toFixed(2)}</span>
          <div className="relative h-[26px] flex-1" style={{ background: "rgba(35,27,18,0.09)" }}>
            <div className="h-full transition-all duration-500" style={{ width: `${Math.min(100, (val / 260) * 100)}%`, background: t.down }} />
            <div className="absolute top-0 h-full w-[3px]" style={{ left: `${(CO.price / 260) * 100}%`, background: t.fg }} />
            <div className="absolute -top-1 h-[34px] w-px" style={{ left: `${(CO.target / 260) * 100}%`, background: "#2E5E4A" }} />
          </div>
          <span className="tnum font-mono text-[13px]">$260</span>
        </div>
        <div className="mt-1 flex justify-between font-mono text-[10.5px]" style={{ color: t.sub }}>
          <span>black rule = today's price</span>
          <span style={{ color: "#2E5E4A" }}>green rule = street consensus</span>
        </div>
      </div>
    </Frame>
  );
}

/* ═══════════════════════ 131 — MARGIN TREND ARROW ═══════════════════════ */
function M131a() {
  const t = TONES.paper;
  const [line, setLine] = useState<"gross" | "operating" | "net">("gross");
  const series = { gross: [41.2, 42.0, 42.8, 43.4, 44.1, 44.8], operating: [12.4, 13.8, 15.1, 16.4, 17.9, 19.3], net: [8.3, 9.1, 10.2, 11.4, 12.4, 13.6] }[line];
  const d = series[5] - series[4];
  const d3 = series[5] - series[2];
  return (
    <Frame t={t} label="Design note" note="Direction as the headline: an oversized arrow, the change in basis points, and six periods drawn so the arrow can be checked against the data it summarises.">
      <div className="flex flex-wrap items-center gap-8">
        <div className="flex items-center gap-4">
          <span className="font-sans text-[76px] font-extrabold leading-none" style={{ color: d >= 0 ? t.up : t.down, transform: d >= 0 ? "none" : "rotate(180deg)" }}>↑</span>
          <div>
            <div className="tnum font-sans text-[42px] font-extrabold leading-none" style={{ color: d >= 0 ? t.up : t.down }}>
              {d >= 0 ? "+" : "−"}{Math.abs(d * 100).toFixed(0)}bp
            </div>
            <Caps style={{ color: t.sub }}>{line} margin · quarter on quarter</Caps>
          </div>
        </div>

        <svg width="230" height="86" viewBox="0 0 230 86" className="block">
          <path d={spark(series, 230, 86, 8)} fill="none" stroke={t.fg} strokeWidth="2.4" />
          {series.map((v, i) => (
            <circle key={i} cx={lin(i, 0, 5, 8, 222)} cy={lin(v, Math.min(...series), Math.max(...series), 78, 8)} r={i === 5 ? 5 : 3} fill={i === 5 ? t.down : t.fg} />
          ))}
          <line x1="6" x2="224" y1="82" y2="82" stroke={t.rule} />
        </svg>

        <div className="flex gap-1.5">
          {(["gross", "operating", "net"] as const).map((l) => (
            <button key={l} onClick={() => setLine(l)} className="px-3 py-1 font-mono text-[10px] uppercase tracking-[0.16em]" style={line === l ? { background: t.fg, color: t.bg } : { border: `1px solid ${t.rule}`, color: t.sub }}>
              {l}
            </button>
          ))}
        </div>

        <div>
          <Caps style={{ color: t.sub }}>Three-year change</Caps>
          <div className="tnum font-sans text-[26px] font-extrabold leading-none" style={{ color: t.up }}>+{Math.abs(d3 * 100).toFixed(0)}bp</div>
          <div className="font-mono text-[11px]" style={{ color: t.sub }}>expanding in 5 of 6 quarters</div>
        </div>
      </div>
    </Frame>
  );
}

function M131b() {
  const t = TONES.ledger;
  const rows = [
    { k: "Gross margin", v: 44.8, d: 0.8, streak: 5 },
    { k: "Operating margin", v: 19.3, d: 1.4, streak: 6 },
    { k: "Net margin", v: 13.6, d: 1.2, streak: 4 },
    { k: "EBITDA margin", v: 26.4, d: -0.3, streak: 0 },
  ];
  const [sel, setSel] = useState("Gross margin");
  return (
    <Frame t={t} label="Design note" note="Four margin lines at once, each with its own arrow, streak counter and a tiny spark — because 'expanding' is only useful if you know for how long.">
      <div className="w-full">
        <div className="grid gap-3" style={{ gridTemplateColumns: "minmax(0,1fr) 78px 96px 108px" }}>
          {["Margin", "Latest", "Q/Q", "Streak & shape"].map((h, i) => (
            <Caps key={h} style={{ color: t.sub, textAlign: i === 0 ? "left" : "right" }}>{h}</Caps>
          ))}
          {rows.map((r) => {
            const up = r.d >= 0;
            const on = sel === r.k;
            return (
              <div key={r.k} onClick={() => setSel(r.k)} className="cursor-pointer items-center gap-3 py-2" style={{ display: "grid", gridTemplateColumns: "subgrid", gridColumn: "1 / -1", borderBottom: `1px solid ${t.rule}`, background: on ? "rgba(232,240,234,0.07)" : "transparent" }}>
                <span className="text-[15px]" style={{ color: on ? "#E8F0EA" : t.sub }}>{r.k}</span>
                <span className="tnum text-right font-mono text-[16px]" style={{ color: "#E8F0EA" }}>{r.v.toFixed(1)}%</span>
                <span className="text-right font-sans text-[17px] font-extrabold" style={{ color: up ? t.up : t.down }}>
                  {up ? "▲" : "▼"} {Math.abs(r.d).toFixed(1)}pt
                </span>
                <span className="flex items-center justify-end gap-2">
                  <svg width="72" height="22" viewBox="0 0 72 22" className="block">
                    <path d={spark([r.v - r.d * 5, r.v - r.d * 4, r.v - r.d * 3.4, r.v - r.d * 2, r.v - r.d, r.v], 72, 22, 3)} fill="none" stroke={up ? t.up : t.down} strokeWidth="2" />
                  </svg>
                  <span className="tnum font-mono text-[11.5px]" style={{ color: t.sub }}>
                    {r.streak ? `${r.streak}↑` : "turning"}
                  </span>
                </span>
              </div>
            );
          })}
        </div>
        <div className="mt-3 border-t pt-3 font-display text-[16px] italic" style={{ borderColor: t.rule, color: t.sub }}>
          {sel === "EBITDA margin"
            ? "EBITDA margin dipped 30bp this quarter on the Pune start-up costs — the only line not expanding."
            : "Every line is expanding and the operating line has done so for six consecutive quarters; the streak counter is what makes the arrow meaningful."}
        </div>
      </div>
    </Frame>
  );
}

function M131c() {
  const t = TONES.sand;
  const [q, setQ] = useState(7);
  const data = [
    { q: "Q1'24", g: 41.2, o: 12.4 }, { q: "Q2'24", g: 42.0, o: 13.8 }, { q: "Q3'24", g: 42.8, o: 15.1 },
    { q: "Q4'24", g: 43.4, o: 16.4 }, { q: "Q1'25", g: 43.6, o: 14.9 }, { q: "Q2'25", g: 44.1, o: 16.9 },
    { q: "Q3'25", g: 44.9, o: 18.2 }, { q: "Q4'25", g: 45.6, o: 19.3 },
  ];
  const d = q > 0 ? data[q].o - data[q - 1].o : 0;
  return (
    <Frame t={t} label="Design note" note="Margins as a sentence you can step through: pick a quarter and the arrow, the delta and the written interpretation all follow the selection.">
      <div className="w-full">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b-2 pb-3" style={{ borderColor: t.fg }}>
          <div className="flex items-center gap-4">
            <span className="font-sans text-[64px] font-extrabold leading-none" style={{ color: d >= 0 ? "#2E5E4A" : "#8E1F2F", transform: d >= 0 ? "none" : "rotate(180deg)" }}>
              ↑
            </span>
            <div>
              <div className="tnum font-sans text-[34px] font-extrabold leading-none" style={{ color: d >= 0 ? "#2E5E4A" : "#8E1F2F" }}>
                {d >= 0 ? "+" : "−"}{Math.abs(d * 100).toFixed(0)}bp
              </div>
              <div className="font-mono text-[11px]" style={{ color: t.sub }}>operating margin, {data[q].q} vs prior quarter</div>
            </div>
          </div>
          <div className="flex gap-1.5">
            {data.map((x, i) => (
              <button key={x.q} onClick={() => setQ(i)} className="px-2 py-1 font-mono text-[10px]" style={q === i ? { background: t.fg, color: t.bg } : { border: `1px solid ${t.rule}`, color: t.sub }}>
                {x.q.slice(0, 2)}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4 grid gap-6 sm:grid-cols-3">
          {[["Gross", data[q].g, "#1B3A5C"], ["Operating", data[q].o, "#2E5E4A"], ["Net", data[q].o * 0.7, "#8E1F2F"]].map(([k, v, c]) => (
            <div key={k as string}>
              <Caps style={{ color: t.sub }}>{k as string} margin</Caps>
              <div className="tnum font-sans text-[34px] font-extrabold leading-none" style={{ color: c as string }}>
                {(v as number).toFixed(1)}%
              </div>
              <div className="mt-2 h-[7px] w-full" style={{ background: "rgba(35,27,18,0.1)" }}>
                <div className="h-full transition-all duration-300" style={{ width: `${((v as number) / 50) * 100}%`, background: c as string }} />
              </div>
            </div>
          ))}
        </div>

        <p className="mt-5 max-w-[70ch] font-display text-[18px] italic leading-snug" style={{ color: "rgba(35,27,18,0.78)" }}>
          {d >= 0
            ? `Margins expanded again in ${data[q].q}. The four-quarter trend is up ${(data[q].o - data[Math.max(0, q - 4)].o) * 100 | 0} basis points, and the driver is mix rather than price.`
            : `Margins contracted in ${data[q].q} — the seasonal pattern, when the year's price list resets and warranty provisions are trued up.`}
        </p>
        <div className="mt-3 flex gap-x-7 gap-y-1 border-t pt-3" style={{ borderColor: t.rule }}>
          {[["Six-qtr range", "14.9 – 19.3%"], ["Sector median", "16.1%"], ["Five-yr trend", "+690bp"], ["Direction", "expanding"]].map(([k, v]) => (
            <span key={k as string} className="font-mono text-[11.5px]" style={{ color: t.sub }}>
              {k as string} <span className="tnum" style={{ color: t.fg }}>{v as string}</span>
            </span>
          ))}
        </div>
      </div>
    </Frame>
  );
}

const SMALL_DEFS: [number, string, string, React.FC][] = [
  [116, "Price and change", "The security's current quote and its move since the previous close", P116a],
  [118, "52-week range", "Where the price sits within its range over the last year", R118a],
  [121, "Next earnings date", "When the company is next expected to report", E121a],
  [123, "Price target vs current", "How far the average analyst target sits from today's price", T123a],
  [131, "Margin trend arrow", "Whether margins are currently expanding or contracting", M131a],
];

const SMALL_VARIANTS: Record<number, [React.FC, React.FC]> = {
  116: [P116b, P116c],
  118: [R118b, R118c],
  121: [E121b, E121c],
  123: [T123b, T123c],
  131: [M131b, M131c],
};

const CAPTIONS: Record<number, [string, string, string]> = {
  116: [
    "Masthead treatment: an oversized tabular price with the change set beneath it, plus a working last/bid switch.",
    "Terminal treatment: monospaced, sign-first, and the whole tile is a button that replays the last tick with a green flash.",
    "Editorial treatment: the figure sits over a faint thirty-session trace, with a sector comparison that overlays on click.",
  ],
  118: [
    "A hairline scale with the current position blocked in claret — hover along it to read any percentile of the year's range.",
    "The range as a distribution of sessions, so the current price is read against where the stock actually lived.",
    "The same rail re-scoped: quarter buttons redraw the extremes and recompute the position within them.",
  ],
  121: [
    "Calendar leaf: the date as a printed block, a countdown bar across the quarter, and a reminder that toggles.",
    "Earnings as the first row of a forward calendar, with three other dates that matter beside it.",
    "An appointment rather than a statistic: house numerals, a time-zone switch, and the practical details for the morning.",
  ],
  123: [
    "Distance as a diagram: current price on the baseline, mean target above it, full range toggleable behind.",
    "Four definitions of target — mean, median, high, low — each recomputing the headline, the gap and the distribution.",
    "The street's target against Meridian's own, with the gap written out as a sentence rather than only a percentage.",
  ],
  131: [
    "Direction as the headline: an oversized arrow, the change in basis points, and six periods behind it.",
    "Four margin lines together, each with its own arrow, a consecutive-quarters streak counter and a spark.",
    "Margins as a sentence you can step through quarter by quarter, with the written interpretation following the selection.",
  ],
};

export function CSmall() {
  const letters = ["a", "b", "c"] as const;
  return (
    <>
      {SMALL_DEFS.map(([n, name, desc, A]) => {
        const [B, C] = SMALL_VARIANTS[n];
        const caps = CAPTIONS[n];
        const comps = [A, B, C];
        const tones: ("paper" | "ink" | "sand")[] = ["paper", "ink", "sand"];
        return (
          <div key={n}>
            <div className="mb-4 flex flex-wrap items-baseline gap-4 border-b-2 pb-2" style={{ borderColor: "#16120E" }}>
              <span className="tnum font-sans text-[40px] font-extrabold leading-none tracking-[-0.04em]">{n}</span>
              <span className="font-sans text-[17px] font-bold tracking-tight">{name}</span>
              <span className="font-display text-[16px] italic" style={{ color: "#5F564C" }}>— {desc}</span>
            </div>
            {comps.map((Cmp, i) => (
              <Plate key={letters[i]} n={n} letter={letters[i]} name={name} variant={caps[i].split(":")[0]} caption={caps[i]} tone={tones[i]}>
                <Cmp />
              </Plate>
            ))}
          </div>
        );
      })}
    </>
  );
}
export { spark };
