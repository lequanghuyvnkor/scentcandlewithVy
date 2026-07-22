import { useState } from "react";
import { T, TYPE } from "../data/theme";
import { Btn, Input } from "./ui/Primitives";
import { fmtVND } from "../utils/formatters";

/**
 * Shared checkout UI. If `identity` is already known (customer logged in
 * via the corner login), skip asking name/phone again — otherwise collect
 * it inline so guests can still complete a purchase without a full login.
 *
 * Uses its own modal shell (not the shared <Modal>) so it can carry the
 * dark "LIGHT variant" header strip instead of the default light header.
 */
export function CheckoutModal({ identity, summaryLines, total, onClose, onConfirm }) {
  const [name, setName] = useState(identity?.name ?? "");
  const [phone, setPhone] = useState(identity?.phone ?? "");

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(45,40,34,0.6)",
        backdropFilter: "blur(4px)",
        zIndex: 50,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: T.card,
          borderRadius: 2,
          width: "100%",
          maxWidth: 460,
          maxHeight: "88vh",
          overflowY: "auto",
          border: `1px solid ${T.line}`,
        }}
      >
        <div
          style={{
            background: T.dark,
            padding: "20px 36px 24px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <div>
            <div style={{ ...TYPE.eyebrow, color: T.gold, marginBottom: 10 }}>SOLACE</div>
            <div style={{ fontSize: 20, fontFamily: "'Cinzel',serif", fontWeight: 400, color: T.card }}>Order Summary</div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "transparent",
              border: `1px solid ${T.gold}33`,
              color: `${T.card}88`,
              width: 32,
              height: 32,
              cursor: "pointer",
              fontSize: 12,
              borderRadius: 0,
              fontFamily: "'Josefin Sans',sans-serif",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            ✕
          </button>
        </div>

        <div style={{ padding: "28px 36px 36px" }}>
          {summaryLines.map((l, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: 13,
                fontFamily: "'Josefin Sans',sans-serif",
                fontWeight: 300,
                color: T.textSub,
                padding: "8px 0",
                borderBottom: `1px solid ${T.lineHair}`,
              }}
            >
              <span>{l.label}</span>
              <span style={{ fontWeight: 600, color: T.text }}>{fmtVND(l.amount)}</span>
            </div>
          ))}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
              paddingTop: 14,
              marginTop: 4,
              borderTop: `1px solid ${T.line}`,
              marginBottom: 24,
            }}
          >
            <span style={{ fontSize: 11, fontFamily: "'Josefin Sans',sans-serif", fontWeight: 300, letterSpacing: "0.15em", textTransform: "uppercase", color: T.muted }}>
              Total
            </span>
            <span style={{ fontSize: 22, fontFamily: "'Cinzel',serif", fontWeight: 400, color: T.text }}>{fmtVND(total)}</span>
          </div>
          {!identity && (
            <>
              <Input label="Tên của bạn" value={name} onChange={setName} placeholder="VD: Chị Hoa" />
              <Input label="Số điện thoại" value={phone} onChange={setPhone} placeholder="09xx xxx xxx" />
            </>
          )}
          {identity && (
            <div style={{ fontSize: 11, fontFamily: "'Josefin Sans',sans-serif", fontWeight: 300, color: T.muted, marginBottom: 20 }}>
              Giao tới: <b style={{ color: T.text, fontWeight: 600 }}>{identity.name}</b>
              {identity.phone && ` · ${identity.phone}`}
            </div>
          )}
          <Btn variant="primary" disabled={!name.trim()} style={{ width: "100%" }} onClick={() => onConfirm({ name: name.trim(), phone: phone.trim() })}>
            Place Order
          </Btn>
        </div>
      </div>
    </div>
  );
}
