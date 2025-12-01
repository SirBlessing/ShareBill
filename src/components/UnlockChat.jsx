import React, { useState } from "react";


function UnlockChat() {
  const [loading, setLoading] = useState(false);

  const phoneNumber = "2348130001122"; 
  const message = "Hello, I am interested in your service"; 

  const whatsappLink =
    "https://wa.me/" +
    phoneNumber +
    "?text=" +
    encodeURIComponent(message);

  const handleWatchAd = () => {
    setLoading(true);

    // Simulate watching an ad for 5 seconds
    setTimeout(() => {
      setLoading(false);

      // Redirect to WhatsApp
      window.location.href = whatsappLink;
    }, 5000);
  };

  return (
    <div className="unlock-wrapper">
      <h2>Unlock WhatsApp Contact</h2>

      <p>You must watch a short ad to unlock this contact.</p>

      <button
        className="unlock-btn"
        onClick={handleWatchAd}
        disabled={loading}
      >
        {loading ? (
          <div className="spinner"></div>
        ) : (
          "Watch Ad"
        )}
      </button>
    </div>
  );
}

export default UnlockChat;
