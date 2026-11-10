import type { ReactNode } from 'react';
import type { Viewport } from 'next';
import { display, body, mono } from '../fonts';
import '../globals.css';
import { LANGS } from '@/lib/config';
import { dictionaries, locales } from '@/lib/i18n';
import { i18nFromParams, type LangParams } from '@/lib/i18n/server';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Sky } from '@/components/layout/Sky';
import { Effects } from '@/components/layout/Effects';
import { ScrollProgress } from '@/components/layout/ScrollUi';
import { FloatCta } from '@/components/layout/FloatCta';
import { Providers } from '@/components/layout/Providers';
import type { PaletteItem } from '@/components/layout/CommandPalette';
import { CommandPalette, LangSuggest } from '@/components/layout/Deferred';
import { site, socials } from '@/lib/config';
import { fmt } from '@/lib/i18n/fmt';
import { themeBootScript } from '@/lib/client/theme';
import { features } from '@/lib/features';
import { Analytics } from '@vercel/analytics/next';

export const viewport: Viewport = { themeColor: '#0a0b10', colorScheme: 'dark' };

export function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }));
}
export const dynamicParams = false;

export default async function RootLayout({ children, params }: { children: ReactNode } & LangParams) {
  const { lang, d } = await i18nFromParams(params);
  const nonce = undefined;
  const nav = [
    { href: '/about', label: d.nav.about },
    { href: '/achievements', label: d.nav.achievements },
    { href: '/resume', label: d.nav.resume },
    { href: '/skills', label: d.nav.skills },
    { href: '/services', label: d.nav.services },
    { href: '/portfolio', label: d.nav.portfolio },
    { href: '/nexify-dev', label: d.nav.nexifyDev },
  ];
  const c = d.common;
  const palette: PaletteItem[] = [
    { id: 'home', label: d.nav.home, group: c.searchPages, icon: 'user', href: '/' },
    ...nav.map((n) => ({ id: n.href.slice(1), label: n.label, group: c.searchPages, icon: 'arrow' as const, href: n.href })),
    { id: 'testimonials', label: d.nav.testimonials, group: c.searchPages, icon: 'quote', href: '/testimonials' },
    { id: 'contact', label: d.nav.contact, group: c.searchPages, icon: 'mail', href: '/contact' },
    { id: 'privacy', label: d.nav.privacy, group: c.searchPages, icon: 'info', href: '/privacy' },
    { id: 'cv', label: c.downloadCv, group: c.searchActions, icon: 'download', href: site.cv.href, download: site.cv.fileName, keywords: 'cv resume pdf' },
    { id: 'mediakit', label: d.mediaKit.title, group: c.searchActions, icon: 'layers', href: '/media-kit', keywords: 'media kit press one pager' },
    { id: 'discord', label: `${c.copyDiscord} (${socials.find((s) => s.id === 'discord')!.handle})`, group: c.searchActions, icon: 'discord', copy: socials.find((s) => s.id === 'discord')!.copy },
    { id: 'email', label: c.sendEmail, group: c.searchActions, icon: 'mail', href: `mailto:${site.contactEmail}`, keywords: 'email mail' },
    ...socials.filter((s) => s.href).map((s) => ({ id: s.id, label: fmt(c.openOn, { name: s.label }), group: c.searchActions, icon: s.id, href: s.href!, external: true })),
    { id: 'theme', label: c.themeToggle, group: c.searchActions, icon: 'sun', action: 'theme', keywords: 'theme dark light mode thema donker licht tema escuro claro' },
    { id: 'gg', label: c.gg, group: c.searchActions, icon: 'trophy', action: 'gg', hidden: true, keywords: 'gg victory royale wkey' },
    ...LANGS.map((code) => ({ id: `lang-${code}`, label: dictionaries[code].langName, group: c.searchLanguage, icon: 'globe' as const, href: `/lang/${code}` })),
  ];
  const suggestTexts = Object.fromEntries(LANGS.map((code) => [code, { text: dictionaries[code].common.langSuggest, yes: dictionaries[code].common.langSuggestYes, no: dictionaries[code].common.langSuggestNo }]));
  const langs = LANGS.map((code) => ({ code, short: dictionaries[code].langShort, name: dictionaries[code].langName, locale: locales[code] }));

  return (
    <html lang={locales[lang]} suppressHydrationWarning className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBootScript }} />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
        <noscript>
          {/* Without JS the mobile menu cannot open — show the nav inline instead. */}
          <style nonce={nonce}>{'.hdr__toggle{display:none!important}@media (max-width:1100px){.hdr__nav{display:block!important;position:static}.hdr__bar{flex-wrap:wrap}}'}</style>
        </noscript>
      </head>
      <body>
        <Providers nonce={nonce}>
          <a className="skip" href="#main">{d.common.skip}</a>
          <ScrollProgress />
          <Sky />
          <Header
            nav={nav}
            langs={langs}
            lang={lang}
            labels={{ home: d.nav.home, mainNav: d.common.mainNav, menuOpen: d.common.menuOpen, menuClose: d.common.menuClose, language: d.common.language, languageCurrent: d.common.languageCurrent, hireMe: d.common.hireMe, search: d.common.search, toLight: d.common.themeLight, toDark: d.common.themeDark }}
          />
          <main id="main" tabIndex={-1}>{children}</main>
          <Footer d={d} />
          <FloatCta label={d.common.letsTalk} />
          <div className="toast" role="status" aria-live="polite" data-toast />
          <Effects copiedLabel={d.common.copied} />
          <CommandPalette items={palette} labels={{ search: c.search, placeholder: c.searchPh, empty: c.searchEmpty, close: c.searchClose, copied: c.copied }} />
          <LangSuggest current={lang} texts={suggestTexts} />
          {features.analytics() ? <Analytics /> : null}
        </Providers>
      </body>
    </html>
  );
}
