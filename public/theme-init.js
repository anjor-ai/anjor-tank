(function () {
  var d = document.documentElement,
    t = "dark";
  try {
    var s = localStorage.getItem("anjor-theme");
    if (s === "dark" || s === "light") t = s;
    if (sessionStorage.getItem("anjor-motion") === "off") d.classList.add("rm");
  } catch (e) {}
  if (
    window.matchMedia &&
    matchMedia("(prefers-reduced-motion: reduce)").matches
  )
    d.classList.add("rm");
  d.setAttribute("data-theme", t);
  var m = document.querySelector('meta[name="theme-color"]');
  if (m) m.content = t === "dark" ? "#090d18" : "#ffffff";
})();
