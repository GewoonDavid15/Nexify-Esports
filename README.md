# Nexify — portfolio website

The portfolio site for **Nexify**, an Esports Social Media Manager and competitive Fortnite player.
Built with **Next.js 16 (App Router) + React 19 + TypeScript (`.tsx`)** and **Motion** for animations.
It's in English (default), Dutch and Portuguese, with no analytics and no third-party requests at runtime.

## Run

```bash
npm install
npm run dev          # http://localhost:3000
```

```bash
npm run build && npm start
```

## Structure

| Path | What |
|---|---|
| `src/app/` | Routes (`page.tsx` per page), root `layout.tsx`, `template.tsx` (page transitions), `sitemap.ts`, `robots.ts` |
| `src/app/contact/actions.ts` | Server action for the contact form |
| `src/app/api/contact/route.ts` | JSON endpoint, using the same logic as the server action |
| `src/app/lang/[code]/route.ts` | Language switch: sets the cookie and returns to the same page |
| `src/proxy.ts` | Picks the language (`?lang=` > cookie > English) and sets a per-request nonce CSP |
| `src/components/` | `layout/` (header, footer, sky, effects), `motion/` (client animations), `sections/`, `ui/` |
| `src/lib/i18n/{en,nl,pt}.ts` | All text. TypeScript enforces that NL/PT match the English shape |
| `src/lib/resume.ts` | Resume facts (roles, skills, tools) |
| `src/lib/config.ts` | Public email and social links, each set in one place |
| `src/lib/contact/` | Validation, spam protection, mailer |

## Animations

Motion handles:
- the typewriter headline
- shared-layout pills in the navigation and language switch
- the full-screen mobile menu
- counters and the scroll-driven timeline
- page transitions

CSS handles the entrance animations, floating icon tiles and hover states. Small attribute-based effects (`data-reveal`, `data-spot`, `data-magnetic`, `data-copy`) live in `components/layout/Effects.tsx`.

Server-rendered content is never hidden before JavaScript loads. Everything respects `prefers-reduced-motion` (`MotionConfig reducedMotion="user"` plus CSS).

## Contact form

The form is a server action that also works without JavaScript. It validates on the client and the server, and shows success **only after the email provider accepts the message**. Until a provider is configured, the form says so and the submit button is disabled.

Configure one provider with environment variables in Vercel (**Project → Settings → Environment Variables**). Never put these in client code or commit them; see `.env.example`.

| Provider | Variables |
|---|---|
| Resend | `RESEND_API_KEY`, `CONTACT_FROM_EMAIL` |
| SMTP | `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `CONTACT_FROM_EMAIL` (`SMTP_SECURE=true` for port 465) |

Optional settings: `CONTACT_TO_EMAIL` and `FORM_SECRET`.

Spam protection:
- a honeypot field
- a signed render timestamp (submissions faster than 3 s or older than 2 h are rejected)
- the server action's built-in origin check
- a best-effort in-memory rate limit
- length limits

Message contents are never stored or logged.

## CV

`public/cv/Nexify-CV.pdf` is the official resume, `attached_assets/Nexify_Resume_Esports_v2_2.docx`, converted unchanged with LibreOffice. To update it, replace the DOCX and run:

```bash
npm run build:cv
```

## Other assets

- `npm run build:og` rebuilds the share image (`public/og-image.png`).

## Checks

```bash
npm run check        # TypeScript + Vitest (translations, validation, spam, SMTP delivery)
```

```bash
npm run build && npm run test:e2e
```

The e2e run uses Playwright to cover:
- every route × language × viewport, checking console errors (including CSP), overflow and links
- the mobile menu and language switch
- the CV download
- reduced motion

## Deploying

Vercel builds this as a Next.js project. **Production branch: `main`**; other branches get preview URLs.
