// litigation-store.ts
// Client-side robust persistent store using localStorage to manage Litigation module lifecycle

export interface PreLitigationCase {
  id: string;
  case_number: string;
  client_name: string;
  portfolio_type: 'Microfinance' | 'Factoring' | 'Leasing';
  institution: string;
  branch: string;
  overdue_amount: number;
  outstanding_amount: number;
  days_overdue: number;
  reason_for_escalation: string;
  formal_notice_status: 'draft' | 'pending' | 'sent' | 'received';
  formal_notice_sent_at?: string;
  final_deadline_date?: string;
  client_response?: string;
  guarantor_contacted: boolean;
  documents_checked: boolean;
  recommended_action: string;
  approved_by?: string;
  status: 'opened' | 'formal_notice_pending' | 'formal_notice_sent' | 'waiting_client_response' | 'payment_plan_negotiated' | 'documents_missing' | 'ready_for_litigation' | 'approved_for_litigation' | 'rejected' | 'closed';
  opened_at: string;
  approved_at?: string;
  closed_at?: string;
}

export interface LegalCase {
  id: string; // e.g., LIT-2024-0001
  client_name: string;
  portfolio_type: 'Microfinance' | 'Factoring' | 'Leasing';
  institution: string;
  branch: string;
  legal_case_number: string;
  legal_officer_id: string; // manager
  external_lawyer_id: string; // lawyer name
  principal_due: number;
  interest_due: number;
  penalties_due: number;
  legal_fees_due: number;
  recoverable_fees: number;
  total_claim_amount: number;
  recovered_amount: number;
  remaining_amount: number;
  recovery_rate: number;
  risk_level: 'Faible' | 'Moyen' | 'Élevé' | 'Critique';
  priority_level: 'Normale' | 'Haute' | 'Urgente';
  status: 'draft' | 'opened' | 'under_review' | 'formal_notice' | 'amicable_legal_settlement' | 'filed_to_court' | 'court_hearing' | 'judgment_pending' | 'judgment_obtained' | 'enforcement' | 'collateral_seizure' | 'payment_plan' | 'partially_recovered' | 'fully_recovered' | 'write_off_recommended' | 'written_off' | 'closed' | 'cancelled';
  opened_at: string;
  last_action_at?: string;
  next_action_at?: string;
  closed_at?: string;
  closure_reason?: string;
  has_collateral: boolean;
  has_guarantor: boolean;
  missing_docs_count: number;
}

export interface LegalAction {
  id: string;
  legal_case_id: string;
  client_name: string;
  action_type: 'formal_notice' | 'lawyer_assignment' | 'legal_review' | 'court_filing' | 'hearing' | 'judgment' | 'enforcement_order' | 'bailiff_action' | 'collateral_seizure' | 'collateral_sale' | 'guarantor_claim' | 'settlement_agreement' | 'payment_plan_signed' | 'write_off_request' | 'case_closure';
  action_date: string;
  due_date: string;
  performed_by: string;
  external_party: string;
  result?: string;
  status: 'planned' | 'in_progress' | 'completed' | 'overdue' | 'cancelled' | 'failed';
  next_action_type?: string;
  next_action_date?: string;
  notes?: string;
  document_id?: string;
}

export interface LegalDocument {
  id: string;
  legal_case_id: string;
  client_name: string;
  document_type: 'loan_contract' | 'leasing_contract' | 'factoring_assignment' | 'invoice' | 'repayment_schedule' | 'payment_history' | 'reminder_history' | 'formal_notice' | 'client_id_document' | 'collateral_document' | 'guarantor_agreement' | 'court_filing' | 'court_summons' | 'judgment' | 'enforcement_order' | 'bailiff_report' | 'settlement_agreement' | 'write_off_approval';
  document_name: string;
  required: boolean;
  verified: boolean;
  verification_status: 'missing' | 'uploaded' | 'under_review' | 'verified' | 'rejected' | 'expired';
  uploaded_by?: string;
  uploaded_at?: string;
  verified_by?: string;
  verified_at?: string;
  expiry_date?: string;
  notes?: string;
}

