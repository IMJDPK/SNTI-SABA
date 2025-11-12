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

export async function createUser({ name, email, password }) {
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
    passwordHash,
    createdAt: new Date().toISOString(),
    lastLoginAt: null
  };
  users.push(user);
  await fs.writeFile(usersFile, JSON.stringify(users, null, 2));
  return { id: user.id, name: user.name, email: user.email, createdAt: user.createdAt };
}

export async function verifyUser(email, password) {
  const user = await findUserByEmail(email);
  if (!user) return null;
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return null;
  user.lastLoginAt = new Date().toISOString();
  const users = await getAllUsers();
  const idx = users.findIndex(u => u.id === user.id);
  if (idx !== -1) {
    users[idx] = user;
    await fs.writeFile(usersFile, JSON.stringify(users, null, 2));
  }
  return { id: user.id, name: user.name, email: user.email, createdAt: user.createdAt, lastLoginAt: user.lastLoginAt };
}
