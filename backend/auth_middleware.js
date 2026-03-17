import jwt from 'jsonwebtoken';

const DEFAULT_SECRET = 'dev-secret-change-me';
const isBypassEnabled = process.env.NODE_ENV !== 'production' && process.env.DISABLE_AUTH_FOR_TESTING === 'true';

export function generateJwt(payload, expiresIn = '7d') {
  const secret = process.env.JWT_SECRET_KEY || DEFAULT_SECRET;
  return jwt.sign(payload, secret, { expiresIn });
}

export function verifyJwt(token) {
  const secret = process.env.JWT_SECRET_KEY || DEFAULT_SECRET;
  return jwt.verify(token, secret);
}

export function requireAuth(req, res, next) {
  const auth = req.headers['authorization'] || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;

  // Prefer real token auth whenever a bearer token is provided.
  if (token) {
    try {
      const decoded = verifyJwt(token);
      req.user = decoded;
      return next();
    } catch {
      return res.status(401).json({ error: 'Invalid token' });
    }
  }

  if (isBypassEnabled) {
    req.user = { id: 'dev-user', role: 'user', email: 'test@snti.local', provider: 'dev-bypass' };
    return next();
  }

  return res.status(401).json({ error: 'Unauthorized' });
}

// Admin guard: allow either ADMIN_API_KEY or valid admin flag in JWT
export function requireAdmin(req, res, next) {
  if (isBypassEnabled) {
    req.admin = { id: 'dev-admin', role: 'admin', email: 'admin@snti.local' };
    return next();
  }

  const auth = req.headers['authorization'] || '';
  const bearer = auth.startsWith('Bearer ') ? auth.slice(7) : '';
  const adminKey = process.env.ADMIN_API_KEY;
  // 1) Static admin API key
  if (adminKey && bearer === adminKey) return next();
  // 2) JWT with admin role
  try {
    const decoded = verifyJwt(bearer);
    if (decoded && decoded.role === 'admin') {
      req.admin = decoded;
      return next();
    }
  } catch {}
  return res.status(401).json({ error: 'Admin authorization required' });
}
