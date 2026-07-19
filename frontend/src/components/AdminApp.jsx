import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { T } from "../data/theme";
import { RECIPES, BOM, LINES, STATUSES_DEF, WAX } from "../data/recipes";
import { Card, Btn, Input, Badge, Modal } from "./ui/Primitives";
import { JarCandle } from "./JarCandle";
import { fmtVND, orderTotal, itemDisplay, materialsNeededForItems, productsNeededForItems, checkStockForItems, calculateDemandStats, NORMSINV, gaussianPDF } from "../utils/formatters";
import { consumeManyBatches, syncMaterialQtyFromBatches, sortForConsumption, batchStatus } from "../utils/batches";

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
  const [csl, setCsl] = useState(0.95);
  const [leadTime, setLeadTime] = useState(7);
  const [demand, setDemand] = useState(20);
  const [sigma, setSigma] = useState(5);
  const [optPrice, setOptPrice] = useState(150);
  const [optCost, setOptCost] = useState(80);
  const [optSalvage, setOptSalvage] = useState(30);
  const [expandedMat, setExpandedMat] = useState(null);
  const demandStats = calculateDemandStats(db.orders);

  const moveOrder = (orderId, newStatus) => {
    setDb((d) => {
      const order = d.orders.find((o) => o.id === orderId);
      if (!order) return d;
      let materials = d.materials, products = d.products, transactions = [...(d.transactions || [])], nextTxNum = d.nextTxNum || 1;
      let batches = d.batches || [], nextBatchNum = d.nextBatchNum || 1;
      let deducted = order.deducted;

      if (newStatus === "producing" && !order.deducted) {
        const missing = checkStockForItems(order.items, d.materials, d.products);
        if (missing.length) {
          showToast(`Thiếu tồn kho: ${missing.map((m) => `${m.name} (cần ${m.need}${m.unit}, còn ${m.have}${m.unit})`).join(", ")} 🥺`, false);
          return d;
        }
        const matNeed = materialsNeededForItems(order.items);
        const prodNeed = productsNeededForItems(order.items);

        // Trừ NVL theo FEFO/FIFO qua các lô (F04) thay vì trừ thẳng vào tổng tồn kho.
        const consumed = consumeManyBatches(batches, matNeed);
        batches = consumed.batches;
        materials = syncMaterialQtyFromBatches(d.materials, batches);
        for (const [mid, q] of Object.entries(matNeed)) {
          transactions.push({ id: `TX-${nextTxNum++}`, type: "OUT", itemId: mid, qty: -q, reason: `Xuất sản xuất custom ĐH ${orderId}`, date: new Date().toISOString(), consumedFrom: consumed.consumedLog[mid] || [] });
        }
        products = d.products.map((p) => {
          if (prodNeed[p.id]) {
            transactions.push({ id: `TX-${nextTxNum++}`, type: "OUT", itemId: p.id, qty: -prodNeed[p.id], reason: `Xuất kho thành phẩm ĐH ${orderId}`, date: new Date().toISOString() });
            return { ...p, qty: p.qty - prodNeed[p.id] };
          }
          return p;
        });
        deducted = true;
        showToast(`Đã xuất kho cho ${orderId} — bắt đầu đóng gói! 📦`);
      }

      if (order.status === "producing" && ["new", "confirmed"].includes(newStatus) && order.deducted) {
        const matNeed = materialsNeededForItems(order.items);
        const prodNeed = productsNeededForItems(order.items);

        // Hoàn kho NVL: không truy ngược đúng lô đã xuất (custom order không lưu batchId gốc theo item),
        // nên tạo lô "hoàn trả" mới để không làm sai lệch tổng tồn kho — đây là giới hạn đã biết, xem progress.md.
        const today = new Date().toISOString().slice(0, 10);
        for (const [mid, q] of Object.entries(matNeed)) {
          const mat = d.materials.find((x) => x.id === mid);
          batches = [...batches, { id: `RET-${nextBatchNum++}`, materialId: mid, receivedDate: today, expiryDate: null, initialQty: q, remainingQty: q, unitCost: mat?.price ?? 0, qcStatus: "passed", note: `Hoàn kho custom ĐH ${orderId}` }];
          transactions.push({ id: `TX-${nextTxNum++}`, type: "IN", itemId: mid, qty: q, reason: `Hoàn kho custom ĐH ${orderId}`, date: new Date().toISOString() });
        }
        materials = syncMaterialQtyFromBatches(d.materials, batches);
        products = d.products.map((p) => {
          if (prodNeed[p.id]) {
            transactions.push({ id: `TX-${nextTxNum++}`, type: "IN", itemId: p.id, qty: prodNeed[p.id], reason: `Hoàn kho ĐH ${orderId}`, date: new Date().toISOString() });
            return { ...p, qty: p.qty + prodNeed[p.id] };
          }
          return p;
        });
        deducted = false;
        showToast(`Đã hoàn kho cho ${orderId} 🔄`);
      }
      return { ...d, materials, products, transactions, nextTxNum, batches, nextBatchNum, orders: d.orders.map((o) => (o.id === orderId ? { ...o, status: newStatus, deducted } : o)) };
    });
  };

  const inventoryPos = {};
  db.materials.forEach(m => { inventoryPos[m.id] = { onHand: m.qty, reserved: 0, available: m.qty, onOrder: 0 }; });
  db.products.forEach(p => { inventoryPos[p.id] = { onHand: p.qty, reserved: 0, available: p.qty, onOrder: 0 }; });

  db.orders.forEach(o => {
    if (["new", "confirmed"].includes(o.status) && !o.deducted) {
      const matNeed = materialsNeededForItems(o.items);
      const prodNeed = productsNeededForItems(o.items);
      Object.entries(matNeed).forEach(([id, q]) => { if(inventoryPos[id]) { inventoryPos[id].reserved += q; inventoryPos[id].available -= q; } });
      Object.entries(prodNeed).forEach(([id, q]) => { if(inventoryPos[id]) { inventoryPos[id].reserved += q; inventoryPos[id].available -= q; } });
    }
  });

  (db.productionOrders || []).forEach(po => {
    if (po.status === "ready" || po.status === "draft") {
      const matNeed = {};
      for (const [mid, per] of BOM[po.productId] || []) matNeed[mid] = per * po.qty;
      Object.entries(matNeed).forEach(([id, q]) => { if(inventoryPos[id]) { inventoryPos[id].reserved += q; inventoryPos[id].available -= q; } });
    }
  });

  const lowStock = db.materials.filter((m) => inventoryPos[m.id]?.available <= m.min);
  const revenue = db.orders.filter((o) => o.status === "done").reduce((s, o) => s + orderTotal(o, db.products), 0);
  const activeOrders = db.orders.filter((o) => o.status !== "done").length;
  
  const inventoryCapital = db.materials.reduce((sum, m) => sum + (inventoryPos[m.id]?.onHand || 0) * (m.price || 0), 0) +
                           db.products.reduce((sum, p) => sum + (inventoryPos[p.id]?.onHand || 0) * (p.cost || 0), 0);

  const TABS = [
    { id: "dashboard", emoji: "🏠", label: "Tổng quan" },
    { id: "orders", emoji: "📦", label: "Đơn hàng" },
    { id: "products", emoji: "🕯️", label: "Sản phẩm" },
    { id: "production", emoji: "🏭", label: "Sản xuất" },
    { id: "inventory", emoji: "🧺", label: "Kho" },
    { id: "logistics", emoji: "🚚", label: "Logistics" },
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
              const r = RECIPES[p.id] || { name: p.id, emoji: "🕯️" };
              return { name: r.name, emoji: r.emoji, sold, profit: (p.price - p.cost) * sold };
            })
            .sort((a, b) => b.sold - a.sold);
          const customOrders = db.orders.filter((o) => o.items.some((it) => it.type === "custom"));

          return (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 10 }}>
                {[
                  { emoji: "💰", label: "Doanh thu", val: fmtVND(revenue) },
                  { emoji: "💵", label: "Vốn đọng kho", val: fmtVND(Math.round(inventoryCapital)) },
                  { emoji: "📦", label: "Đơn đang chạy", val: activeOrders },
                  { emoji: "🥺", label: "Sắp hết", val: lowStock.length },
                ].map((s) => (
                  <Card key={s.label} style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 22 }}>{s.emoji}</div>
                    <div style={{ fontSize: 17, fontWeight: 700, marginTop: 4 }}>{s.val}</div>
                    <div style={{ fontSize: 10.5, color: T.muted, marginTop: 2 }}>{s.label}</div>
                  </Card>
                ))}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 12 }}>
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
                <Card>
                  <div style={{ fontSize: 13.5, fontWeight: 700, marginBottom: 10 }}>Logistics Đơn hàng 🚚</div>
                  <ResponsiveContainer width="100%" height={140}>
                    <PieChart>
                      <Pie data={STATUSES.map(st => ({ name: st.label, value: db.orders.filter(o => o.status === st.id).length, color: st.deep })).filter(d => d.value > 0)} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={40} outerRadius={60} paddingAngle={2}>
                        {STATUSES.map(st => ({ name: st.label, value: db.orders.filter(o => o.status === st.id).length, color: st.deep })).filter(d => d.value > 0).map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={ttStyle} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6, justifyContent: "center", marginTop: 6 }}>
                    {STATUSES.map(st => ({ name: st.label, value: db.orders.filter(o => o.status === st.id).length, color: st.deep })).filter(d => d.value > 0).map(d => (
                      <div key={d.name} style={{ fontSize: 10, color: T.text, display: "flex", alignItems: "center", gap: 4, fontWeight: 600 }}>
                        <div style={{ width: 8, height: 8, borderRadius: 2, background: d.color }}></div> {d.name} ({d.value})
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
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
                    
                    const actualSalvage = p.salvage ?? Math.round(p.cost * 0.5);
                    const Cu = Math.max(0, p.price - p.cost);
                    const Co = Math.max(0, p.cost - actualSalvage);
                    const optCSL = (Cu + Co) > 0 ? (Cu / (Cu + Co)) : 0;

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
                            làm thêm {canMake}
                          </Badge>
                        </div>
                        <div style={{ background: T.soft, borderRadius: 8, padding: "8px 10px", marginBottom: 10, display: "flex", flexDirection: "column", gap: 6 }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <div style={{ fontSize: 11, color: T.muted }}>Tồn sẵn bán:</div>
                            <div style={{ fontSize: 13, fontWeight: 700, color: T.text }}>{inventoryPos[p.id]?.available || 0} cây</div>
                          </div>
                          {p.isSeasonal && (() => {
                            const stats = demandStats[p.id] || { D: 1, sigma_D: 1 };
                            const targetD = stats.D * 30; // Dự báo mùa 30 ngày
                            const stdD = stats.sigma_D * Math.sqrt(30);
                            const optimalQ = Math.max(0, Math.ceil(targetD + NORMSINV(optCSL) * stdD));
                            
                            return (
                              <>
                                <div style={{ height: 1, background: T.line }} />
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                  <div style={{ fontSize: 11, color: T.muted }} title="Critical Ratio">Tỉ lệ phục vụ (CR*)</div>
                                  <div style={{ fontSize: 12, fontWeight: 700, color: T.blueDeep }}>{(optCSL * 100).toFixed(1)}%</div>
                                </div>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                  <div style={{ fontSize: 11, color: T.muted }} title="Lượng làm tối ưu = Nhu cầu + Z*Độ lệch chuẩn">Nên làm (Q*)</div>
                                  <div style={{ fontSize: 12, fontWeight: 700, color: T.pinkDeep }}>{optimalQ} cây</div>
                                </div>
                              </>
                            );
                          })()}
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

      {tab === "production" && (
        <Card>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700 }}>Lệnh sản xuất thành phẩm 🏭</div>
              <div style={{ fontSize: 11, color: T.muted, marginTop: 4 }}>Nguyên vật liệu sẽ được <b>Giữ chỗ</b> khi tạo lệnh, và <b>Trừ kho</b> khi hoàn thành.</div>
            </div>
            <Btn primary onClick={() => setModal({ type: "newPo" })}>+ Lệnh mới</Btn>
          </div>
          
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {(!db.productionOrders || db.productionOrders.length === 0) && (
              <div style={{ textAlign: "center", padding: "20px 0", color: T.muted, fontSize: 12 }}>Chưa có lệnh sản xuất nào 📋</div>
            )}
            {(db.productionOrders || []).map((po) => {
              const r = RECIPES[po.productId];
              const isDraft = po.status === "draft";
              return (
                <div key={po.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px", background: "#fff", borderRadius: 12, border: `1px solid ${T.line}` }}>
                  <div style={{ fontSize: 28 }}>{r?.emoji}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                      <div style={{ fontSize: 13, fontWeight: 700 }}>{po.id} — {r?.name}</div>
                      <Badge color={isDraft ? T.yellow : T.green} deep={isDraft ? T.yellowDeep : T.greenDeep}>{isDraft ? "Đang chờ" : "Đã xong"}</Badge>
                    </div>
                    <div style={{ fontSize: 11.5, color: T.muted, display: "flex", gap: 16 }}>
                      <span>Sản xuất: <b style={{ color: T.text }}>{po.qty} cây</b></span>
                      <span>Tạo ngày: {new Date(po.created).toLocaleDateString("vi-VN")}</span>
                    </div>
                  </div>
                  {isDraft && (
                    <Btn small primary onClick={() => {
                      setDb(d => {
                        let txs = [...(d.transactions || [])];
                        let nextTx = d.nextTxNum || 1;
                        let prods = d.products.map(p => p.id === po.productId ? { ...p, qty: p.qty + po.qty } : p);

                        txs.push({ id: `TX-${nextTx++}`, type: "IN", itemId: po.productId, qty: po.qty, reason: `Nhập thành phẩm ${po.id}`, date: new Date().toISOString() });

                        const matNeed = {};
                        for (const [mid, per] of BOM[po.productId] || []) matNeed[mid] = (matNeed[mid] || 0) + per * po.qty;

                        // Trừ NVL theo FEFO/FIFO qua các lô (F04)
                        const consumed = consumeManyBatches(d.batches || [], matNeed);
                        const mats = syncMaterialQtyFromBatches(d.materials, consumed.batches);
                        for (const [mid, q] of Object.entries(matNeed)) {
                          txs.push({ id: `TX-${nextTx++}`, type: "OUT", itemId: mid, qty: -q, reason: `Xuất sản xuất ${po.id}`, date: new Date().toISOString(), consumedFrom: consumed.consumedLog[mid] || [] });
                        }

                        return {
                          ...d, transactions: txs, nextTxNum: nextTx, materials: mats, products: prods, batches: consumed.batches,
                          productionOrders: d.productionOrders.map(x => x.id === po.id ? { ...x, status: "done" } : x)
                        };
                      });
                      showToast(`Hoàn tất sản xuất ${po.id}! 🕯️`);
                    }}>Hoàn thành</Btn>
                  )}
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {tab === "inventory" && (
        <Card>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, flexWrap: "wrap", gap: 10 }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700 }}>Kho nguyên liệu 🧺</div>
              <div style={{ fontSize: 11, color: T.muted }}>{lowStock.length > 0 ? `${lowStock.length} món sắp hết 🥺` : "Đầy đủ 💗"}</div>
            </div>
            <div style={{ display: "flex", gap: 8, alignItems: "center", background: T.soft, padding: "6px 12px", borderRadius: 12 }}>
              <div style={{ fontSize: 11.5, fontWeight: 600, color: T.text }}>Mức phục vụ (CSL): {Math.round(csl * 100)}%</div>
              <input type="range" min="0.5" max="0.999" step="0.01" value={csl} onChange={e => setCsl(parseFloat(e.target.value))} style={{ width: 80, accentColor: T.pink }} />
            </div>
          </div>
          {db.materials.map((m, i) => {
            const stats = demandStats[m.id] || { D: 0, sigma_D: 0 };
            const supplier = (db.suppliers || []).find((s) => s.id === m.supplierId);
            // Mặc định Lead Time (L) và độ lệch chuẩn (sL) lấy từ NCC mặc định của NVL (F01/F07) khi chưa ghi đè tay.
            const L = m.leadTime || supplier?.leadTimeAvg || 2;
            const sL = m.sL || supplier?.leadTimeStdDev || 0.5;
            const pos = inventoryPos[m.id] || { onHand: 0, reserved: 0, available: 0, onOrder: 0 };
            
            const SS = Math.ceil(NORMSINV(csl) * Math.sqrt(L * Math.pow(stats.sigma_D, 2) + Math.pow(stats.D, 2) * Math.pow(sL, 2)));
            const ROP = Math.ceil(stats.D * L + SS);
            
            let statusColor = T.green;
            let statusText = "An toàn 🟢";
            let isLow = false;
            
            if (pos.available < SS) { statusColor = T.red; statusText = "Khẩn cấp 🔴"; isLow = true; }
            else if (pos.available <= ROP) { statusColor = T.yellowDeep; statusText = "Cần đặt 🟡"; isLow = true; }
            
            const TargetStock = Math.max(m.min * 2, Math.ceil(ROP + SS + stats.D * 14));
            const suggest = Math.max(m.min, TargetStock - pos.available);
            
            const pct = ROP > 0 ? Math.min((pos.available / (ROP * 2)) * 100, 100) : Math.min((pos.available / (m.min * 4)) * 100, 100);

            const matBatches = sortForConsumption((db.batches || []).filter((b) => b.materialId === m.id));
            const activeBatches = matBatches.filter((b) => b.remainingQty > 0);
            const alertBatchCount = activeBatches.filter((b) => ["soon", "expired"].includes(batchStatus(b.expiryDate).level)).length;
            const isExpanded = expandedMat === m.id;

            return (
              <div key={m.id} style={{ padding: "12px 0", borderBottom: i < db.materials.length - 1 ? `1px dashed ${T.line}` : "none" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 24 }}>{m.emoji}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 700 }}>{m.name}</div>
                        <div style={{ fontSize: 10.5, color: T.muted, display: "flex", gap: 10, marginTop: 4, alignItems: "center" }}>
                          <span>D = {stats.D.toFixed(1)}/ngày</span>
                          <span>σD = {stats.sigma_D.toFixed(1)}</span>
                          <label style={{ display: "flex", alignItems: "center", gap: 3 }}>
                            L = <input type="number" min="1" max="60" value={L}
                                  onChange={e => setDb(d => ({ ...d, materials: d.materials.map(x => x.id === m.id ? { ...x, leadTime: parseInt(e.target.value) || 1 } : x) }))}
                                  style={{ width: 36, padding: "2px", fontSize: 10, border: `1px solid ${T.line}`, borderRadius: 4, textAlign: "center", outline: "none" }} /> ngày
                          </label>
                        </div>
                        <div style={{ fontSize: 10, color: T.muted, marginTop: 3 }}>
                          🏷️ {supplier?.name || "Chưa gán NCC"} · MOQ {m.moq ? `${m.moq.toLocaleString("vi-VN")}${m.unit}` : "—"} · Đóng gói {m.packSize ? `${m.packSize.toLocaleString("vi-VN")}${m.unit}/kiện` : "—"}
                        </div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: isLow ? T.redDeep : T.text }}>
                          Khả dụng: {pos.available.toLocaleString("vi-VN")} <span style={{ fontSize: 11 }}>{m.unit}</span>
                        </div>
                        <div style={{ fontSize: 10, color: T.muted, marginTop: 2 }}>
                          Thực tế: {pos.onHand} | Giữ chỗ: {pos.reserved}
                        </div>
                        <div style={{ fontSize: 10, color: statusColor, fontWeight: 700, marginTop: 3 }}>{statusText} (ROP: {ROP} | SS: {SS})</div>
                      </div>
                    </div>
                    <div style={{ height: 6, background: T.pinkSoft, borderRadius: 99, overflow: "hidden" }}>
                      <div style={{ width: `${pct}%`, height: "100%", borderRadius: 99, background: statusColor, transition: "width 0.3s ease, background 0.3s ease" }} />
                    </div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                    <Btn small onClick={() => setModal({ type: "restock", data: { id: m.id, suggest, calcDetails: { D: stats.D, sigma: stats.sigma_D, L, SS, ROP, pos, TargetStock } } })}>
                      + Nhập
                    </Btn>
                    <Btn small onClick={() => setExpandedMat(isExpanded ? null : m.id)} style={alertBatchCount > 0 ? { background: "#FBE3DA", color: T.redDeep } : {}}>
                      Lô {activeBatches.length}{alertBatchCount > 0 ? ` ⚠️${alertBatchCount}` : ""}
                    </Btn>
                  </div>
                </div>
                {isExpanded && (
                  <div style={{ marginTop: 10, background: "#fff", borderRadius: 10, padding: "10px 12px", border: `1px dashed ${T.line}` }}>
                    <div style={{ fontSize: 10.5, fontWeight: 700, color: T.muted, marginBottom: 6 }}>
                      Lô hàng — thứ tự xuất kho FEFO/FIFO (lô trên cùng xuất trước)
                    </div>
                    {matBatches.length === 0 && <div style={{ fontSize: 11, color: T.muted }}>Chưa có lô nào</div>}
                    {matBatches.map((b) => {
                      const st = batchStatus(b.expiryDate);
                      const badgeStyle = {
                        none: ["#F1E9DC", T.muted],
                        ok: ["#E4F0D8", T.greenDeep],
                        soon: ["#FFF2D6", T.yellowDeep],
                        expired: ["#FBE3DA", T.redDeep],
                      }[st.level];
                      return (
                        <div key={b.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8, padding: "6px 0", borderBottom: `1px dashed ${T.line}`, opacity: b.remainingQty > 0 ? 1 : 0.45 }}>
                          <div style={{ fontSize: 11, fontWeight: 700, minWidth: 60 }}>{b.id}</div>
                          <div style={{ fontSize: 10.5, color: T.muted, flex: 1 }}>Nhập {new Date(b.receivedDate).toLocaleDateString("vi-VN")}</div>
                          <div style={{ fontSize: 11, fontWeight: 700, minWidth: 70, textAlign: "right" }}>{b.remainingQty.toLocaleString("vi-VN")}/{b.initialQty.toLocaleString("vi-VN")} {m.unit}</div>
                          <Badge color={badgeStyle[0]} deep={badgeStyle[1]}>{st.label}</Badge>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
          
          <div style={{ marginTop: 24 }}>
            <div style={{ fontSize: 13.5, fontWeight: 700, marginBottom: 12 }}>Lịch sử biến động kho 📋</div>
            <div style={{ background: T.soft, borderRadius: 12, overflow: "hidden" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11.5 }}>
                <thead>
                  <tr style={{ background: "rgba(143,108,59,0.1)", textAlign: "left" }}>
                    <th style={{ padding: "8px 12px", borderBottom: `1px solid ${T.line}`, color: T.text }}>Loại</th>
                    <th style={{ padding: "8px 12px", borderBottom: `1px solid ${T.line}`, color: T.text }}>Mã hàng</th>
                    <th style={{ padding: "8px 12px", borderBottom: `1px solid ${T.line}`, color: T.text, textAlign: "right" }}>Số lượng</th>
                    <th style={{ padding: "8px 12px", borderBottom: `1px solid ${T.line}`, color: T.text }}>Lý do</th>
                    <th style={{ padding: "8px 12px", borderBottom: `1px solid ${T.line}`, color: T.text, textAlign: "right" }}>Thời gian</th>
                  </tr>
                </thead>
                <tbody>
                  {([...(db.transactions || [])].reverse().slice(0, 15).map(tx => {
                    const isIN = tx.type === "IN";
                    return (
                      <tr key={tx.id}>
                        <td style={{ padding: "8px 12px", borderBottom: `1px solid ${T.line}` }}>
                          <Badge color={isIN ? T.greenSoft : T.redSoft} deep={isIN ? T.greenDeep : T.redDeep}>{tx.type}</Badge>
                        </td>
                        <td style={{ padding: "8px 12px", borderBottom: `1px solid ${T.line}`, fontWeight: 600 }}>{tx.itemId}</td>
                        <td style={{ padding: "8px 12px", borderBottom: `1px solid ${T.line}`, textAlign: "right", color: isIN ? T.greenDeep : T.redDeep, fontWeight: 700 }}>
                          {isIN ? "+" : ""}{tx.qty}
                        </td>
                        <td style={{ padding: "8px 12px", borderBottom: `1px solid ${T.line}`, color: T.muted }}>{tx.reason}</td>
                        <td style={{ padding: "8px 12px", borderBottom: `1px solid ${T.line}`, textAlign: "right", color: T.muted }}>
                          {tx.date && !isNaN(new Date(tx.date).getTime()) ? new Date(tx.date).toLocaleString("vi-VN", { month: "numeric", day: "numeric", hour: "2-digit", minute: "2-digit" }) : "—"}
                        </td>
                      </tr>
                    );
                  }))}
                  {(!db.transactions || db.transactions.length === 0) && (
                    <tr><td colSpan={5} style={{ padding: "16px", textAlign: "center", color: T.muted }}>Chưa có giao dịch nào</td></tr>
                  )}
                </tbody>
              </table>
              <div style={{ padding: "8px", textAlign: "center", fontSize: 10.5, color: T.muted, background: "rgba(143,108,59,0.05)" }}>
                Hiển thị 15 biến động gần nhất
              </div>
            </div>
          </div>
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

      {tab === "logistics" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>Sandbox Tối Ưu Kho Hàng 📦</div>
          <div style={{ fontSize: 12, color: T.muted, marginBottom: 8 }}>Mô phỏng trực quan các thuật toán quản lý chuỗi cung ứng (Inventory Management) dựa trên thống kê xác suất.</div>
          
          <Card>
            <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>1. Tối ưu theo CSL (Continuous Review System)</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, display: "flex", justifyContent: "space-between" }}>
                    <span>Mức phục vụ (CSL)</span>
                    <span style={{ color: T.blueDeep }}>{Math.round(csl * 100)}%</span>
                  </div>
                  <input type="range" min="0.5" max="0.999" step="0.01" value={csl} onChange={(e) => setCsl(parseFloat(e.target.value))} style={{ width: "100%", accentColor: T.blue }} />
                </div>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, display: "flex", justifyContent: "space-between" }}>
                    <span>Thời gian chờ (L)</span>
                    <span style={{ color: T.blueDeep }}>{leadTime} ngày</span>
                  </div>
                  <input type="range" min="1" max="30" step="1" value={leadTime} onChange={(e) => setLeadTime(parseInt(e.target.value))} style={{ width: "100%", accentColor: T.blue }} />
                </div>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, display: "flex", justifyContent: "space-between" }}>
                    <span>Nhu cầu trung bình (D)</span>
                    <span style={{ color: T.blueDeep }}>{demand}/ngày</span>
                  </div>
                  <input type="range" min="1" max="100" step="1" value={demand} onChange={(e) => setDemand(parseInt(e.target.value))} style={{ width: "100%", accentColor: T.blue }} />
                </div>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, display: "flex", justifyContent: "space-between" }}>
                    <span>Độ lệch chuẩn nhu cầu (σD)</span>
                    <span style={{ color: T.blueDeep }}>{sigma}</span>
                  </div>
                  <input type="range" min="0" max="50" step="1" value={sigma} onChange={(e) => setSigma(parseInt(e.target.value))} style={{ width: "100%", accentColor: T.blue }} />
                </div>
              </div>
              
              {(() => {
                const SS = Math.ceil(NORMSINV(csl) * Math.sqrt(leadTime * Math.pow(sigma, 2)));
                const ROP = demand * leadTime + SS;
                const Q = demand * 14; 
                const maxInv = SS + Q;
                
                const meanL = demand * leadTime;
                const stdL = Math.sqrt(leadTime * Math.pow(sigma, 2));
                const points = [];
                for(let x = Math.max(0, meanL - 3.5*stdL); x <= meanL + 3.5*stdL; x += (stdL > 0 ? stdL/10 : 1)) {
                  points.push({ x, y: gaussianPDF(x, meanL, stdL) });
                }
                const maxY = Math.max(...points.map(p => p.y), 0.001);
                
                return (
                  <div style={{ background: T.soft, borderRadius: 12, padding: 12, display: "flex", flexDirection: "column", gap: 10 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, fontWeight: 700 }}>
                      <span style={{ color: T.greenDeep }}>SS = {SS}</span>
                      <span style={{ color: T.pinkDeep }}>ROP = {ROP}</span>
                    </div>
                    
                    <div style={{ fontSize: 11, fontWeight: 700, color: T.muted }}>Biểu đồ chu kỳ tồn kho (Sawtooth)</div>
                    <svg viewBox="0 0 200 80" style={{ width: "100%", height: 80, overflow: "visible" }}>
                      <rect x="0" y="0" width="200" height="80" fill="#fff" rx="4" />
                      <line x1="0" y1={80 - (SS/maxInv)*80} x2="200" y2={80 - (SS/maxInv)*80} stroke={T.green} strokeWidth="1" strokeDasharray="3 3" />
                      <line x1="0" y1={80 - (ROP/maxInv)*80} x2="200" y2={80 - (ROP/maxInv)*80} stroke={T.pink} strokeWidth="1" strokeDasharray="3 3" />
                      <path d={`M 0,${80 - (maxInv/maxInv)*80} L 60,${80 - (SS/maxInv)*80} L 60,${80 - (maxInv/maxInv)*80} L 120,${80 - (SS/maxInv)*80} L 120,${80 - (maxInv/maxInv)*80} L 180,${80 - (SS/maxInv)*80}`} fill="none" stroke={T.blue} strokeWidth="2" strokeLinejoin="round" />
                      <text x="198" y={80 - (SS/maxInv)*80 - 4} fontSize="8" fill={T.greenDeep} textAnchor="end">SS</text>
                      <text x="198" y={80 - (ROP/maxInv)*80 - 4} fontSize="8" fill={T.pinkDeep} textAnchor="end">ROP</text>
                    </svg>

                    <div style={{ fontSize: 11, fontWeight: 700, color: T.muted }}>Phân phối chuẩn nhu cầu L={leadTime}</div>
                    <svg viewBox="0 0 200 80" style={{ width: "100%", height: 80, overflow: "visible" }}>
                      <rect x="0" y="0" width="200" height="80" fill="#fff" rx="4" />
                      {points.length > 0 && (
                        <>
                          <path d={`M ${points.map(p => `${((p.x - points[0].x)/(points[points.length-1].x - points[0].x))*200},${80 - (p.y/maxY)*70}`).join(" L ")}`} fill="none" stroke={T.blueDeep} strokeWidth="1.5" />
                          <path d={`M ${((ROP - points[0].x)/(points[points.length-1].x - points[0].x))*200},0 L ${((ROP - points[0].x)/(points[points.length-1].x - points[0].x))*200},80`} fill="none" stroke={T.red} strokeWidth="1" strokeDasharray="2 2" />
                          <text x={((meanL - points[0].x)/(points[points.length-1].x - points[0].x))*200} y="78" fontSize="8" fill={T.muted} textAnchor="middle">μ={meanL.toFixed(1)}</text>
                          <text x={Math.min(185, ((ROP - points[0].x)/(points[points.length-1].x - points[0].x))*200 + 4)} y="10" fontSize="8" fill={T.redDeep}>Hết hàng</text>
                        </>
                      )}
                    </svg>
                  </div>
                );
              })()}
            </div>
          </Card>

          <Card>
            <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>2. Tối ưu theo mô hình Newsvendor (Hàng mùa vụ)</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, display: "flex", justifyContent: "space-between" }}>
                    <span>Giá bán (p)</span>
                    <span style={{ color: T.greenDeep }}>{optPrice}k</span>
                  </div>
                  <input type="range" min="10" max="300" step="5" value={optPrice} onChange={(e) => setOptPrice(parseInt(e.target.value))} style={{ width: "100%", accentColor: T.green }} />
                </div>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, display: "flex", justifyContent: "space-between" }}>
                    <span>Chi phí sx (c)</span>
                    <span style={{ color: T.redDeep }}>{optCost}k</span>
                  </div>
                  <input type="range" min="5" max="250" step="5" value={optCost} onChange={(e) => setOptCost(parseInt(e.target.value))} style={{ width: "100%", accentColor: T.red }} />
                </div>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, display: "flex", justifyContent: "space-between" }}>
                    <span>Giá thanh lý (s)</span>
                    <span style={{ color: T.yellowDeep }}>{optSalvage}k</span>
                  </div>
                  <input type="range" min="0" max="250" step="5" value={optSalvage} onChange={(e) => setOptSalvage(parseInt(e.target.value))} style={{ width: "100%", accentColor: T.yellow }} />
                </div>
              </div>
              
              {(() => {
                let issues = [];
                if (optCost >= optPrice) issues.push("Lỗ vốn! Chi phí > Giá bán");
                if (optSalvage >= optCost) issues.push("Thanh lý có lời? Rủi ro đạo đức!");
                
                const Cu = optPrice - optCost; 
                const Co = optCost - optSalvage; 
                const optCSL = issues.length === 0 ? Cu / (Cu + Co) : 0;
                
                return (
                  <div style={{ background: T.soft, borderRadius: 12, padding: 12, display: "flex", flexDirection: "column", gap: 10 }}>
                    {issues.length > 0 ? (
                      <div style={{ color: T.redDeep, fontSize: 12, fontWeight: 700 }}>{issues.join(" - ")}</div>
                    ) : (
                      <>
                        <div style={{ fontSize: 11.5, color: T.muted }}>Chi phí thiếu (Cu) = {Cu}k, Chi phí thừa (Co) = {Co}k</div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: T.blueDeep }}>Mức phục vụ tối ưu (CR): {(optCSL * 100).toFixed(1)}%</div>
                        <div style={{ fontSize: 11.5, color: T.text, marginTop: 4 }}>
                          Áp dụng vào phân phối chuẩn bên trên, hệ thống sẽ tự động điều chỉnh CSL thành <b>{(optCSL * 100).toFixed(1)}%</b> để đạt được lợi nhuận cao nhất!
                        </div>
                        <Btn small onClick={() => setCsl(optCSL)} style={{ marginTop: 8 }}>Áp dụng CSL = {(optCSL * 100).toFixed(1)}%</Btn>
                      </>
                    )}
                  </div>
                );
              })()}
            </div>
          </Card>
        </div>
      )}

      {modal?.type === "restock" && (
        <RestockModal
          material={db.materials.find((m) => m.id === modal.data.id)}
          suggestedQty={modal.data.suggest}
          calcDetails={modal.data.calcDetails}
          onClose={() => setModal(null)}
          onSave={(qty, newPrice, expiryDate) => {
            setDb((d) => {
              const nextBatchNum = d.nextBatchNum || 1;
              const batch = {
                id: `LOT-${nextBatchNum}`,
                materialId: modal.data.id,
                receivedDate: new Date().toISOString().slice(0, 10),
                expiryDate: expiryDate || null,
                initialQty: qty,
                remainingQty: qty,
                unitCost: newPrice,
                qcStatus: "passed",
              };
              const batches = [...(d.batches || []), batch];
              const tx = { id: `TX-${d.nextTxNum || 1}`, type: "IN", itemId: modal.data.id, qty, reason: "Nhập mua hàng", date: new Date().toISOString(), batchId: batch.id };
              return {
                ...d,
                transactions: [...(d.transactions || []), tx],
                nextTxNum: (d.nextTxNum || 1) + 1,
                batches,
                nextBatchNum: nextBatchNum + 1,
                materials: syncMaterialQtyFromBatches(d.materials, batches).map((m) => (m.id === modal.data.id ? { ...m, price: newPrice } : m)),
              };
            });
            setModal(null);
            showToast("Đã nhập kho, tạo lô mới và giao dịch! 🧺");
          }}
        />
      )}
      {modal?.type === "editPrice" && (
        <PriceModal
          product={db.products.find((p) => p.id === modal.data)}
          recipe={RECIPES[modal.data]}
          onClose={() => setModal(null)}
          onSave={(price, salvage, isSeasonal) => {
            setDb((d) => ({ ...d, products: d.products.map((p) => (p.id === modal.data ? { ...p, price, salvage, isSeasonal } : p)) }));
            setModal(null);
            showToast("Đã cập nhật cấu hình sản phẩm ✏️");
          }}
        />
      )}
      {modal?.type === "newPo" && (
        <ProductionModal
          products={db.products}
          materials={db.materials}
          onClose={() => setModal(null)}
          onSave={(productId, qty) => {
            setDb(d => ({
              ...d,
              productionOrders: [...(d.productionOrders||[]), { id: `PO-${d.nextPoNum||1}`, productId, qty, status: "draft", created: new Date().toISOString() }],
              nextPoNum: (d.nextPoNum||1) + 1
            }));
            setModal(null);
            showToast("Tạo Lệnh sản xuất thành công!");
          }}
        />
      )}
    </div>
  );
}

