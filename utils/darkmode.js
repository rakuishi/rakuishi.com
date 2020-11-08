/**
 * Call this methods with Effect Hook
 */
export function toggleDarkmode() {
  const isDarkmode = localStorage.getItem("prefers-color-scheme") === "dark";
  const scheme = isDarkmode ? "light" : "dark";
  localStorage.setItem("prefers-color-scheme", scheme);
  document.documentElement.setAttribute("data-prefers-color-scheme", scheme);
}
