import React, { useState, useEffect, useRef } from "react";
import { Link, useSearchParams } from "react-router-dom";
import "./LegalPage.css";

/* ── Content ─────────────────────────────────────────────── */

const TERMS = {
  effective: "May 26, 2026",
  sections: [
    {
      num: "01",
      title: "Acceptance of Terms",
      body: `By accessing or using SHAREBILL ("the Platform"), you confirm that you have read, understood, and agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, you must discontinue use of the Platform immediately. Your continued use of SHAREBILL constitutes ongoing acceptance of these terms.`,
    },
    {
      num: "02",
      title: "Use of the Platform",
      body: `SHAREBILL is provided exclusively for lawful personal and commercial bill-splitting purposes. By using the Platform, you agree not to:`,
      list: [
        "Use the Platform to conduct, facilitate, or promote fraud, scams, or deceptive practices",
        "Attempt to gain unauthorized access to any part of the system, user accounts, or backend infrastructure",
        "Upload, distribute, or transmit malicious code, viruses, or harmful content",
        "Abuse, exploit, or misuse bill generation, link sharing, or payment tracking features",
        "Interfere with, disrupt, or degrade the performance or functionality of the Platform",
        "Impersonate any person, entity, or SHAREBILL itself",
      ],
      body2: `Violation of these provisions may result in immediate suspension or termination of your account.`,
    },
    {
      num: "03",
      title: "User Content & Responsibilities",
      body: `You are solely responsible for all information, data, and content you submit, upload, or share through SHAREBILL — including bill names, participant details, account information, and payment receipts. SHAREBILL does not verify the accuracy of user-submitted information. We reserve the right, at our sole discretion, to remove content or restrict access if misuse, harmful content, or violations of these terms are detected.`,
    },
    {
      num: "04",
      title: "Platform Availability",
      body: `SHAREBILL is provided on an "as available" basis. We do not guarantee uninterrupted, error-free, or continuous access to the Platform. SHAREBILL may be modified, suspended, updated, or permanently discontinued at any time, with or without prior notice. We shall not be held liable for any inconvenience or loss resulting from planned or unplanned service interruptions.`,
    },
    {
      num: "05",
      title: "Advertisements",
      body: `SHAREBILL may display advertisements and promotional content from third-party advertising networks as part of its free service model. By using SHAREBILL, you consent to the display of such advertisements. We are not responsible for the content, accuracy, quality, or availability of third-party products, services, or websites accessed through advertisements. Ad interactions are governed by the respective advertiser's terms and policies.`,
    },
    {
      num: "06",
      title: "Intellectual Property",
      body: `All SHAREBILL branding, logos, design elements, source code, platform architecture, written content, and related materials are the exclusive intellectual property of SHAREBILL and its creators, unless otherwise explicitly stated. You may not reproduce, copy, distribute, modify, or create derivative works from any part of SHAREBILL's intellectual property without prior written permission.`,
    },
    {
      num: "07",
      title: "Limitation of Liability",
      body: `SHAREBILL is provided "as is" and "as available" without warranties of any kind, either express or implied. To the fullest extent permitted by applicable law, SHAREBILL and its team shall not be liable for any of the following:`,
      list: [
        "Financial losses or incorrect payment amounts resulting from user error",
        "Loss, corruption, or unauthorized access to user data",
        "Service interruptions, downtime, or platform outages",
        "Misuse of the Platform by other users or third parties",
        "Actions, decisions, or content of third-party services or advertisers",
        "Indirect, incidental, special, or consequential damages of any nature",
      ],
    },
    {
      num: "08",
      title: "Account Termination",
      body: `SHAREBILL reserves the right, at its sole discretion and without prior notice, to suspend, restrict, or permanently terminate access for any user who violates these Terms and Conditions, engages in abusive or fraudulent behaviour, or poses a risk to other users or the integrity of the Platform. Termination does not relieve users of any obligations incurred prior to the termination date.`,
    },
    {
      num: "09",
      title: "Changes to These Terms",
      body: `SHAREBILL may update, revise, or replace these Terms and Conditions at any time. When changes are made, the "Effective Date" at the top of this document will be updated accordingly. Your continued use of SHAREBILL following the posting of updated terms constitutes your acceptance of those changes. We recommend reviewing these terms periodically.`,
    },
    {
      num: "10",
      title: "Governing Law",
      body: `These Terms and Conditions shall be governed by and construed in accordance with the laws applicable in the Federal Republic of Nigeria. Any disputes arising under or in connection with these terms shall be subject to the exclusive jurisdiction of competent courts in Nigeria.`,
    },
    {
      num: "11",
      title: "Contact Us",
      body: `If you have any questions, concerns, or feedback regarding these Terms and Conditions, please reach out to us:`,
      contact: true,
    },
  ],
};

