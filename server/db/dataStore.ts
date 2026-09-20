import fs from 'fs';
import path from 'path';

export interface DataStoreSchema {
  dossiers: any[];
  leasing: any[];
  factoringDebtors: any[];
  factoringInvoices: any[];
  factoringRequests: any[];
  microfinanceClients: any[];
  microfinanceLoans: any[];
  microfinanceInstallments: any[];
  litigationCases: any[];
  lawyers: any[];
  bailiffs: any[];
  templates: any[];
  escalationRules: any[];
  creditDossiers: any[];
  relanceLogs: any[];
  auditLogs: any[];
  reportingDefinitions: any[];
  generatedReports: any[];
  scheduledReports: any[];
}

const DB_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DB_DIR, 'recovai_db.json');

// --- INITIAL SEED DATA ---
const INITIAL_DOSSIERS = [
  {
    id: '1',
    user_id: 'dummy-user-id',
    client_code: 'RCV-2024-001',
    debtor_name: 'SOCIETE ALPHA SARL',
    debtor_email: 'contact@alpha-sarl.tn',
    debtor_phone: '+216 71 123 456',
    amount: 145000,
    recovered_amount: 35000,
    status: 'en_relance',
    management_level: 'directeur',
    assigned_to: 'Ahmed B.',
    due_date: '2024-03-15',
    portfolio: 'Factoring',
    institution: 'Amen Bank',
    branch: 'Tunis Belvédère',
    risk_level: 'Critique',
    delay_days: 95,
    notes: 'Mise en demeure envoyée. Débiteur joignable sur le portable du gérant.',
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2026-05-20T14:30:00Z'
  },
  {
    id: '2',
    user_id: 'dummy-user-id',
    client_code: 'RCV-2024-002',
    debtor_name: 'BEN SALEM AHMED',
    debtor_email: 'ahmed.bensalem@gmail.com',
    debtor_phone: '+216 98 765 432',
    amount: 22000,
    recovered_amount: 5000,
    status: 'contentieux',
    management_level: 'comite',
    assigned_to: 'Sami K.',
    due_date: '2024-03-14',
    portfolio: 'Leasing',
    institution: 'Tunisie Leasing',
    branch: 'Sousse Corniche',
    risk_level: 'Moyen',
    delay_days: 200,
    notes: 'Jugement rendu, exécution sur véhicule en cours.',
    created_at: '2024-01-20T09:00:00Z',
    updated_at: '2026-05-18T11:20:00Z'
  },
  {
    id: '3',
    user_id: 'dummy-user-id',
    client_code: 'RCV-2024-003',
    debtor_name: 'GLOBAL TECH TUNISIE',
    debtor_email: 'finances@globaltech.tn',
    debtor_phone: '+216 71 888 111',
    amount: 890000,
    recovered_amount: 90000,
    status: 'a_relancer',
    management_level: 'recouvreur',
    assigned_to: 'Leila M.',
    due_date: '2024-03-13',
    portfolio: 'Factoring',
    institution: 'Amen Bank',
    branch: 'Lac Tunis',
    risk_level: 'Élevé',
    delay_days: 45,
    notes: 'Gros compte client. En attente de déblocage d’une situation de marché public.',
    created_at: '2024-02-01T08:30:00Z',
    updated_at: '2026-05-25T16:00:00Z'
  },
  {
    id: '4',
    user_id: 'dummy-user-id',
    client_code: 'RCV-2024-004',
    debtor_name: 'KARIM ENTERPRISES',
    debtor_email: 'k.enterprises@gnet.tn',
    debtor_phone: '+216 74 220 330',
    amount: 56000,
    recovered_amount: 56000,
    status: 'paye',
    management_level: 'directeur',
    assigned_to: 'Ahmed B.',
    due_date: '2024-03-12',
    portfolio: 'Microfinance',
    institution: 'Enda Tamweel',
    branch: 'Sfax El Jadida',
    risk_level: 'Faible',
    delay_days: 0,
    notes: 'Paiement intégral soldé par virement irrévocable.',
    created_at: '2024-02-10T11:15:00Z',
    updated_at: '2026-05-10T09:45:00Z'
  },
  {
    id: '5',
    user_id: 'dummy-user-id',
    client_code: 'RCV-2024-005',
    debtor_name: 'MEDITERANEE INVEST',
    debtor_email: 'invest@mediteranee.tn',
    debtor_phone: '+216 71 334 556',
    amount: 320000,
    recovered_amount: 45000,
    status: 'promesse_paiement',
    management_level: 'recouvreur',
    assigned_to: 'Leila M.',
    due_date: '2024-03-11',
    portfolio: 'Leasing',
    institution: 'Tunisie Leasing',
    branch: 'Tunis Centre',
    risk_level: 'Élevé',
    delay_days: 75,
    notes: 'Promesse de virement de 50 000 TND pour fin de mois validée.',
    created_at: '2024-02-15T14:00:00Z',
    updated_at: '2026-05-28T10:30:00Z'
  },
  {
    id: '6',
    user_id: 'dummy-user-id',
    client_code: 'RCV-2024-006',
    debtor_name: 'TUNISAIR HANDLING',
    debtor_email: 'recouvrement@tunisairhandling.tn',
    debtor_phone: '+216 71 700 000',
    amount: 78000,
    recovered_amount: 15000,
    status: 'en_relance',
    management_level: 'directeur',
    assigned_to: 'Sami K.',
    due_date: '2024-03-10',
    portfolio: 'Microfinance',
    institution: 'Enda Tamweel',
    branch: 'Tunis Centre',
    risk_level: 'Moyen',
    delay_days: 110,
    notes: 'Relance téléphonique effectuée, attente visa de la direction comptable.',
    created_at: '2024-03-01T10:00:00Z',
    updated_at: '2026-05-22T13:00:00Z'
  },
  {
    id: '7',
    user_id: 'dummy-user-id',
    client_code: 'RCV-2024-007',
    debtor_name: 'CARTHAGE CEMENT',
    debtor_email: 'finance@carthagecement.com.tn',
    debtor_phone: '+216 71 190 200',
    amount: 1200000,
    recovered_amount: 250000,
    status: 'contentieux',
    management_level: 'comite',
    assigned_to: 'Ahmed B.',
    due_date: '2024-03-09',
    portfolio: 'Factoring',
    institution: 'Amen Bank',
    branch: 'Tunis Belvédère',
    risk_level: 'Critique',
    delay_days: 180,
    notes: 'Dossier transmis au cabinet d’avocat. Procédure d’injonction engagée.',
    created_at: '2024-01-05T09:00:00Z',
    updated_at: '2026-05-29T15:00:00Z'
  }
];

