import { getI18n } from '@/lib/i18n/server';
import { pageMeta } from '@/lib/meta';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { Terminal } from '@/components/motion/Terminal';
import { Chip, SplitText, Tile } from '@/components/sections/Blocks';

export const generateMetadata = () => pageMeta('nexifyDev', '/nexify-dev');

export default async function NexifyDev() {
  const { d } = await getI18n();
  const n = d.nexifyDev;
  const c = n.console;
  return (
    <>
      <section className="phero dev" aria-labelledby="page-title">
        <div className="wrap dev__grid">
          <div>
            <Chip><Icon name="code" /> {n.eyebrow}</Chip>
            <h1 id="page-title" className="phero__title dev__title">
              <SplitText text="Nexify" /> <span className="dev__by">by</span> <span className="grad-text"><SplitText text="Nexify" /></span>
            </h1>
            <p className="phero__lead">{n.lead}</p>
          </div>
          <Terminal title={n.consoleLabel} rows={[
            { key: c.project, value: 'Nexify by Nexify' },
            { key: c.type, value: c.typeValue },
            { key: c.status, value: c.statusValue, ok: true },
            { key: c.releases, value: c.releasesValue },
          ]} />
        </div>
      </section>
      <div className="wrap">
        <div className="bento bento--2">
          <Tile as="article"><h2 className="card__title">{n.whatTitle}</h2><p className="card__text">{n.whatText}</p></Tile>
          <Tile as="article"><h2 className="card__title">{n.statusTitle}: <span className="badge">{n.statusValue}</span></h2><p className="card__text">{n.statusText}</p></Tile>
        </div>
      </div>
      <section className="sec" aria-labelledby="log-title">
        <div className="wrap wrap--narrow">
          <h2 className="shead__title shead__title--sm" id="log-title" data-reveal="">{n.logTitle}</h2>
          <p className="log" data-reveal=""><span aria-hidden>›</span> {n.logEmpty}</p>
          <div className="devback" data-reveal="" data-spot="">
            <div><h2 className="card__title">{n.backTitle}</h2><p className="card__text">{n.backText}</p></div>
            <div className="actions"><Button href="/about" variant="ghost">{d.nav.about}</Button><Button href="/services" variant="ghost">{d.nav.services}</Button></div>
          </div>
        </div>
      </section>
    </>
  );
}
