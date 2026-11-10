import { notFound } from 'next/navigation';

// Any unknown path inside a language renders app/[lang]/not-found.tsx.
export const dynamicParams = true;
export default function CatchAll() { notFound(); }