export interface Collateral {
  id: string;
  legal_case_id: string;
  client_name: string;
  collateral_type: 'equipment' | 'vehicle' | 'inventory' | 'land' | 'building' | 'savings_deposit' | 'salary_assignment' | 'invoice_receivable' | 'other';
  description: string;
  estimated_value: number;
  current_value: number;
  status: 'active' | 'under_review' | 'seizure_recommended' | 'seizure_started' | 'seized' | 'sold' | 'released' | 'invalid';
  seizure_started_at?: string;
  seized_at?: string;
  sold_at?: string;
  sale_amount?: number;
  released_at?: string;
  notes?: string;
}

export interface Guarantor {
  id: string;
  legal_case_id: string;
  client_name: string;
  full_name: string;
  phone: string;
  address: string;
  relationship: string;
  guarantee_amount: number;
  contacted_at?: string;
  status: 'active' | 'contacted' | 'payment_requested' | 'paid' | 'refused' | 'legal_action_started' | 'released';
  notes?: string;
}

export interface LegalFee {
  id: string;
  legal_case_id: string;
  client_name: string;
  fee_type: 'lawyer_fee' | 'bailiff_fee' | 'court_fee' | 'travel_fee' | 'administrative_fee' | 'collateral_seizure_fee' | 'collateral_sale_fee' | 'other';
  amount: number;
  currency: string;
  incurred_at: string;
  paid_at?: string;
  paid_by?: string;
  recoverable_from_client: boolean;
  recovered_amount: number;
  status: 'pending' | 'approved' | 'paid' | 'partially_recovered' | 'recovered' | 'rejected' | 'written_off';
  notes?: string;
  document_id?: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  details: string;
}

// ─── STORES LOAD & GENERATION ───

const STORAGE_KEYS = {
  PRE_LIT: 'recov_pre_lit_cases',
  LEGAL_CASES: 'recov_legal_cases',
  LEGAL_ACTIONS: 'recov_legal_actions',
  LEGAL_DOCS: 'recov_legal_doc_list',
  COLLATERALS: 'recov_collaterals_list',
  GUARANTORS: 'recov_guarantors_list',
  LEGAL_FEES: 'recov_legal_fees_list',
  AUDIT_LOGS: 'recov_lit_audit_logs'
};

const DEFAULT_PRE_LIT: PreLitigationCase[] = [
  {
    id: "PL-2026-0001",
    case_number: "PL-0155",
    client_name: "STE EL NOUR SARL",
    portfolio_type: "Microfinance",
    institution: "Enda Tamweel",
    branch: "Tunis Centre",
    overdue_amount: 14200,
    outstanding_amount: 18500,
    days_overdue: 110,
    reason_for_escalation: "Promesse de règlement rompue à trois reprises. Plus de contact téléphonique.",
    formal_notice_status: "sent",
    formal_notice_sent_at: "2026-05-10",
    final_deadline_date: "2026-06-05",
    client_response: "Client sollicite un énième report sans engagement financier ferme.",
    guarantor_contacted: true,
    documents_checked: false,
    recommended_action: "Ouverture judiciaire",
    status: "waiting_client_response",
    opened_at: "2026-05-02"
  },
  {
    id: "PL-2026-0002",
    case_number: "PL-0160",
    client_name: "BEN AMER SALMA",
    portfolio_type: "Leasing",
    institution: "Tunisie Leasing",
    branch: "Sousse Corniche",
    overdue_amount: 28000,
    outstanding_amount: 72000,
    days_overdue: 95,
    reason_for_escalation: "Échéances de crédit impayées depuis 3 mois. Matériel industriel localisé mais non restitué.",
    formal_notice_status: "pending",
    guarantor_contacted: false,
    documents_checked: true,
    recommended_action: "Mise en demeure par huissier",
    status: "formal_notice_pending",
    opened_at: "2026-05-15"
  },
  {
    id: "PL-2026-0003",
    case_number: "PL-0145",
    client_name: "SOCIETE MAGHREB SERVICES",
    portfolio_type: "Factoring",
    institution: "Amen Bank",
    branch: "Tunis Belvédère",
    overdue_amount: 85000,
    outstanding_amount: 85000,
    days_overdue: 130,
    reason_for_escalation: "Créance factoring approuvée mais débiteur conteste la conformité des livraisons de marchandises.",
    formal_notice_status: "received",
    formal_notice_sent_at: "2026-04-20",
    final_deadline_date: "2026-05-20",
    client_response: "Échec absolu des négociations à l'amiable.",
    guarantor_contacted: true,
    documents_checked: true,
    recommended_action: "Approbaton transfert juridique immédiat",
    status: "ready_for_litigation",
    opened_at: "2026-04-15"
  }
];

