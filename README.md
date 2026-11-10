# Nexify — portfolio website

The portfolio site for **Nexify**, an Esports Social Media Manager and competitive Fortnite player.
Built with **Next.js 16 (App Router) + React 19 + TypeScript (`.tsx`)** and **Motion** for animations.
It's in English (default), Dutch and Portuguese, with no tracking cookies and no third-party requests from the browser.

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
| `src/app/lang/[code]/route.ts` | Language switch: sets the cookie and returns to the same page |
| `src/proxy.ts` | Picks the language (`?lang=` > cookie > English) and sets a per-request nonce CSP |
| `src/components/` | `layout/` (header, footer, sky, effects), `motion/` (client animations), `sections/`, `ui/` |
| `src/lib/i18n/{en,nl,pt}.ts` | All text. TypeScript enforces that NL/PT match the English shape |
| `src/lib/resume.ts` | Resume facts (roles, skills, tools) |
| `src/lib/config.ts` | Public email and social links, each set in one place |

## Rendering

Every page is **statically generated per language** under `src/app/[lang]/` (`generateStaticParams`). `src/proxy.ts` keeps the URLs clean: it picks the language (`?lang=` > cookie > English) and rewrites `/about` to `/nl/about` internally. A direct `/nl/…` URL redirects to the clean one. 

Because the pages are static, the CSP is a static header (`next.config.ts`) and allows Next's inline bootstrap scripts.

## Managing content

| What | Where |
|---|---|
| Legal identity (name, privacy contact, retention) | `LEGAL` in `src/lib/config.ts` |
| Free agent / signed status | `status` in `src/lib/config.ts`. One switch updates every badge and status text |
| Live Discord status | `DISCORD_USER_ID` in `src/lib/config.ts` (or as an env var). Also join the Lanyard Discord once. The card stays hidden while it's empty |
| Testimonials | `src/lib/testimonials.ts`. Real quotes only, shared with permission |
| Updates log | `src/lib/updates.ts`, shown on `/nexify-dev` |
| Avatar | `public/img/avatar.webp` |
| Upcoming events | `src/lib/events.ts`. Shown on the home page as "Coming up"; hidden while empty, past events hide themselves |
| Portfolio work | `src/lib/work.ts` + images in `public/work/`. Real work only, with permission; the empty state shows until you add some |
| Media kit | `/media-kit`. Run `npm run build:mediakit` after `npm run build` to regenerate the PDFs in `public/media-kit/` |

The site also includes:
- a search palette (**Ctrl/⌘+K** or `/`)
- a one-time language suggestion for Dutch or Portuguese browsers, which never switches the language by itself

## Animations

Motion handles:
- the typewriter headline
- shared-layout pills in the navigation and language switch
- the full-screen mobile menu
- counters and the scroll-driven timeline
- page transitions

CSS handles the entrance animations, floating icon tiles and hover states. Small attribute-based effects (`data-reveal`, `data-spot`, `data-magnetic`, `data-copy`) live in `components/layout/Effects.tsx`.

Server-rendered content is never hidden before JavaScript loads. Everything respects `prefers-reduced-motion` (`MotionConfig reducedMotion="user"` plus CSS).

## Contact

There is no email provider. `/contact` always shows the email address (`PUBLIC_CONTACT_EMAIL` in `src/lib/config.ts`) with a copy button, the Discord username with live status, and the social links.

**Optional contact form → Discord.** Set `DISCORD_WEBHOOK_URL` in Vercel (**Project → Settings → Environment Variables**) and redeploy. Create the webhook in Discord under *Channel settings → Integrations → Webhooks* on a private channel. The form then appears, messages arrive in that channel (no pings), and the privacy page switches to the matching text. Never commit the webhook URL.

Spam protection: honeypot, signed render timestamp (3 s–2 h), the server action's origin check, an in-memory rate limit and length limits. Message contents are never stored or logged.

## Optional features

| Feature | How to switch it on |
|---|---|
| Contact form | `DISCORD_WEBHOOK_URL` (see above) |
| Visitor statistics (cookieless Vercel Web Analytics) | Enable *Analytics* in the Vercel project, then set `ENABLE_ANALYTICS=1` and redeploy. The privacy page adds a section about it automatically |

The site also has a light/dark switch (stored in `localStorage`, dark by default), a "Now playing" card while a game runs on Discord, and a hidden search command (try `gg` in Ctrl/⌘+K).

## CV

`public/cv/Nexify-CV.pdf` is the official resume, `attached_assets/Nexify_Resume_Esports_v2_2.docx`, converted unchanged with LibreOffice. To update it, replace the DOCX and run:

```bash
npm run build:cv
```

## Other assets

- `npm run build:og` rebuilds the default share image (`public/og-image.png`).
- `npm run build:og-pages` (after `npm run build`) renders a share image per page and language in `public/og/`.
- `npm run build:icons` renders the app icons in `public/icons/` (the site is installable via `manifest.webmanifest`).
- `npm run build:clouds` rebuilds the soft cloud textures (`public/img/clouds-*.webp`).

## Checks

```bash
npm run check        # TypeScript + Vitest (translations)
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
