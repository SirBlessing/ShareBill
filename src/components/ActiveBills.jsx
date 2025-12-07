import React from "react";
import "./ActiveBills.css";
import { Link } from "react-router-dom";

const ActiveBills = () => {
  const bills = [
    {
      title: "Monthly Rent",
      amount: "$52,000",
      status: "in progress",
    },
    {
      title: "Netflix Subscription",
      amount: "$15,000",
      status: "in progress",
    },
    {
      title: "Movie Night",
      amount: "$18,000",
      status: "in progress",
    },
  ];

  return (
    <div className="active-container">
      {/* LEFT PHONE IMAGES */}
      <div className="active-left">
        <div className="phone phone-1"></div>
        <div className="phone phone-2"></div>
      </div>

      {/* RIGHT CONTENT */}
      <div className="active-right">
        <h1 className="active-title">Active Bills</h1>
        <div className="underline"></div>

        <Link to="/dashboard" className="back-btn">Back to user dashboard</Link>

        <button className="remind-btn">
          <span role="img" aria-label="icon">💡</span> Remind Participants
        </button>

        <div className="active-bills-box">
          <h3 className="box-title">Your Active Bills</h3>

          {bills.map((bill, index) => (
            <div className="bill-item" key={index}>
              <div className="bill-info">
                <p className="bill-title">{bill.title}</p>
                <p className="bill-amount">{bill.amount}</p>
              </div>

              <div className="bill-status">
                <span className="status-dot"></span>
                {bill.status}
              </div>

              <button className="view-btn">View this Bill</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ActiveBills;
