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
