import { T as THEME } from "../../data/theme";

export function Card({ children, style, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        background: THEME.card,
        borderRadius: 18,
        padding: "14px 16px",
        border: `1.5px solid ${THEME.line}`,
        boxShadow: "0 2px 8px rgba(230,150,175,0.08)",
        cursor: onClick ? "pointer" : "default",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export function Button({ children, onClick, primary, danger, small, disabled, style }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        padding: small ? "6px 14px" : "10px 22px",
        borderRadius: 999,
        cursor: disabled ? "default" : "pointer",
        fontFamily: "inherit",
        fontSize: small ? 12 : 13.5,
        fontWeight: 700,
        border: "none",
        background: disabled
          ? "#EEDDE2"
          : danger
            ? THEME.red
            : primary
              ? THEME.pink
              : THEME.pinkSoft,
        color: disabled ? "#C4AAB2" : danger ? "#fff" : primary ? "#fff" : THEME.pinkDeep,
        boxShadow: primary && !disabled ? "0 3px 10px rgba(246,168,192,0.4)" : "none",
        ...style,
      }}
    >
      {children}
    </button>
  );
}

export function Input({ label, value, onChange, type = "text", placeholder, style }) {
  return (
    <div style={{ marginBottom: 10, ...style }}>
      {label && (
        <div
          style={{
            fontSize: 11.5,
            color: THEME.muted,
            marginBottom: 4,
            fontWeight: 600,
          }}
        >
          {label}
        </div>
      )}
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) =>
          onChange(type === "number" ? +e.target.value : e.target.value)
        }
        style={{
          width: "100%",
          boxSizing: "border-box",
          padding: "9px 13px",
          borderRadius: 12,
          border: `2px solid ${THEME.line}`,
          fontFamily: "inherit",
          fontSize: 13,
          color: THEME.text,
          background: "#fff",
          outline: "none",
        }}
      />
    </div>
  );
}

export function Badge({ children, color, deep }) {
  return (
    <span
      style={{
        fontSize: 10.5,
        fontWeight: 700,
        padding: "3px 10px",
        borderRadius: 99,
        background: color,
        color: deep ?? THEME.text,
      }}
    >
      {children}
    </span>
  );
}

export function Modal({ title, onClose, children }) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(122,92,100,0.35)",
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
          background: THEME.card,
          borderRadius: 22,
          padding: "20px 22px",
          width: "100%",
          maxWidth: 440,
          maxHeight: "85vh",
          overflowY: "auto",
          boxShadow: "0 10px 40px rgba(122,92,100,0.25)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 14,
          }}
        >
          <div style={{ fontSize: 16, fontWeight: 700 }}>{title}</div>
          <button
            onClick={onClose}
            style={{
              border: "none",
              background: THEME.pinkSoft,
              borderRadius: 99,
              width: 30,
              height: 30,
              cursor: "pointer",
              fontSize: 14,
              color: THEME.pinkDeep,
              fontWeight: 700,
            }}
          >
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

// Alias — code mới dùng tên Btn thay vì Button
export const Btn = Button;

export function Toast({ message, isSuccess }) {
  if (!message) return null;
  return (
    <div
      style={{
        position: "fixed",
        bottom: 22,
        left: "50%",
        transform: "translateX(-50%)",
        background: isSuccess ? THEME.card : "#FFF0F0",
        border: `2px solid ${isSuccess ? THEME.pink : THEME.red}`,
        borderRadius: 999,
        padding: "10px 22px",
        fontSize: 12.5,
        fontWeight: 700,
        color: isSuccess ? THEME.pinkDeep : THEME.redDeep,
        zIndex: 99,
        maxWidth: "88%",
        boxShadow: "0 6px 20px rgba(122,92,100,0.2)",
        fontFamily: "'Quicksand',sans-serif",
      }}
    >
      {message}
    </div>
  );
}
