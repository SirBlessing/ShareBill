import { useEffect, useRef } from "react";

/**
 * AdUnit — injects the Moneytag ad script into its own container.
 * Place this wherever a real ad should appear.
 * The script appends itself to the container div so each unit
 * is isolated and the network can target it by data-zone.
 */
export default function AdUnit({ className = "", style = {} }) {
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) return;

    const s = document.createElement("script");
    s.dataset.zone = "11089549";
    s.src = "https://nap5k.com/tag.min.js";
    s.async = true;
    ref.current.appendChild(s);

    return () => {
      // Clean up script when component unmounts
      try {
        if (ref.current && s.parentNode === ref.current) {
          ref.current.removeChild(s);
        }
      } catch (_) {}
    };
  }, []);

  return (
    <div
      ref={ref}
      className={`ad-unit-container ${className}`}
      style={{ minHeight: 60, width: "100%", ...style }}
    />
  );
}