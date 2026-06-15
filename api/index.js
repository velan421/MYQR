import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import cors from 'cors';
import pg from 'pg';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// --- Environment setup ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load backend/.env first (has DATABASE_URL for local dev)
dotenv.config({ path: path.resolve(__dirname, '..', 'backend', '.env') });
// Also load root .env (won't overwrite existing vars)
dotenv.config();

const { Pool } = pg;

const app = express();
app.use(cors());
app.use(express.json());

// --- Database connection ---
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : undefined,
});

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key';

// Middleware to authenticate token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Forbidden' });
    req.user = user;
    next();
  });
};

// --- AUTH ENDPOINTS ---

app.post('/api/auth/signup', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    const existing = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (existing.rows.length > 0) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    const hash = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id',
      [email, hash]
    );

    const userId = result.rows[0].id;
    // Create empty profile
    await pool.query(
      'INSERT INTO profiles (user_id) VALUES ($1)',
      [userId]
    );

    res.status(200).json({ error: null });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    const user = result.rows[0];
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
    res.status(200).json({ token, user: { id: user.id, email: user.email } });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/auth/me', authenticateToken, async (req, res) => {
  try {
    const userResult = await pool.query('SELECT id, email FROM users WHERE id = $1', [req.user.id]);
    const profileResult = await pool.query('SELECT * FROM profiles WHERE user_id = $1', [req.user.id]);

    if (userResult.rows.length === 0 || profileResult.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    const user = userResult.rows[0];
    const profile = profileResult.rows[0];

    res.status(200).json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        phone: profile.phone,
        patientRecord: profile.patient_record,
        privacySettings: profile.privacy_settings,
        notifications: profile.notifications
      }
    });
  } catch (error) {
    console.error('Auth/me error:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

app.get('/api/auth/status', async (req, res) => {
  const email = req.query.email;
  try {
    const result = await pool.query('SELECT is_verified FROM users WHERE email = $1', [email]);
    if (result.rows.length > 0) {
      res.status(200).json({ isVerified: result.rows[0].is_verified });
    } else {
      res.status(200).json({ isVerified: false });
    }
  } catch (error) {
    console.error('Status error:', error);
    res.status(500).json({ error: 'Server Error' });
  }
});

app.post('/api/auth/resend', async (req, res) => {
  res.status(200).json({ error: null }); // Mock implementation for resend email
});


// --- PROFILE ENDPOINTS ---

app.put('/api/profiles/me', authenticateToken, async (req, res) => {
  const { phone, patientRecord, privacySettings, notifications } = req.body;
  try {
    await pool.query(
      `UPDATE profiles 
       SET phone = $1, patient_record = $2, privacy_settings = $3, notifications = $4, updated_at = CURRENT_TIMESTAMP
       WHERE user_id = $5`,
      [phone, patientRecord, privacySettings, notifications, req.user.id]
    );
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/profiles/onboarding', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query('SELECT onboarding_complete FROM profiles WHERE user_id = $1', [req.user.id]);
    if (result.rows.length > 0) {
      res.status(200).json({ onboardingComplete: result.rows[0].onboarding_complete });
    } else {
      res.status(200).json({ onboardingComplete: false });
    }
  } catch (error) {
    console.error('Onboarding get error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/api/profiles/onboarding', authenticateToken, async (req, res) => {
  try {
    await pool.query('UPDATE profiles SET onboarding_complete = TRUE WHERE user_id = $1', [req.user.id]);
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Onboarding set error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/api/records/:qrId', async (req, res) => {
  const { qrId } = req.params;
  const { patientRecord, privacySettings } = req.body;

  try {
    // Find profile by qrId using jsonb search
    const result = await pool.query(
      `SELECT user_id FROM profiles WHERE patient_record->>'qrId' = $1`,
      [qrId]
    );

    if (result.rows.length > 0) {
      const userId = result.rows[0].user_id;
      await pool.query(
        `UPDATE profiles SET patient_record = $1, privacy_settings = $2 WHERE user_id = $3`,
        [patientRecord, privacySettings, userId]
      );
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Records error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// --- Start server for local development ---
const PORT = process.env.PORT || 5000;

// Only start listening when running directly (not on Vercel)
if (process.env.VERCEL !== '1') {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// Export for Vercel serverless function
export default app;
