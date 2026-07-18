import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { T } from "../data/theme";
import { RECIPES, BOM, LINES, STATUSES_DEF, WAX } from "../data/recipes";
import { Card, Btn, Input, Badge, Modal } from "./ui/Primitives";
import { JarCandle } from "./JarCandle";
import { fmtVND, orderTotal, itemDisplay, materialsNeededForItems, checkStockForItems } from "../utils/formatters";

const STATUS_COLORS = {
  new: { color: T.blue, deep: T.blueDeep },
  confirmed: { color: T.lilac, deep: T.lilacDeep },
  producing: { color: T.yellow, deep: T.yellowDeep },
  packing: { color: T.pink, deep: T.pinkDeep },
  done: { color: T.green, deep: T.greenDeep },
};
const STATUSES = STATUSES_DEF.map((s) => ({ ...s, ...STATUS_COLORS[s.id] }));

export function AdminApp({ db, setDb, showToast }) {
  const [tab, setTab] = useState("dashboard");
  const [modal, setModal] = useState(null);

  const moveOrder = (orderId, newStatus) => {
    setDb((d) => {
      const order = d.orders.find((o) => o.id === orderId);
      if (!order) return d;
      let materials = d.materials,
        deducted = order.deducted;
      if (newStatus === "producing" && !order.deducted) {
        const missing = checkStockForItems(order.items, d.materials);
        if (missing.length) {
          showToast(`Thiếu nguyên liệu: ${missing.map((m) => `${m.name} (cần ${m.need}${m.unit}, còn ${m.have}${m.unit})`).join(", ")} 🥺`, false);
          return d;
        }
        const need = materialsNeededForItems(order.items);
        materials = d.materials.map((m) => (need[m.id] ? { ...m, qty: +(m.qty - need[m.id]).toFixed(1) } : m));
        deducted = true;
        showToast(`Đã trừ kho cho ${orderId} — bắt đầu sản xuất! 🕯️`);
      }
      if (order.status === "producing" && ["new", "confirmed"].includes(newStatus) && order.deducted) {
        const need = materialsNeededForItems(order.items);
        materials = d.materials.map((m) => (need[m.id] ? { ...m, qty: +(m.qty + need[m.id]).toFixed(1) } : m));
        deducted = false;
        showToast(`Đã hoàn kho cho ${orderId} 🔄`);
      }
      return { ...d, materials, orders: d.orders.map((o) => (o.id === orderId ? { ...o, status: newStatus, deducted } : o)) };
    });
  };

  const lowStock = db.materials.filter((m) => m.qty <= m.min);
  const revenue = db.orders.filter((o) => o.status === "done").reduce((s, o) => s + orderTotal(o, db.products), 0);
  const activeOrders = db.orders.filter((o) => o.status !== "done").length;

  const TABS = [
    { id: "dashboard", emoji: "🏠", label: "Tổng quan" },
    { id: "orders", emoji: "📦", label: "Đơn hàng" },
    { id: "products", emoji: "🕯️", label: "Sản phẩm" },
    { id: "inventory", emoji: "🧺", label: "Kho" },
    { id: "customers", emoji: "👤", label: "Khách" },
  ];

  const ttStyle = { background: T.card, border: `1.5px solid ${T.line}`, borderRadius: 12, fontSize: 11, color: T.text };

  return (
    <div style={{ maxWidth: 980, margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "center", gap: 6, marginBottom: 18, flexWrap: "wrap" }}>
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            style={{
              padding: tab === t.id ? "8px 18px" : "8px 13px",
              borderRadius: 999,
              border: "none",
              cursor: "pointer",
              fontFamily: "inherit",
              fontSize: 12.5,
              fontWeight: 700,
              background: tab === t.id ? T.pink : "#fff",
              color: tab === t.id ? "#fff" : T.muted,
              boxShadow: tab === t.id ? "0 3px 10px rgba(143,108,59,0.35)" : `inset 0 0 0 1.5px ${T.line}`,
            }}
          >
            {t.emoji} {tab === t.id && t.label}
            {t.id === "inventory" && lowStock.length > 0 && (
              <span style={{ marginLeft: 5, background: T.red, color: "#fff", borderRadius: 99, fontSize: 9.5, padding: "1px 6px" }}>{lowStock.length}</span>
            )}
          </button>
        ))}
      </div>

      {tab === "dashboard" &&
        (() => {
          const days = Array.from({ length: 7 }, (_, i) => {
            const d = new Date("2026-07-18");
            d.setDate(d.getDate() - 6 + i);
            const key = d.toISOString().slice(0, 10);
            const rev = db.orders.filter((o) => o.status === "done" && o.created === key).reduce((s, o) => s + orderTotal(o, db.products), 0);
            return { day: `${d.getDate()}/${d.getMonth() + 1}`, "Doanh thu": rev / 1000 };
          });
          const topProducts = db.products
            .map((p) => {
              const sold = db.orders
                .filter((o) => o.status === "done")
                .reduce((s, o) => s + o.items.filter((it) => it.type === "catalog" && it.productId === p.id).reduce((a, it) => a + it.qty, 0), 0);
              return { name: RECIPES[p.id].name, emoji: RECIPES[p.id].emoji, sold, profit: (p.price - p.cost) * sold };
            })
            .sort((a, b) => b.sold - a.sold);
          const customOrders = db.orders.filter((o) => o.items.some((it) => it.type === "custom"));

          return (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 10 }}>
                {[
                  { emoji: "💰", label: "Doanh thu", val: fmtVND(revenue) },
                  { emoji: "📦", label: "Đơn đang chạy", val: activeOrders },
                  { emoji: "🧪", label: "Đơn từ mô phỏng", val: customOrders.length },
                  { emoji: "🥺", label: "Sắp hết", val: lowStock.length },
                ].map((s) => (
                  <Card key={s.label} style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 22 }}>{s.emoji}</div>
                    <div style={{ fontSize: 17, fontWeight: 700, marginTop: 4 }}>{s.val}</div>
                    <div style={{ fontSize: 10.5, color: T.muted, marginTop: 2 }}>{s.label}</div>
                  </Card>
                ))}
              </div>
              <Card>
                <div style={{ fontSize: 13.5, fontWeight: 700, marginBottom: 10 }}>Doanh thu 7 ngày (nghìn đ) 📈</div>
                <ResponsiveContainer width="100%" height={160}>
                  <BarChart data={days} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={T.line} />
                    <XAxis dataKey="day" tick={{ fontSize: 10, fill: T.muted }} />
                    <YAxis tick={{ fontSize: 10, fill: T.muted }} />
                    <Tooltip contentStyle={ttStyle} />
                    <Bar dataKey="Doanh thu" fill={T.pink} radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <Card>
                  <div style={{ fontSize: 13.5, fontWeight: 700, marginBottom: 10 }}>Bán chạy nhất 🏆</div>
                  {topProducts.map((p, i) => (
                    <div key={p.name} style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 0", borderBottom: i < topProducts.length - 1 ? `1px dashed ${T.line}` : "none" }}>
                      <span style={{ fontSize: 17 }}>{p.emoji}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 12.5, fontWeight: 700 }}>{p.name}</div>
                        <div style={{ fontSize: 10.5, color: T.muted }}>Lãi {fmtVND(p.profit)}</div>
                      </div>
                      <Badge color={T.pinkSoft} deep={T.pinkDeep}>
                        {p.sold} cây
                      </Badge>
                    </div>
                  ))}
                </Card>
                <Card>
                  <div style={{ fontSize: 13.5, fontWeight: 700, marginBottom: 10 }}>Cần nhập thêm 🧺</div>
                  {lowStock.length === 0 && <div style={{ fontSize: 12, color: T.muted }}>Kho đầy đủ! 💗</div>}
                  {lowStock.map((m) => (
                    <div key={m.id} style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 0" }}>
                      <span style={{ fontSize: 16 }}>{m.emoji}</span>
                      <div style={{ flex: 1, fontSize: 12.5, fontWeight: 600 }}>{m.name}</div>
                      <Badge color="#FBE3DA" deep={T.redDeep}>
                        còn {m.qty}
                        {m.unit}
                      </Badge>
                    </div>
                  ))}
                </Card>
              </div>
            </div>
          );
        })()}

      {tab === "orders" && (
        <>
          <div style={{ fontSize: 11.5, color: T.muted, marginBottom: 12, textAlign: "center" }}>
            📌 Đơn hàng được tạo tự động từ Cửa hàng &amp; Mô phỏng — quản lý chỉ cần di chuyển trạng thái
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 8, overflowX: "auto" }}>
            {STATUSES.map((st, si) => {
              const orders = db.orders.filter((o) => o.status === st.id);
              return (
                <div key={st.id} style={{ minWidth: 150 }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 5,
                      background: st.color,
                      borderRadius: 12,
                      padding: "7px 4px",
                      marginBottom: 8,
                      fontSize: 11.5,
                      fontWeight: 700,
                      color: st.deep,
                    }}
                  >
                    {st.emoji} {st.label} <span style={{ opacity: 0.7 }}>({orders.length})</span>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                    {orders.map((o) => {
                      const cust = db.customers.find((c) => c.id === o.customerId);
                      return (
                        <Card key={o.id} style={{ padding: "10px 11px", borderRadius: 14 }}>
                          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                            <span style={{ fontSize: 11.5, fontWeight: 700, color: T.pinkDeep }}>{o.id}</span>
                            {o.deducted && (
                              <span title="Đã trừ kho" style={{ fontSize: 10 }}>
                                ✂️
                              </span>
                            )}
                          </div>
                          <div style={{ fontSize: 11, fontWeight: 600, marginBottom: 3 }}>{cust?.name ?? "?"}</div>
                          {o.items.map((it, ii) => {
                            const disp = itemDisplay(it);
                            return (
                              <div key={ii} style={{ fontSize: 10.5, color: T.muted }}>
                                {disp.emoji} {disp.name} ×{it.qty}
                              </div>
                            );
                          })}
                          <div style={{ fontSize: 11.5, fontWeight: 700, margin: "5px 0" }}>{fmtVND(orderTotal(o, db.products))}</div>
                          <div style={{ display: "flex", gap: 4 }}>
                            {si > 0 && (
                              <Btn small onClick={() => moveOrder(o.id, STATUSES[si - 1].id)} style={{ padding: "4px 10px", fontSize: 11 }}>
                                ←
                              </Btn>
                            )}
                            {si < STATUSES.length - 1 && (
                              <Btn small primary onClick={() => moveOrder(o.id, STATUSES[si + 1].id)} style={{ padding: "4px 10px", fontSize: 11, flex: 1 }}>
                                {STATUSES[si + 1].emoji} →
                              </Btn>
                            )}
                          </div>
                        </Card>
                      );
                    })}
                    {orders.length === 0 && <div style={{ fontSize: 10.5, color: "#D6C6A0", textAlign: "center", padding: "14px 0" }}>trống ✿</div>}
                  </div>
                </div>
              );
            })}
          </div>
          <div style={{ fontSize: 11, color: T.muted, marginTop: 12, textAlign: "center" }}>
            💡 Chuyển đơn sang <b>Sản xuất</b> sẽ tự động trừ kho · lùi lại sẽ hoàn kho
          </div>
        </>
      )}

      {tab === "products" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {LINES.map((line) => (
            <div key={line.id}>
              <div style={{ fontSize: 13.5, fontWeight: 700, marginBottom: 10 }}>
                {line.emoji} {line.name}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: 12 }}>
                {db.products
                  .filter((p) => RECIPES[p.id]?.line === line.id)
                  .map((p) => {
                    const r = RECIPES[p.id];
                    const canMake = (() => {
                      let n = Infinity;
                      for (const [mid, per] of BOM[p.id]) {
                        const m = db.materials.find((x) => x.id === mid);
                        n = Math.min(n, Math.floor((m?.qty ?? 0) / per));
                      }
                      return n;
                    })();
                    return (
                      <Card key={p.id}>
                        <div style={{ display: "flex", justifyContent: "center", marginBottom: 8 }}>
                          <JarCandle jarTypeId={r.jarType} rgb={WAX[r.wax].base} lit={false} size={68} />
                        </div>
                        <div style={{ fontSize: 13.5, fontWeight: 700, textAlign: "center" }}>
                          {r.emoji} {r.name}
                        </div>
                        <div style={{ fontSize: 10.5, color: T.muted, textAlign: "center", marginBottom: 8 }}>{r.frags.map(([n, ml]) => `${n} ${ml}ml`).join(" + ")}</div>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                          <div>
                            <div style={{ fontSize: 14, fontWeight: 700, color: T.pinkDeep }}>{fmtVND(p.price)}</div>
                            <div style={{ fontSize: 9.5, color: T.muted }}>
                              vốn {fmtVND(p.cost)} · lãi {Math.round(((p.price - p.cost) / p.price) * 100)}%
                            </div>
                          </div>
                          <Badge color={canMake > 5 ? "#E4F0D8" : "#FBE3DA"} deep={canMake > 5 ? T.greenDeep : T.redDeep}>
                            kho {canMake}
                          </Badge>
                        </div>
                        <Btn small onClick={() => setModal({ type: "editPrice", data: p.id })} style={{ width: "100%" }}>
                          ✏️ Sửa giá
                        </Btn>
                      </Card>
                    );
                  })}
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "inventory" && (
        <Card>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <div style={{ fontSize: 14, fontWeight: 700 }}>Kho nguyên liệu 🧺</div>
            <div style={{ fontSize: 11, color: T.muted }}>{lowStock.length > 0 ? `${lowStock.length} món sắp hết 🥺` : "Đầy đủ 💗"}</div>
          </div>
          {db.materials.map((m, i) => {
            const low = m.qty <= m.min;
            const pct = Math.min((m.qty / (m.min * 4)) * 100, 100);
            return (
              <div key={m.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 0", borderBottom: i < db.materials.length - 1 ? `1px dashed ${T.line}` : "none" }}>
                <span style={{ fontSize: 18 }}>{m.emoji}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, marginBottom: 4 }}>
                    <span style={{ fontWeight: 600 }}>{m.name}</span>
                    <span style={{ fontWeight: 700, color: low ? T.redDeep : T.text }}>
                      {m.qty.toLocaleString("vi-VN")} {m.unit}
                    </span>
                  </div>
                  <div style={{ height: 6, background: T.pinkSoft, borderRadius: 99, overflow: "hidden" }}>
                    <div style={{ width: `${pct}%`, height: "100%", borderRadius: 99, background: low ? T.red : T.green }} />
                  </div>
                </div>
                <Btn small onClick={() => setModal({ type: "restock", data: m.id })}>
                  + Nhập
                </Btn>
              </div>
            );
          })}
        </Card>
      )}

      {tab === "customers" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 12 }}>
          {db.customers.map((c) => {
            const theirOrders = db.orders.filter((o) => o.customerId === c.id);
            const spent = theirOrders.filter((o) => o.status === "done").reduce((s, o) => s + orderTotal(o, db.products), 0);
            return (
              <Card key={c.id}>
                <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 8 }}>
                  <div
                    style={{
                      width: 42,
                      height: 42,
                      borderRadius: "50%",
                      background: T.pinkSoft,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 16,
                      fontWeight: 700,
                      color: T.pinkDeep,
                    }}
                  >
                    {c.name.trim().slice(0, 1)}
                  </div>
                  <div>
                    <div style={{ fontSize: 13.5, fontWeight: 700 }}>{c.name}</div>
                    <div style={{ fontSize: 11, color: T.muted }}>{c.phone}</div>
                  </div>
                </div>
                {c.note && <div style={{ fontSize: 11.5, background: T.soft, borderRadius: 12, padding: "7px 10px", marginBottom: 8, color: T.muted }}>📝 {c.note}</div>}
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  <Badge color={T.pinkSoft} deep={T.pinkDeep}>
                    {theirOrders.length} đơn
                  </Badge>
                  <Badge color="#E4F0D8" deep={T.greenDeep}>
                    {fmtVND(spent)}
                  </Badge>
                  {c.fav && (
                    <Badge color="#EDE2F1" deep={T.lilacDeep}>
                      💗 {RECIPES[c.fav]?.name}
                    </Badge>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {modal?.type === "restock" && (
        <RestockModal
          material={db.materials.find((m) => m.id === modal.data)}
          onClose={() => setModal(null)}
          onSave={(qty) => {
            setDb((d) => ({ ...d, materials: d.materials.map((m) => (m.id === modal.data ? { ...m, qty: m.qty + qty } : m)) }));
            setModal(null);
            showToast("Đã nhập kho! 🧺");
          }}
        />
      )}
      {modal?.type === "editPrice" && (
        <PriceModal
          product={db.products.find((p) => p.id === modal.data)}
          recipe={RECIPES[modal.data]}
          onClose={() => setModal(null)}
          onSave={(price) => {
            setDb((d) => ({ ...d, products: d.products.map((p) => (p.id === modal.data ? { ...p, price } : p)) }));
            setModal(null);
            showToast("Đã cập nhật giá ✏️");
          }}
        />
      )}
    </div>
  );
}

function RestockModal({ material, onClose, onSave }) {
  const [qty, setQty] = useState(1000);
  if (!material) return null;
  return (
    <Modal title={`Nhập kho — ${material.emoji} ${material.name}`} onClose={onClose}>
      <div style={{ fontSize: 12, color: T.muted, marginBottom: 10 }}>
        Hiện còn{" "}
        <b style={{ color: T.text }}>
          {material.qty.toLocaleString("vi-VN")} {material.unit}
        </b>{" "}
        · mức cảnh báo {material.min} {material.unit}
      </div>
      <Input label={`Số lượng nhập (${material.unit})`} type="number" value={qty} onChange={setQty} />
      <div style={{ fontSize: 11.5, color: T.muted, marginBottom: 10 }}>
        Ước tính chi phí: <b style={{ color: T.pinkDeep }}>{fmtVND(Math.round(qty * material.price))}</b>
      </div>
      <Btn primary disabled={qty <= 0} style={{ width: "100%" }} onClick={() => onSave(qty)}>
        Nhập kho 🧺
      </Btn>
    </Modal>
  );
}

function PriceModal({ product, recipe, onClose, onSave }) {
  const [price, setPrice] = useState(product?.price ?? 0);
  if (!product) return null;
  const margin = price > 0 ? Math.round(((price - product.cost) / price) * 100) : 0;
  return (
    <Modal title={`Sửa giá — ${recipe.emoji} ${recipe.name}`} onClose={onClose}>
      <Input label="Giá bán (đ)" type="number" value={price} onChange={setPrice} />
      <div style={{ fontSize: 12, color: T.muted, marginBottom: 12 }}>
        Giá vốn {fmtVND(product.cost)} → biên lãi <b style={{ color: margin >= 40 ? T.greenDeep : T.yellowDeep }}>{margin}%</b>
      </div>
      <Btn primary disabled={price <= 0} style={{ width: "100%" }} onClick={() => onSave(price)}>
        Lưu ✏️
      </Btn>
    </Modal>
  );
}
