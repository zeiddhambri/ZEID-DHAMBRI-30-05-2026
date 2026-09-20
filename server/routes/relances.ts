import { Router } from 'express';
import { db } from '../db/dataStore';

const router = Router();

// ==========================================
// 1. RELANCES LOGS & TRIGGER
// ==========================================

// GET all relance logs
router.get('/', (req, res) => {
  const logs = db.getRelanceLogs();
  res.json({
    count: logs.length,
    data: logs
  });
});

// POST send immediate relance (SMS, Email, Call, Letter)
router.post('/send', (req, res) => {
  const { dossierId, templateId, channel = 'sms', customMessage, recipient } = req.body;

  const dossiers = db.getDossiers();
  const dossier = dossiers.find(d => String(d.id) === String(dossierId) || d.client_code === dossierId);

  if (!dossier) {
    return res.status(404).json({ error: 'Dossier introuvable' });
  }

  const templates = db.getTemplates();
  const template = templates.find(t => t.id === templateId) || templates[0];

  let finalContent = customMessage || template?.content || 'Rappel de votre échéance en cours.';
  finalContent = finalContent
    .replace(/\{\{debiteur\}\}/g, dossier.debtor_name)
    .replace(/\{\{montant\}\}/g, Number(dossier.amount).toLocaleString('fr-TN'))
    .replace(/\{\{echeance\}\}/g, dossier.due_date || 'immédiate')
    .replace(/\{\{reference\}\}/g, dossier.client_code)
    .replace(/\{\{rib\}\}/g, '08 000 0001234567890 45');

  const logEntry = {
    id: `rel-${Date.now()}`,
    dossierId: dossier.id,
    clientCode: dossier.client_code,
    debtorName: dossier.debtor_name,
    channel,
    recipient: recipient || dossier.debtor_phone || dossier.debtor_email || 'Contact officiel',
    templateUsed: template?.name || 'Message direct',
    content: finalContent,
    status: 'delivered',
    timestamp: new Date().toISOString()
  };

  // Update dossier status to en_relance if it was a_relancer
  if (dossier.status === 'a_relancer') {
    dossier.status = 'en_relance';
    dossier.updated_at = new Date().toISOString();
  }

  db.getRelanceLogs().unshift(logEntry);
  db.save();

  res.status(201).json({
    message: `Relance ${channel.toUpperCase()} transmise avec succès`,
    log: logEntry,
    dossierStatus: dossier.status
  });
});

// ==========================================
// 2. MODÈLES DE MESSAGES (TEMPLATES)
// ==========================================

// GET all templates
router.get('/templates', (req, res) => {
  const templates = db.getTemplates();
  res.json({
    count: templates.length,
    data: templates
  });
});

// POST create template
router.post('/templates', (req, res) => {
  const { name, channel, category, subject, content, variables } = req.body;

  if (!name || !content) {
    return res.status(400).json({ error: 'Nom et contenu du modèle obligatoires' });
  }

  const templates = db.getTemplates();
  const newTemplate = {
    id: `tpl-${Date.now()}`,
    name,
    channel: channel || 'sms',
    category: category || 'amiable',
    subject: subject || name,
    content,
    variables: variables || ['debiteur', 'montant', 'echeance'],
    active: true
  };

  templates.push(newTemplate);
  db.save();

  res.status(201).json(newTemplate);
});

// PUT update template
router.put('/templates/:id', (req, res) => {
  const templates = db.getTemplates();
  const index = templates.findIndex(t => t.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ error: 'Modèle introuvable' });
  }

  templates[index] = {
    ...templates[index],
    ...req.body
  };
  db.save();

  res.json(templates[index]);
});

// DELETE template
router.delete('/templates/:id', (req, res) => {
  const templates = db.getTemplates();
  const index = templates.findIndex(t => t.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ error: 'Modèle introuvable' });
  }

  const removed = templates.splice(index, 1)[0];
  db.save();

  res.json({ message: 'Modèle supprimé', removedId: removed.id });
});

// POST preview template with sample values
router.post('/templates/preview', (req, res) => {
  const { content, values } = req.body;

  if (!content) {
    return res.status(400).json({ error: 'Contenu requis pour la prévisualisation' });
  }

  const v = {
    debiteur: values?.debiteur || 'STE ALPHA SARL',
    montant: values?.montant ? `${Number(values.montant).toLocaleString('fr-TN')} TND` : '145 000 TND',
    echeance: values?.echeance || '15/06/2026',
    reference: values?.reference || 'RCV-2024-001',
    rib: values?.rib || '08 000 0001234567890 45',
    adresse: values?.adresse || 'Zone Industrielle Charguia II, Tunis'
  };

  let rendered = content;
  Object.keys(v).forEach(key => {
    rendered = rendered.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), v[key as keyof typeof v]);
  });

  res.json({
    original: content,
    rendered
  });
});

// ==========================================
// 3. RÈGLES D'ESCALADE
// ==========================================

// GET all escalation rules
router.get('/escalade', (req, res) => {
  const rules = db.getEscalationRules();
  res.json({
    count: rules.length,
    data: rules
  });
});

// POST create escalation rule
router.post('/escalade', (req, res) => {
  const { name, triggerDays, condition, action, targetLevel } = req.body;

  if (!name || !triggerDays) {
    return res.status(400).json({ error: 'Nom et délai de déclenchement obligatoires' });
  }

  const rules = db.getEscalationRules();
  const newRule = {
    id: `esc-${Date.now()}`,
    name,
    triggerDays: Number(triggerDays),
    condition: condition || `retard > ${triggerDays} jours`,
    action: action || 'Alerte superviseur',
    targetLevel: targetLevel || 'superviseur',
    active: true
  };

  rules.push(newRule);
  db.save();

  res.status(201).json(newRule);
});

// PATCH toggle escalation rule
router.patch('/escalade/:id/toggle', (req, res) => {
  const rules = db.getEscalationRules();
  const rule = rules.find(r => r.id === req.params.id);

  if (!rule) {
    return res.status(404).json({ error: 'Règle d\'escalade introuvable' });
  }

  rule.active = !rule.active;
  db.save();

  res.json(rule);
});

// POST execute escalation engine
router.post('/escalade/run-engine', (req, res) => {
  const dossiers = db.getDossiers();
  const rules = db.getEscalationRules().filter(r => r.active);
  const escalated: any[] = [];

  dossiers.forEach(d => {
    const delay = Number(d.delay_days) || 0;
    rules.forEach(r => {
      if (delay >= r.triggerDays && d.management_level !== r.targetLevel && d.status !== 'paye') {
        const prevLevel = d.management_level;
        d.management_level = r.targetLevel;
        d.updated_at = new Date().toISOString();

        escalated.push({
          dossierId: d.id,
          clientCode: d.client_code,
          debtorName: d.debtor_name,
          previousLevel: prevLevel,
          newLevel: r.targetLevel,
          triggeredRule: r.name
        });
      }
    });
  });

  db.save();

  res.json({
    message: 'Moteur d\'escalade exécuté avec succès',
    totalChecked: dossiers.length,
    escalatedCount: escalated.length,
    escalated
  });
});

export default router;
