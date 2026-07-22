import { useState, useEffect } from "react";
import { T } from "./data/theme";
import { SEED } from "./data/recipes";
import { useStorage } from "./hooks/useStorage";
import { Header, LoginModal } from "./components/Header";
import { LandingPage } from "./components/LandingPage";
import { ShopTab } from "./components/ShopTab";
import { SimulationTab } from "./components/SimulationTab";
import { AdminApp } from "./components/AdminApp";
import { Toast } from "./components/ui/Primitives";

export default function App() {
  const [db, setDb, loaded] = useStorage("candle-dist-v3", SEED);
  const [view, setView] = useState("home");
  const [identity, setIdentity] = useState(null);
  const [adminAuthed, setAdminAuthed] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const [chatHovered, setChatHovered] = useState(false);

  const showToast = (msg, ok = true) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 2800);
  };

  if (!loaded) {
    return (
      <div
        style={{
          fontFamily: "'Josefin Sans',sans-serif",
          background: T.bg,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: T.muted,
          fontSize: 11,
          fontWeight: 300,
          letterSpacing: "0.2em",
          textTransform: "uppercase",
        }}
      >
        Đang mở cửa tiệm...
      </div>
    );
  }

  return (
    <div
      style={{
        fontFamily: "'Josefin Sans','Segoe UI',sans-serif",
        background: T.bg,
        minHeight: "100vh",
        color: T.text,
        padding: "28px 20px 60px",
      }}
    >
      <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600&family=Josefin+Sans:wght@200;300;400;600&display=swap" rel="stylesheet" />

      <Header
        view={view}
        setView={(v) => {
          if (v === "admin" && !adminAuthed) {
            setLoginOpen(true);
            return;
          }
          setView(v);
        }}
        identity={identity}
        adminAuthed={adminAuthed}
        onOpenLogin={() => setLoginOpen(true)}
        onLogout={() => {
          setIdentity(null);
          setAdminAuthed(false);
          setView("home");
        }}
      />

      {view === "home" && <LandingPage setView={setView} />}
      {view === "shop" && (
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <ShopTab db={db} setDb={setDb} identity={identity} showToast={showToast} />
        </div>
      )}
      {view === "sim" && (
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <SimulationTab db={db} setDb={setDb} identity={identity} showToast={showToast} />
        </div>
      )}
      {view === "admin" && adminAuthed && <AdminApp db={db} setDb={setDb} showToast={showToast} />}

      {loginOpen && (
        <LoginModal
          onClose={() => setLoginOpen(false)}
          onCustomer={(who) => {
            setIdentity(who);
            setLoginOpen(false);
          }}
          onAdmin={() => {
            setAdminAuthed(true);
            setLoginOpen(false);
            setView("admin");
          }}
        />
      )}

      <button
        onClick={() => showToast("Nhân viên tư vấn sẽ liên hệ với bạn trong ít phút.")}
        onMouseEnter={() => setChatHovered(true)}
        onMouseLeave={() => setChatHovered(false)}
        style={{
          position: "fixed",
          bottom: 24,
          right: 24,
          background: T.dark,
          color: T.gold,
          border: `1px solid ${T.dark}`,
          borderRadius: 0,
          padding: chatHovered ? "12px 22px" : "0px",
          width: chatHovered ? "240px" : "48px",
          height: "48px",
          fontSize: 10,
          fontWeight: 300,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: chatHovered ? 10 : 0,
          zIndex: 99,
          fontFamily: "'Josefin Sans',sans-serif",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          overflow: "hidden",
          whiteSpace: "nowrap",
        }}
      >
        <span style={{ fontSize: 14, lineHeight: 1, display: "flex", alignItems: "center" }}>—</span>
        {chatHovered && (
          <span style={{ lineHeight: 1 }}>Liên hệ nhân viên</span>
        )}
      </button>
      <Toast message={toast?.msg} isSuccess={toast?.ok} />
    </div>
  );
}
