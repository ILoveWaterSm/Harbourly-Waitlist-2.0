/* OtpInput behaviour (lifts into the OtpInput component). Every code entry behaves the same:
   digits only; a digit moves to the next box; Backspace on an empty box goes back and clears it;
   arrow keys move between boxes; pasting a code (or the phone's one-time-code suggestion) fills every box. */
(function () {
  function cells(el) { return [].slice.call(el.closest('.otpInput').querySelectorAll('.otpCell')); }
  function fill(list, from, digits) {
    var i = from;
    digits.split('').forEach(function (d) { if (i < list.length) list[i++].value = d; });
    list[Math.min(i, list.length - 1)].focus();
  }
  document.addEventListener('input', function (e) {
    var c = e.target; if (!c.classList || !c.classList.contains('otpCell')) return;
    var digits = c.value.replace(/\D/g, ''), list = cells(c), i = list.indexOf(c);
    c.value = digits.slice(0, 1);
    if (digits.length > 1) fill(list, i, digits);       // autofill or fast typing puts several digits in one box
    else if (digits && i < list.length - 1) list[i + 1].focus();
  });
  document.addEventListener('keydown', function (e) {
    var c = e.target; if (!c.classList || !c.classList.contains('otpCell')) return;
    var list = cells(c), i = list.indexOf(c);
    if (e.key === 'Backspace' && !c.value && i > 0) { e.preventDefault(); list[i - 1].value = ''; list[i - 1].focus(); }
    else if (e.key === 'ArrowLeft' && i > 0) { e.preventDefault(); list[i - 1].focus(); }
    else if (e.key === 'ArrowRight' && i < list.length - 1) { e.preventDefault(); list[i + 1].focus(); }
    else if (e.key.length === 1 && !/\d/.test(e.key) && !e.ctrlKey && !e.metaKey) e.preventDefault();  // letters never land
  });
  document.addEventListener('paste', function (e) {
    var c = e.target; if (!c.classList || !c.classList.contains('otpCell')) return;
    e.preventDefault();
    var digits = (e.clipboardData || window.clipboardData).getData('text').replace(/\D/g, '');
    if (digits) fill(cells(c), cells(c).indexOf(c), digits);
  });
  document.addEventListener('focusin', function (e) {
    var c = e.target; if (c.classList && c.classList.contains('otpCell')) c.select();
  });
})();
