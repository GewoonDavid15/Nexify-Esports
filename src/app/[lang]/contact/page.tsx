import { fmt } from '@/lib/i18n';
import { i18nFromParams, type LangParams } from '@/lib/i18n/server';
import { pageMeta } from '@/lib/meta';
import { site } from '@/lib/config';
import { Icon } from '@/components/ui/Icon';
import { AvailabilityBadge, PageHero } from '@/components/sections/Blocks';
import { Socials } from '@/components/sections/Socials';
import { DiscordStatus } from '@/components/sections/DiscordStatus';
import { ContactForm } from '@/components/sections/ContactForm';
import { issueToken } from '@/lib/contact/spam';
import { features } from '@/lib/features';

// Per request: the form's anti-spam token must be fresh.
export const dynamic = 'force-dynamic';

export const generateMetadata = ({ params }: LangParams) => pageMeta(params, 'contact', '/contact');

function CopyButton({ value, label, failed }: { value: string; label: string; failed: string }) {
  return (
    <button type="button" className="copy-btn" data-copy={value} data-failed={failed}>
      <Icon name="copy" className="copy-btn__icon" />
      <Icon name="check" className="copy-btn__done" />
      <span>{label}</span>
    </button>
  );
}

export default async function Contact({ params }: LangParams) {
  const { d } = await i18nFromParams(params);
  const c = d.contact;
  const email = site.contactEmail;
  return (
    <>
      <PageHero eyebrow={c.eyebrow} title={c.title} lead={c.lead} extra={<div className="phero__extra"><AvailabilityBadge d={d} /></div>} />
      <div className="wrap contact">
        <div className="contact__main">
          {features.contactForm() ? (
            <section className="panel panel--form" aria-labelledby="form-title" data-reveal="">
              <h2 className="panel__title" id="form-title">{c.formTitle}</h2>
              <ContactForm t={c} token={issueToken()} />
            </section>
          ) : null}
          <section className="panel panel--glow" aria-labelledby="email-title" data-reveal="" data-spot="">
            <h2 className="panel__title" id="email-title">{c.emailTitle}</h2>
            <p>{c.emailText}</p>
            <div className="contact__actions">
              <a className="mail-link" href={`mailto:${email}`} aria-label={`${c.emailOpen}: ${email}`}><Icon name="mail" /><span>{email}</span></a>
              <CopyButton value={email} label={c.copyEmail} failed={fmt(d.common.copyFailed, { value: email })} />
            </div>
          </section>
          <section className="panel" aria-labelledby="discord-title" data-reveal="" data-spot="">
            <h2 className="panel__title" id="discord-title">{c.discordTitle}</h2>
            <p>{c.discordText}</p>
            <div className="contact__actions">
              <span className="mail-link"><Icon name="discord" /><span>officialnexify</span></span>
              <CopyButton value="officialnexify" label={d.common.copyDiscord} failed={fmt(d.common.copyFailed, { value: 'officialnexify' })} />
            </div>
            <DiscordStatus handle="officialnexify" t={{ label: d.common.discordLabel, online: d.common.discordOnline, idle: d.common.discordIdle, dnd: d.common.discordDnd, offline: d.common.discordOffline, playing: d.common.discordPlaying }} />
          </section>
        </div>
        <aside className="contact__side">
          <section className="panel" aria-labelledby="tips-title" data-reveal="">
            <h2 className="panel__title" id="tips-title">{c.tipsTitle}</h2>
            <ul className="ticks">{c.tips.map((t) => <li key={t}><Icon name="check" /><span>{t}</span></li>)}</ul>
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
