import { useState } from "react";
import { Caps, Chip, Plate, TONES, lin, smooth, type ToneSpec } from "@/ui";
import { CO, PX_30D } from "@/data";

const sparkPath = (vals: number[], w: number, h: number, pad = 2) =>
  smooth(vals.map((v, i) => [lin(i, 0, vals.length - 1, pad, w - pad), lin(v, Math.min(...vals), Math.max(...vals), h - pad, pad)] as [number, number]));

function Case({ t, title, children, sizes }: { t: ToneSpec; title: string; children: React.ReactNode; sizes?: string }) {
  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
      <div className="flex min-h-[132px] flex-wrap items-center justify-center gap-6 border p-7" style={{ borderColor: t.rule, background: t.panel }}>
        {children}
      </div>
      <div>
        <Caps style={{ color: t.sub }}>{title}</Caps>
        <div className="mt-1 font-mono text-[11px]" style={{ color: t.sub }}>{sizes ?? "renders 12 – 24px · no layout shift"}</div>
      </div>
    </div>
  );
}

/* ═══════════════════════ 136 — TICKER BADGE ═══════════════════════ */
function K136a() {
  const t = TONES.paper;
  const [hover, setHover] = useState(false);
  return (
    <Case t={t} title="Bordered ticker with venue suffix" sizes="hover reveals the full security name">
      <span
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        className="relative inline-flex items-center gap-2 px-3 py-1.5 transition-all"
        style={{ border: `1.5px solid ${t.fg}`, background: hover ? t.fg : "transparent", color: hover ? t.bg : t.fg }}
      >
        <span className="font-sans text-[19px] font-extrabold leading-none tracking-[0.04em]">HLG</span>
        <span className="h-[13px] w-px" style={{ background: hover ? t.bg : t.rule }} />
        <span className="font-mono text-[11px] uppercase tracking-[0.16em]" style={{ color: hover ? t.bg : t.sub }}>US</span>
        <span
          className="absolute bottom-[calc(100%+7px)] left-1/2 -translate-x-1/2 whitespace-nowrap px-2 py-1 font-mono text-[10.5px] transition-opacity"
          style={{ background: t.fg, color: t.bg, opacity: hover ? 1 : 0, pointerEvents: "none" }}
        >
          Halcyon Grid Technologies Inc · NASDAQ
        </span>
      </span>
      <span className="font-mono text-[12px]" style={{ color: t.sub }}>appears beside every price, chart and table row</span>
    </Case>
  );
}

function K136b() {
  const t = TONES.ink;
  const [suffix, setSuffix] = useState<"US" | "EQ" | "FA">("US");
  return (
    <Case t={t} title="Solid plate with a cycling suffix" sizes="click cycles the identifier suffix">
      <button onClick={() => setSuffix(suffix === "US" ? "EQ" : suffix === "EQ" ? "FA" : "US")} className="inline-flex items-center gap-0" style={{ background: t.down }}>
        <span className="px-3 py-2 font-sans text-[24px] font-extrabold leading-none tracking-[0.06em]" style={{ color: "#0E1014" }}>HLG</span>
        <span className="px-2 py-2 font-mono text-[11px] tracking-[0.18em]" style={{ color: "#0E1014", borderLeft: `1px solid rgba(14,16,20,0.35)` }}>{suffix}</span>
      </button>
      <span className="font-mono text-[12px]" style={{ color: t.sub }}>
        {suffix === "US" ? "primary listing" : suffix === "EQ" ? "equity line" : "fungible ADR"}
      </span>
      <span className="px-2 py-1 font-mono text-[11.5px]" style={{ border: `1px solid ${t.rule}`, color: t.sub }}>ISIN US40135X1094</span>
    </Case>
  );
}