const INITIAL_LAWYERS = [
  { id: 'l1', name: 'Maître Sonia Trabelsi', firm: 'Cabinet Trabelsi & Associés', phone: '+216 71 123 456', email: 's.trabelsi@cabinet-trabelsi.tn', city: 'Tunis', activeCasesCount: 14, created_at: '2024-01-01T00:00:00Z' },
  { id: 'l2', name: 'Maître Karim Belhaj', firm: 'BLG Avocats', phone: '+216 71 654 321', email: 'k.belhaj@blg-avocats.tn', city: 'Tunis', activeCasesCount: 9, created_at: '2024-01-01T00:00:00Z' },
  { id: 'l3', name: 'Maître Leila Mansouri', firm: 'Cabinet Mansouri', phone: '+216 71 222 333', email: 'l.mansouri@mansouri-law.tn', city: 'Sousse', activeCasesCount: 6, created_at: '2024-01-01T00:00:00Z' },
  { id: 'l4', name: 'Maître Moncef Bouaziz', firm: 'Avocats Réunis Sfax', phone: '+216 74 444 555', email: 'm.bouaziz@sfax-law.tn', city: 'Sfax', activeCasesCount: 8, created_at: '2024-02-01T00:00:00Z' }
];

const INITIAL_BAILIFFS = [
  { id: 'b1', name: 'Mehdi Ouali', firm: 'Étude Ouali', phone: '+216 71 555 010', email: 'contact@etude-ouali.tn', city: 'Tunis', assignedActs: 28 },
  { id: 'b2', name: 'Fatma Zribi', firm: 'Étude Zribi', phone: '+216 71 777 020', email: 'f.zribi@etude-zribi.tn', city: 'Sousse', assignedActs: 19 },
  { id: 'b3', name: 'Tarek Ben Hamida', firm: 'Huissiers Associés Sud', phone: '+216 74 112 233', email: 't.benhamida@huissier.tn', city: 'Sfax', assignedActs: 15 }
];

