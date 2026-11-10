/** Static pages are prerendered as /{lang}/path; the browser shows /path. */
export const stripLang = (p: string | null | undefined) => (p || '/').replace(/^\/(en|nl|pt)(?=\/|$)/, '') || '/';
