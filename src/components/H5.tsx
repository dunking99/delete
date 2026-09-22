import { useMemo, useState } from "react";
import { Caps, Chip, Plate, Toggle, TONES, lin, poly, smooth } from "@/ui";
import { CALLS, FILINGS } from "@/data";

const TRANSCRIPT: { sp: string; role: string; turn: string; tone: number }[] = [
  { sp: "Operator", role: "", turn: "Good afternoon, and welcome to Halcyon Grid Technologies' fourth quarter and full year 2025 earnings conference call.", tone: 0.5 },
  { sp: "R. E. Castellano", role: "CEO", turn: "Thank you. We closed a record year with revenue of $4.82 billion, up 18.6%, and adjusted operating margin of 21.3%, 310 basis points ahead of last year.", tone: 0.88 },
  { sp: "R. E. Castellano", role: "CEO", turn: "Grid-forming backlog reached $2.1 billion at year end. Demand is no longer the constraint — our constraint is qualified assembly labour and transformer lead times.", tone: 0.72 },
  { sp: "M. Okonkwo", role: "CFO", turn: "Gross margin of 44.8% reflected favourable mix in storage and controls, partially offset by 90 basis points of tariff and freight headwind.", tone: 0.66 },
  { sp: "M. Okonkwo", role: "CFO", turn: "Working capital absorbed $182 million, driven by receivables growth ahead of revenue. We expect DSO to normalise to 78 to 80 days by the third quarter.", tone: 0.42 },
  { sp: "J. Sørensen", role: "Analyst — Morgan Keegan", turn: "Can you size the tariff exposure beyond FY26, and is the Pune facility a hedge against it?", tone: 0.5 },
  { sp: "R. E. Castellano", role: "CEO", turn: "Roughly 41% of bill of materials is imported today. Pune takes that to about 31% by the end of 2027. It is a real hedge, but not a complete one.", tone: 0.55 },
  { sp: "A. Whitcombe", role: "Analyst — Barrow & Finch", turn: "The Arden Supply agreement renews in the third quarter of 2026. What gives you confidence on renewal?", tone: 0.34 },
  { sp: "R. E. Castellano", role: "CEO", turn: "We are in active discussions. I would point to 99.4% on-time delivery over the last eight quarters as the strongest evidence I can offer without getting ahead of the contract.", tone: 0.68 },
  { sp: "M. Okonkwo", role: "CFO", turn: "For FY2026 we are guiding revenue of $5.4 to $5.6 billion, EPS of $1.94 to $2.06, and free cash flow conversion of at least 95% of net income.", tone: 0.8 },
];

