import type { ElementType } from 'react';

/** Renders a trusted dictionary string that may contain <strong>/<a> markup. */
export function Rich({ as: Tag = 'span', html, className }: { as?: ElementType; html: string; className?: string }) {
  return <Tag className={className} dangerouslySetInnerHTML={{ __html: html }} />;
}
