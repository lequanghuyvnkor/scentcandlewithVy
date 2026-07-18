import { T } from "../data/theme";
import { LINES, RECIPES } from "../data/recipes";
import { Card, Btn } from "./ui/Primitives";

export function LandingPage({ setView }) {
  return (
    <div style={{ maxWidth: 1040, margin: "0 auto" }}>
      <div
        style={{
          textAlign: "center",
          padding: "36px 20px 44px",
          background: T.card,
          borderRadius: 28,
          border: `1.5px solid ${T.line}`,
          marginBottom: 24,
        }}
      >
        <div style={{ fontSize: 46, marginBottom: 10 }}>🕯️🌸</div>
        <div style={{ fontSize: 26, fontWeight: 700, color: T.pinkDeep, marginBottom: 8 }}>
          Nến thơm thủ công, thiết kế theo cách của bạn
        </div>
        <div style={{ fontSize: 13.5, color: T.muted, maxWidth: 460, margin: "0 auto 22px", lineHeight: 1.7 }}>
          Chọn mùi hương, pha màu, thử 10 kiểu lọ khác nhau — rồi đặt mua chính cây nến bạn vừa tạo ra.
        </div>
        <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
          <Btn primary onClick={() => setView("shop")}>
            🛍️ Khám phá cửa hàng
          </Btn>
          <Btn onClick={() => setView("sim")}>🧪 Thử mô phỏng ngay</Btn>
        </div>
      </div>

      <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 12, textAlign: "center" }}>Các dòng sản phẩm</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12, marginBottom: 28 }}>
        {LINES.map((line) => {
          const items = Object.entries(RECIPES).filter(([, r]) => r.line === line.id);
          return (
            <Card key={line.id} onClick={() => setView("shop")}>
              <div style={{ fontSize: 26, marginBottom: 6 }}>{line.emoji}</div>
              <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>{line.name}</div>
              <div style={{ fontSize: 11.5, color: T.muted }}>{items.map(([, r]) => r.name).join(" · ")}</div>
            </Card>
          );
        })}
      </div>

      <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 12, textAlign: "center" }}>Cách hoạt động</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12, marginBottom: 10 }}>
        {[
          { emoji: "🧈", title: "1. Chọn sáp & mùi", desc: "Pha trộn tối đa 4 mùi hương yêu thích" },
          { emoji: "🫙", title: "2. Chọn kiểu lọ", desc: "10 mẫu lọ thật, mỗi mẫu một cá tính" },
          { emoji: "🎨", title: "3. Xem trước màu", desc: "Preview trực quan trước khi đặt mua" },
          { emoji: "🛒", title: "4. Đặt mua", desc: "Đơn hàng gửi thẳng đến xưởng sản xuất" },
        ].map((s) => (
          <Card key={s.title} style={{ textAlign: "center" }}>
            <div style={{ fontSize: 26 }}>{s.emoji}</div>
            <div style={{ fontSize: 13, fontWeight: 700, marginTop: 6 }}>{s.title}</div>
            <div style={{ fontSize: 11, color: T.muted, marginTop: 3 }}>{s.desc}</div>
          </Card>
        ))}
      </div>
    </div>
  );
}
