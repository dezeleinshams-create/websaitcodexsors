/* =========================================================================
   SITE SNAP — front-end behaviour
   Vanilla ES2019+, no dependencies, loaded with `defer`.
   Every module bails out quietly when its markup is not on the page.
   ========================================================================= */
(function () {
  'use strict';

  var doc = document;
  var root = doc.documentElement;
  var isRTL = root.getAttribute('dir') === 'rtl';
  var motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  var reduceMotion = motionQuery.matches;
  motionQuery.addEventListener && motionQuery.addEventListener('change', function (e) {
    reduceMotion = e.matches;
  });

  function $(sel, ctx) { return (ctx || doc).querySelector(sel); }
  function $$(sel, ctx) { return Array.prototype.slice.call((ctx || doc).querySelectorAll(sel)); }
  function on(el, ev, fn, opts) { if (el) el.addEventListener(ev, fn, opts || false); }

  /* Run a handler at most once per animation frame. */
  function raf(fn) {
    var ticking = false;
    return function () {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(function () { ticking = false; fn(); });
    };
  }

  /* ---------------------------------------------------------------------
     Theme (dark / light)
     The saved choice is applied by an inline script in <head> before first
     paint; this module only keeps the toggles in sync and handles clicks.
     --------------------------------------------------------------------- */
  (function theme() {
    var KEY = 'sitesnap-theme';
    var toggles = $$('[data-theme-toggle]');
    var metaColor = $('meta[name="theme-color"]');

    function current() { return root.getAttribute('data-theme') === 'light' ? 'light' : 'dark'; }

    function sync(t) {
      if (metaColor) metaColor.setAttribute('content', t === 'light' ? '#F7F7F4' : '#07080D');
      toggles.forEach(function (btn) {
        if (btn.getAttribute('role') === 'switch') {
          btn.setAttribute('aria-checked', t === 'dark' ? 'true' : 'false');
          return;
        }
        var label = btn.getAttribute(t === 'dark' ? 'data-label-light' : 'data-label-dark');
        if (label) {
          btn.setAttribute('aria-label', label);
          btn.setAttribute('title', label);
        }
      });
    }

    // Swap with every transition suspended, so hundreds of elements don't
    // each animate their own colour change at a slightly different pace.
    function swap(t) {
      root.classList.add('theme-switching');
      root.setAttribute('data-theme', t);
      try { localStorage.setItem(KEY, t); } catch (e) { /* private mode */ }
      sync(t);
      void root.offsetWidth;
      window.requestAnimationFrame(function () { root.classList.remove('theme-switching'); });
    }

    function toggle() {
      var next = current() === 'dark' ? 'light' : 'dark';
      // One soft cross-fade where supported; an instant swap otherwise.
      if (doc.startViewTransition && !reduceMotion) doc.startViewTransition(function () { swap(next); });
      else swap(next);
    }

    sync(current());
    toggles.forEach(function (btn) { on(btn, 'click', toggle); });

    // Follow a change made in another tab.
    on(window, 'storage', function (e) {
      if (e.key !== KEY || (e.newValue !== 'light' && e.newValue !== 'dark')) return;
      root.setAttribute('data-theme', e.newValue);
      sync(e.newValue);
    });
  })();

  /* ---------------------------------------------------------------------
     Sticky header
     --------------------------------------------------------------------- */
  (function header() {
    var el = $('#siteHeader');
    if (!el) return;
    var stuck = null;
    var update = raf(function () {
      var next = window.scrollY > 16;
      if (next !== stuck) {
        el.classList.toggle('is-stuck', next);
        stuck = next;
      }
    });
    update();
    on(window, 'scroll', update, { passive: true });
  })();

  /* ---------------------------------------------------------------------
     Language dropdown
     Opens on click / ArrowDown; arrows move between options; Escape,
     Tab-away and outside clicks close it.
     --------------------------------------------------------------------- */
  (function langMenu() {
    var wrap = $('[data-lang-menu]');
    if (!wrap) return;
    var btn = $('.lang-toggle', wrap);
    var list = $('.lang-list', wrap);
    if (!btn || !list) return;

    var links = $$('a', list);
    var open = false;

    function setOpen(next, returnFocus) {
      if (next === open) return;
      open = next;
      wrap.classList.toggle('is-open', open);
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      if (!open && returnFocus) btn.focus();
    }
    function focusAt(i) {
      var link = links[(i + links.length) % links.length];
      if (link) link.focus();
    }

    on(btn, 'click', function () { setOpen(!open); });
    on(btn, 'keydown', function (e) {
      if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
      e.preventDefault();
      setOpen(true);
      focusAt(e.key === 'ArrowDown' ? 0 : links.length - 1);
    });
    on(wrap, 'keydown', function (e) {
      if (!open) return;
      var i = links.indexOf(doc.activeElement);
      if (e.key === 'Escape') { e.preventDefault(); setOpen(false, true); }
      else if (i === -1) return;
      else if (e.key === 'ArrowDown') { e.preventDefault(); focusAt(i + 1); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); focusAt(i - 1); }
      else if (e.key === 'Home') { e.preventDefault(); focusAt(0); }
      else if (e.key === 'End') { e.preventDefault(); focusAt(links.length - 1); }
    });
    on(wrap, 'focusout', function (e) {
      if (open && e.relatedTarget && !wrap.contains(e.relatedTarget)) setOpen(false);
    });
    on(doc, 'pointerdown', function (e) {
      if (open && !wrap.contains(e.target)) setOpen(false);
    });
  })();

  /* ---------------------------------------------------------------------
     Desktop nav — a pill that glides to whatever is hovered or focused.
     Pure transform work: no layout is touched while it moves.
     --------------------------------------------------------------------- */
  (function navIndicator() {
    var nav = $('#siteNav');
    if (!nav) return;
    var ind = $('.nav-ind', nav);
    var links = $$('.nav-link', nav);
    if (!ind || !links.length) return;

    function moveTo(link) {
      // offsetLeft is physical, so this holds in RTL as well as LTR.
      ind.style.setProperty('--ind-x', link.offsetLeft + 'px');
      ind.style.setProperty('--ind-w', link.offsetWidth + 'px');
      nav.classList.add('has-ind');
    }
    function clear() { nav.classList.remove('has-ind'); }

    links.forEach(function (link) {
      on(link, 'pointerenter', function () { moveTo(link); });
      on(link, 'focus', function () { moveTo(link); });
    });
    on(nav, 'pointerleave', clear);
    on(nav, 'focusout', function (e) {
      if (!e.relatedTarget || !nav.contains(e.relatedTarget)) clear();
    });
  })();

  /* ---------------------------------------------------------------------
     Drawer submenu — the portfolio categories inside the mobile menu.
     The desktop menu is pure CSS (hover / focus-within); only the drawer
     needs a toggle.
     --------------------------------------------------------------------- */
  (function workMenus() {
    // Drawer: the row opens the categories underneath it.
    $$('.mnav-trigger').forEach(function (btn) {
      var list = doc.getElementById(btn.getAttribute('aria-controls') || '');
      if (!list) return;

      on(btn, 'click', function () {
        var open = btn.getAttribute('aria-expanded') === 'true';
        btn.setAttribute('aria-expanded', open ? 'false' : 'true');
        list.classList.toggle('is-open', !open);
      });
    });

    // Desktop: hover already opens it in CSS; this covers click, touch and
    // the keyboard, and closes on Escape or an outside press.
    var triggers = $$('.nav-trigger');
    if (!triggers.length) return;

    function closeAll(except) {
      triggers.forEach(function (btn) {
        var item = btn.parentNode;
        if (item === except) return;
        item.classList.remove('is-open');
        btn.setAttribute('aria-expanded', 'false');
      });
    }

    triggers.forEach(function (btn) {
      var item = btn.parentNode;
      on(btn, 'click', function (e) {
        e.preventDefault();
        var open = item.classList.contains('is-open');
        closeAll(item);
        item.classList.toggle('is-open', !open);
        btn.setAttribute('aria-expanded', open ? 'false' : 'true');
      });
    });

    on(doc, 'pointerdown', function (e) {
      if (!e.target.closest || !e.target.closest('.nav-has-menu')) closeAll(null);
    });
    on(doc, 'keydown', function (e) {
      if (e.key === 'Escape') closeAll(null);
    });
  })();
  /* ---------------------------------------------------------------------
     Mobile navigation panel
     Closes on: link click, outside click, Escape, resize to desktop.
     Locks the background scroll and keeps focus inside while open.
     --------------------------------------------------------------------- */
  (function mobileNav() {
    var burger = $('#navToggle');
    var drawer = $('#mobileNav');
    var scrim = $('#navScrim');
    var header = $('#siteHeader');
    if (!burger || !drawer) return;

    // The drawer is the navigation below 1440px (nine top-level items).
    var desktop = window.matchMedia('(min-width: 1440px)');
    var labelOpen = burger.getAttribute('data-label-open') || burger.getAttribute('aria-label') || '';
    var labelClose = burger.getAttribute('data-label-close') || labelOpen;
    var open = false;
    var lastFocus = null;

    function focusables() {
      // No offsetParent test here: the drawer animates out of
      // `visibility: hidden`, so its children still report null on the
      // frame the class flips and the list would come back empty.
      return $$('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])', drawer)
        .filter(function (el) { return !el.hasAttribute('hidden'); });
    }

    function setOpen(next) {
      if (next === open) return;
      open = next;

      // No scrollbar compensation needed: `scrollbar-gutter: stable`
      // on <html> keeps the track reserved while body scroll is locked.

      // Lock the root as well: with overflow propagation the root is the
      // element that actually scrolls.
      root.classList.toggle('nav-open', open);
      doc.body.classList.toggle('nav-open', open);
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      burger.setAttribute('aria-label', open ? labelClose : labelOpen);
      drawer.setAttribute('aria-hidden', open ? 'false' : 'true');
      if (scrim) {
        if (open) scrim.removeAttribute('hidden');
        else scrim.setAttribute('hidden', '');
      }

      if (open) {
        lastFocus = doc.activeElement;
        // A real pointer click focuses the toggle as part of its default
        // action, which lands after a rAF and would steal this back — so
        // move focus on a short timer instead, and only if still open.
        window.setTimeout(function () {
          if (!open) return;
          var first = focusables()[0];
          if (first) first.focus();
        }, 80);
      } else if (lastFocus && lastFocus.focus) {
        lastFocus.focus();
      }
    }

    on(burger, 'click', function () { setOpen(!open); });
    // Any other control that asks for the drawer by name opens it too.
    $$('[data-nav-open]').forEach(function (btn) {
      on(btn, 'click', function () { setOpen(true); });
    });
    on(scrim, 'click', function () { setOpen(false); });
    on($('#navClose'), 'click', function () { setOpen(false); });

    // Any navigation item closes the drawer.
    $$('a', drawer).forEach(function (a) {
      on(a, 'click', function () { setOpen(false); });
    });

    // Clicking anywhere outside the panel or the header bar closes it
    // (the bar's own theme button must not).
    on(doc, 'pointerdown', function (e) {
      if (!open) return;
      if (drawer.contains(e.target) || (header || burger).contains(e.target)) return;
      setOpen(false);
    });

    on(doc, 'keydown', function (e) {
      if (!open) return;
      if (e.key === 'Escape') { setOpen(false); return; }
      if (e.key !== 'Tab') return;

      var list = focusables();
      if (!list.length) return;
      list.unshift(burger);          // keep the toggle in the cycle
      var first = list[0];
      var last = list[list.length - 1];
      if (e.shiftKey && doc.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && doc.activeElement === last) { e.preventDefault(); first.focus(); }
    });

    // Reaching the desktop layout closes the panel.
    function onBreakpoint(e) { if (e.matches) setOpen(false); }
    if (desktop.addEventListener) desktop.addEventListener('change', onBreakpoint);
    else if (desktop.addListener) desktop.addListener(onBreakpoint);

    // Start closed, whatever the server rendered.
    root.classList.remove('nav-open');
    doc.body.classList.remove('nav-open');
    drawer.setAttribute('aria-hidden', 'true');
    burger.setAttribute('aria-expanded', 'false');
  })();

  /* ---------------------------------------------------------------------
     Reveal on scroll
     --------------------------------------------------------------------- */
  (function reveal() {
    var items = $$('[data-reveal]');
    if (!items.length) return;
    if (reduceMotion || !('IntersectionObserver' in window)) {
      items.forEach(function (el) { el.classList.add('is-in'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        io.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.06 });

    items.forEach(function (el) {
      if (!el.style.getPropertyValue('--reveal-delay')) {
        var group = el.getAttribute('data-reveal-group');
        if (group) el.style.setProperty('--reveal-delay', (parseInt(group, 10) * 70) + 'ms');
      }
      io.observe(el);
    });
  })();

  /* ---------------------------------------------------------------------
     Animated counters
     --------------------------------------------------------------------- */
  (function counters() {
    var els = $$('[data-count]');
    if (!els.length) return;

    function format(n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }

    function run(el) {
      var target = parseFloat(el.getAttribute('data-count')) || 0;
      if (reduceMotion) { el.textContent = format(target); return; }
      var duration = 1400;
      var start = null;
      function step(ts) {
        if (start === null) start = ts;
        var p = Math.min((ts - start) / duration, 1);
        var eased = p === 1 ? 1 : 1 - Math.pow(2, -10 * p);   // easeOutExpo
        el.textContent = format(Math.round(target * eased));
        if (p < 1) window.requestAnimationFrame(step);
      }
      window.requestAnimationFrame(step);
    }

    if (!('IntersectionObserver' in window)) {
      els.forEach(function (el) { el.textContent = format(parseFloat(el.getAttribute('data-count')) || 0); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        run(entry.target);
        io.unobserve(entry.target);
      });
    }, { threshold: 0.4 });
    els.forEach(function (el) { io.observe(el); });
  })();

  /* ---------------------------------------------------------------------
     Process timeline — rail nodes (desktop) + accordion (mobile)
     --------------------------------------------------------------------- */
  (function process() {
    var nodes = $$('.process-node');
    var panes = $$('.process-pane');
    var rail = $('.process-rail');

    if (nodes.length && panes.length) {
      var select = function (idx) {
        nodes.forEach(function (n, i) {
          n.classList.toggle('is-active', i === idx);
          n.setAttribute('aria-selected', i === idx ? 'true' : 'false');
        });
        panes.forEach(function (p, i) { p.classList.toggle('is-shown', i === idx); });
        if (rail) {
          var pct = nodes.length > 1 ? (idx / (nodes.length - 1)) * 100 : 100;
          rail.style.setProperty('--progress', Math.max(6, pct) + '%');
        }
      };
      nodes.forEach(function (node, i) {
        on(node, 'click', function () { select(i); });
        on(node, 'keydown', function (e) {
          if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); select(i); }
        });
      });
      select(0);
    }

    $$('.process-acc .pa-head').forEach(function (head) {
      on(head, 'click', function () {
        var item = head.closest('.pa-item');
        var isOpen = item.classList.contains('is-open');
        $$('.process-acc .pa-item').forEach(function (i) {
          i.classList.remove('is-open');
          var h = $('.pa-head', i);
          if (h) h.setAttribute('aria-expanded', 'false');
        });
        if (!isOpen) {
          item.classList.add('is-open');
          head.setAttribute('aria-expanded', 'true');
        }
      });
    });
  })();

  /* ---------------------------------------------------------------------
     FAQ accordion
     One panel open at a time — a long list stays scannable that way.
     --------------------------------------------------------------------- */
  (function faq() {
    var buttons = $$('.faq-q');
    if (!buttons.length) return;

    function close(item) {
      item.classList.remove('is-open');
      var btn = $('.faq-q', item);
      if (btn) btn.setAttribute('aria-expanded', 'false');
    }

    buttons.forEach(function (btn) {
      on(btn, 'click', function () {
        var item = btn.closest('.faq-item');
        if (!item) return;
        var wasOpen = item.classList.contains('is-open');
        var group = item.parentNode;

        $$('.faq-item', group).forEach(close);

        if (!wasOpen) {
          item.classList.add('is-open');
          btn.setAttribute('aria-expanded', 'true');
        }
      });
    });
  })();

  /* ---------------------------------------------------------------------
     Testimonials slider
     --------------------------------------------------------------------- */
  (function testimonials() {
    var viewport = $('.tst-viewport');
    var track = $('.tst-track');
    if (!viewport || !track) return;

    var slides = $$('.tst-slide', track);
    if (slides.length < 2) return;

    var dots = $$('.tst-dot');
    var index = 0;
    var timer = null;

    function go(i) {
      index = (i + slides.length) % slides.length;
      var offset = index * 100;
      track.style.transform = 'translateX(' + (isRTL ? offset : -offset) + '%)';
      dots.forEach(function (d, di) { d.classList.toggle('is-active', di === index); });
      slides.forEach(function (s, si) { s.setAttribute('aria-hidden', si === index ? 'false' : 'true'); });
    }
    function next() { go(index + 1); }
    function prev() { go(index - 1); }
    function play() { if (!reduceMotion) { stop(); timer = setInterval(next, 7000); } }
    function stop() { if (timer) { clearInterval(timer); timer = null; } }

    on($('.tst-arrow--next'), 'click', function () { next(); play(); });
    on($('.tst-arrow--prev'), 'click', function () { prev(); play(); });
    dots.forEach(function (dot, i) { on(dot, 'click', function () { go(i); play(); }); });

    on(viewport, 'mouseenter', stop);
    on(viewport, 'mouseleave', play);
    on(viewport, 'focusin', stop);

    // Pause while the tab is hidden — no work off-screen.
    on(doc, 'visibilitychange', function () { doc.hidden ? stop() : play(); });

    // Touch swipe
    var startX = 0, delta = 0, dragging = false;
    on(viewport, 'touchstart', function (e) {
      startX = e.touches[0].clientX; delta = 0; dragging = true; stop();
    }, { passive: true });
    on(viewport, 'touchmove', function (e) {
      if (dragging) delta = e.touches[0].clientX - startX;
    }, { passive: true });
    on(viewport, 'touchend', function () {
      if (dragging && Math.abs(delta) > 45) {
        var forward = isRTL ? delta > 0 : delta < 0;
        if (forward) next(); else prev();
      }
      dragging = false;
      play();
    });

    go(0);
    play();
  })();

  /* ---------------------------------------------------------------------
     Portfolio filter (Fetch API, updates the URL without a reload)
     --------------------------------------------------------------------- */
  (function portfolio() {
    var grid = $('#workGrid');
    var filters = $$('.filter[data-cat]');
    if (!grid || !filters.length) return;

    var endpoint = grid.getAttribute('data-endpoint');
    if (!endpoint) return;

    var pager = $('#workPager');

    function load(cat, push) {
      grid.classList.add('is-loading');
      fetch(endpoint + '?category=' + encodeURIComponent(cat), {
        headers: { 'X-Requested-With': 'XMLHttpRequest', 'Accept': 'application/json' },
        credentials: 'same-origin'
      })
        .then(function (r) { return r.json(); })
        .then(function (data) {
          if (!data || !data.ok) throw new Error('bad response');
          grid.innerHTML = data.html || '';
          if (!data.html) {
            grid.innerHTML = '<div class="empty" style="grid-column:1/-1">' +
              (grid.getAttribute('data-empty') || '') + '</div>';
          }
          if (pager) pager.style.display = data.totalPages > 1 ? '' : 'none';
          $$('[data-reveal]', grid).forEach(function (el) { el.classList.add('is-in'); });
          if (push && window.history && window.history.replaceState) {
            var url = new URL(window.location.href);
            if (cat && cat !== 'all') url.searchParams.set('category', cat);
            else url.searchParams.delete('category');
            url.searchParams.delete('page');
            window.history.replaceState({}, '', url.toString());
          }
        })
        .catch(function () { /* leave the current grid in place on failure */ })
        .then(function () { grid.classList.remove('is-loading'); });
    }

    filters.forEach(function (btn) {
      on(btn, 'click', function () {
        if (btn.classList.contains('is-active')) return;
        filters.forEach(function (b) {
          b.classList.remove('is-active');
          b.setAttribute('aria-pressed', 'false');
        });
        btn.classList.add('is-active');
        btn.setAttribute('aria-pressed', 'true');
        load(btn.getAttribute('data-cat'), true);
      });
    });
  })();

  /* ---------------------------------------------------------------------
     Contact form (Fetch API with graceful fallback to a normal POST)
     --------------------------------------------------------------------- */
  (function contactForm() {
    var form = $('#contactForm');
    if (!form) return;

    var button = $('[type="submit"]', form);
    var alertBox = $('#formAlert');
    var labelIdle = button ? button.getAttribute('data-label') || button.textContent.trim() : '';
    var labelBusy = button ? button.getAttribute('data-busy') || labelIdle : '';

    function clearErrors() {
      $$('.field-error', form).forEach(function (el) { el.textContent = ''; });
      $$('.has-error', form).forEach(function (el) { el.classList.remove('has-error'); });
    }
    function showAlert(type, message) {
      if (!alertBox) return;
      alertBox.className = 'alert alert--' + type;
      alertBox.innerHTML = '<svg class="icon" width="20" height="20" viewBox="0 0 24 24" fill="none" ' +
        'stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' +
        (type === 'success' ? '<path d="m5 12.5 4.5 4.5L19 7"/>' : '<circle cx="12" cy="12" r="9"/><path d="M12 8v5M12 16h.01"/>') +
        '</svg><span></span>';
      $('span', alertBox).textContent = message;
      alertBox.hidden = false;
      alertBox.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
    }

    on(form, 'submit', function (e) {
      if (!window.fetch) return; // let the browser POST normally
      e.preventDefault();
      clearErrors();
      if (alertBox) alertBox.hidden = true;

      if (button) { button.disabled = true; button.textContent = labelBusy; }

      fetch(form.getAttribute('data-endpoint') || form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'X-Requested-With': 'XMLHttpRequest', 'Accept': 'application/json' },
        credentials: 'same-origin'
      })
        .then(function (r) { return r.json().then(function (d) { return { status: r.status, data: d }; }); })
        .then(function (res) {
          var data = res.data || {};
          if (data.ok) {
            form.reset();
            showAlert('success', data.message || '');
          } else {
            if (data.errors) {
              Object.keys(data.errors).forEach(function (key) {
                var input = form.querySelector('[name="' + key + '"]');
                var err = form.querySelector('[data-error-for="' + key + '"]');
                if (input) input.classList.add('has-error');
                if (err) err.textContent = data.errors[key];
              });
            }
            showAlert('error', data.message || '');
          }
        })
        .catch(function () {
          showAlert('error', form.getAttribute('data-error') || 'Error');
        })
        .then(function () {
          if (button) { button.disabled = false; button.textContent = labelIdle; }
        });
    });
  })();

  /* ---------------------------------------------------------------------
     Floating contact panel
     Opens on click, closes on Escape, on an outside press, or once a
     channel is chosen.
     --------------------------------------------------------------------- */
  (function contactFab() {
    var wrap = $('[data-fab-contact]');
    if (!wrap) return;
    var btn = $('#fabToggle', wrap);
    var panel = $('#fabPanel', wrap);
    if (!btn || !panel) return;

    var open = false;

    function setOpen(next) {
      if (next === open) return;
      open = next;
      wrap.classList.toggle('is-open', open);
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      var label = btn.getAttribute(open ? 'data-label-close' : 'data-label-open');
      if (label) btn.setAttribute('aria-label', label);
      // The panel animates, so it is hidden by style rather than by the
      // attribute — but keep the attribute honest for assistive tech.
      if (open) panel.removeAttribute('hidden');
      else panel.setAttribute('hidden', '');
    }

    on(btn, 'click', function () { setOpen(!open); });
    $$('a', panel).forEach(function (a) {
      on(a, 'click', function () { setOpen(false); });
    });
    on(doc, 'pointerdown', function (e) {
      if (open && !wrap.contains(e.target)) setOpen(false);
    });
    on(doc, 'keydown', function (e) {
      if (open && e.key === 'Escape') { setOpen(false); btn.focus(); }
    });

    // Start closed whatever the server rendered.
    panel.setAttribute('hidden', '');
    btn.setAttribute('aria-expanded', 'false');
  })();
  /* ---------------------------------------------------------------------
     Back-to-top floatie
     --------------------------------------------------------------------- */
  (function backToTop() {
    var btn = $('.fab--top');
    if (!btn) return;
    var update = raf(function () { btn.classList.toggle('is-shown', window.scrollY > 620); });
    update();
    on(window, 'scroll', update, { passive: true });
    on(btn, 'click', function () {
      window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    });
  })();

  /* ---------------------------------------------------------------------
     Copy-link button on article pages
     --------------------------------------------------------------------- */
  (function copyLink() {
    $$('[data-copy-link]').forEach(function (btn) {
      on(btn, 'click', function () {
        var url = btn.getAttribute('data-copy-link') || window.location.href;
        var done = btn.getAttribute('data-done') || 'Copied';
        var original = btn.getAttribute('data-label') || btn.textContent.trim();
        var finish = function () {
          btn.textContent = done;
          setTimeout(function () { btn.textContent = original; }, 1800);
        };
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(url).then(finish).catch(function () {});
        } else {
          var tmp = doc.createElement('textarea');
          tmp.value = url;
          tmp.setAttribute('readonly', '');
          tmp.style.position = 'absolute';
          tmp.style.left = '-9999px';
          doc.body.appendChild(tmp);
          tmp.select();
          try { doc.execCommand('copy'); finish(); } catch (err) {}
          doc.body.removeChild(tmp);
        }
      });
    });
  })();

  /* ---------------------------------------------------------------------
     Hero video — only attach a source on capable, non-metered clients
     --------------------------------------------------------------------- */
  (function heroVideo() {
    var video = $('#heroVideo');
    if (!video) return;

    var src = video.getAttribute('data-src');
    if (!src) return;

    var conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    var saveData = conn && conn.saveData;
    var slow = conn && /(^|\W)(2g|slow-2g)(\W|$)/.test(String(conn.effectiveType));

    // Phones get the footage too — it is the hero. Metered, very slow or
    // reduced-motion clients keep the poster frame instead.
    if (saveData || slow || reduceMotion) return;

    var source = doc.createElement('source');
    source.src = src;
    source.type = video.getAttribute('data-type') || 'video/mp4';
    video.appendChild(source);
    video.load();

    function play() {
      var p = video.play();
      if (p && p.catch) p.catch(function () {});
    }

    play();
    video.classList.add('is-live');
    var poster = $('#heroPoster');
    if (poster) poster.style.opacity = '0';

    // No decoding work while the hero is off-screen or the tab is hidden.
    on(doc, 'visibilitychange', function () { doc.hidden ? video.pause() : play(); });
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) { entry.isIntersecting ? play() : video.pause(); });
      }, { threshold: 0.01 }).observe(video);
    }
  })();

  /* ---------------------------------------------------------------------
     Blog live search suggestions
     --------------------------------------------------------------------- */
  (function blogSearch() {
    var input = $('#blogSearch');
    var box = $('#searchSuggest');
    if (!input || !box) return;

    var endpoint = input.getAttribute('data-endpoint');
    var timer = null;

    function hide() { box.hidden = true; box.innerHTML = ''; }

    on(input, 'input', function () {
      var q = input.value.trim();
      if (timer) clearTimeout(timer);
      if (q.length < 2) { hide(); return; }
      timer = setTimeout(function () {
        fetch(endpoint + '?q=' + encodeURIComponent(q), {
          headers: { 'X-Requested-With': 'XMLHttpRequest', 'Accept': 'application/json' },
          credentials: 'same-origin'
        })
          .then(function (r) { return r.json(); })
          .then(function (data) {
            if (!data || !data.ok || !data.items || !data.items.length) { hide(); return; }
            box.innerHTML = data.items.map(function () {
              return '<a href="#"><b></b><span></span></a>';
            }).join('');
            $$('a', box).forEach(function (a, i) {
              a.setAttribute('href', data.items[i].url);
              $('b', a).textContent = data.items[i].title;
              $('span', a).textContent = data.items[i].excerpt;
            });
            box.hidden = false;
          })
          .catch(hide);
      }, 260);
    });

    on(doc, 'click', function (e) {
      if (!box.contains(e.target) && e.target !== input) hide();
    });
    on(input, 'keydown', function (e) { if (e.key === 'Escape') hide(); });
  })();

  /* ---------------------------------------------------------------------
     Native lazy-loading fallback for very old browsers
     --------------------------------------------------------------------- */
  (function lazyFallback() {
    if ('loading' in HTMLImageElement.prototype) return;
    if (!('IntersectionObserver' in window)) return;
    var imgs = $$('img[loading="lazy"][data-src]');
    if (!imgs.length) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var img = entry.target;
        img.src = img.getAttribute('data-src');
        io.unobserve(img);
      });
    }, { rootMargin: '200px' });
    imgs.forEach(function (img) { io.observe(img); });
  })();
})();

