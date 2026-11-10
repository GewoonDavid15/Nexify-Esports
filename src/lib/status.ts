import { status } from './config';
import { fmt } from './i18n/fmt';
import type { Dict } from './i18n/en';

/** Availability texts driven by the single `status` switch in config.ts. */
export function availability(d: Dict) {
  if (status.state === 'signed' && status.team) {
    const vars = { team: status.team, role: status.role || d.roles.smm };
    return { free: false, badge: fmt(d.common.availabilitySigned, vars), text: fmt(d.home.statusTextSigned, vars) };
  }
  return { free: true, badge: d.common.availability, text: d.home.statusText };
}