const DEFAULT_LEGAL_CASES: LegalCase[] = [
  {
    id: 'LIT-2024-0001',
    client_name: "SOCIETE ALPHA SARL",
    portfolio_type: "Factoring",
    institution: "Amen Bank",
    branch: "Tunis Belvédère",
    legal_case_number: "RG-2024-8714",
    legal_officer_id: "Amel Ben Ali",
    external_lawyer_id: "Maître Sonia Trabelsi",
    principal_due: 145000,
    interest_due: 8200,
    penalties_due: 3400,
    legal_fees_due: 3500,
    recoverable_fees: 4350,
    total_claim_amount: 157550,
    recovered_amount: 0,
    remaining_amount: 157550,
    recovery_rate: 0,
    risk_level: "Critique",
    priority_level: "Urgente",
    status: "in_process",
    opened_at: "2024-01-15",
    last_action_at: "2024-04-10",
    next_action_at: "2026-06-15",
    has_collateral: true,
    has_guarantor: true,
    missing_docs_count: 2
  },
  {
    id: 'LIT-2024-0002',
    client_name: "BEN SALEM AHMED",
    portfolio_type: "Leasing",
    institution: "Tunisie Leasing",
    branch: "Sousse Corniche",
    legal_case_number: "RG-2023-1120",
    legal_officer_id: "Sami K.",
    external_lawyer_id: "Maître Karim Belhaj",
    principal_due: 22000,
    interest_due: 1450,
    penalties_due: 580,
    legal_fees_due: 1820,
    recoverable_fees: 1820,
    total_claim_amount: 25850,
    recovered_amount: 5000,
    remaining_amount: 20850,
    recovery_rate: 19.34,
    risk_level: "Moyen",
    priority_level: "Normale",
    status: "enforcement",
    opened_at: "2023-11-20",
    last_action_at: "2024-04-05",
    next_action_at: "2026-06-20",
    has_collateral: true,
    has_guarantor: false,
    missing_docs_count: 0
  },
  {
    id: 'LIT-2024-0003',
    client_name: "GLOBAL TECH TUNISIE",
    portfolio_type: "Factoring",
    institution: "Amen Bank",
    branch: "Lac Tunis",
    legal_case_number: "RG-2024-9122",
    legal_officer_id: "Leila M.",
    external_lawyer_id: "Maître Sonia Trabelsi",
    principal_due: 320000,
    interest_due: 2400,
    penalties_due: 0,
    legal_fees_due: 0,
    recoverable_fees: 0,
    total_claim_amount: 322400,
    recovered_amount: 0,
    remaining_amount: 322400,
    recovery_rate: 0,
    risk_level: "Élevé",
    priority_level: "Haute",
    status: "formal_notice",
    opened_at: "2024-04-01",
    last_action_at: "2024-04-15",
    has_collateral: false,
    has_guarantor: true,
    missing_docs_count: 2
  }
];