/* =========================================================================
   Lightbox for customer review screenshots — a[data-lightbox="group"]
   Large view, zoom (buttons, wheel, double-click / double-tap, pinch),
   pan while zoomed, swipe and arrow keys between images, Esc to close.
   Standalone, so it sits after the main bundle.
   ========================================================================= */
(function () {
  'use strict';

  var doc = document;
  var links = Array.prototype.slice.call(doc.querySelectorAll('a[data-lightbox]'));
  if (!links.length) return;

  var root = doc.documentElement;
  var rtl = root.getAttribute('dir') === 'rtl';
  var L = rtl
    ? { dialog: 'معاينة الصورة', close: 'إغلاق', prev: 'السابق', next: 'التالي', zin: 'تكبير', zout: 'تصغير', reset: 'الحجم الأصلي', full: 'ملء الشاشة', desktop: 'Desktop', mobile: 'Mobile',
        hint: 'اضغط مرتين أو استخدم عجلة الماوس للتكبير — اسحب أو استخدم الأسهم للتنقل' }
    : { dialog: 'Image preview', close: 'Close', prev: 'Previous', next: 'Next', zin: 'Zoom in', zout: 'Zoom out', reset: 'Actual size', full: 'Fullscreen', desktop: 'Desktop', mobile: 'Mobile',
        hint: 'Double-click or scroll to zoom — swipe or use the arrow keys to browse' };
  var MIN = 1, MAX = 4, STEP = 0.5;

  var ICON = {
    close: '<path d="M6 6l12 12M18 6 6 18"/>',
    prev:  '<path d="M15 5l-7 7 7 7"/>',
    next:  '<path d="M9 5l7 7-7 7"/>',
    zin:   '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5M11 8v6M8 11h6"/>',
    zout:  '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5M8 11h6"/>',
    reset: '<path d="M4 9V4h5M20 15v5h-5M4 4l6 6M20 20l-6-6"/>',
    full:  '<path d="M8 3H3v5M16 3h5v5M8 21H3v-5M16 21h5v-5"/>'
  };
  function button(cls, name, label) {
    return '<button type="button" class="lb__btn ' + cls + '" aria-label="' + label + '" title="' + label + '">' +
      '<svg viewBox="0 0 24 24" aria-hidden="true">' + ICON[name] + '</svg></button>';
  }

  var box = doc.createElement('div');
  box.className = 'lb';
  box.setAttribute('role', 'dialog');
  box.setAttribute('aria-modal', 'true');
  box.setAttribute('aria-label', L.dialog);
  box.setAttribute('aria-hidden', 'true');
  box.innerHTML =
    '<div class="lb__backdrop"></div>' +
    '<div class="lb__bar">' +
      '<span class="lb__count" aria-live="polite"></span>' +
      '<div class="lb__kinds" role="group"></div>' +
      '<div class="lb__tools">' + button('lb__zout', 'zout', L.zout) + '<span class="lb__zoom">100%</span>' +
        button('lb__zin', 'zin', L.zin) + button('lb__reset', 'reset', L.reset) + button('lb__full', 'full', L.full) + '</div>' +
      button('lb__close', 'close', L.close) +
    '</div>' +
    '<div class="lb__stage"><img class="lb__img" alt="" draggable="false"></div>' +
    '<div class="lb__foot">' + L.hint + '</div>' +
    button('lb__nav lb__nav--prev', 'prev', L.prev) +
    button('lb__nav lb__nav--next', 'next', L.next);
  doc.body.appendChild(box);
  box.inert = true;

  function q(sel) { return box.querySelector(sel); }
  var stage = q('.lb__stage'), img = q('.lb__img'), counter = q('.lb__count'), zoomLabel = q('.lb__zoom');
  var bPrev = q('.lb__nav--prev'), bNext = q('.lb__nav--next');
  var bIn = q('.lb__zin'), bOut = q('.lb__zout'), bReset = q('.lb__reset'), bClose = q('.lb__close');
  var kindsBar = q('.lb__kinds'), bFull = q('.lb__full');

  var items = [], index = 0, isOpen = false, lastFocus = null;
  var scale = 1, tx = 0, ty = 0;

  /* ---- Transform ---------------------------------------------------- */
  function apply() {
    // Keep the zoomed image covering the stage instead of drifting off it.
    var mx = Math.max(0, (img.offsetWidth * scale - stage.clientWidth) / 2);
    var my = Math.max(0, (img.offsetHeight * scale - stage.clientHeight) / 2);
    tx = Math.min(mx, Math.max(-mx, tx));
    ty = Math.min(my, Math.max(-my, ty));
    img.style.transform = 'translate3d(' + tx + 'px,' + ty + 'px,0) scale(' + scale + ')';
    zoomLabel.textContent = Math.round(scale * 100) + '%';
    bOut.disabled = scale <= MIN;
    bIn.disabled = scale >= MAX;
    bReset.disabled = scale <= MIN;
    stage.classList.toggle('is-zoomed', scale > MIN);
  }

  /* Zoom to `next`, keeping the point (cx, cy) — relative to the stage centre — still. */
  function zoomTo(next, cx, cy) {
    next = Math.min(MAX, Math.max(MIN, next));
    if (next < 1.04) next = MIN;
    if (next === scale) return;
    cx = cx || 0;
    cy = cy || 0;
    var ratio = next / scale;
    tx = cx - (cx - tx) * ratio;
    ty = cy - (cy - ty) * ratio;
    scale = next;
    if (scale === MIN) { tx = 0; ty = 0; }
    apply();
  }

  function pointFrom(x, y) {
    var r = stage.getBoundingClientRect();
    return [x - r.left - r.width / 2, y - r.top - r.height / 2];
  }

  /* ---- Open / close / navigate ------------------------------------- */
  function show(i) {
    var n = items.length;
    index = ((i % n) + n) % n;
    scale = 1; tx = 0; ty = 0;

    var link = items[index];
    img.classList.add('is-loading');
    img.onload = function () { img.classList.remove('is-loading'); apply(); };
    img.onerror = function () { img.classList.remove('is-loading'); };
    img.src = link.href;
    img.alt = link.getAttribute('aria-label') || '';
    if (img.complete && img.naturalWidth) img.classList.remove('is-loading');

    counter.textContent = (index + 1) + ' / ' + n;
    syncKinds();
    var multi = n > 1;
    bPrev.style.display = multi ? '' : 'none';
    bNext.style.display = multi ? '' : 'none';
    apply();

    if (multi) {
      [index + 1, index - 1].forEach(function (k) { (new Image()).src = items[(k + n) % n].href; });
    }
  }

  function open(link) {
    var group = link.getAttribute('data-lightbox');
    items = links.filter(function (a) { return a.getAttribute('data-lightbox') === group; });
    lastFocus = doc.activeElement;
    isOpen = true;
    box.inert = false;
    box.removeAttribute('aria-hidden');
    box.classList.add('is-open');
    root.classList.add('lb-lock');
    buildKinds();
    show(items.indexOf(link));
    try { bClose.focus({ preventScroll: true }); } catch (e) { bClose.focus(); }
  }

  function close() {
    if (!isOpen) return;
    isOpen = false;
    box.classList.remove('is-open');
    box.setAttribute('aria-hidden', 'true');
    box.inert = true;
    if (fullscreenElement()) { try { (doc.exitFullscreen || doc.webkitExitFullscreen).call(doc); } catch (e) {} }
    root.classList.remove('lb-lock');
    if (lastFocus && lastFocus.focus) {
      try { lastFocus.focus({ preventScroll: true }); } catch (e) { lastFocus.focus(); }
    }
  }

  function step(forward) {
    if (items.length > 1) show(index + (forward ? 1 : -1));
  }

  links.forEach(function (a) {
    a.addEventListener('click', function (e) {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button > 0) return;
      e.preventDefault();
      open(a);
    });
  });

  bClose.addEventListener('click', close);
  q('.lb__backdrop').addEventListener('click', close);
  bPrev.addEventListener('click', function () { step(false); });
  bNext.addEventListener('click', function () { step(true); });
  bIn.addEventListener('click', function () { zoomTo(scale + STEP); });
  bOut.addEventListener('click', function () { zoomTo(scale - STEP); });
  bReset.addEventListener('click', function () { zoomTo(MIN); });

  /* ---- Desktop / Mobile switch and fullscreen ----------------------- */
  // Links in a group may carry data-kind="desktop|mobile"; with two or more
  // kinds the bar shows a switch that jumps to the first image of each kind.
  function buildKinds() {
    kindsBar.innerHTML = '';
    var kinds = [];
    items.forEach(function (a) {
      var kind = a.getAttribute('data-kind');
      if (kind && kinds.indexOf(kind) === -1) kinds.push(kind);
    });
    if (kinds.length < 2) return;
    kinds.forEach(function (kind) {
      var b = doc.createElement('button');
      b.type = 'button';
      b.className = 'lb__kind';
      b.setAttribute('data-kind', kind);
      b.textContent = L[kind] || kind;
      b.addEventListener('click', function () {
        for (var i = 0; i < items.length; i++) {
          if (items[i].getAttribute('data-kind') === kind) { show(i); return; }
        }
      });
      kindsBar.appendChild(b);
    });
  }
  function syncKinds() {
    var current = items[index] ? items[index].getAttribute('data-kind') : '';
    Array.prototype.forEach.call(kindsBar.children, function (b) {
      var on = b.getAttribute('data-kind') === current;
      b.classList.toggle('is-active', on);
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
  }
  function fullscreenElement() { return doc.fullscreenElement || doc.webkitFullscreenElement || null; }
  if (!(box.requestFullscreen || box.webkitRequestFullscreen)) bFull.style.display = 'none';
  bFull.addEventListener('click', function () {
    try {
      if (fullscreenElement()) (doc.exitFullscreen || doc.webkitExitFullscreen).call(doc);
      else (box.requestFullscreen || box.webkitRequestFullscreen).call(box);
    } catch (e) {}
  });
  doc.addEventListener('fullscreenchange', function () { if (isOpen) apply(); });

  /* ---- Keyboard ------------------------------------------------------ */
  doc.addEventListener('keydown', function (e) {
    if (!isOpen) return;
    var k = e.key;
    if (k === 'Escape') { e.preventDefault(); close(); }
    else if (k === 'ArrowRight' || k === 'ArrowLeft') {
      e.preventDefault();
      // In RTL the next image sits to the left.
      step((k === 'ArrowRight') !== rtl);
    }
    else if (k === '+' || k === '=') { e.preventDefault(); zoomTo(scale + STEP); }
    else if (k === '-' || k === '_') { e.preventDefault(); zoomTo(scale - STEP); }
    else if (k === '0') { e.preventDefault(); zoomTo(MIN); }
    else if (k === 'Tab') {
      var focusable = Array.prototype.slice.call(box.querySelectorAll('button'))
        .filter(function (b) { return !b.disabled && b.offsetParent !== null; });
      if (!focusable.length) return;
      var first = focusable[0], last = focusable[focusable.length - 1];
      if (!box.contains(doc.activeElement)) { e.preventDefault(); first.focus(); }
      else if (e.shiftKey && doc.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && doc.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  /* ---- Wheel and double-click zoom ---------------------------------- */
  stage.addEventListener('wheel', function (e) {
    if (!isOpen) return;
    e.preventDefault();
    var p = pointFrom(e.clientX, e.clientY);
    zoomTo(scale * (e.deltaY < 0 ? 1.2 : 1 / 1.2), p[0], p[1]);
  }, { passive: false });

  stage.addEventListener('dblclick', function (e) {
    var p = pointFrom(e.clientX, e.clientY);
    zoomTo(scale > MIN ? MIN : 2.5, p[0], p[1]);
  });

  /* ---- Pointer: pan, pinch, swipe, tap ------------------------------ */
  var pointers = {}, pinchStart = 0, pinchScale = 1, pan = null, moved = false, downTarget = null, lastTap = 0;

  function active() { return Object.keys(pointers).map(function (k) { return pointers[k]; }); }

  stage.addEventListener('pointerdown', function (e) {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    if (stage.setPointerCapture) { try { stage.setPointerCapture(e.pointerId); } catch (err) {} }
    pointers[e.pointerId] = { x: e.clientX, y: e.clientY };
    var list = active();
    if (list.length === 1) {
      downTarget = e.target;
      moved = false;
      pan = { x: e.clientX, y: e.clientY, tx: tx, ty: ty };
    } else if (list.length === 2) {
      pinchStart = Math.hypot(list[0].x - list[1].x, list[0].y - list[1].y);
      pinchScale = scale;
      pan = null;
      moved = true;
    }
  });

  stage.addEventListener('pointermove', function (e) {
    if (!pointers[e.pointerId]) return;
    pointers[e.pointerId] = { x: e.clientX, y: e.clientY };
    var list = active();

    if (list.length === 2 && pinchStart) {
      var d = Math.hypot(list[0].x - list[1].x, list[0].y - list[1].y);
      var p = pointFrom((list[0].x + list[1].x) / 2, (list[0].y + list[1].y) / 2);
      zoomTo(pinchScale * d / pinchStart, p[0], p[1]);
    } else if (list.length === 1 && pan) {
      var dx = e.clientX - pan.x, dy = e.clientY - pan.y;
      if (Math.abs(dx) > 4 || Math.abs(dy) > 4) moved = true;
      if (scale > MIN && moved) {
        stage.classList.add('is-panning');
        tx = pan.tx + dx;
        ty = pan.ty + dy;
        apply();
      }
    }
  });

  function release(e) {
    if (!pointers[e.pointerId]) return;
    var count = active().length;
    delete pointers[e.pointerId];
    stage.classList.remove('is-panning');

    if (count === 2) {
      // One finger lifted mid-pinch: carry on panning with the other.
      pinchStart = 0;
      var rest = active()[0];
      pan = rest ? { x: rest.x, y: rest.y, tx: tx, ty: ty } : null;
      return;
    }
    if (count !== 1 || !pan) return;

    var dx = e.clientX - pan.x, dy = e.clientY - pan.y;
    pan = null;

    if (scale === MIN && moved && Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.4) {
      step((dx < 0) !== rtl);
      return;
    }
    if (moved || e.type === 'pointercancel') return;

    if (e.pointerType !== 'mouse') {
      var now = Date.now();
      if (now - lastTap < 300) {
        lastTap = 0;
        var p = pointFrom(e.clientX, e.clientY);
        zoomTo(scale > MIN ? MIN : 2.5, p[0], p[1]);
        return;
      }
      lastTap = now;
    }
    // A tap on the empty space around the image closes the lightbox.
    if (downTarget === stage && scale === MIN) close();
  }
  stage.addEventListener('pointerup', release);
  stage.addEventListener('pointercancel', release);

  window.addEventListener('resize', function () { if (isOpen) apply(); });
})();

/* =========================================================================
   Article page: reading progress bar and the active table-of-contents entry.
   ========================================================================= */
(function () {
  'use strict';

  var doc = document;
  var bar = doc.querySelector('[data-read-progress] span');
  var article = doc.querySelector('[data-article]');

  if (bar && article) {
    var ticking = false;
    var update = function () {
      ticking = false;
      var rect = article.getBoundingClientRect();
      var span = article.offsetHeight - window.innerHeight * 0.6;
      var progress = span > 0 ? Math.min(1, Math.max(0, -rect.top / span)) : 1;
      bar.style.transform = 'scaleX(' + progress.toFixed(4) + ')';
    };
    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; window.requestAnimationFrame(update); }
    }, { passive: true });
    window.addEventListener('resize', update);
    update();
  }

  var links = Array.prototype.slice.call(doc.querySelectorAll('.bl-toc a[href^="#"]'));
  if (!links.length || !('IntersectionObserver' in window)) return;

  var byId = {};
  links.forEach(function (a) { byId[decodeURIComponent(a.getAttribute('href').slice(1))] = a; });
  var current = null;

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      var link = byId[entry.target.id];
      if (!link || link === current) return;
      if (current) current.classList.remove('is-active');
      current = link;
      current.classList.add('is-active');
    });
  }, { rootMargin: '-15% 0px -70% 0px' });

  Object.keys(byId).forEach(function (id) {
    var heading = doc.getElementById(id);
    if (heading) observer.observe(heading);
  });
})();

