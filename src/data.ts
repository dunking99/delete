// ─────────────────────────────────────────────────────────────
// MERIDIAN — sample data universe
// Focus company: Halcyon Grid Technologies (NASDAQ: HLG)
// All figures invented, internally consistent, "as of 18 Mar 2026".
// ─────────────────────────────────────────────────────────────

export const TODAY = "18 Mar 2026";
export const AS_OF = "18 Mar 2026 · 15:42 ET";

export const CO = {
  name: "Halcyon Grid Technologies",
  short: "Halcyon Grid",
  ticker: "HLG",
  exchange: "NASDAQ",
  ccy: "USD",
  sector: "Industrials — Electrical Equipment",
  industry: "Grid-scale power conversion",
  isin: "US40135X1094",
  price: 187.42,
  chg: 3.18,
  chgPct: 1.73,
  open: 184.6,
  high: 188.94,
  low: 183.72,
  prev: 184.24,
  mktCap: 68.4,
  ev: 74.9,
  shares: 365.0,
  float: 331.6,
  avgVol: 4.12,
  vol: 5.87,
  pe: 34.2,
  fwdPe: 26.8,
  evEbitda: 21.4,
  ps: 14.2,
  pb: 8.9,
  divYield: 0.62,
  div: 1.16,
  payout: 21.4,
  beta: 1.34,
  eps: 5.48,
  epsTtm: 5.48,
  rev: 4.82,
  revGrowth: 18.6,
  grossMargin: 44.8,
  opMargin: 21.3,
  netMargin: 16.9,
  roic: 17.4,
  roe: 26.1,
  netDebt: 3.9,
  debtEbitda: 1.4,
  current: 2.1,
  employees: 14200,
  hi52: 196.3,
  lo52: 108.94,
  target: 214.5,
  targetHigh: 255,
  targetLow: 158,
  rating: "Buy",
  instOwn: 78.4,
  insiderOwn: 4.1,
  shortPct: 2.8,
  daysToCover: 1.9,
  esg: 71,
  founded: 1997,
  hq: "Reading, Pennsylvania",
  desc:
    "Halcyon Grid designs and manufactures utility-scale inverters, grid-forming battery converters and substation control software for transmission and distribution operators across North America, Europe and India.",
};

export const price = (seed: number) => seed;
function rnd(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

/** 156 weekly closes ending exactly on CO.price */
export function makeSeries(n: number, start: number, end: number, vol: number, seed: number) {
  const r = rnd(seed);
  const raw: number[] = [];
  let p = 1;
  for (let i = 0; i < n; i++) {
    p *= 1 + (r() - 0.5) * vol + (end / start - 1) / n;
    raw.push(p);
  }
  const k0 = start / raw[0];
  const s = raw.map((v) => v * k0);
  const k1 = end / s[n - 1];
  return s.map((v, i) => +(v * (1 + (k1 - 1) * (i / (n - 1)))).toFixed(2));
}

export const PX_3Y = makeSeries(156, 96.4, CO.price, 0.06, 7);
export const PX_1Y = PX_3Y.slice(-52);
export const PX_30D = PX_3Y.slice(-30);
export const PX_90D = PX_3Y.slice(-90);

/** Monday-dated labels back from 16 Mar 2026 */
export function weekLabels(n: number) {
  const end = new Date(2026, 2, 16);
  const out: string[] = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(end.getTime() - i * 7 * 86400000);
    out.push(
      d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "2-digit" }).replace(/ /g, " "),
    );
  }
  return out;
}

export const VOL_3Y = Array.from({ length: 156 }, (_, i) => {
  const r = rnd(11 + i)();
  return +(2.1 + r * 5.4 + (i % 26 === 0 ? 4.5 : 0)).toFixed(2);
});

// ── Peers ────────────────────────────────────────────────────
export type Peer = {
  t: string;
  name: string;
  mcap: number;
  rev: number;
  growth: number;
  gm: number;
  om: number;
  pe: number;
  ev: number;
  roic: number;
  beta: number;
  de: number;
  region: string;
};

