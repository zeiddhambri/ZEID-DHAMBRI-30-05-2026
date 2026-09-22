import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';

// Routers
import healthRouter from './server/routes/health';
import dossiersRouter from './server/routes/dossiers';
import portefeuillesRouter from './server/routes/portefeuilles';
import contentieuxRouter from './server/routes/contentieux';
import relancesRouter from './server/routes/relances';
import creditIfrs9Router from './server/routes/creditIfrs9';
import clientsRouter from './server/routes/clients';
import pilotageRouter from './server/routes/pilotage';
import institutionsRouter from './server/routes/institutions';
import integrationsRouter from './server/routes/integrations';
import enterpriseSecurityRouter from './server/routes/enterpriseSecurity';
import supabaseCompatRouter from './server/routes/supabaseCompat';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Global Middlewares
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Basic CORS headers
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, apiKey, prefer');
    if (req.method === 'OPTIONS') {
      return res.sendStatus(200);
    }
    next();
  });

  // Mount API Domain Routes
  app.use('/api', healthRouter);
  app.use('/api/dossiers', dossiersRouter);
  app.use('/api/portefeuilles', portefeuillesRouter);
  app.use('/api/contentieux', contentieuxRouter);
  app.use('/api/relances', relancesRouter);
  app.use('/api/credit-ifrs9', creditIfrs9Router);
  app.use('/api/clients', clientsRouter);
  app.use('/api/pilotage', pilotageRouter);
  app.use('/api/institutions', institutionsRouter);
  app.use('/api/integrations', integrationsRouter);
  app.use('/api/enterprise', enterpriseSecurityRouter);

  // Supabase PostgREST compatibility layer (enables supabase.from() to hit the backend directly)
  app.use('/rest/v1', supabaseCompatRouter);

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
    console.log(`[RecovAI Server] Backend running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
