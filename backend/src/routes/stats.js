import { Router } from 'express';
import { StatsRepo } from '../db/inMemoryDb.js';
import { ok } from '../utils/response.js';

const router = Router();

// GET /api/stats
router.get('/', (req, res) => {
  ok(res, StatsRepo.get());
});

export default router;