const DEFAULT_ACTIONS: LegalAction[] = [
  {
    id: "ACT-0001",
    legal_case_id: "LIT-2024-0001",
    client_name: "SOCIETE ALPHA SARL",
    action_type: "formal_notice",
    action_date: "2024-01-20",
    due_date: "2024-02-10",
    performed_by: "Ahmed B.",
    external_party: "Mehdi Ouali (Huissier)",
    result: "Signifiée en mains propres avec succès.",
    status: "completed",
    notes: "Mise en demeure transmise par exploit d'huissier."
  },
  {
    id: "ACT-0002",
    legal_case_id: "LIT-2024-0001",
    client_name: "SOCIETE ALPHA SARL",
    action_type: "court_filing",
    action_date: "2024-02-05",
    due_date: "2024-02-15",
    performed_by: "Maître Sonia Trabelsi",
    external_party: "Greffe TPI Tunis",
    result: "Enregistrement de la requête n°8714",
    status: "completed"
  },
  {
    id: "ACT-0003",
    legal_case_id: "LIT-2024-0001",
    client_name: "SOCIETE ALPHA SARL",
    action_type: "hearing",
    action_date: "2026-06-15",
    due_date: "2026-06-15",
    performed_by: "Maître Sonia Trabelsi",
    external_party: "Tribunal de Tunis - Chambre 3",
    status: "planned",
    notes: "Audience d'examen de la demande reconventionnelle."
  },
  {
    id: "ACT-0004",
    legal_case_id: "LIT-2024-0002",
    client_name: "BEN SALEM AHMED",
    action_type: "judgment",
    action_date: "2024-01-10",
    due_date: "2024-01-10",
    performed_by: "Maître Karim Belhaj",
    external_party: "Tribunal de Sousse",
    result: "Jugement d'injonction favorable rendu par défaut.",
    status: "completed"
  },
  {
    id: "ACT-0005",
    legal_case_id: "LIT-2024-0002",
    client_name: "BEN SALEM AHMED",
    action_type: "collateral_seizure",
    action_date: "2024-03-15",
    due_date: "2024-04-10",
    performed_by: "Maître Karim Belhaj",
    external_party: "Fatma Zribi (Huissier Sousse)",
    result: "Saisie conservatoire du véhicule effectuée.",
    status: "completed",
    notes: "Véhicule mis en fourrière judiciaire à Sousse."
  }
];

const DEFAULT_DOCUMENTS: LegalDocument[] = [
  {
    id: "DOC-0001",
    legal_case_id: "LIT-2024-0001",
    client_name: "SOCIETE ALPHA SARL",
    document_type: "loan_contract",
    document_name: "Contrat d'ouverture de ligne de factoring n°844.pdf",
    required: true,
    verified: true,
    verification_status: "verified",
    uploaded_by: "Ahmed B.",
    uploaded_at: "2024-01-16",
    verified_by: "Amel Ben Ali",
    verified_at: "2024-01-18",
    notes: "Original conservé au coffre-fort central."
  },
  {
    id: "DOC-0002",
    legal_case_id: "LIT-2024-0001",
    client_name: "SOCIETE ALPHA SARL",
    document_type: "formal_notice",
    document_name: "Exploit d'huissier - Mise en demeure Alpha SARL.pdf",
    required: true,
    verified: true,
    verification_status: "verified",
    uploaded_by: "Amel Ben Ali",
    uploaded_at: "2024-01-25",
    verified_by: "Amel Ben Ali",
    verified_at: "2024-01-25"
  },
  {
    id: "DOC-0003",
    legal_case_id: "LIT-2024-0001",
    client_name: "SOCIETE ALPHA SARL",
    document_type: "factoring_assignment",
    document_name: "Bordereau de cession de créances n_112.pdf",
    required: true,
    verified: false,
    verification_status: "missing"
  },
  {
    id: "DOC-0004",
    legal_case_id: "LIT-2024-0002",
    client_name: "BEN SALEM AHMED",
    document_type: "leasing_contract",
    document_name: "Contrat de Leasing n_LS-2021-992.pdf",
    required: true,
    verified: true,
    verification_status: "verified",
    uploaded_by: "Sami K.",
    uploaded_at: "2023-11-22",
    verified_by: "Sami K.",
    verified_at: "2023-11-23"
  },
  {
    id: "DOC-0005",
    legal_case_id: "LIT-2024-0002",
    client_name: "BEN SALEM AHMED",
    document_type: "enforcement_order",
    document_name: "Formule exécutoire du jugement d'injonction.pdf",
    required: true,
    verified: true,
    verification_status: "verified",
    uploaded_by: "Maître Karim Belhaj",
    uploaded_at: "2024-02-10",
    verified_by: "Sami K.",
    verified_at: "2024-02-12"
  }
];

