import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./BillDashboard.css";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

// Change this to your live domain when deployed
const APP_BASE_URL = window.location.origin;

const BillDashboard = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [bill, setBill] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [receiptModal, setReceiptModal] = useState(null); // base64 string
  const [shareUnlocked, setShareUnlocked] = useState(false);
  const [unlockLoading, setUnlockLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);

  // ─── FETCH ───────────────────────────────────────────────
  useEffect(() => {
    const fetchBill = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${API}/bills/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBill(res.data);
        setParticipants(
          res.data.participants ? JSON.parse(res.data.participants) : []
        );
      } catch (err) {
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };
    fetchBill();
  }, [id, navigate]);

  // ─── MARK AS PAID / UNDO ─────────────────────────────────
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
    } catch (err) {
      alert("Could not update status. Please try again.");
    } finally {
      setActionLoading(null);
    }
  };

  // ─── CLOSE BILL ──────────────────────────────────────────
  const handleCloseBill = async () => {
    if (!window.confirm("Close this bill? It will be marked as completed.")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `${API}/bills/${id}/close`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      navigate("/dashboard");
    } catch {
      alert("Failed to close bill.");
    }
  };

  // ─── UNLOCK SHARE LINKS (simulate ad watch) ──────────────
  const handleUnlockLinks = () => {
    setUnlockLoading(true);
    setTimeout(() => {
      setUnlockLoading(false);
      setShareUnlocked(true);
    }, 3000); // 3-second simulated ad
  };

  // ─── WHATSAPP LINK ────────────────────────────────────────
  const buildWhatsAppLink = (participant, index) => {
    const pageLink = `${APP_BASE_URL}/pay/${id}/${index}`;
    const message =
      `Hi ${participant.name}! 👋\n\n` +
      `You've been added to a bill: *${bill.title}*\n` +
      `Your share: *₦${Number(participant.amount).toLocaleString()}*\n\n` +
      `Pay to:\n` +
      `Bank: ${bill.bank_name}\n` +
      `Account: ${bill.account_name} — ${bill.account_number}\n\n` +
      `After paying, upload your receipt here:\n${pageLink}`;
    return `https://wa.me/${participant.whatsapp}?text=${encodeURIComponent(message)}`;
  };

  const handleCopyLink = (index) => {
    const link = `${APP_BASE_URL}/pay/${id}/${index}`;
    navigator.clipboard.writeText(link);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  // ─── GUARD ───────────────────────────────────────────────
  if (loading) return <p style={{ color: "white", padding: 40 }}>Loading...</p>;
  if (!bill) return <p style={{ color: "white", padding: 40 }}>Bill not found.</p>;

  // ─── CALCULATIONS ─────────────────────────────────────────
  const totalAmount = Number(bill.total_amount);
  const participantCount = participants.length;

  let creatorShare = 0;
  if (bill.equal_split) {
    creatorShare = totalAmount / (participantCount + 1);
  } else {
    creatorShare = totalAmount - participants.reduce((s, p) => s + Number(p.amount || 0), 0);
  }

  const paidCount = participants.filter((p) => p.status === "paid").length;
  const awaitingCount = participants.filter((p) => p.status === "awaiting").length;
  const pendingCount = participantCount - paidCount - awaitingCount;

  // ─── RENDER ───────────────────────────────────────────────
  return (
    <div className="bill-dashboard-page">

      {/* RECEIPT MODAL */}
      {receiptModal && (
        <div className="receipt-modal-overlay" onClick={() => setReceiptModal(null)}>
          <div className="receipt-modal" onClick={(e) => e.stopPropagation()}>
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
            <p><strong>Total Amount:</strong> ₦{totalAmount.toLocaleString()}</p>
            <p>
              <strong>Your Share:</strong>{" "}
              ₦{creatorShare.toLocaleString(undefined, { maximumFractionDigits: 2 })}
            </p>
            <p><strong>Split Type:</strong> {bill.equal_split ? "Equal Split" : "Custom Split"}</p>
            <small>Only visible to the bill creator</small>
          </div>

          <div className="summary-box">
            <h3>Payment Progress</h3>
            <p>✅ Paid: <strong>{paidCount}</strong> / {participantCount}</p>
            <p>⏳ Awaiting Confirmation: <strong>{awaitingCount}</strong></p>
            <p>🔴 Pending: <strong>{pendingCount}</strong></p>
          </div>

          {/* SHARE LINKS SECTION */}
          <div className="summary-box">
            <h3>Share Bill Links</h3>
            {!shareUnlocked ? (
              <>
                <p style={{ fontSize: 13, opacity: 0.7, marginBottom: 12 }}>
                  Watch a short ad to unlock WhatsApp share links for each participant.
                </p>
                <button
                  className="remind-btn"
                  onClick={handleUnlockLinks}
                  disabled={unlockLoading}
                  style={{ width: "100%" }}
                >
                  {unlockLoading ? (
                    <span>⏳ Loading ad... please wait</span>
                  ) : (
                    "▶ Watch Ad to Unlock Links"
                  )}
                </button>
              </>
            ) : (
              <div className="share-links-list">
                {participants.map((p, i) => (
                  <div key={i} className="share-link-row">
                    <span className="share-link-name">{p.name}</span>
                    <div className="share-link-btns">
                      <a
                        href={buildWhatsAppLink(p, i)}
                        target="_blank"
                        rel="noreferrer"
                        className="whatsapp-btn"
                      >
                        💬 WhatsApp
                      </a>
                      <button
                        className="copy-link-btn"
                        onClick={() => handleCopyLink(i)}
                      >
                        {copiedIndex === i ? "Copied!" : "Copy Link"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button className="remind-btn" style={{ marginTop: 0 }}>
            🔔 Remind All Pending
          </button>
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

         {/* Replace the <tbody> section in BillDashboard.jsx with this */}
{/* Find the <tbody> block and replace it with: */}

{/* Replace the <tbody> section in BillDashboard.jsx with this */}
{/* Find the <tbody> block and replace it with: */}

<tbody>
  {participants.map((p, i) => {
    const status = p.status || "pending";
    const isUpdating = actionLoading === i;
    return (
      <tr key={i}>
        <td data-label="Name">{p.name}</td>
        <td data-label="Amount">
          ₦{Number(p.amount || 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}
        </td>
        <td data-label="Status">
          <span className={`status-badge ${status}`}>
            <span className="status-dot"></span>
            {status === "awaiting" ? "Awaiting" : status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
        </td>
        <td data-label="Receipt">
          {p.receipt ? (
            <button className="view-receipt-btn" onClick={() => setReceiptModal(p.receipt)}>View 🧾</button>
          ) : (
            <span style={{ opacity: 0.4, fontSize: 12 }}>None</span>
          )}
        </td>
        <td data-label="Action">
          {isUpdating ? (
            <div className="spinner" style={{ margin: "0 auto" }}></div>
          ) : status === "paid" ? (
            <button className="undo-btn" onClick={() => handleStatusChange(i, "pending")}>Undo</button>
          ) : status === "awaiting" ? (
            <button className="paid-btn" onClick={() => handleStatusChange(i, "paid")}>✓ Confirm</button>
          ) : (
            <button className="paid-btn" onClick={() => handleStatusChange(i, "paid")}>Mark Paid</button>
          )}
        </td>
      </tr>
    );
  })}
</tbody>
          </table>
        </div>
      </div>

      {/* FOOTER */}
      <div className="bill-dashboard-footer">
        <div className="legend">
          <span><span className="dot pending"></span> Pending</span>
          <span><span className="dot awaiting"></span> Awaiting</span>
          <span><span className="dot paid"></span> Paid</span>
        </div>
        <button className="close-btn" onClick={handleCloseBill}>
          Close Bill
        </button>
      </div>
    </div>
  );
};

export default BillDashboard;