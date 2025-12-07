import React from "react";
import { Link } from "react-router-dom";
import phone21 from "../assets/images/phone21.png";
import "./Dashboard.css"
function Dashboard() {
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
          <Link to="/create-bill" className="dash-btn create-btn">+ Create New Bill</Link>
          <Link to="/ActiveBills" className="dash-btn view-btn">View Active Bills</Link>
          <button className="dash-btn remind-btn">Remind Participants</button>
        </div>

        {/* BILL HISTORY */}
        <div className="bill-history-box">
          <h3>Bill History</h3>

          <div className="bill-item">
            <div className="bill-info">
              <p className="bill-title">Monthly Rent</p>
              <p className="bill-amount">$52,000</p>
            </div>

            <div className="bill-status">
              <span className="status-dot yellow"></span> In progress
            </div>

            <button className="view-bill-btn">View this Bill</button>
          </div>

          <div className="bill-item">
            <div className="bill-info">
              <p className="bill-title">Netflix Subscription</p>
              <p className="bill-amount">$15,000</p>
            </div>

            <div className="bill-status">
              <span className="status-dot yellow"></span> In progress
            </div>

            <button className="view-bill-btn">View this Bill</button>
          </div>

          <div className="bill-item">
            <div className="bill-info">
              <p className="bill-title">Movie Night</p>
              <p className="bill-amount">$18,000</p>
            </div>

            <div className="bill-status">
              <span className="status-dot green"></span> Completed
            </div>

            <button className="view-bill-btn">View this Bill</button>
          </div>

        </div>
      </div>

    </div>
  );
}

export default Dashboard;
