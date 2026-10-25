/* Runs before first paint. Sets the theme, and flags JS / reduced motion / first visit / page transition on <html>.
   An external file (not inline) so the CSP can stay at script-src 'self'. */
(function () {
  var d = document.documentElement, t = 'dark';
  d.classList.add('js');
  try {
    var s = localStorage.getItem('anjor-theme');
    if (s === 'dark' || s === 'light') t = s;
    else if (window.matchMedia && matchMedia('(prefers-color-scheme: light)').matches) t = 'light';
  } catch (e) {}
  d.setAttribute('data-theme', t);
  var m = document.querySelector('meta[name="theme-color"]');
  if (m) m.setAttribute('content', t === 'dark' ? '#08090c' : '#ffffff');
  var rm = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (rm) d.classList.add('rm');
  try {
    var home = location.pathname === '/' || location.pathname === '/index.html';
    if (!rm && home && !sessionStorage.getItem('anjor-boot')) d.classList.add('boot');
  } catch (e) {}
})();
