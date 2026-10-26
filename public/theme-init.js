(function () {
  // Light first: the site opens in light mode unless the reader has switched to dark on this device.
  // ROQIVA is always dark, so its first paint is dark too (the reader's own choice is left as it is).
  try {
    var t = 'light';
    try { if (localStorage.getItem('orch-theme') === 'dark') t = 'dark'; } catch (e) {}
    if (/^\/roqiva(\/|$)/.test(location.pathname)) t = 'dark';
    document.documentElement.setAttribute('data-theme', t);
    var m = document.querySelector('meta[name="theme-color"]');
    if (m) m.setAttribute('content', t === 'light' ? '#fdfcfc' : '#141413');
  } catch (e) {}
})();
