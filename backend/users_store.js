import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const dataDir = path.join(__dirname, 'data');
const usersFile = path.join(dataDir, 'users.json');

async function ensureDataFiles() {
  try { await fs.mkdir(dataDir, { recursive: true }); } catch {}
  try { await fs.access(usersFile); }
  catch { await fs.writeFile(usersFile, JSON.stringify([], null, 2)); }
}

export async function getAllUsers() {
  await ensureDataFiles();
  const raw = await fs.readFile(usersFile, 'utf8');
  return JSON.parse(raw);
}

export async function findUserByEmail(email) {
  const users = await getAllUsers();
  return users.find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
}

function sanitizeUser(user) {
  if (!user) return null;

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone || null,
    rollNumber: user.rollNumber || null,
    institution: user.institution || null,
    avatar: user.avatar || null,
    authProvider: user.authProvider || 'local',
    createdAt: user.createdAt,
    lastLoginAt: user.lastLoginAt || null,
  };
}

export async function createUser({ name, email, password, phone, rollNumber }) {
  await ensureDataFiles();
  const users = await getAllUsers();
  const exists = users.some(u => u.email.toLowerCase() === email.toLowerCase());
  if (exists) {
    throw new Error('Email already registered');
  }
  const passwordHash = await bcrypt.hash(password, 10);
  const user = {
    id: uuidv4(),
    name: name.trim(),
    email: email.trim().toLowerCase(),
    phone: phone ? phone.trim() : null,
    rollNumber: rollNumber ? rollNumber.trim() : null,
    institution: null,
    authProvider: 'local',
    googleId: null,
    avatar: null,
    assessments: [],
    passwordHash,
    createdAt: new Date().toISOString(),
    lastLoginAt: null
  };
  users.push(user);
  await fs.writeFile(usersFile, JSON.stringify(users, null, 2));
  return sanitizeUser(user);
}

export async function upsertGoogleUser({ googleId, email, name, avatar }) {
  await ensureDataFiles();
  const users = await getAllUsers();
  const normalizedEmail = (email || '').trim().toLowerCase();
  let user = users.find((u) => u.email.toLowerCase() === normalizedEmail);

  if (!user) {
    user = {
      id: uuidv4(),
      name: (name || 'Google User').trim(),
      email: normalizedEmail,
      phone: null,
      rollNumber: null,
      institution: null,
      authProvider: 'google',
      googleId: googleId || null,
      avatar: avatar || null,
      assessments: [],
      passwordHash: null,
      createdAt: new Date().toISOString(),
      lastLoginAt: null,
    };
    users.push(user);
  } else {
    user.name = (name || user.name || 'Google User').trim();
    user.authProvider = 'google';
    user.googleId = googleId || user.googleId || null;
    user.avatar = avatar || user.avatar || null;
    if (!Array.isArray(user.assessments)) user.assessments = [];
  }

  user.lastLoginAt = new Date().toISOString();

  const idx = users.findIndex((u) => u.id === user.id);
  if (idx !== -1) users[idx] = user;
  await fs.writeFile(usersFile, JSON.stringify(users, null, 2));

  return sanitizeUser(user);
}

export async function updateUserProfile(email, profile = {}) {
  if (!email) throw new Error('Email is required to update profile');

  const users = await getAllUsers();
  const normalizedEmail = email.trim().toLowerCase();
  const idx = users.findIndex((u) => u.email.toLowerCase() === normalizedEmail);
  if (idx === -1) throw new Error('User not found');

  const nextPhone = typeof profile.phone === 'string' ? profile.phone.trim() : users[idx].phone;
  const nextRollNumber = typeof profile.rollNumber === 'string' ? profile.rollNumber.trim() : users[idx].rollNumber;
  const nextInstitution = typeof profile.institution === 'string' ? profile.institution.trim() : users[idx].institution;

  users[idx] = {
    ...users[idx],
    phone: nextPhone || null,
    rollNumber: nextRollNumber || null,
    institution: nextInstitution || null,
    updatedAt: new Date().toISOString(),
  };

  await fs.writeFile(usersFile, JSON.stringify(users, null, 2));
  return sanitizeUser(users[idx]);
}

export async function saveUserAssessmentResult(email, assessment) {
  if (!email) throw new Error('Email is required to save assessment result');
  const users = await getAllUsers();
  const normalizedEmail = email.trim().toLowerCase();
  const idx = users.findIndex((u) => u.email.toLowerCase() === normalizedEmail);
  if (idx === -1) throw new Error('User not found');

  const now = new Date().toISOString();
  const nextAssessment = {
    id: assessment.id || `ASM-${Date.now().toString(36).toUpperCase()}`,
    mbtiType: assessment.mbtiType,
    track: assessment.track || null,
    age: assessment.age ?? null,
    riskTier: assessment.riskTier || 'GREEN',
    dimensionScores: assessment.dimensionScores || {},
    traitScores: assessment.traitScores || {},
    borderlines: assessment.borderlines || [],
    mentalHealth: assessment.mentalHealth || null,
    source: assessment.source || 'SNTI Assessment',
    createdAt: assessment.createdAt || now,
    updatedAt: now,
  };

  if (!Array.isArray(users[idx].assessments)) users[idx].assessments = [];
  users[idx].assessments.push(nextAssessment);
  users[idx].lastAssessment = {
    mbtiType: nextAssessment.mbtiType,
    riskTier: nextAssessment.riskTier,
    createdAt: nextAssessment.createdAt,
  };

  await fs.writeFile(usersFile, JSON.stringify(users, null, 2));
  return nextAssessment;
}

export async function getLatestAssessmentByEmail(email) {
  if (!email) return null;
  const user = await findUserByEmail(email);
  if (!user || !Array.isArray(user.assessments) || user.assessments.length === 0) return null;

  return [...user.assessments].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))[0];
}

export async function verifyUser(email, password) {
  const user = await findUserByEmail(email);
  if (!user) return null;
  if (!user.passwordHash) return null;
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return null;
  user.lastLoginAt = new Date().toISOString();
  const users = await getAllUsers();
  const idx = users.findIndex(u => u.id === user.id);
  if (idx !== -1) {
    users[idx] = user;
    await fs.writeFile(usersFile, JSON.stringify(users, null, 2));
  }
  return sanitizeUser(user);
}
