import type { Dict } from '@/lib/i18n';
import { fmt } from '@/lib/i18n';
import { socials } from '@/lib/config';
import { Icon } from '../ui/Icon';

export function Socials({ d, compact = false }: { d: Dict; compact?: boolean }) {
  return (
    <ul className={`socials${compact ? ' socials--compact' : ''}`}>
      {socials.map((s) => (
        <li key={s.id}>
          {s.copy ? (
            <button type="button" className="social" data-copy={s.copy} data-spot="" data-failed={fmt(d.common.copyFailed, { value: s.copy })}>
              <Icon name={s.id} className="social__icon" />
              <span className="social__text"><span className="social__label">{s.label}</span><span className="social__handle">{s.handle}</span></span>
              <span className="sr-only"> — {d.common.copyDiscord}</span>
              <Icon name="copy" className="social__end" />
              <Icon name="check" className="social__done" />
            </button>
          ) : (
            <a className="social" href={s.href} target="_blank" rel="noopener noreferrer me" data-spot="">
              <Icon name={s.id} className="social__icon" />
              <span className="social__text"><span className="social__label">{compact && s.short ? s.short : s.label}</span><span className="social__handle">{s.handle}</span></span>
              <Icon name="arrowUpRight" className="social__end" />
              <span className="sr-only"> {d.common.newTab}</span>
            </a>
          )}
        </li>
      ))}
    </ul>
  );
}
