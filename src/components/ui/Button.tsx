import Link from 'next/link';
import type { ReactNode } from 'react';
import { Icon, type IconName } from './Icon';
import { site } from '@/lib/config';

type Variant = 'primary' | 'ghost' | 'light' | 'outline-light';

export function Button({ href, children, variant = 'primary', icon = 'arrow', iconFirst = false, magnetic = true, external = false, newTabLabel }: {
  href: string; children: ReactNode; variant?: Variant; icon?: IconName | null; iconFirst?: boolean; magnetic?: boolean; external?: boolean; newTabLabel?: string;
}) {
  const content = (
    <>
      {iconFirst && icon ? <Icon name={icon} /> : null}
      <span>{children}</span>
      {!iconFirst && icon ? <Icon name={icon} className="btn__end" /> : null}
      {external && newTabLabel ? <span className="sr-only"> {newTabLabel}</span> : null}
    </>
  );
  const cls = `btn btn--${variant}`;
  const data = magnetic ? { 'data-magnetic': '' } : {};
  if (external) return <a className={cls} href={href} target="_blank" rel="noopener noreferrer" {...data}>{content}</a>;
  return <Link className={cls} href={href} {...data}>{content}</Link>;
}

export function CvButton({ label, variant = 'primary' }: { label: string; variant?: Variant }) {
  return (
    <a className={`btn btn--${variant}`} href={site.cv.href} download={site.cv.fileName} type="application/pdf" data-magnetic="">
      <Icon name="download" />
      <span>{label}</span>
    </a>
  );
}