function ProductionModal({ products, materials, onClose, onSave }) {
  const [productId, setProductId] = useState(products[0]?.id || "");
  const [qty, setQty] = useState(10);
  
  const r = RECIPES[productId];
  const canMake = (() => {
    if (!r) return 0;
    let n = Infinity;
    for (const [mid, per] of BOM[productId] || []) {
      const m = materials.find((x) => x.id === mid);
      n = Math.min(n, Math.floor((m?.qty ?? 0) / per));
    }
    return n === Infinity ? 0 : n;
  })();

  return (
    <Modal title={`Tạo Lệnh Sản Xuất`} onClose={onClose}>
      <div style={{ marginBottom: 12 }}>
        <div style={{ fontSize: 11.5, fontWeight: 700, color: T.muted, marginBottom: 4 }}>Chọn sản phẩm:</div>
        <select value={productId} onChange={e => setProductId(e.target.value)} style={{ width: "100%", padding: 8, borderRadius: 8, border: `1px solid ${T.line}`, outline: "none", fontSize: 13, fontFamily: "inherit" }}>
          {products.map(p => {
             const rr = RECIPES[p.id];
             return <option key={p.id} value={p.id}>{rr?.emoji} {rr?.name}</option>
          })}
        </select>
      </div>
      <Input label="Số lượng cần sản xuất" type="number" value={qty} onChange={setQty} />
      <div style={{ fontSize: 11.5, color: T.muted, marginBottom: 10 }}>
        Tồn nguyên liệu hiện tại đủ làm tối đa: <b style={{ color: canMake >= qty ? T.greenDeep : T.redDeep }}>{canMake} cây</b>
      </div>
      <Btn primary disabled={qty <= 0} style={{ width: "100%" }} onClick={() => onSave(productId, qty)}>
        Tạo lệnh 🏭
      </Btn>
    </Modal>
  );
}