function K136c() {
  const t = TONES.sand;
  const [open, setOpen] = useState(false);
  return (
    <Case t={t} title="Expanding ticker that unfolds into its identifiers" sizes="click to expand to four lines of metadata">
      <button onClick={() => setOpen(!open)} className="text-left" style={{ border: `1px solid ${t.fg}` }}>
        <span className="flex items-center gap-3 px-3 py-2">
          <span className="font-sans text-[21px] font-extrabold leading-none tracking-[0.03em]">{CO.ticker}</span>
          <span className="font-mono text-[11px]" style={{ color: t.sub }}>{CO.exchange}</span>
          <span className="font-mono text-[12px]" style={{ color: t.down }}>{open ? "−" : "+"}</span>
        </span>
        <span className="block overflow-hidden transition-all duration-300" style={{ maxHeight: open ? 96 : 0, borderTop: open ? `1px solid ${t.rule}` : "none" }}>
          <span className="block px-3 py-2 font-mono text-[11px] leading-relaxed" style={{ color: "rgba(35,27,18,0.75)" }}>
            ISIN · US40135X1094<br />
            CUSIP · 40135X109<br />
            SEDAR · 00418722<br />
            WKN · A1X3QP
          </span>
        </span>
      </button>
      <span className="max-w-[220px] font-display text-[16px] italic leading-snug" style={{ color: "rgba(35,27,18,0.7)" }}>
        One element, two states — the badge is the button.
      </span>
    </Case>
  );
}

/* ═══════════════════════ 140 — MINI PRICE SPARKLINE ═══════════════════════ */
function S140a() {
  const t = TONES.paper;
  const [over, setOver] = useState(false);
  const vals = PX_30D;
  const up = vals[vals.length - 1] >= vals[0];
  return (
    <Case t={t} title="Stroke sparkline, colour by trend, tooltip on hover" sizes="60 × 18 default · 120 × 32 on hover">
      <span className="flex items-center gap-3">
        <span className="font-mono text-[13px]" style={{ color: t.sub }}>30d</span>
        <svg
          width={over ? 132 : 84}
          height={over ? 34 : 20}
          viewBox="0 0 132 34"
          onMouseEnter={() => setOver(true)}
          onMouseLeave={() => setOver(false)}
          className="block transition-all"
          preserveAspectRatio="none"
        >
          <path d={sparkPath(vals, 132, 34, 4)} fill="none" stroke={up ? "#2E5E4A" : "#8E1F2F"} strokeWidth="2" vectorEffect="non-scaling-stroke" />
          <circle cx="128" cy={lin(vals[vals.length - 1], Math.min(...vals), Math.max(...vals), 30, 4)} r="3" fill={up ? "#2E5E4A" : "#8E1F2F"} />
        </svg>
        <span className="tnum font-mono text-[13px] font-semibold" style={{ color: up ? t.up : t.down }}>
          {up ? "▲" : "▼"} 8.4%
        </span>
      </span>
      <span className="font-mono text-[11.5px]" style={{ color: t.sub }}>{over ? "16 Feb $173.10 → 18 Mar $187.42" : "hover for endpoints"}</span>
    </Case>
  );
}

function S140b() {
  const t = TONES.ink;
  const [period, setPeriod] = useState<"1D" | "1W" | "1M">("1M");
  const src = period === "1D" ? PX_30D.slice(-8) : period === "1W" ? PX_30D.slice(-14) : PX_30D;
  const delta = ((src[src.length - 1] - src[0]) / src[0]) * 100;
  return (
    <Case t={t} title="Filled area spark with a period switch" sizes="click the period labels; fill opacity 0.18">
      <span className="flex items-center gap-3">
        <svg width="118" height="34" viewBox="0 0 118 34" className="block">
          <path d={`${sparkPath(src, 118, 34, 4)} L114,32 L4,32 Z`} fill="#63C2A6" opacity="0.18" />
          <path d={sparkPath(src, 118, 34, 4)} fill="none" stroke="#63C2A6" strokeWidth="1.8" />
        </svg>
        <span className="tnum font-mono text-[14px]" style={{ color: delta >= 0 ? t.up : t.down }}>
          {delta >= 0 ? "+" : ""}{delta.toFixed(2)}%
        </span>
      </span>
      <span className="inline-flex" style={{ border: `1px solid ${t.rule}` }}>
        {(["1D", "1W", "1M"] as const).map((p, i) => (
          <button key={p} onClick={() => setPeriod(p)} className="px-2.5 py-1 font-mono text-[10px] tracking-[0.14em]" style={{ background: period === p ? t.down : "transparent", color: period === p ? "#0E1014" : t.sub, borderLeft: i ? `1px solid ${t.rule}` : "none" }}>
            {p}
          </button>
        ))}
      </span>
    </Case>
  );
}

