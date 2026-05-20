import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import './App.css';
import HeroSection from "./components/HeroSection";
import HowItWorks from "./components/HowItWorks";
import Contact from "./components/Contact";
import CreateAccount from "./components/CreateAccount";
import Login from "./components/Login";
import Navbar from "./components/Navbar";
import CreateBill from "./components/CreateBill";
import UnlockLink from "./components/UnlockLink";
import Dashboard from "./components/Dashboard";
import ActiveBills from "./components/ActiveBills";
import BillDashboard from "./components/BillDashboard";
import ParticipantPage from "./components/ParticipantPage";

// Hide the app Navbar on the public participant page
function Layout() {
  const location = useLocation();
  const isParticipantPage = location.pathname.startsWith("/pay/");

  return (
    <>
      {!isParticipantPage && <Navbar />}
      <Routes>
        {/* HOME */}
        <Route
          path="/"
          element={
            <>
              <HeroSection />
              <HowItWorks />
              <Contact />
            </>
          }
        />

        {/* AUTH */}
        <Route path="/create-account" element={<CreateAccount />} />
        <Route path="/login" element={<Login />} />

        {/* CREATOR PAGES */}
        <Route path="/create-bill" element={<CreateBill />} />
        <Route path="/unlock-link" element={<UnlockLink />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/ActiveBills" element={<ActiveBills />} />
        <Route path="/bill/:id" element={<BillDashboard />} />

        {/* ✅ NEW: PUBLIC PARTICIPANT PAGE (no login required) */}
        <Route path="/pay/:billId/:participantIndex" element={<ParticipantPage />} />
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