/* =========================================================================
   FAQ page: accordion (one answer open at a time) and topic filter.
   ========================================================================= */
(function () {
  'use strict';

  var doc = document;
  var list = doc.querySelector('[data-fq-list]');
  if (!list) return;

  var items = Array.prototype.slice.call(list.querySelectorAll('[data-fq-item]'));
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function setOpen(item, open) {
    item.classList.toggle('is-open', open);
    item.querySelector('.fq-q').setAttribute('aria-expanded', open ? 'true' : 'false');
  }

  items.forEach(function (item) {
    item.querySelector('.fq-q').addEventListener('click', function () {
      var willOpen = !item.classList.contains('is-open');
      items.forEach(function (other) {
        if (other !== item && other.classList.contains('is-open')) setOpen(other, false);
      });
      setOpen(item, willOpen);
    });
  });

  // A link to #fq-q-<id> opens that question.
  if (window.location.hash) {
    var target = doc.getElementById(decodeURIComponent(window.location.hash.slice(1)));
    var linked = target && target.closest('[data-fq-item]');
    if (linked) setOpen(linked, true);
  }

  var filters = Array.prototype.slice.call(doc.querySelectorAll('[data-fq-filter]'));
  var empty = doc.querySelector('[data-fq-empty]');

  filters.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var topic = btn.getAttribute('data-fq-filter');
      filters.forEach(function (b) {
        var on = b === btn;
        b.classList.toggle('is-active', on);
        b.setAttribute('aria-pressed', on ? 'true' : 'false');
      });

      var shown = 0;
      items.forEach(function (item) {
        var match = topic === 'all' || item.getAttribute('data-topic') === topic;
        if (!match && item.classList.contains('is-open')) setOpen(item, false);
        item.hidden = !match;
        if (!match) return;
        item.classList.add('is-in'); // skip the scroll-reveal wait for filtered items
        if (!reduce) {
          item.classList.remove('fq-enter');
          void item.offsetWidth;
          item.style.animationDelay = (shown * 40) + 'ms';
          item.classList.add('fq-enter');
        }
        shown++;
      });
      if (empty) empty.hidden = shown > 0;
    });
  });
})();

