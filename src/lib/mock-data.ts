import { ScoringCriteria, calculerScore, ScoringResult } from './scoring';

export interface DossierComplet {
  id: string;
  clientCode: string;
  debtorName: string;
  amount: number;
  status: 'a_relancer' | 'en_relance' | 'promesse_paiement' | 'partiellement_paye' | 'paye' | 'contentieux';
  managementLevel: string;
  agent: string;
  date: string;
  scoring: ScoringCriteria;
  scoringResult: ScoringResult;
  typologieClient: ScoringCriteria['typologieClient'];
}

export const statusConfig: Record<string, { label: string; color: string }> = {
  a_relancer: { label: 'À relancer', color: 'text-sky bg-sky/10' },
  en_relance: { label: 'En relance', color: 'text-gold bg-gold/10' },
  promesse_paiement: { label: 'Promesse de paiement', color: 'text-purple-600 bg-purple-50' },
  partiellement_paye: { label: 'Partiellement payé', color: 'text-amber-600 bg-amber-50' },
  paye: { label: 'Payé', color: 'text-green-600 bg-green-50' },
  contentieux: { label: 'Contentieux', color: 'text-destructive bg-destructive/10' },
};

function buildDossier(
  id: string, clientCode: string, debtorName: string, amount: number,
  status: DossierComplet['status'], managementLevel: string, agent: string, date: string,
  scoring: ScoringCriteria
): DossierComplet {
  return {
    id, clientCode, debtorName, amount, status, managementLevel, agent, date,
    scoring,
    scoringResult: calculerScore(scoring),
    typologieClient: scoring.typologieClient,
  };
}

export const mockDossiers: DossierComplet[] = [
  buildDossier('1', 'RCV-2024-001', 'DEBITEUR ALPHA DEMO', 145000, 'en_relance', 'directeur', 'Agent Démo 1', '2024-03-15',
    { montant: 145000, ancienneteJours: 95, tauxPaiementHistorique: 30, tauxReactivite: 20, typologieClient: 'pme' }),
  buildDossier('2', 'RCV-2024-002', 'PARTICULIER DEMO 01', 22000, 'contentieux', 'comite', 'Agent Démo 2', '2024-03-14',
    { montant: 22000, ancienneteJours: 200, tauxPaiementHistorique: 10, tauxReactivite: 5, typologieClient: 'particulier' }),
  buildDossier('3', 'RCV-2024-003', 'TECH GLOBAL DEMO', 890000, 'a_relancer', 'recouvreur', 'Agent Démo 3', '2024-03-13',
    { montant: 890000, ancienneteJours: 45, tauxPaiementHistorique: 70, tauxReactivite: 60, typologieClient: 'grande_entreprise' }),
  buildDossier('4', 'RCV-2024-004', 'ENTREPRISE K DEMO', 56000, 'paye', 'directeur', 'Agent Démo 1', '2024-03-12',
    { montant: 56000, ancienneteJours: 30, tauxPaiementHistorique: 90, tauxReactivite: 85, typologieClient: 'pme' }),
  buildDossier('5', 'RCV-2024-005', 'FONDS MARINA DEMO', 320000, 'promesse_paiement', 'recouvreur', 'Agent Démo 3', '2024-03-11',
    { montant: 320000, ancienneteJours: 75, tauxPaiementHistorique: 50, tauxReactivite: 40, typologieClient: 'grande_entreprise' }),
  buildDossier('6', 'RCV-2024-006', 'TRANSIT AERIEN DEMO SARL', 78000, 'en_relance', 'directeur', 'Agent Démo 2', '2024-03-10',
    { montant: 78000, ancienneteJours: 110, tauxPaiementHistorique: 45, tauxReactivite: 30, typologieClient: 'institution' }),
  buildDossier('7', 'RCV-2024-007', 'CIMENTS DEMO SA', 1200000, 'contentieux', 'comite', 'Agent Démo 1', '2024-03-09',
    { montant: 1200000, ancienneteJours: 180, tauxPaiementHistorique: 15, tauxReactivite: 10, typologieClient: 'grande_entreprise' }),
  buildDossier('8', 'RCV-2024-008', 'STAR ASSURANCES', 45000, 'a_relancer', 'recouvreur', 'Agent Démo 3', '2024-03-08',
    { montant: 45000, ancienneteJours: 20, tauxPaiementHistorique: 85, tauxReactivite: 90, typologieClient: 'institution' }),
  buildDossier('9', 'RCV-2024-009', 'BANQUE DE TUNISIE', 560000, 'partiellement_paye', 'directeur', 'Agent Démo 2', '2024-02-28',
    { montant: 560000, ancienneteJours: 60, tauxPaiementHistorique: 65, tauxReactivite: 55, typologieClient: 'institution' }),
  buildDossier('10', 'RCV-2024-010', 'SLIM TRADING', 18000, 'promesse_paiement', 'recouvreur', 'Agent Démo 3', '2024-02-25',
    { montant: 18000, ancienneteJours: 40, tauxPaiementHistorique: 75, tauxReactivite: 70, typologieClient: 'particulier' }),
];
