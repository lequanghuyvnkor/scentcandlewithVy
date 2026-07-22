import { T, TYPE } from "../data/theme";
import { LINES, RECIPES } from "../data/recipes";
import { Card, Btn } from "./ui/Primitives";

const STEPS = [
  { num: "I", title: "Chọn sáp & mùi", desc: "Pha trộn tối đa 4 mùi hương yêu thích" },
  { num: "II", title: "Chọn kiểu lọ", desc: "10 mẫu lọ thật, mỗi mẫu một cá tính" },
  { num: "III", title: "Xem trước màu", desc: "Preview trực quan trước khi đặt mua" },
  { num: "IV", title: "Đặt mua", desc: "Đơn hàng gửi thẳng đến xưởng sản xuất" },
];

export function LandingPage({ setView }) {
  return (
    <div style={{ maxWidth: 1040, margin: "0 auto" }}>
      <div
        style={{
          textAlign: "center",
          padding: "72px 40px 80px",
          background: T.dark,
          borderRadius: 2,
          marginBottom: 48,
        }}
      >
        <div style={{ ...TYPE.eyebrow, color: T.gold, marginBottom: 24 }}>SAIGON · EST. 2026</div>
        <div style={{ width: 48, height: 1, background: T.gold, margin: "0 auto 32px" }} />
        <div style={{ ...TYPE.hero, color: T.card, marginBottom: 24 }}>A Quiet Moment</div>
        <div
          style={{
            fontFamily: "'Cinzel',serif",
            fontSize: 13,
            fontStyle: "italic",
            fontWeight: 400,
            letterSpacing: "0.08em",
            color: T.gold,
            marginBottom: 28,
            opacity: 0.85,
          }}
        >
          "Khoảng lặng giữa ngày dài"
        </div>
        <div style={{ ...TYPE.body, fontSize: 13, color: `${T.card}70`, maxWidth: 380, margin: "0 auto 40px" }}>
          Nến bespoke được pha chế từng mẻ nhỏ tại Sài Gòn — từ nguyên liệu thuần tự nhiên, thiết kế theo cách của bạn.
        </div>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <Btn variant="gold" onClick={() => setView("shop")}>
            Explore Collection
          </Btn>
          <Btn variant="ghost" onClick={() => setView("sim")} style={{ color: `${T.card}88`, borderColor: `${T.card}30` }}>
            Atelier
          </Btn>
        </div>
      </div>

      <div style={{ ...TYPE.eyebrow, color: T.muted, textAlign: "center", marginBottom: 12 }}>OUR COLLECTIONS</div>
      <div style={{ ...TYPE.title, color: T.text, textAlign: "center", marginBottom: 32 }}>The Lines</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 48 }}>
        {LINES.map((line) => {
          const items = Object.entries(RECIPES).filter(([, r]) => r.line === line.id);
          return (
            <Card key={line.id} onClick={() => setView("shop")}>
              <div style={{ ...TYPE.eyebrow, color: T.muted, marginBottom: 16 }}>
                {line.label} / {line.name.toUpperCase()}
              </div>
              <div style={{ fontSize: 18, fontFamily: "'Cinzel',serif", fontWeight: 400, color: T.text, marginBottom: 8 }}>{line.name}</div>
              <div style={{ fontSize: 11, fontFamily: "'Josefin Sans',sans-serif", fontWeight: 300, color: T.muted, marginBottom: 14 }}>{line.tagline}</div>
              <div style={{ fontSize: 10.5, fontFamily: "'Josefin Sans',sans-serif", fontWeight: 300, color: T.muted, lineHeight: 1.7 }}>
                {items.map(([, r]) => r.name).join(" · ")}
              </div>
              <div style={{ textAlign: "right", marginTop: 14, color: T.gold, fontSize: 13 }}>→</div>
            </Card>
          );
        })}
      </div>

      <div style={{ ...TYPE.eyebrow, color: T.muted, textAlign: "center", marginBottom: 12 }}>HOW IT WORKS</div>
      <div style={{ ...TYPE.title, color: T.text, textAlign: "center", marginBottom: 32 }}>The Process</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16 }}>
        {STEPS.map((s) => (
          <Card key={s.num} style={{ textAlign: "center" }}>
            <div style={{ ...TYPE.eyebrow, color: T.gold, marginBottom: 16 }}>{s.num}</div>
            <div style={{ fontSize: 13, fontFamily: "'Josefin Sans',sans-serif", fontWeight: 400, color: T.text, marginBottom: 6 }}>{s.title}</div>
            <div style={{ fontSize: 11, fontFamily: "'Josefin Sans',sans-serif", fontWeight: 300, color: T.muted }}>{s.desc}</div>
          </Card>
        ))}
      </div>
    </div>
  );
}
