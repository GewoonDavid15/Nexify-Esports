import { i18nFromParams, type LangParams } from '@/lib/i18n/server';
import { pageMeta } from '@/lib/meta';
import { site } from '@/lib/config';
import { issueToken } from '@/lib/contact/spam';
import { isConfigured } from '@/lib/contact/mailer';
import { Icon } from '@/components/ui/Icon';
import { AvailabilityBadge, PageHero } from '@/components/sections/Blocks';
import { Socials } from '@/components/sections/Socials';
import { ContactForm } from '@/components/sections/ContactForm';

// Rendered per request: the anti-spam token must be fresh.
export const dynamic = 'force-dynamic';

export const generateMetadata = ({ params }: LangParams) => pageMeta(params, 'contact', '/contact');

export default async function Contact({ params }: LangParams) {
  const { d } = await i18nFromParams(params);
  const c = d.contact;
  return (
    <>
      <PageHero eyebrow={c.eyebrow} title={c.title} lead={c.lead} extra={<div className="phero__extra"><AvailabilityBadge d={d} /></div>} />
      <div className="wrap contact">
        <section className="panel panel--form" aria-labelledby="form-title" data-reveal="">
          <h2 className="panel__title" id="form-title">{c.formTitle}</h2>
          <ContactForm t={c} token={issueToken()} configured={isConfigured()} />
        </section>
        <aside className="contact__side">
          <section className="panel" aria-labelledby="direct-title" data-reveal="" data-spot="">
            <h2 className="panel__title" id="direct-title">{c.directTitle}</h2>
            <p>{c.directText}</p>
            <a className="mail-link" href={`mailto:${site.contactEmail}`}><Icon name="mail" /><span>{site.contactEmail}</span></a>
          </section>
          <section className="panel" aria-labelledby="else-title" data-reveal="">
            <h2 className="panel__title" id="else-title">{c.elsewhereTitle}</h2>
            <Socials d={d} />
          </section>
        </aside>
      </div>
    </>
  );
}
