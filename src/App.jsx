import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import "./App.css";
import "./Home.css";

import useVignette   from "./useVignette";

import Navbar        from "./components/Navbar";
import HeroSection   from "./components/HeroSection";
import ProofStrip    from "./components/ProofStrip";
import HowItWorks    from "./components/HowItWorks";
import Features      from "./components/Features";
import Testimonials  from "./components/Testimonials";
import Contact       from "./components/Contact";
import Footer        from "./components/Footer";
import BannerAd      from "./components/BannerAd";

import CreateAccount   from "./components/CreateAccount";
import Login           from "./components/Login";
import CreateBill      from "./components/CreateBill";
import UnlockLink      from "./components/UnlockLink";
import Dashboard       from "./components/Dashboard";
import ActiveBills     from "./components/ActiveBills";
import BillDashboard   from "./components/BillDashboard";
import ParticipantPage from "./components/ParticipantPage";
import LegalPage       from "./components/LegalPage";

function Layout() {
  const location         = useLocation();
  const triggerVignette  = useVignette(); // ← auto-fires on inner pages, returns manual trigger too

  const isParticipantPage = location.pathname.startsWith("/pay/");
  const isHome            = location.pathname === "/";

  return (
    <>
      {isHome && (
        <>
          <div className="home-orbs">
            <div className="orb orb-1" />
            <div className="orb orb-2" />
            <div className="orb orb-3" />
          </div>
          <div className="home-grid" />
        </>
      )}

      {!isParticipantPage && <Navbar />}

      <Routes>

        {/* ── HOME ── */}
        <Route path="/" element={
          <>
            <HeroSection />
            <ProofStrip />
            <HowItWorks />

            {/* Banner ad between HowItWorks and Features — non-intrusive */}
            <div style={{ position:"relative", zIndex:1 }}>
              <BannerAd className="banner-home" />
            </div>

            <Features />
            <Testimonials />
            <Contact />
            <Footer />
          </>
        } />

        {/* ── AUTH ── */}
        <Route path="/create-account" element={<CreateAccount />} />
        <Route path="/login"          element={<Login />} />

        {/* ── APP (vignette auto-fires on all of these via useVignette) ── */}
        <Route path="/create-bill"  element={<CreateBill  triggerVignette={triggerVignette} />} />
        <Route path="/unlock-link"  element={<UnlockLink />} />
        <Route path="/dashboard"    element={<Dashboard   triggerVignette={triggerVignette} />} />
        <Route path="/ActiveBills"  element={<ActiveBills triggerVignette={triggerVignette} />} />
        <Route path="/bill/:id"     element={<BillDashboard />} />

        {/* ── PUBLIC ── */}
        <Route path="/pay/:billId/:participantIndex" element={<ParticipantPage />} />
        <Route path="/legal" element={<LegalPage />} />

      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <div className="app">
        <Layout />
      </div>
    </Router>
  );
}

export default App;