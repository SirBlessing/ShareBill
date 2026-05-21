import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./AuthPages.css";

/* ══════════════════════════════════════════
   REGISTER ILLUSTRATION — Bill sharing network
   Shows: 1 creator → links → 4 people pay
══════════════════════════════════════════ */
function RegisterIllustration() {
  const avatars = [
    { initials:"AO", name:"Adeola",  badge:"₦12k Paid",   badgeCls:"rb-paid",    color:"#C026D3", pos:"ri-av-top"    },
    { initials:"TK", name:"Tunde",   badge:"Link Sent",    badgeCls:"rb-link",    color:"#7C3AED", pos:"ri-av-right"  },
    { initials:"BN", name:"Blessing",badge:"₦12k Paid",   badgeCls:"rb-paid",    color:"#22D3EE", pos:"ri-av-bottom" },
    { initials:"FK", name:"Femi",    badge:"Pending...",   badgeCls:"rb-pending", color:"#9333EA", pos:"ri-av-left"   },
  ];

  /* SVG lines from center (180,200) to each avatar's approximate centre */
  const lines = [
    { x1:180, y1:200, x2:180, y2:72  },   /* top    */
    { x1:180, y1:200, x2:310, y2:148 },   /* right  */
    { x1:180, y1:200, x2:180, y2:320 },   /* bottom */
    { x1:180, y1:200, x2:52,  y2:148 },   /* left   */
  ];

  return (
    <div className="ri-wrap">
      <div className="ri-glow" />

      {/* SVG dashed connecting lines */}
      <svg className="ri-svg" viewBox="0 0 360 400">
        <defs>
          <linearGradient id="lg1" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#C026D3" stopOpacity="0.6"/>
            <stop offset="100%" stopColor="#C026D3" stopOpacity="0.1"/>
          </linearGradient>
        </defs>
        {lines.map((l,i) => (
          <line key={i}
            x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2}
            stroke="rgba(192,38,211,0.3)"
            strokeWidth="1.5"
            strokeDasharray="5 4"
          />
        ))}
      </svg>

      {/* Central bill card */}
      <div className="ri-center">
        <div className="ri-center-logo">ShareBill</div>
        <div className="ri-center-bill">Eko Island Dinner</div>
        <div className="ri-center-amt">₦72,000</div>
      </div>

      {/* Avatar nodes */}
      {avatars.map((av, i) => (
        <div className={`ri-av ${av.pos}`} key={i}>
          <div className="ri-av-circle" style={{ background: av.color }}>
            {av.initials}
          </div>
          <div className="ri-av-name">{av.name}</div>
          <div className={`ri-av-badge ${av.badgeCls}`}>{av.badge}</div>
        </div>
      ))}
    </div>
  );
}

/* ══════════════════════════════════════════
   CREATE ACCOUNT PAGE
══════════════════════════════════════════ */
function CreateAccount() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullname: "", email: "", phone_number: "", password: "", confirmPassword: "",
  });
  const [error,   setError]   = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const validate = () => {
    const { fullname, email, phone_number, password, confirmPassword } = form;
    if (!fullname || !email || !phone_number || !password || !confirmPassword)
      return setError("All fields are required."), false;
    const emailOk = /\S+@\S+\.\S+/.test(email);
    const phoneOk = /^[0-9]{10,15}$/.test(phone_number);
    if (!emailOk) return setError("Enter a valid email address."), false;
    if (!phoneOk) return setError("Enter a valid phone number (10–15 digits)."), false;
    if (password.length < 6) return setError("Password must be at least 6 characters."), false;
    if (password !== confirmPassword) return setError("Passwords do not match."), false;
    return true;
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true); setError("");
    try {
      const res = await axios.post("http://localhost:5000/auth/register", {
        fullname: form.fullname,
        email: form.email,
        phone_number: form.phone_number,
        password: form.password,
      });
      if (res.data.success) navigate("/login");
      else setError(res.data.message || "Signup failed.");
    } catch (err) {
      setError(err.response?.data?.message || "Network error. Try again.");
    }
    setLoading(false);
  };

  return (
    <div className="auth-page">

      {/* ── FORM SIDE ── */}
      <div className="auth-form-side">
        <Link to="/" className="auth-back">← Back to home</Link>
        <Link to="/" className="auth-logo">ShareBill</Link>

        <h1 className="auth-h1">Create your account ✨</h1>
        <p className="auth-sub">
          Free forever. No credit card needed.<br />
          Start collecting money stress-free today.
        </p>

        {error && <div className="auth-err">{error}</div>}

        <form onSubmit={handleCreate}>
          <div className="af">
            <label>Full Name</label>
            <input name="fullname" type="text" placeholder="Adeola Okonkwo"
              onChange={handleChange} />
          </div>
          <div className="af">
            <label>Email Address</label>
            <input name="email" type="email" placeholder="you@email.com"
              onChange={handleChange} />
          </div>
          <div className="af">
            <label>Phone Number</label>
            <input name="phone_number" type="tel" placeholder="08012345678"
              onChange={handleChange} />
          </div>
          <div className="af">
            <label>Password</label>
            <input name="password" type="password" placeholder="Min. 6 characters"
              onChange={handleChange} />
          </div>
          <div className="af">
            <label>Confirm Password</label>
            <input name="confirmPassword" type="password" placeholder="Repeat your password"
              onChange={handleChange} />
          </div>

          <button type="submit" className="auth-submit" disabled={loading}>
            {loading ? <span className="a-spin" /> : "Create Account →"}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Log in here</Link>
        </p>
        <p className="auth-terms">
          By signing up you agree to our <span>Terms</span> &amp; <span>Privacy Policy</span>
        </p>
      </div>

      {/* ── VISUAL SIDE ── */}
      <div className="auth-visual-side">
        <RegisterIllustration />
      </div>

    </div>
  );
}

export default CreateAccount;