export const PEERS: Peer[] = [
  { t: "HLG", name: "Halcyon Grid", mcap: 68.4, rev: 4.82, growth: 18.6, gm: 44.8, om: 21.3, pe: 34.2, ev: 21.4, roic: 17.4, beta: 1.34, de: 0.42, region: "US" },
  { t: "NVPT", name: "Novanta Power", mcap: 91.2, rev: 7.61, growth: 11.2, gm: 39.1, om: 17.8, pe: 28.6, ev: 16.9, roic: 13.9, beta: 1.11, de: 0.61, region: "US" },
  { t: "TDNE", name: "Terradyne Energy", mcap: 42.7, rev: 3.94, growth: 24.9, gm: 41.6, om: 14.2, pe: 46.1, ev: 24.8, roic: 11.2, beta: 1.52, de: 0.88, region: "DE" },
  { t: "CNDR", name: "Cinder Works", mcap: 27.9, rev: 2.88, growth: 6.4, gm: 36.2, om: 12.6, pe: 22.4, ev: 12.1, roic: 15.6, beta: 0.94, de: 0.29, region: "US" },
  { t: "BLNE", name: "Brightline Electric", mcap: 55.3, rev: 5.42, growth: 14.1, gm: 46.9, om: 19.4, pe: 31.8, ev: 19.6, roic: 18.8, beta: 1.19, de: 0.35, region: "JP" },
  { t: "ORBK", name: "Orbis Power Systems", mcap: 18.6, rev: 1.97, growth: 31.4, gm: 48.3, om: 9.1, pe: 62.5, ev: 31.2, roic: 7.4, beta: 1.71, de: 1.12, region: "SE" },
  { t: "KSDL", name: "Kestrel Drives", mcap: 33.1, rev: 3.36, growth: 4.8, gm: 33.7, om: 13.9, pe: 19.7, ev: 10.4, roic: 14.1, beta: 0.86, de: 0.44, region: "UK" },
  { t: "ASHG", name: "Ashgrove Capital", mcap: 12.4, rev: 1.21, growth: -2.1, gm: 29.4, om: 8.2, pe: 14.9, ev: 8.6, roic: 9.8, beta: 0.72, de: 1.46, region: "US" },
];

// ── Financial statements ─────────────────────────────────────
export type Row = { k: string; v: number[]; sub?: Row[]; pct?: boolean; strong?: boolean };
export const FY = ["FY21", "FY22", "FY23", "FY24", "FY25"];

export const INCOME: Row[] = [
  { k: "Revenue", v: [2684, 3117, 3604, 4064, 4820], strong: true, sub: [
    { k: "Power conversion systems", v: [1596, 1884, 2199, 2491, 3002] },
    { k: "Storage & controls software", v: [612, 741, 884, 1024, 1268] },
    { k: "Service & long-term agreements", v: [368, 394, 402, 411, 418] },
    { k: "Licence and other", v: [108, 98, 119, 138, 132] },
  ]},
  { k: "Cost of revenue", v: [-1563, -1877, -2195, -2414, -2661], sub: [
    { k: "Materials and components", v: [-1108, -1349, -1601, -1758, -1913] },
    { k: "Direct labour", v: [-286, -331, -377, -412, -459] },
    { k: "Warranty and reserves", v: [-94, -108, -127, -131, -148] },
    { k: "Freight and duty", v: [-75, -89, -90, -113, -141] },
  ]},
  { k: "Gross profit", v: [1121, 1240, 1409, 1650, 2159], strong: true, pct: true },
  { k: "Research and development", v: [-284, -322, -371, -419, -496], sub: [
    { k: "Grid-forming controls", v: [-141, -162, -188, -214, -257] },
    { k: "Silicon and magnetics", v: [-98, -112, -129, -146, -171] },
    { k: "Reliability and certification", v: [-45, -48, -54, -59, -68] },
  ]},
  { k: "Selling, general and administrative", v: [-507, -561, -622, -688, -782], sub: [
    { k: "Sales and applications engineering", v: [-214, -236, -262, -289, -331] },
    { k: "Corporate and administration", v: [-168, -184, -204, -226, -254] },
    { k: "Stock-based compensation", v: [-125, -141, -156, -173, -197] },
  ]},
  { k: "Amortisation of intangibles", v: [-64, -71, -78, -84, -92] },
  { k: "Restructuring and other", v: [-18, -42, -27, -19, -34] },
  { k: "Operating income", v: [248, 244, 282, 440, 755], strong: true, pct: true },
  { k: "Interest expense, net", v: [-58, -64, -71, -79, -86] },
  { k: "Other income (expense), net", v: [12, -6, 18, 24, 31] },
  { k: "Income before tax", v: [202, 174, 229, 385, 700] },
  { k: "Provision for income taxes", v: [-41, -35, -47, -81, -147] },
  { k: "Net income", v: [161, 139, 182, 304, 553], strong: true, pct: true },
  { k: "Diluted EPS (US$)", v: [0.46, 0.39, 0.5, 0.83, 1.52], strong: true },
];

