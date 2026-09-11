/**
 * LÜNE PROTECT — main.js
 * Mobile navigation, sticky header state, scroll-reveal animations,
 * active-section nav highlighting, contact form UX, footer year.
 * No external dependencies. Respects prefers-reduced-motion.
 */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Mobile navigation ---------- */
  var navToggle = document.querySelector('[data-nav-toggle]');
  // The 'nav-open' class (which also locks background scroll — see CSS)
  // goes on <html>, not <body>: <html> is this page's actual scrolling
  // element (standards mode), so an overflow:hidden on <body> alone
  // doesn't stop it — the background stays scrollable behind the fixed
  // mobile-nav panel, which on phones (iOS Safari especially) is exactly
  // what makes a "fixed" panel jump or vanish mid-scroll.
  var htmlEl = document.documentElement;

  if (navToggle) {
    navToggle.addEventListener('click', function () {
      var isOpen = htmlEl.classList.toggle('nav-open');
      navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    document.querySelectorAll('.main-nav a').forEach(function (link) {
      link.addEventListener('click', function () {
        htmlEl.classList.remove('nav-open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------- Sticky header shadow on scroll ---------- */
  var header = document.querySelector('[data-site-header]');
  if (header) {
    var updateHeader = function () {
      header.classList.toggle('is-scrolled', window.scrollY > 8);
    };
    updateHeader();
    window.addEventListener('scroll', updateHeader, { passive: true });
  }

  /* ---------- Scroll-reveal ----------
     [data-reveal] elements render fully visible until this code opts the
     page into the hide/fade-in animation (`js-reveal` on <html>). A
     safety-net timeout force-reveals everything regardless, so a missed
     observer entry or unusual layout can never leave content stuck at
     opacity:0. */
  var revealEls = document.querySelectorAll('[data-reveal]');
  if (revealEls.length && !reduceMotion && 'IntersectionObserver' in window) {
    document.documentElement.classList.add('js-reveal');

    var revealAll = function () {
      revealEls.forEach(function (el) {
        el.classList.add('is-visible');
      });
    };

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
    );
    revealEls.forEach(function (el) {
      observer.observe(el);
    });

    // Safety net: force everything visible after load, in case an element
    // never intersects (e.g. it's already off the top of a very short page).
    window.addEventListener('load', function () {
      setTimeout(revealAll, 1200);
    });
  }

  /* ---------- Active nav link on scroll ---------- */
  var sections = document.querySelectorAll('main [id]');
  var navLinks = document.querySelectorAll('.main-nav__list a[href^="#"]');
  if (sections.length && navLinks.length && 'IntersectionObserver' in window) {
    var sectionObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var id = entry.target.getAttribute('id');
            navLinks.forEach(function (link) {
              link.classList.toggle('is-active', link.getAttribute('href') === '#' + id);
            });
          }
        });
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
    );
    sections.forEach(function (section) {
      sectionObserver.observe(section);
    });
  }

  /* ---------- Contact form ---------- */
  var form = document.querySelector('[data-contact-form]');
  if (form) {
    var status = form.querySelector('[data-form-status]');
    form.addEventListener('submit', function (event) {
      event.preventDefault();

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      // NOTE for integration: this form has no backend wired up yet.
      // Connect it to a mail-sending endpoint (e.g. a small server script,
      // or a form service) so submissions actually reach LÜNE PROTECT.
      // Until then this only confirms client-side that the form is valid.
      if (status) {
        status.textContent =
          'Danke für Ihre Anfrage! Wir melden uns in der Regel innerhalb eines Werktags telefonisch oder per E-Mail zurück.';
        status.classList.remove('is-error');
        status.classList.add('is-success');
      }
      form.reset();
    });
  }

  /* ---------- Footer year ---------- */
  var yearEl = document.querySelector('[data-year]');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
})();
