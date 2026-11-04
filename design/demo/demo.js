/* Harbourly demo harness. Generated demo pages (design/demo/NN-*.html, made by design/tools/demo.mjs)
   load this instead of mockup.js. It keeps window.mk.set(state) working for the pages' own scripts, and adds:
   - links between pages open in the same tab (NN-name.html#state), so the demo behaves like one app;
   - a demo session (logged in as snapking or logged out, came from a booking, terms pending) kept across pages;
   - short timed steps for in-between states (Logging in, Confirming your payment, Waiting for Kairo);
   - wiring for the controls the single-page mockups left inert (WIRES below);
   - the floating Demo panel: jump to any screen and state, phone width, show clickable areas.
   Not part of the product. */
(function () {
  'use strict';
  var START = 'index.html';
  var FILES = {
    '01': '01-browse-coaches.html', '02': '02-coach-profile.html', '03': '03-pick-a-slot.html',
    '04': '04-checkout-summary.html', '05': '05-payment-return.html', '06': '06-session-detail.html',
    '07': '07-report-a-problem.html', '08': '08-live-session.html', '09': '09-gamer-dashboard.html',
    '10': '10-my-sessions.html', '11': '11-sign-up.html', '12': '12-verify-your-email.html',
    '13': '13-finish-setting-up.html', '14': '14-log-in.html', '15': '15-forgot-and-reset-password.html',
    '16': '16-accept-updated-terms.html'
  };
  var NAMES = {
    '01': 'Browse coaches', '02': 'Coach profile', '03': 'Pick a slot', '04': 'Checkout summary',
    '05': 'Payment return', '06': 'Session detail', '07': 'Report a problem', '08': 'Live session',
    '09': 'Gamer dashboard', '10': 'My sessions', '11': 'Sign up', '12': 'Verify your email',
    '13': 'Finish setting up', '14': 'Log in', '15': 'Forgot and reset password', '16': 'Accept updated terms'
  };
  var PHASES = [
    ['Phase 1 · Find and book a coach', ['01', '02', '03', '04', '05']],
    ['Phase 2 · The session and after', ['06', '07', '08']],
    ['Phase 3 · Gamer home', ['09', '10']],
    ['Phase 4 · Sign up, log in, account access', ['11', '12', '13', '14', '15', '16']]
  ];
  // Coach-side views inside the gamer pages: Phase 5 and later, left out of this demo.
  var HIDDEN = {
    '02': ['own', 'preview'],
    '06': ['coach-upcoming', 'coach-cancel', 'coach-request-received', 'coach-pending', 'coach-completed', 'coach-dispute'],
    '07': ['coach-after', 'coach-payment', 'respond', 'response-sent'],
    '08': ['coach-waiting', 'coach-ended']
  };
  // Pages with a logged-out version, and the state that shows it.
  var GUEST = { '01': 'guest', '02': 'guest', '03': 'guest' };

  var MSG = {
    coach: 'Becoming a coach is Phase 5, so it isn’t in this demo yet.',
    account: 'Account settings aren’t designed yet, so they aren’t in this demo.',
    week: 'Only this week is designed, so the demo stays on it.',
    file: 'Choosing files isn’t simulated in the demo.',
    terms: 'This opens the full Terms of Service or Privacy Policy.',
    reviews: 'In the app this loads more reviews.',
    other: 'This link isn’t part of the demo.',
    kairoProfile: 'Demo: only Kairo, Vexa and nullpoint have profile designs, so this opens Kairo’s.',
    kairoBooking: 'Demo: the next step is designed with Kairo’s booking, so it continues there.',
    kairoSlots: 'Demo: the time picker is designed with Kairo’s times.'
  };

  /* ---------- Demo session, kept across pages (sessionStorage, with window.name as the fallback) ---------- */
  var KEY = 'hbDemo';
  function load() {
    var raw = null;
    try { raw = sessionStorage.getItem(KEY); } catch (e) {}
    if (!raw && typeof window.name === 'string' && window.name.indexOf(KEY + ':') === 0) raw = window.name.slice(KEY.length + 1);
    try { return JSON.parse(raw) || {}; } catch (e) { return {}; }
  }
  var S = load();
  function save() {
    var raw = JSON.stringify(S);
    try { sessionStorage.setItem(KEY, raw); } catch (e) {}
    try { window.name = KEY + ':' + raw; } catch (e) {}
  }

  var frame = document.querySelector('.mk-frame');
  if (!frame) return;
  var self = (frame.dataset.page || '').slice(0, 2);

  /* ---------- Shells (as in mockup.js) ---------- */
  (HIDDEN[self] || []).forEach(function (id) {
    var sec = frame.querySelector('[data-state="' + id + '"]');
    if (sec) sec.parentNode.removeChild(sec);
  });
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
  var NAV = { dashboard: '09#busy', browse: '01#results', sessions: '10#list' };
  Array.prototype.forEach.call(frame.querySelectorAll('.appShell'), function (shell) {
    var user = shell.querySelector('.topNavUser'), logo = shell.querySelector('.topNavLogo');
    if (!user || !/^snapking,/.test(user.getAttribute('aria-label') || '')) return;
    Array.prototype.forEach.call(shell.querySelectorAll('[data-nav-key]'), function (a) {
      if (!a.dataset.link && NAV[a.dataset.navKey]) a.dataset.link = NAV[a.dataset.navKey];
    });
    if (logo && !logo.dataset.link) logo.dataset.link = NAV.dashboard;
  });

  var sections = Array.prototype.slice.call(frame.querySelectorAll('[data-state]'));
  var states = sections.map(function (s) { return { id: s.dataset.state, label: s.dataset.label || s.dataset.state }; });
  function sectionOf(id) { for (var i = 0; i < sections.length; i++) if (sections[i].dataset.state === id) return sections[i]; return null; }

  /* ---------- Wiring for controls the mockups left inert ---------- */
  function labelOf(el) { return (el.getAttribute('aria-label') || el.textContent || '').replace(/\s+/g, ' ').trim(); }
  function chain(target, ms, note) { return { to: target, ms: ms, note: note }; }
  var COACH = { 'kairo.gg': '02#verified', 'vexa': '02#one-game', 'nullpoint': '02#new-coach' };
  var bookFrom02 = function (el, sec) {
    var st = sec.dataset.state;
    if (st === 'one-game') return '03#none';
    if (st === 'new-coach') return { to: '03#available', note: MSG.kairoSlots };
    return '03#available';
  };
  var loginDone = function (el) { var l = el.dataset.link; return l && /^(09|03)#/.test(l) ? '14#loading>' + l : null; };
  var finishDone = function (el) { var l = el.dataset.link; return l && /^(09|03)#/.test(l) ? '13#submitting>' + l : null; };

  // Each rule: s = states ('*' or omitted for all), t = label (string or RegExp), sel = selector,
  // to = target (string, array by order, or function), note = toast on arrival, force = replace an existing link.
  var WIRES = {
    '*': [
      { sel: '.sidebarBecome', to: '@toast:' + MSG.coach },
      { sel: '.topNavUser, .mobileMenuUser', to: '@toast:' + MSG.account, force: true },
      { t: /^sign out$/i, to: '@signout' },
      { t: /^(Harbourly home|Back to home|Go to the home page)$/, to: '@start', force: true }
    ],
    '01': [
      { sel: '.coachCard', to: function (el) {
        var m = el.textContent.match(/@([\w.]+)/), h = m ? m[1] : '';
        return COACH[h] ? COACH[h] : { to: '02#verified', note: MSG.kairoProfile };
      } },
      { s: ['results', 'filtered'], t: 'Load more coaches', to: { to: '01#more', then: chain('01#results', 1400, 'That’s every coach in this demo.') } },
      { s: 'guest', t: 'Load more coaches', to: '@toast:That’s every coach in this demo.' },
      { t: /^(Clear filters|Show all prices)$/, to: '01#results' },
      { s: 'error', t: 'Try again', to: { to: '01#loading', then: chain('01#results', 900) } }
    ],
    '02': [
      { t: 'Browse coaches', to: '01#results' },
      { t: /^(Book a session|Choose a time|See all times)$/, to: bookFrom02 },
      { t: 'Show more reviews', to: '@toast:' + MSG.reviews }
    ],
    '03': [
      { t: 'Kairo’s profile', to: '02#verified' },
      { t: "Kairo's profile", to: '02#verified' },
      { t: /^Vexa.s profile$/, to: '02#one-game' },
      { t: /^(Next week|Previous week|Go to next week)$/, to: '@toast:' + MSG.week },
      { t: /^(Continue to checkout|Verify and continue)$/, to: '04#different-currency' }
    ],
    '04': [
      { t: 'Continue to payment', to: { to: '05#confirming', note: 'Demo: the Stripe or Xendit payment page would open before this screen.', then: chain('05#confirmed', 2600) } },
      { t: 'Choose another time', to: '03#available' }
    ],
    '05': [
      { s: 'failed', t: 'Try again', to: '04#failed' }
    ],
    '06': [
      { s: 'join', t: 'Join session', force: true, to: { to: '08#waiting', then: chain('08#live', 3500, 'Kairo joined the call.') } },
      { s: 'reschedule-keep-or-cancel', t: 'Cancel booking', to: '06#cancelled' },
      { s: ['moved', 'kairo-tue'], t: 'Cancel booking', to: '06#cancel-confirm' },
      { s: 'kairo-tue', t: 'Request a new time', to: '06#reschedule-form' },
      { s: 'vexa-request', t: 'Move to this time', to: { to: '06#moved', note: MSG.kairoBooking } },
      { s: 'vexa-request', t: 'Decline', to: { to: '06#reschedule-keep-or-cancel', note: MSG.kairoBooking } },
      { s: 'mirae-confirm', t: 'Confirm session', to: { to: '06#completed-review', note: MSG.kairoBooking } },
      { t: /^View (Mirae|Ghostline).s profile$/, to: { to: '02#verified', note: MSG.kairoProfile } },
      { s: 'ghostline-review', t: 'Report a problem', to: '07#gamer-payment' },
      { t: /^(Next week|Previous week)$/, to: '@toast:' + MSG.week },
      { s: 'error', t: 'Try again', to: { to: '06#loading', then: chain('06#upcoming', 900) } }
    ],
    '07': [
      { s: 'mirae-after', t: 'Send report', to: '07#submitted' },
      { s: 'gamer-noshow', t: /^(Back to session|Keep waiting)$/, force: true, to: '08#no-show' },
      { s: ['gamer-after', 'mirae-after', 'gamer-payment', 'validation', 'upload-error', 'gamer-respond'], t: 'Back to session', force: true, to: function (el) { return '@trail:06|' + (el.dataset.link || '06#pending'); } },
      { t: /^Remove /, to: '@remove' },
      { t: /^(Add file|Add screenshots or PDFs)/, to: '@toast:' + MSG.file }
    ],
    '08': [
      { s: 'end-confirm', t: 'End session', force: true, to: { to: '08#end-sent', then: chain('08#ended', 3500, 'Kairo agreed to end the session.') } },
      { s: 'blocked', t: 'Try again', to: '08#live' }
    ],
    '09': [
      { s: 'reported', t: 'Leave a review', to: { to: '06#completed-review', note: MSG.kairoBooking } },
      { s: 'reported', t: 'View all', to: '09#todo-all' },
      { s: 'reported', t: 'View session', to: ['06#kairo-tue', '06#upcoming'] },
      { s: 'reported', sel: '.sessionRow', to: { to: '06#expired', note: MSG.kairoBooking } }
    ],
    '11': [
      { t: 'Create account', force: true, to: { to: '11#loading', then: chain('12#sent', 1500) } }
    ],
    '12': [],
    '13': [
      { t: /^(Terms of Service|Privacy Policy)$/, to: '@toast:' + MSG.terms },
      { s: ['phone', 'wrong-code'], t: 'Finish setting up', to: '13#missing' },
      { t: 'Change', to: '13#form' },
      { s: 'username-taken', t: 'Finish setting up', to: { to: '13#submitting', then: chain('09#new', 1500) } },
      { t: 'Finish setting up', force: true, to: function (el) { var l = el.dataset.link; return l && /^(09|03)#/.test(l) ? { to: '13#submitting', then: chain(l, 1500) } : null; } }
    ],
    '14': [
      { t: /^(Log in|Continue with Google)$/, force: true, to: function (el) {
        var l = el.dataset.link; if (!l || !/^(09|03)#/.test(l)) return null;
        return el.classList.contains('button') && labelOf(el) === 'Log in' ? { to: '14#loading', then: chain(l, 1300) } : l;
      } }
    ],
    '15': [],
    '16': [
      { t: 'Read the full Terms of Service', to: '@toast:' + MSG.terms },
      { t: 'Accept and continue', force: true, to: '@after' }
    ]
  };
  var TARGETS = []; // element -> target objects, by index in data-demo-to
  function wire(rule) {
    var want = rule.s ? [].concat(rule.s) : null;
    sections.forEach(function (sec) {
      if (want && want.indexOf(sec.dataset.state) < 0) return;
      var els = Array.prototype.slice.call(sec.querySelectorAll(rule.sel || 'a, button'));
      if (rule.t) els = els.filter(function (el) { var l = labelOf(el); return typeof rule.t === 'string' ? l === rule.t : rule.t.test(l); });
      if (!rule.force) els = els.filter(function (el) { return !el.dataset.link && !el.dataset.go && !el.hasAttribute('data-demo-to'); });
      els.forEach(function (el, i) {
        var to = typeof rule.to === 'function' ? rule.to(el, sec) : Array.isArray(rule.to) ? rule.to[i] : rule.to;
        if (!to) return;
        TARGETS.push(typeof to === 'string' ? { to: to } : to);
        el.setAttribute('data-demo-to', String(TARGETS.length - 1));
      });
    });
  }
  (WIRES['*'] || []).concat(WIRES[self] || []).forEach(wire);

  /* ---------- Routing ---------- */
  function authOf(sec) {
    var sh = sec ? sec.dataset.shell || '' : '';
    if (sh === 'guest' || sh === 'split' || sh === 'bare') return 'out';
    if (sh === 'gate') return self === '16' ? null : 'out';
    return 'in';
  }
  function split(t) { var p = t.split('#'); return { pg: p[0], st: p[1] || '' }; }
  // Adjust a destination for the demo session: logged out or in, came from a booking, terms to accept.
  function resolve(t) {
    var r = split(t), pg = r.pg, st = r.st;
    var finishing = (self === '13' || self === '14' || self === '16') && +pg <= 10;
    if (finishing) {
      S.auth = 'in';
      if (S.booking && pg === '09') { pg = '03'; st = 'returning'; }
      if (self === '14' && S.terms) { S.after = pg + '#' + st; pg = '16'; st = 'terms'; }
    }
    if (GUEST[pg]) {
      if (S.auth === 'out' && st !== GUEST[pg]) st = GUEST[pg];
      else if (S.auth !== 'out' && st === GUEST[pg]) st = pg === '03' ? (S.booking ? 'returning' : 'available') : pg === '01' ? 'results' : 'verified';
    }
    if (S.booking && (pg === '11' || pg === '14') && st === 'form') st = 'booking';
    if (S.booking && pg === '13' && (st === 'form' || st === 'google')) st = 'booking';
    return pg + '#' + st;
  }
  // The screen visited just before this page, if it was on page pg (so Back returns to where you came from).
  function trail(pg) {
    var t = S.trail || [];
    for (var i = t.length - 1; i >= 0; i--) if (t[i].slice(0, 2) !== self) return t[i].slice(0, 2) === pg ? t[i] : null;
    return null;
  }
  function open(t, opts) {
    opts = opts || {};
    var r = split(t);
    if (opts.note) S.toast = opts.note;
    S.then = opts.then ? { at: t, to: opts.then.to, ms: opts.then.ms, note: opts.then.note } : null;
    save();
    if (r.pg === self) { set(r.st, null, { push: true }); window.scrollTo(0, 0); showToast(); }
    else if (FILES[r.pg]) location.href = FILES[r.pg] + (r.st ? '#' + r.st : '');
  }
  function go(spec) {
    var to = spec.to;
    if (to === '@start') { S.booking = false; S.then = null; save(); location.href = START; return; }
    if (to === '@signout') { S.auth = 'out'; S.booking = false; S.terms = false; S.then = null; S.toast = 'You’re signed out.'; save(); location.href = START; return; }
    if (to === '@remove') return;
    if (to.indexOf('@toast:') === 0) { toast(to.slice(7)); return; }
    if (to === '@after') { to = S.after || '09#busy'; S.after = null; S.terms = false; S.auth = 'in'; }
    if (to.indexOf('@trail:') === 0) { var p = to.slice(7).split('|'); to = trail(p[0]) || p[1]; }
    open(resolve(to), { note: spec.note, then: spec.then });
  }

  /* ---------- State switching ---------- */
  var current = { state: states.length ? states[0].id : '', width: S.phone ? 'phone' : 'desktop' };
  var timer = null;
  function set(state, width, opts) {
    opts = opts || {};
    var prev = current.state;
    if (state && sectionOf(state)) current.state = state;
    if (width === 'desktop' || width === 'phone') current.width = width;
    sections.forEach(function (s) { s.hidden = s.dataset.state !== current.state; });
    frame.dataset.width = current.width;
    var key = self + '#' + current.state, sec = sectionOf(current.state);
    // The demo session follows what's on screen.
    if (!S.then || S.then.at !== key) {
      var a = authOf(sec); if (a) S.auth = a;
      if (current.state === 'booking' && /^1[134]$/.test(self)) S.booking = true;
      if ((self === '03' && S.auth === 'in') || self === '09' || ((self === '11' || self === '14') && current.state === 'form')) S.booking = false;
    }
    S.trail = (S.trail || []).filter(function (k) { return k !== key; }).concat(key).slice(-12);
    try {
      if (opts.push && prev !== current.state) history.pushState(null, '', '#' + current.state);
      else history.replaceState(null, '', '#' + current.state);
    } catch (e) {}
    clearTimeout(timer);
    if (S.then && S.then.at === key) {
      var next = S.then;
      timer = setTimeout(function () { S.then = null; open(resolve(next.to), { note: next.note }); }, next.ms);
    } else S.then = null;
    save();
    syncPanel();
    document.dispatchEvent(new CustomEvent('mk:change', { detail: current }));
  }
  window.mk = { set: function (st, w) { set(st, w, { push: true }); }, states: states, current: current };

  /* ---------- Clicks ---------- */
  window.addEventListener('click', function (e) {
    var el = e.target.closest && e.target.closest('[data-demo-to], [data-link], a[href="#"]');
    if (!el || !frame.contains(el)) return;
    if (el.disabled || el.getAttribute('aria-disabled') === 'true') return;
    if (el.closest('[data-preview-inert]')) return;
    if (el.hasAttribute('data-demo-to')) {
      e.preventDefault(); e.stopPropagation();
      var spec = TARGETS[+el.getAttribute('data-demo-to')];
      if (spec.to === '@remove') { var row = el.closest('li'); if (row) row.parentNode.removeChild(row); return; }
      go(spec);
    } else if (el.dataset.link) {
      e.preventDefault(); e.stopPropagation();
      go({ to: el.dataset.link });
    } else if (el.tagName === 'A') {
      e.preventDefault();
      if (!el.dataset.go && !el.hasAttribute('data-audio')) toast(MSG.other);
    }
  }, true);
  // Browse filters: changing the game or price shows the filtered results (Counter-Strike 2 has no coaches yet).
  frame.addEventListener('change', function (e) {
    var sel = e.target;
    if (self === '01' && sel.tagName === 'SELECT' && /-(game|price)$/.test(sel.id)) {
      var sec = sel.closest('[data-state]');
      if (sec.dataset.state === 'guest') return;
      var game = sec.querySelector('select[id$="-game"]').value, price = sec.querySelector('select[id$="-price"]').value;
      var to = game === 'Counter-Strike 2' ? '01#empty' : (game === 'All games' && price === 'Any price') ? '01#results' : '01#filtered';
      go({ to: '01#loading', then: chain(to, 800) });
    }
    if (self === '13' && sel.type === 'radio' && sel.value === 'coach' && sel.checked) {
      toast('The coach application is Phase 5, so it isn’t in this demo. You’ll carry on as a gamer.');
    }
  });
  window.addEventListener('popstate', function () {
    var h = (location.hash || '').slice(1);
    if (h && sectionOf(h)) set(h);
  });

  /* ---------- Toast ---------- */
  var toastEl = document.createElement('div');
  toastEl.className = 'dm-toast'; toastEl.setAttribute('role', 'status'); toastEl.hidden = true;
  document.body.appendChild(toastEl);
  var toastTimer = null;
  function toast(msg) {
    toastEl.textContent = msg; toastEl.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.hidden = true; }, Math.max(3200, msg.length * 55));
  }
  function showToast() { if (S.toast) { var m = S.toast; S.toast = null; save(); toast(m); } }

  /* ---------- Demo panel ---------- */
  var fab = document.createElement('button');
  fab.type = 'button'; fab.className = 'dm-fab'; fab.setAttribute('aria-expanded', 'false'); fab.setAttribute('aria-controls', 'dm-panel');
  fab.innerHTML = '<span class="dm-fabDot" aria-hidden="true"></span>Demo';
  var panel = document.createElement('div');
  panel.className = 'dm-panel'; panel.id = 'dm-panel'; panel.hidden = true;
  panel.setAttribute('role', 'dialog'); panel.setAttribute('aria-label', 'Demo controls');
  var pageOpts = PHASES.map(function (ph) {
    return '<optgroup label="' + ph[0] + '">' + ph[1].map(function (p) {
      return '<option value="' + p + '"' + (p === self ? ' selected' : '') + '>' + p + ' ' + NAMES[p] + '</option>';
    }).join('') + '</optgroup>';
  }).join('');
  panel.innerHTML =
    '<div class="dm-head"><div><div class="dm-eyebrow">Harbourly demo</div><div class="dm-who" id="dm-who"></div></div>' +
    '<button type="button" class="dm-close" aria-label="Close demo controls"><svg class="icon" aria-hidden="true"><use href="#i-close"/></svg></button></div>' +
    '<label class="dm-field"><span>Screen</span><select id="dm-page">' + pageOpts + '</select></label>' +
    '<label class="dm-field"><span>State</span><select id="dm-state">' + states.map(function (s) { return '<option value="' + s.id + '">' + s.label + '</option>'; }).join('') + '</select></label>' +
    '<div class="dm-field"><span>Width</span><div class="dm-seg" role="group" aria-label="Width"><button type="button" data-w="desktop">Fit window</button><button type="button" data-w="phone">Phone</button></div></div>' +
    '<label class="dm-check"><input type="checkbox" id="dm-hot"> Show clickable areas</label>' +
    '<div class="dm-foot"><a href="' + START + '" class="dm-link" data-dm-start>Start screen</a><span>' + self + ' · ' + (NAMES[self] || '') + '</span></div>';
  document.body.appendChild(fab); document.body.appendChild(panel);
  var pageSel = panel.querySelector('#dm-page'), stateSel = panel.querySelector('#dm-state'), hot = panel.querySelector('#dm-hot');
  var segs = Array.prototype.slice.call(panel.querySelectorAll('[data-w]'));
  function togglePanel(open) {
    panel.hidden = !open; fab.setAttribute('aria-expanded', String(open));
    S.panel = open; save();
    if (open) stateSel.focus();
  }
  fab.addEventListener('click', function () { togglePanel(panel.hidden); });
  panel.querySelector('.dm-close').addEventListener('click', function () { togglePanel(false); fab.focus(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !panel.hidden) { togglePanel(false); fab.focus(); } });
  // Jumps from the panel show exactly the chosen state; the session follows it.
  pageSel.addEventListener('change', function () {
    S.then = null; S.booking = false; save();
    location.href = FILES[pageSel.value];
  });
  stateSel.addEventListener('change', function () {
    S.then = null; S.booking = stateSel.value === 'booking' || stateSel.value === 'returning'; save();
    set(stateSel.value, null, { push: true }); window.scrollTo(0, 0);
  });
  segs.forEach(function (b) { b.addEventListener('click', function () { S.phone = b.dataset.w === 'phone'; set(null, b.dataset.w); }); });
  hot.addEventListener('change', function () { S.hot = hot.checked; save(); document.body.classList.toggle('dm-hot', hot.checked); });
  panel.querySelector('[data-dm-start]').addEventListener('click', function () { S.then = null; save(); });
  function syncPanel() {
    stateSel.value = current.state;
    segs.forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.w === current.width)); });
    var who = panel.querySelector('#dm-who');
    who.textContent = S.auth === 'out' ? 'Logged out' : 'Logged in as snapking';
  }
  hot.checked = !!S.hot; document.body.classList.toggle('dm-hot', !!S.hot);

  /* ---------- Hook for the presenter walkthrough (tour.js) ---------- */
  window.hbDemo = {
    S: S, save: save, self: self, toast: toast, togglePanel: togglePanel,
    key: function () { return self + '#' + current.state; },
    // Open exactly this screen and state (no adjustments), as the Demo panel does.
    jump: function (t, o) {
      o = o || {};
      var r = split(t);
      S.then = null; S.booking = !!o.booking;
      if (o.auth) S.auth = o.auth;
      save();
      if (r.pg === self) { set(r.st, null, { push: true }); window.scrollTo(0, 0); }
      else if (FILES[r.pg]) location.href = FILES[r.pg] + '#' + r.st;
    }
  };

  /* ---------- Boot ---------- */
  var h = (location.hash || '').slice(1).replace(/-phone$/, '');
  set(sectionOf(h) ? h : current.state, current.width, { boot: true });
  if (S.panel) togglePanel(true);
  showToast();
})();