/* =========================================================================
   Contact page: inline validation that runs before the existing submit
   handler (capture phase), plus the success view once it reports back.
   The request itself is still sent by the contactForm module above.
   ========================================================================= */
(function () {
  'use strict';

  var doc = document;
  var form = doc.getElementById('contactForm');
  var card = doc.getElementById('contactCard');
  if (!form || !card || !form.classList.contains('ct-form')) return;

  var alertBox = doc.getElementById('formAlert');
  var fields = Array.prototype.slice.call(form.querySelectorAll('[data-validate]'));
  var PHONE = /^[0-9+\-\s()]{7,25}$/;

  function check(input) {
    var value = input.value.trim();
    if (input.required && value === '') return input.getAttribute('data-msg-required') || '';
    if (input.name === 'phone' && !PHONE.test(value)) return input.getAttribute('data-msg-phone') || '';
    if (input.name === 'name' && value.length < 2) return input.getAttribute('data-msg-short') || '';
    if (input.name === 'message' && value.length < 10) return input.getAttribute('data-msg-short') || '';
    return '';
  }

  function show(input, message) {
    var field = input.closest('.ct-field');
    var out = form.querySelector('[data-error-for="' + input.name + '"]');
    if (field) field.classList.toggle('is-invalid', !!message);
    input.classList.toggle('has-error', !!message);
    input.setAttribute('aria-invalid', message ? 'true' : 'false');
    if (out) out.textContent = message;
  }

  fields.forEach(function (input) {
    var evt = input.tagName === 'SELECT' ? 'change' : 'input';
    input.addEventListener(evt, function () {
      if (input.getAttribute('aria-invalid') === 'true') show(input, check(input));
    });
    input.addEventListener('blur', function () {
      if (input.value.trim() !== '') show(input, check(input));
    });
  });

  form.addEventListener('submit', function (e) {
    var first = null;
    fields.forEach(function (input) {
      var message = check(input);
      show(input, message);
      if (message && !first) first = input;
    });
    if (!first) return;
    e.preventDefault();
    e.stopImmediatePropagation();
    first.focus();
    card.classList.remove('shake');
    void card.offsetWidth;
    card.classList.add('shake');
  }, true);

  // The existing module swaps the alert to "alert--success" once the server confirms.
  if (alertBox && window.MutationObserver) {
    new MutationObserver(function () {
      if (alertBox.classList.contains('alert--success') && !alertBox.hidden) {
        alertBox.hidden = true;
        card.classList.add('is-sent');
        card.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }).observe(alertBox, { attributes: true, attributeFilter: ['class', 'hidden'] });
  }

  var again = card.querySelector('[data-contact-again]');
  if (again) {
    again.addEventListener('click', function () {
      card.classList.remove('is-sent');
      fields.forEach(function (input) { show(input, ''); });
      var first = form.querySelector('#name');
      if (first) first.focus();
    });
  }
})();

/* =========================================================================
   Portfolio: category filter, search and "show more" ([data-pf]),
   project page Desktop/Mobile tabs, and buttons that open a preview.
   ========================================================================= */
(function () {
  'use strict';

  var doc = document;
  function all(sel, ctx) { return Array.prototype.slice.call((ctx || doc).querySelectorAll(sel)); }

  // Arabic-aware matching: ignore diacritics and common letter variants.
  function norm(s) {
    return String(s || '').toLowerCase()
      .replace(/[ً-ٰٟـ]/g, '')
      .replace(/[أإآ]/g, 'ا').replace(/ة/g, 'ه').replace(/ى/g, 'ي')
      .replace(/\s+/g, ' ').trim();
  }

  all('[data-pf]').forEach(function (root) {
    var grid = root.querySelector('[data-pf-grid]');
    if (!grid) return;
    var cards = all('[data-pf-card]', grid);
    var chips = all('[data-pf-filter]', root);
    var input = root.querySelector('[data-pf-search]');
    var moreWrap = root.querySelector('[data-pf-more-wrap]');
    var more = root.querySelector('[data-pf-more]');
    var moreN = root.querySelector('[data-pf-more-n]');
    var moreEnd = root.querySelector('[data-pf-more-end]');
    var expanded = false;
    var empty = root.querySelector('[data-pf-empty]');
    var countOut = root.querySelector('[data-pf-count]');
    var page = parseInt(grid.getAttribute('data-page') || '12', 10) || 12;
    var limit = page, category = 'all', query = '';

    cards.forEach(function (card) { card._text = norm(card.getAttribute('data-search')); });

    function apply(focusFirstNew) {
      var matched = 0, firstNew = null;
      cards.forEach(function (card) {
        var inCategory = category === 'all' || (' ' + card.getAttribute('data-cats') + ' ').indexOf(' ' + category + ' ') !== -1;
        var ok = inCategory && (query === '' || card._text.indexOf(query) !== -1);
        if (!ok) { card.hidden = true; return; }
        matched++;
        var visible = matched <= limit;
        var wasHidden = card.hidden;
        if (visible && wasHidden && !firstNew) firstNew = card;
        card.hidden = !visible;
        if (visible) card.classList.add('is-in');
        // Cards revealed by "show more" rise into place instead of appearing.
        if (visible && wasHidden && focusFirstNew) {
          card.classList.remove('pf-card--new');
          void card.offsetWidth;
          card.classList.add('pf-card--new');
        }
      });

      var left = matched - limit;
      if (moreWrap) moreWrap.hidden = left <= 0;
      if (moreN) moreN.textContent = left > 0 ? '+' + left : '';
      // "No more projects" only once the visitor has actually asked for more.
      if (moreEnd) moreEnd.hidden = !(expanded && left <= 0 && matched > 0);
      if (empty) empty.hidden = matched > 0;
      if (countOut) countOut.textContent = matched;
      if (focusFirstNew && firstNew) {
        var link = firstNew.querySelector('.pf-card__media');
        if (link) link.focus({ preventScroll: true });
      }
    }

    chips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        var value = chip.getAttribute('data-pf-filter');
        // Tapping the category you are already in goes back to every project.
        category = category === value ? 'all' : value;
        chips.forEach(function (c) {
          var on = c.getAttribute('data-pf-filter') === category;
          c.classList.toggle('is-active', on);
          c.setAttribute('aria-pressed', on ? 'true' : 'false');
        });
        limit = page;
        expanded = false;
        apply(false);
      });
    });

    if (input) {
      var timer = 0;
      input.addEventListener('input', function () {
        window.clearTimeout(timer);
        timer = window.setTimeout(function () {
          query = norm(input.value);
          limit = page;
          expanded = false;
          apply(false);
        }, 160);
      });
    }

    if (more) {
      // Stays on the page: the next batch is already here, just not shown yet.
      more.addEventListener('click', function () {
        limit += page;
        expanded = true;
        apply(true);
      });
    }

    apply(false);
  });

  // Project page: switch the device preview.
  all('[data-pd-view]').forEach(function (wrap) {
    var tabs = all('[data-pd-tab]', wrap);
    var panels = all('[data-pd-panel]', wrap);
    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        var kind = tab.getAttribute('data-pd-tab');
        tabs.forEach(function (t) {
          var on = t === tab;
          t.classList.toggle('is-active', on);
          t.setAttribute('aria-selected', on ? 'true' : 'false');
        });
        panels.forEach(function (p) {
          var on = p.getAttribute('data-pd-panel') === kind;
          p.hidden = !on;
          p.classList.toggle('is-active', on);
        });
      });
    });
  });

  // A button that opens the preview of another element's image.
  doc.addEventListener('click', function (e) {
    var trigger = e.target.closest ? e.target.closest('[data-lb-trigger]') : null;
    if (!trigger) return;
    var target = doc.getElementById(trigger.getAttribute('data-lb-trigger'));
    if (!target) return;
    e.preventDefault();
    target.click();
  });
})();

