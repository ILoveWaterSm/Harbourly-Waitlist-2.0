/* Mockup harness: builds the bar, switches states and width.
   window.mk.set(stateId, "desktop" | "phone") is also used to render canvas frames. */
(function () {
  var frame = document.querySelector('.mk-frame');

  // Shells: a state with data-shell="name" is wrapped in <template id="shell-name">; its content moves
  // into the template's [data-slot]. data-nav="key" marks the matching [data-nav-key] link as current.
  Array.prototype.forEach.call(frame.querySelectorAll('[data-state][data-shell]'), function (sec) {
    var t = document.getElementById('shell-' + sec.dataset.shell);
    if (!t) return;
    var shell = t.content.firstElementChild.cloneNode(true);
    var slot = shell.querySelector('[data-slot]');
    while (sec.firstChild) slot.appendChild(sec.firstChild);
    slot.removeAttribute('data-slot');
    if (sec.dataset.nav) Array.prototype.forEach.call(shell.querySelectorAll('[data-nav-key="' + sec.dataset.nav + '"]'), function (a) { a.setAttribute('aria-current', 'page'); });
    sec.appendChild(shell);
  });
  // Burger menu in the shell (below 1000px)
  Array.prototype.forEach.call(frame.querySelectorAll('[data-menu-toggle]'), function (btn) {
    var menu = btn.closest('.appShell').querySelector('.mobileMenu');
    if (!menu) return;
    btn.addEventListener('click', function () {
      var open = menu.hidden; menu.hidden = !open;
      btn.setAttribute('aria-expanded', String(open));
      btn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      btn.querySelector('use').setAttribute('href', open ? '#i-close' : '#i-menu');
    });
  });
  // The gamer's shell links, written once here so every page gets them: the sidebar (and burger menu)
  // Dashboard, Browse coaches and My sessions, and the logo. Only on shells where snapking is logged in: they open
  // snapking's pages, so other people's shells (Kairo's coach views) keep their links inert until their pages exist.
  var NAV = { dashboard: '09#busy', browse: '01#results', sessions: '10#list' };
  Array.prototype.forEach.call(frame.querySelectorAll('.appShell'), function (shell) {
    var user = shell.querySelector('.topNavUser'), logo = shell.querySelector('.topNavLogo');
    if (!user || !/^snapking,/.test(user.getAttribute('aria-label') || '')) return;
    Array.prototype.forEach.call(shell.querySelectorAll('[data-nav-key]'), function (a) {
      if (!a.dataset.link && NAV[a.dataset.navKey]) a.dataset.link = NAV[a.dataset.navKey];
    });
    if (logo && !logo.dataset.link) logo.dataset.link = NAV.dashboard;
  });
  // Links between mockup pages: data-link="07#gamer-after" opens that page's published mockup at that
  // state (in a new tab); a link to a state on this same page just switches to it.
  var PAGES = {
    "01": "https://claude.ai/artifact/S2LvRXMYBbk7uq3xjGTfcC", "02": "https://claude.ai/artifact/GUw5NpQEWds2tvVRkCVH2Y",
    "03": "https://claude.ai/artifact/DoTXw1NFPY7nMf64rrNVV9", "04": "https://claude.ai/artifact/EFj1Br4ak4Xnd7935vocsw",
    "05": "https://claude.ai/artifact/HSpMwJ9o7dDJAEYaDy6wUa", "06": "https://claude.ai/artifact/SrzfjqhYzD4E93omQNB7R3",
    "07": "https://claude.ai/artifact/FLFRVmLwDCbUqCB4p4vbZM", "08": "https://claude.ai/artifact/LB4gwSiruwp8qDVRLS27Nt",
    "09": "https://claude.ai/artifact/Qcz63mYRxQufNaf8wUr1fM", "10": "https://claude.ai/artifact/RA5wuSQuWSaw8hcPfsJpet",
    "11": "https://claude.ai/artifact/QkABonvTk67WnzxPHH1rrC", "12": "https://claude.ai/artifact/MmPhavSEmaQbDFcxNtvcG4",
    "13": "https://claude.ai/artifact/HoUgKYU9pkBwvGxiaCCDZh", "14": "https://claude.ai/artifact/KFSLVdswwSLN2HGsMyn8ed",
    "15": "https://claude.ai/artifact/G9xYuLRFwRgfjnnBu7A1Y4", "16": "https://claude.ai/artifact/Ma6d46PmT2aacA6483XTeG"
  };
  var self = (frame.dataset.page || '').slice(0, 2);
  Array.prototype.forEach.call(frame.querySelectorAll('[data-link]'), function (a) {
    var parts = a.dataset.link.split('#'), pg = parts[0], st = parts[1] || '';
    if (pg === self) {
      a.addEventListener('click', function (e) { e.preventDefault(); window.mk.set(st); window.scrollTo(0, 0); });
    } else if (PAGES[pg]) { a.href = PAGES[pg] + (st ? '#' + st : ''); a.target = '_blank'; a.rel = 'noopener'; }
  });
  var sections = Array.prototype.slice.call(frame.querySelectorAll('[data-state]'));
  var allowAll = frame.hasAttribute('data-all-states');
  var states = sections.map(function (s) { return { id: s.dataset.state, label: s.dataset.label || s.dataset.state }; });
  if (allowAll) states.unshift({ id: 'all', label: 'All' });

  var bar = document.createElement('div');
  bar.className = 'mk-bar';
  bar.innerHTML =
    '<div class="mk-name">' + (frame.dataset.page || document.title) + ' <span>Mockup</span></div>' +
    '<label class="mk-group"><span>State</span><select class="mk-select" id="mk-state">' +
    states.map(function (s) { return '<option value="' + s.id + '">' + s.label + '</option>'; }).join('') +
    '</select></label>' +
    '<div class="mk-group"><span>Width</span><div class="mk-seg" role="group" aria-label="Width">' +
    '<button type="button" data-w="desktop">Desktop</button><button type="button" data-w="phone">Phone</button></div></div>';
  var stage = document.querySelector('.mk-stage');
  stage.parentNode.insertBefore(bar, stage);

  var select = bar.querySelector('#mk-state');
  var segs = Array.prototype.slice.call(bar.querySelectorAll('[data-w]'));
  var current = { state: states[0].id, width: 'desktop' };

  function set(state, width) {
    if (state && states.some(function (s) { return s.id === state; })) current.state = state;
    if (width === 'desktop' || width === 'phone') current.width = width;
    sections.forEach(function (s) { s.hidden = !(current.state === 'all' || s.dataset.state === current.state); });
    frame.dataset.width = current.width;
    select.value = current.state;
    segs.forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.w === current.width)); });
    try { history.replaceState(null, '', '#' + current.state + (current.width === 'phone' ? '-phone' : '')); } catch (e) {}
    document.dispatchEvent(new CustomEvent('mk:change', { detail: current }));
  }
  select.addEventListener('change', function () { set(select.value); });
  segs.forEach(function (b) { b.addEventListener('click', function () { set(null, b.dataset.w); }); });

  var h = (location.hash || '').slice(1), w = 'desktop';
  if (/-phone$/.test(h)) { w = 'phone'; h = h.replace(/-phone$/, ''); }
  set(h || states[0].id, w);
  window.mk = { set: set, states: states, current: current };
})();
