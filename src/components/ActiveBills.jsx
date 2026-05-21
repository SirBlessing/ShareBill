import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./ActiveBills.css";

const API = "http://localhost:5000";

const BILL_ICONS = ["🍽️","🎉","✈️","🏠","🎂","⚽","🎬","🛒","🎵","💼"];
const getBillIcon = (title = "") => BILL_ICONS[title.charCodeAt(0) % BILL_ICONS.length];

/* ══════════════════════════════════════════
   STACKED CARDS ILLUSTRATION
══════════════════════════════════════════ */
function VisualPanel({ bills }) {
  const totalAmount  = bills.reduce((s, b) => s + Number(b.total_amount || 0), 0);
  const activeCount  = bills.filter(b => b.status !== "completed").length;
  const doneCount    = bills.filter(b => b.status === "completed").length;

  /* top card = latest bill */
  const topBill = bills[0];

  return (
    <div className="ab-visual">

      {/* stacked bill cards */}
      <div className="ab-stack">
        {/* back */}
        <div className="ab-stack-card">
          <div className="ab-card-label">ShareBill</div>
          <div className="ab-card-name">Birthday Party 🎉</div>
          <div className="ab-card-amount">₦80,000</div>
        </div>
        {/* middle */}
        <div className="ab-stack-card">
          <div className="ab-card-label">ShareBill</div>
          <div className="ab-card-name">Lagos Trip ✈️</div>
          <div className="ab-card-amount">₦120,000</div>
        </div>
        {/* top — uses real data if available */}
        <div className="ab-stack-card">
          <div className="ab-card-label">Latest Bill</div>
          <div className="ab-card-name">
            {topBill ? topBill.title : "Eko Island Dinner 🍽️"}
          </div>
          <div className="ab-card-amount">
            {topBill ? `₦${Number(topBill.total_amount).toLocaleString()}` : "₦48,000"}
          </div>
          <div className="ab-card-bar">
            <div className="ab-card-fill" style={{ width: "65%" }} />
          </div>
          <div className="ab-card-progress-txt">3 of 5 participants paid</div>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <div className="ab-card-avatars">
              {["AO","TK","BN"].map((init,i) => (
                <div key={i} className="ab-avatar"
                  style={{ background: ["#C026D3","#7C3AED","#22D3EE"][i] }}>
                  {init}
                </div>
              ))}
            </div>
            <div className={`ab-card-status ${topBill?.status === "completed" ? "as-pend" : "as-active"}`}>
              ● {topBill?.status === "completed" ? "Closed" : "Active"}
            </div>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="ab-stats">
        <div className="ab-stat">
          <div className="ab-stat-num">{bills.length}</div>
          <div className="ab-stat-lbl">Total Bills</div>
        </div>
        <div className="ab-stat">
          <div className="ab-stat-num">{activeCount}</div>
          <div className="ab-stat-lbl">Active</div>
        </div>
        <div className="ab-stat">
          <div className="ab-stat-num">
            {totalAmount >= 1_000_000
              ? `₦${(totalAmount/1_000_000).toFixed(1)}M`
              : totalAmount >= 1000
              ? `₦${(totalAmount/1000).toFixed(0)}K`
              : `₦${totalAmount}`}
          </div>
          <div className="ab-stat-lbl">Tracked</div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   ACTIVE BILLS PAGE
══════════════════════════════════════════ */
const ActiveBills = () => {
  const navigate = useNavigate();
  const [bills,   setBills]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState("");

  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${API}/bills/my-bills`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBills(res.data);
      } catch {
        setError("Failed to load bills. Please try again.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="ab-page">

      {/* ── LEFT: VISUAL ── */}
      <VisualPanel bills={bills} />

      {/* ── RIGHT: CONTENT ── */}
      <div className="ab-content">

        <Link to="/dashboard" className="ab-back">← Back to dashboard</Link>

        <h1 className="ab-title">Active Bills</h1>
        <div className="ab-title-line" />

        <div className="ab-actions">
          <button className="ab-btn-remind">🔔 Remind All Pending</button>
          <Link to="/create-bill" className="ab-btn-create">+ Create New Bill</Link>
        </div>

        {/* ── STATES ── */}
        {loading && (
          <div className="ab-loading">
            <div className="ab-spin" />
            Loading your bills...
          </div>
        )}

        {!loading && error && <div className="ab-err">{error}</div>}

        {!loading && !error && bills.length === 0 && (
          <div className="ab-empty">
            <div className="ab-empty-icon">🧾</div>
            <p>No bills yet. Create your first bill and start collecting!</p>
            <Link to="/create-bill" className="ab-empty-link">+ Create a Bill</Link>
          </div>
        )}

        {/* ── BILL LIST ── */}
        {!loading && bills.map((bill) => (
          <div className="ab-bill-card" key={bill.id}>
            <div className="ab-bill-icon">{getBillIcon(bill.title)}</div>

            <div className="ab-bill-info">
              <div className="ab-bill-name">{bill.title}</div>
              <div className="ab-bill-meta">
                ₦{Number(bill.total_amount).toLocaleString()} &nbsp;·&nbsp;
                {bill.created_at ? new Date(bill.created_at).toLocaleDateString("en-NG", { day:"numeric", month:"short" }) : ""}
              </div>
            </div>

            <div className={`ab-bill-status ${bill.status === "completed" ? "ab-s-done" : "ab-s-active"}`}>
              {bill.status === "completed" ? "● Closed" : "● Active"}
            </div>

            <button
              className="ab-view-btn"
              onClick={() => navigate(`/bill/${bill.id}`)}
            >
              View →
            </button>
          </div>
        ))}

      </div>
    </div>
  );
};

export default ActiveBills;