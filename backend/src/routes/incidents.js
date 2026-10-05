import { Router } from 'express';
import { IncidentRepo } from '../db/inMemoryDb.js';
import { ok, created, notFound, badRequest, serverError } from '../utils/response.js';

const router = Router();

// GET /api/incidents
router.get('/', (req, res) => {
  try {
    let data = IncidentRepo.getAll();
    if (req.query.status) data = data.filter((i) => i.status === req.query.status.toUpperCase());
    if (req.query.severity) data = data.filter((i) => i.severity === req.query.severity.toUpperCase());
    if (req.query.zone) data = data.filter((i) => i.zone === req.query.zone);
    ok(res, data, { total: data.length });
  } catch (e) {
    serverError(res, e);
  }
});

// GET /api/incidents/:id
router.get('/:id', (req, res) => {
  try {
    const incident = IncidentRepo.getById(req.params.id);
    if (!incident) return notFound(res, `Incident ${req.params.id} not found`);
    ok(res, incident);
  } catch (e) {
    serverError(res, e);
  }
});

// POST /api/incidents  — log a new incident
router.post('/', (req, res) => {
  try {
    const { title, description, zone, severity, category, assignedTo, actionTaken } = req.body;
    if (!title || !description || !zone) return badRequest(res, 'title, description and zone are required');
    const incident = IncidentRepo.create({
      title,
      description,
      zone,
      severity: (severity || 'HIGH').toUpperCase(),
      category: category || 'PPE Non-Compliance',
      assignedTo: assignedTo || 'Shift Safety Lead',
      actionTaken: actionTaken || '',
    });
    created(res, incident);
  } catch (e) {
    serverError(res, e);
  }
});

// PATCH /api/incidents/:id/resolve
router.patch('/:id/resolve', (req, res) => {
  try {
    const incident = IncidentRepo.update(req.params.id, { status: 'RESOLVED' });
    if (!incident) return notFound(res, `Incident ${req.params.id} not found`);
    ok(res, incident);
  } catch (e) {
    serverError(res, e);
  }
});

// PATCH /api/incidents/:id  — generic patch
router.patch('/:id', (req, res) => {
  try {
    const incident = IncidentRepo.update(req.params.id, req.body);
    if (!incident) return notFound(res, `Incident ${req.params.id} not found`);
    ok(res, incident);
  } catch (e) {
    serverError(res, e);
  }
});

export default router;
