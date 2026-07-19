import { useState, useMemo, useEffect } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { T } from "../data/theme";
import { JAR_TYPES, WAX, FRAGS, JAR_COLORS, WICKS } from "../data/recipes";
import { Card, Btn } from "./ui/Primitives";
import { JarCandle } from "./JarCandle";
import { CheckoutModal } from "./CheckoutModal";
import { fmtVND } from "../utils/formatters";

const SIM_STEPS = [
  { emoji: "🫙", label: "Kiểu lọ" },
  { emoji: "🧈", label: "Sáp" },
  { emoji: "🌸", label: "Mùi hương" },
  { emoji: "🎀", label: "Trang trí lọ" },
  { emoji: "✨", label: "Hoàn thiện" },
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
  const [famFilter, setFam] = useState("Tất cả");
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
    if (totalLoad > wax.loadMax) issues.push(`Tổng dầu thơm ${totalLoad}% vượt mức ${wax.loadMax}% của ${wax.name} 💦`);
    if (totalLoad < 4 && totalLoad > 0) issues.push("Dầu thơm hơi ít — mùi sẽ nhẹ lắm đó 🥺");
    if (totalLoad === 0) issues.push("Chưa chọn mùi hương nào hết!");
    if (meltData[3]["Thực tế"] < jarType.diam * 0.6) issues.push("Melt pool nhỏ — thử bấc to hơn nha 🕯️");
    if (burnH < 8) issues.push("Nến cháy khá nhanh với kiểu lọ này");

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

  const fams = ["Tất cả", ...new Set(FRAGS.map((f) => f.family))];
  const shownFrags = famFilter === "Tất cả" ? FRAGS : FRAGS.filter((f) => f.family === famFilter);
  const toggleFrag = (id) =>
    setBlend((b) => {
      const nb = { ...b };
      if (nb[id] !== undefined) delete nb[id];
      else if (Object.keys(nb).length < 4) nb[id] = 3;
      return nb;
    });

  const ttStyle = { background: T.card, border: `1.5px solid ${T.line}`, borderRadius: 12, fontSize: 11, color: T.text };

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
    showToast(`Tuyệt vời ${who.name}! Đơn ${order.id} — cây nến mơ ước của bạn đang được ghi nhận 💗`);
  };

  return (
    <div>
      <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>Mô phỏng pha chế nến 🧪</div>
      <div style={{ fontSize: 12, color: T.muted, marginBottom: 16 }}>Thiết kế cây nến của riêng bạn — xong có thể đặt mua luôn!</div>

      <div style={{ display: "flex", justifyContent: "center", gap: 6, marginBottom: 18, flexWrap: "wrap" }}>
        {SIM_STEPS.map((s, i) => {
          const active = i === step,
            done = i < step,
            reachable = i <= maxReached;
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <button
                onClick={() => reachable && setStep(i)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: active ? "7px 15px" : "7px 11px",
                  borderRadius: 999,
                  border: "none",
                  cursor: reachable ? "pointer" : "default",
                  fontFamily: "inherit",
                  background: active ? T.pink : done ? T.pinkSoft : "#fff",
                  color: active ? "#fff" : done ? T.pinkDeep : "#C9B99A",
                  fontSize: 12.5,
                  fontWeight: 700,
                  boxShadow: active ? "0 3px 10px rgba(143,108,59,0.35)" : "none",
                }}
              >
                <span style={{ fontSize: 14 }}>{done ? "💗" : s.emoji}</span>
                {active && s.label}
              </button>
              {i < SIM_STEPS.length - 1 && <div style={{ width: 12, height: 2.5, borderRadius: 2, background: i < step ? T.pink : T.line }} />}
            </div>
          );
        })}
      </div>

      {step === 0 && (
        <Card>
          <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>Chọn kiểu lọ 🫙</div>
          <div style={{ fontSize: 11.5, color: T.muted, marginBottom: 14 }}>10 mẫu lọ thật — mỗi mẫu một phong cách riêng</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(96px, 1fr))", gap: 10 }}>
            {JAR_TYPES.map((jt2) => {
              const active = jarTypeId === jt2.id;
              return (
                <button
                  key={jt2.id}
                  onClick={() => setJarTypeId(jt2.id)}
                  style={{
                    padding: "10px 6px",
                    borderRadius: 16,
                    cursor: "pointer",
                    textAlign: "center",
                    border: `2.5px solid ${active ? T.pink : T.line}`,
                    background: active ? T.pinkSoft : "#fff",
                    fontFamily: "inherit",
                    boxShadow: active ? "0 3px 12px rgba(143,108,59,0.3)" : "none",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "center" }}>
                    <JarCandle jarTypeId={jt2.id} rgb={WAX[waxType].base} lit={false} size={56} />
                  </div>
                  <div style={{ fontSize: 10.5, fontWeight: 700, marginTop: 4, color: active ? T.pinkDeep : T.text }}>{jt2.name}</div>
                </button>
              );
            })}
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 16 }}>
            <Btn primary onClick={() => setStep(1)}>
              Tiếp theo 🧈
            </Btn>
          </div>
        </Card>
      )}

      {step === 1 && (
        <Card>
          <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>Chọn loại sáp 🧈</div>
          <div style={{ fontSize: 11.5, color: T.muted, marginBottom: 14 }}>Mỗi loại sáp cho cảm giác khác nhau</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {Object.entries(WAX).map(([k, w]) => {
              const active = waxType === k;
              return (
                <button
                  key={k}
                  onClick={() => setWaxType(k)}
                  style={{
                    padding: "16px 14px",
                    borderRadius: 18,
                    cursor: "pointer",
                    textAlign: "left",
                    border: `2.5px solid ${active ? T.pink : T.line}`,
                    background: active ? T.pinkSoft : "#fff",
                    fontFamily: "inherit",
                    boxShadow: active ? "0 3px 12px rgba(143,108,59,0.3)" : "none",
                  }}
                >
                  <div style={{ fontSize: 26, marginBottom: 6 }}>{w.emoji}</div>
                  <div style={{ fontSize: 13.5, fontWeight: 700, color: active ? T.pinkDeep : T.text }}>{w.name}</div>
                  <div style={{ fontSize: 10.5, color: T.muted, marginTop: 3 }}>{w.desc}</div>
                </button>
              );
            })}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 16 }}>
            <Btn onClick={() => setStep(0)}>← Quay lại</Btn>
            <Btn primary onClick={() => setStep(2)}>
              Tiếp theo 🌸
            </Btn>
          </div>
        </Card>
      )}

      {step === 2 && (
        <Card>
          <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>Pha chế mùi hương 🌸</div>
          <div style={{ fontSize: 11.5, color: T.muted, marginBottom: 12 }}>
            Chọn tối đa 4 mùi — tổng nên dưới <b style={{ color: T.pinkDeep }}>{wax.loadMax}%</b>
          </div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12 }}>
            {fams.map((f) => (
              <button
                key={f}
                onClick={() => setFam(f)}
                style={{
                  padding: "7px 13px",
                  borderRadius: 999,
                  cursor: "pointer",
                  fontSize: 12,
                  fontWeight: famFilter === f ? 700 : 500,
                  fontFamily: "inherit",
                  border: `2px solid ${famFilter === f ? T.pink : T.line}`,
                  background: famFilter === f ? T.pinkSoft : "#fff",
                  color: famFilter === f ? T.pinkDeep : T.muted,
                }}
              >
                {f}
              </button>
            ))}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 14 }}>
            {shownFrags.map((f) => {
              const sel = blend[f.id] !== undefined;
              return (
                <button
                  key={f.id}
                  onClick={() => toggleFrag(f.id)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 9,
                    padding: "10px 12px",
                    borderRadius: 16,
                    cursor: "pointer",
                    textAlign: "left",
                    fontFamily: "inherit",
                    border: `2.5px solid ${sel ? T.pink : T.line}`,
                    background: sel ? T.pinkSoft : "#fff",
                  }}
                >
                  <span style={{ fontSize: 20 }}>{f.emoji}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12.5, fontWeight: 700, color: sel ? T.pinkDeep : T.text }}>{f.name}</div>
                    <div style={{ fontSize: 10, color: T.muted }}>{f.family}</div>
                  </div>
                  {sel && <span style={{ fontSize: 13 }}>💗</span>}
                </button>
              );
            })}
          </div>
          {Object.keys(blend).length > 0 && (
            <div style={{ background: T.soft, borderRadius: 16, padding: "12px 14px", marginBottom: 12 }}>
              {Object.entries(blend).map(([id, pct]) => {
                const f = FRAGS.find((x) => x.id === id);
                return (
                  <div key={id} style={{ marginBottom: 10 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11.5, marginBottom: 4 }}>
                      <span>
                        {f.emoji} {f.name}
                      </span>
                      <span style={{ fontWeight: 700, color: T.pinkDeep }}>{pct}%</span>
                    </div>
                    <input
                      type="range"
                      min={1}
                      max={10}
                      step={0.5}
                      value={pct}
                      onChange={(e) => setBlend((b) => ({ ...b, [id]: +e.target.value }))}
                      style={{ width: "100%", accentColor: T.pink }}
                    />
                  </div>
                );
              })}
              <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 8, borderTop: `1.5px dashed ${T.line}`, fontSize: 12.5, fontWeight: 700 }}>
                <span>Tổng load</span>
                <span style={{ color: totalLoad > wax.loadMax ? T.redDeep : T.greenDeep }}>
                  {totalLoad}% / {wax.loadMax}%
                </span>
              </div>
            </div>
          )}
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Btn onClick={() => setStep(1)}>← Quay lại</Btn>
            <Btn primary disabled={totalLoad === 0} onClick={() => setStep(3)}>
              Trang trí lọ 🎀
            </Btn>
          </div>
        </Card>
      )}

      {step === 3 && (
        <Card>
          <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>Trang trí lọ nến 🎀</div>
          <div style={{ display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
            <div style={{ background: T.soft, borderRadius: 20, padding: "12px 16px", display: "flex", justifyContent: "center" }}>
              <JarCandle jarTypeId={jarTypeId} rgb={rgb} lit={false} size={110} />
            </div>
            <div style={{ flex: 1, minWidth: 180 }}>
              <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 8 }}>Màu vỏ lọ</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 6, marginBottom: 12 }}>
                {JAR_COLORS.map((d) => {
                  const active = jarColor === d.id;
                  return (
                    <button
                      key={d.id}
                      onClick={() => setJarColor(d.id)}
                      style={{
                        aspectRatio: "1",
                        borderRadius: 12,
                        cursor: "pointer",
                        border: `3px solid ${active ? T.pinkDeep : T.line}`,
                        background: d.hex ?? "#fff",
                        fontFamily: "inherit",
                        fontSize: 12,
                        transform: active ? "scale(1.08)" : "scale(1)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: d.hex === "#2C2C2E" ? "#fff" : "#000"
                      }}
                    >
                      <span style={{ fontSize: 10, fontWeight: 700 }}>{d.name.split(" ")[0]}</span>
                    </button>
                  );
                })}
              </div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 4 }}>Khắc chữ (Tùy chọn)</div>
                <input
                  type="text"
                  placeholder="Ví dụ: Happy Birthday Vy"
                  value={engraving}
                  onChange={(e) => setEngraving(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    borderRadius: 12,
                    border: `1.5px solid ${T.line}`,
                    fontFamily: "inherit",
                    fontSize: 12,
                    background: "#fff",
                    boxSizing: "border-box"
                  }}
                  maxLength={30}
                />
              </div>
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 16 }}>
            <Btn onClick={() => setStep(2)}>← Quay lại</Btn>
            <Btn primary onClick={() => setStep(4)}>
              Hoàn thiện ✨
            </Btn>
          </div>
        </Card>
      )}

      {step === 4 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <Card>
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
              <div style={{ background: T.soft, borderRadius: 20, padding: "10px 14px", display: "flex", flexDirection: "column", alignItems: "center" }}>
                <JarCandle jarTypeId={jarTypeId} rgb={rgb} lit={lit} size={100} />
                <button
                  onClick={() => setLit((v) => !v)}
                  style={{
                    marginTop: 6,
                    padding: "5px 14px",
                    borderRadius: 999,
                    cursor: "pointer",
                    border: "none",
                    fontFamily: "inherit",
                    fontSize: 11.5,
                    fontWeight: 700,
                    background: lit ? T.yellow : "#fff",
                    color: lit ? "#7A5A1E" : T.muted,
                    boxShadow: lit ? "0 2px 8px rgba(240,218,156,0.6)" : `inset 0 0 0 2px ${T.line}`,
                  }}
                >
                  {lit ? "🔥 Đang cháy" : "🕯️ Đốt thử"}
                </button>
              </div>
              <div style={{ flex: 1, minWidth: 180 }}>
                <div style={{ fontSize: 12.5, fontWeight: 700, marginBottom: 6 }}>{jarType.name}</div>
                <div style={{ fontSize: 11, color: T.muted, marginBottom: 10 }}>
                  Ø{jarType.diam}cm · cao {jarType.height}cm
                </div>
                <div style={{ fontSize: 11.5, color: T.muted, marginBottom: 6 }}>Cỡ bấc</div>
                <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                  {WICKS.map((w) => (
                    <button
                      key={w.id}
                      onClick={() => setWick(w.id)}
                      style={{
                        padding: "6px 12px",
                        borderRadius: 999,
                        cursor: "pointer",
                        fontSize: 11.5,
                        fontWeight: wick === w.id ? 700 : 500,
                        fontFamily: "inherit",
                        border: `2px solid ${wick === w.id ? T.pink : T.line}`,
                        background: wick === w.id ? T.pinkSoft : "#fff",
                        color: wick === w.id ? T.pinkDeep : T.muted,
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
                ["🧈", "Sáp", `${calc.waxG}g`],
                ["💧", "Tinh dầu", `${calc.fragG}g`],
                ["⏰", "Cháy", `${calc.burnH}h`],
                ["🏠", "Phủ phòng", `${calc.roomM2}m²`],
              ].map(([e, l, v]) => (
                <div key={l} style={{ background: T.soft, borderRadius: 14, padding: "10px 6px", textAlign: "center" }}>
                  <div style={{ fontSize: 17 }}>{e}</div>
                  <div style={{ fontSize: 14, fontWeight: 700, marginTop: 2 }}>{v}</div>
                  <div style={{ fontSize: 10, color: T.muted }}>{l}</div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 12 }}>
              {[
                ["❄️ Cold throw", calc.cold, T.blue],
                ["🔥 Hot throw", calc.hot, "#E0AA5E"],
              ].map(([label, val, color]) => (
                <div key={label} style={{ marginBottom: 8 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11.5, marginBottom: 4 }}>
                    <span style={{ color: T.muted }}>{label}</span>
                    <span style={{ fontWeight: 700 }}>{val}/10</span>
                  </div>
                  <div style={{ height: 7, background: T.pinkSoft, borderRadius: 99, overflow: "hidden" }}>
                    <div style={{ width: `${val * 10}%`, height: "100%", background: color, borderRadius: 99 }} />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 8 }}>Diễn biến mùi hương 🌸</div>
            <ResponsiveContainer width="100%" height={150}>
              <AreaChart data={calc.scentData} margin={{ top: 4, right: 4, left: -26, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={T.line} />
                <XAxis dataKey="t" tick={{ fontSize: 9, fill: T.muted }} interval={2} />
                <YAxis domain={[0, 10]} tick={{ fontSize: 9, fill: T.muted }} />
                <Tooltip contentStyle={ttStyle} />
                <Area type="monotone" dataKey="Nốt cao" stroke={T.blueDeep} fill={T.blue} fillOpacity={0.4} strokeWidth={2} />
                <Area type="monotone" dataKey="Nốt giữa" stroke={T.lilacDeep} fill={T.lilac} fillOpacity={0.4} strokeWidth={2} />
                <Area type="monotone" dataKey="Nốt trầm" stroke="#B9862A" fill="#E9CB86" fillOpacity={0.4} strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
            
            <div style={{ marginTop: 12, fontSize: 11, color: T.text, lineHeight: 1.6, background: T.soft, padding: "12px", borderRadius: 12, border: `1px solid ${T.line}` }}>
              <div style={{ marginBottom: 6 }}>
                <span style={{ color: T.blueDeep, fontWeight: 700 }}>🔵 Nốt cao (Top):</span> Ấn tượng đầu tiên khi vừa đốt nến bật lên hương <b>{calc.dominantNotes.top || "thanh mát"}</b>. Lan tỏa nhanh, rực rỡ nhưng cũng bay hơi nhanh nhất.
              </div>
              <div style={{ marginBottom: 6 }}>
                <span style={{ color: T.lilacDeep, fontWeight: 700 }}>🟣 Nốt giữa (Heart):</span> &ldquo;Linh hồn&rdquo; của hũ nến mang đậm hương <b>{calc.dominantNotes.mid || "ngọt ngào"}</b>. Tỏa hương sau 10-20 phút và kéo dài trong suốt quá trình đốt.
              </div>
              <div>
                <span style={{ color: "#B9862A", fontWeight: 700 }}>🟤 Nốt trầm (Base):</span> Dày dặn và ấm áp từ <b>{calc.dominantNotes.base || "gỗ"}</b>. Lưu lại lâu nhất trong không gian ngay cả khi đã tắt nến.
              </div>
            </div>
          </Card>

          {calc.issues.length > 0 && (
            <Card style={{ background: "#FBF0DC", border: "1.5px solid #E9D19E" }}>
              <div style={{ fontSize: 12.5, fontWeight: 700, color: "#9C7526", marginBottom: 6 }}>💡 Mẹo nhỏ</div>
              {calc.issues.map((x, i) => (
                <div key={i} style={{ fontSize: 11.5, color: "#8A6829", lineHeight: 1.7 }}>
                  • {x}
                </div>
              ))}
            </Card>
          )}

          <Card style={{ background: T.pinkSoft, border: `1.5px solid ${T.pink}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: T.pinkDeep }}>Thích cây nến này chưa? 🥰</div>
                <div style={{ fontSize: 20, fontWeight: 700, marginTop: 4 }}>{fmtVND(calc.price)}</div>
                <div style={{ fontSize: 10.5, color: T.muted }}>Giá ước tính theo nguyên liệu thực tế</div>
              </div>
              <Btn primary onClick={() => setBuyOpen(true)}>
                🛒 Đặt mua cây nến này
              </Btn>
            </div>
          </Card>

          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Btn onClick={() => setStep(0)}>🔄 Thử lại từ đầu</Btn>
            <Btn onClick={() => setStep(3)}>← Trang trí lại</Btn>
          </div>
        </div>
      )}

      {buyOpen && (
        <CheckoutModal
          identity={identity}
          summaryLines={[{ label: `${jarType.emoji} Nến tự thiết kế (${jarType.name})`, amount: calc.price }]}
          total={calc.price}
          onClose={() => setBuyOpen(false)}
          onConfirm={confirmBuy}
        />
      )}
    </div>
  );
}
