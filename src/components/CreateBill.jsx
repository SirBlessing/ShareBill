import React, { useState } from "react";
import "../App.css"; // <-- create this file for styling
import Navbar from "../components/Navbar";
import phone4 from "../assets/images/phone4.png";
import phone5 from "../assets/images/phone5.png";
const CreateBill = () => {
  const [participants, setParticipants] = useState([
    { name: "", whatsapp: "", amount: "" },
  ]);
  const [equalSplit, setEqualSplit] = useState(false);

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

          <label>Bill Name</label>
          <input type="text" placeholder="Enter Preferred Bill Name" />

          <label>Bill Amount</label>
          <input type="number" placeholder="Enter Bill Amount" />

          <label>Account Name</label>
          <input type="text" placeholder="Enter your Account Name" />

          <label>Account Number</label>
          <input type="number" placeholder="Enter your Account Number" />

          <label>Bank Name</label>
          <input type="text" placeholder="Enter your Bank Name" />

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

          {/* PARTICIPANTS LIST */}
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

          {/* ADD PARTICIPANT BUTTON */}
          <button className="add-btn" onClick={addParticipant}>+</button>

          {/* NEXT BUTTON */}
          <button className="next-btn">Next</button>
        </div>
      </div>
    </div>
  );
};

export default CreateBill;