/* =========================================================================
   Mobile drawer additions: one group open at a time (keeps the list short),
   bring an opened group into view, and the Light / Dark segmented control.
   Opening, closing, focus and scroll lock stay in the mobileNav module.
   ========================================================================= */
(function () {
  'use strict';

  var doc = document;
  var root = doc.documentElement;
  var drawer = doc.getElementById('mobileNav');
  if (!drawer || !drawer.classList.contains('md-drawer')) return;
  var body = drawer.querySelector('.md-body');
  var triggers = Array.prototype.slice.call(drawer.querySelectorAll('.mnav-trigger'));

  triggers.forEach(function (btn) {
    // Runs after the existing toggle handler, so aria-expanded is already updated.
    btn.addEventListener('click', function () {
      if (btn.getAttribute('aria-expanded') !== 'true') return;
      triggers.forEach(function (other) {
        if (other === btn || other.getAttribute('aria-expanded') !== 'true') return;
        other.setAttribute('aria-expanded', 'false');
        var list = doc.getElementById(other.getAttribute('aria-controls') || '');
        if (list) list.classList.remove('is-open');
      });
      var sub = doc.getElementById(btn.getAttribute('aria-controls') || '');
      if (!sub || !body) return;
      window.setTimeout(function () {
        var b = body.getBoundingClientRect();
        var s = sub.getBoundingClientRect();
        var t = btn.getBoundingClientRect();
        if (s.bottom > b.bottom - 8) {
          body.scrollBy({ top: Math.min(s.bottom - b.bottom + 12, t.top - b.top - 8), behavior: 'smooth' });
        }
      }, 320);
    });
  });

  var setters = Array.prototype.slice.call(drawer.querySelectorAll('[data-theme-set]'));
  function current() { return root.getAttribute('data-theme') === 'light' ? 'light' : 'dark'; }
  function sync() {
    var t = current();
    setters.forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-theme-set') === t ? 'true' : 'false'); });
  }
  setters.forEach(function (b) {
    b.addEventListener('click', function () {
      if (b.getAttribute('data-theme-set') === current()) return;
      // Reuse the site's own theme switch so storage, meta colour and
      // transitions stay in one place; fall back to a direct swap.
      var toggle = doc.querySelector('[data-theme-toggle]');
      if (toggle) { toggle.click(); return; }
      var next = b.getAttribute('data-theme-set');
      root.setAttribute('data-theme', next);
      try { localStorage.setItem('sitesnap-theme', next); } catch (e) {}
    });
  });
  if (window.MutationObserver) new MutationObserver(sync).observe(root, { attributes: true, attributeFilter: ['data-theme'] });
  sync();
})();

