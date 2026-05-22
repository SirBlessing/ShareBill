import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Dashboard.css";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";


const BILL_ICONS = ["🍽️","🎉","✈️","🏠","🎂","⚽","🎬","🛒","💼","🎵"];
const icon = (t = "") => BILL_ICONS[t.charCodeAt(0) % BILL_ICONS.length];

/* ══════════════════════════════════════════════
   PERSON-HOLDING-PHONE ILLUSTRATION
   Pure SVG — no image files needed
══════════════════════════════════════════════ */
function PhoneIllustration({ bills }) {
  const topBill  = bills[0];
  const paid     = bills.filter(b => b.status === "completed").length;
  const active   = bills.filter(b => b.status !== "completed").length;
  const total    = bills.reduce((s,b) => s + Number(b.total_amount || 0), 0);

  return (
    <div className="dash-illus-wrap">

      {/* Floating context chips */}
      <div className="dash-chip dash-chip-1">
        ✅ Payment confirmed!
      </div>
      <div className="dash-chip dash-chip-2">
        💬 Link sent via WhatsApp
      </div>
      <div className="dash-chip dash-chip-3">
        🔔 Reminder sent
      </div>

      {/* Main SVG illustration */}
      <svg
        className="dash-illus-svg"
        viewBox="0 0 380 520"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id="bg-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="#7C3AED" stopOpacity="0.22"/>
            <stop offset="100%" stopColor="#7C3AED" stopOpacity="0"/>
          </radialGradient>
          <radialGradient id="head-grad" cx="40%" cy="35%" r="60%">
            <stop offset="0%"   stopColor="#A855F7" stopOpacity="0.5"/>
            <stop offset="100%" stopColor="#6D28D9" stopOpacity="0.25"/>
          </radialGradient>
          <radialGradient id="body-grad" cx="50%" cy="30%" r="70%">
            <stop offset="0%"   stopColor="#7C3AED" stopOpacity="0.3"/>
            <stop offset="100%" stopColor="#5B21B6" stopOpacity="0.1"/>
          </radialGradient>
          <linearGradient id="bar-g" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%"   stopColor="#C026D3"/>
            <stop offset="100%" stopColor="#22D3EE"/>
          </linearGradient>
          <linearGradient id="phone-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#1a0035"/>
            <stop offset="100%" stopColor="#080014"/>
          </linearGradient>
          <filter id="glow-filter">
            <feGaussianBlur stdDeviation="8" result="blur"/>
            <feComposite in="SourceGraphic" in2="blur" operator="over"/>
          </filter>
        </defs>

        {/* ── BACKGROUND GLOW ── */}
        <ellipse cx="190" cy="280" rx="200" ry="200" fill="url(#bg-glow)"/>

        {/* ── SUBTLE GRID DOTS ── */}
        {[120,160,200,240,280].map(x =>
          [180,220,260,300,340].map(y => (
            <circle key={`${x}-${y}`} cx={x} cy={y} r="1"
              fill="rgba(255,255,255,0.06)"/>
          ))
        )}

        {/* ══ PERSON SILHOUETTE ══ */}

        {/* Head */}
        <circle cx="190" cy="90" r="54" fill="url(#head-grad)"
          stroke="rgba(192,38,211,0.35)" strokeWidth="1.5"/>

        {/* Hair mass (top of head) */}
        <path d="M 145 75 Q 165 42 190 38 Q 215 42 235 75
                 Q 220 55 190 52 Q 160 55 145 75 Z"
          fill="rgba(124,58,237,0.45)"/>

        {/* Face highlights — eyes looking DOWN at phone */}
        <ellipse cx="175" cy="96" rx="7" ry="9"
          fill="rgba(255,255,255,0.12)" stroke="rgba(255,255,255,0.2)" strokeWidth="1"/>
        <ellipse cx="205" cy="96" rx="7" ry="9"
          fill="rgba(255,255,255,0.12)" stroke="rgba(255,255,255,0.2)" strokeWidth="1"/>
        {/* pupils angled slightly downward */}
        <circle cx="175" cy="99" r="4" fill="rgba(124,58,237,0.7)"/>
        <circle cx="205" cy="99" r="4" fill="rgba(124,58,237,0.7)"/>
        {/* eye shine */}
        <circle cx="173" cy="97" r="1.5" fill="rgba(255,255,255,0.6)"/>
        <circle cx="203" cy="97" r="1.5" fill="rgba(255,255,255,0.6)"/>

        {/* Neck */}
        <rect x="177" y="140" width="26" height="28" rx="6"
          fill="url(#head-grad)" stroke="rgba(192,38,211,0.2)" strokeWidth="1"/>

        {/* Shoulders / upper body */}
        <path d="M 72 185
                 Q 72 165 110 158 L 145 155 Q 190 170 235 155 L 270 158
                 Q 308 165 308 185
                 L 318 350 Q 190 375 62 350 Z"
          fill="url(#body-grad)"
          stroke="rgba(192,38,211,0.2)" strokeWidth="1"/>

        {/* Clothing texture lines */}
        <path d="M 145 165 L 175 250" stroke="rgba(192,38,211,0.1)" strokeWidth="1"/>
        <path d="M 235 165 L 205 250" stroke="rgba(192,38,211,0.1)" strokeWidth="1"/>

        {/* LEFT ARM — wraps around phone */}
        <path d="M 88 210 Q 52 285 72 350 Q 80 375 118 390 L 138 400"
          stroke="url(#body-grad)" strokeWidth="34" strokeLinecap="round" fill="none"
          stroke="rgba(124,58,237,0.38)"/>
        <path d="M 88 210 Q 52 285 72 350 Q 80 375 118 390 L 138 400"
          stroke="rgba(192,38,211,0.18)" strokeWidth="34" strokeLinecap="round" fill="none"/>

        {/* RIGHT ARM — wraps around phone */}
        <path d="M 292 210 Q 328 285 308 350 Q 300 375 262 390 L 242 400"
          stroke="rgba(124,58,237,0.38)" strokeWidth="34" strokeLinecap="round" fill="none"/>
        <path d="M 292 210 Q 328 285 308 350 Q 300 375 262 390 L 242 400"
          stroke="rgba(192,38,211,0.18)" strokeWidth="34" strokeLinecap="round" fill="none"/>

        {/* HANDS (thumbs near bottom of phone) */}
        <ellipse cx="138" cy="402" rx="18" ry="12" fill="rgba(124,58,237,0.35)"
          stroke="rgba(192,38,211,0.3)" strokeWidth="1"/>
        <ellipse cx="242" cy="402" rx="18" ry="12" fill="rgba(124,58,237,0.35)"
          stroke="rgba(192,38,211,0.3)" strokeWidth="1"/>

        {/* ══ PHONE FRAME ══ */}
        {/* Glow behind phone */}
        <rect x="143" y="198" width="94" height="190" rx="20"
          fill="rgba(192,38,211,0.2)" filter="url(#glow-filter)"/>

        {/* Phone body */}
        <rect x="148" y="200" width="84" height="185" rx="17"
          fill="url(#phone-grad)"
          stroke="rgba(255,255,255,0.18)" strokeWidth="1.5"/>

        {/* Side buttons */}
        <rect x="146" y="235" width="3" height="18" rx="1.5"
          fill="rgba(255,255,255,0.15)"/>
        <rect x="231" y="230" width="3" height="14" rx="1.5"
          fill="rgba(255,255,255,0.15)"/>
        <rect x="231" y="248" width="3" height="14" rx="1.5"
          fill="rgba(255,255,255,0.15)"/>

        {/* Dynamic island / notch */}
        <rect x="171" y="206" width="38" height="10" rx="5"
          fill="rgba(0,0,0,0.7)"/>

        {/* ══ PHONE SCREEN CONTENT ══ */}

        {/* Status bar */}
        <text x="156" y="223" fontSize="6" fill="rgba(255,255,255,0.4)"
          fontFamily="system-ui">9:41</text>
        <text x="212" y="223" fontSize="6" fill="rgba(255,255,255,0.4)"
          fontFamily="system-ui">●●●</text>

        {/* App logo */}
        <text x="165" y="235" fontSize="7.5" fill="#E040FB"
          fontFamily="system-ui" fontWeight="bold">ShareBill</text>

        {/* Bill summary card */}
        <rect x="155" y="240" width="70" height="46" rx="8"
          fill="rgba(192,38,211,0.2)" stroke="rgba(192,38,211,0.3)" strokeWidth="0.8"/>
        <text x="162" y="252" fontSize="6.5" fill="rgba(255,255,255,0.5)"
          fontFamily="system-ui">
          {topBill ? topBill.title.slice(0,12) : "Eko Dinner"}
        </text>
        <text x="162" y="266" fontSize="10" fill="white"
          fontFamily="system-ui" fontWeight="bold">
          {topBill ? `₦${Number(topBill.total_amount).toLocaleString()}` : "₦48,000"}
        </text>
        {/* Mini progress bar */}
        <rect x="162" y="278" width="56" height="2.5" rx="1.5"
          fill="rgba(255,255,255,0.1)"/>
        <rect x="162" y="278" width="35" height="2.5" rx="1.5"
          fill="url(#bar-g)"/>

        {/* Participant rows */}
        {[
          { init:"AO", name:"Adeola", status:"Paid",    sc:"#4ade80", bg:"rgba(74,222,128,0.15)",  ac:"#C026D3" },
          { init:"TK", name:"Tunde",  status:"Awaiting",sc:"#e879f9", bg:"rgba(232,121,249,0.15)", ac:"#7C3AED" },
          { init:"BN", name:"Bisi",   status:"Pending", sc:"#facc15", bg:"rgba(250,204,21,0.12)",  ac:"#22D3EE" },
        ].map((p, i) => (
          <g key={i}>
            <rect x="155" y={296 + i * 24} width="70" height="19" rx="5"
              fill="rgba(255,255,255,0.04)"/>
            <circle cx="164" cy={306 + i * 24} r="6" fill={p.ac}/>
            <text x="173" y={309 + i * 24} fontSize="6" fill="rgba(255,255,255,0.75)"
              fontFamily="system-ui">{p.name}</text>
            <rect x="199" y={300 + i * 24} width="22" height="10" rx="4"
              fill={p.bg}/>
            <text x="202" y={308 + i * 24} fontSize="5.5" fill={p.sc}
              fontFamily="system-ui">{p.status}</text>
          </g>
        ))}

        {/* Home bar */}
        <rect x="170" y="373" width="40" height="3" rx="1.5"
          fill="rgba(255,255,255,0.2)"/>

        {/* Screen edge reflection */}
        <path d="M 151 218 Q 155 210 165 207"
          stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>

      {/* Stats row under the illustration */}
      <div className="dash-illus-stats">
        <div className="dash-is">
          <span className="dash-is-n">{bills.length}</span>
          <span className="dash-is-l">Total Bills</span>
        </div>
        <div className="dash-is-div"/>
        <div className="dash-is">
          <span className="dash-is-n">{active}</span>
          <span className="dash-is-l">Active</span>
        </div>
        <div className="dash-is-div"/>
        <div className="dash-is">
          <span className="dash-is-n">
            {total >= 1000000
              ? `₦${(total/1000000).toFixed(1)}M`
              : total >= 1000
              ? `₦${(total/1000).toFixed(0)}K`
              : `₦${total}`}
          </span>
          <span className="dash-is-l">Tracked</span>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   DASHBOARD PAGE
══════════════════════════════════════════════ */
function Dashboard() {
  const navigate = useNavigate();
  const [bills,    setBills]   = useState([]);
  const [loading,  setLoading] = useState(true);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    /* get user name from token */
    try {
      const token = localStorage.getItem("token");
      if (token) {
        const p = JSON.parse(atob(token.split(".")[1]));
        setUserName(p.fullname || p.name || "");
      }
    } catch {}

    const fetchBills = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${API}/bills/my-bills`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBills(res.data);
      } catch (err) {
        if (err.response?.status === 401) navigate("/login");
      } finally {
        setLoading(false);
      }
    };
    fetchBills();
  }, [navigate]);

  const firstName = userName.split(" ")[0] || "there";

  const hour  = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div className="dash-page">

      {/* ── LEFT: ILLUSTRATION ── */}
      <div className="dash-left-panel">
        <PhoneIllustration bills={bills} />
      </div>

      {/* ── RIGHT: CONTENT ── */}
      <div className="dash-right-panel">

        {/* Greeting */}
        <div className="dash-greeting">
          <span className="dash-greeting-wave">👋</span>
          <div>
            <div className="dash-greeting-text">{greeting}, <strong>{firstName}</strong></div>
            <div className="dash-greeting-sub">Here's what's happening with your bills</div>
          </div>
        </div>

        <h1 className="dash-title">My Dashboard</h1>
        <div className="dash-title-line"/>

        {/* Quick actions */}
        <div className="dash-actions">
          <Link to="/create-bill" className="dash-action-btn dash-action-primary">
            ➕ Create New Bill
          </Link>
          <Link to="/ActiveBills" className="dash-action-btn dash-action-secondary">
            📋 View Active Bills
          </Link>
        </div>

        {/* Bill history */}
        <div className="dash-history">
          <div className="dash-history-header">
            <span className="dash-history-title">Bill History</span>
            <Link to="/ActiveBills" className="dash-history-see-all">See all →</Link>
          </div>

          {loading && (
            <div className="dash-loading">
              <div className="dash-spin"/><span>Loading bills...</span>
            </div>
          )}

          {!loading && bills.length === 0 && (
            <div className="dash-empty">
              <div className="dash-empty-icon">🧾</div>
              <p>No bills yet. Create your first one!</p>
              <Link to="/create-bill" className="dash-empty-cta">+ Create a Bill</Link>
            </div>
          )}

          {!loading && bills.map((bill) => (
            <div className="dash-bill-card" key={bill.id}>
              <div className="dash-bill-icon">{icon(bill.title)}</div>
              <div className="dash-bill-info">
                <div className="dash-bill-name">{bill.title}</div>
                <div className="dash-bill-amount">₦{Number(bill.total_amount).toLocaleString()}</div>
              </div>
              <div className={`dash-bill-status ${bill.status === "completed" ? "ds-done" : "ds-active"}`}>
                <span className="ds-dot"/>
                {bill.status === "completed" ? "Completed" : "In progress"}
              </div>
              <button className="dash-bill-btn" onClick={() => navigate(`/bill/${bill.id}`)}>
                View →
              </button>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

export default Dashboard;