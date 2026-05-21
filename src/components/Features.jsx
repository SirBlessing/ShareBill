import React from "react";

const features = [
  {
    icon: "⚡",
    iconClass: "fi-pink",
    title: "Instant Bill Creation",
    desc: "Create a fully detailed bill with participants in under 2 minutes. No friction, no forms.",
  },
  {
    icon: "✂️",
    iconClass: "fi-violet",
    title: "Equal or Custom Split",
    desc: "Split evenly across everyone including yourself, or assign custom amounts per person.",
  },
  {
    icon: "💬",
    iconClass: "fi-cyan",
    title: "WhatsApp Sharing",
    desc: "Each participant gets a unique WhatsApp link with their exact amount and your bank details pre-filled.",
  },
  {
    icon: "📸",
    iconClass: "fi-green",
    title: "Receipt Upload",
    desc: "Participants upload proof of payment directly through their link. No login, no account needed.",
  },
  {
    icon: "🔔",
    iconClass: "fi-amber",
    title: "Payment Reminders",
    desc: "Send WhatsApp reminders to anyone who hasn't paid yet with one tap from your dashboard.",
  },
  {
    icon: "📊",
    iconClass: "fi-pink",
    title: "Live Dashboard",
    desc: "See who has paid, who is awaiting confirmation, and who is still pending — all in real time.",
  },
];

export default function Features() {
  return (
    <section id="features" className="features-section">
      <div className="features-head">
        <div className="section-tag">🛠️ Features</div>
        <h2 className="section-heading">
          Everything you need to<br />
          <span className="grad-text">collect money stress-free</span>
        </h2>
        <p className="section-sub">
          Built for Nigerians who are tired of chasing people for their share.
          ShareBill handles the awkward part.
        </p>
      </div>

      <div className="features-grid">
        {features.map((f, i) => (
          <div className="feat-card" key={i}>
            <div className={`feat-icon-wrap ${f.iconClass}`}>{f.icon}</div>
            <div className="feat-title">{f.title}</div>
            <div className="feat-desc">{f.desc}</div>
          </div>
        ))}
      </div>
    </section>
  );
}