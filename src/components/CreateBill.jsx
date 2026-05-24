import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./CreateBill.css";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";


/* ── Live bill preview (left sticky panel) ──────────────── */
function BillPreview({ title, totalAmount, accountName, accountNumber, bankName,
                       participants, equalSplit, creatorIncluded, creatorName }) {
  const displayTitle  = title       || "Your Bill Name";
  const displayAmount = totalAmount ? `₦${Number(totalAmount).toLocaleString()}` : "₦0";

  /* total people = participants + (creator if included) */
  const totalPeople  = equalSplit
    ? participants.length + (creatorIncluded ? 1 : 0)
    : 0;
  const splitAmt = equalSplit && totalPeople > 0 && totalAmount
    ? `₦${(Number(totalAmount) / totalPeople).toLocaleString(undefined,{maximumFractionDigits:0})}`
    : null;

  const visible = participants.filter(p => p.name).slice(0, 3);

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
          <div className="cb-bank-row"><span className="cb-bank-lbl">Account Name</span><span className="cb-bank-val">{accountName||"—"}</span></div>
          <div className="cb-bank-row"><span className="cb-bank-lbl">Bank</span><span className="cb-bank-val">{bankName||"—"}</span></div>
          <div className="cb-bank-row"><span className="cb-bank-lbl">Account No.</span><span className="cb-bank-val">{accountNumber||"—"}</span></div>

          {(equalSplit && creatorIncluded && creatorName) || visible.length > 0 ? (
            <div className="cb-participants-preview">
              <div className="cb-pp-label">Participants</div>

              {/* Creator row in preview */}
              {equalSplit && creatorIncluded && creatorName && (
                <div className="cb-pp-row cb-pp-creator">
                  <span className="cb-pp-name">{creatorName} 👑</span>
                  <span className="cb-pp-amt">{splitAmt || "—"}</span>
                </div>
              )}

              {visible.map((p, i) => (
                <div className="cb-pp-row" key={i}>
                  <span className="cb-pp-name">{p.name}</span>
                  <span className="cb-pp-amt">
                    {splitAmt || (p.amount ? `₦${Number(p.amount).toLocaleString()}` : "—")}
                  </span>
                </div>
              ))}
              {participants.length > 3 && (
                <div style={{fontSize:11,color:"rgba(243,232,255,.35)",textAlign:"center",marginTop:6}}>
                  +{participants.length - 3} more
                </div>
              )}
            </div>
          ) : null}

          <div className="cb-share-row">💬 Ready to share via WhatsApp</div>
        </div>
      </div>

      <div className="cb-tips">
        <div className="cb-tip"><div className="cb-tip-icon">✂️</div>Creator can choose to be part of the split</div>
        <div className="cb-tip"><div className="cb-tip-icon">📸</div>Participants upload receipt proof</div>
        <div className="cb-tip"><div className="cb-tip-icon">✅</div>You confirm each payment</div>
      </div>
    </div>
  );
}

