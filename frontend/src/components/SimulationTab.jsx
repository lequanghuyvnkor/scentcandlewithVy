import { useState, useMemo, useEffect } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { T, TYPE } from "../data/theme";
import { JAR_TYPES, WAX, FRAGS, JAR_COLORS, WICKS } from "../data/recipes";
import { Card, Btn } from "./ui/Primitives";
import { JarCandle } from "./JarCandle";
import { CheckoutModal } from "./CheckoutModal";
import { fmtVND } from "../utils/formatters";

const SIM_STEPS = [
  { label: "VESSEL" },
  { label: "WAX" },
  { label: "SCENT" },
  { label: "COLOUR" },
  { label: "FINISH" },
];

export function SimulationTab({ db, setDb, identity, showToast }) {
  const [step, setStep] = useState(0);
  const [maxReached, setMaxReached] = useState(0);
  const [jarTypeId, setJarTypeId] = useState("round");
  const [waxType, setWaxType] = useState("soybee");
  const [blend, setBlend] = useState({ lotus: 5, jasmine: 3 });
  const [jarColor, setJarColor] = useState("clear");
  const [engraving, setEngraving] = useState("");
  const [wick, setWick] = useState("md");
  const [lit, setLit] = useState(false);
  const [famFilter, setFam] = useState("ALL");
  const [buyOpen, setBuyOpen] = useState(false);

  useEffect(() => {
    setMaxReached((m) => Math.max(m, step));
  }, [step]);

  const jarType = JAR_TYPES.find((j) => j.id === jarTypeId);
  const totalLoad = Object.values(blend).reduce((s, v) => s + v, 0);
  const wax = WAX[waxType] || WAX.soybee;
  const rgb = wax.base;

  const calc = useMemo(() => {
    const wickDat = WICKS.find((w) => w.id === wick);
    const r = jarType.diam / 2;
    const volML = Math.PI * r * r * jarType.height * jarType.factor;
    const totalG = volML * wax.density;
    const fragG = totalG * (totalLoad / 100);
    const waxG = totalG - fragG;
    const burnH = waxG / (wax.burnRate * wickDat.factor);
    const loadScore = Math.min(totalLoad / wax.loadMax, 1.05);
    const cold = Math.min(loadScore * wax.coldF * 10, 10);
    const hot = Math.min(cold * wax.hotF, 10);
    const roomM2 = Math.round(hot * 2.8);

    let notes = { top: 0, mid: 0, base: 0 };
    let dominantNotes = { top: null, mid: null, base: null };
    if (totalLoad > 0) {
      let maxTop = 0, maxMid = 0, maxBase = 0;
      for (const [id, pct] of Object.entries(blend)) {
        const f = FRAGS.find((x) => x.id === id);
        const w = pct / totalLoad;
        notes.top += f.top * w;
        notes.mid += f.mid * w;
        notes.base += f.base * w;

        if (f.top * w > maxTop) { maxTop = f.top * w; dominantNotes.top = f.name.toLowerCase(); }
        if (f.mid * w > maxMid) { maxMid = f.mid * w; dominantNotes.mid = f.name.toLowerCase(); }
        if (f.base * w > maxBase) { maxBase = f.base * w; dominantNotes.base = f.name.toLowerCase(); }
      }
    }

    const scentData = Array.from({ length: 10 }, (_, i) => {
      const t = (i / 9) * burnH;
      const decay = Math.exp(-t / (burnH * 0.65));
      return {
        t: `${Math.round(t * 10) / 10}h`,
        "Nốt cao": +(notes.top * Math.exp(-t / (burnH * 0.28))).toFixed(1),
        "Nốt giữa": +(notes.mid * (1 - Math.exp(-t / (burnH * 0.18))) * decay).toFixed(1),
        "Nốt trầm": +(notes.base * (1 - Math.exp(-t / (burnH * 0.5))) * 0.88).toFixed(1),
      };
    });

    const meltData = Array.from({ length: 16 }, (_, i) => {
      const t = (i + 1) * 0.5;
      const ratio = 1 - Math.exp((-t * wickDat.meltK) / 2.2);
      return { t: `${t}h`, "Thực tế": +(ratio * jarType.diam).toFixed(1) };
    });

    const issues = [];
    if (totalLoad > wax.loadMax) issues.push(`Tổng dầu thơm ${totalLoad}% vượt mức ${wax.loadMax}% của ${wax.name}`);
    if (totalLoad < 4 && totalLoad > 0) issues.push("Dầu thơm hơi ít — mùi sẽ nhẹ.");
    if (totalLoad === 0) issues.push("Chưa chọn mùi hương nào.");
    if (meltData[3]["Thực tế"] < jarType.diam * 0.6) issues.push("Melt pool nhỏ — thử bấc to hơn.");
    if (burnH < 8) issues.push("Nến cháy khá nhanh với kiểu lọ này.");

    const bom = [
      [`wax-${waxType === "soybee" ? "soy" : (waxType === "beeswax" ? "bee" : waxType)}`, Math.round(waxG * (waxType === "soybee" ? 0.8 : 1))],
      ...(waxType === "soybee" ? [[`wax-bee`, Math.round(waxG * 0.2)]] : []),
      ...Object.entries(blend).map(([id, pct]) => [`oil-${id}`, +((fragG * pct) / totalLoad).toFixed(1)]),
      [`jar-${jarType.id}`, 1],
      [`wick-${wick}`, 1],
    ];
    let cost = 0;
    for (const [mid, qty] of bom) {
      const m = db.materials.find((x) => x.id === mid);
      cost += (m?.price ?? 0) * qty;
    }
    const price = Math.max(60000, Math.round((cost * 1.9 + 18000) / 1000) * 1000);

    return {
      waxG: Math.round(waxG),
      fragG: +fragG.toFixed(1),
      burnH: +burnH.toFixed(1),
      cold: +cold.toFixed(1),
      hot: +hot.toFixed(1),
      roomM2,
      scentData,
      issues,
      bom,
      price,
      dominantNotes,
    };
  }, [waxType, blend, totalLoad, jarType, wick, wax, db.materials]);

  const fams = ["ALL", ...new Set(FRAGS.map((f) => f.family))];
  const shownFrags = famFilter === "ALL" ? FRAGS : FRAGS.filter((f) => f.family === famFilter);
  const toggleFrag = (id) =>
    setBlend((b) => {
      const nb = { ...b };
      if (nb[id] !== undefined) delete nb[id];
      else if (Object.keys(nb).length < 4) nb[id] = 3;
      return nb;
    });

  const ttStyle = { background: T.card, border: `1px solid ${T.line}`, borderRadius: 0, fontSize: 11, fontFamily: "'Josefin Sans',sans-serif", color: T.text };

  const confirmBuy = (who) => {
    let customer = db.customers.find((c) => c.phone === who.phone && who.phone);
    let customers = db.customers,
      nextCustNum = db.nextCustNum;
    if (!customer) {
      customer = { id: `c${nextCustNum}`, name: who.name, phone: who.phone || "", note: "", fav: null };
      customers = [...customers, customer];
      nextCustNum += 1;
    }
    const fragNames = Object.keys(blend)
      .map((id) => FRAGS.find((f) => f.id === id)?.name)
      .join(" + ");
    const jc = JAR_COLORS.find(c => c.id === jarColor)?.name || "";
    const itemName = `Nến tự thiết kế (${fragNames})` + (engraving ? ` - Khắc: "${engraving}"` : ``) + ` - Lọ ${jc}`;
    const item = {
      type: "custom",
      id: `sim-${Date.now()}`,
      name: itemName,
      emoji: jarType.emoji,
      qty: 1,
      price: calc.price,
      bom: calc.bom,
      jarColor,
      engraving,
    };
    const order = {
      id: `DH-${String(db.nextOrderNum).padStart(3, "0")}`,
      customerId: customer.id,
      items: [item],
      status: "new",
      created: new Date().toISOString().slice(0, 10),
      deducted: false,
    };
    setDb((d) => ({ ...d, customers, orders: [...d.orders, order], nextOrderNum: d.nextOrderNum + 1, nextCustNum }));
    setBuyOpen(false);
    showToast(`${who.name} — Order ${order.id} confirmed.`);
  };

  return (
    <div>
      <div style={{ ...TYPE.eyebrow, color: T.muted, marginBottom: 8 }}>SOLACE ATELIER</div>
      <div style={{ fontSize: 24, fontFamily: "'Josefin Sans',sans-serif", fontWeight: 600, color: T.text, marginBottom: 8 }}>Mô phỏng pha chế nến</div>
      <div style={{ fontSize: 12, fontFamily: "'Josefin Sans',sans-serif", fontWeight: 300, color: T.muted, marginBottom: 28 }}>
        Compose your candle at the SOLACE Atelier
      </div>

      <div style={{ display: "flex", alignItems: "center", marginBottom: 32 }}>
        {SIM_STEPS.map((s, i) => {
          const active = i === step,
            done = i < step,
            reachable = i <= maxReached;
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", flex: i < SIM_STEPS.length - 1 ? 1 : "0 0 auto" }}>
              <button
                onClick={() => reachable && setStep(i)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  border: "none",
                  background: "none",
                  cursor: reachable ? "pointer" : "default",
                  padding: 0,
                  flexShrink: 0,
                }}
              >
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: "50%",
                    border: `1px solid ${done ? T.gold : active ? T.text : T.line}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 9,
                    fontFamily: "'Josefin Sans',sans-serif",
                    letterSpacing: "0.05em",
                    background: done ? T.gold : "transparent",
                    color: done ? T.dark : active ? T.text : T.muted,
                    flexShrink: 0,
                  }}
                >
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div
                  style={{
                    ...TYPE.eyebrow,
                    color: active ? T.text : done ? T.goldDeep : T.muted,
                  }}
                >
                  {s.label}
                </div>
              </button>
              {i < SIM_STEPS.length - 1 && <div style={{ flex: 1, height: 1, background: i < step ? T.gold : T.lineHair, margin: "0 10px" }} />}
            </div>
          );
        })}
      </div>

      {step === 0 && (
        <Card>
          <div style={{ ...TYPE.eyebrow, color: T.goldDeep, marginBottom: 10 }}>STEP 01</div>
          <div style={{ fontSize: 20, fontFamily: "'Cinzel',serif", fontWeight: 400, color: T.text, marginBottom: 6 }}>Choose Your Vessel</div>
          <div style={{ fontSize: 11.5, fontFamily: "'Josefin Sans',sans-serif", fontWeight: 300, color: T.muted, marginBottom: 20 }}>
            10 vessel forms, each with a distinct character
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))", gap: 10 }}>
            {JAR_TYPES.map((jt2) => {
              const active = jarTypeId === jt2.id;
              return (
                <button
                  key={jt2.id}
                  onClick={() => setJarTypeId(jt2.id)}
                  style={{
                    padding: "12px 6px",
                    borderRadius: 0,
                    cursor: "pointer",
                    textAlign: "center",
                    border: `1px solid ${active ? T.gold : T.line}`,
                    background: active ? T.goldLight : "transparent",
                    fontFamily: "inherit",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "center" }}>
                    <JarCandle jarTypeId={jt2.id} rgb={WAX[waxType].base} lit={false} size={56} />
                  </div>
                  <div style={{ fontSize: 9.5, fontFamily: "'Josefin Sans',sans-serif", fontWeight: 300, letterSpacing: "0.04em", marginTop: 6, color: active ? T.text : T.muted }}>
                    {jt2.name}
                  </div>
                </button>
              );
            })}
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 20 }}>
            <Btn variant="primary" onClick={() => setStep(1)}>
              Next →
            </Btn>
          </div>
        </Card>
      )}

      {step === 1 && (
        <Card>
          <div style={{ ...TYPE.eyebrow, color: T.goldDeep, marginBottom: 10 }}>STEP 02</div>
          <div style={{ fontSize: 20, fontFamily: "'Cinzel',serif", fontWeight: 400, color: T.text, marginBottom: 6 }}>Select Your Wax</div>
          <div style={{ fontSize: 11.5, fontFamily: "'Josefin Sans',sans-serif", fontWeight: 300, color: T.muted, marginBottom: 20 }}>Mỗi loại sáp cho cảm giác khác nhau</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {Object.entries(WAX).map(([k, w]) => {
              const active = waxType === k;
              return (
                <button
                  key={k}
                  onClick={() => setWaxType(k)}
                  style={{
                    padding: "18px 16px",
                    borderRadius: 0,
                    cursor: "pointer",
                    textAlign: "left",
                    border: `1px solid ${active ? T.gold : T.line}`,
                    background: active ? T.goldLight : "transparent",
                    fontFamily: "inherit",
                  }}
                >
                  <div style={{ fontSize: 15, fontFamily: "'Josefin Sans',sans-serif", fontWeight: 600, color: T.text, marginBottom: 6 }}>{w.name}</div>
                  <div style={{ fontSize: 10.5, fontFamily: "'Josefin Sans',sans-serif", fontWeight: 300, color: T.muted }}>{w.desc}</div>
                </button>
              );
            })}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 20 }}>
            <Btn onClick={() => setStep(0)}>← Back</Btn>
            <Btn variant="primary" onClick={() => setStep(2)}>
              Next →
            </Btn>
          </div>
        </Card>
      )}

      {step === 2 && (
        <Card>
          <div style={{ ...TYPE.eyebrow, color: T.goldDeep, marginBottom: 10 }}>STEP 03</div>
          <div style={{ fontSize: 20, fontFamily: "'Cinzel',serif", fontWeight: 400, color: T.text, marginBottom: 6 }}>Compose Your Scent</div>
          <div style={{ fontSize: 11.5, fontFamily: "'Josefin Sans',sans-serif", fontWeight: 300, color: T.muted, marginBottom: 16 }}>
            Chọn tối đa 4 mùi — tổng nên dưới <b style={{ color: T.goldDeep, fontWeight: 600 }}>{wax.loadMax}%</b>
          </div>
          <div style={{ display: "flex", gap: 20, flexWrap: "wrap", marginBottom: 20, borderBottom: `1px solid ${T.lineHair}` }}>
            {fams.map((f) => (
              <button
                key={f}
                onClick={() => setFam(f)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "'Josefin Sans',sans-serif",
                  fontSize: 10,
                  fontWeight: 300,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: famFilter === f ? T.text : T.muted,
                  paddingBottom: 8,
                  borderBottom: famFilter === f ? `1px solid ${T.text}` : "1px solid transparent",
                }}
              >
                {f}
              </button>
            ))}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 20 }}>
            {shownFrags.map((f) => {
              const sel = blend[f.id] !== undefined;
              return (
                <button
                  key={f.id}
                  onClick={() => toggleFrag(f.id)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "12px 14px",
                    borderRadius: 0,
                    cursor: "pointer",
                    textAlign: "left",
                    fontFamily: "inherit",
                    border: `1px solid ${sel ? T.gold : T.line}`,
                    background: sel ? T.goldLight : "transparent",
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontFamily: "'Josefin Sans',sans-serif", fontWeight: 600, color: T.text }}>{f.name}</div>
                    <div style={{ ...TYPE.eyebrow, color: T.muted, marginTop: 4 }}>{f.family}</div>
                  </div>
                </button>
              );
            })}
          </div>
          {Object.keys(blend).length > 0 && (
            <div style={{ background: T.soft, borderRadius: 0, padding: "16px 18px", marginBottom: 16, border: `1px solid ${T.lineHair}` }}>
              {Object.entries(blend).map(([id, pct]) => {
                const f = FRAGS.find((x) => x.id === id);
                return (
                  <div key={id} style={{ marginBottom: 14 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11.5, fontFamily: "'Josefin Sans',sans-serif", fontWeight: 300, marginBottom: 6 }}>
                      <span>{f.name}</span>
                      <span style={{ fontWeight: 600, color: T.goldDeep }}>{pct}%</span>
                    </div>
                    <input
                      type="range"
                      min={1}
                      max={10}
                      step={0.5}
                      value={pct}
                      onChange={(e) => setBlend((b) => ({ ...b, [id]: +e.target.value }))}
                      style={{ width: "100%", accentColor: T.gold }}
                    />
                  </div>
                );
              })}
              <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 10, borderTop: `1px solid ${T.line}`, fontSize: 11, fontFamily: "'Josefin Sans',sans-serif", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                <span>Fragrance Load</span>
                <span style={{ color: totalLoad > wax.loadMax ? T.redDeep : T.greenDeep }}>
                  {totalLoad}% / {wax.loadMax}%
                </span>
              </div>
            </div>
          )}
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Btn onClick={() => setStep(1)}>← Back</Btn>
            <Btn variant="primary" disabled={totalLoad === 0} onClick={() => setStep(3)}>
              Next →
            </Btn>
          </div>
        </Card>
      )}

      {step === 3 && (
        <Card>
          <div style={{ ...TYPE.eyebrow, color: T.goldDeep, marginBottom: 10 }}>STEP 04</div>
          <div style={{ fontSize: 20, fontFamily: "'Cinzel',serif", fontWeight: 400, color: T.text, marginBottom: 16 }}>Colour Your Candle</div>
          <div style={{ display: "flex", gap: 20, alignItems: "center", flexWrap: "wrap" }}>
            <div style={{ background: T.dark, borderRadius: 0, padding: "20px 24px", display: "flex", justifyContent: "center" }}>
              <JarCandle jarTypeId={jarTypeId} rgb={rgb} lit={false} size={110} />
            </div>
            <div style={{ flex: 1, minWidth: 180 }}>
              <div style={{ ...TYPE.label, color: T.muted, marginBottom: 10 }}>Màu vỏ lọ</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, marginBottom: 20 }}>
                {JAR_COLORS.map((d) => {
                  const active = jarColor === d.id;
                  return (
                    <button
                      key={d.id}
                      onClick={() => setJarColor(d.id)}
                      style={{
                        aspectRatio: "1",
                        borderRadius: 0,
                        cursor: "pointer",
                        border: `1px solid ${active ? T.gold : T.line}`,
                        background: d.hex ?? "transparent",
                        fontFamily: "inherit",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: d.hex === "#2C2C2E" ? "#fff" : T.text,
                      }}
                    >
                      <span style={{ fontSize: 9, fontFamily: "'Josefin Sans',sans-serif", fontWeight: 300, letterSpacing: "0.05em", textTransform: "uppercase" }}>
                        {d.name.split(" ")[0]}
                      </span>
                    </button>
                  );
                })}
              </div>
              <div>
                <div style={{ ...TYPE.label, color: T.muted, marginBottom: 8 }}>Khắc chữ (Tùy chọn)</div>
                <input
                  type="text"
                  placeholder="Ví dụ: Happy Birthday Vy"
                  value={engraving}
                  onChange={(e) => setEngraving(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px 0",
                    border: "none",
                    borderBottom: `1px solid ${T.line}`,
                    fontFamily: "'Josefin Sans',sans-serif",
                    fontSize: 13,
                    fontWeight: 300,
                    background: "transparent",
                    boxSizing: "border-box",
                    outline: "none",
                  }}
                  maxLength={30}
                />
              </div>
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 20 }}>
            <Btn onClick={() => setStep(2)}>← Back</Btn>
            <Btn variant="primary" onClick={() => setStep(4)}>
              Next →
            </Btn>
          </div>
        </Card>
      )}

      {step === 4 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Card>
            <div style={{ ...TYPE.eyebrow, color: T.goldDeep, marginBottom: 10 }}>STEP 05</div>
            <div style={{ fontSize: 20, fontFamily: "'Cinzel',serif", fontWeight: 400, color: T.text, marginBottom: 16 }}>Your Creation</div>
            <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
              <div style={{ background: T.dark, borderRadius: 0, padding: "16px 20px", display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
                <JarCandle jarTypeId={jarTypeId} rgb={rgb} lit={lit} size={100} />
                <Btn small variant={lit ? "gold" : "ghost"} onClick={() => setLit((v) => !v)} style={lit ? {} : { color: `${T.card}88`, borderColor: `${T.card}30` }}>
                  {lit ? "EXTINGUISH" : "IGNITE"}
                </Btn>
              </div>
              <div style={{ flex: 1, minWidth: 180 }}>
                <div style={{ fontSize: 15, fontFamily: "'Cinzel',serif", fontWeight: 400, color: T.text, marginBottom: 6 }}>{jarType.name}</div>
                <div style={{ fontSize: 11, fontFamily: "'Josefin Sans',sans-serif", fontWeight: 300, color: T.muted, marginBottom: 16 }}>
                  Ø{jarType.diam}cm · cao {jarType.height}cm
                </div>
                <div style={{ ...TYPE.label, color: T.muted, marginBottom: 8 }}>Cỡ bấc</div>
                <div style={{ display: "flex", gap: 16, flexWrap: "wrap", borderBottom: `1px solid ${T.lineHair}` }}>
                  {WICKS.map((w) => (
                    <button
                      key={w.id}
                      onClick={() => setWick(w.id)}
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        fontFamily: "'Josefin Sans',sans-serif",
                        fontSize: 10,
                        fontWeight: 300,
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        color: wick === w.id ? T.text : T.muted,
                        paddingBottom: 8,
                        borderBottom: wick === w.id ? `1px solid ${T.gold}` : "1px solid transparent",
                      }}
                    >
                      {w.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
              {[
                ["Sáp", `${calc.waxG}g`],
                ["Tinh dầu", `${calc.fragG}g`],
                ["Cháy", `${calc.burnH}h`],
                ["Phủ phòng", `${calc.roomM2}m²`],
              ].map(([l, v]) => (
                <div key={l} style={{ textAlign: "center", padding: "14px 4px", borderTop: `2px solid ${T.gold}` }}>
                  <div style={{ ...TYPE.stat, color: T.text }}>{v}</div>
                  <div style={{ ...TYPE.eyebrow, color: T.muted, marginTop: 6 }}>{l}</div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 20 }}>
              {[
                ["Cold throw", calc.cold, T.blueDeep],
                ["Hot throw", calc.hot, T.goldDeep],
              ].map(([label, val, color]) => (
                <div key={label} style={{ marginBottom: 12 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10.5, fontFamily: "'Josefin Sans',sans-serif", fontWeight: 300, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 6 }}>
                    <span style={{ color: T.muted }}>{label}</span>
                    <span style={{ fontWeight: 600, color: T.text }}>{val}/10</span>
                  </div>
                  <div style={{ height: 3, background: T.lineHair, overflow: "hidden" }}>
                    <div style={{ width: `${val * 10}%`, height: "100%", background: color }} />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <div style={{ fontSize: 14, fontFamily: "'Josefin Sans',sans-serif", fontWeight: 600, color: T.text, marginBottom: 12 }}>Diễn biến mùi hương</div>
            <ResponsiveContainer width="100%" height={150}>
              <AreaChart data={calc.scentData} margin={{ top: 4, right: 4, left: -26, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={T.lineHair} />
                <XAxis dataKey="t" tick={{ fontSize: 9, fill: T.muted }} interval={2} />
                <YAxis domain={[0, 10]} tick={{ fontSize: 9, fill: T.muted }} />
                <Tooltip contentStyle={ttStyle} />
                <Area type="monotone" dataKey="Nốt cao" stroke={T.blueDeep} fill={T.blue} fillOpacity={0.6} strokeWidth={1.5} />
                <Area type="monotone" dataKey="Nốt giữa" stroke={T.lilacDeep} fill={T.lilac} fillOpacity={0.6} strokeWidth={1.5} />
                <Area type="monotone" dataKey="Nốt trầm" stroke={T.goldDeep} fill={T.goldLight} fillOpacity={0.6} strokeWidth={1.5} />
              </AreaChart>
            </ResponsiveContainer>

            <div style={{ marginTop: 16, fontSize: 11, fontFamily: "'Josefin Sans',sans-serif", fontWeight: 300, color: T.text, lineHeight: 1.8, background: T.soft, padding: "16px 18px", border: `1px solid ${T.lineHair}` }}>
              <div style={{ marginBottom: 10 }}>
                <span style={{ color: T.blueDeep, fontWeight: 600 }}>Nốt cao (Top):</span> Ấn tượng đầu tiên khi vừa đốt nến bật lên hương <b>{calc.dominantNotes.top || "thanh mát"}</b>. Lan tỏa nhanh, rực rỡ nhưng cũng bay hơi nhanh nhất.
              </div>
              <div style={{ marginBottom: 10 }}>
                <span style={{ color: T.lilacDeep, fontWeight: 600 }}>Nốt giữa (Heart):</span> &ldquo;Linh hồn&rdquo; của hũ nến mang đậm hương <b>{calc.dominantNotes.mid || "ngọt ngào"}</b>. Tỏa hương sau 10-20 phút và kéo dài trong suốt quá trình đốt.
              </div>
              <div>
                <span style={{ color: T.goldDeep, fontWeight: 600 }}>Nốt trầm (Base):</span> Dày dặn và ấm áp từ <b>{calc.dominantNotes.base || "gỗ"}</b>. Lưu lại lâu nhất trong không gian ngay cả khi đã tắt nến.
              </div>
            </div>
          </Card>

          {calc.issues.length > 0 && (
            <Card style={{ background: T.amber, border: `1px solid ${T.line}` }}>
              <div style={{ fontSize: 11, fontFamily: "'Josefin Sans',sans-serif", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: T.amberDeep, marginBottom: 10 }}>! Lưu ý</div>
              {calc.issues.map((x, i) => (
                <div key={i} style={{ fontSize: 11.5, fontFamily: "'Josefin Sans',sans-serif", fontWeight: 300, color: T.amberDeep, lineHeight: 1.8 }}>
                  — {x}
                </div>
              ))}
            </Card>
          )}

          <Card style={{ background: T.dark, border: `1px solid ${T.dark}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
              <div>
                <div style={{ ...TYPE.eyebrow, color: T.gold, marginBottom: 8 }}>Thích cây nến này chưa?</div>
                <div style={{ fontSize: 24, fontFamily: "'Cinzel',serif", fontWeight: 400, color: T.card }}>{fmtVND(calc.price)}</div>
                <div style={{ fontSize: 10, fontFamily: "'Josefin Sans',sans-serif", fontWeight: 300, color: `${T.card}88`, marginTop: 4 }}>Giá ước tính theo nguyên liệu thực tế</div>
              </div>
              <Btn variant="gold" onClick={() => setBuyOpen(true)}>
                Commission This Piece
              </Btn>
            </div>
          </Card>

          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Btn onClick={() => setStep(0)}>Thử lại từ đầu</Btn>
            <Btn onClick={() => setStep(3)}>← Trang trí lại</Btn>
          </div>
        </div>
      )}

      {buyOpen && (
        <CheckoutModal
          identity={identity}
          summaryLines={[{ label: `Nến tự thiết kế (${jarType.name})`, amount: calc.price }]}
          total={calc.price}
          onClose={() => setBuyOpen(false)}
          onConfirm={confirmBuy}
        />
      )}
    </div>
  );
}
