import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
// import API from "../config";
import "./AuthPages.css";

/* ══════════════════════════════════════════
   LOGIN ILLUSTRATION — Bill dashboard card
══════════════════════════════════════════ */
function LoginIllustration() {
  const rows = [
    { ico: "🍽️", name: "Eko Island Dinner",  date: "May 18", amt: "₦48,000",  pill: "All Paid",    cls: "rp-paid",  bg: "rgba(192,38,211,0.14)" },
    { ico: "🎉", name: "Birthday Hangout",    date: "May 12", amt: "₦120,000", pill: "1 Awaiting",  cls: "rp-await", bg: "rgba(124,58,237,0.14)" },
    { ico: "✈️", name: "Lagos Road Trip",     date: "May 4",  amt: "₦85,500",  pill: "3 Pending",   cls: "rp-pend",  bg: "rgba(34,211,238,0.1)" },
  ];

  return (
    <div className="li-wrap">
      <div className="li-glow" />

      {/* floating chips */}
      <div className="li-chip li-chip-a">✅ ₦48,000 fully collected!</div>
      <div className="li-chip li-chip-b">🔔 Reminder sent to 3 people</div>

      <div className="li-card">

        {/* header */}
        <div className="li-header">
          <div className="li-title">Bills Dashboard</div>
          <div className="li-live"><div className="li-live-dot" />Live</div>
        </div>

        {/* total row */}
        <div className="li-total">
          <div>
            <div className="li-total-lbl">Total Tracked</div>
            <div className="li-total-num">₦253,500</div>
            <div className="li-total-sub">3 active bills</div>
          </div>

          {/* SVG ring */}
          <div className="li-ring">
            <svg width="66" height="66" viewBox="0 0 66 66">
              <circle cx="33" cy="33" r="26" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="5.5"/>
              <circle cx="33" cy="33" r="26" fill="none"
                stroke="url(#rg)" strokeWidth="5.5" strokeLinecap="round"
                strokeDasharray="163.4" strokeDashoffset="65"
                transform="rotate(-90 33 33)"
              />
              <defs>
                <linearGradient id="rg" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%"   stopColor="#C026D3"/>
                  <stop offset="100%" stopColor="#22D3EE"/>
                </linearGradient>
              </defs>
            </svg>
            <div className="li-ring-lbl">
              60%<span className="li-ring-sub">paid</span>
            </div>
          </div>
        </div>

        {/* bill rows */}
        <div className="li-row-lbl">Recent Bills</div>
        {rows.map((r, i) => (
          <div className="li-row" key={i}>
            <div className="li-row-l">
              <div className="li-ico" style={{ background: r.bg }}>{r.ico}</div>
              <div>
                <div className="li-rname">{r.name}</div>
                <div className="li-rdate">{r.date}</div>
              </div>
            </div>
            <div className="li-row-r">
              <div className="li-ramt">{r.amt}</div>
              <div className={`li-rpill ${r.cls}`}>{r.pill}</div>
            </div>
          </div>
        ))}

      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   LOGIN PAGE
══════════════════════════════════════════ */
function Login() {
  const navigate = useNavigate();
  const [form,    setForm]    = useState({ email: "", password: "" });
  const [error,   setError]   = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleLogin = async () => {
    if (!form.email || !form.password) { setError("All fields are required."); return; }
    setLoading(true); setError("");
    try {
      const res = await axios.post(`${API}/auth/login`, form);
      if (res.data.success) {
        localStorage.setItem("token", res.data.token);
        navigate("/dashboard");
      } else {
        setError(res.data.message || "Invalid credentials");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Network error. Try again.");
    }
    setLoading(false);
  };

  const onKey = (e) => { if (e.key === "Enter") handleLogin(); };

  return (
    <div className="auth-page">

      {/* ── FORM SIDE ── */}
      <div className="auth-form-side">
        <Link to="/" className="auth-back">← Back to home</Link>
        <Link to="/" className="auth-logo">ShareBill</Link>

        <h1 className="auth-h1">Welcome back 👋</h1>
        <p className="auth-sub">
          Log in to view your bills, track payments<br />and collect what's owed.
        </p>

        {error && <div className="auth-err">{error}</div>}

        <div className="af">
          <label>Email or Phone</label>
          <input name="email" type="text" placeholder="you@email.com or 08012345678"
            onChange={handleChange} onKeyDown={onKey} autoComplete="username" />
        </div>

        <div className="af">
          <label>Password</label>
          <input name="password" type="password" placeholder="Enter your password"
            onChange={handleChange} onKeyDown={onKey} autoComplete="current-password" />
        </div>

        <button className="auth-submit" onClick={handleLogin} disabled={loading}>
          {loading ? <span className="a-spin" /> : "Log In →"}
        </button>

        <p className="auth-switch">
          No account yet? <Link to="/create-account">Create one free →</Link>
        </p>
        <p className="auth-terms">
          By signing in you agree to our <Link to="/legal?tab=terms">Terms</Link> &amp; <Link to="/legal?tab=privacy">Privacy Policy</Link>
        </p>
      </div>

      {/* ── VISUAL SIDE ── */}
      <div className="auth-visual-side">
        <LoginIllustration />
      </div>

    </div>
  );
}

export default Login;