import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-top">

          {/* Brand */}
          <div>
            <Link to="/" className="footer-brand-logo">ShareBill</Link>
            <p className="footer-brand-desc">
              The simplest way to split bills and collect payments in Nigeria.
              Create a bill, share a link, confirm receipts. Done.
            </p>
          </div>

          {/* Product */}
          <div>
            <div className="footer-col-title">Product</div>
            <ul className="footer-links">
              <li><a href="#how-it-works">How It Works</a></li>
              <li><a href="#features">Features</a></li>
              <li><Link to="/create-account">Create a Bill</Link></li>
              <li><Link to="/login">Log In</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <div className="footer-col-title">Company</div>
            <ul className="footer-links">
              <li><a href="#contact">About Us</a></li>
              <li><a href="#contact">Contact</a></li>
              <li><a href="#contact">Privacy Policy</a></li>
              <li><a href="#contact">Terms of Use</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <div className="footer-col-title">Contact</div>
            <ul className="footer-links">
              <li><a href="mailto:Sharebillcompany@gmail.com">Email Us</a></li>
              <li><a href="tel:+2347063115275">+234 706 311 5275</a></li>
              <li><a href="tel:+2348134457451">+234 813 445 7451</a></li>
              <li><span style={{ color: "rgba(243,232,255,0.32)", fontSize: 14 }}>Lagos, Nigeria</span></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="footer-copy">
            © {new Date().getFullYear()} ShareBill. DevBlessing 2026. All rights reserved.
          </p>
          <div className="footer-social">
            <a href="#" className="footer-social-btn" aria-label="Twitter">𝕏</a>
            <a href="#" className="footer-social-btn" aria-label="Instagram">📸</a>
            <a href="#" className="footer-social-btn" aria-label="WhatsApp">💬</a>
          </div>
        </div>
      </div>
    </footer>
  );
}