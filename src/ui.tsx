import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";

// ─────────────────────────────────────────────────────────────
// TONES — the different stocks the specimen plates are printed on
// ─────────────────────────────────────────────────────────────
export type Tone = "paper" | "bone" | "sand" | "ink" | "ledger" | "blueprint";

export type ToneSpec = {
  bg: string;
  fg: string;
  rule: string;
  soft: string;
  panel: string;
  sub: string;
  up: string;
  down: string;
  dark: boolean;
};

export const TONES: Record<Tone, ToneSpec> = {
  paper: {
    bg: "#F7E7DA", fg: "#16120E", rule: "rgba(22,18,14,0.22)", soft: "rgba(22,18,14,0.07)",
    panel: "#FBF1E9", sub: "#8A7F73", up: "#2E5E4A", down: "#8E1F2F", dark: false,
  },
  bone: {
    bg: "#F3EFE6", fg: "#16120E", rule: "rgba(22,18,14,0.18)", soft: "rgba(22,18,14,0.06)",
    panel: "#FFFFFF", sub: "#7C756A", up: "#2E5E4A", down: "#8E1F2F", dark: false,
  },
  sand: {
    bg: "#E9DCC4", fg: "#231B12", rule: "rgba(35,27,18,0.24)", soft: "rgba(35,27,18,0.08)",
    panel: "#F3EADB", sub: "#7E705E", up: "#2E5E4A", down: "#8E1F2F", dark: false,
  },
  ink: {
    bg: "#0E1014", fg: "#F0E9E1", rule: "rgba(240,233,225,0.17)", soft: "rgba(240,233,225,0.07)",
    panel: "#171A20", sub: "#8E8B85", up: "#57B894", down: "#E06B6B", dark: true,
  },
  ledger: {
    bg: "#0F2419", fg: "#E8F0EA", rule: "rgba(232,240,234,0.18)", soft: "rgba(232,240,234,0.07)",
    panel: "#153025", sub: "#7E9A8A", up: "#69C39B", down: "#E08073", dark: true,
  },
  blueprint: {
    bg: "#12243A", fg: "#E6EDF5", rule: "rgba(230,237,245,0.18)", soft: "rgba(230,237,245,0.07)",
    panel: "#1A2F49", sub: "#8FA6BE", up: "#63C2A6", down: "#E88A7A", dark: true,
  },
};

export const ACCENTS = ["#8E1F2F", "#1B3A5C", "#D98324", "#2E5E4A", "#8A7F73", "#5C1420", "#B8404E"];

// ─────────────────────────────────────────────────────────────
// Hook — reveal on scroll
// ─────────────────────────────────────────────────────────────
export function useInView<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setSeen(true);
            io.disconnect();
          }
        }
      },
      { threshold: 0.06, rootMargin: "0px 0px -40px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return [ref, seen] as const;
}

