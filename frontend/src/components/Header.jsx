import { useState } from "react";
import { T, ADMIN_PASSCODE } from "../data/theme";
import { Btn, Input, Modal, Submark } from "./ui/Primitives";

export function Header({ view, setView, identity, adminAuthed, onOpenLogin, onLogout }) {
  const NAV = adminAuthed
    ? [{ id: "admin", label: "ADMIN" }]
    : [
        { id: "home", label: "HOME" },
        { id: "shop", label: "COLLECTION" },
        { id: "sim", label: "ATELIER" },
      ];
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        maxWidth: 1040,
        margin: "0 auto 32px",
        padding: "16px 24px",
        borderBottom: `1px solid ${T.line}`,
        flexWrap: "wrap",
        gap: 12,
      }}
    >
      <div onClick={() => setView(adminAuthed ? "admin" : "home")} style={{ display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }}>
        <Submark onDark={false} />
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ fontSize: 20, fontFamily: "'Cinzel',serif", fontWeight: 400, letterSpacing: "0.45em", paddingLeft: "0.45em", color: T.text }}>
            SOLACE
          </span>
          <span style={{ fontSize: 8, fontFamily: "'Josefin Sans',sans-serif", fontWeight: 200, letterSpacing: "0.3em", textTransform: "uppercase", color: T.muted }}>
            Bespoke · Saigon
          </span>
        </div>
      </div>

      <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
        {NAV.map((n) => {
          const active = view === n.id;
          return (
            <button
              key={n.id}
              onClick={() => setView(n.id)}
              style={{
                fontFamily: "'Josefin Sans',sans-serif",
                fontSize: 10,
                fontWeight: 300,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                padding: "6px 14px",
                border: "none",
                background: "transparent",
                cursor: "pointer",
                color: active ? T.gold : T.muted,
                borderBottom: active ? `1px solid ${T.gold}` : "1px solid transparent",
                borderRadius: 0,
              }}
            >
              {n.label}
            </button>
          );
        })}
      </div>

      {identity || adminAuthed ? (
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 10, fontFamily: "'Josefin Sans',sans-serif", fontWeight: 300, letterSpacing: "0.08em", color: T.muted }}>
            {adminAuthed ? "ADMIN" : `— ${identity.name}`}
          </span>
          <Btn small onClick={onLogout}>
            SIGN OUT
          </Btn>
        </div>
      ) : (
        <Btn small onClick={onOpenLogin}>
          SIGN IN
        </Btn>
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
    <Modal title="SIGN IN" onClose={onClose}>
      <div style={{ display: "flex", gap: 24, marginBottom: 24, borderBottom: `1px solid ${T.line}` }}>
        {[
          { id: "customer", label: "CLIENT" },
          { id: "admin", label: "ADMIN" },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            style={{
              padding: "0 0 10px",
              cursor: "pointer",
              fontFamily: "'Josefin Sans',sans-serif",
              fontSize: 10,
              fontWeight: 300,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              border: "none",
              borderBottom: tab === t.id ? `1px solid ${T.gold}` : "1px solid transparent",
              background: "transparent",
              color: tab === t.id ? T.text : T.muted,
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "customer" ? (
        <>
          <Input label="Tên của bạn" value={name} onChange={setName} placeholder="VD: Chị Hoa" />
          <Input label="Số điện thoại" value={phone} onChange={setPhone} placeholder="09xx xxx xxx" />
          <Btn variant="primary" disabled={!name.trim()} style={{ width: "100%" }} onClick={() => onCustomer({ name: name.trim(), phone: phone.trim() })}>
            Vào cửa hàng
          </Btn>
        </>
      ) : (
        <>
          <Input label="Mật khẩu" type="password" value={passcode} onChange={setPasscode} placeholder="Nhập mật khẩu" />
          {error && <div style={{ fontSize: 11, fontFamily: "'Josefin Sans',sans-serif", fontWeight: 300, color: T.redDeep, marginBottom: 12 }}>{error}</div>}
          <Btn
            variant="primary"
            style={{ width: "100%" }}
            onClick={() => {
              if (passcode === ADMIN_PASSCODE) onAdmin();
              else setError("Mật khẩu không đúng.");
            }}
          >
            Đăng nhập
          </Btn>
          <div style={{ fontSize: 10, fontFamily: "'Josefin Sans',sans-serif", fontWeight: 300, color: T.muted, marginTop: 14, textAlign: "center" }}>
            Demo passcode: {ADMIN_PASSCODE}
          </div>
        </>
      )}
    </Modal>
  );
}
