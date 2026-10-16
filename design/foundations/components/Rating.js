/* Rating input behaviour (mockup). Builds five star buttons inside .ratingInputStars from the
   fieldset's data-rating, with hover preview, click to set and arrow keys. In the app this lives
   in the RatingInput component. */
(function () {
  var star = '<svg class="icon" aria-hidden="true"><use href="#i-star"/></svg>';
  document.querySelectorAll('.ratingInput').forEach(function (fs) {
    var wrap = fs.querySelector('.ratingInputStars'), value = +fs.dataset.rating || 0, btns = [];
    for (var i = 1; i <= 5; i++) {
      var b = document.createElement('button');
      b.type = 'button'; b.className = 'ratingStar'; b.setAttribute('role', 'radio');
      b.setAttribute('aria-label', i + (i === 1 ? ' star' : ' stars')); b.dataset.v = i; b.innerHTML = star;
      wrap.appendChild(b); btns.push(b);
    }
    var label = document.createElement('span'); label.className = 'ratingInputValue'; wrap.appendChild(label);
    function paint(v) { btns.forEach(function (b) { b.classList.toggle('isOn', +b.dataset.v <= v); }); }
    function set(v) {
      value = v; paint(v); fs.dataset.rating = v;
      btns.forEach(function (b) { b.setAttribute('aria-checked', String(+b.dataset.v === v)); b.tabIndex = (+b.dataset.v === (v || 1)) ? 0 : -1; });
      label.textContent = v ? v + ' out of 5' : 'Not rated';
      if (v) fs.classList.remove('invalid');
      fs.dispatchEvent(new CustomEvent('rating:change', { bubbles: true, detail: v }));
    }
    btns.forEach(function (b) {
      b.addEventListener('click', function () { set(+b.dataset.v); });
      b.addEventListener('mouseenter', function () { paint(+b.dataset.v); });
      b.addEventListener('keydown', function (e) {
        var d = (e.key === 'ArrowRight' || e.key === 'ArrowUp') ? 1 : (e.key === 'ArrowLeft' || e.key === 'ArrowDown') ? -1 : 0;
        if (d) { e.preventDefault(); var v = Math.min(5, Math.max(1, (value || 0) + d)); set(v); btns[v - 1].focus(); }
      });
    });
    wrap.addEventListener('mouseleave', function () { paint(value); });
    set(value);
  });
})();
