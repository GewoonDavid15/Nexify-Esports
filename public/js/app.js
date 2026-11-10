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
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
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
    var mq = window.matchMedia('(max-width: 1140px)');

    function setOpen(open, focusToggle) {
      header.classList.toggle('is-open', open);
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
        function () { toast(btn.getAttribute('data-copied') + ': ' + value); },
        function () { toast(btn.getAttribute('data-failed')); }
      );
    });
  }

  // ---- Contact form ------------------------------------------------------------
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
      statusEl.innerHTML = '';
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

  ready(function () {
    initReveal();
    initHeader();
    initCopy();
    initContact();
  });
})();