const INITIAL_LITIGATION_CASES = [
  {
    id: 'LIT-2024-0001',
    debtor: { id: 'D-145', name: 'SOCIETE ALPHA SARL', siren: '0123456789', address: '12 Rue de la République', city: 'Tunis', zip: '1000', contact: 'M. Slim Bargaoui', email: 'contact@alpha-sarl.tn', phone: '+216 71 123 456' },
    type: 'payment_injunction',
    stage: 'in_process',
    filingDate: '2024-01-15',
    lastUpdate: '2024-04-10',
    amount: { principal: 145000, interest: 8200, legalFees: 3500, bailiffFees: 850 },
    interestRate: 5.6,
    portfolio: 'Factoring',
    institution: 'Amen Bank',
    branch: 'Tunis Belvédère',
    lawyer: INITIAL_LAWYERS[0],
    bailiff: INITIAL_BAILIFFS[0],
    manager: 'Ahmed B.',
    riskLevel: 'Critique',
    collateral: { type: 'Hypothèque commerciale', value: 180000, status: 'active' },
    hearings: [
      { id: 'h1', date: '2026-06-15', time: '10:00', court: 'Tribunal de Première Instance de Tunis', type: 'Plaidoirie', judge: 'Mme Ben Cheikh', status: 'scheduled' }
    ],
    documents: [
      { id: 'd1', name: 'Mise en demeure.pdf', category: 'Lettre', status: 'sent', date: '2024-01-10' },
      { id: 'd2', name: 'Requête injonction.pdf', category: 'Procédure', status: 'filed', date: '2024-01-15' }
    ],
    payments: []
  },
  {
    id: 'LIT-2024-0002',
    debtor: { id: 'D-201', name: 'BEN SALEM AHMED', address: '4 Avenue Habib Bourguiba', city: 'Sousse', zip: '4000', email: 'ahmed.bensalem@gmail.com', phone: '+216 98 765 432' },
    type: 'payment_injunction',
    stage: 'enforcement',
    filingDate: '2023-11-20',
    lastUpdate: '2024-04-05',
    amount: { principal: 22000, interest: 1450, legalFees: 1200, bailiffFees: 620 },
    interestRate: 5.6,
    portfolio: 'Leasing',
    institution: 'Tunisie Leasing',
    branch: 'Sousse Corniche',
    lawyer: INITIAL_LAWYERS[1],
    bailiff: INITIAL_BAILIFFS[1],
    manager: 'Sami K.',
    riskLevel: 'Moyen',
    collateral: { type: 'Garantie matérielle (Véhicule)', value: 25000, status: 'seizure_started' },
    hearings: [],
    documents: [
      { id: 'd5', name: 'Jugement définitif.pdf', category: 'Jugement', status: 'filed', date: '2024-02-14' },
      { id: 'd6', name: 'Procès-verbal de saisie.pdf', category: 'Exécution', status: 'filed', date: '2024-03-01' }
    ],
    payments: [
      { id: 'p1', date: '2024-04-05', amount: 5000, reference: 'VIR-04052024', type: 'partial' }
    ]
  },
  {
    id: 'LIT-2024-0003',
    debtor: { id: 'D-318', name: 'GLOBAL TECH TUNISIE', siren: '0987654321', address: '15 Rue du Lac', city: 'Tunis', zip: '1053', contact: 'Mme Nadia Trabelsi', email: 'finances@globaltech.tn', phone: '+216 71 888 111' },
    type: 'summary_proceedings',
    stage: 'pre_litigation',
    filingDate: '2024-04-01',
    lastUpdate: '2024-04-15',
    amount: { principal: 320000, interest: 2400, legalFees: 0, bailiffFees: 0 },
    interestRate: 5.6,
    portfolio: 'Factoring',
    institution: 'Amen Bank',
    branch: 'Lac Tunis',
    lawyer: INITIAL_LAWYERS[0],
    bailiff: INITIAL_BAILIFFS[0],
    manager: 'Leila M.',
    riskLevel: 'Élevé',
    hearings: [],
    documents: [
      { id: 'd7', name: 'Mise en demeure.pdf', category: 'Lettre', status: 'sent', date: '2024-04-02' }
    ],
    payments: []
  },
  {
    id: 'LIT-2024-0004',
    debtor: { id: 'D-422', name: 'KARIM ENTERPRISES', siren: '5566778899', address: '8 Rue Ibn Khaldoun', city: 'Sfax', zip: '3000', phone: '+216 74 220 330' },
    type: 'payment_injunction',
    stage: 'judgment_obtained',
    filingDate: '2023-09-10',
    lastUpdate: '2024-03-28',
    amount: { principal: 56000, interest: 3700, legalFees: 1800, bailiffFees: 0 },
    interestRate: 5.6,
    portfolio: 'Microfinance',
    institution: 'Enda Tamweel',
    branch: 'Sfax El Jadida',
    lawyer: INITIAL_LAWYERS[1],
    bailiff: INITIAL_BAILIFFS[2],
    manager: 'Ahmed B.',
    riskLevel: 'Moyen',
    hearings: [],
    documents: [
      { id: 'd8', name: 'Jugement TPI Sfax.pdf', category: 'Jugement', status: 'filed', date: '2024-03-20' }
    ],
    payments: []
  },
  {
    id: 'LIT-2024-0005',
    debtor: { id: 'D-501', name: 'MEDITERANEE INVEST', siren: '1122334455', address: '3 Avenue de Carthage', city: 'Tunis', zip: '1001', phone: '+216 71 334 556' },
    type: 'summary_proceedings',
    stage: 'injunction_filed',
    filingDate: '2024-02-28',
    lastUpdate: '2024-04-12',
    amount: { principal: 89000, interest: 1100, legalFees: 2200, bailiffFees: 0 },
    interestRate: 5.6,
    portfolio: 'Leasing',
    institution: 'Tunisie Leasing',
    branch: 'Tunis Centre',
    lawyer: INITIAL_LAWYERS[0],
    bailiff: INITIAL_BAILIFFS[0],
    manager: 'Nadia T.',
    riskLevel: 'Élevé',
    hearings: [],
    documents: [
      { id: 'd9', name: 'Requête référé.pdf', category: 'Procédure', status: 'filed', date: '2024-02-28' }
    ],
    payments: []
  },
  {
    id: 'LIT-2023-0078',
    debtor: { id: 'D-098', name: 'STAR LOGISTIQUE', siren: '6677889900', address: '20 Rue de Marseille', city: 'Tunis', zip: '1002', phone: '+216 71 445 667' },
    type: 'payment_injunction',
    stage: 'closed_recovered',
    filingDate: '2023-05-12',
    lastUpdate: '2024-01-30',
    amount: { principal: 41000, interest: 2200, legalFees: 1500, bailiffFees: 800 },
    interestRate: 5.6,
    portfolio: 'Microfinance',
    institution: 'Enda Tamweel',
    branch: 'Tunis Centre',
    lawyer: INITIAL_LAWYERS[1],
    bailiff: INITIAL_BAILIFFS[0],
    manager: 'Sami K.',
    riskLevel: 'Faible',
    hearings: [],
    documents: [],
    payments: [
      { id: 'p2', date: '2024-01-30', amount: 45500, reference: 'VIR-30012024', type: 'principal' }
    ]
  }
];

