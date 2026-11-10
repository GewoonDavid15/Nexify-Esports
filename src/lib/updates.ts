import type { Lang } from './config';

/**
 * Updates log — newest first. Add an entry with a date (YYYY-MM-DD) and the
 * text in each language. Shown on the "Nexify by Nexify" page.
 */
export const updates: { date: string; text: Record<Lang, string> }[] = [
  {
    date: '2026-11-10',
    text: {
      en: 'New website launched — in English, Dutch and Portuguese.',
      nl: 'Nieuwe website gelanceerd — in het Engels, Nederlands en Portugees.',
      pt: 'Novo site lançado — em inglês, neerlandês e português.',
    },
  },
];
