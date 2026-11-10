// Inline SVG icons (decorative unless a label is passed).
const paths = {
  youtube: '<path d="M21.6 7.2a2.6 2.6 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4A2.6 2.6 0 0 0 2.4 7.2 27 27 0 0 0 2 12a27 27 0 0 0 .4 4.8 2.6 2.6 0 0 0 1.8 1.8C5.8 19 12 19 12 19s6.2 0 7.8-.4a2.6 2.6 0 0 0 1.8-1.8A27 27 0 0 0 22 12a27 27 0 0 0-.4-4.8Z"/><path d="m10 15 5.2-3L10 9z" fill="currentColor" stroke="none"/>',
  x: '<path d="M4 4l16 16M20 4 4 20" />',
  discord: '<path d="M8.5 7.5c2.3-.7 4.7-.7 7 0M7.7 16.6c2.8 1 5.8 1 8.6 0"/><path d="M15.5 7.5 16.6 6c1.6.5 2.8 1.2 3.6 2 1.3 2.8 1.6 5.6 1.3 8.4-1.2 1-2.6 1.8-4 2.2l-1-1.8M8.5 7.5 7.4 6c-1.6.5-2.8 1.2-3.6 2-1.3 2.8-1.6 5.6-1.3 8.4 1.2 1 2.6 1.8 4 2.2l1-1.8"/><circle cx="9.3" cy="12.3" r="1.2" fill="currentColor" stroke="none"/><circle cx="14.7" cy="12.3" r="1.2" fill="currentColor" stroke="none"/>',
  tracker: '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
  arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  download: '<path d="M12 4v11M7 10l5 5 5-5M5 20h14"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="m4 7 8 6 8-6"/>',
  check: '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
  alert: '<circle cx="12" cy="12" r="9"/><path d="M12 7.5v5.5M12 16.5v.01"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5.5M12 7.5v.01"/>',
  copy: '<rect x="8" y="8" width="12" height="12" rx="2.5"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/>',
  external: '<path d="M14 4h6v6M20 4l-9 9M18 14v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  close: '<path d="M6 6l12 12M18 6 6 18"/>',
  spark: '<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6.3 6.3l2.5 2.5M15.2 15.2l2.5 2.5M6.3 17.7l2.5-2.5M15.2 8.8l2.5-2.5"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 20c1.5-3.5 4.5-5 8-5s6.5 1.5 8 5"/>',
  layers: '<path d="m12 3 9 5-9 5-9-5 9-5Z"/><path d="m3 13 9 5 9-5"/>',
  calendar: '<rect x="3" y="5" width="18" height="16" rx="2.5"/><path d="M3 10h18M8 3v4M16 3v4"/>',
  users: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c1-3 3.5-4.5 6.5-4.5s5.5 1.5 6.5 4.5"/><path d="M16 4.6a3.5 3.5 0 0 1 0 6.8M18 15.6c1.7.7 2.9 2.2 3.5 4.4"/>',
  film: '<rect x="3" y="4" width="18" height="16" rx="2.5"/><path d="M7 4v16M17 4v16M3 9h4M3 15h4M17 9h4M17 15h4"/>',
  palette: '<path d="M12 3a9 9 0 1 0 0 18c1.2 0 1.8-.8 1.8-1.7 0-1.3-1-1.6-1-2.7 0-1 .8-1.6 1.8-1.6H17a4 4 0 0 0 4-4C21 6.6 17 3 12 3Z"/><circle cx="7.5" cy="11" r="1" fill="currentColor"/><circle cx="10" cy="7" r="1" fill="currentColor"/><circle cx="15" cy="7.5" r="1" fill="currentColor"/>',
  gear: '<circle cx="12" cy="12" r="3"/><path d="M12 2.5v3M12 18.5v3M4.4 4.4l2.2 2.2M17.4 17.4l2.2 2.2M2.5 12h3M18.5 12h3M4.4 19.6l2.2-2.2M17.4 6.6l2.2-2.2"/>',
  quote: '<path d="M10 7H6a2 2 0 0 0-2 2v4h5v5H4M20 7h-4a2 2 0 0 0-2 2v4h5v5h-5" />',
  folder: '<path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z"/>',
  pin: '<path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 12 2.5a7 7 0 0 1 7 7C19 14.8 12 21 12 21Z"/><circle cx="12" cy="9.5" r="2.5"/>',
  code: '<path d="m8 8-4 4 4 4M16 8l4 4-4 4M14 5l-4 14"/>',
};

export function icon(name, { label, className = '' } = {}) {
  const a11y = label ? `role="img" aria-label="${label}"` : 'aria-hidden="true" focusable="false"';
  return `<svg class="icon ${className}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" ${a11y}>${paths[name] || ''}</svg>`;
}

/** Brand mark: a stylised "N" inside a soft ring. */
let logoCount = 0;
export function logoMark(className = '') {
  const id = `lg-n-${++logoCount}`;
  return `<svg class="logo-mark ${className}" viewBox="0 0 40 40" aria-hidden="true" focusable="false">
    <defs>
      <linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffd27a"/><stop offset=".55" stop-color="#ff9a3c"/><stop offset="1" stop-color="#ff5e1f"/></linearGradient>
    </defs>
    <rect x="1.5" y="1.5" width="37" height="37" rx="11" fill="rgba(255,154,60,.08)" stroke="url(#${id})" stroke-width="1.6"/>
    <path d="M12.5 28V12.5h.4L27 27.5h.5V12" fill="none" stroke="url(#${id})" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`;
}
