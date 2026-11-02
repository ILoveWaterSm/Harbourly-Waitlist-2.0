/* WeekHours behaviour (mockup): fills each hour select (From 00:00–23:00, To 01:00–24:00) from data-hour,
   turns a day on or off, adds and removes ranges, and keeps each day's slot count in step. */
(function () {
  function hh(h) { return String(h).padStart(2, '0') + ':00'; }
  function fill(sel) {
    if (sel.options.length) return;
    var to = sel.classList.contains('weekTo'), v = +sel.dataset.hour;
    for (var h = to ? 1 : 0; h <= (to ? 24 : 23); h++) { var o = new Option(hh(h), h); if (h === v) o.selected = true; sel.add(o); }
  }
  function count(day) {
    var n = 0;
    day.querySelectorAll('.weekRange').forEach(function (r) { var a = +r.querySelector('.weekFrom').value, b = +r.querySelector('.weekTo').value; if (b > a) n += b - a; });
    var out = day.querySelector('.weekDaySlots'); if (!out) return;
    var on = day.querySelector('.weekDayHead input').checked;
    out.textContent = on ? n + (n === 1 ? ' one-hour slot' : ' one-hour slots') : '';
  }
  document.querySelectorAll('.weekHours select').forEach(fill);
  document.querySelectorAll('.weekDay').forEach(count);
  document.addEventListener('change', function (e) {
    var day = e.target.closest('.weekDay'); if (!day) return;
    if (e.target.matches('.weekDayHead input')) {
      var on = e.target.checked, ranges = day.querySelector('.weekDayRanges'), off = day.querySelector('.weekDayOff');
      if (ranges) ranges.hidden = !on; if (off) off.hidden = on;
    }
    count(day);
  });
  document.addEventListener('click', function (e) {
    var add = e.target.closest('.weekAdd'), rm = e.target.closest('.weekRemove');
    if (add) {
      var list = add.closest('.weekDayRanges'), last = list.querySelectorAll('.weekRange'), tpl = last[last.length - 1];
      var n = tpl.cloneNode(true), end = Math.min(+tpl.querySelector('.weekTo').value + 1, 23);
      n.querySelector('.weekFrom').value = end; n.querySelector('.weekTo').value = Math.min(end + 2, 24);
      tpl.after(n); count(add.closest('.weekDay'));
    }
    if (rm) {
      var d = rm.closest('.weekDay'), rows = d.querySelectorAll('.weekRange');
      if (rows.length > 1) rm.closest('.weekRange').remove();
      else { var cb = d.querySelector('.weekDayHead input'); cb.checked = false; cb.dispatchEvent(new Event('change', { bubbles: true })); }
      count(d);
    }
  });
})();