/* =========================================================================
   Homepage reviews slider — [data-rs]: arrows, dots, keyboard; RTL-aware.
   Autoplays every few seconds and loops (the arrows wrap around too);
   pauses while the visitor hovers, focuses, swipes or scrolls it, and
   resumes after a short pause. No autoplay with reduced motion.
   ========================================================================= */
(function () {
  'use strict';

  var doc = document;
  var rtl = doc.documentElement.getAttribute('dir') === 'rtl';
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  Array.prototype.forEach.call(doc.querySelectorAll('[data-rs]'), function (root) {
    var viewport = root.querySelector('.rs__viewport');
    var track = root.querySelector('.rs__track');
    var slides = Array.prototype.slice.call(root.querySelectorAll('.rs__slide'));
    var prev = root.querySelector('[data-rs-prev]');
    var next = root.querySelector('[data-rs-next]');
    var controls = root.querySelector('.rs__controls');
    var dotsWrap = root.querySelector('[data-rs-dots]');
    if (!viewport || !track || !slides.length) return;
    var dots = [];
    var ticking = false;

    function gap() { var cs = getComputedStyle(track); return parseFloat(cs.columnGap || cs.gap) || 0; }
    function perView() {
      var w = slides[0].getBoundingClientRect().width + gap();
      return Math.max(1, Math.floor((viewport.clientWidth + gap() + 2) / w));
    }
    function pages() { return Math.max(1, slides.length - perView() + 1); }
    function maxScroll() { return viewport.scrollWidth - viewport.clientWidth; }
    // RTL browsers report scrollLeft as zero or negative.
    function offset() { return Math.abs(viewport.scrollLeft); }
    function current() {
      if (offset() >= maxScroll() - 2) return pages() - 1;
      var vr = viewport.getBoundingClientRect();
      var best = 0;
      var min = Infinity;
      slides.forEach(function (s, i) {
        var r = s.getBoundingClientRect();
        var d = Math.abs(rtl ? vr.right - r.right : r.left - vr.left);
        if (d < min) { min = d; best = i; }
      });
      return Math.min(best, pages() - 1);
    }
    function go(i) {
      i = Math.max(0, Math.min(i, pages() - 1));
      var vr = viewport.getBoundingClientRect();
      var r = slides[i].getBoundingClientRect();
      viewport.scrollBy({ left: rtl ? r.right - vr.right : r.left - vr.left, behavior: reduce ? 'auto' : 'smooth' });
    }
    function buildDots() {
      var n = pages();
      if (controls) controls.style.display = n < 2 ? 'none' : '';
      if (!dotsWrap || dots.length === n) return;
      dotsWrap.innerHTML = '';
      dots = [];
      for (var i = 0; i < n; i++) {
        var b = doc.createElement('button');
        b.type = 'button';
        b.className = 'rs__dot';
        b.setAttribute('aria-label', (rtl ? 'الانتقال إلى الرأي ' : 'Go to review ') + (i + 1));
        (function (index) { b.addEventListener('click', function () { go(index); }); })(i);
        dotsWrap.appendChild(b);
        dots.push(b);
      }
    }
    function sync() {
      ticking = false;
      buildDots();
      var c = current();
      dots.forEach(function (d, i) { d.setAttribute('aria-current', i === c ? 'true' : 'false'); });
    }
    function queue() { if (!ticking) { ticking = true; window.requestAnimationFrame(sync); } }

    // Looping: past the last page comes the first, before the first the last.
    function step(dir) {
      var n = pages();
      go((current() + dir + n) % n);
    }

    // --- Autoplay ---------------------------------------------------------
    var idleUntil = 0;
    var hovering = false;
    var focused = false;
    var onScreen = true;
    function pauseForUser() { idleUntil = Date.now() + 6000; }
    function canPlay() {
      return !reduce && pages() > 1 && !hovering && !focused && onScreen && !doc.hidden && Date.now() >= idleUntil;
    }
    if (!reduce) {
      setInterval(function () { if (canPlay()) step(1); }, 4500);
      root.addEventListener('pointerenter', function (e) { if (e.pointerType === 'mouse') hovering = true; });
      root.addEventListener('pointerleave', function () { hovering = false; });
      root.addEventListener('focusin', function () { focused = true; });
      root.addEventListener('focusout', function (e) { if (!root.contains(e.relatedTarget)) focused = false; });
      ['pointerdown', 'touchstart', 'wheel', 'keydown'].forEach(function (type) {
        viewport.addEventListener(type, pauseForUser, { passive: true });
      });
      if ('IntersectionObserver' in window) {
        new IntersectionObserver(function (entries) { onScreen = entries[0].isIntersecting; }, { threshold: .25 }).observe(root);
      }
    }

    if (prev) prev.addEventListener('click', function () { pauseForUser(); step(-1); });
    if (next) next.addEventListener('click', function () { pauseForUser(); step(1); });
    viewport.addEventListener('scroll', queue, { passive: true });
    window.addEventListener('resize', queue);
    window.addEventListener('load', queue);
    viewport.addEventListener('keydown', function (e) {
      if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
      e.preventDefault();
      var forward = (e.key === 'ArrowRight') !== rtl;
      step(forward ? 1 : -1);
    });
    sync();
  });
})();

