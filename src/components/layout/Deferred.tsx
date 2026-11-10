'use client';

import dynamic from 'next/dynamic';

// Not needed for first paint: loaded in separate chunks after hydration.
export const CommandPalette = dynamic(() => import('./CommandPalette').then((m) => m.CommandPalette), { ssr: false });
export const LangSuggest = dynamic(() => import('./LangSuggest').then((m) => m.LangSuggest), { ssr: false });
