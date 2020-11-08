/**
 * Call this methods with Effect Hook
 */
export function switchDarkmode() {
  const isDarkmode = localStorage.getItem("prefers-color-scheme") === "dark";
  const scheme = isDarkmode ? "light" : "dark";
  localStorage.setItem("prefers-color-scheme", scheme);
  document.documentElement.setAttribute("data-prefers-color-scheme", scheme);
}
