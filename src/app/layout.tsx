import type { ReactNode } from 'react';
import type { Viewport } from 'next';
import { headers } from 'next/headers';
import { display, body, mono } from './fonts';
import './globals.css';
import { LANGS } from '@/lib/config';
import { dictionaries, locales } from '@/lib/i18n';
import { getI18n } from '@/lib/i18n/server';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Sky } from '@/components/layout/Sky';
import { Effects } from '@/components/layout/Effects';
import { ScrollProgress, BackToTop } from '@/components/layout/ScrollUi';
import { Providers } from '@/components/layout/Providers';

export const viewport: Viewport = { themeColor: '#06040b', colorScheme: 'dark' };

export default async function RootLayout({ children }: { children: ReactNode }) {
  const { lang, d } = await getI18n();
  const nonce = (await headers()).get('x-nonce') ?? undefined;
  const nav = [
    { href: '/about', label: d.nav.about },
    { href: '/achievements', label: d.nav.achievements },
    { href: '/resume', label: d.nav.resume },
    { href: '/skills', label: d.nav.skills },
    { href: '/services', label: d.nav.services },
    { href: '/portfolio', label: d.nav.portfolio },
    { href: '/nexify-dev', label: d.nav.nexifyDev },
  ];
  const langs = LANGS.map((code) => ({ code, short: dictionaries[code].langShort, name: dictionaries[code].langName, locale: locales[code] }));

  return (
    <html lang={locales[lang]} className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
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
            labels={{ home: d.nav.home, mainNav: d.common.mainNav, menuOpen: d.common.menuOpen, menuClose: d.common.menuClose, language: d.common.language, languageCurrent: d.common.languageCurrent, hireMe: d.common.hireMe }}
          />
          <main id="main" tabIndex={-1}>{children}</main>
          <Footer d={d} />
          <BackToTop label={d.common.backToTop} />
          <div className="toast" role="status" aria-live="polite" data-toast />
          <Effects copiedLabel={d.common.copied} />
        </Providers>
      </body>
    </html>
  );
}