const PRIVACY = {
  effective: "May 26, 2026",
  sections: [
    {
      num: "01",
      title: "Information We Collect",
      body: `When you use SHAREBILL, we may collect the following categories of information:`,
      list: [
        "Device information (device type, operating system, unique device identifiers)",
        "Browser type and version",
        "IP address and approximate location data",
        "Usage statistics and interaction data within the Platform",
        "Bill and participant data generated by users",
        "Cookies and analytics tracking data",
        "Information voluntarily provided during account registration and bill creation",
      ],
      body2: `We do not intentionally collect sensitive personal information — such as financial account credentials, government identification, or medical records — unless explicitly provided by the user in connection with their bill details.`,
    },
    {
      num: "02",
      title: "How We Use Your Information",
      body: `The information we collect is used for the following purposes:`,
      list: [
        "To operate, maintain, and improve the SHAREBILL Platform",
        "To ensure platform security and prevent fraudulent or abusive activity",
        "To monitor application performance and resolve technical issues",
        "To analyse user engagement and improve the overall user experience",
        "To display relevant advertisements through third-party ad networks",
        "To communicate important updates, changes, or announcements",
      ],
      body2: `We do not sell your personal information to third parties.`,
    },
    {
      num: "03",
      title: "Advertising",
      body: `SHAREBILL may integrate third-party advertising services — including but not limited to Moneytag, Google AdSense, or similar ad networks — to help fund the free operation of the Platform. These advertising partners may use cookies, web beacons, and other tracking technologies to serve personalised advertisements and measure ad performance. Their use of your data is governed by their respective privacy policies. SHAREBILL does not control the data practices of third-party advertisers.`,
    },
    {
      num: "04",
      title: "Cookies & Tracking Technologies",
      body: `SHAREBILL and its third-party partners may use cookies, local storage, and similar technologies to enhance Platform functionality, remember user preferences, maintain session integrity, and gather analytics data. You can manage or disable cookies through your browser settings, though doing so may affect the functionality of certain features. By continuing to use SHAREBILL, you consent to our use of cookies as described in this Policy.`,
    },
    {
      num: "05",
      title: "Third-Party Services",
      body: `SHAREBILL may integrate or rely on third-party services to deliver its features. These may include:`,
      list: [
        "Netlify or similar hosting and deployment providers",
        "Analytics platforms for usage tracking and performance monitoring",
        "Advertising networks for ad delivery and monetisation",
        "Payment-related or financial services for verifying bill receipts",
      ],
      body2: `Each third-party service operates under its own independent privacy policy. SHAREBILL is not responsible for the data practices of these external services. We encourage you to review the privacy policies of any third-party services you interact with.`,
    },
    {
      num: "06",
      title: "Data Security",
      body: `SHAREBILL implements commercially reasonable technical and organisational measures to protect your information from unauthorised access, alteration, disclosure, or destruction. These measures include secure connections (HTTPS), access controls, and data minimisation practices. However, no method of internet transmission or electronic storage is completely secure. We cannot guarantee the absolute security of your data, and you use the Platform at your own risk.`,
    },
    {
      num: "07",
      title: "User Responsibilities",
      body: `You are responsible for ensuring that any personal information you share about other individuals through SHAREBILL — including participant names, WhatsApp numbers, and payment details — is shared with their knowledge and consent. You agree to use SHAREBILL in compliance with all applicable data protection laws and regulations, and you must not share information that violates the rights of others.`,
    },
    {
      num: "08",
      title: "Children's Privacy",
      body: `SHAREBILL is not intended for, nor directed at, children under the age of 13. We do not knowingly collect personal information from children under 13. If you believe that a child under 13 has provided us with personal information without parental consent, please contact us immediately at Sharebillcompany@gmail.com and we will take prompt steps to delete such information.`,
    },
    {
      num: "09",
      title: "Changes to This Policy",
      body: `We may update this Privacy Policy at any time to reflect changes in our practices, technology, legal requirements, or other factors. When we do, we will update the "Effective Date" at the top of this document. Changes take effect immediately upon posting. We encourage you to review this Policy periodically to stay informed about how we protect your information.`,
    },
    {
      num: "10",
      title: "Contact Us",
      body: `If you have any questions, concerns, or requests regarding this Privacy Policy or your personal data, please contact us:`,
      contact: true,
    },
  ],
};