export const BALANCE: Row[] = [
  { k: "Cash and cash equivalents", v: [842, 706, 918, 1204, 1489], strong: true },
  { k: "Short-term investments", v: [214, 188, 246, 318, 402] },
  { k: "Accounts receivable, net", v: [604, 718, 806, 902, 1071], sub: [
    { k: "Trade receivables", v: [566, 674, 758, 848, 1012] },
    { k: "Unbilled and retention", v: [38, 44, 48, 54, 59] },
  ]},
  { k: "Contract assets", v: [188, 226, 271, 302, 366] },
  { k: "Inventory", v: [512, 648, 741, 812, 946], sub: [
    { k: "Raw materials", v: [268, 341, 388, 421, 486] },
    { k: "Work in progress", v: [141, 176, 199, 224, 268] },
    { k: "Finished goods", v: [103, 131, 154, 167, 192] },
  ]},
  { k: "Total current assets", v: [2468, 2594, 3084, 3692, 4402], strong: true },
  { k: "Property, plant and equipment, net", v: [1104, 1261, 1402, 1544, 1802] },
  { k: "Goodwill and intangibles", v: [684, 691, 702, 716, 812] },
  { k: "Total assets", v: [4362, 4641, 5288, 6052, 7144], strong: true, pct: true },
  { k: "Accounts payable", v: [486, 588, 664, 721, 862] },
  { k: "Accrued liabilities", v: [402, 441, 488, 532, 618] },
  { k: "Deferred revenue", v: [318, 366, 418, 472, 559] },
  { k: "Current portion of debt", v: [125, 128, 96, 104, 112] },
  { k: "Total current liabilities", v: [1378, 1524, 1704, 1876, 2194], strong: true },
  { k: "Long-term debt", v: [1204, 1181, 1094, 1021, 948] },
  { k: "Deferred tax liabilities", v: [142, 151, 164, 178, 196] },
  { k: "Total liabilities", v: [2846, 3021, 3268, 3522, 3986], strong: true },
  { k: "Common stock and paid-in capital", v: [1489, 1542, 1618, 1704, 1842] },
  { k: "Retained earnings", v: [402, 414, 468, 604, 846] },
  { k: "Treasury stock", v: [-312, -361, -428, -511, -648] },
  { k: "Total shareholders' equity", v: [1516, 1620, 2020, 2530, 3158], strong: true, pct: true },
];

export const CASHFLOW: Row[] = [
  { k: "Net income", v: [161, 139, 182, 304, 553], strong: true },
  { k: "Depreciation and amortisation", v: [186, 204, 226, 248, 274] },
  { k: "Stock-based compensation", v: [125, 141, 156, 173, 197] },
  { k: "Change in working capital", v: [-142, -166, -118, -94, -182], sub: [
    { k: "Accounts receivable", v: [-78, -114, -88, -96, -169] },
    { k: "Inventory", v: [-94, -136, -93, -71, -134] },
    { k: "Accounts payable", v: [62, 102, 76, 71, 111] },
    { k: "Deferred revenue", v: [-32, -18, -13, 2, 10] },
  ]},
  { k: "Cash from operations", v: [330, 318, 446, 631, 842], strong: true, pct: true },
  { k: "Capital expenditure", v: [-214, -248, -281, -312, -386], sub: [
    { k: "Manufacturing capacity", v: [-152, -178, -204, -224, -276] },
    { k: "Tooling and test equipment", v: [-41, -45, -51, -56, -68] },
    { k: "IT and other", v: [-21, -25, -26, -32, -42] },
  ]},
  { k: "Acquisitions, net of cash", v: [-120, -14, -8, -16, -184] },
  { k: "Cash from investing", v: [-348, -274, -301, -342, -586], strong: true },
  { k: "Net debt issuance / (repayment)", v: [188, -24, -82, -74, -68] },
  { k: "Dividends paid", v: [-42, -46, -52, -58, -64] },
  { k: "Share repurchases", v: [-96, -118, -141, -184, -248] },
  { k: "Cash from financing", v: [42, -196, -281, -324, -388], strong: true },
  { k: "Free cash flow", v: [116, 70, 165, 319, 456], strong: true, pct: true },
];