/* ═══════════════════════ 13.a — SEARCH + READER ═══════════════════════ */
function A() {
  const t = TONES.paper;
  const [q, setQ] = useState("tariff");
  const [form, setForm] = useState<string>("All");
  const [sel, setSel] = useState(0);

  const forms = ["All", "10-K", "10-Q", "8-K", "DEF 14A", "SC 13G/A", "Form 4", "S-3ASR", "10-K/A"];
  const results = useMemo(
    () =>
      FILINGS.filter(
        (f) => (form === "All" || f.form === form) && (q.trim() === "" || (f.title + f.form + f.tag).toLowerCase().includes(q.toLowerCase())),
      ),
    [q, form],
  );
  const cur = results[Math.min(sel, results.length - 1)];

  const body = [
    "Item 1A. Risk Factors — Regulatory and trade risk.",
    "The company imports a significant proportion of power semiconductors, magnetics and enclosure components from facilities located in Asia. Changes to tariff schedules, Section 232 or 301 actions, or the introduction of domestic-content procurement rules could increase the company's cost of goods sold by an estimated 200 to 400 basis points, and the company may be unable to pass those increases on to customers under fixed-price supply agreements.",
    "Management has taken steps to dual-source critical components and has qualified a second assembly site in Pune, India, expected to represent approximately 30% of unit capacity by the end of fiscal 2027. There can be no assurance that these measures will be sufficient or timely.",
    "Item 7A. Quantitative and Qualitative Disclosures About Market Risk.",
    "The company does not enter into derivative transactions for speculative purposes. Foreign currency exposure is managed through natural hedging and, where material, forward contracts with maturities not exceeding twelve months.",
  ];

  const hl = (s: string) => {
    if (!q.trim()) return s;
    const i = s.toLowerCase().indexOf(q.toLowerCase());
    if (i < 0) return s;
    return (
      <>
        {s.slice(0, i)}
        <mark style={{ background: "#D98324", color: "#16120E", padding: "0 2px" }}>{s.slice(i, i + q.length)}</mark>
        {s.slice(i + q.length)}
      </>
    );
  };

  return (
    <div>
      <div className="grid gap-0 lg:grid-cols-[330px_minmax(0,1fr)]">
        {/* index */}
        <div className="pr-6" style={{ borderRight: `1px solid ${t.rule}` }}>
          <div className="relative">
            <input
              value={q}
              onChange={(e) => { setQ(e.target.value); setSel(0); }}
              placeholder="Search filings and transcripts…"
              className="w-full bg-transparent pb-2 pl-6 font-display text-[17px] outline-none placeholder:italic"
              style={{ borderBottom: `2px solid ${t.fg}`, color: t.fg }}
            />
            <span className="absolute left-0 top-1 font-mono text-[13px]" style={{ color: t.down }}>⌕</span>
          </div>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {forms.map((f) => (
              <Chip key={f} t={t} on={form === f} onClick={() => { setForm(f); setSel(0); }}>
                {f}
              </Chip>
            ))}
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <Caps style={{ color: t.sub }}>{results.length} result{results.length === 1 ? "" : "s"}</Caps>
            <span className="font-mono text-[10px]" style={{ color: t.sub }}>2024 – 2026</span>
          </div>
          <div className="mt-2 max-h-[330px] overflow-y-auto scroller pr-1">
            {results.length === 0 && (
              <div className="py-6 text-center">
                <div className="font-display text-[17px] italic" style={{ color: t.sub }}>Nothing matches “{q}”.</div>
                <button onClick={() => { setQ(""); setForm("All"); }} className="mt-2 font-mono text-[10px] uppercase tracking-[0.16em]" style={{ color: t.down }}>
                  clear search
                </button>
              </div>
            )}
            {results.map((f, i) => {
              const on = i === Math.min(sel, results.length - 1);
              return (
                <button
                  key={f.form + f.date}
                  onClick={() => setSel(i)}
                  className="block w-full border-b py-2.5 text-left transition-colors"
                  style={{ borderColor: t.rule, background: on ? t.soft : "transparent", boxShadow: on ? `inset 3px 0 0 ${t.down}` : "none" }}
                >
                  <span className="flex items-baseline gap-2">
                    <span className="px-1.5 font-mono text-[9.5px] font-semibold uppercase" style={{ background: on ? t.down : t.fg, color: t.bg }}>{f.form}</span>
                    <span className="tnum font-mono text-[10.5px]" style={{ color: t.sub }}>{f.date}</span>
                    {f.fresh && <span className="ml-auto font-mono text-[9px] uppercase" style={{ color: t.down }}>new</span>}
                  </span>
                  <span className="mt-1 block font-display text-[15px] leading-snug">{hl(f.title)}</span>
                  <span className="mt-0.5 block font-mono text-[9.5px]" style={{ color: t.sub }}>
                    {f.pages} pp · {f.size} · {f.tag}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* reader */}
        <div className="min-w-0 pl-6">
          {cur ? (
            <>
              <div className="flex flex-wrap items-start justify-between gap-4 border-b pb-3" style={{ borderColor: t.fg }}>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-1.5 py-0.5 font-mono text-[10px] font-semibold" style={{ background: t.fg, color: t.bg }}>{cur.form}</span>
                    <span className="tnum font-mono text-[11px]" style={{ color: t.sub }}>{cur.date} · filed 16:04 ET</span>
                  </div>
                  <div className="mt-1.5 font-display text-[21px] leading-snug">{cur.title}</div>
                </div>
                <div className="flex gap-2">
                  {["Open PDF", "Compare", "Cite"].map((b, i) => (
                    <button key={b} className="px-3 py-1 font-mono text-[10px] uppercase tracking-[0.14em]" style={i === 0 ? { background: t.down, color: t.bg } : { border: `1px solid ${t.rule}`, color: t.sub }}>
                      {b}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-4 grid gap-6 md:grid-cols-[minmax(0,1fr)_180px]">
                <article className="max-w-[68ch]">
                  {body.map((p, i) => (
                    <p key={i} className={`text-[15px] leading-[1.62] ${i % 2 === 0 ? "font-sans font-semibold" : "font-display"}`} style={{ color: "rgba(22,18,14,0.86)", marginTop: i ? 12 : 0 }}>
                      {hl(p)}
                    </p>
                  ))}
                  <div className="mt-5 flex items-center justify-between border-t pt-2" style={{ borderColor: t.rule }}>
                    <span className="font-mono text-[10px]" style={{ color: t.sub }}>p. 41 of {cur.pages}</span>
                    <div className="flex gap-1.5">
                      {["←", "→"].map((b) => (
                        <button key={b} className="h-7 w-7 font-mono text-[12px]" style={{ border: `1px solid ${t.rule}`, color: t.sub }}>{b}</button>
                      ))}
                    </div>
                  </div>
                </article>

                <aside>
                  <Caps style={{ color: t.down }}>Key passages</Caps>
                  <div className="mt-2 space-y-3">
                    {[
                      ["Tariff exposure", "“200 to 400 basis points”", "p. 41"],
                      ["Capacity", "“second assembly site in Pune”", "p. 44"],
                      ["Risk factor count", "19 disclosed, 4 new this year", "p. 38"],
                    ].map(([k, v, pg]) => (
                      <div key={k} className="border-l-2 pl-2.5" style={{ borderColor: t.down }}>
                        <div className="font-mono text-[9.5px] uppercase tracking-[0.14em]" style={{ color: t.sub }}>{k} · {pg}</div>
                        <div className="font-display text-[15px] italic leading-snug">{v}</div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-5 border-t pt-3" style={{ borderColor: t.rule }}>
                    <Caps style={{ color: t.sub }}>Word frequency</Caps>
                    {[["tariff", 41], ["backlog", 33], ["customer concentration", 18], ["Pune", 14]].map(([w, c]) => (
                      <div key={w as string} className="mt-1.5">
                        <div className="flex justify-between font-mono text-[10.5px]"><span>{w}</span><span className="tnum" style={{ color: t.sub }}>{c}</span></div>
                        <div className="mt-0.5 h-[5px]" style={{ background: "rgba(22,18,14,0.08)" }}>
                          <div className="h-full" style={{ width: `${((c as number) / 41) * 100}%`, background: t.down }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </aside>
              </div>
            </>
          ) : (
            <div className="flex h-[300px] items-center justify-center font-display text-[18px] italic" style={{ color: t.sub }}>
              No document selected.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════ 13.b — TRANSCRIPT READER ═══════════════════════ */
function P13B() {
  const t = TONES.ink;
  const [call, setCall] = useState(0);
  const [q, setQ] = useState("");
  const [speaker, setSpeaker] = useState<string>("All");
  const [openIdx, setOpenIdx] = useState<number[]>([1, 4]);

  const speakers = ["All", ...Array.from(new Set(TRANSCRIPT.map((x) => x.sp)))];
  const turns = TRANSCRIPT.filter((x) => (speaker === "All" || x.sp === speaker) && (q === "" || x.turn.toLowerCase().includes(q.toLowerCase())));

  const hl = (s: string) => {
    if (!q.trim()) return s;
    const i = s.toLowerCase().indexOf(q.toLowerCase());
    if (i < 0) return s;
    return (<>{s.slice(0, i)}<mark style={{ background: t.down, color: t.bg }}>{s.slice(i, i + q.length)}</mark>{s.slice(i + q.length)}</>);
  };

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-1.5">
          {CALLS.map((c, i) => (
            <button
              key={c.q}
              onClick={() => setCall(i)}
              className="px-3 py-1.5 text-left font-mono text-[10.5px] transition-colors"
              style={{
                border: `1px solid ${call === i ? t.down : t.rule}`,
                background: call === i ? t.down : "transparent",
                color: call === i ? t.bg : t.sub,
              }}
            >
              {c.q}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <span className="tnum font-mono text-[11px]" style={{ color: t.sub }}>{CALLS[call].dur} · {CALLS[call].speakers} speakers</span>
          <div className="flex h-[22px] w-[130px] overflow-hidden" style={{ border: `1px solid ${t.rule}` }}>
            <div style={{ width: `${CALLS[call].sentiment * 100}%`, background: t.up }} />
            <div style={{ flex: 1, background: "rgba(224,107,107,0.35)" }} />
          </div>
          <span className="font-mono text-[11px]" style={{ color: t.up }}>tone {CALLS[call].sentiment.toFixed(2)}</span>
        </div>
      </div>

      <div className="grid gap-0 lg:grid-cols-[262px_minmax(0,1fr)]">
        <div className="pr-6" style={{ borderRight: `1px solid ${t.rule}` }}>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Full-text search…"
            className="w-full bg-transparent pb-2 font-mono text-[13px] outline-none placeholder:italic"
            style={{ borderBottom: `1px solid ${t.rule}`, color: t.fg }}
          />
          <div className="mt-3 flex flex-wrap gap-1.5">
            {speakers.map((s) => (
              <Chip key={s} t={t} on={speaker === s} onClick={() => setSpeaker(s)}>{s.split(" ")[0]}</Chip>
            ))}
          </div>
          <div className="mt-5">
            <Caps style={{ color: t.down }}>Themes raised</Caps>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {CALLS[call].themes.map((th) => (
                <button key={th} onClick={() => setQ(th.split(" ")[0].toLowerCase())} className="px-2 py-[3px] font-mono text-[10.5px]" style={{ border: `1px solid ${t.rule}`, color: t.sub }}>
                  {th}
                </button>
              ))}
            </div>
          </div>
          <div className="mt-5">
            <Caps style={{ color: t.sub }}>Tone by minute</Caps>
            <svg width="100%" height="66" viewBox="0 0 240 66" className="mt-1 block">
              {[0.5, 0.75, 1, 1.25].map((m, i) => {
                const tone = 0.35 + Math.abs(Math.sin(i * 2.1 + call)) * 0.6;
                return (
                  <rect key={m} x={i * 41} y={66 - tone * 60} width="34" height={tone * 60} fill={tone > 0.6 ? t.up : t.down} opacity="0.8" />
                );
              })}
              {[0, 20, 40, 60].map((m) => (
                <text key={m} x={m * 3.9} y="64" fontSize="8" fill={t.sub} fontFamily="IBM Plex Mono">{m}m</text>
              ))}
            </svg>
          </div>
          <div className="mt-4 border-t pt-3" style={{ borderColor: t.rule }}>
            <Caps style={{ color: t.sub }}>Matched turns</Caps>
            <div className="tnum font-sans text-[28px] font-extrabold" style={{ color: t.down }}>{turns.length}</div>
          </div>
        </div>

        <div className="min-w-0 pl-6">
          <div className="mb-3 flex items-baseline justify-between border-b pb-2" style={{ borderColor: t.fg }}>
            <div>
              <div className="font-display text-[21px] leading-tight">Q4 2025 earnings call — transcript</div>
              <div className="font-mono text-[10.5px]" style={{ color: t.sub }}>{CALLS[call].date} · prepared remarks + Q&A · unedited</div>
            </div>
            <div className="flex gap-2">
              {["Prepared", "Q&A", "All"].map((b, i) => (
                <span key={b} className="px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.14em]" style={i === 2 ? { background: t.fg, color: t.bg } : { border: `1px solid ${t.rule}`, color: t.sub }}>{b}</span>
              ))}
            </div>
          </div>

          <div className="max-h-[400px] space-y-0 overflow-y-auto scroller pr-2">
            {turns.map((x, i) => {
              const on = x.sp !== "Operator";
              const isOpen = openIdx.includes(i);
              const col = x.tone > 0.62 ? t.up : x.tone < 0.45 ? t.down : t.sub;
              return (
                <div key={i} style={{ borderBottom: `1px solid ${t.rule}` }}>
                  <button
                    onClick={() => setOpenIdx((o) => (isOpen ? o.filter((z) => z !== i) : [...o, i]))}
                    className="grid w-full gap-4 py-3 text-left"
                    style={{ gridTemplateColumns: "152px minmax(0,1fr) 54px" }}
                  >
                    <span>
                      <span className="block font-mono text-[12px] font-semibold" style={{ color: on ? t.fg : t.sub }}>{x.sp}</span>
                      <span className="block font-mono text-[9.5px] uppercase tracking-[0.1em]" style={{ color: t.sub }}>{x.role}</span>
                    </span>
                    <span className="font-display text-[16px] leading-[1.5]" style={{ color: x.role.startsWith("Analyst") ? "rgba(240,233,225,0.72)" : "#F0E9E1" }}>
                      {hl(x.turn)}
                    </span>
                    <span className="flex items-start justify-end gap-1.5">
                      <span className="inline-block h-[10px] w-[10px] rounded-full" style={{ background: col, opacity: 0.25 + x.tone * 0.75 }} />
                      <span className="font-mono text-[9.5px]" style={{ color: t.sub }}>{isOpen ? "−" : "+"}</span>
                    </span>
                  </button>
                  {isOpen && (
                    <div className="ml-[152px] flex flex-wrap gap-2 pb-3">
                      {["Sentiment " + x.tone.toFixed(2), x.role.startsWith("Analyst") ? "Question" : "Prepared remarks", "Jump to →"].map((b) => (
                        <span key={b} className="px-2 py-[3px] font-mono text-[9.5px] uppercase tracking-[0.12em]" style={{ border: `1px solid ${t.rule}`, color: t.sub }}>{b}</span>
                      ))}
                      <span className="font-mono text-[9.5px]" style={{ color: t.down }}>⚑ flagged for note</span>
                    </div>
                  )}
                </div>
              );
            })}
            {turns.length === 0 && (
              <div className="py-10 text-center font-display text-[17px] italic" style={{ color: t.sub }}>
                No turns match “{q}” in this call.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════ 13.c — CARD CATALOGUE ═══════════════════════ */
function P13C() {
  const t = TONES.sand;
  const [archive, setArchive] = useState<"filings" | "calls">("filings");
  const [tag, setTag] = useState("All");
  const [flip, setFlip] = useState<string | null>(null);
  const tags = ["All", "Earnings", "Governance", "Ownership", "Insider", "Material", "Capital markets"];

  const density = Array.from({ length: 24 }, (_, i) => 1 + Math.round(Math.abs(Math.sin(i * 1.7)) * 6));

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-end justify-between gap-4 border-b-2 pb-3" style={{ borderColor: t.fg }}>
        <div className="flex gap-1">
          {(["filings", "calls"] as const).map((a) => (
            <button
              key={a}
              onClick={() => { setArchive(a); setFlip(null); }}
              className="px-5 py-2 font-sans text-[15px] font-bold tracking-tight transition-all"
              style={{
                background: archive === a ? t.fg : "transparent",
                color: archive === a ? t.bg : "rgba(35,27,18,0.55)",
                border: `1px solid ${archive === a ? t.fg : t.rule}`,
                marginBottom: archive === a ? -14 : 0,
                zIndex: archive === a ? 2 : 0,
                position: "relative",
              }}
            >
              {a === "filings" ? "Regulatory archive" : "Call archive"}
              <span className="ml-2 font-mono text-[11px]">{a === "filings" ? FILINGS.length : CALLS.length}</span>
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-1.5">
          {archive === "filings" &&
            tags.map((tg) => (
              <Chip key={tg} t={t} on={tag === tg} onClick={() => setTag(tg)}>{tg}</Chip>
            ))}
        </div>
      </div>

      {/* density strip */}
      <div className="mb-5 flex items-end gap-[3px]">
        {density.map((d, i) => (
          <div key={i} className="group flex-1" title={`${2024 + Math.floor(i / 8)} · ${d} documents`}>
            <div className="w-full transition-all" style={{ height: d * 7, background: i > 18 ? t.down : "rgba(35,27,18,0.32)" }} />
          </div>
        ))}
        <div className="ml-3 shrink-0 font-mono text-[10px]" style={{ color: t.sub }}>documents per month, 24 months</div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {(archive === "filings" ? FILINGS.filter((f) => tag === "All" || f.tag === tag).map((f) => ({
          key: f.form + f.date, tab: f.form, date: f.date, title: f.title, meta: `${f.pages} pages · ${f.size}`,
          body: f.tag === "Earnings"
            ? "Revenue of $1,392m versus guidance of $1,340–1,380m. Diluted EPS of $0.41 against a consensus of $0.36. FY2026 guidance issued at $5.4–5.6bn revenue."
            : f.tag === "Governance" ? "Board recommends re-election of all eight nominees;Say-on-pay support fell to 78.4% in 2025 from 86.1% in 2024. New clawback policy adopted."
            : "Filed with the Commission. Refer to Items 3 through 9 for the full disclosure of interests held by reporting persons.",
        })) : CALLS.map((c) => ({
          key: c.q, tab: c.q, date: c.date, title: `${c.q} earnings call — prepared remarks and Q&A`,
          meta: `${c.dur} · ${c.speakers} speakers`,
          body: `Themes: ${c.themes.join(", ")}. Sentiment score ${c.sentiment.toFixed(2)} on a −1 to +1 scale, ${c.sentiment > 0.65 ? "the most positive of the last four calls" : "broadly in line with the prior quarter"}.`,
        }))).map((c) => {
          const open = flip === c.key;
            return (
              <button
                key={c.key}
                onClick={() => setFlip(open ? null : c.key)}
                className="relative text-left transition-all duration-300"
                style={{
                  border: `1px solid ${t.rule}`,
                  background: open ? "#F3EADB" : t.panel,
                  transform: open ? "translateY(-3px)" : "none",
                  boxShadow: open ? "6px 6px 0 rgba(35,27,18,0.16)" : "2px 2px 0 rgba(35,27,18,0.08)",
                }}
              >
                <span className="absolute -top-[13px] left-4 px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-[0.1em]" style={{ background: t.down, color: t.bg }}>
                  {c.tab}
                </span>
                <span className="block px-4 pb-4 pt-6">
                  <span className="tnum block font-mono text-[10.5px]" style={{ color: t.sub }}>{c.date} · {c.meta}</span>
                  <span className="mt-1 block font-display text-[17px] leading-snug">{c.title}</span>
                  <span className="mt-2 block overflow-hidden transition-all duration-300" style={{ maxHeight: open ? 140 : 0 }}>
                    <span className="block border-t pt-2 text-[13.5px] leading-relaxed" style={{ borderColor: t.rule, color: "rgba(35,27,18,0.74)" }}>{c.body}</span>
                  </span>
                  <span className="mt-2 flex items-center justify-between font-mono text-[9.5px] uppercase tracking-[0.14em]" style={{ color: t.down }}>
                    <span>{open ? "close card" : "open card"}</span>
                    <span>{open ? "▲" : "▼"}</span>
                  </span>
                </span>
              </button>
            );
          })}
      </div>
      <div className="mt-5 border-t pt-3 font-display text-[15px] italic" style={{ borderColor: t.rule, color: "rgba(35,27,18,0.7)" }}>
        Each card behaves like a drawer in a card index: the tab names the form, the card lifts when pulled forward, and the summary expands in place rather than navigating away.
      </div>
    </div>
  );
}

export function C13() {
  const nm = "Filings and transcript explorer";
  return (
    <>
      <Plate n={13} letter="a" name={nm} variant="Search left, document reader right, hits marked in amber" tone="paper" caption="Faceted by form type, full-text searchable, and reading happens beside the results rather than after a page change. The right rail keeps the three passages an analyst actually cites, plus a live word-frequency panel.">
        <A />
      </Plate>
      <Plate n={13} letter="b" name={nm} variant="Transcript reader — speaker turns with tone and themes" tone="ink" caption="Calls are a separate archive from filings: filter by speaker, search the full text, click any turn to open its metadata, and read tone as a coloured dot plus a minute-by-minute strip under the filters.">
        <P13B />
      </Plate>
      <Plate n={13} letter="c" name={nm} variant="Card catalogue — two archives, one drawer at a time" tone="sand" caption="Physical metaphor: index tabs stick out of the drawer, cards lift when selected and cast a hard offset shadow, and a 24-month density strip along the top shows filing cadence before you read a single title.">
        <P13C />
      </Plate>
    </>
  );
}

/* ═══════════════════════ shared fair-value data for plate 14 ═══════════════════════ */
type Method = { k: string; lo: number; hi: number; mid: number; n: number; note: string };

const METHODS: Method[] = [
  { k: "Discounted cash flow", lo: 172, hi: 244, mid: 205, n: 1, note: "WACC 7.0%, terminal growth 3.9%, five-year explicit forecast." },
  { k: "EV / EBITDA — peers", lo: 168, hi: 232, mid: 197, n: 7, note: "Peer median 18.1× applied to FY26 EBITDA of $1.19bn, ±1σ." },
  { k: "Forward P/E — peers", lo: 158, hi: 226, mid: 191, n: 7, note: "Peer median 27.4× on FY26 EPS of $1.99." },
  { k: "PEG — growth adjusted", lo: 146, hi: 206, mid: 176, n: 6, note: "1.0–1.4× against consensus growth of 19.4%." },
  { k: "Sum of the parts", lo: 196, hi: 258, mid: 224, n: 1, note: "Hardware at 16× EBIT, software at 28× EBIT, services at 12×." },
  { k: "Precedent transactions", lo: 184, hi: 246, mid: 212, n: 11, note: "Eleven sector deals since 2022 at a median 17.6× EV/EBITDA." },
  { k: "Discount to NAV", lo: 151, hi: 199, mid: 174, n: 1, note: "Replacement cost of manufacturing assets plus software NPV." },
  { k: "Analyst price targets", lo: 172, hi: 255, mid: 214, n: 10, note: "Ten covering analysts, low $172 to high $255." },
];

const RANGE_HISTORY = [
  { q: "Q1'24", lo: 104, hi: 142, px: 118 }, { q: "Q2'24", lo: 112, hi: 152, px: 126 },
  { q: "Q3'24", lo: 121, hi: 163, px: 134 }, { q: "Q4'24", lo: 132, hi: 178, px: 151 },
  { q: "Q1'25", lo: 141, hi: 189, px: 147 }, { q: "Q2'25", lo: 152, hi: 204, px: 163 },
  { q: "Q3'25", lo: 158, hi: 212, px: 176 }, { q: "Q4'25", lo: 163, hi: 221, px: 171 },
  { q: "Q1'26", lo: 172, hi: 244, mid: 207, px: 187 },
];

/* ═══════════════════════ 14.a — FOOTBALL FIELD ═══════════════════════ */
function P14A() {
  const t = TONES.bone;
  const [on, setOn] = useState<string[]>(METHODS.map((m) => m.k));
  const [sort, setSort] = useState<"mid" | "width">("mid");
  const PX = 187.42;

  const active = useMemo(() => {
    const a = METHODS.filter((m) => on.includes(m.k));
    return [...a].sort((x, y) => (sort === "mid" ? x.mid - y.mid : y.hi - y.lo - (x.hi - x.lo)));
  }, [on, sort]);

  const lows = active.map((m) => m.lo), highs = active.map((m) => m.hi);
  const blend = active.length
    ? { lo: Math.min(...lows), hi: Math.max(...highs), mid: active.reduce((s, m) => s + m.mid, 0) / active.length }
    : { lo: 0, hi: 0, mid: 0 };
  const LO = 120, HI = 290;
  const pos = (v: number) => ((v - LO) / (HI - LO)) * 100;

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-wrap gap-1.5">
          {METHODS.map((m) => (
            <Chip key={m.k} t={t} on={on.includes(m.k)} onClick={() => setOn((o) => (o.includes(m.k) ? o.filter((x) => x !== m.k) : [...o, m.k]))} color="#8E1F2F">
              {m.k}
            </Chip>
          ))}
        </div>
        <Toggle opts={["mid", "width"] as const} value={sort} onChange={setSort} t={t} size="sm" />
      </div>

      <div className="relative">
        <div className="relative h-[34px]">
          {active.length > 0 && (
            <div
              className="absolute top-0 h-[26px]"
              style={{
                left: `${pos(blend.lo)}%`,
                width: `${pos(blend.hi) - pos(blend.lo)}%`,
                background: "rgba(142,31,47,0.14)",
                border: `1px dashed ${t.down}`,
              }}
            />
          )}
        </div>

        <div className="space-y-2.5">
          {active.map((m) => (
            <div key={m.k} className="group grid items-center gap-3" style={{ gridTemplateColumns: "194px minmax(0,1fr) 92px" }}>
              <div className="text-right">
                <div className="font-display text-[15.5px] leading-tight">{m.k}</div>
                <div className="font-mono text-[9.5px]" style={{ color: t.sub }}>{m.n > 1 ? `${m.n} observations` : "single model"}</div>
              </div>
              <div className="relative h-[30px]" style={{ background: "repeating-linear-gradient(to right, rgba(22,18,14,0.05) 0 1px, transparent 1px 5%)" }}>
                <div
                  className="absolute top-[6px] h-[18px] transition-all duration-500"
                  style={{ left: `${pos(m.lo)}%`, width: `${pos(m.hi) - pos(m.lo)}%`, background: "rgba(27,58,92,0.55)", opacity: 0.62 }}
                />
                <div className="absolute top-[2px] h-[26px] w-[2px]" style={{ left: `${pos(m.mid)}%`, background: t.fg }} />
                <div className="absolute top-0 h-full w-px" style={{ left: `${pos(PX)}%`, background: t.down, opacity: 0.85 }} />
                <div className="pointer-events-none absolute left-0 top-0 h-full w-full opacity-0 transition-opacity group-hover:opacity-100" style={{ background: "rgba(22,18,14,0.05)" }} />
              </div>
              <div className="tnum text-right font-mono text-[12.5px]">
                {m.lo}–{m.hi}
              </div>
            </div>
          ))}
        </div>

        {/* axis */}
        <div className="relative mt-3 h-[42px] border-t pt-2" style={{ borderColor: t.fg }}>
          {Array.from({ length: 18 }).map((_, i) => LO + i * 10).map((v) => (
            <div key={v} className="absolute top-0" style={{ left: `${pos(v)}%` }}>
              <div className="h-1.5 w-px" style={{ background: t.rule }} />
              <div className="tnum -translate-x-1/2 pt-0.5 font-mono text-[10px]" style={{ color: t.sub }}>{v}</div>
            </div>
          ))}
          <div className="absolute -top-[200px] h-[248px] w-[2px]" style={{ left: `${pos(PX)}%`, background: t.down }} />
          <div className="absolute -top-[214px] -translate-x-1/2 px-2 py-1 font-mono text-[11px] font-semibold" style={{ left: `${pos(PX)}%`, background: t.down, color: t.bg }}>
            HLG ${PX}
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-6 border-t pt-4 sm:grid-cols-[minmax(0,1fr)_300px]" style={{ borderColor: t.rule }}>
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-4">
          {[
            ["Blended low", `$${blend.lo}`, ""],
            ["Blended mid", `$${blend.mid.toFixed(0)}`, "+10.4%"],
            ["Blended high", `$${blend.hi}`, ""],
            ["Methods shown", `${active.length}/${METHODS.length}`, ""],
          ].map(([k, v, s]) => (
            <div key={k}>
              <Caps style={{ color: t.sub }}>{k}</Caps>
              <div className="tnum font-sans text-[30px] font-extrabold leading-none tracking-tight" style={{ color: k === "Blended mid" ? t.down : t.fg }}>{v}</div>
              <div className="font-mono text-[11px]" style={{ color: t.up }}>{s}</div>
            </div>
          ))}
        </div>
        <div>
          <Caps style={{ color: t.sub }}>Reading the chart</Caps>
          <p className="mt-1 font-display text-[15px] italic leading-relaxed" style={{ color: "rgba(22,18,14,0.72)" }}>
            Bars span each method's ±1σ band, the black tick is its central estimate, the claret line is today's quote. Switch off any method and the dashed blended envelope redraws across only the survivors.
          </p>
        </div>
      </div>
    </div>
  );
}


/* ═══════════════════════ 14.b — RANGE OVER TIME ═══════════════════════ */
function P14B() {
  const t = TONES.ledger;
  const [mode, setMode] = useState<"band" | "both">("band");
  const [hover, setHover] = useState<number>(RANGE_HISTORY.length - 1);
  const W = 900, H = 320;
  const LO = 90, HI = 265;
  const X = (i: number) => lin(i, 0, RANGE_HISTORY.length - 1, 60, W - 74);
  const Y = (v: number) => lin(v, LO, HI, H - 40, 24);
  const cur = RANGE_HISTORY[hover];
  const inside = cur.px >= cur.lo && cur.px <= cur.hi;

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <Caps style={{ color: t.sub }}>Where the fair value band has sat, quarter by quarter</Caps>
          <div className="mt-1 font-display text-[22px] italic">
            Price has spent {RANGE_HISTORY.filter((r) => r.px >= r.lo && r.px <= r.hi).length} of {RANGE_HISTORY.length} quarters inside the band.
          </div>
        </div>
        <Toggle opts={["band", "both"] as const} value={mode} onChange={setMode} t={t} size="sm" />
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_220px]">
        <svg viewBox={`0 0 ${W} ${H}`} width="100%" className="block cursor-crosshair" onMouseLeave={() => setHover(RANGE_HISTORY.length - 1)}>
          {[100, 140, 180, 220, 260].map((v) => (
            <g key={v}>
              <line x1="60" x2={W - 74} y1={Y(v)} y2={Y(v)} stroke={t.rule} strokeDasharray="2 5" />
              <text x="54" y={Y(v) + 4} fontSize="10.5" fill={t.sub} textAnchor="end" fontFamily="IBM Plex Mono">${v}</text>
            </g>
          ))}
          <path
            d={`${RANGE_HISTORY.map((r, i) => `${i ? "L" : "M"}${X(i)},${Y(r.hi)}`).join(" ")} ${[...RANGE_HISTORY].reverse().map((r, i) => `L${X(RANGE_HISTORY.length - 1 - i)},${Y(r.lo)}`).join(" ")} Z`}
            fill={t.up}
            opacity="0.24"
          />
          <path d={poly(RANGE_HISTORY.map((r, i) => [X(i), Y(r.hi)] as [number, number]))} fill="none" stroke={t.up} strokeWidth="1.6" />
          <path d={poly(RANGE_HISTORY.map((r, i) => [X(i), Y(r.lo)] as [number, number]))} fill="none" stroke={t.up} strokeWidth="1.6" />
          <path d={smooth(RANGE_HISTORY.map((r, i) => [X(i), Y(r.px)] as [number, number]))} fill="none" stroke="#E8F0EA" strokeWidth="2.6" />
          {mode === "both" &&
            <path d={poly(RANGE_HISTORY.map((r, i) => [X(i), Y((r.lo + r.hi) / 2)] as [number, number]))} fill="none" stroke="#E88A73" strokeWidth="1.6" strokeDasharray="5 4" />}

          {RANGE_HISTORY.map((r, i) => (
            <g key={r.q} onMouseEnter={() => setHover(i)}>
              <rect x={X(i) - 30} y="18" width="60" height={H - 58} fill="transparent" />
              <circle cx={X(i)} cy={Y(r.px)} r={hover === i ? 6 : 3.4} fill={hover === i ? "#E8F0EA" : "#E8F0EA"} stroke={t.bg} strokeWidth="1.5" />
              {hover === i && <line x1={X(i)} x2={X(i)} y1="18" y2={H - 40} stroke="#E8F0EA" strokeWidth="0.8" strokeDasharray="3 3" />}
            </g>
          ))}
          {RANGE_HISTORY.map((r, i) => (
            <text key={r.q} x={X(i)} y={H - 18} fontSize="10" fill={hover === i ? "#E8F0EA" : t.sub} textAnchor="middle" fontFamily="IBM Plex Mono">{r.q}</text>
          ))}
          <text x={W - 68} y={Y(RANGE_HISTORY.at(-1)!.px) + 4} fontSize="13" fill="#E8F0EA" fontFamily="IBM Plex Mono" fontWeight="600">187.42</text>
        </svg>

        <aside style={{ borderLeft: `1px solid ${t.rule}` }} className="pl-5">
          <Caps style={{ color: t.up }}>{cur.q}</Caps>
          <div className="tnum font-sans text-[38px] font-extrabold leading-none">${cur.px}</div>
          <div className="mt-1 font-mono text-[11.5px]" style={{ color: t.sub }}>
            band ${cur.lo} – ${cur.hi}
          </div>
          <div className="mt-3 inline-block px-2 py-1 font-mono text-[11px]" style={{ background: inside ? "rgba(105,195,155,0.22)" : "rgba(232,128,115,0.22)", color: inside ? t.up : t.down }}>
            {inside ? "trading inside the band" : `trading ${cur.px > cur.hi ? "above" : "below"} the band`}
          </div>
          <div className="mt-4 space-y-2">
            {[
              ["Band width", `$${cur.hi - cur.lo} (${(((cur.hi - cur.lo) / ((cur.lo + cur.hi) / 2)) * 100).toFixed(0)}%)`],
              ["Price vs mid", `${(((cur.px - (cur.lo + cur.hi) / 2) / ((cur.lo + cur.hi) / 2)) * 100).toFixed(1)}%`],
              ["Quarter return", `${i_return(hover)}`],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between border-b pb-1.5" style={{ borderColor: t.rule }}>
                <span className="font-mono text-[10px] uppercase tracking-[0.14em]" style={{ color: t.sub }}>{k}</span>
                <span className="tnum font-mono text-[12.5px]">{v}</span>
              </div>
            ))}
          </div>
          <p className="mt-4 font-display text-[14.5px] italic leading-relaxed" style={{ color: t.sub }}>
            The band widens as the estimates rise: the market has been re-rated faster than the models have caught up.
          </p>
        </aside>
      </div>
    </div>
  );
}
function i_return(i: number) {
  if (i === 0) return "—";
  const a = RANGE_HISTORY[i].px, b = RANGE_HISTORY[i - 1].px;
  return `${a >= b ? "+" : ""}${(((a - b) / b) * 100).toFixed(1)}%`;
}

/* ═══════════════════════ 14.c — ESTIMATE SWARM ═══════════════════════ */
const DOTS = [
  ...Array.from({ length: 42 }, (_, i) => ({
    v: 150 + Math.round(Math.abs(Math.sin(i * 2.31)) * 108),
    kind: i < 10 ? "target" : i < 21 ? "dcf" : i < 31 ? "multiple" : "other",
    who: i < 10 ? ["Morgan Keegan", "Barrow & Finch", "Cascadia", "Hoffmann", "Wells Fargo", "Stifel", "RBC", "Bernstein", "Jefferies", "Baird"][i] : i < 21 ? "Model — internal" : i < 31 ? "Screen — peer set" : "Method — SOTP/NAV",
  })),
];
const KINDS: Record<string, string> = { target: "#8E1F2F", dcf: "#1B3A5C", multiple: "#D98324", other: "#8A7F73" };

function P14C() {
  const t = TONES.paper;
  const [kind, setKind] = useState<string>("all");
  const [sel, setSel] = useState<number | null>(null);
  const shown = DOTS.filter((d) => kind === "all" || d.kind === kind);
  const vals = shown.map((d) => d.v);
  const q = (p: number) => {
    const s = [...vals].sort((a, b) => a - b);
    return s[Math.floor((s.length - 1) * p)];
  };
  const med = q(0.5);
  const LO = 140, HI = 270;
  const pos = (v: number) => ((v - LO) / (HI - LO)) * 100;
  const cur = sel !== null ? shown[sel] : null;

  const bins = Array.from({ length: 26 }, (_, i) => LO + i * 5);
  const counts = bins.map((b) => shown.filter((d) => d.v >= b && d.v < b + 5).length);
  const mx = Math.max(...counts, 1);

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-wrap gap-1.5">
          {["all", "target", "dcf", "multiple", "other"].map((k) => (
            <Chip key={k} t={t} on={kind === k} onClick={() => { setKind(k); setSel(null); }} color={KINDS[k] ?? "#8E1F2F"}>
              {k === "all" ? `all ${DOTS.length}` : `${k} · ${DOTS.filter((d) => d.kind === k).length}`}
            </Chip>
          ))}
        </div>
        <div className="flex gap-5">
          {[["Low", Math.min(...vals)], ["Median", med], ["High", Math.max(...vals)], ["Price", 187.42]].map(([k, v]) => (
            <div key={k as string}>
              <Caps style={{ color: k === "Price" ? t.down : t.sub }}>{k as string}</Caps>
              <div className="tnum font-sans text-[21px] font-bold tracking-tight" style={{ color: k === "Price" ? t.down : t.fg }}>
                ${typeof v === "number" ? v.toFixed(k === "Price" ? 2 : 0) : v}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* density */}
      <div className="relative h-[96px] w-full border-b" style={{ borderColor: t.fg }}>
        {counts.map((c, i) => (
          <div
            key={i}
            className="absolute bottom-0 transition-all duration-500"
            style={{ left: `${pos(bins[i])}%`, width: `${(5 / (HI - LO)) * 100}%`, height: `${(c / mx) * 78}px`, background: "rgba(27,58,92,0.28)" }}
          />
        ))}
        {/* quartile brackets */}
        <div className="absolute top-1 flex w-full">
          <div className="absolute" style={{ left: `${pos(q(0.25))}%`, width: `${pos(q(0.75)) - pos(q(0.25))}%`, height: "5px", top: 0, background: t.down, opacity: 0.5 }} />
          <div className="absolute" style={{ left: `${pos(med)}%`, width: "2px", height: "15px", top: 0, background: t.down }} />
        </div>
        <div className="absolute -top-1 font-mono text-[9.5px]" style={{ left: `${pos(med)}%`, transform: "translateX(6px)", color: t.down }}>
          interquartile range
        </div>
      </div>

      {/* swarm */}
      <div className="relative h-[188px] w-full">
        {shown.map((d, i) => {
          const row = i % 7;
          const isSel = sel === i;
          return (
            <button
              key={i}
              onMouseEnter={() => setSel(i)}
              onMouseLeave={() => setSel(null)}
              onClick={() => setSel(i)}
              className="absolute rounded-full transition-all duration-200"
              style={{
                left: `calc(${pos(d.v)}% - 7px)`,
                top: `${14 + row * 24}px`,
                width: isSel ? 18 : 14,
                height: isSel ? 18 : 14,
                background: KINDS[d.kind],
                opacity: isSel ? 1 : 0.78,
                border: isSel ? `2px solid ${t.fg}` : "none",
                zIndex: isSel ? 5 : 1,
              }}
              aria-label={`${d.who} $${d.v}`}
            />
          );
        })}
        {/* price rule */}
        <div className="absolute top-0 h-full w-[2px]" style={{ left: `${pos(187.42)}%`, background: t.down, zIndex: 6 }} />
        <div className="absolute px-2 py-1 font-mono text-[11px] font-semibold" style={{ left: `${pos(187.42)}%`, top: 152, background: t.down, color: t.bg, transform: "translateX(-50%)", zIndex: 7 }}>
          $187.42 today
        </div>
        {cur && (
          <div
            className="pointer-events-none absolute z-10 w-[212px] px-3 py-2"
            style={{
              left: `min(calc(${pos(cur.v)}% + 14px), calc(100% - 220px))`,
              top: Math.max(0, (sel! % 7) * 24 - 6),
              background: t.panel,
              border: `1px solid ${t.fg}`,
            }}
          >
            <div className="font-mono text-[10px] uppercase tracking-[0.14em]" style={{ color: KINDS[cur.kind] }}>{cur.kind}</div>
            <div className="font-display text-[15px] leading-snug">{cur.who}</div>
            <div className="tnum font-sans text-[22px] font-extrabold">${cur.v}</div>
            <div className="font-mono text-[10.5px]" style={{ color: t.sub }}>
              {cur.v > 187.42 ? "▲" : "▼"} {Math.abs(((cur.v - 187.42) / 187.42) * 100).toFixed(1)}% vs price
            </div>
          </div>
        )}
      </div>

      {/* axis */}
      <div className="relative h-[34px] border-t pt-1.5" style={{ borderColor: t.fg }}>
        {Array.from({ length: 14 }).map((_, i) => LO + i * 10).map((v) => (
          <div key={v} className="absolute" style={{ left: `${pos(v)}%` }}>
            <div className="h-1.5 w-px" style={{ background: t.rule }} />
            <div className="tnum -translate-x-1/2 font-mono text-[10px]" style={{ color: t.sub }}>{v}</div>
          </div>
        ))}
      </div>

      <div className="mt-5 flex flex-wrap gap-x-7 gap-y-2 border-t pt-3" style={{ borderColor: t.rule }}>
        {Object.entries(KINDS).map(([k, c]) => (
          <span key={k} className="flex items-center gap-2 font-mono text-[10.5px] uppercase tracking-[0.12em]" style={{ color: t.sub }}>
            <span className="inline-block h-[11px] w-[11px] rounded-full" style={{ background: c }} /> {k}
          </span>
        ))}
        <span className="ml-auto font-display text-[14.5px] italic" style={{ color: t.sub }}>
          {shown.filter((d) => d.v > 187.42).length} of {shown.length} estimates sit above today's price.
        </span>
      </div>
    </div>
  );
}

export function C14() {
  const nm = "Fair value range";
  return (
    <>
      <Plate n={14} letter="a" name={nm} variant="Football field — methods on, methods off, envelope redraws" tone="bone" caption="Eight methods as horizontal bands on one price axis, sorted by midpoint or by width. Every method is a toggle; the dashed claret envelope and the blended mid recompute from only the methods you have kept.">
        <P14A />
      </Plate>
      <Plate n={14} letter="b" name={nm} variant="The band through time — was the stock ever cheap?" tone="ledger" caption="Fair value is a moving object, so plot it as one: nine quarters of low–high band with the actual price threaded through. Hover a quarter to see whether the quote was inside, above or below the range at the time.">
        <P14B />
      </Plate>
      <Plate n={14} letter="c" name={nm} variant="Estimate swarm — every individual view as a dot" tone="paper" caption="Forty-two discrete estimates rather than eight tidy bars: a density histogram, an interquartile bracket, and a swarm where each dot can be inspected for its author, method and distance from today's price. Filter by kind and the quartiles recompute.">
        <P14C />
      </Plate>
    </>
  );
}