function RestockModal({ material, suggestedQty, calcDetails, onClose, onSave }) {
  const [qty, setQty] = useState(suggestedQty ?? 1000);
  const [price, setPrice] = useState(material?.price ?? 0);
  const [expiryDate, setExpiryDate] = useState("");
  if (!material) return null;
  return (
    <Modal title={`Nhập kho — ${material.emoji} ${material.name}`} onClose={onClose}>
      <div style={{ fontSize: 12, color: T.muted, marginBottom: 14 }}>
        Khả dụng hiện tại: <b style={{ color: T.text }}>{calcDetails?.pos?.available || material.qty} {material.unit}</b>
        {calcDetails && (
          <div style={{ background: T.soft, padding: "12px 14px", borderRadius: 10, marginTop: 10, color: T.text }}>
            <div style={{ fontWeight: 700, marginBottom: 6, color: T.blueDeep, display: "flex", gap: 6, alignItems: "center" }}>
              <span style={{ fontSize: 16 }}>🤖</span> AI Khuyến nghị Đặt hàng: {suggestedQty.toLocaleString("vi-VN")} {material.unit}
            </div>
            <ul style={{ paddingLeft: 18, margin: 0, display: "flex", flexDirection: "column", gap: 5, fontSize: 11.5 }}>
              <li>Tốc độ tiêu thụ (D): <b>{calcDetails.D.toFixed(1)}/ngày</b> (độ lệch ±{calcDetails.sigma.toFixed(1)})</li>
              <li>Lead Time (L): <b>{calcDetails.L} ngày</b></li>
              <li>Tồn kho an toàn (SS): <b>{calcDetails.SS.toLocaleString("vi-VN")}</b></li>
              <li>Điểm đặt hàng lại (ROP): <b>{calcDetails.ROP.toLocaleString("vi-VN")}</b> = (D × L) + SS</li>
              <li>Mức tồn kho mục tiêu (Target Stock): <b>{calcDetails.TargetStock.toLocaleString("vi-VN")}</b></li>
            </ul>
            <div style={{ marginTop: 10, fontSize: 11, fontStyle: "italic", opacity: 0.85, lineHeight: 1.4 }}>
              Vì mức khả dụng hiện tại ({calcDetails.pos.available}) đang thấp hơn ROP, hệ thống đề xuất nhập thêm <b>{suggestedQty.toLocaleString("vi-VN")}</b> để lấp đầy lên mức an toàn Target Stock (đủ dùng cho {calcDetails.L + 14} ngày tới).
            </div>
          </div>
        )}
      </div>
      <Input label={`Số lượng nhập (${material.unit})`} type="number" value={qty} onChange={setQty} />
      <Input label="Đơn giá nhập (đ)" type="number" value={price} onChange={setPrice} />
      <Input label="Hạn sử dụng lô này (để trống nếu NVL không có hạn dùng)" type="date" value={expiryDate} onChange={setExpiryDate} />
      <div style={{ fontSize: 11.5, color: T.muted, marginBottom: 10 }}>
        Ước tính chi phí: <b style={{ color: T.pinkDeep }}>{fmtVND(Math.round(qty * price))}</b>
      </div>
      <Btn primary disabled={qty <= 0 || price < 0} style={{ width: "100%" }} onClick={() => onSave(qty, price, expiryDate || null)}>
        Nhập kho 🧺
      </Btn>
    </Modal>
  );
}

