imjd@imjd:~/Documents/CHATIMJD 2025/SNTI SABA/backend$ cd /home/imjd/Documents/CHATIMJD\ 2025/SNTI\ SABA/backend && node index.js
node:events:495
      throw er; // Unhandled 'error' event
      ^

Error: listen EADDRINUSE: address already in use :::3001
    at Server.setupListenHandle [as _listen2] (node:net:1811:16)
    at listenInCluster (node:net:1859:12)
    at Server.listen (node:net:1947:7)
    at file:///home/imjd/Documents/CHATIMJD%202025/SNTI%20SABA/backend/index.js:148:8
    at ModuleJob.run (node:internal/modules/esm/module_job:195:25)
    at async ModuleLoader.import (node:internal/modules/esm/loader:336:24)
    at async loadESM (node:internal/process/esm_loader:34:7)
    at async handleMainPromise (node:internal/modules/run_main:106:12)
Emitted 'error' event on Server instance at:
    at emitErrorNT (node:net:1838:8)
    at process.processTicksAndRejections (node:internal/process/task_queues:82:21) {
  code: 'EADDRINUSE',
  errno: -98,
  syscall: 'listen',
  address: '::',
  port: 3001
}

Node.js v18.19.1import express from 'express';
import multer from 'multer';
import path from 'path';
import { promises as fs } from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const router = express.Router();

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configure multer for PDF uploads
const storage = multer.diskStorage({
    destination: path.join(__dirname, '../uploads/pdfs'),
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/pdf') {
            cb(null, true);
        } else {
            cb(new Error('Only PDF files are allowed'));
        }
    }
});

// Ensure upload directory exists
const createUploadDir = async () => {
    const dir = path.join(__dirname, '../uploads/pdfs');
    await fs.mkdir(dir, { recursive: true });
};

createUploadDir().catch(console.error);

// Placeholder route
router.get('/', (req, res) => {
    res.json({ message: 'PDF Training API is working' });
});

// Routes
router.post('/upload', upload.single('pdf'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No PDF file uploaded' });
        }
        res.json({ 
            message: 'PDF uploaded successfully',
            filename: req.file.filename
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to upload PDF' });
    }
});

export default router;
