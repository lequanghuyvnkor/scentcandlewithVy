import { useState } from "react";
import { T } from "../data/theme";
import { Btn, Input, Modal } from "./ui/Primitives";
import { fmtVND } from "../utils/formatters";

/**
 * Shared checkout UI. If `identity` is already known (customer logged in
 * via the corner login), skip asking name/phone again — otherwise collect
 * it inline so guests can still complete a purchase without a full login.
 */
export function CheckoutModal({ identity, summaryLines, total, onClose, onConfirm }) {
  const [name, setName] = useState(identity?.name ?? "");
  const [phone, setPhone] = useState(identity?.phone ?? "");

  return (
    <Modal title="Xác nhận đơn hàng 💌" onClose={onClose}>
      {summaryLines.map((l, i) => (
        <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, marginBottom: 8 }}>
          <span>{l.label}</span>
          <span style={{ fontWeight: 700 }}>{fmtVND(l.amount)}</span>
        </div>
      ))}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          paddingTop: 10,
          borderTop: `1.5px dashed ${T.line}`,
          fontSize: 14,
          fontWeight: 700,
          marginBottom: 14,
        }}
      >
        <span>Tổng</span>
        <span style={{ color: T.pinkDeep }}>{fmtVND(total)}</span>
      </div>
      {!identity && (
        <>
          <Input label="Tên của bạn" value={name} onChange={setName} placeholder="VD: Chị Hoa" />
          <Input label="Số điện thoại" value={phone} onChange={setPhone} placeholder="09xx xxx xxx" />
        </>
      )}
      {identity && (
        <div style={{ fontSize: 11.5, color: T.muted, marginBottom: 12 }}>
          Giao tới: <b style={{ color: T.text }}>{identity.name}</b>
          {identity.phone && ` · ${identity.phone}`}
        </div>
      )}
      <Btn primary disabled={!name.trim()} style={{ width: "100%" }} onClick={() => onConfirm({ name: name.trim(), phone: phone.trim() })}>
        Xác nhận đặt hàng 🌸
      </Btn>
    </Modal>
  );
}
