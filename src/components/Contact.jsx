import React from "react";
import { Link } from "react-router-dom";

const contactItems = [
  { icon: "📞", label: "+234 706 311 5275" },
  { icon: "📧", label: "Sharebillcompany@gmail.com" },
  { icon: "🌐", label: "Sharebill.com" },
  { icon: "📍", label: "Nigeria" },
];

export default function Contact() {
  return (
    <section id="contact" className="cta-section">
      <div className="cta-card">
        <div className="section-tag" style={{ margin: "0 auto 24px" }}>
          🚀 Get Started
        </div>

        <h2 className="cta-title">
          Ready to collect your<br />
          <span className="grad-text">money without the stress?</span>
        </h2>

        <p className="cta-sub">
          Create your first bill in under 2 minutes.
          Free forever. No credit card. No hidden fees.
        </p>

        <div className="cta-buttons">
          <Link to="/create-account" className="btn-primary" style={{ fontSize: 16, padding: "16px 36px" }}>
            Create a Free Bill →
          </Link>
          <Link to="/login" className="btn-outline">
            I already have an account
          </Link>
        </div>

        <div className="cta-contact-row">
          {contactItems.map((c, i) => (
            <div className="cta-contact-item" key={i}>
              <div className="cta-contact-icon">{c.icon}</div>
              <span>{c.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}