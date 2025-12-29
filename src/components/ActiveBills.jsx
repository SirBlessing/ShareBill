import React, { useEffect, useState } from "react";
import "./ActiveBills.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const ActiveBills = () => {
  const navigate = useNavigate();

  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBills = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(
          "http://localhost:5000/bills/my-bills",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setBills(res.data);
      } catch (err) {
        setError("Failed to load bills");
      } finally {
        setLoading(false);
      }
    };

    fetchBills();
  }, []);

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

        <Link to="/dashboard" className="back-btn">
          Back to user dashboard
        </Link>

        <button className="remind-btn">
          <span role="img" aria-label="icon">💡</span> Remind Participants
        </button>

        <div className="active-bills-box">
          <h3 className="box-title">Your Active Bills</h3>

          {/* STATES */}
          {loading && <p>Loading bills...</p>}
          {error && <p className="error-text">{error}</p>}

          {!loading && bills.length === 0 && (
            <p>No active bills yet.</p>
          )}

          {/* REAL DATA */}
          {bills.map((bill) => (
            <div className="bill-item" key={bill.id}>
              <div className="bill-info">
                <p className="bill-title">{bill.title}</p>
                <p className="bill-amount">
                  ₦{Number(bill.total_amount).toLocaleString()}
                </p>
              </div>

              <div className="bill-status">
                <span className="status-dot"></span>
                {bill.status}
              </div>

              <button
                className="view-btn"
                onClick={() => navigate(`/bill/${bill.id}`)}
              >
                View this Bill
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ActiveBills;
