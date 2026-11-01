export function draftsAreVisible() {
  if (process.env.SHOW_DRAFTS === "true") return true;
  if (process.env.VERCEL_ENV === "preview") return true;
  return process.env.NODE_ENV !== "production";
}
