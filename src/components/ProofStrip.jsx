import React from "react";

const items = [
  { icon: "🧾", num: "5,000+",  label: "Bill Created" },
  { icon: "💸", num: "₦50M+",   label: "Tracked So Far" },
  { icon: "👥", num: "20,000+", label: "Participants" },
  { icon: "⚡", num: "< 2 min", label: "To Create a Bill" },
  { icon: "🎉", num: "Free",    label: "Always & Forever" },
];

export default function ProofStrip() {
  return (
    <div className="proof-strip">
      <div className="proof-inner">
        {items.map((item, i) => (
          <React.Fragment key={i}>
            <div className="proof-item">
              <div className="proof-icon">{item.icon}</div>
              <div>
                <div className="proof-num">{item.num}</div>
                <div className="proof-label">{item.label}</div>
              </div>
            </div>
            {i < items.length - 1 && <div className="proof-divider" />}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}