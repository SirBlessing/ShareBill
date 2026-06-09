import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./BillDashboard.css";

const API          = import.meta.env.VITE_API_URL || "http://localhost:5000";
const APP_BASE_URL = window.location.origin;
const AD_DURATION  = 5;

/* ─────────────────────────────────────────────
   PHONE NORMALISER
───────────────────────────────────────────── */
function toWhatsAppNumber(raw = "") {
  const d = raw.replace(/\D/g, "");
  if (!d) return "";
  if (d.startsWith("234") && d.length >= 12) return d;
  if (d.startsWith("0")   && d.length === 11) return "234" + d.slice(1);
  if (d.length === 10) return "234" + d;
  return d;
}

/* ─────────────────────────────────────────────
   AD WATCH MODAL
   Injects vignette ad on mount, runs countdown.
   Vignette shows its own full-screen overlay.
───────────────────────────────────────────── */
function AdWatchModal({ onComplete, purpose = "share" }) {
  const [seconds,  setSeconds]  = useState(AD_DURATION);
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef(null);

  /* ── Inject vignette ad when modal opens ── */
  useEffect(() => {
    const s = document.createElement("script");
    s.dataset.zone = "11101728";
    s.src = "https://n6wxm.com/vignette.min.js";
    s.async = true;
    document.body.appendChild(s);

    return () => {
      try { document.body.removeChild(s); } catch (_) {}
    };
  }, []);

  /* ── Countdown ── */
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setSeconds(prev => {
        const next = prev - 1;
        setProgress(((AD_DURATION - next) / AD_DURATION) * 100);
        if (next <= 0) {
          clearInterval(intervalRef.current);
          setTimeout(onComplete, 300);
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, [onComplete]);

  const desc = purpose === "share"
    ? "Watch this short ad to unlock share links & payment confirmation."
    : "Watch this short ad to unlock reminders.";

  return (
    <div className="ad-overlay">
      <div className="ad-modal">

        <div className="ad-countdown-wrap" style={{ marginTop: 32 }}>
          <svg className="ad-ring" viewBox="0 0 60 60">
            <circle cx="30" cy="30" r="24"
              fill="none" stroke="rgba(255,255,255,.1)" strokeWidth="4"/>
            <circle cx="30" cy="30" r="24"
              fill="none" stroke="#C026D3" strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 24}`}
              strokeDashoffset={`${2 * Math.PI * 24 * (1 - progress / 100)}`}
              transform="rotate(-90 30 30)"
              style={{ transition: "stroke-dashoffset 0.9s linear" }}
            />
          </svg>
          <div className="ad-countdown-num">{Math.max(seconds, 0)}</div>
        </div>

        <div className="ad-progress-bar">
          <div className="ad-progress-fill" style={{ width: `${progress}%` }} />
        </div>

        <p className="ad-desc">
          {desc}<br />
          Ads keep ShareBill free for everyone 💜
        </p>
        <p className="ad-wait">
          {seconds > 0
            ? `Please wait ${seconds} second${seconds !== 1 ? "s" : ""}…`
            : "✅ Unlocking…"}
        </p>

      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   REMINDER MODAL
───────────────────────────────────────────── */
function RemindModal({ participants, bill, billId, onClose }) {
  const pending = participants
    .map((p, i) => ({ ...p, realIndex: i }))
    .filter(p => !p.isCreator && p.status !== "paid");

  const buildLink = (p) => {
    const phone    = toWhatsAppNumber(p.whatsapp);
    const pageLink = `${APP_BASE_URL}/pay/${billId}/${p.realIndex}`;
    const msg =
      `Hi ${p.name}! 👋\n\n` +
      `Just a reminder about *${bill.title}*.\n` +
      `Your share: *₦${Number(p.amount).toLocaleString()}*\n\n` +
      `Please pay to:\nBank: ${bill.bank_name}\n` +
      `Account: ${bill.account_name} — ${bill.account_number}\n\n` +
      `Upload your receipt here:\n${pageLink}\n\nThank you! 🙏`;
    return `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
  };

  return (
    <div className="remind-modal-overlay" onClick={onClose}>
      <div className="remind-modal" onClick={e => e.stopPropagation()}>

        <div className="remind-modal-header">
          <div>
            <h3>🔔 Send Reminders</h3>
            <p>{pending.length === 0
              ? "Everyone has paid!"
              : `${pending.length} participant${pending.length !== 1 ? "s" : ""} still pending`}
            </p>
          </div>
          <button className="remind-modal-close" onClick={onClose}>✕</button>
        </div>

        {pending.length === 0 ? (
          <div className="remind-empty">🎉 All participants have paid!</div>
        ) : (
          <div className="remind-list">
            {pending.map((p, i) => (
              <div className="remind-row" key={i}>
                <div className="remind-row-left">
                  <div className="remind-avatar">{p.name.charAt(0).toUpperCase()}</div>
                  <div>
                    <div className="remind-name">{p.name}</div>
                    <div className="remind-meta">
                      ₦{Number(p.amount).toLocaleString()} ·{" "}
                      <span className={`remind-status-pill rs-${p.status || "pending"}`}>
                        {p.status || "pending"}
                      </span>
                    </div>
                  </div>
                </div>
                <a href={buildLink(p)} target="_blank" rel="noreferrer"
                  className="remind-wa-btn">
                  💬 Send
                </a>
              </div>
            ))}
          </div>
        )}

        <div className="remind-modal-footer">
          Click "Send" on each person to open WhatsApp with a pre-filled reminder.
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   BILL DASHBOARD
───────────────────────────────────────────── */
const BillDashboard = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [bill,          setBill]          = useState(null);
  const [participants,  setParticipants]  = useState([]);
  const [loading,       setLoading]       = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [receiptModal,  setReceiptModal]  = useState(null);
  const [copiedIndex,   setCopiedIndex]   = useState(null);

  const [shareAd,        setShareAd]        = useState(false);
  const [shareUnlocked,  setShareUnlocked]  = useState(false);

  const [remindAd,       setRemindAd]       = useState(false);
  const [remindUnlocked, setRemindUnlocked] = useState(false);
  const [remindModal,    setRemindModal]    = useState(false);

  /* ── fetch bill ── */
  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${API}/bills/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBill(res.data);
        setParticipants(
          res.data.participants ? JSON.parse(res.data.participants) : []
        );
      } catch { navigate("/login"); }
      finally  { setLoading(false); }
    })();
  }, [id, navigate]);

  /* ── share ad complete → unlock share links + mark paid ── */
  const handleUnlockShare     = () => setShareAd(true);
  const handleShareAdComplete = () => {
    setShareAd(false);
    setShareUnlocked(true);
  };

  /* ── remind ad complete → open reminder modal ── */
  const handleRemindAdComplete = () => {
    setRemindAd(false);
    setRemindUnlocked(true);
    setRemindModal(true);
  };

  /* ── mark paid / undo ── */
  const handleStatusChange = async (index, newStatus) => {
    setActionLoading(index);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.patch(
        `${API}/bills/${id}/participant/${index}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setParticipants(res.data.participants);
    } catch { alert("Could not update status. Please try again."); }
    finally  { setActionLoading(null); }
  };

  /* ── close bill ── */
  const handleCloseBill = async () => {
    if (!window.confirm("Close this bill? It will be marked as completed.")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.patch(`${API}/bills/${id}/close`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate("/dashboard");
    } catch { alert("Failed to close bill."); }
  };

  /* ── whatsapp link ── */
  const buildWhatsAppLink = (participant, index) => {
    const phone    = toWhatsAppNumber(participant.whatsapp);
    const pageLink = `${APP_BASE_URL}/pay/${id}/${index}`;
    const msg =
      `Hi ${participant.name}! 👋\n\n` +
      `You've been added to a bill: *${bill?.title}*\n` +
      `Your share: *₦${Number(participant.amount).toLocaleString()}*\n\n` +
      `Pay to:\nBank: ${bill?.bank_name}\n` +
      `Account: ${bill?.account_name} — ${bill?.account_number}\n\n` +
      `Upload your receipt here:\n${pageLink}`;
    return `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
  };

  const handleCopyLink = (index) => {
    navigator.clipboard.writeText(`${APP_BASE_URL}/pay/${id}/${index}`);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  if (loading || !bill) return (
    <p style={{ color: "white", padding: 40 }}>Loading…</p>
  );

  const totalAmount   = Number(bill.total_amount);
  const paidCount     = participants.filter(p => p.status === "paid").length;
  const awaitingCount = participants.filter(p => p.status === "awaiting").length;
  const pendingCount  = participants.length - paidCount - awaitingCount;
  const needRemind    = pendingCount + awaitingCount;

  return (
    <div className="bill-dashboard-page">

      {/* ── AD MODALS ── */}
      {shareAd  && <AdWatchModal onComplete={handleShareAdComplete}  purpose="share"  />}
      {remindAd && <AdWatchModal onComplete={handleRemindAdComplete} purpose="remind" />}

      {/* ── RECEIPT MODAL ── */}
      {receiptModal && (
        <div className="receipt-modal-overlay" onClick={() => setReceiptModal(null)}>
          <div className="receipt-modal" onClick={e => e.stopPropagation()}>
            <button className="receipt-modal-close"
              onClick={() => setReceiptModal(null)}>✕</button>
            <img src={receiptModal} alt="Receipt" className="receipt-modal-img" />
          </div>
        </div>
      )}

      {/* ── REMINDER MODAL ── */}
      {remindModal && (
        <RemindModal
          participants={participants}
          bill={bill}
          billId={id}
          onClose={() => setRemindModal(false)}
        />
      )}

      <div className="bill-dashboard-top">

        {/* ════════ LEFT PANEL ════════ */}
        <div className="bill-summary">
          <h1 className="page-title">Bill Dashboard</h1>

          <div className="summary-box">
            <h3>Bill Summary</h3>
            <p><strong>Bill:</strong> {bill.title}</p>
            <p><strong>Total:</strong> ₦{totalAmount.toLocaleString()}</p>
            <p><strong>Split:</strong> {bill.equal_split ? "Equal" : "Custom"}</p>
            <small>Only visible to you (the creator)</small>
          </div>

          <div className="summary-box">
            <h3>Progress</h3>
            <p>✅ Paid: <strong>{paidCount}</strong> / {participants.length}</p>
            <p>⏳ Awaiting: <strong>{awaitingCount}</strong></p>
            <p>🔴 Pending: <strong>{pendingCount}</strong></p>
          </div>

          {/* ── SHARE LINKS (ad-gated) ── */}
          <div className="summary-box">
            <h3>Share Bill Links</h3>
            {!shareUnlocked ? (
              <>
                <p style={{ fontSize: 13, opacity: .7, marginBottom: 12 }}>
                  Watch a quick ad to unlock WhatsApp share links.
                  <span style={{
                    color: "rgba(243,232,255,.4)", fontSize: 11,
                    marginTop: 4, display: "block"
                  }}>
                    This also unlocks payment confirmation.
                  </span>
                </p>
                <button
                  className="remind-btn"
                  onClick={handleUnlockShare}
                  style={{ width: "100%" }}
                >
                  ▶ Watch Ad to Unlock
                </button>
              </>
            ) : (
              <div className="share-links-list">
                {participants
                  .filter(p => !p.isCreator)
                  .map((p) => {
                    const idx = participants.indexOf(p);
                    return (
                      <div className="share-link-row" key={idx}>
                        <span className="share-link-name">{p.name}</span>
                        <div className="share-link-btns">
                          <a
                            href={buildWhatsAppLink(p, idx)}
                            target="_blank" rel="noreferrer"
                            className="whatsapp-btn"
                          >
                            💬 WhatsApp
                          </a>
                          <button
                            className="copy-link-btn"
                            onClick={() => handleCopyLink(idx)}
                          >
                            {copiedIndex === idx ? "Copied!" : "Copy"}
                          </button>
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>

          {/* ── REMIND ALL (ad-gated) ── */}
          {!remindUnlocked ? (
            <button
              className="remind-btn remind-btn-locked"
              onClick={() => setRemindAd(true)}
            >
              🔒 Watch Ad to Send Reminders ({needRemind})
            </button>
          ) : (
            <button
              className="remind-btn"
              onClick={() => setRemindModal(true)}
            >
              🔔 Send Reminders ({needRemind})
            </button>
          )}
        </div>

        {/* ════════ RIGHT TABLE ════════ */}
        <div className="payment-status">
          <h2>Payment Status</h2>

          {!shareUnlocked && (
            <p className="markpaid-hint">
              🔒 Mark as Paid unlocks after watching the ad in Share Bill Links.
            </p>
          )}

          <div className="table-scroll-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Receipt</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {participants.map((p, i) => {
                  const status     = p.status || "pending";
                  const isCreator  = !!p.isCreator;
                  const isUpdating = actionLoading === i;

                  let actionCell;
                  if (isUpdating) {
                    actionCell = (
                      <div className="spinner" style={{ margin: "0 auto" }} />
                    );
                  } else if (status === "paid") {
                    actionCell = (
                      <button className="undo-btn"
                        onClick={() => handleStatusChange(i, "pending")}>
                        Undo
                      </button>
                    );
                  } else if (!shareUnlocked) {
                    actionCell = (
                      <button
                        className="paid-btn paid-btn-locked"
                        disabled
                        title="Watch the ad in Share Bill Links to unlock"
                      >
                        🔒 {status === "awaiting"
                          ? "Confirm"
                          : isCreator ? "My Share" : "Mark Paid"}
                      </button>
                    );
                  } else if (status === "awaiting") {
                    actionCell = (
                      <button className="paid-btn"
                        onClick={() => handleStatusChange(i, "paid")}>
                        ✓ Confirm
                      </button>
                    );
                  } else {
                    actionCell = (
                      <button className="paid-btn"
                        onClick={() => handleStatusChange(i, "paid")}>
                        {isCreator ? "Mark My Share Paid" : "Mark Paid"}
                      </button>
                    );
                  }

                  return (
                    <tr key={i} className={isCreator ? "creator-row" : ""}>
                      <td data-label="Name">
                        <span>{p.name}</span>
                        {isCreator && (
                          <span className="creator-badge">👑 Creator</span>
                        )}
                      </td>
                      <td data-label="Amount">
                        ₦{Number(p.amount || 0).toLocaleString(undefined, {
                          maximumFractionDigits: 2
                        })}
                      </td>
                      <td data-label="Status">
                        <span className={`status-badge ${status}`}>
                          <span className="status-dot" />
                          {status === "awaiting"
                            ? "Awaiting"
                            : status.charAt(0).toUpperCase() + status.slice(1)}
                        </span>
                      </td>
                      <td data-label="Receipt">
                        {isCreator
                          ? <span style={{ opacity: .4, fontSize: 12 }}>N/A</span>
                          : p.receipt
                          ? <button className="view-receipt-btn"
                              onClick={() => setReceiptModal(p.receipt)}>
                              View 🧾
                            </button>
                          : <span style={{ opacity: .4, fontSize: 12 }}>None</span>}
                      </td>
                      <td data-label="Action">{actionCell}</td>
                    </tr>
                  );
                })}

                {participants.length === 0 && (
                  <tr>
                    <td colSpan={5} style={{ textAlign: "center", opacity: .5 }}>
                      No participants yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* ── FOOTER ── */}
      <div className="bill-dashboard-footer">
        <div className="legend">
          <span><span className="dot pending" /> Pending</span>
          <span><span className="dot awaiting" /> Awaiting</span>
          <span><span className="dot paid" /> Paid</span>
        </div>
        <button className="close-btn" onClick={handleCloseBill}>
          Close Bill
        </button>
      </div>

    </div>
  );
};

export default BillDashboard;