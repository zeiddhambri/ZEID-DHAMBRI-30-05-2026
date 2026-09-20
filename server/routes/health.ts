import { Router } from 'express';
import { db } from '../db/dataStore';

const router = Router();

router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    app: 'RecovAI Backend API',
    version: '2.4.0',
    environment: process.env.NODE_ENV || 'development',
    uptimeSeconds: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
    database: db.stats()
  });
});

export default router;