const DEFAULT_COLLATERALS: Collateral[] = [
  {
    id: "COL-0001",
    legal_case_id: "LIT-2024-0001",
    client_name: "SOCIETE ALPHA SARL",
    collateral_type: "building",
    description: "Hypothèque foncière de 1er rang sur local commercial à Tunis Belvédère.",
    estimated_value: 180000,
    current_value: 180000,
    status: "active",
    notes: "Titre foncier tunisien n°145547"
  },
  {
    id: "COL-0002",
    legal_case_id: "LIT-2024-0002",
    client_name: "BEN SALEM AHMED",
    collateral_type: "vehicle",
    description: "Utilitaire Peugeot Boxer immatriculé 188 TN 8451.",
    estimated_value: 25000,
    current_value: 18000,
    status: "seized",
    seizure_started_at: "2024-03-01",
    seized_at: "2024-03-15",
    notes: "Véhicule sous mandat de séquestre gardé au parc d'huissier à Sousse."
  }
];

const DEFAULT_GUARANTORS: Guarantor[] = [
  {
    id: "GUA-0001",
    legal_case_id: "LIT-2024-0001",
    client_name: "SOCIETE ALPHA SARL",
    full_name: "Ben Amar Hichem",
    phone: "+216 98 456 123",
    address: "Appartement 14A, Les Berges du Lac 2, Tunis",
    relationship: "Gérant majoritaire",
    guarantee_amount: 150000,
    status: "active"
  },
  {
    id: "GUA-0002",
    legal_case_id: "LIT-2024-0003",
    client_name: "GLOBAL TECH TUNISIE",
    full_name: "Cherif Mohamed",
    phone: "+216 22 998 776",
    address: "Zone Industrielle Charguia II, Tunis",
    relationship: "Directeur Général associé",
    guarantee_amount: 400000,
    status: "active"
  }
];

const DEFAULT_FEES: LegalFee[] = [
  {
    id: "FEE-0001",
    legal_case_id: "LIT-2024-0001",
    client_name: "SOCIETE ALPHA SARL",
    fee_type: "lawyer_fee",
    amount: 3500,
    currency: "TND",
    incurred_at: "2024-01-25",
    paid_at: "2024-02-10",
    paid_by: "Banque RecovTN",
    recoverable_from_client: true,
    recovered_amount: 0,
    status: "paid",
    notes: "Provision d'ouverture de procédure - Maître Trabelsi"
  },
  {
    id: "FEE-0002",
    legal_case_id: "LIT-2024-0001",
    client_name: "SOCIETE ALPHA SARL",
    fee_type: "bailiff_fee",
    amount: 850,
    currency: "TND",
    incurred_at: "2024-01-20",
    paid_at: "2024-02-05",
    paid_by: "Banque RecovTN",
    recoverable_from_client: true,
    recovered_amount: 0,
    status: "paid",
    notes: "Exploit de mise en demeure par Huissier Mehdi Ouali"
  },
  {
    id: "FEE-0003",
    legal_case_id: "LIT-2024-0002",
    client_name: "BEN SALEM AHMED",
    fee_type: "bailiff_fee",
    amount: 620,
    currency: "TND",
    incurred_at: "2024-03-20",
    paid_at: "2024-04-10",
    paid_by: "Banque RecovTN",
    recoverable_from_client: true,
    recovered_amount: 620,
    status: "recovered",
    notes: "PV de saisie conservatoire - Huissier Fatma Zribi"
  }
];

