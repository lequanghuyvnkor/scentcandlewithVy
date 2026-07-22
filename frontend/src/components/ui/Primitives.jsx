import { T as THEME } from "../../data/theme";

// Monogram — secondary brand mark, sits left of the wordmark in the Header.
export function Submark({ onDark = false }) {
  return (
    <div
      style={{
        width: 34,
        height: 34,
        borderRadius: "50%",
        border: `1px solid ${onDark ? THEME.gold : THEME.lineDark}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Cinzel',serif",
        fontSize: 14,
        fontWeight: 400,
        color: onDark ? THEME.gold : THEME.text,
        flexShrink: 0,
      }}
    >
      S
    </div>
  );
}

export function Card({ children, style, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        background: THEME.card,
        borderRadius: 2,
        padding: "24px 28px",
        border: `1px solid ${THEME.line}`,
        cursor: onClick ? "pointer" : "default",
        transition: onClick ? "border-color 0.2s" : undefined,
        ...style,
      }}
      onMouseEnter={onClick ? (e) => (e.currentTarget.style.borderColor = THEME.gold) : undefined}
      onMouseLeave={onClick ? (e) => (e.currentTarget.style.borderColor = THEME.line) : undefined}
    >
      {children}
    </div>
  );
}

// variant: "primary" (filled umber) · "gold" (filled gold) · "ghost" (outlined, default) · "danger" (outlined red)
export function Button({ children, onClick, variant = "ghost", small, disabled, style }) {
  const variants = {
    primary: { background: THEME.dark, color: THEME.gold, border: `1px solid ${THEME.dark}` },
    gold: { background: THEME.gold, color: THEME.card, border: `1px solid ${THEME.gold}` },
    ghost: { background: "transparent", color: THEME.text, border: `1px solid ${THEME.line}` },
    danger: { background: "transparent", color: THEME.redDeep, border: `1px solid ${THEME.redDeep}` },
  };
  return (
    <button
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      style={{
        padding: small ? "8px 18px" : "12px 30px",
        borderRadius: 0,
        cursor: disabled ? "default" : "pointer",
        fontFamily: "'Josefin Sans',sans-serif",
        fontSize: small ? 10 : 11,
        fontWeight: 300,
        letterSpacing: "0.18em",
        textTransform: "uppercase",
        border: "none",
        transition: "all 0.2s",
        opacity: disabled ? 0.4 : 1,
        whiteSpace: "nowrap",
        ...variants[variant],
        ...style,
      }}
    >
      {children}
    </button>
  );
}

export function Input({ label, value, onChange, type = "text", placeholder, style }) {
  return (
    <div style={{ marginBottom: 20, ...style }}>
      {label && (
        <div
          style={{
            fontSize: 9,
            fontFamily: "'Josefin Sans',sans-serif",
            fontWeight: 300,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: THEME.muted,
            marginBottom: 8,
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
          padding: "10px 0",
          border: "none",
          borderBottom: `1px solid ${THEME.line}`,
          fontFamily: "'Josefin Sans',sans-serif",
          fontSize: 14,
          fontWeight: 300,
          color: THEME.text,
          background: "transparent",
          outline: "none",
          letterSpacing: "0.02em",
        }}
      />
    </div>
  );
}

// variant: "default" (muted outline) · "gold" · "success" · "danger" · "dark" (filled umber)
export function Badge({ children, variant = "default" }) {
  const variants = {
    default: { color: THEME.muted, border: `1px solid ${THEME.line}` },
    gold: { color: THEME.gold, border: `1px solid ${THEME.gold}` },
    success: { color: THEME.greenDeep, border: `1px solid ${THEME.greenDeep}` },
    danger: { color: THEME.redDeep, border: `1px solid ${THEME.redDeep}` },
    dark: { color: THEME.card, border: `1px solid ${THEME.dark}`, background: THEME.dark },
  };
  return (
    <span
      style={{
        fontSize: 9,
        fontFamily: "'Josefin Sans',sans-serif",
        fontWeight: 300,
        letterSpacing: "0.15em",
        textTransform: "uppercase",
        padding: "3px 10px",
        borderRadius: 0,
        background: "transparent",
        whiteSpace: "nowrap",
        ...variants[variant],
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
          background: THEME.card,
          borderRadius: 2,
          padding: "32px 36px",
          width: "100%",
          maxWidth: 460,
          maxHeight: "88vh",
          overflowY: "auto",
          border: `1px solid ${THEME.line}`,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: 24,
          }}
        >
          <div>
            <div
              style={{
                fontSize: 9,
                fontFamily: "'Josefin Sans',sans-serif",
                fontWeight: 300,
                letterSpacing: "0.25em",
                textTransform: "uppercase",
                color: THEME.muted,
                marginBottom: 8,
              }}
            >
              SOLACE
            </div>
            <div style={{ fontSize: 20, fontFamily: "'Cinzel',serif", fontWeight: 400, color: THEME.text }}>{title}</div>
          </div>
          <button
            onClick={onClose}
            style={{
              border: `1px solid ${THEME.line}`,
              background: "transparent",
              width: 32,
              height: 32,
              cursor: "pointer",
              fontSize: 12,
              color: THEME.muted,
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
        bottom: 28,
        left: "50%",
        transform: "translateX(-50%)",
        background: isSuccess ? THEME.dark : THEME.card,
        border: `1px solid ${isSuccess ? THEME.gold : THEME.redDeep}`,
        borderRadius: 0,
        padding: "12px 28px",
        fontFamily: "'Josefin Sans',sans-serif",
        fontSize: 11,
        fontWeight: 300,
        letterSpacing: "0.1em",
        color: isSuccess ? THEME.gold : THEME.redDeep,
        zIndex: 99,
        maxWidth: "88%",
        textAlign: "center",
      }}
    >
      {message}
    </div>
  );
}
