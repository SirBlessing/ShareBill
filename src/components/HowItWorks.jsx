import React from "react";

const steps = [
  {
    num: 1,
    numClass: "hiw-num-1",
    emoji: "📝",
    title: "Create a Bill",
    desc: "Enter the bill name, total amount, and your bank account details.",
  },
  {
    num: 2,
    numClass: "hiw-num-2",
    emoji: "👥",
    title: "Add Participants",
    desc: "Add everyone's name, WhatsApp number, and their share of the bill.",
  },
  {
    num: 3,
    numClass: "hiw-num-3",
    emoji: "💬",
    title: "Share the Link",
    desc: "Watch a quick ad to unlock WhatsApp links. Send each person their unique payment link.",
  },
  {
    num: 4,
    numClass: "hiw-num-4",
    emoji: "📸",
    title: "They Pay & Upload",
    desc: "Participants open the link, transfer their share, and upload a receipt photo.",
  },
  {
    num: 5,
    numClass: "hiw-num-5",
    emoji: "✅",
    title: "You Confirm",
    desc: "Review receipts in your dashboard and mark each payment confirmed. Done.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="hiw-section">
      <div className="hiw-head">
        <div className="section-tag">⚡ Simple Process</div>
        <h2 className="section-heading">
          From zero to collected<br />
          <span className="grad-text">in under 5 minutes</span>
        </h2>
        <p className="section-sub" style={{ margin: "0 auto" }}>
          No complicated setup. No app installs for your participants.
          Just a link, a transfer, and a confirmation.
        </p>
      </div>

      <div className="hiw-steps">
        {steps.map((s) => (
          <div className="hiw-step" key={s.num}>
            <div className={`hiw-num ${s.numClass}`}>
              <span className="hiw-emoji">{s.emoji}</span>
            </div>
            <div className="hiw-step-title">{s.title}</div>
            <div className="hiw-step-desc">{s.desc}</div>
          </div>
        ))}
      </div>
    </section>
  );
}