/* ── Main page ──────────────────────────────────────────── */
const CreateBill = () => {
  const navigate = useNavigate();

  const [title,         setTitle]         = useState("");
  const [totalAmount,   setTotalAmount]   = useState("");
  const [description,   setDescription]   = useState("");
  const [dueDate,       setDueDate]       = useState("");
  const [accountName,   setAccountName]   = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [bankName,      setBankName]      = useState("");
  const [participants,  setParticipants]  = useState([{ name:"", whatsapp:"", amount:"" }]);
  const [equalSplit,    setEqualSplit]    = useState(false);

  /*
    ── Creator inclusion state ───────────────────────────────
    null  = not asked yet (equal split not enabled)
    true  = creator chose to be included
    false = creator chose NOT to be included
  */
  const [creatorIncluded, setCreatorIncluded] = useState(null);
  const [creatorName,     setCreatorName]     = useState("");

  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");

  /* Auto-fill creator's name from JWT */
  useEffect(() => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        const p = JSON.parse(atob(token.split(".")[1]));
        setCreatorName(p.fullname || p.name || "");
      }
    } catch {}
  }, []);

  /* ── equal split toggle ── */
  const handleToggleEqualSplit = () => {
    const next = !equalSplit;
    setEqualSplit(next);
    if (!next) setCreatorIncluded(null); // reset question when turning off
  };

  /* ── participants helpers ── */
  const addParticipant    = () => setParticipants([...participants, { name:"", whatsapp:"", amount:"" }]);
  const removeParticipant = (i) => setParticipants(participants.filter((_,idx) => idx !== i));
  const handleP           = (i, field, val) => {
    const u = [...participants]; u[i][field] = val; setParticipants(u);
  };

  /* ── split amount calculation ── */
  const totalPeople = equalSplit
    ? participants.length + (creatorIncluded ? 1 : 0)
    : participants.length;
  const splitAmount = (equalSplit && totalPeople > 0 && totalAmount)
    ? parseFloat((Number(totalAmount) / totalPeople).toFixed(2))
    : 0;

  /* ── submit ── */
  const handleCreateBill = async () => {
    if (!title || !totalAmount || !accountName || !accountNumber || !bankName)
      return setError("Please fill in all required fields.");

    /* If equal split is on but creator hasn't answered the question yet */
    if (equalSplit && creatorIncluded === null)
      return setError("Please choose whether you are splitting this bill too.");

    /* If creator said yes but left their name empty */
    if (equalSplit && creatorIncluded && !creatorName.trim())
      return setError("Please enter your name so it appears in the bill.");

    setLoading(true); setError("");
    try {
      const token = localStorage.getItem("token");

      /* Build participant list */
      let finalParticipants = participants.map(p => ({
        name:     p.name,
        whatsapp: p.whatsapp,
        amount:   equalSplit ? splitAmount : Number(p.amount),
        status:   "pending",
      }));

      /* Prepend creator row if they chose to be included */
      if (equalSplit && creatorIncluded) {
        finalParticipants = [
          {
            name:      creatorName.trim(),
            whatsapp:  "",           // creator doesn't need a participant link
            amount:    splitAmount,
            status:    "paid",       // creator is auto-marked paid (they're collecting)
            isCreator: true,         // flag for BillDashboard to show badge
          },
          ...finalParticipants,
        ];
      }

      await axios.post(`${API}/bills/create`, {
        title,
        total_amount:   Number(totalAmount),
        description,
        due_date:       dueDate || null,
        account_name:   accountName,
        account_number: accountNumber,
        bank_name:      bankName,
        equalSplit,
        participants:   finalParticipants,
      }, { headers: { Authorization: `Bearer ${token}` } });

      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create bill. Try again.");
    }
    setLoading(false);
  };

  return (
    <div className="cb-page">

      {/* ── LEFT: LIVE PREVIEW ── */}
      <BillPreview
        title={title} totalAmount={totalAmount}
        accountName={accountName} accountNumber={accountNumber} bankName={bankName}
        participants={participants} equalSplit={equalSplit}
        creatorIncluded={creatorIncluded} creatorName={creatorName}
      />

      {/* ── RIGHT: FORM ── */}
      <div className="cb-form-panel">
        <Link to="/dashboard" className="cb-back">← Back to dashboard</Link>

        <h1 className="cb-form-title">
          <span className="cb-plus">+</span> Create a Bill
        </h1>
        <p className="cb-form-sub">Fill in the details. The preview updates live.</p>

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
              <input type="text" placeholder="Brief note…"
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
            <input type="text" placeholder="As it appears on your account"
              value={accountName} onChange={e => setAccountName(e.target.value)} />
          </div>
          <div className="cb-row-2">
            <div className="cb-field">
              <label>Account Number *</label>
              <input type="text" placeholder="10-digit number"
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
            <span style={{fontSize:13,color:"rgba(243,232,255,.6)"}}>Split method</span>
            <div className="cb-split-toggle" onClick={handleToggleEqualSplit}>
              <span>Equal Split</span>
              <div className={`cb-toggle-track ${equalSplit ? "active" : ""}`}>
                <div className="cb-toggle-thumb" />
              </div>
            </div>
          </div>

          {/* ── Creator question (only visible when equal split is ON) ── */}
          {equalSplit && (
            <div className="cb-creator-question">
              <div className="cb-cq-icon">🙋</div>
              <div className="cb-cq-title">Are you splitting this bill too?</div>
              <p className="cb-cq-sub">
                Choose whether your own share will be included in the equal split.
              </p>

              <div className="cb-cq-options">
                <button
                  className={`cb-cq-opt ${creatorIncluded === true ? "cq-yes" : ""}`}
                  onClick={() => setCreatorIncluded(true)}
                >
                  <span className="cb-cq-opt-icon">✓</span>
                  <span className="cb-cq-opt-label">Yes, include me</span>
                  <span className="cb-cq-opt-sub">My share is deducted from the total</span>
                </button>

                <button
                  className={`cb-cq-opt ${creatorIncluded === false ? "cq-no" : ""}`}
                  onClick={() => setCreatorIncluded(false)}
                >
                  <span className="cb-cq-opt-icon">✕</span>
                  <span className="cb-cq-opt-label">No, just collecting</span>
                  <span className="cb-cq-opt-sub">Only participants split the bill</span>
                </button>
              </div>

              {/* Creator name input — only shown when they said yes */}
              {creatorIncluded === true && (
                <div className="cb-cq-name-wrap">
                  <div className="cb-field" style={{marginBottom:0}}>
                    <label>Your name (shown in the bill)</label>
                    <input type="text" placeholder="e.g. Adeola (Creator)"
                      value={creatorName} onChange={e => setCreatorName(e.target.value)} />
                  </div>
                  {splitAmount > 0 && (
                    <div className="cb-creator-share-preview">
                      <span>Your share</span>
                      <strong>₦{splitAmount.toLocaleString(undefined,{maximumFractionDigits:2})}</strong>
                    </div>
                  )}
                </div>
              )}

              {/* Just-collecting summary pill */}
              {creatorIncluded === false && participants.length > 0 && splitAmount > 0 && (
                <div className="cb-split-preview">
                  ✂️ Each of {participants.length} participant{participants.length > 1 ? "s" : ""} pays{" "}
                  ₦{splitAmount.toLocaleString(undefined,{maximumFractionDigits:2})}
                </div>
              )}
            </div>
          )}

          {/* Split preview when equal split is OFF (normal summary pill) */}
          {!equalSplit && (
            <p style={{fontSize:13,color:"rgba(243,232,255,.45)",marginBottom:12}}>
              Assign a custom amount to each participant below.
            </p>
          )}

          {/* Participant rows */}
          {participants.map((p, i) => (
            <div className={`cb-p-row${!equalSplit ? " with-amount" : ""}`} key={i}>
              <div className="cb-field" style={{margin:0}}>
                <input type="text" placeholder="Name"
                  value={p.name} onChange={e => handleP(i,"name",e.target.value)} />
              </div>
              <div className="cb-field" style={{margin:0}}>
                <input type="text" placeholder="WhatsApp number"
                  value={p.whatsapp} onChange={e => handleP(i,"whatsapp",e.target.value)} />
              </div>
              {!equalSplit && (
                <div className="cb-field" style={{margin:0}}>
                  <input type="number" placeholder="Amount (₦)"
                    value={p.amount} onChange={e => handleP(i,"amount",e.target.value)} />
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