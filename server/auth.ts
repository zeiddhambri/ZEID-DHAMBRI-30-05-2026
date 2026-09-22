// RecovAI — Authentification applicative (lot P0 sécurité)
// Émission/vérification de jetons HMAC signés, store d'utilisateurs démo avec
// hachage scrypt, rate-limiting du login, middleware requireAuth + requireRole.
//
// NOTE: module de durcissement "P0". En dur en production, remplacer par un
// fournisseur d'identité (OIDC/SAML SSO d'entreprise) et/ou la vérification
// native des JWT Supabase (SUPABASE_JWT_SECRET supporté ci-dessous).

import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { Request, Response, NextFunction } from 'express';
import { db } from './db/dataStore';

export interface AuthUserPayload {
  sub: string;
  email: string;
  name: string;
  role: 'admin' | 'manager' | 'agent';
  iat: number;
  exp: number;
  iss: string;
}

const TOKEN_TTL_SECONDS = 8 * 3600; // 8h de session, non renouvelée côté serveur en P0
const ISSUER = 'recovai-app';

// ---------------- Secret ----------------

const DATA_DIR = path.join(process.cwd(), 'data');
const SECRET_FILE = path.join(DATA_DIR, '.auth-secret');
let cachedSecret: Buffer | null = null;

function loadSecret(): Buffer {
  if (cachedSecret) return cachedSecret;
  const envSecret = (process.env.APP_AUTH_SECRET || '').trim();
  if (envSecret.length >= 32) {
    cachedSecret = Buffer.from(envSecret, 'utf-8');
    return cachedSecret;
  }
  try {
    if (fs.existsSync(SECRET_FILE)) {
      const s = fs.readFileSync(SECRET_FILE, 'utf-8').trim();
      if (/^[0-9a-f]{64}$/i.test(s)) {
        cachedSecret = Buffer.from(s, 'hex');
        return cachedSecret;
      }
    }
  } catch { /* ignore */ }
  const fresh = crypto.randomBytes(32);
  try {
    fs.mkdirSync(DATA_DIR, { recursive: true });
    fs.writeFileSync(SECRET_FILE, fresh.toString('hex'), { mode: 0o600 });
  } catch { /* lecture seule: le secret ne survivra pas au redémarrage */ }
  if (process.env.NODE_ENV === 'production') {
    console.warn('[auth] APP_AUTH_SECRET absent — secret auto-généré. Définir un secret géré (Vault/KMS) en production.');
  }
  cachedSecret = fresh;
  return fresh;
}

// ---------------- Utilisateurs (démo, hachés en mémoire) ----------------

interface StoredUser {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'manager' | 'agent';
  salt: string;
  hash: string;
}

function makeStoredUser(email: string, name: string, role: StoredUser['role'], password: string): StoredUser {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  const id = crypto.createHash('sha256').update(email.toLowerCase()).digest('hex').slice(0, 16);
  return { id, email: email.toLowerCase(), name, role, salt, hash };
}

// Comptes de démonstration : mots de passe surchargeables par variables d'environnement.
// À remplacer par l'annuaire de l'institution (SSO) avant tout essai pilote.
const SEED_USERS: StoredUser[] = [
  makeStoredUser('admin@recovai.tn', 'Administrateur (Démo)', 'admin', process.env.DEMO_ADMIN_PASSWORD || 'RecovAI#Admin!2026'),
  makeStoredUser('directeur@recovai.tn', 'Directeur des Risques (Démo)', 'manager', process.env.DEMO_MANAGER_PASSWORD || 'RecovAI#Manager!2026'),
  makeStoredUser('agent@recovai.tn', 'Agent de Recouvrement (Démo)', 'agent', process.env.DEMO_AGENT_PASSWORD || 'RecovAI#Agent!2026'),
];

export function findUserByEmail(email: string): StoredUser | undefined {
  return SEED_USERS.find(u => u.email === email.toLowerCase().trim());
}

export function verifyPassword(user: StoredUser, password: string): boolean {
  try {
    const candidate = crypto.scryptSync(password, user.salt, 64);
    const stored = Buffer.from(user.hash, 'hex');
    return candidate.length === stored.length && crypto.timingSafeEqual(candidate, stored);
  } catch {
    return false;
  }
}

// ---------------- Jetons ----------------

function b64url(input: Buffer | string): string {
  return Buffer.from(input).toString('base64url');
}

export function signToken(user: { id: string; email: string; name: string; role: StoredUser['role'] }, ttlSeconds: number = TOKEN_TTL_SECONDS): { token: string; expiresAt: number } {
  const now = Math.floor(Date.now() / 1000);
  const payload: AuthUserPayload = {
    sub: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    iat: now,
    exp: now + ttlSeconds,
    iss: ISSUER,
  };
  const body = b64url(JSON.stringify(payload));
  const sig = crypto.createHmac('sha256', loadSecret()).update(body).digest();
  return { token: `${body}.${b64url(sig)}`, expiresAt: (now + ttlSeconds) * 1000 };
}

