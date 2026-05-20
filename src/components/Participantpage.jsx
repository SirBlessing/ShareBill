import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./ParticipantPage.css";

const API = "http://localhost:5000";

// Compress image to under ~1.5MB before uploading
const compressImage = (file) =>
  new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const MAX = 900;
        let { width, height } = img;
        if (width > MAX) { height = Math.round((height * MAX) / width); width = MAX; }
        if (height > MAX) { width = Math.round((width * MAX) / height); height = MAX; }
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        canvas.getContext("2d").drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", 0.75));
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });

const ParticipantPage = () => {
  const { billId, participantIndex } = useParams();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [receiptPreview, setReceiptPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadDone, setUploadDone] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const fileInputRef = useRef();

  // ─── FETCH BILL INFO ──────────────────────────────────────
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `${API}/bills/public/${billId}/${participantIndex}`
        );
        setData(res.data);
        // If receipt already uploaded before, show that state
        if (res.data.status === "awaiting" || res.data.status === "paid") {
          setUploadDone(true);
        }
      } catch (err) {
        setError(
          err.response?.data?.message || "Could not load bill. Check the link."
        );
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [billId, participantIndex]);

  // ─── PICK IMAGE ───────────────────────────────────────────
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setUploadError("Please select an image file (JPG, PNG, etc.)");
      return;
    }

    setUploadError("");
    const compressed = await compressImage(file);
    setReceiptPreview(compressed);
  };

  // ─── UPLOAD ───────────────────────────────────────────────
  const handleUpload = async () => {
    if (!receiptPreview) return;

    setUploading(true);
    setUploadError("");

    try {
      await axios.post(
        `${API}/bills/public/${billId}/${participantIndex}/receipt`,
        { receipt: receiptPreview }
      );
      setUploadDone(true);
      setData((prev) => ({ ...prev, status: "awaiting" }));
    } catch (err) {
      setUploadError(
        err.response?.data?.message || "Upload failed. Please try again."
      );
    } finally {
      setUploading(false);
    }
  };

  // ─── COPY TO CLIPBOARD ────────────────────────────────────
  const copyAccountNumber = () => {
    navigator.clipboard.writeText(data.accountNumber);
    alert("Account number copied!");
  };

  // ─── RENDER STATES ────────────────────────────────────────
  if (loading) {
    return (
      <div className="pp-loading">
        <div className="pp-spinner"></div>
        <p>Loading your bill...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pp-error-page">
        <div className="pp-error-box">
          <span className="pp-error-icon">⚠️</span>
          <h2>Oops!</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  const statusColor = {
    pending: "#ffc107",
    awaiting: "#ff9800",
    paid: "#00c853",
  };

  return (
    <div className="pp-wrapper">

      {/* HEADER */}
      <div className="pp-header">
        <div className="pp-logo">ShareBill</div>
        <p className="pp-tagline">Your payment details</p>
      </div>

      {/* CARD */}
      <div className="pp-card">

        {/* GREETING */}
        <div className="pp-greeting">
          <h2>Hey, <span className="pp-name">{data.participantName}</span> 👋</h2>
          <p>You've been added to a bill. Here are your payment details.</p>
        </div>

        {/* BILL INFO */}
        <div className="pp-section pp-bill-info">
          <div className="pp-info-row">
            <span className="pp-label">Bill</span>
            <span className="pp-value">{data.billTitle}</span>
          </div>
          <div className="pp-info-row pp-amount-row">
            <span className="pp-label">Your Share</span>
            <span className="pp-amount">
              ₦{Number(data.amount).toLocaleString(undefined, { maximumFractionDigits: 2 })}
            </span>
          </div>
          <div className="pp-info-row">
            <span className="pp-label">Status</span>
            <span
              className="pp-status-pill"
              style={{ background: statusColor[data.status] || "#999" }}
            >
              {data.status === "awaiting" ? "Receipt Received ✓" : data.status}
            </span>
          </div>
        </div>

        {/* BANK DETAILS */}
        <div className="pp-section">
          <h3 className="pp-section-title">Pay To</h3>
          <div className="pp-bank-box">
            <div className="pp-bank-row">
              <span className="pp-bank-label">Account Name</span>
              <span className="pp-bank-value">{data.accountName}</span>
            </div>
            <div className="pp-bank-row">
              <span className="pp-bank-label">Bank</span>
              <span className="pp-bank-value">{data.bankName}</span>
            </div>
            <div className="pp-bank-row">
              <span className="pp-bank-label">Account Number</span>
              <div className="pp-acct-copy">
                <span className="pp-bank-value pp-acct-num">{data.accountNumber}</span>
                <button className="pp-copy-btn" onClick={copyAccountNumber}>
                  Copy
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* RECEIPT UPLOAD */}
        <div className="pp-section">
          <h3 className="pp-section-title">Proof of Payment</h3>

          {data.status === "paid" ? (
            <div className="pp-paid-banner">
              ✅ Your payment has been confirmed. You're all set!
            </div>
          ) : uploadDone ? (
            <div className="pp-awaiting-banner">
              ⏳ Receipt received! Waiting for the bill creator to confirm.
            </div>
          ) : (
            <>
              <p className="pp-upload-hint">
                After making the transfer, upload a screenshot or photo of your receipt.
              </p>

              {/* FILE PICKER */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                style={{ display: "none" }}
                onChange={handleFileChange}
              />

              <button
                className="pp-pick-btn"
                onClick={() => fileInputRef.current.click()}
              >
                📷 Choose Receipt Image
              </button>

              {/* PREVIEW */}
              {receiptPreview && (
                <div className="pp-preview-wrap">
                  <img
                    src={receiptPreview}
                    alt="Receipt preview"
                    className="pp-preview-img"
                  />
                  <button
                    className="pp-remove-btn"
                    onClick={() => setReceiptPreview(null)}
                  >
                    ✕ Remove
                  </button>
                </div>
              )}

              {uploadError && (
                <p className="pp-upload-error">{uploadError}</p>
              )}

              {/* SUBMIT */}
              {receiptPreview && (
                <button
                  className="pp-submit-btn"
                  onClick={handleUpload}
                  disabled={uploading}
                >
                  {uploading ? (
                    <span className="pp-spinner-inline"></span>
                  ) : (
                    "Submit Receipt"
                  )}
                </button>
              )}
            </>
          )}
        </div>
      </div>

      <p className="pp-footer">Powered by ShareBill · Secure bill splitting</p>
    </div>
  );
};

export default ParticipantPage;