import jwt from 'jsonwebtoken';

const DEFAULT_SECRET = 'dev-secret-change-me';

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
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const decoded = verifyJwt(token);
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

// Admin guard: allow either ADMIN_API_KEY or valid admin flag in JWT
export function requireAdmin(req, res, next) {
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
