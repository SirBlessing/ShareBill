import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import phone21 from "../assets/images/phone21.png";
import "./Dashboard.css";

function Dashboard() {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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
        console.error(err);
        if (err.response?.status === 401) {
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchBills();
  }, [navigate]);

  return (
    <div className="dashboard-wrapper">

      {/* LEFT IMAGES */}
      <div className="dashboard-left">
        <img src={phone21} alt="phone" className="dash-phone phone1" />
        <img src={phone21} alt="phone" className="dash-phone phone2" />
      </div>

      {/* RIGHT SECTION */}
      <div className="dashboard-right">
        <h1 className="dashboard-title">User Dashboard</h1>
        <div className="dash-underline"></div>

        {/* BUTTONS */}
        <div className="dash-buttons">
          <Link to="/create-bill" className="dash-btn create-btn">
            + Create New Bill
          </Link>
          <Link to="/ActiveBills" className="dash-btn view-btn">
            View Active Bills
          </Link>
          {/* <button className="dash-btn remind-btn">
            Remind Participants
          </button> */}
        </div>

        {/* BILL HISTORY */}
        <div className="bill-history-box">
          <h3>Bill History</h3>

          {loading && <p>Loading bills...</p>}

          {!loading && bills.length === 0 && (
            <p>No bills yet. Create your first bill 👋</p>
          )}

          {!loading &&
            bills.map((bill) => (
              <div className="bill-item" key={bill.id}>
                <div className="bill-info">
                  <p className="bill-title">{bill.title}</p>
                  <p className="bill-amount">
                    ₦{Number(bill.total_amount).toLocaleString()}
                  </p>
                </div>

                <div className="bill-status">
                  <span
                    className={`status-dot ${
                      bill.status === "completed" ? "green" : "yellow"
                    }`}
                  ></span>
                  {bill.status === "completed" ? "Completed" : "In progress"}
                </div>

                <button
                  className="view-bill-btn"
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
}

export default Dashboard;