function S140c() {
  const t = TONES.sand;
  const [showVol, setShowVol] = useState(false);
  const vals = PX_30D.slice(-20);
  return (
    <Case t={t} title="Sparkline on a dotted baseline with a volume underlay" sizes="click to reveal the volume underlay">
      <button onClick={() => setShowVol(!showVol)} className="flex items-center gap-3 text-left">
        <svg width="140" height="44" viewBox="0 0 140 44" className="block">
          <line x1="2" x2="138" y1="41" y2="41" stroke={t.rule} strokeDasharray="2 3" />
          {showVol &&
            vals.map((_, i) => {
              const h = 6 + ((i * 7919) % 11);
              return <rect key={i} x={2 + i * 6.8} y={41 - h} width="4" height={h} fill="#1B3A5C" opacity="0.28" />;
            })}
          <path d={sparkPath(vals, 140, 34, 4)} fill="none" stroke={t.fg} strokeWidth="2" />
          <circle cx="136" cy={lin(vals[vals.length - 1], Math.min(...vals), Math.max(...vals), 30, 4)} r="3.4" fill={t.down} />
        </svg>
        <span>
          <span className="tnum block font-sans text-[24px] font-extrabold leading-none" style={{ color: t.down }}>+11.6%</span>
          <span className="font-mono text-[10.5px]" style={{ color: t.sub }}>{showVol ? "volume on" : "tap for volume"}</span>
        </span>
      </button>
      <span className="font-display text-[16px] italic" style={{ color: "rgba(35,27,18,0.7)" }}>Twenty sessions, printed rather than drawn.</span>
    </Case>
  );
}

/* ═══════════════════════ 148 — EARNINGS COUNTDOWN ═══════════════════════ */
function C148a() {
  const t = TONES.paper;
  const [paused, setPaused] = useState(false);
  return (
    <Case t={t} title="Numeral countdown with a click-to-freeze state" sizes="tabular figures so the digit column never shifts">
      <button onClick={() => setPaused(!paused)} className="flex items-baseline gap-3 px-4 py-3" style={{ border: `1.5px solid ${t.fg}`, background: paused ? t.soft : "transparent" }}>
        <span className="tnum font-sans text-[54px] font-extrabold leading-none tracking-[-0.05em]" style={{ color: t.down }}>36</span>
        <span className="text-left">
          <span className="block font-display text-[19px] italic leading-none">days to print</span>
          <span className="font-mono text-[11px]" style={{ color: t.sub }}>{paused ? "countdown frozen" : "Q1'26 · 23 Apr, before open"}</span>
        </span>
      </button>
      <span className="font-mono text-[12px]" style={{ color: t.sub }}>consensus $0.44 EPS · $1.99bn revenue</span>
    </Case>
  );
}

function C148b() {
  const t = TONES.ink;
  const frac = 0.6;
  const R = 42, C = 2 * Math.PI * R;
  return (
    <Case t={t} title="Ring countdown against a 90-day quarter" sizes="64px ring · dash offset animates on mount">
      <span className="flex items-center gap-4">
        <svg width="112" height="112" viewBox="0 0 112 112" className="block">
          <circle cx="56" cy="56" r={R} fill="none" stroke="rgba(240,233,225,0.12)" strokeWidth="9" />
          <circle cx="56" cy="56" r={R} fill="none" stroke={t.down} strokeWidth="9" strokeDasharray={`${C * frac} ${C}`} transform="rotate(-90 56 56)" />
          <text x="56" y="58" fontSize="30" fill="#F0E9E1" textAnchor="middle" fontFamily="Archivo" fontWeight="800">36</text>
          <text x="56" y="74" fontSize="8.5" fill={t.sub} textAnchor="middle" fontFamily="IBM Plex Mono" letterSpacing="1.4">DAYS</text>
        </svg>
        <span>
          <span className="block font-sans text-[15px] font-bold">Q1 2026 earnings</span>
          <span className="block font-mono text-[11.5px]" style={{ color: t.sub }}>Thu 23 Apr 2026 · 08:30 ET</span>
          <span className="mt-1 inline-block px-2 py-[3px] font-mono text-[10px] uppercase tracking-[0.14em]" style={{ background: t.up, color: "#0E1014" }}>60% of quarter elapsed</span>
        </span>
      </span>
    </Case>
  );
}