const DEFAULT_AUDIT: AuditLog[] = [
  {
    id: "AUD-0001",
    timestamp: "2026-05-30T10:15:00Z",
    user: "user@recovtn.com",
    action: "Ouverture du système",
    details: "Accès à l'espace d'audit contentieux"
  }
];

// Helper to check/initialize storage
function initStorage<T>(key: string, defaults: T): T {
  const existing = localStorage.getItem(key);
  if (!existing) {
    localStorage.setItem(key, JSON.stringify(defaults));
    return defaults;
  }
  try {
    return JSON.parse(existing);
  } catch (e) {
    localStorage.setItem(key, JSON.stringify(defaults));
    return defaults;
  }
}

// ─── STATE CLASS / EXPORTS ───

export const LitigationStore = {
  getPreLitCases(): PreLitigationCase[] {
    return initStorage(STORAGE_KEYS.PRE_LIT, DEFAULT_PRE_LIT);
  },
  savePreLitCases(list: PreLitigationCase[]) {
    localStorage.setItem(STORAGE_KEYS.PRE_LIT, JSON.stringify(list));
  },
  
  getLegalCases(): LegalCase[] {
    return initStorage(STORAGE_KEYS.LEGAL_CASES, DEFAULT_LEGAL_CASES);
  },
  saveLegalCases(list: LegalCase[]) {
    localStorage.setItem(STORAGE_KEYS.LEGAL_CASES, JSON.stringify(list));
  },

  getLegalActions(): LegalAction[] {
    return initStorage(STORAGE_KEYS.LEGAL_ACTIONS, DEFAULT_ACTIONS);
  },
  saveLegalActions(list: LegalAction[]) {
    localStorage.setItem(STORAGE_KEYS.LEGAL_ACTIONS, JSON.stringify(list));
  },

  getLegalDocuments(): LegalDocument[] {
    return initStorage(STORAGE_KEYS.LEGAL_DOCS, DEFAULT_DOCUMENTS);
  },
  saveLegalDocuments(list: LegalDocument[]) {
    localStorage.setItem(STORAGE_KEYS.LEGAL_DOCS, JSON.stringify(list));
  },

  getCollaterals(): Collateral[] {
    return initStorage(STORAGE_KEYS.COLLATERALS, DEFAULT_COLLATERALS);
  },
  saveCollaterals(list: Collateral[]) {
    localStorage.setItem(STORAGE_KEYS.COLLATERALS, JSON.stringify(list));
  },

  getGuarantors(): Guarantor[] {
    return initStorage(STORAGE_KEYS.GUARANTORS, DEFAULT_GUARANTORS);
  },
  saveGuarantors(list: Guarantor[]) {
    localStorage.setItem(STORAGE_KEYS.GUARANTORS, JSON.stringify(list));
  },

  getLegalFees(): LegalFee[] {
    return initStorage(STORAGE_KEYS.LEGAL_FEES, DEFAULT_FEES);
  },
  saveLegalFees(list: LegalFee[]) {
    localStorage.setItem(STORAGE_KEYS.LEGAL_FEES, JSON.stringify(list));
  },

  getAuditLogs(): AuditLog[] {
    return initStorage(STORAGE_KEYS.AUDIT_LOGS, DEFAULT_AUDIT);
  },
  logAction(user: string, action: string, details: string) {
    const logs = this.getAuditLogs();
    const newLog: AuditLog = {
      id: `AUD-${Math.floor(100000 + Math.random() * 900000)}`,
      timestamp: new Date().toISOString(),
      user: user || "système@recovtn.com",
      action,
      details
    };
    logs.unshift(newLog);
    localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(logs));
  }
};
