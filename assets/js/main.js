/* =========================================================================
   Aditya G — minimal progressive enhancement.
   The site is fully usable without JavaScript; this only stamps the year.
   ========================================================================= */
(function () {
  "use strict";
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
})();
