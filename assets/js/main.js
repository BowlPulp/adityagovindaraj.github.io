/* =========================================================================
   Aditya G — portfolio interactions
   Vanilla JS, no dependencies. Progressive enhancement only:
   the site is fully usable with JavaScript disabled.
   ========================================================================= */
(function () {
  "use strict";

  // Signal JS is available (CSS uses .no-js as the safe fallback).
  document.documentElement.classList.remove("no-js");
  document.documentElement.classList.add("js");

  var prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  );

  /* ---------------------------------------------------------------------
     Mobile navigation
     - toggle button exposes aria-expanded
     - Escape closes and returns focus to the toggle
     - closes on link activation and on resize to desktop
     --------------------------------------------------------------------- */
  var toggle = document.querySelector(".nav-toggle");
  var navList = document.getElementById("primary-nav");

  function setNav(open) {
    if (!toggle || !navList) return;
    toggle.setAttribute("aria-expanded", String(open));
    navList.setAttribute("data-open", String(open));
    toggle.setAttribute(
      "aria-label",
      open ? "Close navigation menu" : "Open navigation menu"
    );
  }

  if (toggle && navList) {
    toggle.addEventListener("click", function () {
      var open = toggle.getAttribute("aria-expanded") === "true";
      setNav(!open);
    });

    navList.addEventListener("click", function (e) {
      if (e.target.closest("a")) setNav(false);
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
        setNav(false);
        toggle.focus();
      }
    });

    // If the viewport grows past the mobile breakpoint, reset state.
    var mq = window.matchMedia("(min-width: 44.0625rem)");
    (mq.addEventListener ? mq.addEventListener.bind(mq, "change") : mq.addListener.bind(mq))(
      function () {
        if (mq.matches) setNav(false);
      }
    );
  }

  /* ---------------------------------------------------------------------
     Header hairline on scroll
     --------------------------------------------------------------------- */
  var header = document.querySelector(".site-header");
  if (header) {
    var onScroll = function () {
      header.setAttribute("data-scrolled", String(window.scrollY > 8));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---------------------------------------------------------------------
     Scroll-reveal (skipped entirely under reduced-motion)
     --------------------------------------------------------------------- */
  var revealEls = Array.prototype.slice.call(
    document.querySelectorAll("[data-reveal]")
  );
  if (
    revealEls.length &&
    "IntersectionObserver" in window &&
    !prefersReducedMotion.matches
  ) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 }
    );
    revealEls.forEach(function (el) {
      io.observe(el);
    });
  } else {
    // No observer or reduced motion → show everything immediately.
    revealEls.forEach(function (el) {
      el.classList.add("is-visible");
    });
  }

  /* ---------------------------------------------------------------------
     Active-section highlighting for in-page nav (home only)
     Uses aria-current="true" so screen readers announce location.
     --------------------------------------------------------------------- */
  var sectionLinks = Array.prototype.slice
    .call(document.querySelectorAll('.nav-list a[href^="#"]'))
    .filter(function (a) {
      return a.getAttribute("href").length > 1;
    });

  if (sectionLinks.length && "IntersectionObserver" in window) {
    var linkFor = {};
    var sections = [];
    sectionLinks.forEach(function (a) {
      var id = a.getAttribute("href").slice(1);
      var sec = document.getElementById(id);
      if (sec) {
        linkFor[id] = a;
        sections.push(sec);
      }
    });

    var current = null;
    var spy = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            if (current) current.removeAttribute("aria-current");
            current = linkFor[entry.target.id];
            if (current) current.setAttribute("aria-current", "true");
          }
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );
    sections.forEach(function (s) {
      spy.observe(s);
    });
  }

  /* ---------------------------------------------------------------------
     Footer year stamp
     --------------------------------------------------------------------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
})();
