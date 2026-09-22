import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';

// Routers
import authRouter from './server/routes/auth';
import auditRouter from './server/routes/audit';
import healthRouter from './server/routes/health';
import dossiersRouter from './server/routes/dossiers';
import portefeuillesRouter from './server/routes/portefeuilles';
import contentieuxRouter from './server/routes/contentieux';
import relancesRouter from './server/routes/relances';
import creditIfrs9Router from './server/routes/creditIfrs9';
import clientsRouter from './server/routes/clients';
import pilotageRouter from './server/routes/pilotage';
import institutionsRouter from './server/routes/institutions';
import supabaseCompatRouter from './server/routes/supabaseCompat';

// Durcissement lot P0 (voir docs/ANALYSE-PRESENTATION-INSTITUTIONS-FINANCIERES.md)
import { requireAuth, rateLimit } from './server/auth';
import { corsAllowlist, securityHeaders } from './server/security';

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.disable('x-powered-by');

  // En-têtes de sécurité + CORS par allowlist (remplace l'ancien wildcard '*').
  app.use(securityHeaders());
  app.use(corsAllowlist());

  // Parsing JSON borné : 2 Mo par défaut (les imports volumineux passent par des
  // connecteurs batch au lot P1, pas par le corps d'une requête web).
  app.use(express.json({ limit: '2mb' }));
  app.use(express.urlencoded({ extended: true, limit: '512kb' }));

  // Limite globale de débit par IP sur l'API (protection anti-harvesting/brute-force).
  const apiRateLimit = rateLimit(300, 60_000);
  app.use('/api', apiRateLimit);
  app.use('/rest/v1', apiRateLimit);

  // --- Routes publiques (authentification + supervision minimale) ---
  app.use('/api/auth', authRouter);
  app.use('/api', healthRouter);

  // --- Routes métier protégées : jeton Bearer obligatoire + RBAC par rôle ---
  app.use('/api/audit', auditRouter);
  app.use('/api/dossiers', requireAuth, dossiersRouter);
  app.use('/api/portefeuilles', requireAuth, portefeuillesRouter);
  app.use('/api/contentieux', requireAuth, contentieuxRouter);
  app.use('/api/relances', requireAuth, relancesRouter);
  app.use('/api/credit-ifrs9', requireAuth, creditIfrs9Router);
  app.use('/api/clients', requireAuth, clientsRouter);
  app.use('/api/pilotage', requireAuth, pilotageRouter);
  app.use('/api/institutions', requireAuth, institutionsRouter);

  // Supabase PostgREST compatibility layer — protégée également.
  app.use('/rest/v1', requireAuth, supabaseCompatRouter);

  // Vite middleware for development vs static build in production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[RecovAI Server] Backend running at http://0.0.0.0:${PORT} (API protégée par jeton — POST /api/auth/login)`);
  });
}

startServer();
