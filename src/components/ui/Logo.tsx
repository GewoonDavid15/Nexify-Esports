import { useId } from 'react';

export function LogoMark({ className = '' }: { className?: string }) {
  const id = useId().replace(/:/g, '');
  return (
    <svg className={`logo-mark ${className}`} viewBox="0 0 40 40" aria-hidden focusable={false}>
      <defs>
        <linearGradient id={`g${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ede4ff" />
          <stop offset=".5" stopColor="#b98cff" />
          <stop offset="1" stopColor="#e05cf5" />
        </linearGradient>
      </defs>
      <rect x="1.5" y="1.5" width="37" height="37" rx="12" fill="rgba(168,85,247,.12)" stroke={`url(#g${id})`} strokeWidth="1.6" />
      <path d="M12.5 28V12.5h.4L27 27.5h.5V12" fill="none" stroke={`url(#g${id})`} strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
