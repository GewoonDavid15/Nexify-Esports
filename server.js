import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { routes } from './src/routes.js';
import { LANG_COOKIE, DEFAULT_LANG, LANGS, site } from './src/config.js';
import { translator, isLang, dictionaries } from './src/i18n/index.js';
import { layout } from './src/views/layout.js';
import { validateContact } from './src/contact/validate.js';
import { issueToken, checkToken, createRateLimiter } from './src/contact/spam.js';
import { isConfigured, sendContactEmail } from './src/contact/mailer.js';

import home from './src/views/pages/home.js';
import about from './src/views/pages/about.js';
import resume from './src/views/pages/resume.js';
import skills from './src/views/pages/skills.js';
import portfolio from './src/views/pages/portfolio.js';
import services from './src/views/pages/services.js';
import achievements from './src/views/pages/achievements.js';
import testimonials from './src/views/pages/testimonials.js';
import contact from './src/views/pages/contact.js';
import nexifyDev from './src/views/pages/nexifyDev.js';
import notFound from './src/views/pages/notFound.js';
import { legalPage } from './src/views/pages/legal.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const views = {
  home, about, resume, skills, portfolio, services, achievements, testimonials, nexifyDev,
  privacy: legalPage('privacy'),
  terms: legalPage('terms'),
  cookies: legalPage('cookiesPage'),
  disclaimer: legalPage('disclaimer'),
};

const ONE_YEAR_MS = 365 * 24 * 60 * 60 * 1000;