const INITIAL_LEASING = [
  {
    id: 'LSG-2024-001',
    contract_ref: 'LSG-2024-001',
    lessee: { id: 'LES-01', name: 'SOCIETE MEDITERANEE INVEST', siren: '1122334455', contact: 'M. Hedi Karray', phone: '+216 71 334 556', email: 'invest@mediteranee.tn', address: '3 Avenue de Carthage', city: 'Tunis', zip: '1001' },
    asset: { type: 'industrial', description: 'Centre d\'usinage numérique 5 axes', brand: 'DMG Mori', model: 'DMU 50', acquisitionValue: 320000, residualValue: 32000 },
    financials: { monthlyRent: 6850, interestRate: 8.5, deposit: 32000, totalFinanced: 320000, remainingCapital: 215000, overdueAmount: 20550, overdueDays: 75 },
    status: 'late',
    portfolio: 'Leasing',
    institution: 'Tunisie Leasing',
    branch: 'Tunis Centre',
    startDate: '2023-06-01',
    maturityDate: '2027-06-01',
    durationMonths: 48,
    insuranceActive: true,
    riskLevel: 'Élevé',
    created_at: '2023-06-01T00:00:00Z'
  },
  {
    id: 'LSG-2024-002',
    contract_ref: 'LSG-2024-002',
    lessee: { id: 'LES-02', name: 'BEN SALEM AHMED', contact: 'M. Ahmed Ben Salem', phone: '+216 98 765 432', email: 'ahmed.bensalem@gmail.com', address: '4 Avenue Habib Bourguiba', city: 'Sousse', zip: '4000' },
    asset: { type: 'vehicle', description: 'Tracteur Routier Mercedes-Benz Actros', brand: 'Mercedes-Benz', model: 'Actros 1845', acquisitionValue: 185000, residualValue: 18500 },
    financials: { monthlyRent: 4200, interestRate: 8.2, deposit: 18500, totalFinanced: 185000, remainingCapital: 98000, overdueAmount: 22000, overdueDays: 120 },
    status: 'litigation',
    portfolio: 'Leasing',
    institution: 'Tunisie Leasing',
    branch: 'Sousse Corniche',
    startDate: '2022-10-15',
    maturityDate: '2026-10-15',
    durationMonths: 48,
    insuranceActive: true,
    riskLevel: 'Critique',
    created_at: '2022-10-15T00:00:00Z'
  },
  {
    id: 'LSG-2024-003',
    contract_ref: 'LSG-2024-003',
    lessee: { id: 'LES-03', name: 'CLINIQUE EL AMEL', siren: '9988776655', contact: 'Dr. Faouzi Driss', phone: '+216 71 890 000', email: 'direction@clinique-elamel.tn', address: 'Rue de la Clinique, Ennasr', city: 'Ariana', zip: '2037' },
    asset: { type: 'equipment', description: 'Système d\'imagerie IRM 1.5 Tesla', brand: 'Siemens Healthineers', model: 'MAGNETOM Altea', acquisitionValue: 850000, residualValue: 85000 },
    financials: { monthlyRent: 17800, interestRate: 7.9, deposit: 85000, totalFinanced: 850000, remainingCapital: 620000, overdueAmount: 0, overdueDays: 0 },
    status: 'active',
    portfolio: 'Leasing',
    institution: 'Tunisie Leasing',
    branch: 'Tunis Centre',
    startDate: '2024-01-10',
    maturityDate: '2029-01-10',
    durationMonths: 60,
    insuranceActive: true,
    riskLevel: 'Faible',
    created_at: '2024-01-10T00:00:00Z'
  }
];

