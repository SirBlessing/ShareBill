import React, { useState } from "react";
// import AdUnit from "./AdUnit";
import "./UnlockLink.css";

const AD_DURATION = 5; // seconds the ad shows before the button activates

function UnlockLink() {
  const [adShowing,  setAdShowing]  = useState(false);
  const [adDone,     setAdDone]     = useState(false);
  const [countdown,  setCountdown]  = useState(AD_DURATION);

  const phoneNumber  = "2348130001122";
  const message      = "Hello, I want to view my bill link";
  const whatsappLink = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  const handleWatchAd = () => {
    setAdShowing(true);
    setCountdown(AD_DURATION);

    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setAdShowing(false);
          setAdDone(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleOpenWhatsApp = () => {
    window.location.href = whatsappLink;
  };

  return (
    <div className="unlock-wrapper">
      <h1 className="unlock-title">Unlock Your WhatsApp Link</h1>
      <div className="underline" />

      {/* Info icons */}
      <div className="unlock-icons">
        <div className="icon-box">
          <span className="icon-circle">▶</span>
          <p>Watch a quick ad to activate your shareable WhatsApp Bill link</p>
        </div>
        <div className="icon-box">
          <span className="icon-circle">!</span>
          <p>Required step — necessary to continue bill sharing on WhatsApp</p>
        </div>
        <div className="icon-box">
          <span className="icon-circle">♥</span>
          <p>Ads keep ShareBill free for everyone worldwide</p>
        </div>
        <div className="icon-box">
          <span className="icon-circle">🔒</span>
          <p>We never store your WhatsApp messages</p>
        </div>
      </div>

      {/* AD DISPLAY AREA */}
      {adShowing && (
        <div className="unlock-ad-area">
          {/* Real Moneytag ad renders here */}
          <AdUnit style={{ minHeight: 120, borderRadius: 12 }} />

          <div className="unlock-ad-footer">
            <div className="unlock-ad-label">Advertisement</div>
            <div className="unlock-ad-timer">
              Please wait <strong>{countdown}s</strong> before continuing
            </div>
          </div>
        </div>
      )}

      {/* CTA */}
      <div className="unlock-center" style={{ marginTop: adShowing ? 20 : 40 }}>
        {!adShowing && !adDone && (
          <>
            <button className="unlock-btn" onClick={handleWatchAd}>
              ▶ Watch Ad to Unlock WhatsApp Link
            </button>
            <p className="unlock-note">This takes less than {AD_DURATION} seconds</p>
          </>
        )}

        {adShowing && (
          <button className="unlock-btn" disabled style={{ opacity: 0.5 }}>
            Please watch the ad… ({countdown}s)
          </button>
        )}

        {adDone && (
          <>
            <button className="unlock-btn unlock-btn-ready" onClick={handleOpenWhatsApp}>
              ✅ Open WhatsApp →
            </button>
            <p className="unlock-note" style={{ color: "#4ade80" }}>
              Ad complete — your link is ready!
            </p>
          </>
        )}
      </div>
    </div>
  );
}

export default UnlockLink;