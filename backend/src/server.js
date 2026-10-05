import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import connectDB from './db/mongoDb.js';

import authRouter from './routes/auth.js';
import statsRouter from './routes/stats.js';
import alertsRouter from './routes/alerts.js';
import incidentsRouter from './routes/incidents.js';
import ppeRouter from './routes/ppe.js';
import machineryRouter from './routes/machinery.js';
import aiAssistantRouter from './routes/aiAssistant.js';
import reportsRouter from './routes/reports.js';

// Connect to MongoDB (or mock if not provided)
connectDB();

const app = express();
const PORT = process.env.PORT || 5001;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(helmet());
app.use(
  cors({
    origin: [FRONTEND_URL, 'http://localhost:5173', 'http://localhost:5174', 'http://localhost:4173'],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Request logger (development)
if (process.env.NODE_ENV !== 'production') {
  app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
  });
}

// ─── Routes ───────────────────────────────────────────────────────────────────
import { protect, admin } from './middleware/authMiddleware.js';

app.use('/api/auth', authRouter);
app.use('/api/stats', protect, statsRouter);
app.use('/api/alerts', protect, alertsRouter);
app.use('/api/incidents', protect, incidentsRouter);
app.use('/api/ppe', protect, ppeRouter);
app.use('/api/machinery', protect, machineryRouter);
app.use('/api/ai-assistant', protect, aiAssistantRouter);
app.use('/api/reports', protect, admin, reportsRouter);

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'SafeSteel AI Backend',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    db: 'in-memory (MongoDB-ready)',
  });
});

// Root
app.get('/', (req, res) => {
  res.json({
    message: 'SafeSteel AI API',
    version: '1.0.0',
    endpoints: [
      'GET  /health',
      'GET  /api/stats',
      'GET  /api/alerts',
      'POST /api/alerts',
      'POST /api/alerts/simulate',
      'PATCH /api/alerts/:id/acknowledge',
      'PATCH /api/alerts/:id/resolve',
      'GET  /api/incidents',
      'POST /api/incidents',
      'PATCH /api/incidents/:id/resolve',
      'GET  /api/ppe',
      'POST /api/ppe/analyze',
      'GET  /api/machinery',
      'POST /api/machinery/:id/estop',
      'POST /api/machinery/:id/diagnose',
      'POST /api/ai-assistant/query',
      'GET  /api/reports/compliance-trends',
      'GET  /api/reports/audit-checks',
      'POST /api/reports/generate',
    ],
  });
});

// ─── 404 Handler ─────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, error: `Route ${req.method} ${req.url} not found` });
});

// ─── Global Error Handler ─────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('[Unhandled Error]', err);
  res.status(500).json({ success: false, error: 'Internal server error' });
});

// ─── Start ────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🏭 SafeSteel AI Backend running on http://localhost:${PORT}`);
  console.log(`📡 Accepting requests from: ${FRONTEND_URL}`);
  console.log(`🗄️  Database: In-Memory (MongoDB-ready architecture)`);
  console.log(`✅ All API routes registered\n`);
});