const INITIAL_FACTORING_DEBTORS = [
  {
    id: 'd-1',
    name: 'SOCIETE TUNISIENNE DE SIDERURGIE (EL FOULADH)',
    registrationNumber: 'B1812811996',
    taxId: '0001235F/A/M/000',
    address: 'Zone Industrielle, Menzel Bourguiba, Tunisie',
    riskScore: 82,
    riskGrade: 'B',
    approvedLimit: 500000,
    usedLimit: 145000,
    paymentDelayAverage: 45,
    status: 'approved'
  },
  {
    id: 'd-2',
    name: 'TUNISIE TELECOM S.A.',
    registrationNumber: 'B1123451995',
    taxId: '0456123D/A/C/000',
    address: 'Rue Asdrubal, Belvédère, Tunis, Tunisie',
    riskScore: 95,
    riskGrade: 'A',
    approvedLimit: 1200000,
    usedLimit: 320000,
    paymentDelayAverage: 28,
    status: 'approved'
  },
  {
    id: 'd-3',
    name: 'CARTHAGE CERAMIQUE SARL',
    registrationNumber: 'B245672002',
    taxId: '1023456K/B/M/000',
    address: 'Zone Industrielle Charguia II, Tunis, Tunisie',
    riskScore: 68,
    riskGrade: 'C',
    approvedLimit: 300000,
    usedLimit: 85000,
    paymentDelayAverage: 58,
    status: 'approved'
  }
];

