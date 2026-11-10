/* Nexify — progressive enhancement. Every feature also works without JS
   (navigation wraps, language links are plain links, the form posts normally). */
(function () {
  'use strict';
  var doc = document.documentElement;
  doc.classList.remove('no-js');
  doc.classList.add('js');

  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  // ---- Reveal on scroll ----------------------------------------------------
  function initReveal() {
    var items = Array.prototype.slice.call(document.querySelectorAll('.reveal'));
    if (reduceMotion || !('IntersectionObserver' in window)) {
      items.forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }
    var vh = window.innerHeight;
    var io = new IntersectionObserver(function (entries) {
      // Items arriving together (a grid, a list) get a cascading stagger.
      var batch = 0;
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.style.transitionDelay = Math.min(batch++ * 85, 510) + 'ms';
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
    var stagger = 0;
    items.forEach(function (el) {
      var rect = el.getBoundingClientRect();
      if (rect.top < vh) {
        // Already on screen: show immediately (small stagger for polish).
        el.style.transitionDelay = Math.min(stagger++ * 60, 360) + 'ms';
        el.classList.add('is-visible');
      } else {
        io.observe(el);
      }
    });
  }

  // ---- Header ----------------------------------------------------------------
  function initHeader() {
    var header = document.querySelector('[data-header]');
    if (!header) return;
    var onScroll = function () { header.classList.toggle('is-scrolled', window.scrollY > 8); };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    var toggle = header.querySelector('[data-menu-toggle]');
    var panel = header.querySelector('[data-nav]');
    var label = header.querySelector('[data-menu-label]');
    if (!toggle || !panel) return;
    var mq = window.matchMedia('(max-width: 1120px)');

    function setOpen(open, focusToggle) {
      header.classList.toggle('is-open', open);
      document.body.classList.toggle('menu-open', open && mq.matches);
      toggle.setAttribute('aria-expanded', String(open));
      var text = open ? toggle.getAttribute('data-label-close') : toggle.getAttribute('data-label-open');
      if (label) label.textContent = text;
      if (mq.matches) {
        if (open) panel.removeAttribute('inert'); else panel.setAttribute('inert', '');
      }
      if (open) {
        var first = panel.querySelector('a, button');
        if (first) first.focus();
      } else if (focusToggle) {
        toggle.focus();
      }
    }
    function syncMode() {
      if (mq.matches) {
        if (!header.classList.contains('is-open')) panel.setAttribute('inert', '');
      } else {
        panel.removeAttribute('inert');
        header.classList.remove('is-open');
        document.body.classList.remove('menu-open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    }
    syncMode();
    if (mq.addEventListener) mq.addEventListener('change', syncMode); else mq.addListener(syncMode);

    toggle.addEventListener('click', function () {
      setOpen(toggle.getAttribute('aria-expanded') !== 'true', false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && header.classList.contains('is-open')) setOpen(false, true);
    });
    document.addEventListener('click', function (e) {
      if (header.classList.contains('is-open') && !header.contains(e.target)) setOpen(false, false);
    });
    // Keep keyboard focus inside the open menu (toggle + panel).
    header.addEventListener('keydown', function (e) {
      if (e.key !== 'Tab' || !header.classList.contains('is-open') || !mq.matches) return;
      var focusables = [toggle].concat(Array.prototype.slice.call(panel.querySelectorAll('a[href], button:not([disabled])')));
      var first = focusables[0];
      var last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });
  }

  // ---- Toast + copy ----------------------------------------------------------
  var toastTimer;
  function toast(message) {
    var el = document.querySelector('[data-toast]');
    if (!el) return;
    el.textContent = message;
    el.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { el.classList.remove('is-visible'); }, 2600);
  }

  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(text);
    return new Promise(function (resolve, reject) {
      var ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand('copy') ? resolve() : reject(new Error('copy failed')); }
      catch (err) { reject(err); }
      finally { document.body.removeChild(ta); }
    });
  }

  function initCopy() {
    document.addEventListener('click', function (e) {
      var btn = e.target.closest && e.target.closest('[data-copy]');
      if (!btn) return;
      var value = btn.getAttribute('data-copy');
      copyText(value).then(
        function () {
          toast(btn.getAttribute('data-copied') + ': ' + value);
          btn.classList.add('is-copied');
          clearTimeout(btn._copiedTimer);
          btn._copiedTimer = setTimeout(function () { btn.classList.remove('is-copied'); }, 1800);
        },
        function () { toast(btn.getAttribute('data-failed')); }
      );
    });
  }

  // ---- Contact form ------------------------------------------------------------
  var SVG_OPEN = '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">';
  var STATUS_ICONS = {
    success: SVG_OPEN + '<path d="m5 12.5 4.5 4.5L19 7.5"/></svg>',
    error: SVG_OPEN + '<circle cx="12" cy="12" r="9"/><path d="M12 7.5v5.5M12 16.5v.01"/></svg>',
  };
  var EMAIL_RE = /^[^\s@<>()[\]\\,;:"]+@[^\s@<>()[\]\\,;:"]+\.[^\s@<>()[\]\\,;:"]{2,}$/;

  function fill(str, vars) {
    return String(str).replace(/\{(\w+)\}/g, function (m, k) { return k in vars ? vars[k] : m; });
  }

  function initContact() {
    var form = document.querySelector('[data-contact-form]');
    if (!form) return;
    var limits = JSON.parse(form.getAttribute('data-limits'));
    var i18n = JSON.parse(form.getAttribute('data-i18n'));
    var statusEl = form.parentNode.querySelector('[data-status]');
    var submit = form.querySelector('[data-submit]');
    var submitLabel = form.querySelector('[data-submit-label]');
    var msg = form.elements.message;
    var counter = form.querySelector('[data-counter]');
    var touched = {};

    function updateCounter() {
      if (!counter) return;
      var len = msg.value.length;
      counter.textContent = fill(i18n.counter, { count: len, max: limits.message.max });
      counter.classList.toggle('is-over', len > limits.message.max);
    }
    msg.addEventListener('input', updateCounter);
    updateCounter();

    function validateField(name) {
      var v = (form.elements[name].value || '').trim();
      var L = limits[name];
      var e = i18n.errors;
      if (name === 'name') { if (!v) return e.nameRequired; if (v.length > L.max) return fill(e.nameTooLong, L); }
      if (name === 'email') { if (!v) return e.emailRequired; if (v.length > L.max) return fill(e.emailTooLong, L); if (!EMAIL_RE.test(v)) return e.emailInvalid; }
      if (name === 'subject') { if (!v) return e.subjectRequired; if (v.length > L.max) return fill(e.subjectTooLong, L); }
      if (name === 'message') { if (!v) return e.messageRequired; if (v.length < L.min) return fill(e.messageTooShort, L); if (v.length > L.max) return fill(e.messageTooLong, L); }
      return '';
    }

    function showFieldError(name, message) {
      var wrap = form.querySelector('[data-field="' + name + '"]');
      var input = form.elements[name];
      var out = form.querySelector('[data-error-for="' + name + '"]');
      wrap.classList.toggle('field--invalid', !!message);
      if (message) input.setAttribute('aria-invalid', 'true'); else input.removeAttribute('aria-invalid');
      out.innerHTML = '';
      if (message) {
        var span = document.createElement('span');
        span.textContent = message;
        out.appendChild(span);
      }
    }

    ['name', 'email', 'subject', 'message'].forEach(function (name) {
      var input = form.elements[name];
      input.addEventListener('blur', function () {
        if (input.value.trim() !== '') touched[name] = true;
        if (touched[name]) showFieldError(name, validateField(name));
      });
      input.addEventListener('input', function () {
        if (touched[name]) showFieldError(name, validateField(name));
      });
    });

    function setStatus(type, title, text) {
      if (!statusEl) return;
      statusEl.className = 'form-status form-status--' + type;
      statusEl.setAttribute('role', type === 'error' ? 'alert' : 'status');
      statusEl.innerHTML = STATUS_ICONS[type] || '';
      var box = document.createElement('div');
      var h = document.createElement('p');
      h.className = 'form-status__title';
      h.textContent = title;
      var p = document.createElement('p');
      p.textContent = text;
      box.appendChild(h); box.appendChild(p);
      statusEl.appendChild(box);
      statusEl.hidden = false;
      statusEl.focus({ preventScroll: true });
      statusEl.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
    }

    function setSending(on) {
      form.classList.toggle('is-sending', on);
      form.setAttribute('aria-busy', String(on));
      submit.disabled = on;
      submitLabel.textContent = on ? i18n.sending : i18n.submit;
    }

    if (form.getAttribute('data-sent') === 'true' && statusEl) statusEl.focus();
    else if (statusEl && !statusEl.hidden) statusEl.focus();

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (form.classList.contains('is-sending')) return;
      var firstInvalid = null;
      ['name', 'email', 'subject', 'message'].forEach(function (name) {
        touched[name] = true;
        var err = validateField(name);
        showFieldError(name, err);
        if (err && !firstInvalid) firstInvalid = form.elements[name];
      });
      if (firstInvalid) { firstInvalid.focus(); return; }

      var payload = {
        name: form.elements.name.value,
        email: form.elements.email.value,
        subject: form.elements.subject.value,
        message: form.elements.message.value,
        website: form.elements.website.value,
        token: form.elements.token.value,
        lang: document.documentElement.lang.slice(0, 2),
      };
      setSending(true);
      fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload),
        credentials: 'same-origin',
      }).then(function (res) {
        return res.json().catch(function () { return { ok: false, error: 'rejected' }; }).then(function (data) {
          return { status: res.status, data: data };
        });
      }).then(function (r) {
        setSending(false);
        // Success is shown ONLY when the server confirms the provider accepted the email.
        if (r.status === 200 && r.data && r.data.ok === true) {
          form.reset();
          touched = {};
          updateCounter();
          setStatus('success', i18n.successTitle, i18n.successText);
          return;
        }
        var key = (r.data && r.data.error) || 'rejected';
        if (r.data && r.data.errors) {
          Object.keys(r.data.errors).forEach(function (name) {
            var er = r.data.errors[name];
            showFieldError(name, fill(i18n.errors[er.key] || i18n.errors.summary, er.vars || {}));
          });
        }
        setStatus('error', i18n.errorTitle, i18n.errors[key] || i18n.errors.rejected);
      }).catch(function () {
        setSending(false);
        setStatus('error', i18n.errorTitle, i18n.errors.network);
      });
    });
  }


  // ---- Scroll-linked effects: reading progress + back-to-top ----
  function initScrollEffects() {
    var progress = document.querySelector('[data-scroll-progress]');
    var toTop = document.querySelector('[data-to-top]');
    var ticking = false;

    function update() {
      ticking = false;
      var y = window.scrollY;
      var vh = window.innerHeight;
      var max = document.documentElement.scrollHeight - vh;
      if (progress) progress.style.setProperty('--progress', max > 0 ? Math.min(1, y / max).toFixed(4) : '0');
      if (toTop) toTop.classList.toggle('is-visible', y > vh * 1.2);
    }
    function onScroll() {
      if (!ticking) { ticking = true; window.requestAnimationFrame(update); }
    }
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });

    if (toTop) {
      toTop.addEventListener('click', function (e) {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
        var main = document.getElementById('main');
        if (main) main.focus({ preventScroll: true });
      });
    }
  }

  // ---- Pointer spotlight on cards (fine pointers only) ----
  function initSpotlight() {
    if (!window.matchMedia || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    var pending = null;
    document.addEventListener('pointermove', function (e) {
      var el = e.target.closest && e.target.closest('.hairgrid__cell, .social, .record__row');
      if (!el) return;
      pending = { el: el, x: e.clientX, y: e.clientY };
      window.requestAnimationFrame(function () {
        if (!pending) return;
        var r = pending.el.getBoundingClientRect();
        pending.el.style.setProperty('--mx', (pending.x - r.left) + 'px');
        pending.el.style.setProperty('--my', (pending.y - r.top) + 'px');
        pending = null;
      });
    }, { passive: true });
  }

  // Decorative cloud textures: load once the page itself is done.
  function initClouds() {
    var go = function () { doc.classList.add('clouds-ready'); };
    if (document.readyState === 'complete') setTimeout(go, 50);
    else window.addEventListener('load', function () { setTimeout(go, 50); });
  }


  // ---- Word-by-word title reveal ----
  function initSplit() {
    if (reduceMotion || !('IntersectionObserver' in window)) return;
    var vh = window.innerHeight;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add('is-split-in'); io.unobserve(entry.target); }
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.1 });
    Array.prototype.slice.call(document.querySelectorAll('[data-split]')).forEach(function (host) {
      var el = host.matches('.sec-head') ? host.querySelector('.sec-title') : host;
      if (!el || el.getBoundingClientRect().top < vh) return; // already on screen: leave as is
      var index = 0;
      var walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
      var nodes = [];
      while (walker.nextNode()) nodes.push(walker.currentNode);
      nodes.forEach(function (node) {
        var frag = document.createDocumentFragment();
        node.nodeValue.split(/(\s+)/).forEach(function (part) {
          if (!part) return;
          if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); return; }
          var w = document.createElement('span');
          w.className = 'w';
          var inner = document.createElement('span');
          inner.className = 'w__i';
          inner.style.setProperty('--wi', String(index++));
          inner.textContent = part;
          w.appendChild(inner);
          frag.appendChild(w);
        });
        node.parentNode.replaceChild(frag, node);
      });
      io.observe(el);
    });
  }

  // ---- Home hero: scroll parallax + cursor glow; CTA band parallax ----
  function initHero() {
    if (reduceMotion) return;
    var hero = document.querySelector('[data-hero]');
    var bands = Array.prototype.slice.call(document.querySelectorAll('.cta-band'));
    var ticking = false;
    function update() {
      ticking = false;
      var vh = window.innerHeight;
      if (hero) {
        var h = hero.offsetHeight || 1;
        var p = Math.max(0, Math.min(1, window.scrollY / h));
        hero.style.setProperty('--hp', p.toFixed(3));
      }
      bands.forEach(function (band) {
        var r = band.getBoundingClientRect();
        if (r.bottom < 0 || r.top > vh) return;
        band.style.setProperty('--bp', ((r.top + r.height / 2 - vh / 2) / vh).toFixed(3));
      });
    }
    window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
    update();

    if (!hero || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    var glow = hero.querySelector('.hero__glow');
    var raf = null;
    var pos = null;
    hero.addEventListener('pointermove', function (e) {
      var r = hero.getBoundingClientRect();
      pos = { x: e.clientX - r.left, y: e.clientY - r.top };
      if (raf) return;
      raf = requestAnimationFrame(function () {
        raf = null;
        hero.style.setProperty('--gx', pos.x + 'px');
        hero.style.setProperty('--gy', pos.y + 'px');
        hero.classList.add('has-glow');
      });
    }, { passive: true });
    hero.addEventListener('pointerleave', function () { hero.classList.remove('has-glow'); });
    if (glow) glow.style.setProperty('will-change', 'transform');
  }

  // ---- Magnetic primary buttons (fine pointers) ----
  function initMagnet() {
    if (reduceMotion || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    Array.prototype.slice.call(document.querySelectorAll('.btn--primary, .btn--dark, .index-row__arrow')).forEach(function (btn) {
      btn.addEventListener('pointermove', function (e) {
        var r = btn.getBoundingClientRect();
        var dx = (e.clientX - (r.left + r.width / 2)) * 0.22;
        var dy = (e.clientY - (r.top + r.height / 2)) * 0.32;
        btn.classList.add('is-magnet');
        btn.style.translate = dx.toFixed(1) + 'px ' + dy.toFixed(1) + 'px';
      });
      btn.addEventListener('pointerleave', function () {
        btn.classList.remove('is-magnet');
        btn.style.translate = '';
      });
    });
  }

  // ---- Count-up for purely numeric stats ----
  function initCounters() {
    var cells = Array.prototype.slice.call(document.querySelectorAll('.stat dd')).filter(function (dd) {
      return /^\d{1,3}$/.test(dd.textContent.trim());
    });
    if (!cells.length || reduceMotion || !('IntersectionObserver' in window)) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        io.unobserve(entry.target);
        var dd = entry.target;
        var target = parseInt(dd.textContent.trim(), 10);
        var start = null;
        var dur = 1100;
        function step(ts) {
          if (start === null) start = ts;
          var t = Math.min(1, (ts - start) / dur);
          var eased = 1 - Math.pow(1 - t, 3);
          dd.textContent = String(Math.round(eased * target));
          if (t < 1) requestAnimationFrame(step);
        }
        dd.textContent = '0';
        setTimeout(function () { requestAnimationFrame(step); }, 250);
      });
    }, { threshold: 0.6 });
    cells.forEach(function (dd) { io.observe(dd); });
  }

  // ---- Marquee speeds up with scroll velocity ----
  function initMarquee() {
    var m = document.querySelector('.marquee');
    if (!m || reduceMotion || !m.getAnimations) return;
    var anim = null;
    var lastY = window.scrollY;
    var boost = 0;
    var running = false;
    // Only animate the rate while scrolling; stop once the boost has decayed.
    function tick() {
      if (!anim) anim = m.getAnimations()[0] || null;
      var y = window.scrollY;
      boost = Math.min(boost * 0.9 + Math.abs(y - lastY) * 0.06, 6);
      lastY = y;
      if (anim) anim.playbackRate = 1 + boost;
      if (boost > 0.02) requestAnimationFrame(tick);
      else { running = false; if (anim) anim.playbackRate = 1; }
    }
    window.addEventListener('scroll', function () {
      if (!running) { running = true; lastY = lastY || window.scrollY; requestAnimationFrame(tick); }
    }, { passive: true });
  }

  ready(function () {
    initClouds();
    initSplit();
    initHero();
    initMagnet();
    initCounters();
    initMarquee();
    initReveal();
    initScrollEffects();
    initSpotlight();
    initHeader();
    initCopy();
    initContact();
  });
})();
