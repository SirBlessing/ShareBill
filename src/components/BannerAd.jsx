import { useEffect, useRef } from "react";
import "./BannerAd.css";

/**
 * BannerAd
 * Injects the nap5k banner script into its own container.
 * Drop anywhere — it won't disrupt layout.
 */
export default function BannerAd({ className = "" }) {
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) return;
    const s = document.createElement("script");
    s.dataset.zone = "11089549";
    s.src = "https://nap5k.com/tag.min.js";
    s.async = true;
    ref.current.appendChild(s);

    return () => {
      try {
        if (s.parentNode) s.parentNode.removeChild(s);
      } catch (_) {}
    };
  }, []);

  return (
    <div ref={ref} className={`banner-ad ${className}`} />
  );
}