/* ── Reusable section renderer ───────────────────────────── */
function Section({ sec }) {
  return (
    <div className="legal-section" id={`section-${sec.num}`}>
      <div className="legal-section-num">{sec.num}</div>
      <div className="legal-section-body">
        <h2 className="legal-section-title">{sec.title}</h2>
        <p className="legal-para">{sec.body}</p>

        {sec.list && (
          <ul className="legal-list">
            {sec.list.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        )}

        {sec.body2 && <p className="legal-para">{sec.body2}</p>}

        {sec.contact && (
          <div className="legal-contact-box">
            <div className="legal-contact-row">
              <span className="legal-contact-icon">📧</span>
              <span>
                <strong>Email:</strong>{" "}
                <a href="mailto:Sharebillcompany@gmail.com">
                  Sharebillcompany@gmail.com
                </a>
              </span>
            </div>
            <div className="legal-contact-row">
              <span className="legal-contact-icon">📍</span>
              <span><strong>Location:</strong> Nigeria</span>
            </div>
            <div className="legal-contact-row">
              <span className="legal-contact-icon">🌐</span>
              <span><strong>Website:</strong> Sharebill.com</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Table of contents ───────────────────────────────────── */
function TOC({ sections, activeSection }) {
  return (
    <nav className="legal-toc">
      <div className="legal-toc-label">Contents</div>
      {sections.map(s => (
        <a
          key={s.num}
          href={`#section-${s.num}`}
          className={`legal-toc-item ${activeSection === s.num ? "active" : ""}`}
        >
          <span className="legal-toc-num">{s.num}</span>
          <span className="legal-toc-text">{s.title}</span>
        </a>
      ))}
    </nav>
  );
}

/* ── Main page ───────────────────────────────────────────── */
export default function LegalPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const tab = searchParams.get("tab") === "privacy" ? "privacy" : "terms";

  const [activeSection, setActiveSection] = useState("01");
  const contentRef = useRef(null);

  const doc = tab === "privacy" ? PRIVACY : TERMS;

  const switchTab = (t) => {
    setSearchParams({ tab: t });
    setActiveSection("01");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /* highlight active TOC item as user scrolls */
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            const id = e.target.id.replace("section-", "");
            setActiveSection(id);
          }
        });
      },
      { rootMargin: "-20% 0px -70% 0px" }
    );
    const els = document.querySelectorAll(".legal-section");
    els.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, [tab]);

  return (
    <div className="legal-page">

      {/* Header */}
      <header className="legal-header">
        <Link to="/" className="legal-logo">ShareBill</Link>
        <div className="legal-header-right">
          <Link to="/" className="legal-back">← Back to Home</Link>
        </div>
      </header>

      {/* Hero */}
      <div className="legal-hero">
        <div className="legal-hero-tag">Legal</div>
        <h1 className="legal-hero-title">
          {tab === "privacy" ? "Privacy Policy" : "Terms & Conditions"}
        </h1>
        <p className="legal-hero-sub">Effective Date: {doc.effective}</p>

        {/* Tab switcher */}
        <div className="legal-tabs">
          <button
            className={`legal-tab ${tab === "terms" ? "active" : ""}`}
            onClick={() => switchTab("terms")}
          >
            Terms & Conditions
          </button>
          <button
            className={`legal-tab ${tab === "privacy" ? "active" : ""}`}
            onClick={() => switchTab("privacy")}
          >
            Privacy Policy
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="legal-body">
        <TOC sections={doc.sections} activeSection={activeSection} />

        <div className="legal-content" ref={contentRef}>
          {tab === "terms" && (
            <p className="legal-intro">
              Welcome to SHAREBILL. These Terms and Conditions govern your access to and use of the
              SHAREBILL platform and services. Please read them carefully before using the Platform.
            </p>
          )}
          {tab === "privacy" && (
            <p className="legal-intro">
              Welcome to SHAREBILL. Your privacy matters to us. This Privacy Policy explains what
              information we collect, how we use it, and the choices available to you. By using
              SHAREBILL, you consent to the practices described in this Policy.
            </p>
          )}

          {doc.sections.map(sec => <Section key={sec.num} sec={sec} />)}

          <div className="legal-footer-note">
            © {new Date().getFullYear()} SHAREBILL. All rights reserved. &nbsp;·&nbsp;
            {tab === "terms" ? (
              <button className="legal-switch-link" onClick={() => switchTab("privacy")}>
                View Privacy Policy →
              </button>
            ) : (
              <button className="legal-switch-link" onClick={() => switchTab("terms")}>
                View Terms & Conditions →
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}