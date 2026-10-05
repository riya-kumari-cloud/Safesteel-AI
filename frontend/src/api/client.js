/**
 * SafeSteel AI — Backend API Client
 *
 * All API calls go through this module. Change VITE_API_URL in .env to point
 * at a different backend (staging / production) without touching component code.
 */

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

async function request(method, path, body) {
  const options = {
    method,
    headers: { 'Content-Type': 'application/json' },
  };
  
  const token = localStorage.getItem('token');
  if (token) {
    options.headers['Authorization'] = `Bearer ${token}`;
  }
  
  if (body !== undefined) options.body = JSON.stringify(body);

  const res = await fetch(`${BASE_URL}${path}`, options);
  const json = await res.json();

  if (!res.ok) {
    throw new Error(json.message || json.error || `HTTP ${res.status}`);
  }
  return json;
}

const get = (path) => request('GET', path);
const post = (path, body) => request('POST', path, body);
const patch = (path, body) => request('PATCH', path, body);

// ─── Auth ─────────────────────────────────────────────────────────────────────
export const loginUser = (data) => post('/auth/login', data);
export const registerUser = (data) => post('/auth/register', data);

// ─── Stats ────────────────────────────────────────────────────────────────────
export const fetchStats = () => get('/stats');

// ─── Alerts ───────────────────────────────────────────────────────────────────
export const fetchAlerts = (status) =>
  get(status ? `/alerts?status=${status}` : '/alerts');

export const simulateAlert = () => post('/alerts/simulate');

export const createAlert = (data) => post('/alerts', data);

export const acknowledgeAlert = (id) => patch(`/alerts/${id}/acknowledge`);

export const resolveAlert = (id) => patch(`/alerts/${id}/resolve`);

// ─── Incidents ────────────────────────────────────────────────────────────────
export const fetchIncidents = (filters = {}) => {
  const params = new URLSearchParams(filters).toString();
  return get(`/incidents${params ? `?${params}` : ''}`);
};

export const createIncident = (data) => post('/incidents', data);

export const resolveIncident = (id) => patch(`/incidents/${id}/resolve`);

// ─── PPE ──────────────────────────────────────────────────────────────────────
export const fetchPpeRecords = (status) =>
  get(status ? `/ppe?status=${status}` : '/ppe');

export const analyzeFrame = () => post('/ppe/analyze');

// ─── Machinery ────────────────────────────────────────────────────────────────
export const fetchMachinery = () => get('/machinery');

export const triggerEStop = (id) => post(`/machinery/${id}/estop`);

export const runDiagnostic = (id) => post(`/machinery/${id}/diagnose`);

// ─── AI Assistant ─────────────────────────────────────────────────────────────
export const queryAiAssistant = (query) => post('/ai-assistant/query', { query });

// ─── Reports ─────────────────────────────────────────────────────────────────
export const fetchComplianceTrends = () => get('/reports/compliance-trends');

export const fetchAuditChecks = () => get('/reports/audit-checks');

export const fetchHazardCategories = () => get('/reports/hazard-categories');

export const generateReport = (type, period) =>
  post('/reports/generate', { type, period });
