// Frontend runtime API base URL
// Priority: VITE_API_URL (build-time) > window.ENV.API_URL (runtime) > same-origin in prod (Vercel) > localhost for dev
const isBrowser = typeof window !== "undefined";
const viteApi = import.meta?.env?.VITE_API_URL;
const runtimeApi = isBrowser && window.ENV?.API_URL;

let base = viteApi || runtimeApi || "";

if (!base && isBrowser) {
  const isProdLike =
    /vercel\.app$/.test(window.location.hostname) ||
    import.meta?.env?.MODE === "production";
  if (isProdLike) {
    base = window.location.origin; // use same-origin on Vercel
  }
}

if (!base) {
  base = "http://localhost:3001";
}

export const API_URL = String(base).replace(/\/$/, "");
