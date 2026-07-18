import { useState } from "react";
import { THEME, COLORS } from "../data/theme";
import { Card, Button, Badge } from "./ui/Primitives";
import { fmtVND, orderTotal } from "../utils/formatters";

const STATUSES = [
  { id: "new", label: "Mới", emoji: "🌱" },
  { id: "confirmed", label: "Xác nhận", emoji: "💌" },
  { id: "producing", label: "Sản xuất", emoji: "🕯️" },
  { id: "packing", label: "Đóng gói", emoji: "🎀" },
  { id: "done", label: "Hoàn tất", emoji: "💗" },
];

export function Distribution({ db, onUpdateOrder }) {
  const [selectedOrder, setSelectedOrder] = useState(null);

  return (
    <div style={{ fontFamily: "'Quicksand',sans-serif" }}>
      <div style={{ textAlign: "center", marginBottom: 20 }}>
        <div style={{ fontSize: 22, fontWeight: 700, color: THEME.pinkDeep }}>
          📦 Quản lý đơn hàng
        </div>
      </div>

      {/* Kanban board */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(5, 1fr)",
          gap: 12,
          overflowX: "auto",
        }}
      >
        {STATUSES.map((status) => {
          const orders = db.orders.filter((o) => o.status === status.id);
          return (
            <div key={status.id}>
              <div
                style={{
                  background: COLORS.status[status.id].color,
                  borderRadius: 12,
                  padding: "8px 6px",
                  marginBottom: 10,
                  textAlign: "center",
                  fontSize: 11.5,
                  fontWeight: 700,
                  color: COLORS.status[status.id].deep,
                }}
              >
                {status.emoji} {status.label} ({orders.length})
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {orders.map((order) => (
                  <Card
                    key={order.id}
                    onClick={() => setSelectedOrder(order)}
                    style={{
                      padding: "10px 11px",
                      borderRadius: 14,
                      cursor: "pointer",
                    }}
                  >
                    <div
                      style={{
                        fontSize: 11.5,
                        fontWeight: 700,
                        color: THEME.pinkDeep,
                        marginBottom: 4,
                      }}
                    >
                      {order.id}
                    </div>
                    {order.items.map(([productId, qty]) => (
                      <div key={productId} style={{ fontSize: 10, color: THEME.muted }}>
                        {productId} ×{qty}
                      </div>
                    ))}
                    <div
                      style={{
                        fontSize: 11.5,
                        fontWeight: 700,
                        marginTop: 5,
                      }}
                    >
                      {fmtVND(orderTotal(order, db.products))}
                    </div>
                  </Card>
                ))}
                {orders.length === 0 && (
                  <div
                    style={{
                      fontSize: 10,
                      color: "#D8C2C9",
                      textAlign: "center",
                      padding: "14px 0",
                    }}
                  >
                    trống ✿
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Order detail */}
      {selectedOrder && (
        <Card style={{ marginTop: 20 }}>
          <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>
            Chi tiết {selectedOrder.id}
          </div>
          <div style={{ fontSize: 12, color: THEME.muted }}>
            Tạo: {selectedOrder.created}
          </div>
          <div
            style={{
              display: "flex",
              gap: 8,
              marginTop: 12,
              flexWrap: "wrap",
            }}
          >
            {STATUSES.map((s, i) => {
              const canMove =
                STATUSES.findIndex((st) => st.id === selectedOrder.status) <= i;
              return (
                <Button
                  key={s.id}
                  small
                  primary={s.id === selectedOrder.status}
                  disabled={!canMove}
                  onClick={() => {
                    onUpdateOrder({
                      ...selectedOrder,
                      status: s.id,
                    });
                    setSelectedOrder(null);
                  }}
                >
                  {s.emoji} {s.label}
                </Button>
              );
            })}
          </div>
        </Card>
      )}
    </div>
  );
}
