import { PortfolioL1, CategoryL2, SubCategoryL3, ProductL4 } from '@/types/portfolio-taxonomy';

export const PORTFOLIO_TAXONOMY: PortfolioL1[] = [
  // =========================================================================
  // NIVEAU 1 : PORTEFEUILLE ENTREPRISES & CORPORATES (GRANDES ENTREPRISES & PME)
  // =========================================================================
  {
    id: 'p-entreprises',
    name: 'Portefeuille Entreprises & Corporates',
    code: 'P-ENT',
    color: '#3b82f6',
    metrics: {
      outstanding: 18450000,
      overdue: 3120000,
      count: 420,
      recoveryRate: 78.4,
    },
    categories: [
      // NIVEAU 2 : Crédits de trésorerie
      {
        id: 'cat-tresorerie',
        name: 'Crédits de trésorerie',
        code: 'CAT-TRESORERIE',
        portfolioL1Id: 'p-entreprises',
        iconName: 'Wallet',
        metrics: {
          outstanding: 9850000,
          overdue: 1740000,
          count: 245,
          recoveryRate: 81.2,
        },
        subCategories: [
          // NIVEAU 3 : Facilités de trésorerie & découverts d'exploitation
          {
            id: 'sub-decouverts-lignes',
            name: "Facilités de trésorerie & Découverts d'exploitation",
            code: 'SUB-DEC-LIG',
            categoryL2Id: 'cat-tresorerie',
            portfolioL1Id: 'p-entreprises',
            description: "Concours bancaires court terme destinés à pallier les décalages ponctuels de trésorerie courante.",
            metrics: {
              outstanding: 5600000,
              overdue: 980000,
              count: 140,
              recoveryRate: 82.5,
            },
            products: [
              // NIVEAU 4 : Produits
              {
                id: 'prod-facilite-caisse',
                name: 'Facilité de caisse',
                code: 'FAC-CAISSE',
                categoryL2: 'Crédits de trésorerie',
                subCategoryL3: "Facilités de trésorerie & Découverts d'exploitation",
                portfolioL1: 'Portefeuille Entreprises & Corporates',
                description: 'Autorisation de crédit à très court terme (quelques jours) pour combler des décalages de flux.',
                typicalRepaymentMode: 'Crédit à échéance unique',
                riskProfile: 'Modéré',
                metrics: { outstanding: 1250000, overdue: 185000, count: 42, recoveryRate: 86.4, defaultRate: 8.2 },
              },
              {
                id: 'prod-decouvert-bancaire',
                name: 'Découvert bancaire',
                code: 'DEC-BANC',
                categoryL2: 'Crédits de trésorerie',
                subCategoryL3: "Facilités de trésorerie & Découverts d'exploitation",
                portfolioL1: 'Portefeuille Entreprises & Corporates',
                description: 'Ligne permanente autorisée pour financer le fonds de roulement et les besoins d’exploitation.',
                typicalRepaymentMode: 'Crédit revolving',
                riskProfile: 'Élevé',
                metrics: { outstanding: 2450000, overdue: 490000, count: 56, recoveryRate: 79.1, defaultRate: 14.5 },
              },
              {
                id: 'prod-credit-campagne',
                name: 'Crédit de campagne',
                code: 'CRED-CAMP',
                categoryL2: 'Crédits de trésorerie',
                subCategoryL3: "Facilités de trésorerie & Découverts d'exploitation",
                portfolioL1: 'Portefeuille Entreprises & Corporates',
                description: "Financement saisonnier destiné aux filières agricoles, viticoles, oléicoles ou agro-industrielles.",
                typicalRepaymentMode: 'Crédit à échéance unique',
                riskProfile: 'Modéré',
                metrics: { outstanding: 1100000, overdue: 165000, count: 24, recoveryRate: 84.0, defaultRate: 9.8 },
              },
              {
                id: 'prod-credit-prefinancement',
                name: 'Crédit de préfinancement',
                code: 'CRED-PREFIN',
                categoryL2: 'Crédits de trésorerie',
                subCategoryL3: "Facilités de trésorerie & Découverts d'exploitation",
                portfolioL1: 'Portefeuille Entreprises & Corporates',
                description: 'Trésorerie débloquée sur présentation de bons de commande fermes ou de marchés publics notifiés.',
                typicalRepaymentMode: 'Crédit à échéance unique',
                riskProfile: 'Modéré',
                metrics: { outstanding: 800000, overdue: 140000, count: 18, recoveryRate: 83.2, defaultRate: 10.4 },
              },
            ],
          },
          // NIVEAU 3 : Mobilisation du poste clients & créances commerciales
          {
            id: 'sub-mobilisation-creances',
            name: 'Mobilisation du poste clients & Créances commerciales',
            code: 'SUB-MOB-CRE',
            categoryL2Id: 'cat-tresorerie',
            portfolioL1Id: 'p-entreprises',
            description: "Avances et refinancements adossés à des créances commerciales nées et exigibles.",
            metrics: {
              outstanding: 4250000,
              overdue: 760000,
              count: 105,
              recoveryRate: 79.8,
            },
            products: [
              {
                id: 'prod-escompte-commercial',
                name: 'Escompte commercial',
                code: 'ESC-COMM',
                categoryL2: 'Crédits de trésorerie',
                subCategoryL3: 'Mobilisation du poste clients & Créances commerciales',
                portfolioL1: 'Portefeuille Entreprises & Corporates',
                description: "Mobilisation d'effets de commerce (traites, billets à ordre) avant leur date d'échéance.",
                typicalRepaymentMode: 'Crédit à échéance unique',
                riskProfile: 'Modéré',
                metrics: { outstanding: 1950000, overdue: 320000, count: 52, recoveryRate: 82.0, defaultRate: 11.2 },
              },
              {
                id: 'prod-mobilisation-creances',
                name: 'Mobilisation de créances',
                code: 'MOB-CREAN',
                categoryL2: 'Crédits de trésorerie',
                subCategoryL3: 'Mobilisation du poste clients & Créances commerciales',
                portfolioL1: 'Portefeuille Entreprises & Corporates',
                description: 'Cession de bordereaux de créances professionnelles conformément au cadre bancaire tunisien.',
                typicalRepaymentMode: 'Crédit amortissable',
                riskProfile: 'Modéré',
                metrics: { outstanding: 1350000, overdue: 240000, count: 31, recoveryRate: 80.5, defaultRate: 12.0 },
              },
              {
                id: 'prod-avance-factures',
                name: 'Avance sur factures',
                code: 'AV-FACT',
                categoryL2: 'Crédits de trésorerie',
                subCategoryL3: 'Mobilisation du poste clients & Créances commerciales',
                portfolioL1: 'Portefeuille Entreprises & Corporates',
                description: 'Financement court terme adossé à des factures certifiées non encore échues.',
                typicalRepaymentMode: 'Crédit à échéance unique',
                riskProfile: 'Faible',
                metrics: { outstanding: 950000, overdue: 200000, count: 22, recoveryRate: 85.0, defaultRate: 8.9 },
              },
            ],
          },
        ],
      },

      // NIVEAU 2 : Crédits d'investissement
      {
        id: 'cat-investissement',
        name: "Crédits d'investissement",
        code: 'CAT-INVEST',
        portfolioL1Id: 'p-entreprises',
        iconName: 'Building2',
        metrics: {
          outstanding: 8600000,
          overdue: 1380000,
          count: 175,
          recoveryRate: 75.3,
        },
        subCategories: [
          // NIVEAU 3 : Financement des actifs corporels & d'expansion
          {
            id: 'sub-actifs-corporels',
            name: "Financement des actifs corporels & d'expansion",
            code: 'SUB-ACT-CORP',
            categoryL2Id: 'cat-investissement',
            portfolioL1Id: 'p-entreprises',
            description: "Crédits à moyen et long terme adossés à des investissements industriels et productifs.",
            metrics: {
              outstanding: 5400000,
              overdue: 850000,
              count: 110,
              recoveryRate: 77.0,
            },
            products: [
              {
                id: 'prod-credit-investissement',
                name: "Crédit d'investissement",
                code: 'CRED-INVEST',
                categoryL2: "Crédits d'investissement",
                subCategoryL3: "Financement des actifs corporels & d'expansion",
                portfolioL1: 'Portefeuille Entreprises & Corporates',
                description: 'Prêt à moyen et long terme finançant des projets de création, modernisation ou extension.',
                typicalRepaymentMode: 'Crédit amortissable',
                riskProfile: 'Modéré',
                metrics: { outstanding: 3200000, overdue: 490000, count: 65, recoveryRate: 78.5, defaultRate: 11.5 },
              },
              {
                id: 'prod-credit-equipement',
                name: 'Crédit équipement',
                code: 'CRED-EQUIP',
                categoryL2: "Crédits d'investissement",
                subCategoryL3: "Financement des actifs corporels & d'expansion",
                portfolioL1: 'Portefeuille Entreprises & Corporates',
                description: 'Financement affecté pour machines, matériel d’atelier, outillage de production et technologies.',
                typicalRepaymentMode: 'Crédit amortissable',
                riskProfile: 'Modéré',
                metrics: { outstanding: 2200000, overdue: 360000, count: 45, recoveryRate: 75.2, defaultRate: 12.8 },
              },
            ],
          },
          // NIVEAU 3 : Immobilier professionnel d'exploitation
          {
            id: 'sub-immo-pro',
            name: "Immobilier professionnel d'exploitation",
            code: 'SUB-IMMO-PRO',
            categoryL2Id: 'cat-investissement',
            portfolioL1Id: 'p-entreprises',
            description: "Financement d'usines, entrepôts logistiques, locaux commerciaux et sièges sociaux.",
            metrics: {
              outstanding: 3200000,
              overdue: 530000,
              count: 65,
              recoveryRate: 72.8,
            },
            products: [
              {
                id: 'prod-credit-immo-pro',
                name: 'Crédit immobilier professionnel',
                code: 'CRED-IMMO-PRO',
                categoryL2: "Crédits d'investissement",
                subCategoryL3: "Immobilier professionnel d'exploitation",
                portfolioL1: 'Portefeuille Entreprises & Corporates',
                description: 'Prêt hypothécaire à long terme finançant des immeubles de bureaux, plates-formes et locaux.',
                typicalRepaymentMode: 'Crédit amortissable',
                riskProfile: 'Faible',
                metrics: { outstanding: 3200000, overdue: 530000, count: 65, recoveryRate: 72.8, defaultRate: 10.1 },
              },
            ],
          },
        ],
      },
    ],
  },

  // =========================================================================
  // NIVEAU 1 : PORTEFEUILLE PARTICULIERS & PROFESSIONNELS (RETAIL BANKING)
  // =========================================================================
  {
    id: 'p-particuliers',
    name: 'Portefeuille Particuliers & Retail',
    code: 'P-RET',
    color: '#10b981',
    metrics: {
      outstanding: 14200000,
      overdue: 2280000,
      count: 1250,
      recoveryRate: 85.6,
    },
    categories: [
      // NIVEAU 2 : Crédits aux particuliers
      {
        id: 'cat-particuliers',
        name: 'Crédits aux particuliers',
        code: 'CAT-PART',
        portfolioL1Id: 'p-particuliers',
        iconName: 'UserCheck',
        metrics: {
          outstanding: 14200000,
          overdue: 2280000,
          count: 1250,
          recoveryRate: 85.6,
        },
        subCategories: [
          // NIVEAU 3 : Crédits à la consommation & mobilité
          {
            id: 'sub-conso-mobilite',
            name: 'Crédits à la consommation & Mobilité',
            code: 'SUB-CONSO-MOB',
            categoryL2Id: 'cat-particuliers',
            portfolioL1Id: 'p-particuliers',
            description: "Financements aux ménages pour consommation courante, véhicules et dépenses personnelles.",
            metrics: {
              outstanding: 7900000,
              overdue: 1350000,
              count: 820,
              recoveryRate: 86.8,
            },
            products: [
              {
                id: 'prod-credit-conso',
                name: 'Crédit à la consommation',
                code: 'CRED-CONSO',
                categoryL2: 'Crédits aux particuliers',
                subCategoryL3: 'Crédits à la consommation & Mobilité',
                portfolioL1: 'Portefeuille Particuliers & Retail',
                description: 'Prêt amortissable pour équipement du foyer, électroménager et besoins familiaux.',
                typicalRepaymentMode: 'Crédit amortissable',
                riskProfile: 'Modéré',
                metrics: { outstanding: 2800000, overdue: 460000, count: 320, recoveryRate: 87.2, defaultRate: 11.2 },
              },
              {
                id: 'prod-credit-personnel',
                name: 'Crédit personnel',
                code: 'CRED-PERSO',
                categoryL2: 'Crédits aux particuliers',
                subCategoryL3: 'Crédits à la consommation & Mobilité',
                portfolioL1: 'Portefeuille Particuliers & Retail',
                description: 'Trésorerie non affectée mise à disposition du titulaire de compte sans justificatif de dépense.',
                typicalRepaymentMode: 'Crédit amortissable',
                riskProfile: 'Élevé',
                metrics: { outstanding: 2100000, overdue: 420000, count: 240, recoveryRate: 83.5, defaultRate: 14.8 },
              },
              {
                id: 'prod-credit-auto',
                name: 'Crédit automobile',
                code: 'CRED-AUTO',
                categoryL2: 'Crédits aux particuliers',
                subCategoryL3: 'Crédits à la consommation & Mobilité',
                portfolioL1: 'Portefeuille Particuliers & Retail',
                description: 'Prêt affecté avec gage sur véhicule neuf ou d’occasion pour particuliers.',
                typicalRepaymentMode: 'Crédit amortissable',
                riskProfile: 'Faible',
                metrics: { outstanding: 1950000, overdue: 280000, count: 180, recoveryRate: 89.4, defaultRate: 9.1 },
              },
              {
                id: 'prod-credit-revolving',
                name: 'Crédit renouvelable / revolving',
                code: 'CRED-REVOLV',
                categoryL2: 'Crédits aux particuliers',
                subCategoryL3: 'Crédits à la consommation & Mobilité',
                portfolioL1: 'Portefeuille Particuliers & Retail',
                description: 'Réserve d’argent permanente adossée à une carte de crédit avec reconstitution continue.',
                typicalRepaymentMode: 'Crédit revolving',
                riskProfile: 'Critique',
                metrics: { outstanding: 1050000, overdue: 190000, count: 80, recoveryRate: 78.2, defaultRate: 16.5 },
              },
            ],
          },
          // NIVEAU 3 : Crédits immobiliers & amélioration de l'habitat
          {
            id: 'sub-habitat-travaux',
            name: "Crédits immobiliers & Amélioration de l'habitat",
            code: 'SUB-HAB-TRAV',
            categoryL2Id: 'cat-particuliers',
            portfolioL1Id: 'p-particuliers',
            description: "Financement à long terme de résidences principales/secondaires et travaux d'aménagement.",
            metrics: {
              outstanding: 6300000,
              overdue: 930000,
              count: 430,
              recoveryRate: 84.1,
            },
            products: [
              {
                id: 'prod-credit-habitat',
                name: 'Crédit immobilier / habitat',
                code: 'CRED-HAB',
                categoryL2: 'Crédits aux particuliers',
                subCategoryL3: "Crédits immobiliers & Amélioration de l'habitat",
                portfolioL1: 'Portefeuille Particuliers & Retail',
                description: 'Prêt immobilier à long terme (15-25 ans) garanti par inscription d’hypothèque de 1er rang.',
                typicalRepaymentMode: 'Crédit amortissable',
                riskProfile: 'Faible',
                metrics: { outstanding: 4600000, overdue: 650000, count: 280, recoveryRate: 85.5, defaultRate: 7.8 },
              },
              {
                id: 'prod-credit-travaux',
                name: 'Crédit travaux',
                code: 'CRED-TRAV',
                categoryL2: 'Crédits aux particuliers',
                subCategoryL3: "Crédits immobiliers & Amélioration de l'habitat",
                portfolioL1: 'Portefeuille Particuliers & Retail',
                description: "Financement dédié aux travaux de rénovation, d'extension et d'aménagements intérieurs.",
                typicalRepaymentMode: 'Crédit amortissable',
                riskProfile: 'Modéré',
                metrics: { outstanding: 1700000, overdue: 280000, count: 150, recoveryRate: 82.6, defaultRate: 10.9 },
              },
            ],
          },
        ],
      },
    ],
  },

  // =========================================================================
  // NIVEAU 1 : PORTEFEUILLE COMMERCE EXTÉRIEUR & ENGAGEMENTS PAR SIGNATURE
  // =========================================================================
  {
    id: 'p-international-signature',
    name: 'Portefeuille Commerce Extérieur & Signature',
    code: 'P-INT-SIG',
    color: '#8b5cf6',
    metrics: {
      outstanding: 11200000,
      overdue: 1450000,
      count: 310,
      recoveryRate: 88.0,
    },
    categories: [
      // NIVEAU 2 : Commerce extérieur
      {
        id: 'cat-comex',
        name: 'Commerce extérieur',
        code: 'CAT-COMEX',
        portfolioL1Id: 'p-international-signature',
        iconName: 'Globe',
        metrics: {
          outstanding: 6800000,
          overdue: 890000,
          count: 175,
          recoveryRate: 87.5,
        },
        subCategories: [
          // NIVEAU 3 : Financements et crédits documentaires import/export
          {
            id: 'sub-credoc-import-export',
            name: 'Crédits documentaires & Financements Import/Export',
            code: 'SUB-CREDOC-IMP-EXP',
            categoryL2Id: 'cat-comex',
            portfolioL1Id: 'p-international-signature',
            description: "Instruments bancaires garantissant le dénouement sécurisé des transactions transfrontalières.",
            metrics: {
              outstanding: 4900000,
              overdue: 620000,
              count: 125,
              recoveryRate: 89.2,
            },
            products: [
              {
                id: 'prod-credoc',
                name: 'Crédit documentaire (CREDOC)',
                code: 'CREDOC',
                categoryL2: 'Commerce extérieur',
                subCategoryL3: 'Crédits documentaires & Financements Import/Export',
                portfolioL1: 'Portefeuille Commerce Extérieur & Signature',
                description: 'Engagement irrévocable de paiement sur présentation de documents conformes de transport.',
                typicalRepaymentMode: 'Crédit à échéance unique',
                riskProfile: 'Modéré',
                metrics: { outstanding: 2200000, overdue: 250000, count: 55, recoveryRate: 91.0, defaultRate: 6.5 },
              },
              {
                id: 'prod-financement-import',
                name: 'Financement import',
                code: 'FIN-IMPORT',
                categoryL2: 'Commerce extérieur',
                subCategoryL3: 'Crédits documentaires & Financements Import/Export',
                portfolioL1: 'Portefeuille Commerce Extérieur & Signature',
                description: 'Ligne de crédit finançant les règlements aux fournisseurs étrangers de matières et marchandises.',
                typicalRepaymentMode: 'Crédit à échéance unique',
                riskProfile: 'Modéré',
                metrics: { outstanding: 1500000, overdue: 210000, count: 40, recoveryRate: 88.5, defaultRate: 8.4 },
              },
              {
                id: 'prod-prefinancement-export',
                name: 'Préfinancement export',
                code: 'PREFIN-EXP',
                categoryL2: 'Commerce extérieur',
                subCategoryL3: 'Crédits documentaires & Financements Import/Export',
                portfolioL1: 'Portefeuille Commerce Extérieur & Signature',
                description: 'Avance de trésorerie en devises ou TND pour produire des commandes destinées à l’exportation.',
                typicalRepaymentMode: 'Crédit à échéance unique',
                riskProfile: 'Modéré',
                metrics: { outstanding: 750000, overdue: 95000, count: 18, recoveryRate: 87.0, defaultRate: 9.1 },
              },
              {
                id: 'prod-avance-creances-export',
                name: 'Avance sur créances export',
                code: 'AV-CRE-EXP',
                categoryL2: 'Commerce extérieur',
                subCategoryL3: 'Crédits documentaires & Financements Import/Export',
                portfolioL1: 'Portefeuille Commerce Extérieur & Signature',
                description: 'Mobilisation anticipée des factures tirées sur des clients étrangers avant encaissement.',
                typicalRepaymentMode: 'Crédit à échéance unique',
                riskProfile: 'Faible',
                metrics: { outstanding: 450000, overdue: 65000, count: 12, recoveryRate: 90.5, defaultRate: 7.2 },
              },
            ],
          },
          // NIVEAU 3 : Financements acheteurs & fournisseurs internationaux
          {
            id: 'sub-fin-acheteurs-fournisseurs',
            name: 'Financements Acheteurs & Fournisseurs Internationaux',
            code: 'SUB-FIN-ACH-FOUR',
            categoryL2Id: 'cat-comex',
            portfolioL1Id: 'p-international-signature',
            description: "Crédits structurés accordés aux contreparties étrangères ou cession de traites fournisseurs.",
            metrics: {
              outstanding: 1900000,
              overdue: 270000,
              count: 50,
              recoveryRate: 84.6,
            },
            products: [
              {
                id: 'prod-credit-acheteur',
                name: 'Crédit acheteur',
                code: 'CRED-ACHETEUR',
                categoryL2: 'Commerce extérieur',
                subCategoryL3: 'Financements Acheteurs & Fournisseurs Internationaux',
                portfolioL1: 'Portefeuille Commerce Extérieur & Signature',
                description: 'Crédit consenti par la banque à un importateur étranger pour payer au comptant l’exportateur tunisien.',
                typicalRepaymentMode: 'Crédit amortissable',
                riskProfile: 'Modéré',
                metrics: { outstanding: 1100000, overdue: 160000, count: 28, recoveryRate: 85.0, defaultRate: 8.9 },
              },
              {
                id: 'prod-credit-fournisseur',
                name: 'Crédit fournisseur',
                code: 'CRED-FOURN',
                categoryL2: 'Commerce extérieur',
                subCategoryL3: 'Financements Acheteurs & Fournisseurs Internationaux',
                portfolioL1: 'Portefeuille Commerce Extérieur & Signature',
                description: 'Financement accordé par l’exportateur à son client sous forme de délais, escompté auprès de la banque.',
                typicalRepaymentMode: 'Crédit à échéance unique',
                riskProfile: 'Modéré',
                metrics: { outstanding: 800000, overdue: 110000, count: 22, recoveryRate: 84.1, defaultRate: 9.5 },
              },
            ],
          },
        ],
      },

      // NIVEAU 2 : Crédits par signature (Engagements Hors-Bilan)
      {
        id: 'cat-signature',
        name: 'Crédits par signature',
        code: 'CAT-SIGN',
        portfolioL1Id: 'p-international-signature',
        iconName: 'FileSignature',
        metrics: {
          outstanding: 4400000,
          overdue: 560000,
          count: 135,
          recoveryRate: 89.1,
        },
        subCategories: [
          // NIVEAU 3 : Cautions de marchés publics & privés
          {
            id: 'sub-cautions-marches',
            name: 'Cautions de Marchés & Adjudications',
            code: 'SUB-CAUT-MARCH',
            categoryL2Id: 'cat-signature',
            portfolioL1Id: 'p-international-signature',
            description: "Garanties exigées lors des appels d'offres et de l'exécution des marchés en Tunisie.",
            metrics: {
              outstanding: 2800000,
              overdue: 340000,
              count: 85,
              recoveryRate: 90.5,
            },
            products: [
              {
                id: 'prod-caution-bancaire',
                name: 'Caution bancaire',
                code: 'CAUT-BANC',
                categoryL2: 'Crédits par signature',
                subCategoryL3: 'Cautions de Marchés & Adjudications',
                portfolioL1: 'Portefeuille Commerce Extérieur & Signature',
                description: 'Engagement de la banque de se substituer au débiteur en cas de défaillance contractuelle.',
                typicalRepaymentMode: 'Crédit à échéance unique',
                riskProfile: 'Faible',
                metrics: { outstanding: 950000, overdue: 110000, count: 32, recoveryRate: 92.0, defaultRate: 5.5 },
              },
              {
                id: 'prod-garantie-soumission',
                name: 'Garantie de soumission',
                code: 'GAR-SOUMIS',
                categoryL2: 'Crédits par signature',
                subCategoryL3: 'Cautions de Marchés & Adjudications',
                portfolioL1: 'Portefeuille Commerce Extérieur & Signature',
                description: 'Garantie de caution provisoire pour assurer le maintien de l’offre lors d’un appel d’offres.',
                typicalRepaymentMode: 'Crédit à échéance unique',
                riskProfile: 'Faible',
                metrics: { outstanding: 700000, overdue: 75000, count: 24, recoveryRate: 93.5, defaultRate: 4.8 },
              },
              {
                id: 'prod-garantie-bonne-execution',
                name: 'Garantie de bonne exécution',
                code: 'GAR-EXEC',
                categoryL2: 'Crédits par signature',
                subCategoryL3: 'Cautions de Marchés & Adjudications',
                portfolioL1: 'Portefeuille Commerce Extérieur & Signature',
                description: 'Caution définitive garantissant le bon achèvement des prestations selon le cahier des charges.',
                typicalRepaymentMode: 'Crédit à échéance unique',
                riskProfile: 'Modéré',
                metrics: { outstanding: 750000, overdue: 95000, count: 18, recoveryRate: 89.0, defaultRate: 6.8 },
              },
              {
                id: 'prod-garantie-restitution-avance',
                name: "Garantie de restitution d'avance",
                code: 'GAR-REST-AV',
                categoryL2: 'Crédits par signature',
                subCategoryL3: 'Cautions de Marchés & Adjudications',
                portfolioL1: 'Portefeuille Commerce Extérieur & Signature',
                description: 'Garantit le remboursement des acomptes ou avances forfaitaires versés par le donneur d’ordre.',
                typicalRepaymentMode: 'Crédit à échéance unique',
                riskProfile: 'Modéré',
                metrics: { outstanding: 400000, overdue: 60000, count: 11, recoveryRate: 88.0, defaultRate: 7.2 },
              },
            ],
          },
          // NIVEAU 3 : Cautions financières, avals & garanties douanières
          {
            id: 'sub-avals-douanes',
            name: 'Avals Financiers & Garanties Douanières',
            code: 'SUB-AVAL-DOUAN',
            categoryL2Id: 'cat-signature',
            portfolioL1Id: 'p-international-signature',
            description: "Engagements de paiement cambiaires et cautions vis-à-vis des administrations publiques et douanières.",
            metrics: {
              outstanding: 1600000,
              overdue: 220000,
              count: 50,
              recoveryRate: 87.2,
            },
            products: [
              {
                id: 'prod-aval',
                name: 'Aval',
                code: 'AVAL-BANC',
                categoryL2: 'Crédits par signature',
                subCategoryL3: 'Avals Financiers & Garanties Douanières',
                portfolioL1: 'Portefeuille Commerce Extérieur & Signature',
                description: 'Engagement cambiaire par lequel la banque garantit le paiement d’une traite ou billet à ordre.',
                typicalRepaymentMode: 'Crédit à échéance unique',
                riskProfile: 'Élevé',
                metrics: { outstanding: 950000, overdue: 145000, count: 28, recoveryRate: 86.0, defaultRate: 9.8 },
              },
              {
                id: 'prod-garantie-douaniere',
                name: 'Garantie douanière',
                code: 'GAR-DOUANE',
                categoryL2: 'Crédits par signature',
                subCategoryL3: 'Avals Financiers & Garanties Douanières',
                portfolioL1: 'Portefeuille Commerce Extérieur & Signature',
                description: "Caution bancaire pour crédits d'enlèvement, admission temporaire ou entrepôt sous douane.",
                typicalRepaymentMode: 'Crédit à échéance unique',
                riskProfile: 'Faible',
                metrics: { outstanding: 650000, overdue: 75000, count: 22, recoveryRate: 89.0, defaultRate: 5.9 },
              },
            ],
          },
        ],
      },
    ],
  },

  // =========================================================================
  // NIVEAU 1 : PORTEFEUILLE FINANCEMENTS SPÉCIALISÉS & CRÉDIT-BAIL (LEASING)
  // =========================================================================
  {
    id: 'p-specialises-leasing',
    name: 'Portefeuille Financements Spécialisés & Leasing',
    code: 'P-SPEC-LEAS',
    color: '#f59e0b',
    metrics: {
      outstanding: 12800000,
      overdue: 1980000,
      count: 480,
      recoveryRate: 80.5,
    },
    categories: [
      // NIVEAU 2 : Leasing
      {
        id: 'cat-leasing',
        name: 'Leasing',
        code: 'CAT-LEASING',
        portfolioL1Id: 'p-specialises-leasing',
        iconName: 'Truck',
        metrics: {
          outstanding: 6500000,
          overdue: 990000,
          count: 260,
          recoveryRate: 81.0,
        },
        subCategories: [
          // NIVEAU 3 : Crédit-bail mobilier & équipements
          {
            id: 'sub-leasing-mobilier',
            name: 'Crédit-bail mobilier & Matériels roulants',
            code: 'SUB-LEAS-MOB',
            categoryL2Id: 'cat-leasing',
            portfolioL1Id: 'p-specialises-leasing',
            description: "Location financière avec promesse unilatérale de vente sur véhicules utilitaires et matériel.",
            metrics: {
              outstanding: 4200000,
              overdue: 630000,
              count: 190,
              recoveryRate: 82.4,
            },
            products: [
              {
                id: 'prod-leasing-mobilier',
                name: 'Leasing mobilier',
                code: 'LEAS-MOB',
                categoryL2: 'Leasing',
                subCategoryL3: 'Crédit-bail mobilier & Matériels roulants',
                portfolioL1: 'Portefeuille Financements Spécialisés & Leasing',
                description: 'Crédit-bail portant sur véhicules commerciaux, engins de travaux publics et parcs informatiques.',
                typicalRepaymentMode: 'Crédit amortissable',
                riskProfile: 'Modéré',
                metrics: { outstanding: 4200000, overdue: 630000, count: 190, recoveryRate: 82.4, defaultRate: 11.2 },
              },
            ],
          },
          // NIVEAU 3 : Crédit-bail immobilier
          {
            id: 'sub-leasing-immobilier',
            name: "Crédit-bail immobilier d'entreprise",
            code: 'SUB-LEAS-IMMO',
            categoryL2Id: 'cat-leasing',
            portfolioL1Id: 'p-specialises-leasing',
            description: "Financement en leasing d'actifs immobiliers professionnels construits ou à construire.",
            metrics: {
              outstanding: 2300000,
              overdue: 360000,
              count: 70,
              recoveryRate: 78.5,
            },
            products: [
              {
                id: 'prod-leasing-immobilier',
                name: 'Leasing immobilier',
                code: 'LEAS-IMMO',
                categoryL2: 'Leasing',
                subCategoryL3: "Crédit-bail immobilier d'entreprise",
                portfolioL1: 'Portefeuille Financements Spécialisés & Leasing',
                description: 'Financement à long terme de locaux commerciaux, industriels ou professionnels avec option d’achat.',
                typicalRepaymentMode: 'Crédit amortissable',
                riskProfile: 'Faible',
                metrics: { outstanding: 2300000, overdue: 360000, count: 70, recoveryRate: 78.5, defaultRate: 8.5 },
              },
            ],
          },
        ],
      },

      // NIVEAU 2 : Financements spécialisés
      {
        id: 'cat-fin-specialises',
        name: 'Financements spécialisés',
        code: 'CAT-FIN-SPEC',
        portfolioL1Id: 'p-specialises-leasing',
        iconName: 'Layers',
        metrics: {
          outstanding: 6300000,
          overdue: 990000,
          count: 220,
          recoveryRate: 79.9,
        },
        subCategories: [
          // NIVEAU 3 : Factoring & gestion globale du poste client
          {
            id: 'sub-factoring-gestion',
            name: 'Affacturage & Gestion de trésorerie déléguée',
            code: 'SUB-FACT-GEST',
            categoryL2Id: 'cat-fin-specialises',
            portfolioL1Id: 'p-specialises-leasing',
            description: "Achat de créances commerciales avec garantie contre l'insolvabilité et recouvrement.",
            metrics: {
              outstanding: 2100000,
              overdue: 310000,
              count: 80,
              recoveryRate: 82.0,
            },
            products: [
              {
                id: 'prod-affacturage-factoring',
                name: 'Affacturage / Factoring',
                code: 'FACT-SPEC',
                categoryL2: 'Financements spécialisés',
                subCategoryL3: 'Affacturage & Gestion de trésorerie déléguée',
                portfolioL1: 'Portefeuille Financements Spécialisés & Leasing',
                description: 'Transfert de factures à un factor avec financement immédiat, garantie et relance.',
                typicalRepaymentMode: 'Crédit à échéance unique',
                riskProfile: 'Modéré',
                metrics: { outstanding: 2100000, overdue: 310000, count: 80, recoveryRate: 82.0, defaultRate: 10.5 },
              },
            ],
          },
          // NIVEAU 3 : Financements structurés & syndications
          {
            id: 'sub-structures-syndiques',
            name: 'Financements Structurés & Syndications',
            code: 'SUB-STRUCT-SYND',
            categoryL2Id: 'cat-fin-specialises',
            portfolioL1Id: 'p-specialises-leasing',
            description: "Montages financiers complexes mobilisant plusieurs institutions financières ou investisseurs.",
            metrics: {
              outstanding: 2400000,
              overdue: 390000,
              count: 45,
              recoveryRate: 78.4,
            },
            products: [
              {
                id: 'prod-financement-projets',
                name: 'Financement de projets',
                code: 'FIN-PROJET',
                categoryL2: 'Financements spécialisés',
                subCategoryL3: 'Financements Structurés & Syndications',
                portfolioL1: 'Portefeuille Financements Spécialisés & Leasing',
                description: 'Financement hors bilan / sans recours adossé uniquement aux cash-flows futurs d’une infrastructure.',
                typicalRepaymentMode: 'Crédit avec différé',
                riskProfile: 'Élevé',
                metrics: { outstanding: 1300000, overdue: 210000, count: 22, recoveryRate: 77.0, defaultRate: 13.5 },
              },
              {
                id: 'prod-financement-syndique',
                name: 'Financement syndiqué',
                code: 'FIN-SYNDIQUE',
                categoryL2: 'Financements spécialisés',
                subCategoryL3: 'Financements Structurés & Syndications',
                portfolioL1: 'Portefeuille Financements Spécialisés & Leasing',
                description: 'Crédit syndiqué réuni sous un mandat de syndication d’un pool de banques tunisiennes.',
                typicalRepaymentMode: 'Crédit amortissable',
                riskProfile: 'Modéré',
                metrics: { outstanding: 1100000, overdue: 180000, count: 23, recoveryRate: 80.1, defaultRate: 11.0 },
              },
            ],
          },
          // NIVEAU 3 : Financements sectoriels dédiés
          {
            id: 'sub-financements-sectoriels',
            name: 'Financements Sectoriels Dédiés',
            code: 'SUB-FIN-SECT',
            categoryL2Id: 'cat-fin-specialises',
            portfolioL1Id: 'p-specialises-leasing',
            description: "Lignes d'appui ciblées aux secteurs prioritaires de l'économie tunisienne (PME, agri, promotion immobilière).",
            metrics: {
              outstanding: 1800000,
              overdue: 290000,
              count: 95,
              recoveryRate: 79.5,
            },
            products: [
              {
                id: 'prod-financement-immobilier',
                name: 'Financement immobilier',
                code: 'FIN-IMMO-SPEC',
                categoryL2: 'Financements spécialisés',
                subCategoryL3: 'Financements Sectoriels Dédiés',
                portfolioL1: 'Portefeuille Financements Spécialisés & Leasing',
                description: 'Crédits aux promoteurs immobiliers pour l’aménagement et la construction de lotissements.',
                typicalRepaymentMode: 'Crédit in fine',
                riskProfile: 'Élevé',
                metrics: { outstanding: 750000, overdue: 120000, count: 25, recoveryRate: 79.0, defaultRate: 12.0 },
              },
              {
                id: 'prod-financement-agricole',
                name: 'Financement agricole',
                code: 'FIN-AGRI',
                categoryL2: 'Financements spécialisés',
                subCategoryL3: 'Financements Sectoriels Dédiés',
                portfolioL1: 'Portefeuille Financements Spécialisés & Leasing',
                description: 'Lignes spécifiques FOSDA / BNA pour modernisation des exploitations et cheptels.',
                typicalRepaymentMode: 'Crédit amortissable',
                riskProfile: 'Modéré',
                metrics: { outstanding: 500000, overdue: 85000, count: 35, recoveryRate: 81.5, defaultRate: 10.2 },
              },
              {
                id: 'prod-financement-pme',
                name: 'Financement PME',
                code: 'FIN-PME',
                categoryL2: 'Financements spécialisés',
                subCategoryL3: 'Financements Sectoriels Dédiés',
                portfolioL1: 'Portefeuille Financements Spécialisés & Leasing',
                description: 'Lignes d’appui aux petites et moyennes entreprises avec garantie partielle de la SOTUGAR.',
                typicalRepaymentMode: 'Crédit amortissable',
                riskProfile: 'Modéré',
                metrics: { outstanding: 550000, overdue: 85000, count: 35, recoveryRate: 79.0, defaultRate: 11.5 },
              },
            ],
          },
        ],
      },
    ],
  },

  // =========================================================================
  // NIVEAU 1 : PORTEFEUILLE MODES DE REMBOURSEMENT & STRUCTURES D'AMORTISSEMENT
  // =========================================================================
  {
    id: 'p-modes-remboursement',
    name: "Portefeuille Structures d'Amortissement",
    code: 'P-AMORT',
    color: '#ec4899',
    metrics: {
      outstanding: 15600000,
      overdue: 2450000,
      count: 980,
      recoveryRate: 82.1,
    },
    categories: [
      // NIVEAU 2 : Mode de remboursement
      {
        id: 'cat-modes-remboursement',
        name: 'Mode de remboursement',
        code: 'CAT-MODES-REMB',
        portfolioL1Id: 'p-modes-remboursement',
        iconName: 'CalendarCheck',
        metrics: {
          outstanding: 15600000,
          overdue: 2450000,
          count: 980,
          recoveryRate: 82.1,
        },
        subCategories: [
          // NIVEAU 3 : Amortissement périodique (annuités, mensualités)
          {
            id: 'sub-amort-periodique',
            name: 'Modalités à Échéances Périodiques',
            code: 'SUB-AMORT-PERIOD',
            categoryL2Id: 'cat-modes-remboursement',
            portfolioL1Id: 'p-modes-remboursement',
            description: "Échéanciers réguliers de capital et intérêts (mensuel, trimestriel, semestriel).",
            metrics: {
              outstanding: 9800000,
              overdue: 1420000,
              count: 610,
              recoveryRate: 84.5,
            },
            products: [
              {
                id: 'prod-credit-amortissable',
                name: 'Crédit amortissable',
                code: 'AMORT-STD',
                categoryL2: 'Mode de remboursement',
                subCategoryL3: 'Modalités à Échéances Périodiques',
                portfolioL1: "Portefeuille Structures d'Amortissement",
                description: 'Remboursement progressif du capital et des intérêts à chaque échéance selon tableau d’amortissement.',
                typicalRepaymentMode: 'Crédit amortissable',
                riskProfile: 'Faible',
                metrics: { outstanding: 7200000, overdue: 980000, count: 480, recoveryRate: 85.2, defaultRate: 8.5 },
              },
              {
                id: 'prod-credit-differe',
                name: 'Crédit avec différé',
                code: 'AMORT-DIFF',
                categoryL2: 'Mode de remboursement',
                subCategoryL3: 'Modalités à Échéances Périodiques',
                portfolioL1: "Portefeuille Structures d'Amortissement",
                description: 'Période initiale de grâce sans remboursement de capital (différé partiel) ou intérêts (différé total).',
                typicalRepaymentMode: 'Crédit avec différé',
                riskProfile: 'Modéré',
                metrics: { outstanding: 2600000, overdue: 440000, count: 130, recoveryRate: 82.0, defaultRate: 12.0 },
              },
            ],
          },
          // NIVEAU 3 : Modalités terminales ou permanentes
          {
            id: 'sub-amort-terminal-permanent',
            name: 'Modalités Terminales, In Fine & Renouvelables',
            code: 'SUB-AMORT-TERM',
            categoryL2Id: 'cat-modes-remboursement',
            portfolioL1Id: 'p-modes-remboursement',
            description: "Remboursement concentré à l'échéance finale ou autorisation permanente d'utilisation.",
            metrics: {
              outstanding: 5800000,
              overdue: 1030000,
              count: 370,
              recoveryRate: 78.0,
            },
            products: [
              {
                id: 'prod-credit-in-fine',
                name: 'Crédit in fine',
                code: 'AMORT-INFINE',
                categoryL2: 'Mode de remboursement',
                subCategoryL3: 'Modalités Terminales, In Fine & Renouvelables',
                portfolioL1: "Portefeuille Structures d'Amortissement",
                description: 'Paiement exclusif des intérêts pendant la durée du crédit, capital remboursé en bloc à l’échéance.',
                typicalRepaymentMode: 'Crédit in fine',
                riskProfile: 'Élevé',
                metrics: { outstanding: 2500000, overdue: 460000, count: 110, recoveryRate: 77.4, defaultRate: 14.2 },
              },
              {
                id: 'prod-credit-echeance-unique',
                name: 'Crédit à échéance unique',
                code: 'AMORT-ECH-UNIQ',
                categoryL2: 'Mode de remboursement',
                subCategoryL3: 'Modalités Terminales, In Fine & Renouvelables',
                portfolioL1: "Portefeuille Structures d'Amortissement",
                description: 'Capital et intérêts dus en un versement unique à une date butoir convenue d’avance.',
                typicalRepaymentMode: 'Crédit à échéance unique',
                riskProfile: 'Modéré',
                metrics: { outstanding: 1900000, overdue: 320000, count: 140, recoveryRate: 80.1, defaultRate: 11.5 },
              },
              {
                id: 'prod-mode-revolving',
                name: 'Crédit revolving',
                code: 'AMORT-REVOLV',
                categoryL2: 'Mode de remboursement',
                subCategoryL3: 'Modalités Terminales, In Fine & Renouvelables',
                portfolioL1: "Portefeuille Structures d'Amortissement",
                description: 'Ligne permanente réutilisable au fur et à mesure des remboursements du principal.',
                typicalRepaymentMode: 'Crédit revolving',
                riskProfile: 'Critique',
                metrics: { outstanding: 1400000, overdue: 250000, count: 120, recoveryRate: 76.8, defaultRate: 16.0 },
              },
            ],
          },
        ],
      },
    ],
  },
];