// ─────────────────────────────────────────────────────────────
// Plate — one printed specimen
// ─────────────────────────────────────────────────────────────
export function Plate({
  n,
  letter,
  name,
  variant,
  caption,
  tone = "paper",
  children,
  pad = "p-7",
}: {
  n: number;
  letter: "a" | "b" | "c";
  name: string;
  variant: string;
  caption?: string;
  tone?: Tone;
  children: ReactNode;
  pad?: string;
}) {
  const [ref, seen] = useInView<HTMLElement>();
  const t = TONES[tone];
  return (
    <section ref={ref} id={`c${n}-${letter}`} className="mb-6 scroll-mt-24">
      <div
        className={`rv ${seen ? "in" : ""} border`}
        style={{ background: t.bg, color: t.fg, borderColor: t.rule }}
      >
        {/* running head */}
        <div className="flex items-stretch">
          <div
            className="flex w-[104px] shrink-0 items-center justify-center border-r px-2 py-3 sm:w-[132px]"
            style={{ borderColor: t.rule }}
          >
            <span
              className="tnum font-sans text-[34px] font-extrabold leading-none tracking-[-0.04em] sm:text-[46px]"
              style={{ color: t.fg }}
            >
              {n}
              <span style={{ color: t.down }}>.</span>
              {letter}
            </span>
          </div>
          <div className="min-w-0 flex-1 px-4 py-2.5">
            <div
              className="truncate font-mono text-[9.5px] uppercase tracking-[0.2em]"
              style={{ color: t.sub }}
            >
              Component&nbsp;{n} &nbsp;·&nbsp; {name}
            </div>
            <div className="mt-0.5 truncate font-display text-[17px] italic leading-tight sm:text-[19px]">
              {variant}
            </div>
          </div>
          <div
            className="hidden shrink-0 items-center gap-2 border-l px-4 font-mono text-[9.5px] uppercase tracking-[0.2em] md:flex"
            style={{ borderColor: t.rule, color: t.sub }}
          >
            <span
              className="inline-block h-[7px] w-[7px] rounded-full"
              style={{ background: t.down }}
            />
            {tone} stock
          </div>
        </div>
        <div
          className="rv-rule h-px w-full"
          style={{ background: t.rule, opacity: seen ? 1 : 0 }}
        />
        {/* the design itself */}
        <div className={`${pad} relative`}>{children}</div>
      </div>
      {caption && (
        <p
          className="mt-2 mb-8 max-w-[74ch] pl-1 font-display text-[13.5px] italic leading-snug"
          style={{ color: "#5F564C" }}
        >
          {caption}
        </p>
      )}
      {!caption && <div className="mb-8" />}
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// Small shared atoms (plumbing only — every plate designs its own UI)
// ─────────────────────────────────────────────────────────────
export const Caps = ({ children, style }: { children: ReactNode; style?: CSSProperties }) => (
  <span
    className="font-mono text-[9.5px] font-medium uppercase tracking-[0.18em]"
    style={style}
  >
    {children}
  </span>
);

export function Toggle<T extends string>({
  opts,
  value,
  onChange,
  t,
  size = "md",
}: {
  opts: readonly T[];
  value: T;
  onChange: (v: T) => void;
  t: ToneSpec;
  size?: "sm" | "md";
}) {
  return (
    <div className="inline-flex" style={{ border: `1px solid ${t.rule}` }}>
      {opts.map((o, i) => {
        const on = o === value;
        return (
          <button
            key={o}
            onClick={() => onChange(o)}
            className={`font-mono uppercase tracking-[0.14em] transition-colors duration-150 ${
              size === "sm" ? "px-2 py-[3px] text-[9px]" : "px-3 py-1.5 text-[10px]"
            }`}
            style={{
              background: on ? t.fg : "transparent",
              color: on ? t.bg : t.sub,
              borderLeft: i ? `1px solid ${t.rule}` : "none",
            }}
          >
            {o}
          </button>
        );
      })}
    </div>
  );
}

export function Chip({
  children,
  t,
  on = false,
  onClick,
  color,
}: {
  children: ReactNode;
  t: ToneSpec;
  on?: boolean;
  onClick?: () => void;
  color?: string;
}) {
  const c = color ?? t.fg;
  return (
    <button
      onClick={onClick}
      className="px-2 py-[3px] font-mono text-[10px] tracking-[0.08em] transition-all duration-150"
      style={{
        border: `1px solid ${on ? c : t.rule}`,
        background: on ? c : "transparent",
        color: on ? t.bg : t.sub,
        cursor: onClick ? "pointer" : "default",
      }}
    >
      {children}
    </button>
  );
}

export function Delta({ v, t, dp = 1, suffix = "%" }: { v: number; t: ToneSpec; dp?: number; suffix?: string }) {
  const pos = v >= 0;
  return (
    <span className="tnum font-medium" style={{ color: pos ? t.up : t.down }}>
      {pos ? "▲" : "▼"} {Math.abs(v).toFixed(dp)}
      {suffix}
    </span>
  );
}

export function Slider({
  label,
  value,
  min,
  max,
  step,
  onChange,
  t,
  fmt,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  t: ToneSpec;
  fmt?: (v: number) => string;
}) {
  return (
    <label className="block" style={{ color: t.fg }}>
      <div className="mb-1.5 flex items-baseline justify-between gap-3">
        <Caps style={{ color: t.sub }}>{label}</Caps>
        <span className="tnum font-mono text-[13px] font-medium" style={{ color: t.fg }}>
          {fmt ? fmt(value) : value}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full"
        style={{ color: t.down }}
        aria-label={label}
      />
    </label>
  );
}

// ─────────────────────────────────────────────────────────────
// Chart maths
// ─────────────────────────────────────────────────────────────
export const lin = (v: number, a0: number, a1: number, b0: number, b1: number) =>
  b0 + ((v - a0) / (a1 - a0 || 1)) * (b1 - b0);

export const poly = (pts: Array<[number, number]>) =>
  pts.map((p, i) => `${i ? "L" : "M"}${p[0].toFixed(2)},${p[1].toFixed(2)}`).join(" ");

/** Catmull-Rom → cubic bezier, for soft price curves */
export function smooth(pts: Array<[number, number]>) {
  if (pts.length < 2) return "";
  let d = `M${pts[0][0].toFixed(2)},${pts[0][1].toFixed(2)}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;
    const c1x = p1[0] + (p2[0] - p0[0]) / 6;
    const c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6;
    const c2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += ` C${c1x.toFixed(2)},${c1y.toFixed(2)} ${c2x.toFixed(2)},${c2y.toFixed(2)} ${p2[0].toFixed(2)},${p2[1].toFixed(2)}`;
  }
  return d;
}

export function mapPts(vals: number[], w: number, h: number, pad = 0, invert = true) {
  const min = Math.min(...vals);
  const max = Math.max(...vals);
  return vals.map((v, i) => [
    lin(i, 0, vals.length - 1, pad, w - pad),
    lin(v, min, max, invert ? h - pad : pad, invert ? pad : h - pad),
  ]) as Array<[number, number]>;
}

export const extent = (v: number[]) => [Math.min(...v), Math.max(...v)] as const;

// ─────────────────────────────────────────────────────────────
// Formatters
// ─────────────────────────────────────────────────────────────
export const nf = (v: number, d = 0) =>
  v.toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d });
export const usd = (v: number, d = 2) => `$${nf(v, d)}`;
export const bn = (v: number, d = 2) => `$${nf(v, d)}B`;
export const mm = (v: number, d = 0) => `$${nf(v, d)}M`;
export const pct = (v: number, d = 1, sign = true) => `${sign && v > 0 ? "+" : ""}${v.toFixed(d)}%`;
export const compact = (v: number) =>
  v >= 1000 ? `${(v / 1000).toFixed(v >= 10000 ? 0 : 1)}k` : `${v}`;

export const growth = (a: number, b: number) => ((b - a) / Math.abs(a || 1)) * 100;

// ─────────────────────────────────────────────────────────────
// Meridian identity mark — drawn, not generated
// ─────────────────────────────────────────────────────────────
export function Mark({ size = 34, color = "#16120E", accent = "#8E1F2F" }: { size?: number; color?: string; accent?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" aria-label="Meridian">
      <circle cx="32" cy="32" r="29" stroke={color} strokeWidth="2.4" />
      <path d="M32 3 C18 16, 18 48, 32 61 C46 48, 46 16, 32 3 Z" stroke={color} strokeWidth="2" fill="none" />
      <path d="M3 32 H61" stroke={accent} strokeWidth="3" />
      <path d="M32 3 V61" stroke={color} strokeWidth="1.2" opacity="0.5" />
      <circle cx="32" cy="32" r="4.4" fill={accent} />
    </svg>
  );
}