const INITIAL_FACTORING_INVOICES = [
  {
    id: 'inv-1',
    invoiceNumber: 'FAC-2024-0891',
    debtorId: 'd-1',
    debtorName: 'SOCIETE TUNISIENNE DE SIDERURGIE (EL FOULADH)',
    amount: 75000,
    financedAmount: 67500,
    issueDate: '2024-02-01',
    dueDate: '2024-04-30',
    status: 'overdue',
    overdueDays: 45,
    disputeStatus: 'none'
  },
  {
    id: 'inv-2',
    invoiceNumber: 'FAC-2024-0942',
    debtorId: 'd-2',
    debtorName: 'TUNISIE TELECOM S.A.',
    amount: 180000,
    financedAmount: 162000,
    issueDate: '2024-03-10',
    dueDate: '2024-06-10',
    status: 'funded',
    overdueDays: 0,
    disputeStatus: 'none'
  },
  {
    id: 'inv-3',
    invoiceNumber: 'FAC-2024-1015',
    debtorId: 'd-3',
    debtorName: 'CARTHAGE CERAMIQUE SARL',
    amount: 45000,
    financedAmount: 38250,
    issueDate: '2024-01-15',
    dueDate: '2024-03-31',
    status: 'disputed',
    overdueDays: 60,
    disputeStatus: 'quality_defect'
  }
];

