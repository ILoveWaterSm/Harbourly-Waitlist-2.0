/* Simplified country flags for mockups: <span class="flag" role="img" aria-label="Philippines"><svg><use href="#flag-ph"/></svg></span>.
   The app uses a full flag icon set in the same 3:2 box (see components/Flag.css). */
(function () {
  var flags = {
    ph: '<rect width="30" height="10" fill="#0038a8"/><rect y="10" width="30" height="10" fill="#ce1126"/><path d="M0 0 13 10 0 20z" fill="#fff"/><circle cx="4.6" cy="10" r="2" fill="#fcd116"/>',
    sg: '<rect width="30" height="10" fill="#ef3340"/><rect y="10" width="30" height="10" fill="#fff"/><circle cx="6.2" cy="5" r="3.3" fill="#fff"/><circle cx="7.4" cy="5" r="3" fill="#ef3340"/><g fill="#fff"><circle cx="10.6" cy="3.1" r=".55"/><circle cx="12.4" cy="4.4" r=".55"/><circle cx="11.7" cy="6.5" r=".55"/><circle cx="9.5" cy="6.5" r=".55"/><circle cx="8.8" cy="4.4" r=".55"/></g>',
    my: '<rect width="30" height="20" fill="#cc0001"/><g fill="#fff"><rect y="1.43" width="30" height="1.43"/><rect y="4.29" width="30" height="1.43"/><rect y="7.14" width="30" height="1.43"/><rect y="10" width="30" height="1.43"/><rect y="12.86" width="30" height="1.43"/><rect y="15.71" width="30" height="1.43"/><rect y="18.57" width="30" height="1.43"/></g><rect width="15" height="11.43" fill="#010066"/><circle cx="5.6" cy="5.7" r="3.6" fill="#fc0"/><circle cx="6.7" cy="5.7" r="3" fill="#010066"/><circle cx="11" cy="5.7" r="1.6" fill="#fc0"/>'
  };
  var s = '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style="position:absolute;width:0;height:0;overflow:hidden">';
  for (var k in flags) s += '<symbol id="flag-' + k + '" viewBox="0 0 30 20" preserveAspectRatio="none">' + flags[k] + '</symbol>';
  s += '</svg>';
  document.body.insertAdjacentHTML('afterbegin', s);
})();