/* =========================================================================
   Voice explainers — [data-vn-card]: play/pause, progress, seeking.
   Audio is only fetched when a card is first played (preload="none"), and
   one card plays at a time.
   ========================================================================= */
(function () {
  'use strict';

  var doc = document;
  var cards = Array.prototype.slice.call(doc.querySelectorAll('[data-vn-card]'));
  if (!cards.length) return;

  var rtl = doc.documentElement.getAttribute('dir') === 'rtl';
  var players = [];

  function clock(seconds) {
    if (!isFinite(seconds) || seconds < 0) return '--:--';
    var m = Math.floor(seconds / 60);
    var s = Math.floor(seconds % 60);
    return m + ':' + (s < 10 ? '0' : '') + s;
  }

  cards.forEach(function (card) {
    var audio = card.querySelector('[data-vn-audio]');
    var play = card.querySelector('[data-vn-play]');
    var bar = card.querySelector('[data-vn-bar]');
    var fill = card.querySelector('[data-vn-fill]');
    var dot = card.querySelector('[data-vn-dot]');
    var time = card.querySelector('[data-vn-time]');
    // The big player prints the two times separately instead.
    var nowAt = card.querySelector('[data-vn-current]');
    var totalAt = card.querySelector('[data-vn-duration]');
    if (!audio || !play || !bar) return;

    // The label set server-side stands until the real length is known.
    var known = ((time ? time.textContent : (totalAt ? totalAt.textContent : '')) || '').trim();
    var scrubbing = false;

    function paint() {
      var total = audio.duration;
      var ratio = isFinite(total) && total > 0 ? Math.min(1, audio.currentTime / total) : 0;
      var pct = (ratio * 100).toFixed(2) + '%';
      fill.style.width = pct;
      if (dot) dot.style.insetInlineStart = pct;
      bar.setAttribute('aria-valuenow', Math.round(ratio * 100));
      bar.setAttribute('aria-valuetext', clock(audio.currentTime) + ' / ' + clock(total));
      if (time) {
        time.textContent = audio.currentTime > 0 || !isFinite(total)
          ? clock(audio.currentTime) + ' / ' + clock(total)
          : (isFinite(total) ? clock(total) : known || '--:--');
      }
      if (nowAt) nowAt.textContent = clock(audio.currentTime);
      if (totalAt) totalAt.textContent = isFinite(total) ? clock(total) : (known || '--:--');
    }

    function fail() {
      var note = rtl ? 'تعذر التشغيل' : 'Cannot play';
      if (time) time.textContent = note;
      if (totalAt) totalAt.textContent = note;
    }

    function stopOthers() {
      players.forEach(function (other) { if (other.audio !== audio) other.pause(); });
    }

    function pause() {
      audio.pause();
      card.classList.remove('is-playing', 'is-loading');
    }

    play.addEventListener('click', function () {
      if (!audio.paused) { pause(); return; }
      stopOthers();
      card.classList.remove('is-error');
      card.classList.add('is-loading');
      var started = audio.play();
      if (started && started.catch) {
        started.catch(function () {
          card.classList.remove('is-loading', 'is-playing');
          card.classList.add('is-error');
          fail();
        });
      }
    });

    audio.addEventListener('playing', function () { card.classList.remove('is-loading'); card.classList.add('is-playing'); });
    audio.addEventListener('waiting', function () { card.classList.add('is-loading'); });
    audio.addEventListener('pause', function () { card.classList.remove('is-playing', 'is-loading'); });
    audio.addEventListener('ended', function () { card.classList.remove('is-playing'); audio.currentTime = 0; paint(); });
    audio.addEventListener('loadedmetadata', paint);
    audio.addEventListener('timeupdate', function () { if (!scrubbing) paint(); });
    audio.addEventListener('error', function () {
      card.classList.remove('is-loading', 'is-playing');
      card.classList.add('is-error');
      fail();
    });

    // Seeking: the bar fills from its start edge, which flips in RTL.
    function seekTo(clientX) {
      var rect = bar.getBoundingClientRect();
      if (!rect.width || !isFinite(audio.duration)) return;
      var ratio = rtl ? (rect.right - clientX) / rect.width : (clientX - rect.left) / rect.width;
      audio.currentTime = Math.max(0, Math.min(1, ratio)) * audio.duration;
      paint();
    }

    bar.addEventListener('pointerdown', function (e) {
      if (!isFinite(audio.duration)) return;
      scrubbing = true;
      bar.setPointerCapture(e.pointerId);
      seekTo(e.clientX);
    });
    bar.addEventListener('pointermove', function (e) { if (scrubbing) seekTo(e.clientX); });
    ['pointerup', 'pointercancel'].forEach(function (evt) {
      bar.addEventListener(evt, function (e) {
        if (!scrubbing) return;
        scrubbing = false;
        if (bar.hasPointerCapture && bar.hasPointerCapture(e.pointerId)) bar.releasePointerCapture(e.pointerId);
      });
    });
    bar.addEventListener('keydown', function (e) {
      if (!isFinite(audio.duration)) return;
      var step = e.key === 'ArrowUp' || e.key === 'ArrowDown' ? 10 : 5;
      var forward = (e.key === 'ArrowRight') !== rtl || e.key === 'ArrowUp';
      if (['ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown'].indexOf(e.key) === -1) return;
      e.preventDefault();
      audio.currentTime = Math.max(0, Math.min(audio.duration, audio.currentTime + (forward ? step : -step)));
      paint();
    });

    players.push({ audio: audio, pause: pause });
    paint();
  });
})();

