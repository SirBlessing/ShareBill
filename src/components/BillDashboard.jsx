import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./BillDashboard.css";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

// Change this to your live domain when deployed
const APP_BASE_URL = window.location.origin;

/* ─── FIX 1: normalise any Nigerian number to 234XXXXXXXXXX ─── */
function normalizePhone(raw = "") {
  // strip spaces, dashes, brackets, dots
  let n = raw.trim().replace(/[\s\-().+]/g, "");

  // leading + already stripped above
  // "0XXXXXXXXXX"  →  "234XXXXXXXXXX"
  if (n.startsWith("0")) n = "234" + n.slice(1);

  // 10-digit number with no country code  →  add 234
  if (n.length === 10 && !n.startsWith("234")) n = "234" + n;

  // already "234..." → keep
  if (!n.startsWith("234")) n = "234" + n;

  return n;
}

const BillDashboard = () => {
  const { id }     = useParams();
  const navigate   = useNavigate();

  const [bill,          setBill]          = useState(null);
  const [participants,  setParticipants]  = useState([]);
  const [loading,       setLoading]       = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [receiptModal,  setReceiptModal]  = useState(null);
  const [shareUnlocked, setShareUnlocked] = useState(false);
  const [unlockLoading, setUnlockLoading] = useState(false);
  const [copiedIdx,     setCopiedIdx]     = useState(null);

  /* fetch bill */
  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem("token");
        const res   = await axios.get(`${API}/bills/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBill(res.data);
        setParticipants(res.data.participants ? JSON.parse(res.data.participants) : []);
      } catch {
        navigate("/login");
      } finally {
        setLoading(false);
      }
    })();
  }, [id, navigate]);

  /* mark paid / undo */
  const handleStatusChange = async (index, newStatus) => {
    setActionLoading(index);
    try {
      const token = localStorage.getItem("token");
      const res   = await axios.patch(
        `${API}/bills/${id}/participant/${index}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setParticipants(res.data.participants);
    } catch {
      alert("Could not update status. Try again.");
    } finally {
      setActionLoading(null);
    }
  };

  /* close bill */
  const handleCloseBill = async () => {
    if (!window.confirm("Close this bill? It will be marked completed.")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.patch(`${API}/bills/${id}/close`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate("/dashboard");
    } catch {
      alert("Failed to close bill.");
    }
  };

  /* unlock share links (simulate ad) */
  const handleUnlock = () => {
    setUnlockLoading(true);
    setTimeout(() => { setUnlockLoading(false); setShareUnlocked(true); }, 3000);
  };

  /* ─── FIX 1 applied here ─── */
  const buildWhatsAppLink = (p, index) => {
    const phone   = normalizePhone(p.whatsapp);          // always 234…
    const pageLink = `${APP_BASE_URL}/pay/${id}/${index}`;
    const msg =
      `Hi ${p.name}! 👋\n\n` +
      `You've been added to a bill: *${bill.title}*\n` +
      `Your share: *₦${Number(p.amount).toLocaleString()}*\n\n` +
      `Pay to:\nBank: ${bill.bank_name}\n` +
      `Account: ${bill.account_name} — ${bill.account_number}\n\n` +
      `After paying, upload your receipt here:\n${pageLink}`;
    return `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
  };

  const handleCopy = (index) => {
    navigator.clipboard.writeText(`${APP_BASE_URL}/pay/${id}/${index}`);
    setCopiedIdx(index);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  /* guards */
  if (loading) return <p style={{ color:"white", padding:40 }}>Loading...</p>;
  if (!bill)   return <p style={{ color:"white", padding:40 }}>Bill not found.</p>;

  /* calculations */
  const totalAmount     = Number(bill.total_amount);
  const participantCount = participants.length;
  const creatorShare    = bill.equal_split
    ? totalAmount / (participantCount + 1)
    : totalAmount - participants.reduce((s, p) => s + Number(p.amount || 0), 0);
  const paidCount      = participants.filter(p => p.status === "paid").length;
  const awaitingCount  = participants.filter(p => p.status === "awaiting").length;

  return (
    <div className="bill-dashboard-page">

      {/* Receipt modal */}
      {receiptModal && (
        <div className="receipt-modal-overlay" onClick={() => setReceiptModal(null)}>
          <div className="receipt-modal" onClick={e => e.stopPropagation()}>
            <button className="receipt-modal-close" onClick={() => setReceiptModal(null)}>✕</button>
            <img src={receiptModal} alt="Receipt" className="receipt-modal-img" />
          </div>
        </div>
      )}

      <div className="bill-dashboard-top">

        {/* LEFT SUMMARY */}
        <div className="bill-summary">
          <h1 className="page-title">Bill Dashboard</h1>

          <div className="summary-box">
            <h3>Bill Summary</h3>
            <p><strong>Bill Name:</strong> {bill.title}</p>
            <p><strong>Total:</strong> ₦{totalAmount.toLocaleString()}</p>
            <p><strong>Your Share:</strong> ₦{creatorShare.toLocaleString(undefined,{maximumFractionDigits:2})}</p>
            <p><strong>Split Type:</strong> {bill.equal_split ? "Equal" : "Custom"}</p>
            <small>Only visible to you (the creator)</small>
          </div>

          <div className="summary-box">
            <h3>Progress</h3>
            <p>✅ Paid: <strong>{paidCount}</strong> / {participantCount}</p>
            <p>⏳ Awaiting: <strong>{awaitingCount}</strong></p>
            <p>🔴 Pending: <strong>{participantCount - paidCount - awaitingCount}</strong></p>
          </div>

          {/* SHARE LINKS */}
          <div className="summary-box">
            <h3>Share Links</h3>
            {!shareUnlocked ? (
              <>
                <p style={{fontSize:13,opacity:.7,marginBottom:12}}>
                  Watch a short ad to unlock WhatsApp links.
                </p>
                <button className="remind-btn" onClick={handleUnlock}
                  disabled={unlockLoading} style={{width:"100%"}}>
                  {unlockLoading ? "⏳ Loading ad..." : "▶ Watch Ad to Unlock"}
                </button>
              </>
            ) : (
              <div className="share-links-list">
                {participants.map((p, i) => (
                  <div className="share-link-row" key={i}>
                    <span className="share-link-name">{p.name}</span>
                    <div className="share-link-btns">
                      <a href={buildWhatsAppLink(p, i)} target="_blank"
                        rel="noreferrer" className="whatsapp-btn">
                        💬 WhatsApp
                      </a>
                      <button className="copy-link-btn" onClick={() => handleCopy(i)}>
                        {copiedIdx === i ? "Copied!" : "Copy Link"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button className="remind-btn">🔔 Send Reminder to All</button>
        </div>

        {/* RIGHT TABLE */}
        <div className="payment-status">
          <h2>Payment Status</h2>
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
                const isUpdating = actionLoading === i;
                return (
                  <tr key={i}>
                    {/* data-label powers the mobile card layout */}
                    <td data-label="Name">{p.name}</td>
                    <td data-label="Amount">
                      ₦{Number(p.amount || 0).toLocaleString(undefined,{maximumFractionDigits:2})}
                    </td>
                    <td data-label="Status">
                      <span className={`status-badge ${status}`}>
                        <span className="status-dot" />
                        {status === "awaiting" ? "Awaiting"
                          : status.charAt(0).toUpperCase() + status.slice(1)}
                      </span>
                    </td>
                    <td data-label="Receipt">
                      {p.receipt
                        ? <button className="view-receipt-btn"
                            onClick={() => setReceiptModal(p.receipt)}>View 🧾</button>
                        : <span style={{opacity:.4,fontSize:12}}>None</span>}
                    </td>
                    <td data-label="Action">
                      {isUpdating
                        ? <div className="spinner" style={{margin:"0 auto"}} />
                        : status === "paid"
                          ? <button className="undo-btn"
                              onClick={() => handleStatusChange(i,"pending")}>Undo</button>
                          : status === "awaiting"
                            ? <button className="paid-btn"
                                onClick={() => handleStatusChange(i,"paid")}>✓ Confirm</button>
                            : <button className="paid-btn"
                                onClick={() => handleStatusChange(i,"paid")}>Mark Paid</button>
                      }
                    </td>
                  </tr>
                );
              })}
              {participants.length === 0 && (
                <tr><td colSpan={5} style={{textAlign:"center",opacity:.5}}>No participants.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bill-dashboard-footer">
        <div className="legend">
          <span><span className="dot pending"/>Pending</span>
          <span><span className="dot awaiting"/>Awaiting</span>
          <span><span className="dot paid"/>Paid</span>
        </div>
        <button className="close-btn" onClick={handleCloseBill}>Close Bill</button>
      </div>
    </div>
  );
};

export default BillDashboard;