const INITIAL_TEMPLATES = [
  {
    id: 'tpl-1',
    name: 'Rappel préventif J-3 (Échéance imminente)',
    channel: 'sms',
    category: 'preventif',
    subject: 'Rappel de votre échéance',
    content: 'Bonjour {{debiteur}}, votre échéance de {{montant}} TND arrive à échéance le {{echeance}}. Pour éviter des frais de retard, merci d\'effectuer le règlement. Réf: {{reference}}.',
    variables: ['debiteur', 'montant', 'echeance', 'reference'],
    active: true
  },
  {
    id: 'tpl-2',
    name: 'Relance 1er Niveau J+7 (Amiable courtois)',
    channel: 'sms',
    category: 'amiable',
    subject: 'Échéance en retard',
    content: 'Cher client {{debiteur}}, votre échéance de {{montant}} TND du {{echeance}} demeure impayée. Merci de régulariser par virement sur le RIB {{rib}} ou en agence. Contact: 71 123 456.',
    variables: ['debiteur', 'montant', 'echeance', 'rib'],
    active: true
  },
  {
    id: 'tpl-3',
    name: 'Sommation ferme J+30 (Pré-contentieux)',
    channel: 'email',
    category: 'ferme',
    subject: 'SOMMATION DE PAYER SOUS 48H - Dossier {{reference}}',
    content: 'Madame, Monsieur {{debiteur}},\n\nMalgré nos précédentes relances, nous constatons le non-règlement de votre créance de {{montant}} TND exigible depuis le {{echeance}}.\n\nNous vous mettons formellement en demeure de régler ladite somme sous 48 heures ouvrables, faute de quoi votre dossier sera immédiatement transmis à notre direction du Contentieux pour assignation judiciaire et exécution forcée.\n\nDirection du Recouvrement RecovAI',
    variables: ['debiteur', 'montant', 'echeance', 'reference'],
    active: true
  },
  {
    id: 'tpl-4',
    name: 'Mise en demeure par huissier J+45',
    channel: 'lettre',
    category: 'contentieux',
    subject: 'MISE EN DEMEURE AVANT ACTION EN JUSTICE',
    content: 'PAR EXPLOIT D\'HUISSIER DE JUSTICE\n\nÀ la requête de l\'institution bancaire / de crédit,\nNous sommons {{debiteur}}, domicilié(e) à {{adresse}}, de payer la somme principale de {{montant}} TND, outre les intérêts de retard conventionnels.\n\nÀ défaut, une requête en injonction de payer sera déposée auprès de Monsieur le Président du Tribunal de Première Instance compétent.',
    variables: ['debiteur', 'adresse', 'montant'],
    active: true
  }
];

const INITIAL_ESCALATION_RULES = [
  {
    id: 'esc-1',
    name: 'Escalade Recouvreur vers Superviseur à J+30',
    triggerDays: 30,
    condition: 'retard > 30 jours ET solde > 10 000 TND',
    action: 'Réaffectation au chef de groupe + SMS ferme',
    targetLevel: 'superviseur',
    active: true
  },
  {
    id: 'esc-2',
    name: 'Basculement Pré-contentieux à J+60',
    triggerDays: 60,
    condition: 'retard > 60 jours ET absence d\'engagement respecté',
    action: 'Envoi d\'une mise en demeure recommandée + Alerte Direction Risques',
    targetLevel: 'directeur',
    active: true
  },
  {
    id: 'esc-3',
    name: 'Transmission Contentieux Judiciaire à J+90',
    triggerDays: 90,
    condition: 'retard > 90 jours OU incident de paiement non régularisé',
    action: 'Création automatique du dossier contentieux + Mandatement d\'avocat',
    targetLevel: 'contentieux',
    active: true
  }
];

class DataStore {
  private data: DataStoreSchema;
  private saveTimeout: NodeJS.Timeout | null = null;

  constructor() {
    this.data = this.loadData();
  }

  private loadData(): DataStoreSchema {
    try {
      if (!fs.existsSync(DB_DIR)) {
        fs.mkdirSync(DB_DIR, { recursive: true });
      }

      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        return {
          dossiers: parsed.dossiers || INITIAL_DOSSIERS,
          leasing: parsed.leasing || INITIAL_LEASING,
          factoringDebtors: parsed.factoringDebtors || INITIAL_FACTORING_DEBTORS,
          factoringInvoices: parsed.factoringInvoices || INITIAL_FACTORING_INVOICES,
          factoringRequests: parsed.factoringRequests || [],
          microfinanceClients: parsed.microfinanceClients || [],
          microfinanceLoans: parsed.microfinanceLoans || [],
          microfinanceInstallments: parsed.microfinanceInstallments || [],
          litigationCases: parsed.litigationCases || INITIAL_LITIGATION_CASES,
          lawyers: parsed.lawyers || INITIAL_LAWYERS,
          bailiffs: parsed.bailiffs || INITIAL_BAILIFFS,
          templates: parsed.templates || INITIAL_TEMPLATES,
          escalationRules: parsed.escalationRules || INITIAL_ESCALATION_RULES,
          creditDossiers: parsed.creditDossiers || [],
          relanceLogs: parsed.relanceLogs || [],
          auditLogs: parsed.auditLogs || [],
          reportingDefinitions: parsed.reportingDefinitions || [],
          generatedReports: parsed.generatedReports || [],
          scheduledReports: parsed.scheduledReports || []
        };
      }
    } catch (err) {
      console.warn('[DataStore] Error loading DB file, fallback to initial seed:', err);
    }

