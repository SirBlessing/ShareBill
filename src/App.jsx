import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import "./App.css";
import "./Home.css";

import Navbar          from "./components/Navbar";
import HeroSection     from "./components/HeroSection";
import ProofStrip      from "./components/ProofStrip";
import HowItWorks      from "./components/HowItWorks";
import Features        from "./components/Features";
import Testimonials    from "./components/Testimonials";
import Contact         from "./components/Contact";
import Footer          from "./components/Footer";

import CreateAccount   from "./components/CreateAccount";
import Login           from "./components/Login";
import CreateBill      from "./components/CreateBill";
import UnlockLink      from "./components/UnlockLink";
import Dashboard       from "./components/Dashboard";
import ActiveBills     from "./components/ActiveBills";
import BillDashboard   from "./components/BillDashboard";
import ParticipantPage from "./components/ParticipantPage";
import LegalPage       from "./components/LegalPage";       // ← new

const NO_NAVBAR = ["/pay/", "/legal"];   // pages with their own headers

function Layout() {
  const location  = useLocation();
  const hideNavbar = NO_NAVBAR.some(p => location.pathname.startsWith(p));
  const isHome    = location.pathname === "/";

  return (
    <>
      {isHome && (
        <>
          <div className="home-orbs">
            <div className="orb orb-1" /><div className="orb orb-2" /><div className="orb orb-3" />
          </div>
          <div className="home-grid" />
        </>
      )}

      {!hideNavbar && <Navbar />}

      <Routes>
        {/* HOME */}
        <Route path="/" element={
          <><HeroSection /><ProofStrip /><HowItWorks /><Features /><Testimonials /><Contact /><Footer /></>
        } />

        {/* AUTH */}
        <Route path="/create-account" element={<CreateAccount />} />
        <Route path="/login"          element={<Login />} />

        {/* APP */}
        <Route path="/create-bill"  element={<CreateBill />} />
        <Route path="/unlock-link"  element={<UnlockLink />} />
        <Route path="/dashboard"    element={<Dashboard />} />
        <Route path="/ActiveBills"  element={<ActiveBills />} />
        <Route path="/bill/:id"     element={<BillDashboard />} />

        {/* LEGAL — its own header, no app navbar */}
        <Route path="/legal"        element={<LegalPage />} />

        {/* PUBLIC PARTICIPANT PAGE */}
        <Route path="/pay/:billId/:participantIndex" element={<ParticipantPage />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <div className="app"><Layout /></div>
    </Router>
  );
}

export default App;