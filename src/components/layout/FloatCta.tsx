'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { stripLang } from '@/lib/path';
import { AnimatePresence, m } from 'motion/react';
import { Icon } from '../ui/Icon';

/** Floating "Let's talk" button (hidden on the contact page). */
export function FloatCta({ label }: { label: string }) {
  const pathname = stripLang(usePathname());
  return (
    <AnimatePresence>
      {pathname !== '/contact' && (
        <m.div className="float-cta" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0, transition: { delay: 1.2 } }} exit={{ opacity: 0, y: 20 }}>
          <Link href="/contact" className="float-cta__btn" data-magnetic=""><Icon name="mail" /><span>{label}</span></Link>
        </m.div>
      )}
    </AnimatePresence>
  );
}
