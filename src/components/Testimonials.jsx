import React from "react";

const testimonials = [
  {
    quote: "I used to send 15 messages in the group chat before everyone paid. ShareBill changed everything — I shared one link and the money was confirmed the same night.",
    name: "Chidera A.",
    role: "Event Organiser, Lagos",
    avatarClass: "av-1",
    initials: "CA",
  },
  {
    quote: "Hosting office lunches was a nightmare. Now I create a bill in 2 minutes, send links on WhatsApp, and watch the receipts roll in. My colleagues actually prefer it.",
    name: "Emeka T.",
    role: "Team Lead, Abuja",
    avatarClass: "av-2",
    initials: "ET",
  },
  {
    quote: "The equal split with the receipt upload feature is 🔥. No more 'I'll pay you back' that never comes. They upload proof, I confirm, we're done. Simple.",
    name: "Folake B.",
    role: "Freelancer, Port Harcourt",
    avatarClass: "av-3",
    initials: "FB",
  },
];

export default function Testimonials() {
  return (
    <section className="testi-section">
      <div className="testi-inner">
        <div className="testi-head">
          <div className="section-tag">💬 Testimonials</div>
          <h2 className="section-heading">
            People stopped chasing.<br />
            <span className="grad-text">Money started flowing.</span>
          </h2>
        </div>

        <div className="testi-grid">
          {testimonials.map((t, i) => (
            <div className="testi-card" key={i}>
              <div className="testi-stars">★★★★★</div>
              <span className="testi-quote-mark">"</span>
              <p className="testi-text">{t.quote}</p>
              <div className="testi-author">
                <div className={`testi-avatar ${t.avatarClass}`}>{t.initials}</div>
                <div>
                  <div className="testi-name">{t.name}</div>
                  <div className="testi-role">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}