import { Router } from 'express';
import { ReportsRepo } from '../db/inMemoryDb.js';
import { ok, serverError } from '../utils/response.js';

const router = Router();

// GET /api/reports/compliance-trends
router.get('/compliance-trends', (req, res) => {
  try {
    ok(res, ReportsRepo.getComplianceTrends());
  } catch (e) {
    serverError(res, e);
  }
});

// GET /api/reports/plant-zones
router.get('/plant-zones', (req, res) => {
  try {
    ok(res, ReportsRepo.getPlantZones());
  } catch (e) {
    serverError(res, e);
  }
});

// GET /api/reports/cameras
router.get('/cameras', (req, res) => {
  try {
    ok(res, ReportsRepo.getCameras());
  } catch (e) {
    serverError(res, e);
  }
});

// GET /api/reports/audit-checks
router.get('/audit-checks', (req, res) => {
  try {
    ok(res, ReportsRepo.getAuditChecks());
  } catch (e) {
    serverError(res, e);
  }
});

// GET /api/reports/hazard-categories
router.get('/hazard-categories', (req, res) => {
  try {
    ok(res, ReportsRepo.getHazardCategories());
  } catch (e) {
    serverError(res, e);
  }
});

// POST /api/reports/generate  — mock: generate a PDF/CSV report
router.post('/generate', (req, res) => {
  try {
    const { type = 'PDF', period = 'Weekly' } = req.body;
    /**
     * Hook: wire in a real PDF generation library (puppeteer, pdfkit) or
     * CSV export here. Mock returns a download URL for now.
     */
    ok(res, {
      type,
      period,
      status: 'GENERATED',
      filename: `SafeSteel_${period}_Safety_Report_${new Date().toISOString().split('T')[0]}.${type.toLowerCase()}`,
      message: `${period} ${type} report generated successfully. Ready for download.`,
      generatedAt: new Date().toISOString(),
    });
  } catch (e) {
    serverError(res, e);
  }
});

export default router;
