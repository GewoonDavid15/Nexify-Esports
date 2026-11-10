import type { Metadata } from 'next';
import { getI18n } from '@/lib/i18n/server';
import { Button } from '@/components/ui/Button';

export async function generateMetadata(): Promise<Metadata> {
  const { d } = await getI18n();
  return { title: { absolute: `${d.meta.notFound.title} · Nexify` }, description: d.meta.notFound.description, robots: { index: false } };
}

export default async function NotFound() {
  const { d } = await getI18n();
  return (
    <section className="nf" aria-labelledby="nf-title">
      <div className="nf__art" aria-hidden>
        <span className="nf__code" data-text="404">404</span>
        <span className="nf__cloud nf__cloud--1" /><span className="nf__cloud nf__cloud--2" /><span className="nf__cloud nf__cloud--3" />
      </div>
      <p className="kicker">{d.notFound.eyebrow}</p>
      <h1 id="nf-title" className="phero__title nf__title">{d.notFound.title}</h1>
      <p className="phero__lead">{d.notFound.text}</p>
      <div className="actions actions--center">
        <Button href="/">{d.common.backHome}</Button>
        <Button href="/contact" variant="ghost">{d.nav.contact}</Button>
      </div>
    </section>
  );
}
