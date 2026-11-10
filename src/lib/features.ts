import 'server-only';
import { isConfigured } from './contact/discord';

/**
 * Optional features, switched on by environment variables in Vercel.
 * They are read at build time for static pages (privacy text), so a redeploy
 * is needed after changing them.
 */
export const features = {
  /** Contact form → private Discord channel. Needs DISCORD_WEBHOOK_URL. */
  contactForm: () => isConfigured(),
  /** Cookieless Vercel Web Analytics. Needs ENABLE_ANALYTICS=1 (and Analytics enabled in the Vercel project). */
  analytics: () => process.env.ENABLE_ANALYTICS === '1' && !!process.env.VERCEL,
};
