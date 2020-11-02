const escapes = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

const regexp = /[&<>"']/g;

export function escape(string) {
  return string ? string.replace(regexp, (chr) => escapes[chr]) : string || "";
}
