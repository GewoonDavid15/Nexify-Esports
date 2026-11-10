import Link from 'next/link';
import type { Dict } from '@/lib/i18n';
import { site } from '@/lib/config';
import { LogoMark } from '../ui/Logo';
import { Icon } from '../ui/Icon';
import { Socials } from '../sections/Socials';

const groups = (d: Dict) => [
  { title: d.common.footerPages, links: [['/', d.nav.home], ['/about', d.nav.about], ['/achievements', d.nav.achievements], ['/resume', d.nav.resume], ['/skills', d.nav.skills], ['/services', d.nav.services]] },
  { title: d.common.footerMore, links: [['/portfolio', d.nav.portfolio], ['/testimonials', d.nav.testimonials], ['/nexify-dev', d.nav.nexifyDev], ['/media-kit', d.nav.mediaKit], ['/contact', d.nav.contact]] },
  { title: d.common.footerLegal, links: [['/privacy', d.nav.privacy], ['/terms', d.nav.terms], ['/cookies', d.nav.cookies], ['/disclaimer', d.nav.disclaimer]] },
];

export function Footer({ d }: { d: Dict }) {
  return (
    <footer className="ftr">
      <div className="wrap">
        <div className="ftr__grid">
          <div className="ftr__brand">
            <Link className="brand" href="/"><LogoMark /><span className="brand__name">Nexify</span></Link>
            <p className="ftr__tag">{d.common.footerTagline}</p>
            <p className="ftr__mail"><Icon name="mail" /><a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a></p>
          </div>
          <nav className="ftr__nav" aria-label={d.common.footerNav}>
            {groups(d).map((g) => (
              <div key={g.title}>
                <h2 className="ftr__h">{g.title}</h2>
                <ul>{g.links.map(([href, label]) => <li key={href}><Link className="ftr__link" href={href}>{label}</Link></li>)}</ul>
              </div>
            ))}
          </nav>
          <div>
            <h2 className="ftr__h">{d.common.footerFind}</h2>
            <Socials d={d} compact />
          </div>
        </div>
        <div className="ftr__bottom">
          <p>© {new Date().getFullYear()} Nexify. {d.common.footerNote}</p>
          <p>{d.common.footerDraft}</p>
        </div>
      </div>
    </footer>
  );
}
