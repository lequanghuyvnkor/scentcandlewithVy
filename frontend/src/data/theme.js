// SOLACE — Bespoke Candle · Saigon. Editorial parchment/umber/gold palette.
// Property names are kept stable (T.pink, T.pinkDeep, …) so every existing
// call site keeps working — only the underlying hex values shifted to SOLACE.
export const T = {
  // Backgrounds
  bg: "#F4EDE4",     // Parchment — page background
  card: "#FFFFFF",   // White — card surface
  soft: "#FAF6F1",   // Soft parchment — inset sections, sim panels
  dark: "#2D2822",   // Umber — dark hero sections, primary buttons

  // Text
  text: "#2D2822",   // Umber — primary text
  textSub: "#4A3D2E", // Cocoa — secondary text
  cocoa: "#4A3D2E",   // Cocoa — jar outlines, wick lines
  muted: "#8B6F4E",  // Caramel — labels, captions, placeholders

  // Accent (gold family — replaces the old dusty-pink family 1:1)
  pink: "#C9A96E",       // Gold — accent, highlights, active states
  pinkSoft: "#EAD9BC",   // Gold 30% — subtle tints, selected bg
  pinkDeep: "#A07840",   // Gold deep — hover state, emphasis text
  gold: "#C9A96E",
  goldDeep: "#A07840",
  goldLight: "#EAD9BC",

  // Borders & lines
  line: "#DDD0BE",      // Standard border
  lineHair: "#EAE0D0",  // Hairline divider (between rows)
  lineDark: "#C4B49A",  // Stronger border (selected, focused)

  // Status colors — muted, editorial palette
  green: "#E8EFE4", greenDeep: "#4A6741", greenSoft: "#E8EFE4",
  yellow: "#F5EDE0", yellowDeep: "#8B6430", amber: "#F5EDE0", amberDeep: "#8B6430",
  blue: "#E4EBF0", blueDeep: "#3A5A70",
  lilac: "#EDE6F0", lilacDeep: "#6B5478",
  red: "#F4E8E4", redDeep: "#8B3A2A", redSoft: "#F4E8E4",

  // JarCandle SVG materials — named so no illustration ships an unlocked
  // inline hex (Hallmark anti-slop gate 48: mid-render token improvisation).
  flameCore: "#EFAE5C", flameMid: "#F9D888", flameTip: "#FFF6DE",
  glassHighlight: "#FFFFFF",
  lidWood: "#C4A876", lidCork: "#B98A5C", lidTin: "#C9C2AE",
  lidMasonBand: "#B7A986", lidMasonWire: "#9C9284",
};

// Typography roles — Cinzel for identity/numbers, Josefin Sans for UI/navigation.
export const TYPE = {
  hero: { fontSize: 48, fontFamily: "'Cinzel', serif", fontWeight: 400, letterSpacing: "0.04em", lineHeight: 1.15 },
  display: { fontSize: 28, fontFamily: "'Cinzel', serif", fontWeight: 400, letterSpacing: "0.03em" },
  title: { fontSize: 18, fontFamily: "'Cinzel', serif", fontWeight: 400, letterSpacing: "0.04em" },
  eyebrow: { fontSize: 9, fontFamily: "'Josefin Sans', sans-serif", fontWeight: 300, letterSpacing: "0.25em", textTransform: "uppercase" },
  label: { fontSize: 11, fontFamily: "'Josefin Sans', sans-serif", fontWeight: 300, letterSpacing: "0.18em", textTransform: "uppercase" },
  nav: { fontSize: 11, fontFamily: "'Josefin Sans', sans-serif", fontWeight: 300, letterSpacing: "0.22em", textTransform: "uppercase" },
  body: { fontSize: 13, fontFamily: "'Josefin Sans', sans-serif", fontWeight: 400, letterSpacing: "0.02em", lineHeight: 1.7 },
  price: { fontSize: 22, fontFamily: "'Josefin Sans', sans-serif", fontWeight: 300, letterSpacing: "0.06em" },
  stat: { fontSize: 20, fontFamily: "'Cinzel', serif", fontWeight: 400 },
};

export const ADMIN_PASSCODE = "candle2026";