// ── Quarters ─────────────────────────────────────────────────
export const QUARTERS = [
  { q: "Q1'24", rev: 878, eps: 0.16, epsG: 0.13, guide: 0.14, gm: 41.2 },
  { q: "Q2'24", rev: 964, eps: 0.19, epsG: 0.17, guide: 0.18, gm: 42.0 },
  { q: "Q3'24", rev: 1012, eps: 0.21, epsG: 0.2, guide: 0.2, gm: 42.8 },
  { q: "Q4'24", rev: 1210, eps: 0.27, epsG: 0.24, guide: 0.26, gm: 43.4 },
  { q: "Q1'25", rev: 1046, eps: 0.24, epsG: 0.22, guide: 0.23, gm: 43.6 },
  { q: "Q2'25", rev: 1164, eps: 0.29, epsG: 0.27, guide: 0.26, gm: 44.1 },
  { q: "Q3'25", rev: 1218, eps: 0.32, epsG: 0.31, guide: 0.3, gm: 44.9 },
  { q: "Q4'25", rev: 1392, eps: 0.41, epsG: 0.36, guide: 0.38, gm: 45.6 },
];

// ── Segments ─────────────────────────────────────────────────
export const SEGMENTS = [
  { name: "Power conversion", rev: 3002, prev: 2491, op: 684, color: "#8E1F2F" },
  { name: "Storage & controls", rev: 1268, prev: 1024, op: 316, color: "#1B3A5C" },
  { name: "Service & LTAs", rev: 418, prev: 411, op: 141, color: "#D98324" },
  { name: "Licence & other", rev: 132, prev: 138, op: -18, color: "#8A7F73" },
];

export const GEO = [
  { name: "United States & Canada", rev: 2362, prev: 1946, color: "#8E1F2F" },
  { name: "Europe, Middle East", rev: 1253, prev: 1088, color: "#1B3A5C" },
  { name: "India & South Asia", rev: 723, prev: 564, color: "#D98324" },
  { name: "Rest of Asia-Pacific", rev: 346, prev: 326, color: "#2E5E4A" },
  { name: "Latin America", rev: 136, prev: 140, color: "#8A7F73" },
];

// ── Holders / ownership ──────────────────────────────────────
export const HOLDERS = [
  { name: "Vanguard Group", type: "Index", shares: 31.42, pct: 8.61, chg: 0.42, aum: 9.8 },
  { name: "BlackRock Fund Advisors", type: "Index", shares: 28.96, pct: 7.93, chg: -0.31, aum: 11.2 },
  { name: "State Street Global", type: "Index", shares: 16.11, pct: 4.41, chg: 0.18, aum: 4.6 },
  { name: "Fidelity Investments", type: "Active", shares: 14.6, pct: 4.0, chg: 1.24, aum: 3.1 },
  { name: "T. Rowe Price Associates", type: "Active", shares: 11.68, pct: 3.2, chg: 0.64, aum: 5.4 },
  { name: "Capital Research Mgmt", type: "Active", shares: 9.86, pct: 2.7, chg: -0.42, aum: 6.9 },
  { name: "Geode Capital", type: "Index", shares: 7.77, pct: 2.13, chg: 0.22, aum: 2.2 },
  { name: "Baillie Gifford", type: "Active", shares: 6.94, pct: 1.9, chg: -1.12, aum: 8.4 },
  { name: "Norges Bank IM", type: "Sovereign", shares: 6.21, pct: 1.7, chg: 0.31, aum: 1.4 },
  { name: "Citadel Advisors", type: "Hedge fund", shares: 3.14, pct: 0.86, chg: 1.86, aum: 0.42 },
  { name: "Two Sigma Investments", type: "Hedge fund", shares: 2.27, pct: 0.62, chg: -0.44, aum: 0.31 },
  { name: "Millennium Mgmt", type: "Hedge fund", shares: 1.86, pct: 0.51, chg: 0.92, aum: 0.28 },
];

