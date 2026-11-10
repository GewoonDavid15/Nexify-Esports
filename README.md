# Nexify — portfolio website

A standalone portfolio site for **Nexify**, a Fortnite player and Esports Social Media Manager.
Node.js + Express with server-rendered pages, in English (default), Dutch and Portuguese.
It has no build step, no analytics, and no third-party requests at runtime (fonts are self-hosted).

## Run

```bash
npm install
npm start            # http://localhost:3000  (PORT to change)
```

## Pages

`/` · `/about` · `/resume` · `/skills` · `/portfolio` · `/services` · `/achievements` · `/testimonials` ·
`/contact` · `/nexify-dev` · `/privacy` · `/terms` · `/cookies` · `/disclaimer`

## Language

- The selector links to `/lang/<en|nl|pt>?next=<current path>`. That sets the functional `nexify_lang` cookie (1 year) and returns to the same page.
- `?lang=nl` on any URL also selects a language. Without a choice, the site is in English.
- All text lives in `src/i18n/{en,nl,pt}.js`. `npm run check:i18n` confirms that all three have identical keys and placeholders.

## Contact form and email delivery

The form posts to `/api/contact` (JavaScript) or `/contact` (no-JS fallback). The server validates the input. It reports success **only after the email provider accepts the message**. Until a provider is configured, the form says so and the submit button is disabled.

Set **one** provider through your hosting platform's secrets. Never put these in frontend code or commit them; see `.env.example`.

| Provider | Variables |
|---|---|
| Resend | `RESEND_API_KEY`, `CONTACT_FROM_EMAIL` (from a verified domain) |
| SMTP | `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `CONTACT_FROM_EMAIL`, optional `SMTP_SECURE=true` |

Optional settings: `CONTACT_TO_EMAIL` (recipient), `FORM_SECRET`, `TRUST_PROXY=1` (behind a reverse proxy, so rate limiting sees real IPs).

Spam protection:
- a hidden honeypot field
- an HMAC-signed render timestamp that rejects submissions under 3 s or over 2 h old
- a same-origin check
- an in-memory limit of 8 posts per IP per 15 minutes
- field length limits and a 20 KB body cap

Messages are never stored, and their contents are never logged.

## Updating content

- **Public contact email:** `PUBLIC_CONTACT_EMAIL` in `src/config.js`. This is the only place it's set. It is not used as a legal or privacy contact.
- **Social links:** `socials` in `src/config.js`. Add only verified links.
- **Resume data:** `src/resume.js`, with labels in the i18n files.
- **Testimonials:** add only real quotes with permission. The page shows an honest empty state until then.
- **Legal pages:** these are informational drafts. Before you remove the draft banner, fill in the "missing" items (legal name, privacy contact, hosting/email provider, retention, applicable law).

## CV download

`public/cv/Nexify-CV.pdf` is served by the Download CV buttons. Regenerate it with:

```bash
npm run build:cv
```

If `attached_assets/Nexify_Resume*.docx` exists, the script converts that original file unchanged with LibreOffice. Otherwise it renders the PDF from the resume facts in `src/resume.js`, adding nothing.

## Checks

```bash
npm run check        # i18n parity + server tests (routes, language, contact form via a local SMTP server)
npm run test:e2e     # Playwright: all routes × languages × desktop/tablet/mobile, console errors,
                     # overflow, broken links, mobile menu, language switch, CV download, reduced motion
```

## Deploying to Vercel

The repo is ready for Vercel with no build step:

- `public/` is served as static files (CSS, JS, fonts, CV).
- Every other request is rewritten to `api/index.js`, which exports the Express app as a serverless function (see `vercel.json`).

Set the contact-form variables (see above) under **Project → Settings → Environment Variables**, then redeploy.

On Vercel, the token signing key is derived from the provider secret if `FORM_SECRET` isn't set, so it stays the same across function instances. The rate limiter is per instance, so it's a best-effort limit there.

If you upgrade the font packages, run `node scripts/copy-fonts.mjs` to refresh `public/fonts` (including the combined `public/fonts/fonts.css`).

**Branches:** `main` is the production branch, so pushes to `main` go live. Every other branch gets its own preview URL.

## Sharing and SEO

- `public/og-image.png` (1200×630) is the link preview on Discord, X and similar. Rebuild it with `npm run build:og`.
- Every page has a canonical link and hreflang alternates. English uses the plain URL; Dutch and Portuguese use `?lang=nl` and `?lang=pt`.
- `/sitemap.xml` lists every page in all three languages, and `/robots.txt` points to it.
- Absolute URLs use `PUBLIC_SITE_URL`, then Vercel's production URL, then the request host.
