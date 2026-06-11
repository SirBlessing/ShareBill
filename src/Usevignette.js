import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const COOLDOWN_MS  = 3 * 60 * 1000; // 3 minutes between vignettes
const STORAGE_KEY  = "sb_last_vignette";

/* Pages that should trigger the vignette on arrival */
const VIGNETTE_PAGES = [
  "/dashboard",
  "/create-bill",
  "/ActiveBills",
  "/bill/",
  "/unlock-link",
];

function injectVignette() {
  const last = Number(localStorage.getItem(STORAGE_KEY) || 0);
  if (Date.now() - last < COOLDOWN_MS) return; // still cooling down

  localStorage.setItem(STORAGE_KEY, Date.now());

  const s = document.createElement("script");
  s.dataset.zone = "11101728";
  s.src = "https://n6wxm.com/vignette.min.js";
  s.async = true;
  document.body.appendChild(s);

  // Clean up after 15 s
  setTimeout(() => {
    try { document.body.removeChild(s); } catch (_) {}
  }, 15000);
}

/**
 * useVignette()
 *
 * 1. Auto-fires on navigation to any VIGNETTE_PAGES path.
 * 2. Returns a `triggerVignette` function you can attach to buttons.
 *
 * Usage in a component:
 *   const triggerVignette = useVignette();
 *   <button onClick={() => { triggerVignette(); navigate("/create-bill"); }}>
 *     Create Bill
 *   </button>
 */
export default function useVignette() {
  const location = useLocation();

  useEffect(() => {
    const isInnerPage = VIGNETTE_PAGES.some(p =>
      location.pathname.startsWith(p)
    );
    if (isInnerPage) injectVignette();
  }, [location.pathname]);

  return injectVignette; // also usable as a manual trigger
}