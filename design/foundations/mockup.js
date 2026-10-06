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
