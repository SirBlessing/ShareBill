import React, { useState } from "react";
import "../App.css";
import Navbar from "../components/Navbar";
import phone4 from "../assets/images/phone4.png";
import phone5 from "../assets/images/phone5.png";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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
    setParticipants([
      ...participants,
      { name: "", whatsapp: "", amount: "" },
    ]);
  };

  const handleInputChange = (index, field, value) => {
    const updated = [...participants];
    updated[index][field] = value;
    setParticipants(updated);
  };

  // 🔥 CREATE BILL (CONNECTS TO BACKEND)
  const handleCreateBill = async () => {
    if (!title || !totalAmount || !accountName || !accountNumber || !bankName) {
      setError("Please fill all required fields");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const payload = {
        title,
        total_amount: totalAmount,
        description,
        due_date: dueDate,
        account_name: accountName,
        account_number: accountNumber,
        bank_name: bankName,
        equalSplit,
        participants,
      };

      const token = localStorage.getItem("token");

      const res = await axios.post(
        "http://localhost:5000/bills/create",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.success) {
        navigate("/dashboard");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create bill");
    }

    setLoading(false);
  };

  return (
    <div className="createbill-page">
     

      <div className="createbill-container">
        {/* LEFT IMAGE SECTION */}
        <div className="createbill-images">
          <img src={phone5} alt="" />
          <img src={phone4} alt="" />
          <img src={phone4} alt="" />
        </div>

        {/* RIGHT FORM SECTION */}
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

          <label>Bill Amount</label>
          <input
            type="number"
            placeholder="Enter Bill Amount"
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
            type="number"
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

          <div className="split-header">
            <label>List of Participants</label>
            <div className="split-toggle">
              <span>Equal Split</span>
              <input
                type="checkbox"
                checked={equalSplit}
                onChange={() => setEqualSplit(!equalSplit)}
              />
            </div>
          </div>

          {participants.map((p, index) => (
            <div key={index} className="participant-row">
              <input
                type="text"
                placeholder="Enter Participant’s Name"
                value={p.name}
                onChange={(e) =>
                  handleInputChange(index, "name", e.target.value)
                }
              />
              <input
                type="text"
                placeholder="Enter WhatsApp Number"
                value={p.whatsapp}
                onChange={(e) =>
                  handleInputChange(index, "whatsapp", e.target.value)
                }
              />
              {!equalSplit && (
                <input
                  type="number"
                  placeholder="Amount to Pay"
                  value={p.amount}
                  onChange={(e) =>
                    handleInputChange(index, "amount", e.target.value)
                  }
                />
              )}
            </div>
          ))}

          <button className="add-btn" onClick={addParticipant}>+</button>

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
