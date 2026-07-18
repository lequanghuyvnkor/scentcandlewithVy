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
  const [db, setDb, loaded] = useStorage("candle-dist-v2", SEED);
  const [view, setView] = useState("home");
  const [identity, setIdentity] = useState(null);
  const [adminAuthed, setAdminAuthed] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [toast, setToast] = useState(null);

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

      <Toast message={toast?.msg} isSuccess={toast?.ok} />
    </div>
  );
}
