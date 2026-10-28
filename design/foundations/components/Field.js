/* Field behaviour (mockup): the character counter under a textarea or input.
   <textarea data-counter="id" maxlength="500"> updates <span class="fieldCounter" id="id">. */
(function () {
  document.querySelectorAll('[data-counter]').forEach(function (el) {
    var out = document.getElementById(el.dataset.counter), max = +el.getAttribute('maxlength');
    if (!out) return;
    function upd() { out.textContent = el.value.length.toLocaleString('en-GB') + ' / ' + max.toLocaleString('en-GB'); out.classList.toggle('atLimit', el.value.length >= max); }
    el.addEventListener('input', upd); upd();
  });
})();

/* Password field: Show / Hide switches the input between hidden and plain text. */
(function () {
  document.addEventListener('click', function (e) {
    var b = e.target.closest('.fieldReveal'); if (!b) return;
    var input = document.getElementById(b.getAttribute('aria-controls')); if (!input || input.disabled) return;
    var show = input.type === 'password';
    input.type = show ? 'text' : 'password';
    b.textContent = show ? 'Hide' : 'Show';
    b.setAttribute('aria-pressed', String(show));
    b.setAttribute('aria-label', show ? 'Hide password' : 'Show password');
  });
})();
