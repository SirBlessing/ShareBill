import React from "react";



// import phoneLeft from "../assets/images/phoneLeft.png";
// import phoneRight from "../assets/images/phoneRight.png";
import phone21 from "../assets/images/phone21.png";
const phoneLeft = phone21;
const phoneRight = phone21;
function UnlockLink() {
  return (
    <>
      

      <div className="unlock-wrapper">
        <h1 className="unlock-title">Unlock Your WhatsApp Link</h1>
        <div className="underline"></div>

        {/* Icons Row */}
        <div className="unlock-icons">
          <div className="icon-box">
            <span className="icon-circle">▶</span>
            <p>Watch a quick ad to activate your shareable WhatsApp Bill link</p>
          </div>

          <div className="icon-box">
            <span className="icon-circle">!</span>
            <p>
              Required Step. This step is <br /> necessary to continue your bill
              sharing on WhatsApp
            </p>
          </div>

          <div className="icon-box">
            <span className="icon-circle">►</span>
            <p>
              Ads help us keep ShareBill free <br /> for everyone worldwide
            </p>
          </div>

          <div className="icon-box">
            <span className="icon-circle">🔒</span>
            <p>We never store your WhatsApp messages</p>
          </div>
        </div>

        <div className="unlock-content">
          <img src={phoneLeft} alt="phone" className="unlock-phone left" />

          <div className="unlock-center">
            <button className="unlock-btn">
              Unlock WhatsApp Link / Watch Ad
            </button>
            <p className="unlock-note">This takes less than 15 seconds</p>
          </div>

          <img src={phoneRight} alt="phone" className="unlock-phone right" />
        </div>
      </div>
    </>
  );
}

export default UnlockLink;
