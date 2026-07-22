import { useState } from "react";
import { T, TYPE } from "../data/theme";
import { RECIPES, JAR_TYPES, WAX, LINES } from "../data/recipes";
import { Card, Btn } from "./ui/Primitives";
import { JarCandle } from "./JarCandle";
import { CheckoutModal } from "./CheckoutModal";
import { fmtVND } from "../utils/formatters";

export function ShopTab({ db, setDb, identity, showToast }) {
  const [cart, setCart] = useState({});
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [lineFilter, setLineFilter] = useState("ALL");

  const cartItems = Object.entries(cart).filter(([, q]) => q > 0);
  const cartTotal = cartItems.reduce((s, [pid, qty]) => s + (db.products.find((p) => p.id === pid)?.price ?? 0) * qty, 0);
  const addQty = (pid, delta) => setCart((c) => ({ ...c, [pid]: Math.max(0, (c[pid] ?? 0) + delta) }));

  const shownProducts = db.products.filter((p) => p.active && (lineFilter === "ALL" || RECIPES[p.id]?.line === lineFilter));

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
    showToast(`${who.name} — Order ${order.id} confirmed.`);
  };

  return (
    <div>
      <div style={{ ...TYPE.eyebrow, color: T.muted, marginBottom: 8 }}>SOLACE COLLECTION</div>
      <div style={{ fontSize: 24, fontFamily: "'Cinzel',serif", fontWeight: 400, color: T.text, marginBottom: 8 }}>Cửa hàng nến thơm</div>
      <div style={{ fontSize: 12, fontFamily: "'Josefin Sans',sans-serif", fontWeight: 300, color: T.muted, marginBottom: 24 }}>
        Eight compositions across four collections
      </div>

      <div style={{ display: "flex", gap: 28, flexWrap: "wrap", marginBottom: 32, borderBottom: `1px solid ${T.lineHair}` }}>
        {["ALL", ...LINES.map((l) => l.id)].map((id) => {
          const line = LINES.find((l) => l.id === id);
          const active = lineFilter === id;
          return (
            <button
              key={id}
              onClick={() => setLineFilter(id)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                fontFamily: "'Josefin Sans',sans-serif",
                fontSize: 10,
                fontWeight: 300,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: active ? T.text : T.muted,
                paddingBottom: 10,
                borderBottom: active ? `1px solid ${T.text}` : "1px solid transparent",
              }}
            >
              {line ? line.name.toUpperCase() : "ALL"}
            </button>
          );
        })}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16, marginBottom: 100 }}>
        {shownProducts.map((p) => {
          const r = RECIPES[p.id];
          const lineName = LINES.find((l) => l.id === r.line)?.name ?? "";
          const qty = cart[p.id] ?? 0;
          return (
            <Card key={p.id}>
              <div style={{ ...TYPE.eyebrow, color: T.muted, marginBottom: 20 }}>COLLECTION {lineName.toUpperCase()}</div>
              <div style={{ display: "flex", justifyContent: "center", padding: "16px 0 24px" }}>
                <JarCandle jarTypeId={r.jarType} rgb={WAX[r.wax].base} lit={false} size={88} />
              </div>
              <div style={{ fontSize: 16, fontFamily: "'Cinzel',serif", fontWeight: 400, color: T.text, marginBottom: 8 }}>{r.name}</div>
              <div style={{ fontSize: 11, fontFamily: "'Josefin Sans',sans-serif", fontWeight: 300, color: T.muted, letterSpacing: "0.06em", marginBottom: 20 }}>
                {JAR_TYPES.find((j) => j.id === r.jarType)?.name} · {r.frags.map(([n]) => n).join(" · ")}
              </div>
              <div style={{ height: 1, background: T.lineHair, marginBottom: 20 }} />
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ ...TYPE.price, fontSize: 18, color: T.text }}>{fmtVND(p.price)}</div>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  {qty > 0 && (
                    <Btn small onClick={() => addQty(p.id, -1)} style={{ padding: "6px 12px" }}>
                      −
                    </Btn>
                  )}
                  {qty > 0 && <span style={{ fontSize: 13, fontFamily: "'Josefin Sans',sans-serif", fontWeight: 400, minWidth: 16, textAlign: "center" }}>{qty}</span>}
                  <Btn small variant={qty === 0 ? "primary" : "ghost"} onClick={() => addQty(p.id, 1)} style={{ padding: "6px 14px" }}>
                    {qty === 0 ? "ADD" : "+"}
                  </Btn>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {cartItems.length > 0 && (
        <div
          style={{
            position: "fixed",
            bottom: 24,
            left: "50%",
            transform: "translateX(-50%)",
            background: T.dark,
            border: `1px solid ${T.gold}`,
            borderRadius: 0,
            padding: "14px 28px",
            display: "flex",
            alignItems: "center",
            gap: 24,
            zIndex: 40,
            maxWidth: "90%",
          }}
        >
          <span style={{ color: T.card, fontFamily: "'Josefin Sans',sans-serif", fontSize: 11, fontWeight: 300, letterSpacing: "0.1em" }}>
            {cartItems.reduce((s, [, q]) => s + q, 0)} PIECES · {fmtVND(cartTotal)}
          </span>
          <button
            onClick={() => setCheckoutOpen(true)}
            style={{
              padding: "0",
              border: "none",
              background: "none",
              cursor: "pointer",
              color: T.gold,
              fontFamily: "'Josefin Sans',sans-serif",
              fontWeight: 300,
              fontSize: 11,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
            }}
          >
            Checkout →
          </button>
        </div>
      )}

      {checkoutOpen && (
        <CheckoutModal
          identity={identity}
          summaryLines={cartItems.map(([pid, qty]) => {
            const r = RECIPES[pid],
              p = db.products.find((x) => x.id === pid);
            return { label: `${r.name} ×${qty}`, amount: p.price * qty };
          })}
          total={cartTotal}
          onClose={() => setCheckoutOpen(false)}
          onConfirm={placeOrder}
        />
      )}
    </div>
  );
}
