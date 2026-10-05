import { Router } from 'express';
import { PpeRepo } from '../db/inMemoryDb.js';
import { ok, created, serverError } from '../utils/response.js';

const router = Router();

// GET /api/ppe  — list all PPE detection records
router.get('/', (req, res) => {
  try {
    let data = PpeRepo.getAll();
    if (req.query.status) data = data.filter((r) => r.status === req.query.status.toUpperCase());
    if (req.query.camera) data = data.filter((r) => r.camera === req.query.camera);
    ok(res, data, { total: data.length });
  } catch (e) {
    serverError(res, e);
  }
});

// POST /api/ppe  — create a PPE detection record (from edge inference)
router.post('/', (req, res) => {
  try {
    /**
     * Mock service hook — in production this would be called by the YOLO edge node.
     * Replace this body with a call to the real inference service result.
     */
    const record = PpeRepo.create({ ...req.body });
    created(res, record);
  } catch (e) {
    serverError(res, e);
  }
});

// POST /api/ppe/analyze  — mock: simulate YOLO inference on an image
router.post('/analyze', (req, res) => {
  try {
    // Mock inference result — wire up real YOLO model here later
    const mockResult = {
      inferenceMs: Math.floor(15 + Math.random() * 10),
      detections: PpeRepo.getAll(),
      summary: {
        totalPersonsDetected: 2,
        compliant: 5,
        violations: 1,
        complianceRate: '83.3%',
      },
    };
    ok(res, mockResult);
  } catch (e) {
    serverError(res, e);
  }
});

export default router;
