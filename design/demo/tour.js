/* Harbourly presenter walkthrough: a fixed 20-minute route through the demo.
   - Data: CHAPTERS and STEPS below (also read by guide.html to print the talk track).
   - On demo pages, while a walkthrough is running: a small bar (Back, Next, chapter, clock, Notes),
     a ring on the next thing to click, and the talking points when Notes is on.
   - Next clicks the highlighted control, so timed steps and the demo session behave exactly as in the demo.
     Clicking it yourself works too; the bar follows wherever the route goes.
   Keys: → or Page Down = Next, ← or Page Up = Back, N = notes, S = skip to the next chapter, H = hide the bar.
   Not part of the product. */
(function () {
  'use strict';
  var WT = 'walkthrough.html';
  var FILES = {
    '01': '01-browse-coaches.html', '02': '02-coach-profile.html', '03': '03-pick-a-slot.html',
    '04': '04-checkout-summary.html', '05': '05-payment-return.html', '06': '06-session-detail.html',
    '07': '07-report-a-problem.html', '08': '08-live-session.html', '09': '09-gamer-dashboard.html',
    '10': '10-my-sessions.html', '11': '11-sign-up.html', '12': '12-verify-your-email.html',
    '13': '13-finish-setting-up.html', '14': '14-log-in.html', '15': '15-forgot-and-reset-password.html',
    '16': '16-accept-updated-terms.html'
  };

  var CHAPTERS = [
    { title: 'Welcome', goal: 'Set the scene in a minute and a half.' },
    { title: 'Find a coach', goal: 'Browsing is open to everyone, and profiles build trust.' },
    { title: 'Sign up without losing your place', goal: 'Signing up mid-booking brings you straight back to your time.' },
    { title: 'Check out and pay', goal: 'The payment is held, and every amount is shown before you pay.' },
    { title: 'Your dashboard and bookings', goal: 'Home shows only what needs you; changes show exact deadlines and refunds.' },
    { title: 'The session', goal: 'The session happens in Harbourly, then you confirm and review.' },
    { title: 'When something goes wrong', goal: 'Problems have a clear process, and the money waits for it.' },
    { title: 'Wrap up and questions', goal: 'Recap, what’s next, and get their reactions.' }
  ];

  // key: screen#state the step is on. t: planned seconds. click: what Next clicks (label t, selector sel, text has).
  // do: the click, in words. say: talking points. auth/booking: set when Back or Skip opens this step directly.
  var STEPS = [
    { key: 'wt#intro', ch: 0, t: 90, screen: 'Welcome', do: 'Next opens Browse coaches, logged out.', auth: 'out', say: [
      'Quick context: Harbourly is a coaching marketplace for gamers in Southeast Asia. You book a one-hour, 1-on-1 session with an identity-checked coach.',
      'The big idea is trust. Your money is held until you confirm the session actually happened.',
      'I’ll click through the gamer side as a brand-new user: 16 screens from the first four design phases.',
      'The coach side is what I’m designing now, so it isn’t in here yet.',
      'This is a clickable design, not the live app. Jump in with quick questions any time; I’ve kept a few minutes at the end.'
    ] },

    { key: '01#guest', ch: 1, t: 50, screen: '01 Browse coaches · logged out', click: { sel: '.coachCard', has: '@kairo.gg' }, do: 'Open Kairo’s card.', auth: 'out', say: [
      'I’m a visitor, not logged in. Anyone can browse without an account.',
      'Filter by game and max price, and sort by price, rating or most reviewed.',
      'Prices show in my currency, Singapore dollars. The ≈ means it’s converted from the coach’s own currency.',
      'Newer coaches carry a New Coach label until they’ve built a track record.'
    ] },
    { key: '02#guest', ch: 1, t: 70, screen: '02 Coach profile · Kairo', click: { t: 'Book a session' }, do: 'Book a session.', auth: 'out', say: [
      'This is Kairo’s profile: 4.9 from 57 reviews, languages and time zone right at the top.',
      'Rank and credentials for each game, a showcase of screenshots, and a 45-second voice intro so you can hear who you’d be talking to.',
      'Kairo charges in pesos, ₱1,850, shown to me as about S$43.'
    ] },
    { key: '03#guest', ch: 1, t: 60, screen: '03 Pick a slot · logged out', click: { sel: '[data-link="11#booking"]' }, do: 'Sign up, in the booking panel (not the top bar).', auth: 'out', say: [
      'Pick a game, then a one-hour time. Times are in my time zone, and I can book up to 4 weeks ahead.',
      'Only now do I need an account, and the panel says so. Let’s sign up.'
    ] },

    { key: '11#booking', ch: 2, t: 35, screen: '11 Sign up · from a booking', click: { t: 'Create account' }, do: 'Create account.', auth: 'out', booking: true, say: [
      'Sign-up remembers what I was booking: Kairo, Mobile Legends, Wed 7 Oct at 20:00.',
      'Email and password, or Google. Kept short on purpose.'
    ] },
    { key: '12#sent', ch: 2, t: 25, screen: '12 Verify your email', click: { t: 'open the link in the email' }, do: 'Open the link in the email (the dashed demo shortcut).', auth: 'out', booking: true, say: [
      'We check the email address first. The link lasts 24 hours, and there’s a resend timer.',
      'The dashed box is a demo shortcut that stands in for opening my inbox.'
    ] },
    { key: '12#verified', ch: 2, t: 10, screen: '12 Verify your email · verified', click: { t: 'Continue' }, do: 'Continue.', auth: 'out', booking: true, say: [
      'Email verified. One more step.'
    ] },
    { key: '13#booking', ch: 2, t: 50, screen: '13 Finish setting up', click: { t: 'Finish setting up' }, do: 'Finish setting up.', auth: 'out', booking: true, say: [
      'Details we ask once. My real name stays private; other people only see my username.',
      'Date of birth because Harbourly is 18 and over, and country because it sets my currency.',
      'My phone gets checked with a text code, so coaches and Harbourly can reach me about sessions.',
      'I could also say I want to coach. That leads into the coach side, which comes next phase.'
    ] },
    { key: '03#returning', ch: 2, t: 30, screen: '03 Pick a slot · back after signing up', click: { t: 'Continue to checkout' }, do: 'Continue to checkout.', auth: 'in', booking: true, say: [
      'And I’m straight back where I left off, with my time still chosen. No starting over.'
    ] },

    { key: '04#different-currency', ch: 3, t: 70, screen: '04 Checkout summary', click: { t: 'Continue to payment' }, do: 'Continue to payment.', auth: 'in', say: [
      'Checkout holds the time for 30 minutes while I pay. That’s the quiet countdown.',
      'This box explains the hold in plain words: I pay now, Harbourly holds it, and Kairo is paid only after I confirm. If I do nothing for 72 hours, it confirms itself.',
      'The breakdown: Kairo’s price plus a 6% platform fee, charged in pesos. ₱1,961 in total.',
      'And the cancellation rule is right here before I pay: a full refund up to an hour before.'
    ] },
    { key: '05#confirmed', ch: 3, t: 50, screen: '05 Payment return · confirmed', click: { t: 'Back to dashboard' }, do: 'Back to dashboard.', auth: 'in', say: [
      'Paying happens on a secure Stripe or Xendit page, which the demo skips. Then we land back here and check the payment went through.',
      'Booked. We both get an email, reminders go out 24 hours and 1 hour before, and Join opens 10 minutes before the start.'
    ] },

    { key: '09#busy', ch: 4, t: 50, screen: '09 Gamer dashboard · busy account', click: { sel: '.sidebar [data-nav-key="sessions"], .mobileMenu [data-nav-key="sessions"]' }, do: 'My sessions, in the sidebar.', auth: 'in', say: [
      'This is the gamer’s home. I’ve switched to a busier account so there’s something to see.',
      'To do only shows things waiting on me: finish paying for a held time, confirm a session that happened, answer Vexa’s request for a new time.',
      'Only one button is green, so it’s obvious what to do first.',
      'Coming up shows the next session. Its Join button switches on 10 minutes before.'
    ] },
    { key: '10#list', ch: 4, t: 20, screen: '10 My sessions', click: { sel: '.sessionRow', has: 'Wed 7 Oct' }, do: 'Open Kairo, Wed 7 Oct.', auth: 'in', say: [
      'My sessions is the full list, upcoming and past, each with a clear status.'
    ] },
    { key: '06#upcoming', ch: 4, t: 25, screen: '06 Session detail · upcoming', click: { t: 'Cancel booking' }, do: 'Cancel booking (you’ll keep it on the next screen).', auth: 'in', say: [
      'Every booking has one page with everything about it.',
      'Before the session I can request a new time or cancel, and the page gives me the exact deadlines.'
    ] },
    { key: '06#cancel-confirm', ch: 4, t: 30, screen: '06 Session detail · cancel', click: { t: 'Keep booking' }, do: 'Keep booking.', auth: 'in', say: [
      'Cancelling shows exactly what I get back before I commit: the full ₱1,961, because it’s more than an hour before.',
      'Inside the last hour, half Kairo’s price comes back instead. I’ll keep it.'
    ] },
    { key: '06#upcoming', ch: 4, t: 10, screen: '06 Session detail · upcoming', click: { t: 'Request a new time' }, do: 'Request a new time.', auth: 'in', say: [
      'Asking for a new time works the same way.'
    ] },
    { key: '06#reschedule-form', ch: 4, t: 45, screen: '06 Session detail · request a new time', do: 'Don’t send it. Next skips to session day.', auth: 'in', say: [
      'I offer up to 3 of Kairo’s free times, at least 24 hours away. Kairo picks one, or my original time stays.',
      'A booking can only be moved once, which keeps it fair for coaches. I won’t send this one.'
    ] },

    { key: '06#join', ch: 5, t: 30, screen: '06 Session detail · join open', click: { t: 'Join session' }, do: 'Join session.', auth: 'in', say: [
      'Let’s skip ahead to session day. It’s 8 minutes to the start.',
      'Join opens 10 minutes before. The time can’t move inside 24 hours, but I could still cancel, with half back.'
    ] },
    { key: '08#waiting', ch: 5, t: 15, screen: '08 Live session · waiting', do: 'Wait a few seconds for Kairo to join.', auth: 'in', say: [
      'Whoever’s in first gets a waiting room and can chat.',
      'If the coach still isn’t here 15 minutes after the start, I can report a no-show.'
    ] },
    { key: '08#live', ch: 5, t: 45, screen: '08 Live session · live', click: { t: 'End session' }, do: 'End session (bottom bar).', auth: 'in', say: [
      'The session runs inside Harbourly: a voice call, optional camera, and chat.',
      'Screen sharing works on computers, one person at a time. On a phone you can talk, chat and watch.',
      'The chat is saved with the session, which matters if there’s ever a dispute.',
      'Banners warn at 10, 5 and 1 minutes left.'
    ] },
    { key: '08#end-confirm', ch: 5, t: 15, screen: '08 Live session · end early', click: { t: 'End session' }, do: 'End session, then wait a moment for Kairo to agree.', auth: 'in', say: [
      'Ending early needs a confirm, and the other person has to agree.'
    ] },
    { key: '08#ended', ch: 5, t: 30, screen: '08 Live session · ended', click: { t: 'Confirm session' }, do: 'Confirm session.', auth: 'in', say: [
      'Now it’s pending confirmation. Kairo is paid when I confirm, or automatically after 72 hours.',
      'If something went wrong, Report a problem keeps the payment held.'
    ] },
    { key: '06#confirm-step', ch: 5, t: 20, screen: '06 Session detail · confirm', click: { t: 'Confirm session' }, do: 'Confirm session.', auth: 'in', say: [
      'One last check, because confirming releases the money to Kairo.'
    ] },
    { key: '06#completed-review', ch: 5, t: 35, screen: '06 Session detail · leave a review', click: { t: 'Post review' }, do: 'Post review.', auth: 'in', say: [
      'Kairo’s been paid. Now I can rate the session and write a short review, shown on Kairo’s profile with my username.'
    ] },
    { key: '06#review-posted', ch: 5, t: 20, screen: '06 Session detail · review posted', do: 'Next moves on to disputes.', auth: 'in', say: [
      'That’s the full loop: found a coach, booked, paid, had the session, confirmed and reviewed.'
    ] },

    { key: '09#reported', ch: 6, t: 25, screen: '09 Gamer dashboard · coach reported a problem', click: { t: 'Respond to Kairo’s report' }, do: 'Respond to Kairo’s report.', auth: 'in', say: [
      'Last bit: what happens when there’s a problem. Here, Kairo has reported that I didn’t show up.',
      'It goes to the top of my To do with a deadline, and the payment stays held.'
    ] },
    { key: '07#gamer-respond', ch: 6, t: 30, screen: '07 Report a problem · respond', click: { t: 'Send response' }, do: 'Send response.', auth: 'in', say: [
      'I see Kairo’s report and get one response, with evidence like screenshots.',
      'The team decides from both sides, the call’s join records and the session chat.'
    ] },
    { key: '07#gamer-response-sent', ch: 6, t: 20, screen: '07 Report a problem · response sent', click: { t: 'View session' }, do: 'View session.', auth: 'in', say: [
      'The outcomes are spelled out: half Kairo’s price back to me, a full refund, or the payment released to Kairo.'
    ] },
    { key: '06#reported-responded', ch: 6, t: 15, screen: '06 Session detail · under review', do: 'Next opens the wrap-up.', auth: 'in', say: [
      'The session page keeps the whole story in one place. Gamers report problems the same way, right after a session.'
    ] },

    { key: 'wt#wrap', ch: 7, t: 180, screen: 'Wrap up', do: 'Ask your questions, then take theirs.', say: [
      'So that’s the gamer side end to end: browse, book, pay, the session, confirm and review, and what happens when there’s a problem.',
      'Next up is the coach side: applying to coach, payout and profile setup, and the coach dashboard.',
      'Then ask the three questions on screen, and leave the rest of the time for theirs.'
    ] }
  ];
  var TRANSIT = ['11#loading', '13#submitting', '05#confirming', '08#end-sent', '14#loading', '01#loading'];
  var start = 0;
  STEPS.forEach(function (s) { s.mark = start; start += s.t; });
  var TOTAL = start;
  window.HB_TOUR = { chapters: CHAPTERS, steps: STEPS, total: TOTAL };
  if (document.documentElement.getAttribute('data-tour') === 'data') return;

  /* ---------- Session (shared with demo.js when it's on the page) ---------- */
  var D = window.hbDemo, KEY = 'hbDemo';
  function load() {
    var raw = null;
    try { raw = sessionStorage.getItem(KEY); } catch (e) {}
    if (!raw && typeof window.name === 'string' && window.name.indexOf(KEY + ':') === 0) raw = window.name.slice(KEY.length + 1);
    try { return JSON.parse(raw) || {}; } catch (e) { return {}; }
  }
  var S = D ? D.S : load();
  function save() {
    if (D) { D.save(); return; }
    var raw = JSON.stringify(S);
    try { sessionStorage.setItem(KEY, raw); } catch (e) {}
    try { window.name = KEY + ':' + raw; } catch (e) {}
  }
  function key() { return D ? D.key() : 'wt#' + ((location.hash || '').slice(1) || 'ready'); }

  // Begin a walkthrough (called from walkthrough.html).
  window.hbTour = {
    begin: function (notes) {
      var keep = { phone: S.phone, hot: false };
      for (var k in S) if (Object.prototype.hasOwnProperty.call(S, k)) delete S[k];
      S.phone = keep.phone; S.auth = 'out'; S.trail = [];
      S.tour = { i: 0, start: Date.now(), notes: !!notes };
      save();
      // The walkthrough page mounts the controls on load, so reload it at the welcome screen.
      location.hash = 'intro'; location.reload();
    },
    end: function () { S.tour = null; save(); }
  };
  if (!S.tour) return;
  var T = S.tour;

  /* ---------- Navigation ---------- */
  function goStep(j) {
    if (j < 0 || j >= STEPS.length) return;
    var s = STEPS[j];
    S.tour.i = j; S.tour.off = false; save();
    var p = s.key.split('#');
    if (p[0] === 'wt') {
      if (document.documentElement.getAttribute('data-tour') === 'home') { if (location.hash !== '#' + p[1]) location.hash = p[1]; else if (window.hbTourSync) window.hbTourSync(); }
      else location.href = WT + '#' + p[1];
      return;
    }
    if (D) { D.jump(s.key, { auth: s.auth, booking: s.booking }); return; }
    S.auth = s.auth || S.auth; S.booking = !!s.booking; S.then = null; save();
    location.href = FILES[p[0]] + '#' + p[1];
  }
  function label(el) { return (el.getAttribute('aria-label') || el.textContent || '').replace(/\s+/g, ' ').trim().replace(/'/g, '’'); }
  function visible(el) { return !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length); }
  function target(s) {
    if (!s || !s.click || !D) return null;
    var root = document.querySelector('.mk-frame [data-state]:not([hidden])');
    if (!root) return null;
    var els = Array.prototype.slice.call(root.querySelectorAll(s.click.sel || 'a, button')).filter(visible);
    if (s.click.t) els = els.filter(function (el) { return label(el) === s.click.t; });
    if (s.click.has) els = els.filter(function (el) { return el.textContent.indexOf(s.click.has) >= 0; });
    return els[0] || null;
  }
  function next() {
    if (T.off || T.transit) { goStep(T.off ? T.i + 1 : T.i); return; }
    var el = target(STEPS[T.i]);
    if (el && !el.disabled) el.click(); else goStep(T.i + 1);
  }
  function back() { goStep(T.off ? T.i : T.i - 1); }
  function skip() {
    for (var j = T.i + 1; j < STEPS.length; j++) if (STEPS[j].ch !== STEPS[T.i].ch) { goStep(j); return; }
  }

  /* ---------- Bar, notes and ring ---------- */
  var bar = document.createElement('div');
  bar.className = 'tour-bar'; bar.setAttribute('role', 'region'); bar.setAttribute('aria-label', 'Walkthrough controls');
  bar.innerHTML =
    '<button type="button" class="tour-btn" data-act="back" aria-label="Previous step">Back</button>' +
    '<div class="tour-info"><span class="tour-ch"></span><span class="tour-step"></span></div>' +
    '<span class="tour-time" title="Time since you started presenting"></span>' +
    '<button type="button" class="tour-btn tour-next" data-act="next">Next</button>' +
    '<button type="button" class="tour-btn" data-act="notes" aria-expanded="false" aria-controls="tour-notes">Notes</button>';
  var notes = document.createElement('div');
  notes.className = 'tour-notes'; notes.id = 'tour-notes'; notes.hidden = true;
  var toolsHtml =
    '<div class="tour-tools"><button type="button" class="tour-link" data-act="skip">Skip to next chapter</button>' +
    (D ? '<button type="button" class="tour-link" data-act="panel">Demo panel</button>' : '') +
    '<button type="button" class="tour-link" data-act="hide">Hide controls</button>' +
    '<button type="button" class="tour-link" data-act="end">End walkthrough</button></div>';
  document.body.appendChild(notes); document.body.appendChild(bar);
  document.body.classList.add('dm-touring');
  var ringEl = null;

  function fmt(ms) { var s = Math.max(0, Math.round(ms / 1000)); return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0'); }
  function tick() {
    var el = bar.querySelector('.tour-time'), s = STEPS[T.i], spent = Date.now() - T.start;
    el.textContent = fmt(spent) + ' / ' + fmt(TOTAL * 1000);
    var behind = spent - (s.mark + s.t) * 1000;
    el.classList.toggle('behind', behind > 45000);
    el.title = behind > 45000 ? 'About ' + Math.round(behind / 60000) + ' min behind plan. Press S to skip a chapter.' : 'On plan: this step starts at ' + fmt(s.mark * 1000);
  }
  function esc(t) { return String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;'); }
  function render() {
    var s = STEPS[T.i], ch = CHAPTERS[s.ch];
    bar.querySelector('.tour-ch').textContent = (s.ch ? s.ch + ' · ' : '') + ch.title;
    bar.querySelector('.tour-step').textContent = T.off ? 'Off the route · Next takes you back' : T.transit ? 'Loading…' : 'Step ' + (T.i + 1) + ' of ' + STEPS.length;
    bar.classList.toggle('off', !!T.off);
    bar.querySelector('[data-act="back"]').disabled = !T.off && T.i === 0;
    bar.querySelector('[data-act="next"]').disabled = !T.off && T.i === STEPS.length - 1;
    notes.innerHTML =
      '<div class="tour-notesHead"><span>' + esc(s.screen) + '</span><span class="tour-mark">' + fmt(s.mark * 1000) + ' → ' + fmt((s.mark + s.t) * 1000) + '</span></div>' +
      '<ul>' + s.say.map(function (l) { return '<li>' + esc(l) + '</li>'; }).join('') + '</ul>' +
      '<div class="tour-do"><span>Then</span>' + esc(s.do) + '</div>' + toolsHtml;
    notes.hidden = !T.notes;
    bar.querySelector('[data-act="notes"]').setAttribute('aria-expanded', String(!!T.notes));
    document.body.classList.toggle('tour-hidden', !!T.hidden);
    if (ringEl) ringEl.classList.remove('tour-target');
    ringEl = T.off || T.transit ? null : target(s);
    if (ringEl) {
      ringEl.classList.add('tour-target');
      var r = ringEl.getBoundingClientRect();
      if (r.top < 70 || r.bottom > window.innerHeight - 20) ringEl.scrollIntoView({ block: 'center', behavior: 'smooth' });
    }
    tick();
  }
  function sync() {
    var k = key(), i = T.i | 0, idx = -1;
    T.transit = TRANSIT.indexOf(k) >= 0;
    if (!T.transit) {
      if (STEPS[i] && STEPS[i].key === k) idx = i;
      else for (var j = i + 1; j < STEPS.length; j++) if (STEPS[j].key === k) { idx = j; break; }
      if (idx >= 0) { T.i = idx; T.off = false; } else T.off = true;
    }
    save();
    // Let the page settle (shells, scroll areas) before placing the ring.
    requestAnimationFrame(render);
  }

  bar.addEventListener('click', act); notes.addEventListener('click', act);
  function act(e) {
    var b = e.target.closest('[data-act]'); if (!b) return;
    var a = b.dataset.act;
    if (a === 'next') next();
    else if (a === 'back') back();
    else if (a === 'skip') skip();
    else if (a === 'notes') { T.notes = !T.notes; save(); render(); }
    else if (a === 'hide') { T.hidden = true; save(); render(); if (D) D.toast('Controls hidden. Press H to show them again.'); }
    else if (a === 'panel' && D) D.togglePanel(true);
    else if (a === 'end') { S.tour = null; save(); location.href = WT; }
  }
  document.addEventListener('keydown', function (e) {
    var t = e.target;
    if (e.metaKey || e.ctrlKey || e.altKey || (t && (/^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName) || t.isContentEditable))) return;
    var k = e.key;
    if (k === 'ArrowRight' || k === 'PageDown') { e.preventDefault(); next(); }
    else if (k === 'ArrowLeft' || k === 'PageUp') { e.preventDefault(); back(); }
    else if (k === 'n' || k === 'N') { T.notes = !T.notes; save(); render(); }
    else if (k === 's' || k === 'S') skip();
    else if (k === 'h' || k === 'H') { T.hidden = !T.hidden; save(); render(); }
  });
  document.addEventListener('mk:change', sync);
  window.addEventListener('hashchange', function () { if (!D) sync(); });
  window.hbTourSync = sync;
  setInterval(tick, 1000);
  sync();
})();
