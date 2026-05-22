import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./CreateBill.css";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";


/* ══════════════════════════════════════════
   LIVE BILL PREVIEW (left panel)
══════════════════════════════════════════ */
function BillPreview({ title, totalAmount, accountName, accountNumber, bankName, participants, equalSplit }) {
  const displayTitle  = title       || "Your Bill Name";
  const displayAmount = totalAmount ? `₦${Number(totalAmount).toLocaleString()}` : "₦0";
  const displayName   = accountName || "Your Name";
  const displayAcct   = accountNumber || "— — — —";
  const displayBank   = bankName    || "Your Bank";

  const totalPeople = participants.length + 1;
  const splitAmt = equalSplit && totalAmount
    ? `₦${(Number(totalAmount) / totalPeople).toLocaleString(undefined, { maximumFractionDigits: 0 })}`
    : null;

  const visibleParticipants = participants.filter(p => p.name).slice(0, 3);

  return (
    <div className="cb-preview-panel">
      <div className="cb-card-glow" />
      <div className="cb-panel-label">Live Bill Preview</div>

      <div className="cb-preview-card">
        <div className="cb-card-top">
          <div className="cb-card-tag">ShareBill</div>
          <div className="cb-card-name">{displayTitle}</div>
          <div className="cb-card-amt">{displayAmount}</div>
        </div>

        <div className="cb-card-body">
          <div className="cb-bank-row">
            <span className="cb-bank-lbl">Account Name</span>
            <span className="cb-bank-val">{displayName}</span>
          </div>
          <div className="cb-bank-row">
            <span className="cb-bank-lbl">Bank</span>
            <span className="cb-bank-val">{displayBank}</span>
          </div>
          <div className="cb-bank-row">
            <span className="cb-bank-lbl">Account No.</span>
            <span className="cb-bank-val">{displayAcct}</span>
          </div>

          {visibleParticipants.length > 0 && (
            <div className="cb-participants-preview">
              <div className="cb-pp-label">Participants</div>
              {visibleParticipants.map((p, i) => (
                <div className="cb-pp-row" key={i}>
                  <span className="cb-pp-name">{p.name || `Person ${i + 1}`}</span>
                  <span className="cb-pp-amt">
                    {splitAmt || (p.amount ? `₦${Number(p.amount).toLocaleString()}` : "—")}
                  </span>
                </div>
              ))}
              {participants.length > 3 && (
                <div style={{ fontSize: 11, color: "rgba(243,232,255,0.35)", textAlign: "center", marginTop: 6 }}>
                  +{participants.length - 3} more
                </div>
              )}
            </div>
          )}

          <div className="cb-share-row">
            💬 Ready to share via WhatsApp
          </div>
        </div>
      </div>

      <div className="cb-tips">
        <div className="cb-tip"><div className="cb-tip-icon">✂️</div>Equal split includes you automatically</div>
        <div className="cb-tip"><div className="cb-tip-icon">📸</div>Participants upload receipt proof</div>
        <div className="cb-tip"><div className="cb-tip-icon">✅</div>You confirm each payment</div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   CREATE BILL PAGE
══════════════════════════════════════════ */
const CreateBill = () => {
  const navigate = useNavigate();

  const [title,         setTitle]         = useState("");
  const [totalAmount,   setTotalAmount]   = useState("");
  const [description,   setDescription]   = useState("");
  const [dueDate,       setDueDate]       = useState("");
  const [accountName,   setAccountName]   = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [bankName,      setBankName]      = useState("");
  const [participants,  setParticipants]  = useState([{ name: "", whatsapp: "", amount: "" }]);
  const [equalSplit,    setEqualSplit]    = useState(false);
  const [loading,       setLoading]       = useState(false);
  const [error,         setError]         = useState("");

  const addParticipant = () =>
    setParticipants([...participants, { name: "", whatsapp: "", amount: "" }]);

  const removeParticipant = (i) =>
    setParticipants(participants.filter((_, idx) => idx !== i));

  const handleP = (i, field, val) => {
    const u = [...participants];
    u[i][field] = val;
    setParticipants(u);
  };

  const handleCreateBill = async () => {
    if (!title || !totalAmount || !accountName || !accountNumber || !bankName)
      return setError("Please fill in all required fields.");

    setLoading(true); setError("");
    try {
      const token = localStorage.getItem("token");
      const totalPeople = participants.length + 1;
      const splitAmount = parseFloat((Number(totalAmount) / totalPeople).toFixed(2));

      const finalParticipants = participants.map(p => ({
        ...p,
        amount: equalSplit ? splitAmount : Number(p.amount),
        status: "pending",
      }));

      await axios.post(`${API}/bills/create`, {
        title, total_amount: Number(totalAmount),
        description, due_date: dueDate || null,
        account_name: accountName, account_number: accountNumber, bank_name: bankName,
        equalSplit, participants: finalParticipants,
      }, { headers: { Authorization: `Bearer ${token}` } });

      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create bill. Try again.");
    }
    setLoading(false);
  };

  const splitAmt = equalSplit && totalAmount
    ? `₦${(Number(totalAmount) / (participants.length + 1)).toLocaleString(undefined, { maximumFractionDigits: 0 })}`
    : null;

  return (
    <div className="cb-page">

      {/* ── LEFT: LIVE PREVIEW ── */}
      <BillPreview
        title={title} totalAmount={totalAmount}
        accountName={accountName} accountNumber={accountNumber} bankName={bankName}
        participants={participants} equalSplit={equalSplit}
      />

      {/* ── RIGHT: FORM ── */}
      <div className="cb-form-panel">
        <Link to="/dashboard" className="cb-back">← Back to dashboard</Link>

        <h1 className="cb-form-title">
          <span className="cb-plus">+</span> Create a Bill
        </h1>
        <p className="cb-form-sub">Fill in the details below. The preview updates live on the left.</p>

        {error && <div className="cb-err">{error}</div>}

        {/* SECTION 1 — Bill details */}
        <div className="cb-section">
          <div className="cb-section-title">📝 Bill Details</div>

          <div className="cb-field">
            <label>Bill Name *</label>
            <input type="text" placeholder="e.g. Eko Island Dinner, Office Lunch"
              value={title} onChange={e => setTitle(e.target.value)} />
          </div>

          <div className="cb-field">
            <label>Total Amount (₦) *</label>
            <input type="number" placeholder="e.g. 48000"
              value={totalAmount} onChange={e => setTotalAmount(e.target.value)} />
          </div>

          <div className="cb-row-2">
            <div className="cb-field">
              <label>Description (optional)</label>
              <input type="text" placeholder="Brief note..."
                value={description} onChange={e => setDescription(e.target.value)} />
            </div>
            <div className="cb-field">
              <label>Due Date (optional)</label>
              <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} />
            </div>
          </div>
        </div>

        {/* SECTION 2 — Bank details */}
        <div className="cb-section">
          <div className="cb-section-title">🏦 Your Bank Details</div>

          <div className="cb-field">
            <label>Account Name *</label>
            <input type="text" placeholder="As it appears on your bank account"
              value={accountName} onChange={e => setAccountName(e.target.value)} />
          </div>

          <div className="cb-row-2">
            <div className="cb-field">
              <label>Account Number *</label>
              <input type="text" placeholder="10-digit account number"
                value={accountNumber} onChange={e => setAccountNumber(e.target.value)} />
            </div>
            <div className="cb-field">
              <label>Bank Name *</label>
              <input type="text" placeholder="e.g. GTBank, Opay"
                value={bankName} onChange={e => setBankName(e.target.value)} />
            </div>
          </div>
        </div>

        {/* SECTION 3 — Participants */}
        <div className="cb-section">
          <div className="cb-section-title">👥 Participants</div>

          {/* Equal split toggle */}
          <div className="cb-split-header">
            <span style={{ fontSize: 13, color: "rgba(243,232,255,0.6)" }}>Split method</span>
            <div
              className="cb-split-toggle"
              onClick={() => setEqualSplit(!equalSplit)}
            >
              <span>Equal Split</span>
              <div className={`cb-toggle-track ${equalSplit ? "active" : ""}`}>
                <div className="cb-toggle-thumb" />
              </div>
            </div>
          </div>

          {equalSplit && totalAmount && (
            <div className="cb-split-preview">
              ✂️ Each person pays {splitAmt} (including you)
            </div>
          )}

          {participants.map((p, i) => (
            <div className={`cb-p-row${!equalSplit ? " with-amount" : ""}`} key={i}>
              <div className="cb-field" style={{ margin: 0 }}>
                <input type="text" placeholder="Name"
                  value={p.name} onChange={e => handleP(i, "name", e.target.value)} />
              </div>
              <div className="cb-field" style={{ margin: 0 }}>
                <input type="text" placeholder="WhatsApp number"
                  value={p.whatsapp} onChange={e => handleP(i, "whatsapp", e.target.value)} />
              </div>
              {!equalSplit && (
                <div className="cb-field" style={{ margin: 0 }}>
                  <input type="number" placeholder="Amount (₦)"
                    value={p.amount} onChange={e => handleP(i, "amount", e.target.value)} />
                </div>
              )}
              {participants.length > 1 && (
                <button className="cb-remove-btn" onClick={() => removeParticipant(i)}>×</button>
              )}
            </div>
          ))}

          <button className="cb-add-btn" onClick={addParticipant}>
            + Add Another Person
          </button>
        </div>

        <button className="cb-submit-btn" onClick={handleCreateBill} disabled={loading}>
          {loading ? <span className="cb-spin" /> : "🚀 Create Bill & Get Share Links"}
        </button>
      </div>
    </div>
  );
};

export default CreateBill;