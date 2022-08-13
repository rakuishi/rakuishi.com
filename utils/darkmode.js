/**
 * Call these methods with Effect Hook
 */

export function isDarkmode() {
  let scheme = "light";

  if (localStorage.getItem("prefers-color-scheme")) {
    scheme = localStorage.getItem("prefers-color-scheme");
  } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
    scheme = "dark";
  }

  return scheme === "dark";
}

export function toggleDarkmode() {
  const isDark = isDarkmode();
  const scheme = isDark ? "light" : "dark";
  localStorage.setItem("prefers-color-scheme", scheme);
  document.documentElement.setAttribute("data-prefers-color-scheme", scheme);
}
