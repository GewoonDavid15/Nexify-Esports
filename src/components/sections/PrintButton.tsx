'use client';

import { Icon } from '../ui/Icon';

export function PrintButton({ label }: { label: string }) {
  return <button type="button" className="btn btn--ghost btn--sm" onClick={() => window.print()}><Icon name="folder" /><span>{label}</span></button>;
}
