import { useState } from "react";
import { T, ADMIN_PASSCODE } from "../data/theme";
import { Btn, Input, Modal } from "./ui/Primitives";

export function Header({ view, setView, identity, adminAuthed, onOpenLogin, onLogout }) {
  const NAV = adminAuthed 
    ? [{ id: "admin", label: "Quản lý" }]
    : [
        { id: "home", label: "Trang chủ" },
        { id: "shop", label: "Cửa hàng" },
        { id: "sim", label: "Mô phỏng" }
      ];
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        maxWidth: 1040,
        margin: "0 auto 20px",
        padding: "14px 16px",
        flexWrap: "wrap",
        gap: 10,
      }}
    >
      <div onClick={() => setView(adminAuthed ? "admin" : "home")} style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
        <span style={{ fontSize: 24 }}>🕯️</span>
        <span style={{ fontSize: 17, fontWeight: 700, color: T.pinkDeep }}>Candle Studio</span>
      </div>

      <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
        {NAV.map((n) => (
          <button
            key={n.id}
            onClick={() => setView(n.id)}
            style={{
              padding: "8px 16px",
              borderRadius: 999,
              border: "none",
              cursor: "pointer",
              fontFamily: "inherit",
              fontSize: 13,
              fontWeight: 700,
              background: view === n.id ? T.pink : "transparent",
              color: view === n.id ? "#fff" : T.text,
            }}
          >
            {n.label}
          </button>
        ))}
      </div>

      {identity || adminAuthed ? (
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 12.5, color: T.muted }}>{adminAuthed ? "🔑 Quản lý" : `👋 ${identity.name}`}</span>
          <button
            onClick={onLogout}
            style={{
              padding: "6px 14px",
              borderRadius: 999,
              border: `2px solid ${T.line}`,
              background: "#fff",
              cursor: "pointer",
              fontFamily: "inherit",
              fontSize: 12,
              color: T.muted,
              fontWeight: 700,
            }}
          >
            Đăng xuất
          </button>
        </div>
      ) : (
        <button
          onClick={onOpenLogin}
          style={{
            padding: "8px 18px",
            borderRadius: 999,
            border: "none",
            cursor: "pointer",
            fontFamily: "inherit",
            fontSize: 13,
            fontWeight: 700,
            background: T.pinkSoft,
            color: T.pinkDeep,
          }}
        >
          Đăng nhập
        </button>
      )}
    </div>
  );
}

export function LoginModal({ onClose, onCustomer, onAdmin }) {
  const [tab, setTab] = useState("customer");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState("");

  return (
    <Modal title="Đăng nhập" onClose={onClose}>
      <div style={{ display: "flex", gap: 6, marginBottom: 14 }}>
        <button
          onClick={() => setTab("customer")}
          style={{
            flex: 1,
            padding: "8px",
            borderRadius: 12,
            cursor: "pointer",
            fontFamily: "inherit",
            fontSize: 12.5,
            fontWeight: 700,
            border: `2px solid ${tab === "customer" ? T.pink : T.line}`,
            background: tab === "customer" ? T.pinkSoft : "#fff",
            color: tab === "customer" ? T.pinkDeep : T.muted,
          }}
        >
          🛍️ Khách hàng
        </button>
        <button
          onClick={() => setTab("admin")}
          style={{
            flex: 1,
            padding: "8px",
            borderRadius: 12,
            cursor: "pointer",
            fontFamily: "inherit",
            fontSize: 12.5,
            fontWeight: 700,
            border: `2px solid ${tab === "admin" ? T.pink : T.line}`,
            background: tab === "admin" ? T.pinkSoft : "#fff",
            color: tab === "admin" ? T.pinkDeep : T.muted,
          }}
        >
          🔑 Quản lý
        </button>
      </div>

      {tab === "customer" ? (
        <>
          <Input label="Tên của bạn" value={name} onChange={setName} placeholder="VD: Chị Hoa" />
          <Input label="Số điện thoại" value={phone} onChange={setPhone} placeholder="09xx xxx xxx" />
          <Btn primary disabled={!name.trim()} style={{ width: "100%" }} onClick={() => onCustomer({ name: name.trim(), phone: phone.trim() })}>
            Vào cửa hàng 🌸
          </Btn>
        </>
      ) : (
        <>
          <Input label="Mật khẩu" type="password" value={passcode} onChange={setPasscode} placeholder="Nhập mật khẩu" />
          {error && <div style={{ fontSize: 11.5, color: T.redDeep, marginBottom: 8 }}>{error}</div>}
          <Btn
            primary
            style={{ width: "100%" }}
            onClick={() => {
              if (passcode === ADMIN_PASSCODE) onAdmin();
              else setError("Mật khẩu không đúng 🥺");
            }}
          >
            Đăng nhập ✓
          </Btn>
          <div style={{ fontSize: 10.5, color: T.muted, marginTop: 10, textAlign: "center" }}>Gợi ý demo: {ADMIN_PASSCODE}</div>
        </>
      )}
    </Modal>
  );
}
