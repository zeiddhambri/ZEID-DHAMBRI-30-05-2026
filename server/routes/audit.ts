import { Router } from 'express';
import { db } from '../db/dataStore';
import { requireAuth, requireRole } from '../auth';

const router = Router();

// GET /api/audit — consultation du journal d'audit (append-only en démo;
// journal immuable en base au lot P1). Réservé aux rôles manager/admin.
router.get('/', requireAuth, requireRole('admin', 'manager'), (req, res) => {
  const limit = Math.min(Number(req.query.limit) || 200, 1000);
  const logs = db.getAuditLogs().slice(0, limit);
  res.json({
    count: logs.length,
    disclaimer: 'Journal de démonstration v1 : horodatage et auteur applicatifs. Version opposable (append-only, export SIEM, rétention réglementaire) livrée au lot P1.',
    data: logs,
  });
});

export default router;
