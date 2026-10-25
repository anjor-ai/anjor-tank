/* Runs before first paint. Sets the theme, and flags JS / reduced motion / first visit / page transition on <html>.
   An external file (not inline) so the CSP can stay at script-src 'self'. */
(function () {
  var d = document.documentElement, t = 'light';
  d.classList.add('js');
  try {
    var s = localStorage.getItem('anjor-theme');
    if (s === 'dark' || s === 'light') t = s;
    // The portfolio opens in the pearlescent studio theme; an explicit saved choice wins.
  } catch (e) {}
  d.setAttribute('data-theme', t);
  var m = document.querySelector('meta[name="theme-color"]');
  if (m) m.setAttribute('content', t === 'dark' ? '#080c15' : '#f7f9fd');
  var rm = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (rm) d.classList.add('rm');
  try {
    if (!rm && sessionStorage.getItem('anjor-pt')) d.classList.add('pt-in');
    sessionStorage.removeItem('anjor-pt');
  } catch (e) {}
})();
