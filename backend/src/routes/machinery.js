import { Router } from 'express';
import { MachineryRepo } from '../db/inMemoryDb.js';
import { ok, notFound, serverError } from '../utils/response.js';

const router = Router();

// GET /api/machinery
router.get('/', (req, res) => {
  try {
    let data = MachineryRepo.getAll();
    if (req.query.status) {
      data = data.filter((m) => m.status === req.query.status.toUpperCase());
    }
    ok(res, data, { total: data.length });
  } catch (e) {
    serverError(res, e);
  }
});

// GET /api/machinery/:id
router.get('/:id', (req, res) => {
  try {
    const machine = MachineryRepo.getById(req.params.id);
    if (!machine) return notFound(res, `Machine ${req.params.id} not found`);
    ok(res, machine);
  } catch (e) {
    serverError(res, e);
  }
});

// POST /api/machinery/:id/estop  — mock: trigger E-STOP (hook for real PLC integration)
router.post('/:id/estop', (req, res) => {
  try {
    const machine = MachineryRepo.getById(req.params.id);
    if (!machine) return notFound(res, `Machine ${req.params.id} not found`);
    /**
     * Hook: In production, send MODBUS/OPC-UA command to PLC to cut power circuit.
     * For now this is a mock acknowledgement.
     */
    ok(res, {
      machineId: machine.id,
      machineName: machine.name,
      action: 'EMERGENCY_STOP',
      status: 'ACKNOWLEDGED',
      message: `E-STOP activated on ${machine.name}. Power isolated. Interlocks engaged.`,
      timestamp: new Date().toISOString(),
    });
  } catch (e) {
    serverError(res, e);
  }
});

// POST /api/machinery/:id/diagnose  — mock telemetry diagnostic
router.post('/:id/diagnose', (req, res) => {
  try {
    const machine = MachineryRepo.getById(req.params.id);
    if (!machine) return notFound(res, `Machine ${req.params.id} not found`);
    ok(res, {
      machineId: machine.id,
      diagnosticResult: 'PASS',
      telemetry: machine.telemetry,
      recommendation: machine.status === 'WARNING'
        ? 'Schedule bearing inspection within 24 hours. Lubrication service required.'
        : 'All systems nominal. Next scheduled maintenance as planned.',
      timestamp: new Date().toISOString(),
    });
  } catch (e) {
    serverError(res, e);
  }
});

export default router;
