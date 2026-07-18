import { useState } from "react";
import { T } from "../data/theme";
import { RECIPES, JAR_TYPES, WAX, LINES } from "../data/recipes";
import { Card, Btn } from "./ui/Primitives";
import { JarCandle } from "./JarCandle";
import { CheckoutModal } from "./CheckoutModal";
import { fmtVND } from "../utils/formatters";

export function ShopTab({ db, setDb, identity, showToast }) {
  const [cart, setCart] = useState({});
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [lineFilter, setLineFilter] = useState("Tất cả");

  const cartItems = Object.entries(cart).filter(([, q]) => q > 0);
  const cartTotal = cartItems.reduce((s, [pid, qty]) => s + (db.products.find((p) => p.id === pid)?.price ?? 0) * qty, 0);
  const addQty = (pid, delta) => setCart((c) => ({ ...c, [pid]: Math.max(0, (c[pid] ?? 0) + delta) }));

  const shownProducts = db.products.filter((p) => p.active && (lineFilter === "Tất cả" || RECIPES[p.id]?.line === lineFilter));

  const placeOrder = (who) => {
    let customer = db.customers.find((c) => c.phone === who.phone && who.phone);
    let customers = db.customers,
      nextCustNum = db.nextCustNum;
    if (!customer) {
      customer = { id: `c${nextCustNum}`, name: who.name, phone: who.phone || "", note: "", fav: null };
      customers = [...customers, customer];
      nextCustNum += 1;
    }
    const order = {
      id: `DH-${String(db.nextOrderNum).padStart(3, "0")}`,
      customerId: customer.id,
      items: cartItems.map(([pid, qty]) => ({ type: "catalog", productId: pid, qty })),
      status: "new",
      created: new Date().toISOString().slice(0, 10),
      deducted: false,
    };
    setDb((d) => ({ ...d, customers, orders: [...d.orders, order], nextOrderNum: d.nextOrderNum + 1, nextCustNum }));
    setCart({});
    setCheckoutOpen(false);
    showToast(`Cảm ơn ${who.name}! Đơn ${order.id} đã được ghi nhận 💌`);
  };

  return (
    <div>
      <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>Cửa hàng nến thơm 🛍️</div>
      <div style={{ fontSize: 12, color: T.muted, marginBottom: 14 }}>8 công thức, 4 dòng sản phẩm — chọn cây nến bạn thích nhé 🌸</div>

      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 14 }}>
        {["Tất cả", ...LINES.map((l) => l.id)].map((id) => {
          const line = LINES.find((l) => l.id === id);
          const active = lineFilter === id;
          return (
            <button
              key={id}
              onClick={() => setLineFilter(id)}
              style={{
                padding: "7px 14px",
                borderRadius: 999,
                cursor: "pointer",
                fontSize: 12,
                fontWeight: active ? 700 : 500,
                fontFamily: "inherit",
                border: `2px solid ${active ? T.pink : T.line}`,
                background: active ? T.pinkSoft : "#fff",
                color: active ? T.pinkDeep : T.muted,
              }}
            >
              {line ? `${line.emoji} ${line.name}` : "🌼 Tất cả"}
            </button>
          );
        })}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12, marginBottom: 90 }}>
        {shownProducts.map((p) => {
          const r = RECIPES[p.id];
          const qty = cart[p.id] ?? 0;
          return (
            <Card key={p.id}>
              <div style={{ display: "flex", justifyContent: "center", marginBottom: 8 }}>
                <JarCandle jarTypeId={r.jarType} rgb={WAX[r.wax].base} lit={false} size={78} />
              </div>
              <div style={{ fontSize: 14, fontWeight: 700 }}>
                {r.emoji} {r.name}
              </div>
              <div style={{ fontSize: 10.5, color: T.muted, marginBottom: 8 }}>
                {JAR_TYPES.find((j) => j.id === r.jarType)?.name} · {r.frags.map(([n]) => n).join(" + ")}
              </div>
              <div style={{ fontSize: 16, fontWeight: 700, color: T.pinkDeep, marginBottom: 10 }}>{fmtVND(p.price)}</div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
                <Btn small onClick={() => addQty(p.id, -1)} style={{ padding: "5px 13px" }}>
                  −
                </Btn>
                <span style={{ fontSize: 14, fontWeight: 700, minWidth: 22, textAlign: "center" }}>{qty}</span>
                <Btn small primary onClick={() => addQty(p.id, 1)} style={{ padding: "5px 13px" }}>
                  +
                </Btn>
              </div>
            </Card>
          );
        })}
      </div>

      {cartItems.length > 0 && (
        <div
          style={{
            position: "fixed",
            bottom: 18,
            left: "50%",
            transform: "translateX(-50%)",
            background: T.pink,
            borderRadius: 999,
            padding: "12px 20px",
            display: "flex",
            alignItems: "center",
            gap: 14,
            boxShadow: "0 6px 24px rgba(143,108,59,0.4)",
            zIndex: 40,
            maxWidth: "90%",
          }}
        >
          <span style={{ color: "#fff", fontSize: 13, fontWeight: 700 }}>
            🛒 {cartItems.reduce((s, [, q]) => s + q, 0)} cây · {fmtVND(cartTotal)}
          </span>
          <button
            onClick={() => setCheckoutOpen(true)}
            style={{
              padding: "7px 16px",
              borderRadius: 999,
              border: "none",
              cursor: "pointer",
              background: "#fff",
              color: T.pinkDeep,
              fontWeight: 700,
              fontSize: 12.5,
              fontFamily: "inherit",
            }}
          >
            Đặt hàng →
          </button>
        </div>
      )}

      {checkoutOpen && (
        <CheckoutModal
          identity={identity}
          summaryLines={cartItems.map(([pid, qty]) => {
            const r = RECIPES[pid],
              p = db.products.find((x) => x.id === pid);
            return { label: `${r.emoji} ${r.name} ×${qty}`, amount: p.price * qty };
          })}
          total={cartTotal}
          onClose={() => setCheckoutOpen(false)}
          onConfirm={placeOrder}
        />
      )}
    </div>
  );
}
