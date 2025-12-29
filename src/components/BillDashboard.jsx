import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./BillDashboard.css";

const BillDashboard = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [bill, setBill] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBill = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(
          `http://localhost:5000/bills/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setBill(res.data);

        // ✅ IMPORTANT FIX
        const parsedParticipants = res.data.participants
          ? JSON.parse(res.data.participants)
          : [];

        setParticipants(parsedParticipants);
      } catch (err) {
        console.error(err);
        setError("Failed to load bill");
        if (err.response?.status === 401) {
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchBill();
  }, [id, navigate]);

  if (loading) return <p style={{ color: "#fff" }}>Loading bill...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
  <div className="bill-dashboard-page">

    {/* TOP SECTION */}
    <div className="bill-dashboard-top">

      {/* LEFT */}
      <div className="bill-summary">
        <h1 className="page-title">Bill Dashboard</h1>

        <div className="summary-box">
          <h3>Creator View</h3>
          <p><strong>Bill Name:</strong> {bill.title}</p>
          <p><strong>Bill Amount:</strong> ₦{Number(bill.total_amount).toLocaleString()}</p>
          <p><strong>Your share:</strong> —</p>
          <p><strong>Number of Participants:</strong> {participants.length}</p>

          <small>This page is only visible to the bill creator</small>
        </div>

        <button className="remind-btn">🔔 Send Reminder to All</button>
      </div>

      {/* RIGHT */}
      <div className="payment-status">
        <h2>Payment Status</h2>

        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {participants.map((p, i) => (
              <tr key={i}>
                <td>{p.name}</td>
                <td>₦{Number(p.amount).toLocaleString()}</td>
                <td>
  <div className={`status-badge ${p.status}`}>
    <span className="status-dot"></span>
    {p.status === "paid"
      ? "Paid"
      : p.status === "awaiting"
      ? "Awaiting Confirmation"
      : "Pending"}
  </div>
</td>

                <td>
                  {p.status === "paid" ? (
                    <button className="undo-btn">Undo</button>
                  ) : (
                    <button className="paid-btn">Mark as Paid</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>

    {/* BOTTOM BAR */}
    <div className="bill-dashboard-footer">
      <div className="legend">
        <span><i className="dot pending"></i> Pending</span>
        <span><i className="dot awaiting"></i> Awaiting Confirmation</span>
        <span><i className="dot paid"></i> Paid</span>
      </div>

      <button className="close-btn">Close Bill</button>
    </div>
  </div>
);

};

export default BillDashboard;
