/* =========================================================================
   Cover loader — progressive enhancement for the bookshelf and media pages.
   Every cover already shows its title in HTML; this script fetches the real
   cover art in the visitor's browser and lays it over the title. If a lookup
   or image fails, the title simply stays visible. No build step, no bundling.

   Books  → Open Library search + covers API (CORS-enabled).
   Films / TV → Wikipedia page images API (CORS via origin=*).
   ========================================================================= */
(function () {
  "use strict";

  function overlay(fig, url) {
    if (!url) return;
    var img = new Image();
    img.decoding = "async";
    img.alt = (fig.getAttribute("data-title") || "") + " cover";
    img.onload = function () {
      fig.querySelector(".cover__frame").appendChild(img);
    };
    img.src = url;
  }

  /* ---- Books via Open Library, with a small concurrency limit ---------- */
  function loadBook(fig) {
    var title = fig.getAttribute("data-title") || "";
    var author = fig.getAttribute("data-author") || "";
    var url =
      "https://openlibrary.org/search.json?limit=1&fields=cover_i&title=" +
      encodeURIComponent(title) +
      (author ? "&author=" + encodeURIComponent(author) : "");
    return fetch(url)
      .then(function (r) {
        return r.json();
      })
      .then(function (data) {
        var doc = data && data.docs && data.docs[0];
        if (doc && doc.cover_i) {
          overlay(
            fig,
            "https://covers.openlibrary.org/b/id/" + doc.cover_i + "-L.jpg"
          );
        }
      })
      .catch(function () {});
  }

  function runBooks() {
    var figs = Array.prototype.slice.call(
      document.querySelectorAll('.cover[data-kind="book"]')
    );
    var i = 0;
    var CONCURRENCY = 5;
    function next() {
      if (i >= figs.length) return;
      var fig = figs[i++];
      loadBook(fig).then(next);
    }
    for (var c = 0; c < CONCURRENCY; c++) next();
  }

  /* ---- Films / TV via Wikipedia page images (batched) ------------------ */
  function loadMedia() {
    var figs = Array.prototype.slice.call(
      document.querySelectorAll(".cover[data-wiki]")
    );
    if (!figs.length) return;
    var titles = figs.map(function (f) {
      return f.getAttribute("data-wiki");
    });
    var url =
      "https://en.wikipedia.org/w/api.php?action=query&format=json&origin=*" +
      "&redirects=1&prop=pageimages&piprop=original%7Cthumbnail&pithumbsize=500" +
      "&pilimit=50&titles=" +
      encodeURIComponent(titles.join("|"));

    fetch(url)
      .then(function (r) {
        return r.json();
      })
      .then(function (data) {
        var q = (data && data.query) || {};
        var pages = q.pages || {};

        // Map final (normalized + redirected) title -> image URL.
        var byTitle = {};
        Object.keys(pages).forEach(function (k) {
          var p = pages[k];
          var src =
            (p.original && p.original.source) ||
            (p.thumbnail && p.thumbnail.source);
          if (src) byTitle[p.title] = src;
        });

        // Chain of title rewrites the API applied.
        var rewrite = {};
        (q.normalized || []).forEach(function (n) {
          rewrite[n.from] = n.to;
        });
        (q.redirects || []).forEach(function (n) {
          rewrite[n.from] = n.to;
        });
        function resolve(t) {
          var seen = {};
          while (rewrite[t] && !seen[t]) {
            seen[t] = true;
            t = rewrite[t];
          }
          return t;
        }

        figs.forEach(function (f) {
          var want = f.getAttribute("data-wiki");
          overlay(f, byTitle[resolve(want)] || byTitle[want]);
        });
      })
      .catch(function () {});
  }

  function init() {
    runBooks();
    loadMedia();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
