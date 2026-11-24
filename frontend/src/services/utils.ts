import type { Role } from './types';

export const landingFor = (role: Role) => (role === 'Trainer' ? '/trainer' : '/trainee');

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** Formats a yyyy-MM-dd date without time-zone shifts. Lists: "25 Nov" (year added if not this year). */
export function formatDate(iso: string | null, alwaysYear = false): string {
  if (!iso) return '—';
  const [y, m, d] = iso.split('-').map(Number);
  if (!y || !m || !d) return '—';
  const base = `${d} ${MONTHS[m - 1]}`;
  return alwaysYear || y !== new Date().getFullYear() ? `${base} ${y}` : base;
}

export const isEmail = (v: string) => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v.trim());

export const isHttpUrl = (v: string) => {
  try {
    const u = new URL(v.trim());
    return u.protocol === 'http:' || u.protocol === 'https:';
  } catch {
    return false;
  }
};
