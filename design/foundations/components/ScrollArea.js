/* ScrollArea behaviour (mockup): shows the edge fades only while there is more content past that edge, and
   brightens the thumb while scrolling. In the app this lives in the ScrollArea component. */
(function () {
  function update(el) {
    var max = el.scrollHeight - el.clientHeight;
    el.classList.toggle('canUp', max > 1 && el.scrollTop > 1);
    el.classList.toggle('canDown', max > 1 && el.scrollTop < max - 1);
  }
  var areas = Array.prototype.slice.call(document.querySelectorAll('.scrollArea'));
  areas.forEach(function (el) {
    var t;
    el.addEventListener('scroll', function () {
      update(el);
      el.classList.add('isScrolling');
      clearTimeout(t);
      t = setTimeout(function () { el.classList.remove('isScrolling'); }, 700);
    }, { passive: true });
    if (window.ResizeObserver) new ResizeObserver(function () { update(el); }).observe(el);
    update(el);
  });
  window.addEventListener('resize', function () { areas.forEach(update); });
  document.addEventListener('mk:change', function () { requestAnimationFrame(function () { areas.forEach(update); }); });
})();