function PriceModal({ product, recipe, onClose, onSave }) {
  const [price, setPrice] = useState(product?.price ?? 0);
  const [salvage, setSalvage] = useState(product?.salvage ?? Math.round((product?.cost ?? 0) * 0.5));
  const [isSeasonal, setIsSeasonal] = useState(product?.isSeasonal ?? false);
  if (!product) return null;
  const margin = price > 0 ? Math.round(((price - product.cost) / price) * 100) : 0;
  return (
    <Modal title={`Cấu hình — ${recipe.emoji} ${recipe.name}`} onClose={onClose}>
      <Input label="Giá bán (đ)" type="number" value={price} onChange={setPrice} />
      
      <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 12, marginTop: 4 }}>
        <input type="checkbox" checked={isSeasonal} onChange={e => setIsSeasonal(e.target.checked)} id="cb-seasonal" style={{ width: 16, height: 16, accentColor: T.pink }} />
        <label htmlFor="cb-seasonal" style={{ fontSize: 13, fontWeight: 700, color: T.text, cursor: "pointer" }}>Sản phẩm Mùa vụ (Dùng thuật toán Newsvendor)</label>
      </div>

      {isSeasonal && (
        <>
          <div style={{ fontSize: 11, color: T.muted, marginBottom: 10, background: T.soft, padding: 8, borderRadius: 8 }}>
            Hàng mùa vụ (VD: Valentine, Giáng Sinh) sẽ bị ế nếu qua mùa. Vui lòng nhập <b>Giá thanh lý</b> để thuật toán tính toán rủi ro tồn kho.
          </div>
          <Input label="Giá thanh lý (đ) - tính CSL" type="number" value={salvage} onChange={setSalvage} />
        </>
      )}
      
      <div style={{ fontSize: 12, color: T.muted, marginBottom: 12 }}>
        Giá vốn {fmtVND(product.cost)} → biên lãi <b style={{ color: margin >= 40 ? T.greenDeep : T.yellowDeep }}>{margin}%</b>
      </div>
      <Btn primary disabled={price <= 0 || (isSeasonal && salvage < 0)} style={{ width: "100%" }} onClick={() => onSave(price, salvage, isSeasonal)}>
        Lưu ✏️
      </Btn>
    </Modal>
  );
}
