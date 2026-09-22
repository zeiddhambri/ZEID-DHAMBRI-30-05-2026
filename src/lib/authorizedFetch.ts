// Lot P0 — Attache automatiquement le jeton d'authentification RecovAI aux
// appels API same-origin ('/api/…', '/rest/v1/…') et purge la session en cas de 401.
// Évite une refonte simultanée de chaque page ; le client typé src/services/api.ts
// reste la voie recommandée pour le nouveau code.
import { readStoredAuth, clearAuth } from '@/contexts/AuthContext';

const PUBLIC_API_PATHS = ['/api/auth/login', '/api/health'];

function needsToken(path: string): boolean {
  if (!path.startsWith('/api/') && !path.startsWith('/rest/v1')) return false;
  return !PUBLIC_API_PATHS.some(p => path.startsWith(p));
}

const originalFetch = window.fetch.bind(window);

window.fetch = async (input: RequestInfo | URL, init: RequestInit = {}): Promise<Response> => {
  let url = typeof input === 'string' ? input : input instanceof URL ? input.toString() : input.url;

  // Normalise les URLs absolues same-origin
  try {
    const parsed = new URL(url, window.location.origin);
    if (parsed.origin === window.location.origin) url = parsed.pathname + parsed.search;
  } catch { /* déjà relatif */ }

  let finalInit: RequestInit = init;

  if (input instanceof Request) {
    // Les appelants de cette base passent une chaîne + init ; ce branchement
    // assure la compatibilité si un objet Request arrivait un jour.
    finalInit = {
      method: init.method ?? input.method,
      headers: (init.headers as HeadersInit) ?? input.headers,
      body: init.body ?? null,
    };
  }

  if (needsToken(url)) {
    const auth = readStoredAuth();
    if (auth?.token) {
      const headers = new Headers(finalInit.headers as HeadersInit | undefined);
      if (!headers.has('Authorization')) headers.set('Authorization', `Bearer ${auth.token}`);
      finalInit = { ...finalInit, headers };
    }
  }

  const res = await originalFetch(url, finalInit);

  if (res.status === 401 && needsToken(url) && !window.location.pathname.startsWith('/auth')) {
    clearAuth();
    window.location.assign('/auth');
  }
  return res;
};
