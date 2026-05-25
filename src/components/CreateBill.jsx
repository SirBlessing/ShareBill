import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./CreateBill.css";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

/* ── Live bill preview ───────────────────────────────────── */
function BillPreview({ title, totalAmount, accountName, accountNumber, bankName,
                       participants, equalSplit, creatorIncluded, creatorName, creatorAmount }) {
  const displayTitle  = title       || "Your Bill Name";
  const displayAmount = totalAmount ? `₦${Number(totalAmount).toLocaleString()}` : "₦0";

  const totalPeople = equalSplit
    ? participants.length + (creatorIncluded ? 1 : 0)
    : participants.length;

  const splitAmt = equalSplit && totalPeople > 0 && totalAmount
    ? parseFloat((Number(totalAmount) / totalPeople).toFixed(2))
    : null;

  const visible = participants.filter(p => p.name).slice(0, 3);
  const showCreatorRow = creatorIncluded && creatorName;

  const creatorDisplayAmt = equalSplit && splitAmt
    ? `₦${splitAmt.toLocaleString(undefined, { maximumFractionDigits: 2 })}`
    : (!equalSplit && creatorAmount)
    ? `₦${Number(creatorAmount).toLocaleString()}`
    : "—";

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
          <div className="cb-bank-row"><span className="cb-bank-lbl">Account Name</span><span className="cb-bank-val">{accountName || "—"}</span></div>
          <div className="cb-bank-row"><span className="cb-bank-lbl">Bank</span><span className="cb-bank-val">{bankName || "—"}</span></div>
          <div className="cb-bank-row"><span className="cb-bank-lbl">Account No.</span><span className="cb-bank-val">{accountNumber || "—"}</span></div>

          {(showCreatorRow || visible.length > 0) && (
            <div className="cb-participants-preview">
              <div className="cb-pp-label">Participants</div>

              {showCreatorRow && (
                <div className="cb-pp-row cb-pp-creator">
                  <span className="cb-pp-name">{creatorName} 👑</span>
                  <span className="cb-pp-amt">{creatorDisplayAmt}</span>
                </div>
              )}

              {visible.map((p, i) => (
                <div className="cb-pp-row" key={i}>
                  <span className="cb-pp-name">{p.name}</span>
                  <span className="cb-pp-amt">
                    {splitAmt
                      ? `₦${splitAmt.toLocaleString(undefined, { maximumFractionDigits: 2 })}`
                      : p.amount ? `₦${Number(p.amount).toLocaleString()}` : "—"}
                  </span>
                </div>
              ))}

              {participants.length > 3 && (
                <div style={{ fontSize: 11, color: "rgba(243,232,255,.35)", textAlign: "center", marginTop: 6 }}>
                  +{participants.length - 3} more
                </div>
              )}
            </div>
          )}

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
  const [participants,  setParticipants]  = useState([{ name: "", whatsapp: "", amount: "" }]);
  const [equalSplit,    setEqualSplit]    = useState(false);

  // null = not answered yet, true = included, false = not included
  const [creatorIncluded, setCreatorIncluded] = useState(null);
  const [creatorName,     setCreatorName]     = useState("");
  const [creatorAmount,   setCreatorAmount]   = useState(""); // only used for custom split

  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");

  // Auto-fill creator name from JWT
  useEffect(() => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        const p = JSON.parse(atob(token.split(".")[1]));
        setCreatorName(p.fullname || p.name || "");
      }
    } catch {}
  }, []);

  // Toggling split type keeps the creatorIncluded answer intact
  // (the question "are you splitting?" doesn't change when you switch split type)
  const handleToggleEqualSplit = () => setEqualSplit(v => !v);

  const addParticipant    = () => setParticipants([...participants, { name: "", whatsapp: "", amount: "" }]);
  const removeParticipant = (i) => setParticipants(participants.filter((_, idx) => idx !== i));
  const handleP           = (i, field, val) => {
    const u = [...participants]; u[i][field] = val; setParticipants(u);
  };

  // Equal split calculation
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

    if (creatorIncluded === null)
      return setError("Please choose whether you are splitting this bill too.");

    if (creatorIncluded && !creatorName.trim())
      return setError("Please enter your name so it appears in the bill.");

    if (creatorIncluded && !equalSplit && !creatorAmount)
      return setError("Please enter your own share amount.");

    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");

      let finalParticipants = participants.map(p => ({
        name:     p.name,
        whatsapp: p.whatsapp,
        amount:   equalSplit ? splitAmount : Number(p.amount),
        status:   "pending",
      }));

      // Prepend creator if they chose to be included
      if (creatorIncluded) {
        const creatorShareAmount = equalSplit ? splitAmount : Number(creatorAmount);
        finalParticipants = [
          {
            name:      creatorName.trim(),
            whatsapp:  "",          // no WhatsApp link needed for creator
            amount:    creatorShareAmount,
            status:    "pending",   // creator must also mark themselves paid — no auto-pay
            isCreator: true,
          },
          ...finalParticipants,
        ];
      }

      await axios.post(
        `${API}/bills/create`,
        {
          title,
          total_amount:   Number(totalAmount),
          description,
          due_date:       dueDate || null,
          account_name:   accountName,
          account_number: accountNumber,
          bank_name:      bankName,
          equalSplit,
          participants:   finalParticipants,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create bill. Try again.");
    }
    setLoading(false);
  };

  return (
    <div className="cb-page">

      <BillPreview
        title={title} totalAmount={totalAmount}
        accountName={accountName} accountNumber={accountNumber} bankName={bankName}
        participants={participants} equalSplit={equalSplit}
        creatorIncluded={creatorIncluded} creatorName={creatorName} creatorAmount={creatorAmount}
      />

      <div className="cb-form-panel">
        <Link to="/dashboard" className="cb-back">← Back to dashboard</Link>

        <h1 className="cb-form-title"><span className="cb-plus">+</span> Create a Bill</h1>
        <p className="cb-form-sub">Fill in the details. The preview updates live.</p>

        {error && <div className="cb-err">{error}</div>}

        {/* SECTION 1 — Bill details */}
        <div className="cb-section">
          <div className="cb-section-title">📝 Bill Details</div>
          <div className="cb-field">
            <label>Bill Name *</label>
            <input type="text" placeholder="e.g. Eko Island Dinner"
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

          {/* ── Creator question — shown for BOTH split types ── */}
          <div className="cb-creator-question">
            <div className="cb-cq-icon">🙋</div>
            <div className="cb-cq-title">Are you splitting this bill too?</div>
            <p className="cb-cq-sub">
              Choose whether your own share is included in this bill.
            </p>

            <div className="cb-cq-options">
              <button
                className={`cb-cq-opt ${creatorIncluded === true ? "cq-yes" : ""}`}
                onClick={() => setCreatorIncluded(true)}
              >
                <span className="cb-cq-opt-icon">✓</span>
                <span className="cb-cq-opt-label">Yes, I'm splitting</span>
                <span className="cb-cq-opt-sub">Add my share to the bill</span>
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

            {creatorIncluded === true && (
              <div className="cb-cq-name-wrap">
                <div className="cb-field" style={{ marginBottom: 8 }}>
                  <label>Your name (shown in the bill)</label>
                  <input type="text" placeholder="e.g. Adeola"
                    value={creatorName} onChange={e => setCreatorName(e.target.value)} />
                </div>

                {/* Custom split → creator enters their own amount */}
                {!equalSplit && (
                  <div className="cb-field" style={{ marginBottom: 8 }}>
                    <label>Your share amount (₦)</label>
                    <input type="number" placeholder="How much are you paying?"
                      value={creatorAmount} onChange={e => setCreatorAmount(e.target.value)} />
                  </div>
                )}

                {/* Equal split → show the auto-calculated share */}
                {equalSplit && splitAmount > 0 && (
                  <div className="cb-creator-share-preview">
                    <span>Your calculated share</span>
                    <strong>₦{splitAmount.toLocaleString(undefined, { maximumFractionDigits: 2 })}</strong>
                  </div>
                )}
              </div>
            )}

            {/* Summary pill when creator says no */}
            {creatorIncluded === false && (
              <div className="cb-split-preview" style={{ marginTop: 10 }}>
                {equalSplit && splitAmount > 0
                  ? `✂️ Each of ${participants.length} participant${participants.length !== 1 ? "s" : ""} pays ₦${splitAmount.toLocaleString(undefined,{maximumFractionDigits:2})}`
                  : "✏️ You will assign custom amounts to each participant below"}
              </div>
            )}
          </div>

          {/* Equal split toggle */}
          <div className="cb-split-header" style={{ marginTop: 20 }}>
            <span style={{ fontSize: 13, color: "rgba(243,232,255,.6)" }}>Split method</span>
            <div className="cb-split-toggle" onClick={handleToggleEqualSplit}>
              <span>Equal Split</span>
              <div className={`cb-toggle-track ${equalSplit ? "active" : ""}`}>
                <div className="cb-toggle-thumb" />
              </div>
            </div>
          </div>

          {!equalSplit && (
            <p style={{ fontSize: 13, color: "rgba(243,232,255,.45)", margin: "8px 0 12px" }}>
              Assign a custom amount to each participant below.
            </p>
          )}

          {/* Participant rows */}
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

          <button className="cb-add-btn" onClick={addParticipant}>+ Add Another Person</button>
        </div>

        <button className="cb-submit-btn" onClick={handleCreateBill} disabled={loading}>
          {loading ? <span className="cb-spin" /> : "🚀 Create Bill & Get Share Links"}
        </button>
      </div>
    </div>
  );
};

export default CreateBill;