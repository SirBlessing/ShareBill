import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

function decodeToken(token) {
  try { return JSON.parse(atob(token.split(".")[1])); }
  catch { return null; }
}

function getInitials(name = "") {
  return name.split(" ").slice(0, 2).map(w => w[0]?.toUpperCase() || "").join("");
}

export default function Navbar() {
  const navigate     = useNavigate();
  const dropRef      = useRef(null);
  const [scrolled,  setScrolled]  = useState(false);
  const [menuOpen,  setMenuOpen]  = useState(false);
  const [dropOpen,  setDropOpen]  = useState(false);
  const [user,      setUser]      = useState(null);

  /* glass effect on scroll */
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  /* read auth whenever storage changes */
    /* read auth whenever storage changes */
  useEffect(() => {
    function readAuth() {
      const token = localStorage.getItem("token");
      if (!token) { setUser(null); return; }
      const p = decodeToken(token);
      if (!p) { setUser(null); return; }
      // Fallback options to match whatever your JWT payloads uses
      const name = p.fullname || p.name || p.username || "User";
      setUser({ name, initials: getInitials(name) });
    }
    readAuth();
    
    window.addEventListener("storage", readAuth);
    window.addEventListener("authChange", readAuth); // Add this line
    
    return () => {
      window.removeEventListener("storage", readAuth);
      window.removeEventListener("authChange", readAuth); // Add this line
    };
  }, []);


  /* close dropdown on outside click */
  useEffect(() => {
    const fn = (e) => { if (dropRef.current && !dropRef.current.contains(e.target)) setDropOpen(false); };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setDropOpen(false);
    setMenuOpen(false);
    navigate("/");
  };

  const close = () => { setMenuOpen(false); setDropOpen(false); };

  return (
    <nav className={`nav-wrap ${scrolled ? "scrolled" : ""}`}>
      <div className="nav-inner">

        <Link to="/" className="nav-logo" onClick={close}>ShareBill</Link>

        {/* Desktop links */}
        <ul className="nav-links-list">
          <li><Link to="/">Home</Link></li>
          <li><a href="#how-it-works">How It Works</a></li>
          <li><a href="#features">Features</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>

        {/* Desktop right side — auth-aware */}
        <div className="nav-actions">
          {user ? (
            <div className="nav-user-wrap" ref={dropRef}>
              <button className="nav-avatar-btn" onClick={() => setDropOpen(o => !o)}>
                <div className="nav-avatar-circle">{user.initials}</div>
                <span className="nav-avatar-name">{user.name.split(" ")[0]}</span>
                <span className={`nav-caret ${dropOpen ? "open" : ""}`}>▾</span>
              </button>

              {dropOpen && (
                <div className="nav-dropdown">
                  <div className="nav-dd-head">
                    <div className="nav-dd-big-av">{user.initials}</div>
                    <div>
                      <div className="nav-dd-fullname">{user.name}</div>
                      <div className="nav-dd-tag">Bill Creator</div>
                    </div>
                  </div>
                  <div className="nav-dd-divider" />
                  <Link to="/dashboard"   className="nav-dd-row" onClick={close}>📊 My Dashboard</Link>
                  <Link to="/ActiveBills" className="nav-dd-row" onClick={close}>🧾 Active Bills</Link>
                  <Link to="/create-bill" className="nav-dd-row" onClick={close}>➕ Create a Bill</Link>
                  <div className="nav-dd-divider" />
                  <button className="nav-dd-row nav-dd-logout" onClick={handleLogout}>🚪 Log Out</button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login"          className="nav-login">Log In</Link>
              <Link to="/create-account" className="nav-cta">Get Started</Link>
            </>
          )}
        </div>

        {/* Hamburger */}
        <button className={`nav-hamburger ${menuOpen ? "open" : ""}`}
          onClick={() => setMenuOpen(o => !o)} aria-label="Menu">
          <span /><span /><span />
        </button>
      </div>

      {/* Mobile menu */}
      <div className={`nav-mobile-menu ${menuOpen ? "open" : ""}`}>
        <Link to="/"            onClick={close}>Home</Link>
        <a href="#how-it-works" onClick={close}>How It Works</a>
        <a href="#features"     onClick={close}>Features</a>
        <a href="#contact"      onClick={close}>Contact</a>
        {user ? (
          <>
            <Link to="/dashboard"   onClick={close}>📊 My Dashboard</Link>
            <Link to="/ActiveBills" onClick={close}>🧾 Active Bills</Link>
            <Link to="/create-bill" onClick={close}>➕ Create Bill</Link>
            <button className="nav-mobile-logout" onClick={handleLogout}>🚪 Log Out</button>
          </>
        ) : (
          <>
            <Link to="/login" onClick={close}>Log In</Link>
            <Link to="/create-account" className="nav-mobile-cta" onClick={close}>Get Started — It's Free</Link>
          </>
        )}
      </div>
    </nav>
  );
}