export const OWN_MIX = [
  { q: "Q1'23", inst: 71.2, insider: 5.4, retail: 23.4 },
  { q: "Q2'23", inst: 72.0, insider: 5.3, retail: 22.7 },
  { q: "Q3'23", inst: 73.4, insider: 5.1, retail: 21.5 },
  { q: "Q4'23", inst: 74.1, insider: 4.9, retail: 21.0 },
  { q: "Q1'24", inst: 74.8, insider: 4.8, retail: 20.4 },
  { q: "Q2'24", inst: 75.6, insider: 4.7, retail: 19.7 },
  { q: "Q3'24", inst: 76.2, insider: 4.6, retail: 19.2 },
  { q: "Q4'24", inst: 76.4, insider: 4.5, retail: 19.1 },
  { q: "Q1'25", inst: 77.1, insider: 4.4, retail: 18.5 },
  { q: "Q2'25", inst: 77.4, insider: 4.3, retail: 18.3 },
  { q: "Q3'25", inst: 77.9, insider: 4.2, retail: 17.9 },
  { q: "Q4'25", inst: 78.4, insider: 4.1, retail: 17.5 },
];

export const INSIDERS = [
  { who: "R. E. Castellano", role: "Chief Executive Officer", act: "Sell", sh: 42000, px: 182.1, date: "12 Feb 2026", note: "10b5-1 plan, adopted 04 Nov 2025" },
  { who: "M. Okonkwo", role: "Chief Financial Officer", act: "Buy", sh: 8600, px: 164.8, date: "03 Feb 2026", note: "Open market purchase" },
  { who: "L. Brandt", role: "President, Europe", act: "Sell", sh: 11500, px: 176.4, date: "22 Jan 2026", note: "Tax withholding on vest" },
  { who: "S. Ahuja", role: "Chief Technology Officer", act: "Buy", sh: 4100, px: 158.2, date: "19 Dec 2025", note: "Open market purchase" },
  { who: "R. E. Castellano", role: "Chief Executive Officer", act: "Sell", sh: 38000, px: 171.9, date: "08 Nov 2025", note: "10b5-1 plan" },
  { who: "D. Ferreira", role: "Director", act: "Buy", sh: 2500, px: 149.6, date: "30 Oct 2025", note: "Director open market purchase" },
  { who: "M. Okonkwo", role: "Chief Financial Officer", act: "Buy", sh: 6200, px: 141.2, date: "07 Aug 2025", note: "Open market purchase" },
  { who: "K. Weiss", role: "General Counsel", act: "Sell", sh: 9400, px: 138.7, date: "15 Jul 2025", note: "10b5-1 plan" },
];

// ── Filings / transcripts ────────────────────────────────────
export const FILINGS = [
  { form: "10-K", title: "Annual report for the fiscal year ended December 31, 2025", date: "13 Feb 2026", size: "4.2 MB", pages: 214, tag: "Earnings", fresh: true },
  { form: "8-K", title: "Results of operations and financial condition — Q4 & FY2025", date: "12 Feb 2026", size: "812 KB", pages: 38, tag: "Earnings", fresh: true },
  { form: "DEF 14A", title: "Definitive proxy statement — 2026 annual meeting of shareholders", date: "27 Mar 2026", size: "3.1 MB", pages: 128, tag: "Governance" },
  { form: "10-Q", title: "Quarterly report for the period ended September 30, 2025", date: "06 Nov 2025", size: "2.4 MB", pages: 96, tag: "Quarterly" },
  { form: "S-3ASR", title: "Automatic shelf registration statement — $1.5bn notes programme", date: "18 Sep 2025", size: "1.8 MB", pages: 74, tag: "Capital markets" },
  { form: "SC 13G/A", title: "Amended beneficial ownership — Baillie Gifford & Co", date: "14 Feb 2026", size: "86 KB", pages: 6, tag: "Ownership" },
  { form: "8-K", title: "Entry into a material definitive agreement — Arden Supply", date: "04 Dec 2025", size: "420 KB", pages: 14, tag: "Material" },
  { form: "Form 4", title: "Statement of changes in beneficial ownership — M. Okonkwo", date: "05 Feb 2026", size: "22 KB", pages: 2, tag: "Insider" },
  { form: "10-K/A", title: "Part III information — Item 10 through 14", date: "20 Mar 2026", size: "640 KB", pages: 32, tag: "Governance" },
];

