import { useState, useMemo } from "react";
import { THEME } from "../data/theme";
import { Card, Button, Input, Badge, Modal } from "./ui/Primitives";

const WAX = {
  soy: {
    name: "Sáp đậu nành",
    emoji: "🌱",
    density: 0.86,
    burnRate: 7.0,
    meltPoint: 54,
    loadMax: 12,
    hotF: 0.85,
    coldF: 0.9,
    base: [255, 250, 235],
    desc: "Cháy sạch, giữ mùi tốt",
  },
  paraffin: {
    name: "Paraffin",
    emoji: "🕯️",
    density: 0.9,
    burnRate: 8.5,
    meltPoint: 58,
    loadMax: 10,
    hotF: 0.95,
    coldF: 0.8,
    base: [255, 255, 255],
    desc: "Hot throw mạnh nhất",
  },
  beeswax: {
    name: "Sáp ong",
    emoji: "🐝",
    density: 0.96,
    burnRate: 5.5,
    meltPoint: 63,
    loadMax: 8,
    hotF: 0.78,
    coldF: 0.95,
    base: [242, 214, 138],
    desc: "Tự nhiên, cháy lâu",
  },
  coconut: {
    name: "Sáp dừa",
    emoji: "🥥",
    density: 0.85,
    burnRate: 7.5,
    meltPoint: 45,
    loadMax: 14,
    hotF: 0.92,
    coldF: 0.88,
    base: [255, 253, 248],
    desc: "Mềm mịn, ôm mùi",
  },
};

export function CandleStudio({ onSave }) {
  const [step, setStep] = useState(0);
  const [waxType, setWaxType] = useState("soy");
  const [diam, setDiam] = useState(8);
  const [height, setHeight] = useState(10);
  const [recipeName, setRecipeName] = useState("");
  const [saveModal, setSaveModal] = useState(false);

  return (
    <div style={{ fontFamily: "'Quicksand', sans-serif" }}>
      <div style={{ textAlign: "center", marginBottom: 20 }}>
        <div style={{ fontSize: 22, fontWeight: 700, color: THEME.pinkDeep }}>
          🕯️ Candle Studio
        </div>
      </div>

      {/* Step indicator */}
      <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 20 }}>
        {["Sáp", "Mùi", "Màu", "Lưu"].map((label, i) => (
          <button
            key={i}
            onClick={() => i <= step && setStep(i)}
            style={{
              padding: "8px 16px",
              borderRadius: 999,
              border: "none",
              cursor: i <= step ? "pointer" : "default",
              fontFamily: "inherit",
              fontSize: 12,
              fontWeight: 700,
              background: i === step ? THEME.pink : i < step ? THEME.pinkSoft : "#fff",
              color: i === step ? "#fff" : THEME.pinkDeep,
              boxShadow: i === step ? "0 3px 10px rgba(246,168,192,0.4)" : "none",
            }}
          >
            {i < step ? "✓" : i + 1}. {label}
          </button>
        ))}
      </div>

      {/* Step content */}
      <Card style={{ marginBottom: 12 }}>
        {step === 0 && (
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>
              Chọn loại sáp 🧈
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {Object.entries(WAX).map(([k, w]) => (
                <button
                  key={k}
                  onClick={() => setWaxType(k)}
                  style={{
                    padding: "14px",
                    borderRadius: 14,
                    border: `2px solid ${waxType === k ? THEME.pink : THEME.line}`,
                    background: waxType === k ? THEME.pinkSoft : "#fff",
                    cursor: "pointer",
                    fontFamily: "inherit",
                    textAlign: "left",
                  }}
                >
                  <div style={{ fontSize: 24, marginBottom: 4 }}>{w.emoji}</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: THEME.text }}>
                    {w.name}
                  </div>
                  <div style={{ fontSize: 10, color: THEME.muted }}>{w.desc}</div>
                </button>
              ))}
            </div>
            <Button
              primary
              onClick={() => setStep(1)}
              style={{ width: "100%", marginTop: 14 }}
            >
              Tiếp theo →
            </Button>
          </div>
        )}

        {step === 1 && (
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>
              Kích thước lọ
            </div>
            <Input
              label="Đường kính (cm)"
              type="number"
              value={diam}
              onChange={setDiam}
            />
            <Input
              label="Chiều cao (cm)"
              type="number"
              value={height}
              onChange={setHeight}
            />
            <div style={{ display: "flex", gap: 8 }}>
              <Button onClick={() => setStep(0)}>← Quay lại</Button>
              <Button primary onClick={() => setStep(2)} style={{ flex: 1 }}>
                Tiếp theo →
              </Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>
              Đặt tên công thức
            </div>
            <Input
              label="Tên công thức"
              value={recipeName}
              onChange={setRecipeName}
              placeholder="VD: Lavender Dream"
            />
            <div style={{ display: "flex", gap: 8 }}>
              <Button onClick={() => setStep(1)}>← Quay lại</Button>
              <Button
                primary
                disabled={!recipeName.trim()}
                onClick={() => setSaveModal(true)}
                style={{ flex: 1 }}
              >
                Lưu công thức 💾
              </Button>
            </div>
          </div>
        )}
      </Card>

      {saveModal && (
        <Modal
          title="Lưu công thức?"
          onClose={() => setSaveModal(false)}
        >
          <div style={{ fontSize: 13, color: THEME.muted, marginBottom: 16 }}>
            <div>📝 {recipeName}</div>
            <div>🧈 {WAX[waxType].name}</div>
            <div>🫙 {diam}×{height}cm</div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <Button onClick={() => setSaveModal(false)} style={{ flex: 1 }}>
              Hủy
            </Button>
            <Button
              primary
              onClick={() => {
                if (onSave)
                  onSave({
                    name: recipeName,
                    waxType,
                    diam,
                    height,
                  });
                setSaveModal(false);
              }}
              style={{ flex: 1 }}
            >
              Xác nhận ✓
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
}
