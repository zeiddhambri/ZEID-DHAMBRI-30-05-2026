import { Router } from 'express';
import { db } from '../db/dataStore';
import { audit, requireRole } from '../auth';
import { validate, createDossierSchema, updateDossierSchema } from '../validation';

const router = Router();

// GET all dossiers with query filters
router.get('/', (req, res) => {
  const { status, search, management_level, portfolio } = req.query;
  let dossiers = [...db.getDossiers()];

  if (status && status !== 'all') {
    dossiers = dossiers.filter(d => d.status === status);
  }

  if (management_level && management_level !== 'all') {
    dossiers = dossiers.filter(d => d.management_level === management_level);
  }

  if (portfolio && portfolio !== 'all') {
    dossiers = dossiers.filter(d => (d.portfolio || '').toLowerCase() === String(portfolio).toLowerCase());
  }

  if (search) {
    const q = String(search).toLowerCase();
    dossiers = dossiers.filter(d =>
      (d.debtor_name || '').toLowerCase().includes(q) ||
      (d.client_code || '').toLowerCase().includes(q) ||
      (d.debtor_phone || '').toLowerCase().includes(q) ||
      (d.debtor_email || '').toLowerCase().includes(q)
    );
  }

  res.json({
    count: dossiers.length,
    data: dossiers
  });
});

// GET dossier summary statistics
router.get('/stats/summary', (req, res) => {
  const dossiers = db.getDossiers();
  const totalAmount = dossiers.reduce((acc, d) => acc + (Number(d.amount) || 0), 0);
  const totalRecovered = dossiers.reduce((acc, d) => acc + (Number(d.recovered_amount) || 0), 0);
  
  const byStatus: Record<string, number> = {};
  dossiers.forEach(d => {
    byStatus[d.status] = (byStatus[d.status] || 0) + 1;
  });

  const recoveryRate = totalAmount > 0 ? ((totalRecovered / totalAmount) * 100).toFixed(1) : '0.0';

  res.json({
    totalDossiers: dossiers.length,
    totalAmount,
    totalRecovered,
    remainingAmount: totalAmount - totalRecovered,
    recoveryRate: `${recoveryRate}%`,
    byStatus
  });
});

// GET single dossier by ID
router.get('/:id', (req, res) => {
  const dossiers = db.getDossiers();
  const dossier = dossiers.find(d => String(d.id) === String(req.params.id) || d.client_code === req.params.id);

  if (!dossier) {
    return res.status(404).json({ error: 'Dossier introuvable' });
  }

  // Get associated actions from relanceLogs
  const actions = db.getRelanceLogs().filter(l => String(l.dossierId) === String(dossier.id));

  res.json({
    ...dossier,
    history: actions
  });
});