export const CALLS = [
  { q: "Q4 2025", date: "12 Feb 2026", dur: "68 min", speakers: 7, sentiment: 0.74, themes: ["Grid-forming ramp", "India capacity", "Gross margin bridge", "Tariff exposure"] },
  { q: "Q3 2025", date: "06 Nov 2025", dur: "61 min", speakers: 7, sentiment: 0.66, themes: ["Backlog conversion", "Software attach", "Working capital"] },
  { q: "Q2 2025", date: "07 Aug 2025", dur: "64 min", speakers: 6, sentiment: 0.58, themes: ["European demand", "Input costs", "Buyback pace"] },
  { q: "Q1 2025", date: "08 May 2025", dur: "57 min", speakers: 6, sentiment: 0.62, themes: ["Book-to-bill", "Ohio plant", "Guidance raise"] },
];

// ── Estimates ────────────────────────────────────────────────
export const EST_REV = [
  { d: "Mar'25", lo: 4.61, cons: 4.74, hi: 4.92, n: 22 },
  { d: "Jun'25", lo: 4.70, cons: 4.86, hi: 5.04, n: 23 },
  { d: "Sep'25", lo: 4.82, cons: 4.98, hi: 5.18, n: 24 },
  { d: "Dec'25", lo: 4.94, cons: 5.11, hi: 5.34, n: 24 },
  { d: "Mar'26", lo: 5.28, cons: 5.46, hi: 5.72, n: 25 },
];
export const EST_EPS = [
  { d: "Mar'25", lo: 1.86, cons: 1.98, hi: 2.14, n: 22 },
  { d: "Jun'25", lo: 1.94, cons: 2.07, hi: 2.26, n: 23 },
  { d: "Sep'25", lo: 2.06, cons: 2.21, hi: 2.41, n: 24 },
  { d: "Dec'25", lo: 2.18, cons: 2.36, hi: 2.58, n: 24 },
  { d: "Mar'26", lo: 2.44, cons: 2.64, hi: 2.92, n: 25 },
];

export const ANALYSTS = [
  { firm: "Morgan Keegan", analyst: "J. Sørensen", rating: "Overweight", prior: "Neutral", tgt: 232, date: "24 Feb 2026", fw: 1.4 },
  { firm: "Barrow & Finch", analyst: "A. Whitcombe", rating: "Buy", prior: "Buy", tgt: 245, date: "20 Feb 2026", fw: 2.1 },
  { firm: "Cascadia Securities", analyst: "P. Raghunathan", rating: "Neutral", prior: "Overweight", tgt: 186, date: "18 Feb 2026", fw: 0.8 },
  { firm: "Hoffmann Börsen", analyst: "K. Lindqvist", rating: "Buy", prior: "Buy", tgt: 224, date: "16 Feb 2026", fw: 1.1 },
  { firm: "Wells Fargo Sec.", analyst: "D. Marchetti", rating: "Overweight", prior: "Overweight", tgt: 218, date: "13 Feb 2026", fw: 3.2 },
  { firm: "Stifel Europe", analyst: "N. Okada", rating: "Hold", prior: "Hold", tgt: 172, date: "13 Feb 2026", fw: 0.6 },
  { firm: "RBC Capital Mkts", analyst: "T. Delacroix", rating: "Outperform", prior: "Outperform", tgt: 226, date: "11 Feb 2026", fw: 1.9 },
  { firm: "Bernstein Res.", analyst: "E. Kowalczyk", rating: "Market Perform", prior: "Outperform", tgt: 194, date: "09 Feb 2026", fw: 2.7 },
  { firm: "Jefferies", analyst: "S. Nakamura", rating: "Buy", prior: "Buy", tgt: 240, date: "06 Feb 2026", fw: 1.2 },
  { firm: "Baird", analyst: "C. Espinoza", rating: "Neutral", prior: "Neutral", tgt: 178, date: "05 Feb 2026", fw: 0.9 },
];

