import type { UserProfile } from './types';

const TOKEN = 'itt.token';
const USER = 'itt.user';
const EXPIRES = 'itt.expires';

export interface Session { token: string; user: UserProfile }

export function saveSession(token: string, user: UserProfile, expiresAt: string) {
  try {
    localStorage.setItem(TOKEN, token);
    localStorage.setItem(USER, JSON.stringify(user));
    localStorage.setItem(EXPIRES, expiresAt);
  } catch { /* storage unavailable: session lasts until reload */ }
}

export function clearSession() {
  try {
    localStorage.removeItem(TOKEN);
    localStorage.removeItem(USER);
    localStorage.removeItem(EXPIRES);
  } catch { /* ignore */ }
}

export function getToken(): string | null {
  try { return localStorage.getItem(TOKEN); } catch { return null; }
}

export function loadSession(): Session | null {
  try {
    const token = localStorage.getItem(TOKEN);
    const user = localStorage.getItem(USER);
    const expires = localStorage.getItem(EXPIRES);
    if (!token || !user) return null;
    if (expires && new Date(expires).getTime() <= Date.now()) { clearSession(); return null; }
    return { token, user: JSON.parse(user) as UserProfile };
  } catch {
    return null;
  }
}
