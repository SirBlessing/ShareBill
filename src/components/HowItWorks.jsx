import React from "react";

// import phoneImg from "../assets/howitworks-phone.png"; 
// import confirmIcon from "../assets/confirm.png";
// import reminderIcon from "../assets/reminder.png";

import howitworkimage from "../assets/images/howitworkimage.png";
export default function HowItWorks() {
  return (
    <div className="how-container">

      {/* LEFT IMAGE SIDE */}
      <div className="how-left">
        <div className="phone-wrapper">
          {/* <img src={phoneImg} alt="phone" className="phone-img" />

          <div className="badge-box">
            <div className="badge">
              <img src={confirmIcon} alt="confirm" />
              <p>Confirm payments</p>
            </div>

            <div className="badge">
              <img src={reminderIcon} alt="remind" />
              <p>Send Reminders</p>
            </div>
          </div> */}
            <img src={howitworkimage} alt="how it works" />
        </div>
      </div>

      {/* RIGHT CONTENT SIDE */}
      <div className="how-right">
        <h2>How it works</h2>

        <ul>
          <li><strong>STEP 1:</strong> Create a Bill</li>
          <li>Enter Bill Name</li>
          <li>Enter Bill Amount</li>
          <li>Enter Participants</li>
          <li>Insert Account Details</li>
          <li>Press Share</li>

          <li><strong>STEP 2:</strong> Unlock WhatsApp Link</li>
          <li>Watch a small rewarded ad to unlock your WhatsApp link</li>

          <li><strong>STEP 3:</strong> Send Bill Link</li>
          <li>Share the unique link with your participants</li>

          <li><strong>STEP 4:</strong> Participants open the Link</li>
          <li>Make their payment, upload receipt</li>

          <li><strong>STEP 5:</strong> Confirm Payment</li>
          <li>You confirm their payment</li>
          <li>Status turns green</li>
        </ul>

        <div className="extra-tips">
          <p><strong>Extra Tips:</strong></p>
          <p>• Watch ads to enable WhatsApp reminders for late payments</p>
        </div>
      </div>

    </div>
  );
}