export function verifyToken(token: string): AuthUserPayload | null {
  if (!token) return null;
  const parts = token.split('.');
  if (parts.length !== 2) return null;
  const [body, sig] = parts;
  const expected = crypto.createHmac('sha256', loadSecret()).update(body).digest();
  let provided: Buffer;
  try { provided = Buffer.from(sig, 'base64url'); } catch { return null; }
  if (provided.length !== expected.length || !crypto.timingSafeEqual(provided, expected)) return null;
  let payload: AuthUserPayload;
  try { payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf-8')); } catch { return null; }
  if (!payload || payload.iss !== ISSUER) return null;
  if (typeof payload.exp !== 'number' || payload.exp * 1000 < Date.now()) return null;
  return payload;
}

// Vérification optionnelle d'un JWT Supabase (HS256) si SUPABASE_JWT_SECRET est fourni.
function verifySupabaseJwt(jwt: string): AuthUserPayload | null {
  const secret = (process.env.SUPABASE_JWT_SECRET || '').trim();
  if (!secret || jwt.split('.').length !== 3) return null;
  const [h, b, s] = jwt.split('.');
  const expected = crypto.createHmac('sha256', secret).update(`${h}.${b}`).digest();
  let provided: Buffer;
  try { provided = Buffer.from(s, 'base64url'); } catch { return null; }
  if (provided.length !== expected.length || !crypto.timingSafeEqual(provided, expected)) return null;
  let claims: any;
  try { claims = JSON.parse(Buffer.from(b, 'base64url').toString('utf-8')); } catch { return null; }
  if (!claims || (claims.aud && claims.aud !== 'authenticated')) return null;
  if (typeof claims.exp === 'number' && claims.exp * 1000 < Date.now()) return null;
  const roleRaw = claims.role || claims.app_metadata?.role;
  const role: AuthUserPayload['role'] =
    roleRaw === 'admin' || roleRaw === 'manager' ? roleRaw : 'agent';
  return {
    sub: String(claims.sub || 'supabase-user'),
    email: String(claims.email || 'utilisateur@supabase'),
    name: String(claims.user_metadata?.full_name || claims.email || 'Utilisateur'),
    role,
    iat: claims.iat ?? 0,
    exp: claims.exp ?? Math.floor(Date.now() / 1000) + 3600,
    iss: 'supabase',
  };
}

export function authenticateRequest(rawToken: string | undefined): AuthUserPayload | null {
  if (!rawToken) return null;
  // Jeton de démonstration : accepté UNIQUEMENT si le serveur est explicitement
  // lancé avec ALLOW_DEMO_TOKEN=1 (environnement de présentation isolé).
  if (process.env.ALLOW_DEMO_TOKEN === '1' && rawToken === 'demo-mode-token') {
    return {
      sub: 'demo-user-id',
      email: 'demo@recovai.local',
      name: 'Session de démonstration',
      role: 'admin',
      iat: 0,
      exp: Math.floor(Date.now() / 1000) + 86400,
      iss: 'recovai-demo',
    };
  }
  return verifyToken(rawToken) ?? verifySupabaseJwt(rawToken);
}

// ---------------- Middlewares Express ----------------

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request { auth?: AuthUserPayload }
  }
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7).trim() : '';
  const auth = authenticateRequest(token);
  if (!auth) {
    return res.status(401).json({ error: 'Authentification requise', code: 'UNAUTHORIZED' });
  }
  req.auth = auth;
  next();
}

export function requireRole(...roles: AuthUserPayload['role'][]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.auth) {
      return res.status(401).json({ error: 'Authentification requise', code: 'UNAUTHORIZED' });
    }
    if (!roles.includes(req.auth.role)) {
      audit('ACCESS_DENIED', `Accès refusé (rôle ${req.auth.role}) à ${req.method} ${req.originalUrl}`, req.auth);
      return res.status(403).json({ error: 'Privilèges insuffisants pour cette opération', code: 'FORBIDDEN' });
    }
    next();
  };
}

// ---------------- Rate limiting (fenêtre glissante, en mémoire) ----------------

interface Bucket { count: number; resetAt: number }
const buckets = new Map<string, Bucket>();

export function rateLimit(maxPerWindow: number, windowMs: number) {
  return (req: Request, res: Response, next: NextFunction) => {
    const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || req.ip || 'inconnu';
    const key = `${ip}`;
    const now = Date.now();
    const current = buckets.get(key);
    if (!current || current.resetAt <= now) {
      buckets.set(key, { count: 1, resetAt: now + windowMs });
      return next();
    }
    current.count += 1;
    if (current.count > maxPerWindow) {
      return res.status(429).json({ error: 'Trop de requêtes. Réessayez ultérieurement.', code: 'RATE_LIMITED' });
    }
    next();
  };
}

// Nettoyage périodique des buckets (évite une croissance non bornée).
setInterval(() => {
  const now = Date.now();
  for (const [k, v] of buckets.entries()) if (v.resetAt <= now) buckets.delete(k);
}, 60_000).unref?.();

export const loginRateLimit = rateLimit(8, 5 * 60_000); // 8 tentatives / 5 min / IP

// ---------------- Audit journal (P0 : auteur + horodatage + chaînage) ----------------

export function audit(action: string, details: string, actor?: { email?: string; role?: string } | null) {
  try {
    const logs = db.getAuditLogs();
    const prevHash = logs[0]?.hash || 'GENESIS';
    const entry = {
      id: `aud-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      action,
      details,
      actor: actor?.email || 'system',
      actorRole: actor?.role || 'system',
      timestamp: new Date().toISOString(),
    };
    const hash = crypto.createHash('sha256').update(prevHash + JSON.stringify(entry)).digest('hex').slice(0, 32);
    logs.unshift({ ...entry, prevHash, hash });
    // Limite simple du journal de démo (P1: journal dédié en base avec rétention).
    if (logs.length > 5000) logs.length = 5000;
    db.save();
  } catch (e) {
    console.warn('[audit] journalisation échouée:', (e as Error).message);
  }
}
