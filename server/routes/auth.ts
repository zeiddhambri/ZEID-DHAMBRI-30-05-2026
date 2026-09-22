import { Router } from 'express';
import { findUserByEmail, verifyPassword, signToken, loginRateLimit, requireAuth, audit } from '../auth';
import { validate, loginSchema } from '../validation';

const router = Router();

// POST /api/auth/login — unique point d'entrée d'authentification du backend.
router.post('/login', loginRateLimit, validate(loginSchema), (req, res) => {
  const { email, password } = req.body;
  const user = findUserByEmail(email);
  if (!user || !verifyPassword(user, password)) {
    audit('LOGIN_FAILED', `Échec d'authentification pour « ${email} »`, null);
    // Message générique : ne pas révéler si l'adresse existe.
    return res.status(401).json({ error: 'Identifiants invalides' });
  }
  const { token, expiresAt } = signToken({ id: user.id, email: user.email, name: user.name, role: user.role, institution: user.institution });
  audit('LOGIN_SUCCESS', `Connexion réussie`, { email: user.email, role: user.role });
  res.json({
    token,
    expiresAt,
    user: { id: user.id, email: user.email, name: user.name, role: user.role, institution: user.institution ?? null },
  });
});

// GET /api/auth/me — session courante (utilisé par le front pour valider le jeton).
router.get('/me', requireAuth, (req, res) => {
  const auth = req.auth!;
  res.json({ user: { id: auth.sub, email: auth.email, name: auth.name, role: auth.role, institution: auth.institution ?? null }, expiresAt: auth.exp * 1000 });
});

export default router;