// ── Options ──────────────────────────────────────────────────
export function chain(strikes: number[], exp: string, iv: number) {
  const r = rnd(exp.length * 97);
  return strikes.map((k) => {
    const intrinsicC = Math.max(0, CO.price - k);
    const intrinsicP = Math.max(0, k - CO.price);
    const t = 0.16;
    const scale = Math.exp(-Math.pow(Math.abs(k - CO.price) / 44, 2));
    const timeC = CO.price * iv * Math.sqrt(t) * 0.4 * scale;
    const timeP = timeC * 1.04;
    return {
      k,
      cBid: +(intrinsicC + timeC - 0.28).toFixed(2),
      cAsk: +(intrinsicC + timeC + 0.28).toFixed(2),
      cVol: Math.round(180 + r() * 3400 * (scale + 0.12)),
      cOI: Math.round(900 + r() * 21000 * (scale + 0.1)),
      cIV: +(iv * (1 + (0.09 * (k - CO.price)) / 60 + 0.06 * scale)).toFixed(3),
      pBid: +(intrinsicP + timeP - 0.26).toFixed(2),
      pAsk: +(intrinsicP + timeP + 0.26).toFixed(2),
      pVol: Math.round(140 + r() * 2600 * (scale + 0.12)),
      pOI: Math.round(800 + r() * 17000 * (scale + 0.1)),
      pIV: +(iv * (1 - (0.07 * (k - CO.price)) / 60 + 0.05 * scale)).toFixed(3),
      atm: Math.abs(k - CO.price) < 3,
    };
  });
}
export const EXPIRIES = ["20 Mar 2026", "27 Mar 2026", "17 Apr 2026", "19 Jun 2026", "18 Dec 2026"];
export const STRIKES = [150, 155, 160, 165, 170, 175, 180, 185, 190, 195, 200, 205, 210, 215, 220];

// ── Milestones ───────────────────────────────────────────────
export const MILESTONES = [
  { y: "1997", t: "Founded", d: "Incorporated in Reading, PA as Halcyon Power Electronics.", kind: "corp", px: 4 },
  { y: "2004", t: "First utility inverter order", d: "PJM transmission operator selects H-200 platform.", kind: "prod", px: 9 },
  { y: "2010", t: "IPO on NASDAQ", d: "12.5m shares priced at $14.00; raised $161m.", kind: "mkt", px: 22 },
  { y: "2013", t: "2-for-1 stock split", d: "Split effective 22 August 2013.", kind: "mkt", px: 30 },
  { y: "2016", t: "Acquisition of Voltaric Controls", d: "$410m cash and stock — adds substation software.", kind: "ma", px: 41 },
  { y: "2018", t: "European hub, Dresden", d: "€180m plant opens; first non-US manufacturing.", kind: "ops", px: 52 },
  { y: "2020", t: "COVID demand shock", d: "Q2'20 revenue -31% YoY; 9% workforce reduction.", kind: "crisis", px: 34 },
  { y: "2021", t: "Short-seller report", d: "Frostline Research alleges channel stuffing; stock -24% in a day.", kind: "crisis", px: 47 },
  { y: "2022", t: "Ohio gigafactory announced", d: "$620m investment, 1,400 jobs, production from 2024.", kind: "ops", px: 58 },
  { y: "2023", t: "Spin-off: Halcyon Mobility", d: "EV charging division distributed to shareholders, 12 Sep 2023.", kind: "corp", px: 66 },
  { y: "2024", t: "Arden Supply agreement", d: "5-year, $1.1bn supply agreement with Arden Energy.", kind: "ma", px: 78 },
  { y: "2025", t: "India plant, Pune", d: "Second Asia facility opens; capacity +34%.", kind: "ops", px: 91 },
  { y: "2026", t: "Grid-forming platform launch", d: "H-Series GFM released; $840m initial backlog.", kind: "prod", px: 100 },
];

// ── Misc series used across plates ───────────────────────────
export const RATES = [0.25, 0.25, 0.5, 1.0, 2.5, 4.25, 5.0, 5.25, 5.0, 4.5, 4.0, 3.75];
export const TENYR = [1.52, 1.74, 2.11, 3.02, 3.88, 4.24, 4.59, 4.02, 4.36, 4.11, 3.94, 4.28];

export const NEWS = [
  { s: "Halcyon Grid beats Q4 estimates as grid-forming backlog hits $2.1bn", src: "Reuters", tone: 0.82, d: "12 Feb" },
  { s: "Halcyon selected for $480m Texas transmission modernisation", src: "Utility Dive", tone: 0.91, d: "26 Feb" },
  { s: "Tariff review could pressure inverter margins, analysts warn", src: "Barron's", tone: 0.28, d: "03 Mar" },
  { s: "Halcyon opens Pune plant ahead of schedule", src: "Mint", tone: 0.77, d: "09 Mar" },
  { s: "CFO Okonkwo buys $1.4m of stock in open-market purchase", src: "Insider Monkey", tone: 0.64, d: "14 Mar" },
];