// Helper functions for easy consumption across components
export function getAllProducts(): ProductL4[] {
  const list: ProductL4[] = [];
  PORTFOLIO_TAXONOMY.forEach((p) => {
    p.categories.forEach((c) => {
      c.subCategories.forEach((s) => {
        list.push(...s.products);
      });
    });
  });
  return list;
}

export function getAllCategories(): CategoryL2[] {
  const list: CategoryL2[] = [];
  PORTFOLIO_TAXONOMY.forEach((p) => {
    list.push(...p.categories);
  });
  return list;
}

export function getAllSubCategories(): SubCategoryL3[] {
  const list: SubCategoryL3[] = [];
  PORTFOLIO_TAXONOMY.forEach((p) => {
    p.categories.forEach((c) => {
      list.push(...c.subCategories);
    });
  });
  return list;
}

export function findProductById(productId: string): ProductL4 | undefined {
  return getAllProducts().find((p) => p.id === productId || p.name.toLowerCase() === productId.toLowerCase());
}

export function filterTaxonomyByLevels(
  portfolioL1?: string,
  categoryL2?: string,
  subCategoryL3?: string,
  productL4?: string
): {
  filteredPortfolios: PortfolioL1[];
  matchedProducts: ProductL4[];
  totalOutstanding: number;
  totalOverdue: number;
  totalCount: number;
} {
  let matched = getAllProducts();

  if (portfolioL1 && portfolioL1 !== 'All') {
    matched = matched.filter(
      (p) => p.portfolioL1.toLowerCase() === portfolioL1.toLowerCase() || p.portfolioL1.includes(portfolioL1)
    );
  }

  if (categoryL2 && categoryL2 !== 'All') {
    matched = matched.filter(
      (p) => p.categoryL2.toLowerCase() === categoryL2.toLowerCase() || p.categoryL2.includes(categoryL2)
    );
  }

  if (subCategoryL3 && subCategoryL3 !== 'All') {
    matched = matched.filter(
      (p) => p.subCategoryL3.toLowerCase() === subCategoryL3.toLowerCase() || p.subCategoryL3.includes(subCategoryL3)
    );
  }

  if (productL4 && productL4 !== 'All') {
    matched = matched.filter(
      (p) => p.name.toLowerCase() === productL4.toLowerCase() || p.id === productL4 || p.code === productL4
    );
  }

  const totalOutstanding = matched.reduce((acc, p) => acc + p.metrics.outstanding, 0);
  const totalOverdue = matched.reduce((acc, p) => acc + p.metrics.overdue, 0);
  const totalCount = matched.reduce((acc, p) => acc + p.metrics.count, 0);

  return {
    filteredPortfolios: PORTFOLIO_TAXONOMY,
    matchedProducts: matched,
    totalOutstanding,
    totalOverdue,
    totalCount,
  };
}
