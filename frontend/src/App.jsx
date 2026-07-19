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
          fontFamily: "'Quicksand', sans-serif",
          background: T.bg,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: T.pinkDeep,
          fontSize: 15,
          fontWeight: 700,
        }}
      >
        🕯️ Đang mở cửa tiệm...
      </div>
    );
  }

  return (
    <div
      style={{
        fontFamily: "'Quicksand','Segoe UI',sans-serif",
        background: T.bg,
        minHeight: "100vh",
        color: T.text,
        padding: "18px 14px 40px",
      }}
    >
      <link href="https://fonts.googleapis.com/css2?family=Quicksand:wght@500;600;700&display=swap" rel="stylesheet" />

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
        onClick={() => showToast("Nhân viên tư vấn sẽ liên hệ với bạn trong ít phút nhé! 💁‍♀️")}
        onMouseEnter={() => setChatHovered(true)}
        onMouseLeave={() => setChatHovered(false)}
        style={{
          position: "fixed",
          bottom: 24,
          right: 24,
          background: "linear-gradient(135deg, #A88147 0%, #8F6C3B 100%)",
          color: "#fff",
          border: "none",
          borderRadius: 999,
          padding: chatHovered ? "12px 22px" : "0px",
          width: chatHovered ? "220px" : "48px",
          height: "48px",
          fontSize: 14,
          fontWeight: 700,
          boxShadow: "0 6px 18px rgba(143,108,59,0.35)",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: chatHovered ? 8 : 0,
          zIndex: 99,
          fontFamily: "inherit",
          letterSpacing: "0.2px",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          overflow: "hidden",
          whiteSpace: "nowrap",
        }}
      >
        <span style={{ fontSize: 20, lineHeight: 1, display: "flex", alignItems: "center" }}>💬</span> 
        {chatHovered && (
          <span style={{ lineHeight: 1, paddingTop: 2 }}>Liên hệ với nhân viên</span>
        )}
      </button>
      <Toast message={toast?.msg} isSuccess={toast?.ok} />
    </div>
  );
}
