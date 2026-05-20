import React, { useState } from "react";
import "../App.css";
import phone4 from "../assets/images/phone4.png";
import phone5 from "../assets/images/phone5.png";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API = "http://localhost:5000";

const CreateBill = () => {
  const navigate = useNavigate();

  // BILL CORE
  const [title, setTitle] = useState("");
  const [totalAmount, setTotalAmount] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");

  // BANK INFO
  const [accountName, setAccountName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [bankName, setBankName] = useState("");

  // PARTICIPANTS
  const [participants, setParticipants] = useState([
    { name: "", whatsapp: "", amount: "" },
  ]);

  const [equalSplit, setEqualSplit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const addParticipant = () => {
    setParticipants([...participants, { name: "", whatsapp: "", amount: "" }]);
  };

  const removeParticipant = (index) => {
    setParticipants(participants.filter((_, i) => i !== index));
  };

  const handleInputChange = (index, field, value) => {
    const updated = [...participants];
    updated[index][field] = value;
    setParticipants(updated);
  };

  // ─── VALIDATION ──────────────────────────────────────────
  const validate = () => {
    if (!title.trim()) return setError("Bill name is required."), false;
    if (!totalAmount || isNaN(totalAmount) || Number(totalAmount) <= 0)
      return setError("Enter a valid bill amount."), false;
    if (!accountName.trim() || !accountNumber.trim() || !bankName.trim())
      return setError("Bank details are required."), false;

    for (let i = 0; i < participants.length; i++) {
      if (!participants[i].name.trim())
        return setError(`Participant ${i + 1} needs a name.`), false;
      if (!equalSplit && (!participants[i].amount || isNaN(participants[i].amount)))
        return setError(`Participant ${i + 1} needs a valid amount.`), false;
    }

    if (!equalSplit) {
      const total = Number(totalAmount);
      const sum = participants.reduce((acc, p) => acc + Number(p.amount || 0), 0);
      if (sum > total)
        return setError("Participants' amounts exceed the total bill."), false;
    }

    return true;
  };

  // ─── SUBMIT ──────────────────────────────────────────────
  const handleCreateBill = async () => {
    setError("");
    if (!validate()) return;

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      let finalParticipants;

      if (equalSplit) {
        // ✅ FIX: divide by participants.length + 1 (includes creator)
        const totalPeople = participants.length + 1;
        const splitAmount = parseFloat(
          (Number(totalAmount) / totalPeople).toFixed(2)
        );

        finalParticipants = participants.map((p) => ({
          ...p,
          amount: splitAmount,
          status: "pending",
        }));
      } else {
        finalParticipants = participants.map((p) => ({
          ...p,
          amount: Number(p.amount),
          status: "pending",
        }));
      }

      await axios.post(
        `${API}/bills/create`,
        {
          title,
          total_amount: Number(totalAmount),
          description,
          due_date: dueDate || null,
          account_name: accountName,
          account_number: accountNumber,
          bank_name: bankName,
          equalSplit,
          participants: finalParticipants,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message || "Failed to create bill. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // ─── LIVE PREVIEW ────────────────────────────────────────
  const previewSplit =
    equalSplit && totalAmount && participants.length > 0
      ? parseFloat(
          (Number(totalAmount) / (participants.length + 1)).toFixed(2)
        ).toLocaleString()
      : null;

  // ─── RENDER ──────────────────────────────────────────────
  return (
    <div className="createbill-page">
      <div className="createbill-container">

        {/* LEFT IMAGES */}
        <div className="createbill-images">
          <img src={phone5} alt="" />
          <img src={phone4} alt="" />
          <img src={phone4} alt="" />
        </div>

        {/* RIGHT FORM */}
        <div className="createbill-form">
          <h1 className="createbill-title">
            <span className="plus">+</span> Create Bill
          </h1>

          {error && <p className="error-text">{error}</p>}

          <label>Bill Name</label>
          <input
            type="text"
            placeholder="Enter Preferred Bill Name"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <label>Bill Amount (₦)</label>
          <input
            type="number"
            placeholder="Enter Total Bill Amount"
            value={totalAmount}
            onChange={(e) => setTotalAmount(e.target.value)}
          />

          <label>Account Name</label>
          <input
            type="text"
            placeholder="Enter your Account Name"
            value={accountName}
            onChange={(e) => setAccountName(e.target.value)}
          />

          <label>Account Number</label>
          <input
            type="text"
            placeholder="Enter your Account Number"
            value={accountNumber}
            onChange={(e) => setAccountNumber(e.target.value)}
          />

          <label>Bank Name</label>
          <input
            type="text"
            placeholder="Enter your Bank Name"
            value={bankName}
            onChange={(e) => setBankName(e.target.value)}
          />

          <label>Description (optional)</label>
          <input
            type="text"
            placeholder="Optional description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <label>Due Date (optional)</label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />

          {/* SPLIT HEADER */}
          <div className="split-header">
            <label>Participants</label>
            <div className="split-toggle">
              <span>Equal Split</span>
              <input
                type="checkbox"
                checked={equalSplit}
                onChange={() => setEqualSplit(!equalSplit)}
              />
            </div>
          </div>

          {/* EQUAL SPLIT PREVIEW */}
          {previewSplit && (
            <p style={{ color: "#ff2bd8", fontSize: 13, marginTop: 6 }}>
              Each person pays ₦{previewSplit} (including you)
            </p>
          )}

          {/* PARTICIPANT ROWS */}
          {participants.map((p, index) => (
            <div key={index} className="participant-row">
              <input
                type="text"
                placeholder="Participant Name"
                value={p.name}
                onChange={(e) => handleInputChange(index, "name", e.target.value)}
              />
              <input
                type="text"
                placeholder="WhatsApp Number"
                value={p.whatsapp}
                onChange={(e) => handleInputChange(index, "whatsapp", e.target.value)}
              />
              {!equalSplit && (
                <input
                  type="number"
                  placeholder="Amount (₦)"
                  value={p.amount}
                  onChange={(e) => handleInputChange(index, "amount", e.target.value)}
                />
              )}
              {participants.length > 1 && (
                <button
                  type="button"
                  style={{
                    background: "#ff2bd8",
                    border: "none",
                    borderRadius: "50%",
                    color: "white",
                    width: 28,
                    height: 28,
                    cursor: "pointer",
                    fontSize: 16,
                    lineHeight: "28px",
                    padding: 0,
                  }}
                  onClick={() => removeParticipant(index)}
                >
                  −
                </button>
              )}
            </div>
          ))}

          <button className="add-btn" type="button" onClick={addParticipant}>
            +
          </button>

          <button
            className="next-btn"
            onClick={handleCreateBill}
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Bill"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateBill;