import { Router } from 'express';
import { db } from '../db/dataStore';
import { audit } from '../auth';
import { validate, createLitigationSchema, lawyerBailiffSchema } from '../validation';

const router = Router();

// ==========================================
// 1. DOSSIERS CONTENTIEUX
// ==========================================

// GET all litigation cases with filters
router.get('/dossiers', (req, res) => {
  const { stage, search, portfolio, lawyer_id } = req.query;
  let cases = [...db.getLitigationCases()];

  if (stage && stage !== 'all') {
    cases = cases.filter(c => c.stage === stage);
  }

  if (portfolio && portfolio !== 'all') {
    cases = cases.filter(c => (c.portfolio || '').toLowerCase() === String(portfolio).toLowerCase());
  }

  if (lawyer_id) {
    cases = cases.filter(c => c.lawyer?.id === lawyer_id);
  }

  if (search) {
    const q = String(search).toLowerCase();
    cases = cases.filter(c =>
      c.id.toLowerCase().includes(q) ||
      (c.debtor?.name || '').toLowerCase().includes(q) ||
      (c.debtor?.city || '').toLowerCase().includes(q) ||
      (c.lawyer?.name || '').toLowerCase().includes(q)
    );
  }

  res.json({
    count: cases.length,
    data: cases
  });
});

// GET litigation statistics
router.get('/stats', (req, res) => {
  const cases = db.getLitigationCases();
  const totalPrincipal = cases.reduce((acc, c) => acc + (c.amount?.principal || 0), 0);
  const totalLegalFees = cases.reduce((acc, c) => acc + (c.amount?.legalFees || 0) + (c.amount?.bailiffFees || 0), 0);
  
  let totalRecovered = 0;
  cases.forEach(c => {
    (c.payments || []).forEach((p: any) => {
      totalRecovered += Number(p.amount) || 0;
    });
  });

  const stageCounts: Record<string, number> = {};
  cases.forEach(c => {
    stageCounts[c.stage] = (stageCounts[c.stage] || 0) + 1;
  });

  res.json({
    totalCases: cases.length,
    totalPrincipal,
    totalLegalFees,
    totalRecovered,
    recoveryRate: totalPrincipal > 0 ? ((totalRecovered / totalPrincipal) * 100).toFixed(1) + '%' : '0%',
    stageCounts
  });
});

// GET single litigation case
router.get('/dossiers/:id', (req, res) => {
  const cases = db.getLitigationCases();
  const found = cases.find(c => c.id === req.params.id);

  if (!found) {
    return res.status(404).json({ error: 'Dossier contentieux introuvable' });
  }

  res.json(found);
});

// POST create new litigation case
router.post('/dossiers', validate(createLitigationSchema), (req, res) => {
  const { debtor_name, amount, lawyer_id, bailiff_id, procedure_type, portfolio, court_level, observations, guarantee } = req.body;

  const cases = db.getLitigationCases();
  const year = new Date().getFullYear();
  const num = Math.floor(Math.random() * 9000 + 1000);
  const caseId = req.body.id || `LIT-${year}-${num}`;

  const lawyer = db.getLawyers().find(l => l.id === lawyer_id) || db.getLawyers()[0];
  const bailiff = db.getBailiffs().find(b => b.id === bailiff_id) || db.getBailiffs()[0];

  const newCase = {
    id: caseId,
    debtor: {
      id: `D-${Date.now()}`,
      name: debtor_name,
      siren: req.body.debtor_siren || req.body.debtor_cin || '',
      address: req.body.debtor_address || 'Tunis, Tunisie',
      city: req.body.debtor_city || 'Tunis',
      zip: req.body.debtor_zip || '1000',
      phone: req.body.debtor_phone || '+216 71 000 000',
      email: req.body.debtor_email || 'contact@debiteur.tn'
    },
    type: procedure_type || 'payment_injunction',
    stage: 'pre_litigation',
    filingDate: new Date().toISOString().slice(0, 10),
    lastUpdate: new Date().toISOString().slice(0, 10),
    amount: {
      principal: Number(amount) || 0,
      interest: Math.round(Number(amount) * 0.05),
      legalFees: Number(req.body.legal_fees) || 1500,
      bailiffFees: Number(req.body.bailiff_fees) || 350
    },
    interestRate: 7.25,
    portfolio: portfolio || 'Contentieux Général',
    institution: req.body.institution || 'RecovAI Legal Pool',
    branch: req.body.branch || 'Tunis',
    lawyer,
    bailiff,
    manager: req.body.manager || 'Directeur Juridique',
    riskLevel: Number(amount) > 100000 ? 'Critique' : 'Élevé',
    collateral: {
      type: guarantee || 'Aucune sûreté enregistrée',
      value: Math.round(Number(amount) * 0.8),
      status: 'active'
    },
    observations: observations || '',
    hearings: [],
    documents: [
      {
        id: `doc-${Date.now()}`,
        name: 'Ouverture du dossier juridique.pdf',
        category: 'Procédure',
        status: 'filed',
        date: new Date().toISOString().slice(0, 10)
      }
    ],
    payments: []
  };

  cases.unshift(newCase);
  db.save();

  audit('CREATE_LITIGATION', `Ouverture du dossier contentieux ${newCase.id} (${debtor_name}, ${Number(amount).toLocaleString('fr-TN')} TND)`, req.auth);

  res.status(201).json(newCase);
});

// PATCH update case stage or info
router.patch('/dossiers/:id', (req, res) => {
  const cases = db.getLitigationCases();
  const found = cases.find(c => c.id === req.params.id);

  if (!found) {
    return res.status(404).json({ error: 'Dossier contentieux introuvable' });
  }

  if (req.body.stage) found.stage = req.body.stage;
  if (req.body.lawyer_id) {
    const l = db.getLawyers().find(x => x.id === req.body.lawyer_id);
    if (l) found.lawyer = l;
  }
  if (req.body.bailiff_id) {
    const b = db.getBailiffs().find(x => x.id === req.body.bailiff_id);
    if (b) found.bailiff = b;
  }
  if (req.body.observations) found.observations = req.body.observations;

  found.lastUpdate = new Date().toISOString().slice(0, 10);
  db.save();

  audit('UPDATE_LITIGATION', `Mise à jour du dossier contentieux ${found.id} (étape: ${found.stage})`, req.auth);

  res.json(found);
});

// POST schedule a court hearing (Audience)
router.post('/dossiers/:id/hearings', (req, res) => {
  const cases = db.getLitigationCases();
  const found = cases.find(c => c.id === req.params.id);

  if (!found) {
    return res.status(404).json({ error: 'Dossier contentieux introuvable' });
  }

  const { date, time, court, type, judge, notes } = req.body;

  const newHearing = {
    id: `h-${Date.now()}`,
    date: date || new Date().toISOString().slice(0, 10),
    time: time || '09:30',
    court: court || 'Tribunal de Première Instance de Tunis',
    type: type || 'Plaidoirie',
    judge: judge || 'Président de Chambre',
    status: 'scheduled',
    notes: notes || ''
  };

  found.hearings = found.hearings || [];
  found.hearings.push(newHearing);
  found.lastUpdate = new Date().toISOString().slice(0, 10);
  db.save();

  res.status(201).json(newHearing);
});

// POST add procedural document
router.post('/dossiers/:id/documents', (req, res) => {
  const cases = db.getLitigationCases();
  const found = cases.find(c => c.id === req.params.id);

  if (!found) {
    return res.status(404).json({ error: 'Dossier contentieux introuvable' });
  }

  const { name, category, status } = req.body;

  const newDoc = {
    id: `doc-${Date.now()}`,
    name: name || 'Document judiciaire',
    category: category || 'Procédure',
    status: status || 'filed',
    date: new Date().toISOString().slice(0, 10)
  };

  found.documents = found.documents || [];
  found.documents.unshift(newDoc);
  found.lastUpdate = new Date().toISOString().slice(0, 10);
  db.save();

  res.status(201).json(newDoc);
});

// POST record judicial recovery payment
router.post('/dossiers/:id/payments', (req, res) => {
  const cases = db.getLitigationCases();
  const found = cases.find(c => c.id === req.params.id);

  if (!found) {
    return res.status(404).json({ error: 'Dossier contentieux introuvable' });
  }

  const { amount, reference, type = 'partial' } = req.body;

  const newPayment = {
    id: `p-${Date.now()}`,
    date: new Date().toISOString().slice(0, 10),
    amount: Number(amount) || 0,
    reference: reference || `VIR-${Date.now()}`,
    type
  };

  found.payments = found.payments || [];
  found.payments.push(newPayment);

  // Check if fully paid
  const totalPaid = found.payments.reduce((acc: number, p: any) => acc + (Number(p.amount) || 0), 0);
  if (totalPaid >= (found.amount?.principal || 0)) {
    found.stage = 'closed_recovered';
  }

  found.lastUpdate = new Date().toISOString().slice(0, 10);
  db.save();

  res.status(201).json({
    payment: newPayment,
    case: found
  });
});

// ==========================================
// 2. AUXILIAIRES DE JUSTICE (LAWYERS & BAILIFFS)
// ==========================================

// GET lawyers
router.get('/lawyers', (req, res) => {
  const lawyers = db.getLawyers();
  res.json({
    count: lawyers.length,
    data: lawyers
  });
});

// POST add lawyer
router.post('/lawyers', (req, res) => {
  const { name, firm, phone, email, city } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'Nom de l\'avocat obligatoire' });
  }

  const lawyers = db.getLawyers();
  const newLawyer = {
    id: `l-${Date.now()}`,
    name,
    firm: firm || 'Cabinet individuel',
    phone: phone || '+216 71 000 000',
    email: email || 'avocat@barreau.tn',
    city: city || 'Tunis',
    activeCasesCount: 0,
    created_at: new Date().toISOString()
  };

  lawyers.push(newLawyer);
  db.save();

  res.status(201).json(newLawyer);
});

// GET bailiffs
router.get('/bailiffs', (req, res) => {
  const bailiffs = db.getBailiffs();
  res.json({
    count: bailiffs.length,
    data: bailiffs
  });
});

// POST add bailiff
router.post('/bailiffs', (req, res) => {
  const { name, firm, phone, email, city } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'Nom de l\'huissier obligatoire' });
  }

  const bailiffs = db.getBailiffs();
  const newBailiff = {
    id: `b-${Date.now()}`,
    name,
    firm: firm || 'Étude d\'huissier de justice',
    phone: phone || '+216 71 000 000',
    email: email || 'huissier@ordre.tn',
    city: city || 'Tunis',
    assignedActs: 0
  };

  bailiffs.push(newBailiff);
  db.save();

  res.status(201).json(newBailiff);
});

export default router;