// POST create new dossier
router.post('/', validate(createDossierSchema), (req, res) => {
  const { debtor_name, amount, debtor_email, debtor_phone, due_date, assigned_to, management_level, status, notes, portfolio, institution, branch } = req.body;

  const dossiers = db.getDossiers();
  const year = new Date().getFullYear();
  const randomSuffix = Math.floor(Math.random() * 9000 + 1000);
  const client_code = req.body.client_code || `RCV-${year}-${randomSuffix}`;

  const newDossier = {
    id: String(Date.now()),
    user_id: req.auth?.sub || 'system-user',
    client_code,
    debtor_name: debtor_name.trim(),
    debtor_email: debtor_email || null,
    debtor_phone: debtor_phone || null,
    amount: Number(amount) || 0,
    recovered_amount: 0,
    status: status || 'a_relancer',
    management_level: management_level || 'recouvreur',
    assigned_to: assigned_to || 'Non assigné',
    due_date: due_date || new Date().toISOString().slice(0, 10),
    portfolio: portfolio || 'Amiable',
    institution: institution || 'Banque de l\'Habitat',
    branch: branch || 'Tunis',
    risk_level: Number(amount) > 100000 ? 'Critique' : (Number(amount) > 30000 ? 'Élevé' : 'Moyen'),
    delay_days: 30,
    notes: notes || '',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  dossiers.unshift(newDossier);
  db.save();

  // Log audit (auteur issu du jeton d'authentification)
  audit('CREATE_DOSSIER', `Création du dossier ${newDossier.client_code} (${newDossier.debtor_name}) pour ${Number(newDossier.amount).toLocaleString('fr-TN')} TND`, req.auth);

  res.status(201).json(newDossier);
});

// PATCH / PUT update dossier
function applyDossierPatch(req: any, res: any) {
  const dossiers = db.getDossiers();
  const index = dossiers.findIndex(d => String(d.id) === String(req.params.id) || d.client_code === req.params.id);

  if (index === -1) {
    return res.status(404).json({ error: 'Dossier introuvable' });
  }

  const existing = dossiers[index];
  const changes = { ...req.body };
  delete changes.user_id;
  delete changes.id;
  const updated = {
    ...existing,
    ...changes,
    updated_at: new Date().toISOString()
  };

  dossiers[index] = updated;
  db.save();

  // Journal : champs modifiés par l'auteur authentifié (P1 : différentiel complet en base).
  const changedFields = Object.keys(changes).filter(k => JSON.stringify(existing[k]) !== JSON.stringify(updated[k]));
  audit('UPDATE_DOSSIER', `Modification du dossier ${existing.client_code} — champs: ${changedFields.join(', ') || 'aucun'}`, req.auth);

  res.json(updated);
}

router.patch('/:id', validate(updateDossierSchema), applyDossierPatch);
router.put('/:id', validate(updateDossierSchema), applyDossierPatch);

// DELETE dossier — réservé manager/admin (suppression = acte sensible en recouvrement)
router.delete('/:id', requireRole('admin', 'manager'), (req, res) => {
  const dossiers = db.getDossiers();
  const index = dossiers.findIndex(d => String(d.id) === String(req.params.id) || d.client_code === req.params.id);

  if (index === -1) {
    return res.status(404).json({ error: 'Dossier introuvable' });
  }

  const deleted = dossiers.splice(index, 1)[0];
  db.save();

  audit('DELETE_DOSSIER', `Suppression du dossier ${deleted.client_code} (${deleted.debtor_name})`, req.auth);

  res.json({ message: 'Dossier supprimé avec succès', deletedId: deleted.id });
});

// POST action on dossier (Promise to pay, payment, visit, phone call)
router.post('/:id/actions', (req, res) => {
  const dossiers = db.getDossiers();
  const dossier = dossiers.find(d => String(d.id) === String(req.params.id) || d.client_code === req.params.id);

  if (!dossier) {
    return res.status(404).json({ error: 'Dossier introuvable' });
  }

  const { type, amount, note, outcome, nextActionDate } = req.body;

  const newAction = {
    id: `act-${Date.now()}`,
    dossierId: dossier.id,
    clientCode: dossier.client_code,
    debtorName: dossier.debtor_name,
    type: type || 'call',
    amount: amount ? Number(amount) : null,
    outcome: outcome || 'callback',
    note: note || '',
    nextActionDate: nextActionDate || null,
    performedBy: req.body.performedBy || 'Agent Recouvrement',
    timestamp: new Date().toISOString()
  };

  // If a payment is recorded, update recovered_amount
  if (type === 'payment' && amount && Number(amount) > 0) {
    dossier.recovered_amount = (dossier.recovered_amount || 0) + Number(amount);
    if (dossier.recovered_amount >= dossier.amount) {
      dossier.status = 'paye';
    } else {
      dossier.status = 'partiellement_paye';
    }
  } else if (type === 'promise') {
    dossier.status = 'promesse_paiement';
  }

  dossier.updated_at = new Date().toISOString();
  db.getRelanceLogs().unshift(newAction);
  db.save();

  res.status(201).json({
    message: 'Action enregistrée',
    action: newAction,
    dossier
  });
});

export default router;
