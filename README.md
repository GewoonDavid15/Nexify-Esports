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

There is no contact form and no email provider. `/contact` shows the email address (`PUBLIC_CONTACT_EMAIL` in `src/lib/config.ts`) with a mailto link and a copy button, the Discord username with a copy button and live status, and the social links. The site never receives or stores messages.

## CV

`public/cv/Nexify-CV.pdf` is the official resume, `attached_assets/Nexify_Resume_Esports_v2_2.docx`, converted unchanged with LibreOffice. To update it, replace the DOCX and run:

```bash
npm run build:cv
```

## Other assets

- `npm run build:og` rebuilds the share image (`public/og-image.png`).
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