export function createApp({ env = process.env, rateLimiter = createRateLimiter({ max: 8 }) } = {}) {
  const app = express();
  app.disable('x-powered-by');
  // Vercel always sits behind its own proxy, so trust it for the client IP.
  if (env.VERCEL && !env.TRUST_PROXY) app.set('trust proxy', true);
  if (env.TRUST_PROXY) app.set('trust proxy', /^\d+$/.test(env.TRUST_PROXY) ? Number(env.TRUST_PROXY) : env.TRUST_PROXY);

  // Security headers. No inline scripts or third-party origins are used anywhere.
  app.use((req, res, next) => {
    res.set({
      'Content-Security-Policy': "default-src 'self'; img-src 'self' data:; style-src 'self'; font-src 'self'; script-src 'self'; connect-src 'self'; form-action 'self'; frame-ancestors 'none'; base-uri 'self'; object-src 'none'",
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'X-Frame-Options': 'DENY',
      'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
    });
    next();
  });

  const staticOpts = { maxAge: '7d', fallthrough: true };
  app.use(express.static(path.join(__dirname, 'public'), { ...staticOpts, maxAge: '1h' }));
  app.use('/fonts', express.static(path.join(__dirname, 'public/fonts'), staticOpts));

  const readCookieLang = (req) => {
    const m = /(?:^|;\s*)nexify_lang=([a-z]{2})/.exec(req.headers.cookie || '');
    return m && isLang(m[1]) ? m[1] : null;
  };
  const setLangCookie = (res, lang) => res.cookie(LANG_COOKIE, lang, {
    maxAge: ONE_YEAR_MS, sameSite: 'lax', httpOnly: false, path: '/', secure: env.NODE_ENV === 'production',
  });

  // Language: ?lang= (sets the cookie) > cookie > English default.
  app.use((req, res, next) => {
    let lang = readCookieLang(req) || DEFAULT_LANG;
    if (isLang(req.query.lang)) {
      lang = req.query.lang;
      setLangCookie(res, lang);
    }
    req.t = translator(lang);
    next();
  });

  const safeNext = (value) => {
    const v = typeof value === 'string' ? value : '/';
    // Only same-site absolute paths; rejects "//evil.com" and "/\evil.com".
    return /^\/(?![/\\])[\w\-./?=&%#]*$/.test(v) ? v : '/';
  };

  app.get('/lang/:code', (req, res) => {
    const { code } = req.params;
    if (isLang(code)) setLangCookie(res, code);
    res.set('Cache-Control', 'no-store');
    res.redirect(303, safeNext(req.query.next));
  });

  const originOf = (req) => (req.get ? `${req.protocol}://${req.get('host')}` : '');
  const send = (req, res, { status = 200, pageKey, bodyHtml, routePath }) => {
    res.status(status)
      .set({ 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'private, no-cache', Vary: 'Cookie' })
      .send(layout({ t: req.t, path: routePath, pageKey, body: bodyHtml, origin: originOf(req), noindex: status !== 200, bodyClass: `page-${pageKey === 'nexifyDev' ? 'dev' : pageKey}` }));
  };

  const contactState = (extra = {}) => ({ configured: isConfigured(env), token: issueToken(), ...extra });

  for (const route of routes) {
    app.get(route.path, (req, res) => {
      const bodyHtml = route.key === 'contact' ? contact(req.t, contactState()) : views[route.key](req.t);
      send(req, res, { pageKey: route.key, bodyHtml, routePath: route.path });
    });
  }

  // ---- Contact form -------------------------------------------------------
  const parsers = [express.urlencoded({ extended: false, limit: '20kb', parameterLimit: 20 }), express.json({ limit: '20kb' })];

  app.post(['/contact', '/api/contact'], ...parsers, async (req, res) => {
    const t = req.t;
    const wantsJson = req.path.startsWith('/api/') || (req.get('accept') || '').includes('application/json');
    const body = req.body && typeof req.body === 'object' ? req.body : {};
    const lang = isLang(body.lang) ? body.lang : t.lang;
    const tt = lang === t.lang ? t : translator(lang);

    const respond = (status, payload) => {
      if (wantsJson) return res.status(status).set('Cache-Control', 'no-store').json(payload);
      const state = contactState({
        values: payload.values || {},
        errors: payload.errors || {},
        status: payload.ok ? 'success' : 'error',
        errorKey: payload.error || 'summary',
      });
      if (payload.ok) state.values = {};
      return send({ t: tt, get: req.get.bind(req), protocol: req.protocol }, res, { status, pageKey: 'contact', bodyHtml: contact(tt, state), routePath: '/contact' });
    };

    // Reject cross-site posts (browsers send Origin on POST).
    const origin = req.get('origin');
    if (origin) {
      try {
        if (new URL(origin).hostname !== req.hostname) return respond(403, { ok: false, error: 'rejected' });
      } catch { return respond(403, { ok: false, error: 'rejected' }); }
    }

    if (!rateLimiter.hit(req.ip || 'unknown')) return respond(429, { ok: false, error: 'rateLimited' });

    // Honeypot: real visitors never see or fill this field.
    if (typeof body.website === 'string' && body.website.trim() !== '') return respond(400, { ok: false, error: 'rejected' });

    const { values, errors } = validateContact(body);
    if (Object.keys(errors).length) return respond(422, { ok: false, error: 'summary', errors, values });

    const tokenStatus = checkToken(body.token);
    if (tokenStatus !== 'ok') return respond(400, { ok: false, error: 'expired', values });

    if (!isConfigured(env)) return respond(503, { ok: false, error: 'notConfigured', values });

    try {
      await sendContactEmail(values, { lang, env });
      return respond(200, { ok: true });
    } catch (err) {
      // Never log message contents — only the failure category.
      console.error(`[contact] delivery failed: ${err.code || 'UNKNOWN'}${err.responseCode ? ` (${err.responseCode})` : ''}`);
      return respond(502, { ok: false, error: err.code === 'NOT_CONFIGURED' ? 'notConfigured' : 'delivery', values });
    }
  });

  app.get('/api/contact/status', (req, res) => res.set('Cache-Control', 'no-store').json({ configured: isConfigured(env) }));

  app.get('/robots.txt', (req, res) => res.type('text/plain')
    .send(`User-agent: *\nAllow: /\nDisallow: /api/\nDisallow: /lang/\n\nSitemap: ${site.url || originOf(req)}/sitemap.xml\n`));

  app.get('/sitemap.xml', (req, res) => {
    const base = site.url || originOf(req);
    const href = (p, code) => `${base}${p}${code === 'en' ? '' : `?lang=${code}`}`;
    const xmlEsc = (v) => v.replace(/&/g, '&amp;');
    const urls = routes.flatMap((r) => LANGS.map((code) => `  <url>
    <loc>${xmlEsc(href(r.path, code))}</loc>
${LANGS.map((alt) => `    <xhtml:link rel="alternate" hreflang="${dictionaries[alt].locale}" href="${xmlEsc(href(r.path, alt))}"/>`).join('\n')}
    <xhtml:link rel="alternate" hreflang="x-default" href="${xmlEsc(href(r.path, 'en'))}"/>
  </url>`));
    res.type('application/xml').set('Cache-Control', 'public, max-age=3600')
      .send(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls.join('\n')}\n</urlset>\n`);
  });

  // 404
  app.use((req, res) => send(req, res, { status: 404, pageKey: 'notFound', bodyHtml: notFound(req.t), routePath: req.path }));

  // Errors (e.g. oversized bodies) — never echo request contents.
  // eslint-disable-next-line no-unused-vars
  app.use((err, req, res, next) => {
    const status = err.status || err.statusCode || 500;
    if (status >= 500) console.error(`[server] ${err.name || 'Error'}: ${err.message}`);
    const t = req.t || translator(DEFAULT_LANG);
    if (req.method === 'POST' && req.path === '/contact' && !(req.get('accept') || '').includes('application/json')) {
      return send({ t, get: req.get.bind(req), protocol: req.protocol }, res, { status, pageKey: 'contact', bodyHtml: contact(t, contactState({ status: 'error', errorKey: 'rejected' })), routePath: '/contact' });
    }
    if ((req.get('accept') || '').includes('application/json') || req.path.startsWith('/api/')) {
      return res.status(status).json({ ok: false, error: 'rejected' });
    }
    return res.status(status).type('html').send(layout({ t, path: '/', pageKey: 'notFound', body: notFound(t), origin: originOf(req), noindex: true }));
  });

  return app;
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  const port = Number(process.env.PORT) || 3000;
  const app = createApp();
  app.listen(port, () => {
    console.log(`Nexify website running on http://localhost:${port}`);
    console.log(`Contact form email delivery: ${isConfigured() ? 'configured' : 'NOT configured (see README)'}`);
  });
}