    const initial: DataStoreSchema = {
      dossiers: INITIAL_DOSSIERS,
      leasing: INITIAL_LEASING,
      factoringDebtors: INITIAL_FACTORING_DEBTORS,
      factoringInvoices: INITIAL_FACTORING_INVOICES,
      factoringRequests: [],
      microfinanceClients: [],
      microfinanceLoans: [],
      microfinanceInstallments: [],
      litigationCases: INITIAL_LITIGATION_CASES,
      lawyers: INITIAL_LAWYERS,
      bailiffs: INITIAL_BAILIFFS,
      templates: INITIAL_TEMPLATES,
      escalationRules: INITIAL_ESCALATION_RULES,
      creditDossiers: [],
      relanceLogs: [],
      auditLogs: [],
      reportingDefinitions: [],
      generatedReports: [],
      scheduledReports: []
    };

    this.saveDataSync(initial);
    return initial;
  }

  private saveDataSync(payload: DataStoreSchema) {
    try {
      if (!fs.existsSync(DB_DIR)) {
        fs.mkdirSync(DB_DIR, { recursive: true });
      }
      fs.writeFileSync(DB_FILE, JSON.stringify(payload, null, 2), 'utf-8');
    } catch (err) {
      console.error('[DataStore] Failed to write database to disk:', err);
    }
  }

  public save() {
    if (this.saveTimeout) {
      clearTimeout(this.saveTimeout);
    }
    this.saveTimeout = setTimeout(() => {
      this.saveDataSync(this.data);
    }, 150);
  }

  // --- GETTERS ---
  public getDossiers() { return this.data.dossiers; }
  public getLeasing() { return this.data.leasing; }
  public getFactoringDebtors() { return this.data.factoringDebtors; }
  public getFactoringInvoices() { return this.data.factoringInvoices; }
  public getFactoringRequests() { return this.data.factoringRequests; }
  public getLitigationCases() { return this.data.litigationCases; }
  public getLawyers() { return this.data.lawyers; }
  public getBailiffs() { return this.data.bailiffs; }
  public getTemplates() { return this.data.templates; }
  public getEscalationRules() { return this.data.escalationRules; }
  public getCreditDossiers() { return this.data.creditDossiers; }
  public getRelanceLogs() { return this.data.relanceLogs; }
  public getAuditLogs() { return this.data.auditLogs; }

  // Generic access
  public getCollection(name: keyof DataStoreSchema): any[] {
    return this.data[name] || [];
  }

  public setCollection(name: keyof DataStoreSchema, items: any[]) {
    this.data[name] = items;
    this.save();
  }

  public stats() {
    return {
      dossiersCount: this.data.dossiers.length,
      leasingCount: this.data.leasing.length,
      factoringInvoicesCount: this.data.factoringInvoices.length,
      litigationCasesCount: this.data.litigationCases.length,
      lawyersCount: this.data.lawyers.length,
      bailiffsCount: this.data.bailiffs.length,
      templatesCount: this.data.templates.length,
      escalationRulesCount: this.data.escalationRules.length,
      creditDossiersCount: this.data.creditDossiers.length,
      relanceLogsCount: this.data.relanceLogs.length,
      dbFileSize: fs.existsSync(DB_FILE) ? fs.statSync(DB_FILE).size : 0,
      lastUpdated: new Date().toISOString()
    };
  }
}

export const db = new DataStore();