/* =========================================================================
   FAQ explorer — [data-fx]: search, topic panel and "most asked" jumps.
   Opening and closing answers stays with the FAQ accordion module above;
   this only decides which questions are shown.
   ========================================================================= */
(function () {
  'use strict';

  var doc = document;
  var root = doc.querySelector('[data-fx]');
  if (!root) return;

  var items = Array.prototype.slice.call(root.querySelectorAll('[data-fq-item]'));
  var topics = Array.prototype.slice.call(root.querySelectorAll('[data-fx-topic]'));
  var input = doc.querySelector('[data-fx-search]');
  var countOut = doc.querySelector('[data-fx-count]');
  var empty = root.querySelector('[data-fx-empty]');
  var popular = root.querySelector('[data-fx-popular]');
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var rtl = doc.documentElement.getAttribute('dir') === 'rtl';
  var topic = 'all';
  var query = '';

  // Arabic-aware matching: ignore diacritics, tatweel and letter variants.
  function norm(s) {
    return String(s || '').toLowerCase()
      .replace(/[ً-ٰٟـ]/g, '')
      .replace(/[أإآ]/g, 'ا').replace(/ة/g, 'ه').replace(/ى/g, 'ي')
      .replace(/\s+/g, ' ').trim();
  }
  items.forEach(function (item) { item._text = norm(item.textContent); });

  function closeItem(item) {
    item.classList.remove('is-open');
    var q = item.querySelector('.fq-q');
    if (q) q.setAttribute('aria-expanded', 'false');
  }

  function apply() {
    var shown = 0;
    items.forEach(function (item) {
      var ok = (topic === 'all' || item.getAttribute('data-topic') === topic) &&
               (query === '' || item._text.indexOf(query) !== -1);
      if (!ok && item.classList.contains('is-open')) closeItem(item);
      item.hidden = !ok;
      if (ok) { shown++; item.classList.add('is-in'); }
    });
    if (empty) empty.hidden = shown > 0;
    if (popular) popular.hidden = query !== '' || topic !== 'all';
    if (countOut) {
      countOut.textContent = query === '' ? '' :
        (rtl ? shown + ' نتيجة' : shown + (shown === 1 ? ' result' : ' results'));
    }
  }

  function setTopic(value) {
    topic = value;
    topics.forEach(function (btn) {
      var on = btn.getAttribute('data-fx-topic') === topic;
      btn.classList.toggle('is-active', on);
      btn.setAttribute('aria-pressed', on ? 'true' : 'false');
      // On phones the topics scroll sideways; keep the chosen one in view.
      if (on && btn.parentElement.scrollWidth > btn.parentElement.clientWidth) {
        btn.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: reduce ? 'auto' : 'smooth' });
      }
    });
  }

  topics.forEach(function (btn) {
    btn.addEventListener('click', function () {
      setTopic(btn.getAttribute('data-fx-topic'));
      apply();
    });
  });

  if (input) {
    var timer = 0;
    input.addEventListener('input', function () {
      window.clearTimeout(timer);
      timer = window.setTimeout(function () {
        query = norm(input.value);
        apply();
      }, 140);
    });
  }

  var reset = root.querySelector('[data-fx-reset]');
  if (reset) {
    reset.addEventListener('click', function () {
      if (input) input.value = '';
      query = '';
      setTopic('all');
      apply();
      if (input) input.focus();
    });
  }

  // "Most asked": show everything, open that question, bring it into view.
  Array.prototype.forEach.call(root.querySelectorAll('[data-fx-jump]'), function (link) {
    link.addEventListener('click', function (e) {
      var id = (link.getAttribute('href') || '').slice(1);
      var btn = id ? doc.getElementById(id) : null;
      var item = btn && btn.closest('[data-fq-item]');
      if (!item) return;
      e.preventDefault();
      if (input) input.value = '';
      query = '';
      setTopic('all');
      apply();
      if (!item.classList.contains('is-open')) btn.click();
      item.scrollIntoView({ block: 'center', behavior: reduce ? 'auto' : 'smooth' });
      if (window.history && window.history.replaceState) window.history.replaceState(null, '', '#' + id);
      btn.focus({ preventScroll: true });
    });
  });

  apply();
})();