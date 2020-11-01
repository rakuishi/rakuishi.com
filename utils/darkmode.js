/**
 * Call these methods with Effect Hook
 */
export function initDarkmode() {
  let scheme = "light";

  if (localStorage.getItem("prefers-color-scheme")) {
    scheme = localStorage.getItem("prefers-color-scheme");
  } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
    scheme = "dark";
  }

  document.documentElement.setAttribute("data-prefers-color-scheme", scheme);
}

export function switchDarkmode() {
  const isDarkmode = localStorage.getItem("prefers-color-scheme") === "dark";
  const scheme = isDarkmode ? "light" : "dark";
  localStorage.setItem("prefers-color-scheme", scheme);
  document.documentElement.setAttribute("data-prefers-color-scheme", scheme);
}
