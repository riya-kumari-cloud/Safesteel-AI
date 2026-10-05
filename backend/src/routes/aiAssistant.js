import { Router } from 'express';
import { analyzeTextWithAI } from '../services/aiService.js';
import { ok, badRequest, serverError } from '../utils/response.js';

const router = Router();

// POST /api/ai-assistant/query
router.post('/query', async (req, res) => {
  try {
    const { query } = req.body;
    if (!query || !query.trim()) return badRequest(res, 'query is required');

    const start = Date.now();
    const answer = await analyzeTextWithAI(query, 'safety-assistant');
    const latencyMs = Date.now() - start;

    ok(res, {
      query,
      answer,
      model: process.env.GEMINI_API_KEY ? 'gemini-pro' : 'SafeSteel-Copilot-Mock-v1',
      latencyMs,
      timestamp: new Date().toISOString(),
    });
  } catch (e) {
    serverError(res, e);
  }
});

export default router;
