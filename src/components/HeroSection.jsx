import React from "react";
import { Link } from "react-router-dom";

const participants = [
  { initials: "AO", name: "Adeola O.", amount: "₦12,000", status: "paid",    statusLabel: "Paid",    avatarColor: "#C026D3", statusClass: "s-paid" },
  { initials: "TK", name: "Tunde K.",  amount: "₦12,000", status: "awaiting", statusLabel: "Confirm", avatarColor: "#7C3AED", statusClass: "s-await" },
  { initials: "BN", name: "Bisi N.",   amount: "₦12,000", status: "pending",  statusLabel: "Pending", avatarColor: "#22D3EE", statusClass: "s-pending" },
];

export default function HeroSection() {
  return (
    <section className="hero-section">
      <div className="hero-inner">

        {/* ── LEFT ── */}
        <div className="hero-left">
          <div className="hero-badge">
            <span className="hero-badge-dot" />
            100% Free · No signup fees
          </div>

          <h1 className="hero-title">
            Split bills.<br />
            <span className="grad-text">Zero awkwardness.</span>
          </h1>

          <p className="hero-sub">
            Create a bill, add participants, share a link on WhatsApp.
            Everyone pays, uploads their receipt, and you confirm. Done.
          </p>

          <div className="hero-buttons">
            <Link to="/create-account" className="btn-primary">
              Create Your First Bill →
            </Link>
            <a href="#how-it-works" className="btn-outline">
              See How It Works
            </a>
          </div>

          <div className="hero-stats">
            <div className="hero-stat-item">
              <div className="hero-stat-num">5K+</div>
              <div className="hero-stat-label">Bills Created</div>
            </div>
            <div className="hero-stat-item">
              <div className="hero-stat-num">₦50M+</div>
              <div className="hero-stat-label">Tracked</div>
            </div>
            <div className="hero-stat-item">
              <div className="hero-stat-num">Free</div>
              <div className="hero-stat-label">Always</div>
            </div>
          </div>
        </div>

        {/* ── RIGHT — CSS PHONE MOCKUP ── */}
        <div className="hero-visual">
          <div className="phone-glow" />

          {/* Floating chips */}
          <div className="phone-chip chip-1">
            <span className="chip-icon">✅</span>Payment confirmed!
          </div>
          <div className="phone-chip chip-2">
            <span className="chip-icon">💬</span>Link sent via WhatsApp
          </div>

          <div className="phone-frame">
            <div className="phone-notch" />
            <div className="phone-status-bar">
              <span>9:41</span>
              <span>●●●</span>
            </div>

            <div className="phone-screen">
              <div className="phone-app-header">
                <span className="phone-app-logo">ShareBill</span>
                <div className="phone-notif-btn">🔔</div>
              </div>

              {/* Bill card */}
              <div className="phone-bill-card">
                <div className="phone-bill-name">🍽️ Eko Island Dinner</div>
                <div className="phone-bill-amount">₦48,000</div>
                <div className="phone-progress-bar">
                  <div className="phone-progress-fill" />
                </div>
                <div className="phone-progress-label">3 of 4 participants paid</div>
              </div>

              {/* Participants */}
              <div className="phone-participants">
                <div className="phone-p-label">Participants</div>
                {participants.map((p, i) => (
                  <div className="phone-p-row" key={i}>
                    <div className="phone-p-left">
                      <div
                        className="phone-avatar"
                        style={{ background: p.avatarColor }}
                      >
                        {p.initials}
                      </div>
                      <div>
                        <div className="phone-p-name">{p.name}</div>
                        <div className="phone-p-amount">{p.amount}</div>
                      </div>
                    </div>
                    <span className={`phone-p-status ${p.statusClass}`}>
                      {p.statusLabel}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}