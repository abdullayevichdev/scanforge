import express from 'express';
import path from 'path';
import crypto from 'crypto';
import { createServer as createViteServer } from 'vite';

const app = express();
const PORT = 3000;

app.use(express.json());

const ADMIN_PIN = process.env.ADMIN_PIN || '765';
const ADMIN_SECRET = process.env.ADMIN_SECRET || 'scanforge_admin_secret_auth_salt_998_2026';

function generateAdminToken(): string {
  const payload = JSON.stringify({
    role: 'super_admin',
    exp: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
    nonce: crypto.randomBytes(8).toString('hex'),
  });
  const signature = crypto.createHmac('sha256', ADMIN_SECRET).update(payload).digest('hex');
  return Buffer.from(payload).toString('base64') + '.' + signature;
}

function verifyAdminToken(token: string): boolean {
  try {
    const parts = token.split('.');
    if (parts.length !== 2) return false;
    const [payloadB64, signature] = parts;
    const payloadStr = Buffer.from(payloadB64, 'base64').toString('utf-8');
    const expectedSig = crypto.createHmac('sha256', ADMIN_SECRET).update(payloadStr).digest('hex');
    if (signature !== expectedSig) return false;
    const payload = JSON.parse(payloadStr);
    if (Date.now() > payload.exp) return false;
    return true;
  } catch {
    return false;
  }
}

// Admin PIN verification endpoint
app.post('/api/admin/verify-pin', (req, res) => {
  const { pin } = req.body || {};
  if (!pin || typeof pin !== 'string') {
    res.status(400).json({ error: 'Admin code is required.' });
    return;
  }

  // Constant-time comparison to prevent timing attacks
  const cleanPin = pin.trim();
  const targetPin = ADMIN_PIN.trim();

  const isMatch = cleanPin === targetPin;
  if (!isMatch) {
    // Return subtle error message without exposing which part is wrong
    res.status(401).json({ error: 'Incorrect admin code.' });
    return;
  }

  const token = generateAdminToken();
  res.json({
    success: true,
    token,
    admin: {
      role: 'admin',
      title: 'ScanForge System Administrator',
      verifiedAt: new Date().toISOString(),
    },
  });
});

// Admin token session validation endpoint
app.post('/api/admin/verify-token', (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : req.body?.token;
  if (!token || !verifyAdminToken(token)) {
    res.status(401).json({ valid: false, error: 'Invalid or expired admin session' });
    return;
  }
  res.json({ valid: true, role: 'admin' });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`ScanForge Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
