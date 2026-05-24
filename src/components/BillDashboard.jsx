import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./BillDashboard.css";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";
const APP_BASE_URL = window.location.origin;

function toWhatsAppNumber(raw = "") {
  const digits = raw.replace(/\D/g, "");
  if (!digits) return "";
  if (digits.startsWith("234") && digits.length >= 12) return digits;
  if (digits.startsWith("0")   && digits.length === 11) return "234" + digits.slice(1);
  if (digits.length === 10) return "234" + digits;
  return digits;
}

const BillDashboard = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [bill,          setBill]          = useState(null);
  const [participants,  setParticipants]  = useState([]);
  const [loading,       setLoading]       = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [receiptModal,  setReceiptModal]  = useState(null);
  const [shareUnlocked, setShareUnlocked] = useState(false);
  const [unlockLoading, setUnlockLoading] = useState(false);
  const [copiedIndex,   setCopiedIndex]   = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${API}/bills/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBill(res.data);
        setParticipants(res.data.participants ? JSON.parse(res.data.participants) : []);
      } catch { navigate("/login"); }
      finally  { setLoading(false); }
    })();
  }, [id, navigate]);

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

  const handleCloseBill = async () => {
    if (!window.confirm("Close this bill? It will be marked as completed.")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.patch(`${API}/bills/${id}/close`, {}, { headers:{ Authorization:`Bearer ${token}` } });
      navigate("/dashboard");
    } catch { alert("Failed to close bill."); }
  };

  const handleUnlock = () => {
    setUnlockLoading(true);
    setTimeout(() => { setUnlockLoading(false); setShareUnlocked(true); }, 3000);
  };

  const buildWhatsAppLink = (participant, index) => {
    const phone    = toWhatsAppNumber(participant.whatsapp);
    const pageLink = `${APP_BASE_URL}/pay/${id}/${index}`;
    const message  =
      `Hi ${participant.name}! 👋\n\n` +
      `You've been added to a bill: *${bill?.title}*\n` +
      `Your share: *₦${Number(participant.amount).toLocaleString()}*\n\n` +
      `Pay to:\nBank: ${bill?.bank_name}\n` +
      `Account: ${bill?.account_name} — ${bill?.account_number}\n\n` +
      `Upload your receipt here:\n${pageLink}`;
    return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  };

  const handleCopyLink = (index) => {
    navigator.clipboard.writeText(`${APP_BASE_URL}/pay/${id}/${index}`);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  if (loading || !bill) return <p style={{color:"white",padding:40}}>Loading…</p>;

  const totalAmount      = Number(bill.total_amount);
  const participantCount = participants.length;
  /* exclude creator from the "who hasn't paid" counts */
  const nonCreatorCount  = participants.filter(p => !p.isCreator).length;
  const paidCount        = participants.filter(p => p.status === "paid").length;
  const awaitingCount    = participants.filter(p => p.status === "awaiting").length;

  const creatorShare = bill.equal_split
    ? totalAmount / participantCount        // participantCount already includes creator row if present
    : totalAmount - participants.filter(p => !p.isCreator).reduce((s,p) => s + Number(p.amount||0), 0);

  return (
    <div className="bill-dashboard-page">

      {receiptModal && (
        <div className="receipt-modal-overlay" onClick={() => setReceiptModal(null)}>
          <div className="receipt-modal" onClick={e => e.stopPropagation()}>
            <button className="receipt-modal-close" onClick={() => setReceiptModal(null)}>✕</button>
            <img src={receiptModal} alt="Receipt" className="receipt-modal-img" />
          </div>
        </div>
      )}

      <div className="bill-dashboard-top">

        {/* LEFT */}
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
            <p>✅ Paid: <strong>{paidCount}</strong> / {participantCount}</p>
            <p>⏳ Awaiting: <strong>{awaitingCount}</strong></p>
            <p>🔴 Pending: <strong>{participantCount - paidCount - awaitingCount}</strong></p>
          </div>

          {/* Share links */}
          <div className="summary-box">
            <h3>Share Bill Links</h3>
            {!shareUnlocked ? (
              <>
                <p style={{fontSize:13,opacity:.7,marginBottom:12}}>
                  Watch a quick ad to unlock WhatsApp links for participants.
                </p>
                <button className="remind-btn" onClick={handleUnlock}
                  disabled={unlockLoading} style={{width:"100%"}}>
                  {unlockLoading ? "⏳ Loading ad…" : "▶ Watch Ad to Unlock Links"}
                </button>
              </>
            ) : (
              <div className="share-links-list">
                {participants.map((p, i) =>
                  /* ── Skip the creator row — they don't need a participant link ── */
                  !p.isCreator && (
                    <div className="share-link-row" key={i}>
                      <span className="share-link-name">{p.name}</span>
                      <div className="share-link-btns">
                        <a href={buildWhatsAppLink(p, i)} target="_blank" rel="noreferrer"
                          className="whatsapp-btn">💬 WhatsApp</a>
                        <button className="copy-link-btn" onClick={() => handleCopyLink(i)}>
                          {copiedIndex === i ? "Copied!" : "Copy Link"}
                        </button>
                      </div>
                    </div>
                  )
                )}
                {nonCreatorCount === 0 && (
                  <p style={{fontSize:13,opacity:.5}}>No external participants to share with.</p>
                )}
              </div>
            )}
          </div>

          <button className="remind-btn">🔔 Remind All Pending</button>
        </div>

        {/* RIGHT TABLE */}
        <div className="payment-status">
          <h2>Payment Status</h2>
          <div className="table-scroll-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Name</th><th>Amount</th><th>Status</th><th>Receipt</th><th>Action</th>
                </tr>
              </thead>
              <tbody>
                {participants.map((p, i) => {
                  const status    = p.status || "pending";
                  const isCreator = !!p.isCreator;
                  const isUpdating = actionLoading === i;
                  return (
                    <tr key={i} className={isCreator ? "creator-row" : ""}>
                      <td data-label="Name">
                        <span>{p.name}</span>
                        {/* ── Creator badge ── */}
                        {isCreator && <span className="creator-badge">👑 Creator</span>}
                      </td>
                      <td data-label="Amount">
                        ₦{Number(p.amount||0).toLocaleString(undefined,{maximumFractionDigits:2})}
                      </td>
                      <td data-label="Status">
                        <span className={`status-badge ${status}`}>
                          <span className="status-dot" />
                          {status === "awaiting" ? "Awaiting" : status.charAt(0).toUpperCase() + status.slice(1)}
                        </span>
                      </td>
                      <td data-label="Receipt">
                        {isCreator
                          ? <span style={{opacity:.4,fontSize:12}}>N/A</span>
                          : p.receipt
                            ? <button className="view-receipt-btn" onClick={() => setReceiptModal(p.receipt)}>View 🧾</button>
                            : <span style={{opacity:.4,fontSize:12}}>None</span>}
                      </td>
                      <td data-label="Action">
                        {/* Creator row — no action needed, they're auto-paid */}
                        {isCreator ? (
                          <span className="creator-auto-paid">Auto-paid ✓</span>
                        ) : isUpdating ? (
                          <div className="spinner" style={{margin:"0 auto"}} />
                        ) : status === "paid" ? (
                          <button className="undo-btn" onClick={() => handleStatusChange(i,"pending")}>Undo</button>
                        ) : status === "awaiting" ? (
                          <button className="paid-btn" onClick={() => handleStatusChange(i,"paid")}>✓ Confirm</button>
                        ) : (
                          <button className="paid-btn" onClick={() => handleStatusChange(i,"paid")}>Mark Paid</button>
                        )}
                      </td>
                    </tr>
                  );
                })}
                {participants.length === 0 && (
                  <tr><td colSpan={5} style={{textAlign:"center",opacity:.5}}>No participants yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="bill-dashboard-footer">
        <div className="legend">
          <span><span className="dot pending" /> Pending</span>
          <span><span className="dot awaiting" /> Awaiting</span>
          <span><span className="dot paid" /> Paid</span>
        </div>
        <button className="close-btn" onClick={handleCloseBill}>Close Bill</button>
      </div>
    </div>
  );
};

export default BillDashboard;