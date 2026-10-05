import { Router } from 'express';
import { AlertRepo } from '../db/inMemoryDb.js';
import { ok, created, notFound, badRequest, serverError } from '../utils/response.js';

const router = Router();

// GET /api/alerts  — list all alerts (optional ?status= filter)
router.get('/', (req, res) => {
  try {
    let data = AlertRepo.getAll();
    if (req.query.status) {
      data = data.filter((a) => a.status === req.query.status.toUpperCase());
    }
    ok(res, data, { total: data.length });
  } catch (e) {
    serverError(res, e);
  }
});

// GET /api/alerts/:id
router.get('/:id', (req, res) => {
  try {
    const alert = AlertRepo.getById(req.params.id);
    if (!alert) return notFound(res, `Alert ${req.params.id} not found`);
    ok(res, alert);
  } catch (e) {
    serverError(res, e);
  }
});

// POST /api/alerts/simulate  — create a random AI-generated alert (mock YOLO)
router.post('/simulate', (req, res) => {
  try {
    const alert = AlertRepo.simulateRandom();
    created(res, alert);
  } catch (e) {
    serverError(res, e);
  }
});

// POST /api/alerts  — create a custom alert
router.post('/', (req, res) => {
  try {
    const { title, description, zone, severity, type, camera, workerId } = req.body;
    if (!title || !zone || !severity) return badRequest(res, 'title, zone and severity are required');
    const alert = AlertRepo.create({
      title,
      description: description || '',
      zone,
      severity: severity.toUpperCase(),
      type: type || 'Manual Alert',
      camera: camera || 'Manual Entry',
      workerId: workerId || 'Unknown',
      confidence: 'N/A',
      timestamp: 'Just now',
      status: 'ACTIVE',
    });
    created(res, alert);
  } catch (e) {
    serverError(res, e);
  }
});

// PATCH /api/alerts/:id/acknowledge
router.patch('/:id/acknowledge', (req, res) => {
  try {
    const alert = AlertRepo.update(req.params.id, { status: 'ACKNOWLEDGED' });
    if (!alert) return notFound(res, `Alert ${req.params.id} not found`);
    ok(res, alert);
  } catch (e) {
    serverError(res, e);
  }
});

// PATCH /api/alerts/:id/resolve
router.patch('/:id/resolve', (req, res) => {
  try {
    const alert = AlertRepo.update(req.params.id, { status: 'RESOLVED' });
    if (!alert) return notFound(res, `Alert ${req.params.id} not found`);
    ok(res, alert);
  } catch (e) {
    serverError(res, e);
  }
});

export default router;
