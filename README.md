# RecovAI — Plateforme de recouvrement, contentieux et risque crédit (Tunisie)

Application web couvrant le cycle de vie de la créance pour les **banques, sociétés de leasing/factoring et institutions de microfinance** : pré-octroi & provisionnement IFRS 9 (aide à la décision), recouvrement amiable multi-canal, escalade hiérarchique, contentieux judiciaire (avocats, huissiers, audiences, pièces), pilotage et reporting.

> ⚠️ **Statut : prototype durci « lot P0 ».** Adapté aux démonstrations commerciales sur **données synthétiques**. Ne doit **pas** être exposé à des données réelles d'établissement avant les lots P1/P2 (voir le plan de durcissement ci-dessous).

## Architecture

```
┌─────────────────────────────┐      ┌───────────────────────────────────────────┐
│ Front React 18 + Vite       │ ───► │ Backend Express (server.ts, port 3000)    │
│ + Tailwind + shadcn/ui      │ HTTP │  /api/auth   login (rate-limited)         │
│ src/                        │      │  /api/*      routes métier protégées JWT  │
│  - services/api.ts (client  │      │  /rest/v1    compat. PostgREST protégée   │
│    typé, Bearer auto)       │      │  /api/audit  journal (manager/admin)      │
└─────────────────────────────┘      └───────────────────────────────────────────┘
                                              │ (P0 : store JSON de démo)
                                              ▼
                                   ┌─────────────────────────┐   ┌──────────────────────────┐
                                   │ data/recovai_db.json    │   │ Supabase (voie cible P1) │
                                   │ (gitignoré, démo seule.)│   │ Postgres + RLS + Storage │
                                   └─────────────────────────┘   └──────────────────────────┘
```

- `supabase/functions/*` — fonctions Edge (extraction documentaire IA, note de crédit, moteur IFRS 9) ; **ne décident jamais** : elles produisent des recommandations explicables soumises à validation humaine.
- Les imports de documents (XLSX/CSV/PDF/DOCX) sont extraits **dans le navigateur** (`src/lib/file-extract.ts`) avant toute transmission structurée.

## Sécurité — posture actuelle (lot P0, sept. 2026)

| Contrôle | État |
|---|---|
| Authentification de l'API (jeton signé HMAC-SHA256, expiration 8 h) | ✅ `/api/auth/login`, `requireAuth` sur toutes les routes métier |
| Mots de passe hachés (scrypt, sel aléatoire), comparaison à temps constant | ✅ |
| RBAC serveur par rôle (`admin` / `manager` / `agent`) sur les actes sensibles (suppression dossier, modèles, règles d'escalade, institutions) | ✅ |
| Journal d'audit avec auteur, horodatage et chaînage de hash, consultable via `GET /api/audit` (manager/admin) | ✅ (v1 démo) |
| Limitation de débit (8 tentatives de login / 5 min / IP ; 300 req/min globales) | ✅ |
| CORS par allowlist (`ALLOWED_ORIGINS`), en-têtes `nosniff`/`DENY`/`no-referrer`, body JSON borné | ✅ |
| Validation zod de tous les corps d'écriture (400 + détails d'erreur) | ✅ (routes critiques) |
| Mode démo explicite (`VITE_DEMO_MODE=1` + `ALLOW_DEMO_TOKEN=1`), **sans contournement de mot de passe** ; bandeau « données synthétiques » permanent | ✅ |
| Données de démonstration 100 % synthétiques (entités marquées DEMO/SYNTH, téléphones/e-mails fictifs `example.test`) | ✅ |
| Chiffrement au repos, SSO (OIDC/SAML), MFA, isolation multi-institution au niveau base (RLS par `institution_id`), audit immuable en base + export SIEM, connecteurs batch (SFTP/MT940), pentest externe, ISO 27001 | 🔜 Lots P1/P2 — plan détaillé : `docs/ANALYSE-PRESENTATION-INSTITUTIONS-FINANCIERES.md` |

**Conformité** : l'outil est une **assistance** aux référentiels (circulaire BCT 2013-21 de classification/déclassement, IFRS 9 ECL, loi organique 2004-63 sur les données personnelles). Il ne prétend à aucune certification ; les responsables de traitement restent les établissements utilisateurs.

## Démarrage

```bash
npm install
cp .env.example .env          # renseigner GEMINI_API_KEY si besoin (sinon les aides IA renvoient un message explicite « non configurée »)

# Démo commerciale (environnement isolé, données synthétiques) :
#   dans .env : VITE_DEMO_MODE=1 et ALLOW_DEMO_TOKEN=1
npm run dev                   # http://localhost:3000
```

Comptes backend de démonstration (mots de passe par défaut, surchargeables via `DEMO_*_PASSWORD`) :

| Rôle | Email | Mot de passe |
|---|---|---|
| Agent | `agent@recovai.tn` | `RecovAI#Agent!2026` |
| Directeur (manager) | `directeur@recovai.tn` | `RecovAI#Manager!2026` |
| Admin | `admin@recovai.tn` | `RecovAI#Admin!2026` |

> À remplacer par l'annuaire/SSO de l'institution avant tout pilote. Ne jamais laisser ces comptes sur une instance accessible hors démo.

## Production

```bash
npm run build && NODE_ENV=production npm start
```

Variables d'environnement (voir `.env.example`) : `APP_AUTH_SECRET` (secret de signature, à gérer via Vault/KMS), `ALLOWED_ORIGINS`, `PORT`, `GEMINI_API_KEY`, `SUPABASE_JWT_SECRET` (vérification des jetons Supabase si utilisée).

## Qualité

```bash
npm run lint     # ESLint
npm run test     # Vitest (unités : auth, RBAC, validation, audit, moteur ECL)
```

Tests de bout en bout Playwright et CI (lint+typecheck+tests+SCA) : planifiés lot P1.8.

## Documentation

- `docs/ANALYSE-PRESENTATION-INSTITUTIONS-FINANCIERES.md` — audit complet (forces, faiblesses, roadmap impact×effort) et préparation à la présentation devant un comité bancaire.
- `supabase/migrations/` — schéma Postgres cible (RLS, rôles, storage).
- `src/services/api.ts` — contrat d'API côté client ; l'OpenAPI complet est prévu lot P1.

## Licence / contact

Projet commercial — tous droits réservés.