function C148c() {
  const t = TONES.sand;
  const [hover, setHover] = useState<number | null>(null);
  const total = 36;
  return (
    <Case t={t} title="Segmented day-count bar" sizes="one cell per remaining day · hover a cell for its date">
      <span className="w-full">
        <span className="flex items-baseline justify-between">
          <span className="font-display text-[21px] italic">Earnings in {total} days</span>
          <span className="tnum font-mono text-[12.5px]" style={{ color: t.down }}>
            {hover === null ? "23 Apr 2026" : `day ${hover + 1} · 18 Mar + ${hover + 1}`}
          </span>
        </span>
        <span className="mt-3 flex gap-[3px]">
          {Array.from({ length: total }).map((_, i) => (
            <span
              key={i}
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(null)}
              className="h-[30px] flex-1 transition-all"
              style={{ background: hover === i ? t.fg : i < 12 ? t.down : "rgba(35,27,18,0.18)" }}
            />
          ))}
        </span>
        <span className="mt-2 flex justify-between font-mono text-[11px]" style={{ color: t.sub }}>
          <span>18 Mar</span><span>elapsed 12</span><span>23 Apr</span>
        </span>
      </span>
    </Case>
  );
}

/* ═══════════════════════ 151 — HALTED FLAG ═══════════════════════ */
function H151a() {
  const t = TONES.paper;
  const [ack, setAck] = useState(false);
  return (
    <Case t={t} title="Outlined flag with a live pulse and acknowledgement" sizes="pulsing dot · click the flag to acknowledge">
      <button onClick={() => setAck(!ack)} className="flex items-center gap-3 px-4 py-2.5 transition-all" style={{ border: `2px solid ${ack ? t.sub : "#8E1F2F"}`, background: ack ? "transparent" : "rgba(142,31,47,0.1)" }}>
        <span className="relative flex h-[11px] w-[11px]">
          {!ack && <span className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-70" style={{ background: "#8E1F2F" }} />}
          <span className="relative inline-flex h-[11px] w-[11px] rounded-full" style={{ background: ack ? "#8A7F73" : "#8E1F2F" }} />
        </span>
        <span className="font-sans text-[15px] font-extrabold uppercase tracking-[0.14em]" style={{ color: ack ? t.sub : "#8E1F2F" }}>
          {ack ? "Halt acknowledged" : "Trading halted"}
        </span>
        <span className="font-mono text-[11px]" style={{ color: t.sub }}>14:07 ET</span>
      </button>
      <span className="max-w-[300px] font-display text-[16px] italic leading-snug" style={{ color: "rgba(35,27,18,0.72)" }}>
        LULD halt pending news — resumption expected within 5 minutes. {ack && "Flag dims once acknowledged."}
      </span>
    </Case>
  );
}

function H151b() {
  const t = TONES.ink;
  const [step, setStep] = useState(1);
  const steps = ["halt declared", "news pending", "resume 14:12"];
  return (
    <Case t={t} title="Tape-style status strip with a stepped timeline" sizes="click to advance the halt lifecycle">
      <button onClick={() => setStep((step + 1) % 3)} className="flex w-full items-stretch" style={{ border: `1px solid ${t.rule}` }}>
        <span className="flex items-center gap-2 px-3 py-2" style={{ background: "#E06B6B" }}>
          <span className="font-sans text-[13px] font-extrabold uppercase tracking-[0.16em]" style={{ color: "#0E1014" }}>HALT</span>
        </span>
        <span className="flex flex-1 items-center gap-4 px-4 py-2">
          {steps.map((s, i) => (
            <span key={s} className="flex items-center gap-2">
              <span className="h-[7px] w-[7px] rounded-full" style={{ background: i <= step ? "#E06B6B" : "rgba(240,233,225,0.25)" }} />
              <span className="font-mono text-[11px] uppercase tracking-[0.12em]" style={{ color: i === step ? "#F0E9E1" : t.sub }}>{s}</span>
              {i < 2 && <span className="h-px w-5" style={{ background: t.rule }} />}
            </span>
          ))}
        </span>
        <span className="tnum flex items-center px-3 font-mono text-[11.5px]" style={{ background: "rgba(224,107,107,0.14)", color: "#E06B6B" }}>LULD</span>
      </button>
      <span className="font-mono text-[11.5px]" style={{ color: t.sub }}>reason code · Nasdaq equity halt, Rule 11.1(b)</span>
    </Case>
  );
}

function H151c() {
  const t = TONES.sand;
  const [live, setLive] = useState(true);
  return (
    <Case t={t} title="Inline row status — a halt as one cell of a table" sizes="sits inside a data row without changing row height">
      <span className="flex flex-wrap items-center gap-4">
        <span className="font-sans text-[24px] font-extrabold">HLG</span>
        <span className="tnum font-sans text-[24px] font-extrabold" style={{ color: live ? "#8A7F73" : "#8E1F2F" }}>
          {live ? "187.42" : "187.42"}
        </span>
        <button onClick={() => setLive(!live)} className="flex items-center gap-2 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.16em]" style={{ border: `1px solid ${live ? "#8A7F73" : "#8E1F2F"}`, color: live ? "#8A7F73" : "#8E1F2F" }}>
          <span className="h-[8px] w-[8px]" style={{ background: live ? "#8A7F73" : "#8E1F2F" }} />
          {live ? "trading normally" : "halted 14:07 ET"}
        </button>
        <span className="font-mono text-[12px]" style={{ color: "rgba(35,27,18,0.7)" }}>
          {live ? "last print 15:41:52" : "no prints since 14:07:11 · next review 14:12"}
        </span>
      </span>
      <span className="max-w-[320px] font-display text-[16px] italic leading-snug" style={{ color: "rgba(35,27,18,0.72)" }}>
        The flag sits in the row rather than over the page, so a halt never covers the data it is about.
      </span>
    </Case>
  );
}

/* ═══════════════════════ 154 — FLOAT BADGE ═══════════════════════ */
function F154a() {
  const t = TONES.paper;
  return (
    <Case t={t} title="Figure with a share-of-out denominator" sizes="tabular figure · denominator in muted mono">
      <span className="flex items-baseline gap-2">
        <span className="tnum font-sans text-[40px] font-extrabold leading-none tracking-[-0.04em]">331.6</span>
        <span className="font-sans text-[19px] font-bold">m</span>
        <span className="font-mono text-[13px]" style={{ color: t.sub }}>of 365.0m outstanding</span>
      </span>
      <span className="flex flex-wrap gap-x-5 gap-y-1">
        {[["Float", "90.9%"], ["Restricted", "33.4m"], ["Insider", "4.1%"]].map(([k, v]) => (
          <span key={k} className="font-mono text-[11.5px]" style={{ color: t.sub }}>
            {k} <span className="tnum" style={{ color: t.fg }}>{v}</span>
          </span>
        ))}
      </span>
    </Case>
  );
}

function F154b() {
  const t = TONES.ink;
  const [show, setShow] = useState<"shares" | "value">("shares");
  const pct = (331.6 / 365) * 100;
  return (
    <Case t={t} title="Proportional bar, toggled between shares and dollars" sizes="click to switch the unit of the same proportion">
      <span className="w-full">
        <span className="flex items-baseline justify-between">
          <Caps style={{ color: t.sub }}>Free float</Caps>
          <button onClick={() => setShow(show === "shares" ? "value" : "shares")} className="font-mono text-[11.5px]" style={{ color: t.up }}>
            {show === "shares" ? "331.6m shares" : "$62.1bn"}
          </button>
        </span>
        <span className="mt-2 flex h-[26px] w-full overflow-hidden" style={{ border: `1px solid ${t.rule}` }}>
          <span className="flex items-center justify-center transition-all duration-500" style={{ width: `${pct}%`, background: t.up }}>
            <span className="tnum font-mono text-[11.5px]" style={{ color: "#0E1014" }}>{pct.toFixed(1)}%</span>
          </span>
          <span className="flex flex-1 items-center justify-center" style={{ background: "rgba(240,233,225,0.14)" }}>
            <span className="tnum font-mono text-[11.5px]" style={{ color: t.sub }}>9.1%</span>
          </span>
        </span>
        <span className="mt-1.5 flex justify-between font-mono text-[10.5px]" style={{ color: t.sub }}>
          <span>freely tradable</span>
          <span>restricted & insider</span>
        </span>
      </span>
    </Case>
  );
}

function F154c() {
  const t = TONES.sand;
  const [dollar, setDollar] = useState(false);
  const turn = (62.1 / 68.4) * 100;
  return (
    <Case t={t} title="Compact cell with a turnover micro-bar" sizes="fits a34px table cell · click to change units">
      <button onClick={() => setDollar(!dollar)} className="flex items-center gap-3 border px-3 py-2" style={{ borderColor: t.rule }}>
        <span>
          <span className="block font-mono text-[10px] uppercase tracking-[0.16em]" style={{ color: t.sub }}>float</span>
          <span className="tnum block font-sans text-[22px] font-extrabold leading-none">
            {dollar ? "$62.1bn" : "331.6m"}
          </span>
        </span>
        <span className="w-[76px]">
          <span className="block h-[7px] w-full" style={{ background: "rgba(35,27,18,0.12)" }}>
            <span className="block h-full" style={{ width: `${turn}%`, background: t.down }} />
          </span>
          <span className="mt-1 block font-mono text-[10px]" style={{ color: t.sub }}>{turn.toFixed(0)}% turns / yr</span>
        </span>
        <span className="font-mono text-[11px]" style={{ color: t.sub }}>{dollar ? "USD" : "shares"}</span>
      </button>
      <span className="font-display text-[16px] italic]" style={{ color: "rgba(35,27,18,0.7)" }}>
        One badge carrying size, unit and liquidity.
      </span>
    </Case>
  );
}

const TINY: [number, string, string, React.FC, React.FC, React.FC, string, string, string][] = [
  [136, "Ticker badge", "The company's ticker symbol", K136a, K136b, K136c,
    "Bordered ticker with a venue suffix that reveals the full security name on hover.",
    "Solid plate whose identifier suffix cycles listing line on click.",
    "Ticker that unfolds in place into ISIN, CUSIP, SEDAR and WKN."],
  [140, "Mini price sparkline", "A very small price trend for the recent period", S140a, S140b, S140c,
    "Stroke sparkline coloured by trend, widening on hover to reveal the endpoints.",
    "Filled area spark with a working 1D / 1W / 1M period switch.",
    "Sparkline on a dotted baseline with a click-to-reveal volume underlay."],
  [148, "Earnings countdown", "Days remaining until the next earnings date", C148a, C148b, C148c,
    "Numeral countdown in a bordered leaf; clicking freezes the count for a screenshot.",
    "Ring showing the quarter elapsed against days remaining.",
    "One cell per remaining day, with a hover readout for each date."],
  [151, "Halted flag", "A marker showing that trading is currently halted", H151a, H151b, H151c,
    "Outlined flag with a pulsing dot that dims once acknowledged.",
    "Tape-style strip with a three-step halt lifecycle you can advance.",
    "Inline cell status that sits inside a data row without changing its height."],
  [154, "Float badge", "A compact figure for how many shares are freely traded", F154a, F154b, F154c,
    "Figure over a denominator, with restricted and insider shares named alongside.",
    "Proportional bar that toggles between shares and dollars.",
    "Compact cell carrying size, unit and an annual turnover micro-bar."],
];

const TONES_T: ("paper" | "ink" | "sand")[] = ["paper", "ink", "sand"];
const LETTERS = ["a", "b", "c"] as const;

export function CTiny() {
  return (
    <>
      {TINY.map(([n, name, desc, A, B, Cc, c1, c2, c3]) => {
        const comps = [A, B, Cc];
        const caps = [c1, c2, c3];
        return (
          <div key={n}>
            <div className="mb-4 flex flex-wrap items-baseline gap-4 border-b-2 pb-2" style={{ borderColor: "#16120E" }}>
              <span className="tnum font-sans text-[40px] font-extrabold leading-none tracking-[-0.04em]">{n}</span>
              <span className="font-sans text-[17px] font-bold tracking-tight">{name}</span>
              <span className="font-display text-[16px] italic" style={{ color: "#5F564C" }}>— {desc}</span>
            </div>
            {comps.map((Cmp, i) => (
              <Plate key={LETTERS[i]} n={n} letter={LETTERS[i]} name={name} variant={caps[i].split(".")[0]} caption={caps[i]} tone={TONES_T[i]}>
                <Cmp />
              </Plate>
            ))}
            <div className="hidden">{[c2, c3].length}</div>
          </div>
        );
      })}
    </>
  );
}
export { Chip };
