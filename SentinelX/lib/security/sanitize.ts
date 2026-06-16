export function escapeHtml(input: unknown): string {
  return String(input ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function safeText(input: unknown, max = 500) {
  const v = String(input ?? "").replace(/[\x00-\x1F\x7F]/g, "").slice(0, max);
  return v;
}
