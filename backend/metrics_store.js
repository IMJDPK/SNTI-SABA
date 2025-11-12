import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const dataDir = path.join(__dirname, 'data');
const metricsFile = path.join(dataDir, 'metrics.json');

async function ensureMetricsFile() {
  try { await fs.mkdir(dataDir, { recursive: true }); } catch {}
  try { await fs.access(metricsFile); }
  catch { await fs.writeFile(metricsFile, JSON.stringify({ totalUsers: 0, totalTestsStarted: 0, totalTestsCompleted: 0 }, null, 2)); }
}

export async function getMetrics() {
  await ensureMetricsFile();
  const raw = await fs.readFile(metricsFile, 'utf8');
  return JSON.parse(raw);
}

async function saveMetrics(m) {
  await fs.writeFile(metricsFile, JSON.stringify(m, null, 2));
}

export async function incrementCounter(key, delta = 1) {
  const m = await getMetrics();
  m[key] = (m[key] || 0) + delta;
  if (m[key] < 0) m[key] = 0;
  await saveMetrics(m);
  return m;
}

export async function setTotalUsers(count) {
  const m = await getMetrics();
  m.totalUsers = count;
  await saveMetrics(m);
  return m;
}
