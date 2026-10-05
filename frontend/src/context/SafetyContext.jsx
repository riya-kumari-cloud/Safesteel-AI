import { useState, useEffect, useCallback } from 'react';
import { SafetyContext } from './SafetyContextDef';
import { CAMERAS } from '../data/mockData';
import * as api from '../api/client';

export function SafetyProvider({ children }) {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [stats, setStats] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [incidents, setIncidents] = useState([]);
  const [selectedCamera, setSelectedCamera] = useState(CAMERAS[0]);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [apiError, setApiError] = useState(null);

  // ─── Toast helpers ──────────────────────────────────────────────────────────
  const addToast = useCallback((message, type = 'info') => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // ─── Bootstrap: load stats + alerts + incidents from backend ────────────────
  useEffect(() => {
    let cancelled = false;

    const loadInitialData = async () => {
      setIsLoading(true);
      try {
        const [statsRes, alertsRes, incidentsRes] = await Promise.all([
          api.fetchStats(),
          api.fetchAlerts(),
          api.fetchIncidents(),
        ]);
        if (!cancelled) {
          setStats(statsRes.data);
          setAlerts(alertsRes.data);
          setIncidents(incidentsRes.data);
          setApiError(null);
        }
      } catch (err) {
        if (!cancelled) {
          console.warn('[SafeSteel] Backend unreachable, falling back to mock data.', err.message);
          setApiError(err.message);
          // Graceful fallback — import mock data so the UI still works
          const { INITIAL_STATS, INITIAL_ALERTS, INITIAL_INCIDENTS } = await import('../data/mockData');
          setStats(INITIAL_STATS);
          setAlerts(INITIAL_ALERTS);
          setIncidents(INITIAL_INCIDENTS);
          addToast('⚠️ Backend offline — showing demo data', 'info');
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    loadInitialData();
    return () => { cancelled = true; };
  }, [addToast]);

  // Helper to refresh stats counter after mutations
  const refreshStats = useCallback(async () => {
    try {
      const res = await api.fetchStats();
      setStats(res.data);
    } catch {
      // stats are already updated optimistically below
    }
  }, []);

  // ─── Alert Actions ───────────────────────────────────────────────────────────
  const acknowledgeAlert = useCallback(async (id) => {
    // Optimistic update
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: 'ACKNOWLEDGED' } : a))
    );
    addToast(`Alert ${id} acknowledged by Shift Officer.`, 'info');
    try {
      await api.acknowledgeAlert(id);
    } catch (err) {
      addToast(`Failed to sync acknowledgement: ${err.message}`, 'error');
      // Rollback
      setAlerts((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status: 'ACTIVE' } : a))
      );
    }
  }, [addToast]);

  const resolveAlert = useCallback(async (id) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: 'RESOLVED' } : a))
    );
    addToast(`Alert ${id} marked as resolved.`, 'success');
    try {
      await api.resolveAlert(id);
    } catch (err) {
      addToast(`Failed to sync resolution: ${err.message}`, 'error');
      setAlerts((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status: 'ACTIVE' } : a))
      );
    }
  }, [addToast]);

  // ─── Incident Actions ────────────────────────────────────────────────────────
  const addIncident = useCallback(async (formData) => {
    try {
      const res = await api.createIncident(formData);
      const created = res.data;
      setIncidents((prev) => [created, ...prev]);
      setStats((prev) => prev ? { ...prev, openIncidentsCount: (prev.openIncidentsCount || 0) + 1 } : prev);
      addToast(`Incident #${created.id} logged successfully!`, 'success');
    } catch (err) {
      // Fallback: create locally if API is down
      const now = new Date();
      const fallback = {
        id: `INC-${now.getFullYear()}-00${incidents.length + 90}`,
        date: now.toISOString().split('T')[0],
        time: now.toTimeString().slice(0, 5),
        status: 'UNDER_REVIEW',
        reportedBy: 'Safety Officer (Manual Log)',
        createdAt: now.toISOString(),
        ...formData,
      };
      setIncidents((prev) => [fallback, ...prev]);
      setStats((prev) => prev ? { ...prev, openIncidentsCount: (prev.openIncidentsCount || 0) + 1 } : prev);
      addToast(`Incident #${fallback.id} logged (offline mode).`, 'success');
    }
  }, [addToast, incidents.length]);

  const resolveIncident = useCallback(async (id) => {
    setIncidents((prev) =>
      prev.map((i) => (i.id === id ? { ...i, status: 'RESOLVED' } : i))
    );
    setStats((prev) =>
      prev ? { ...prev, openIncidentsCount: Math.max(0, (prev.openIncidentsCount || 1) - 1) } : prev
    );
    addToast(`Incident #${id} resolved and archived.`, 'success');
    try {
      await api.resolveIncident(id);
    } catch (err) {
      addToast(`Failed to sync resolution: ${err.message}`, 'error');
    }
  }, [addToast]);

  // ─── Simulate AI Alert ───────────────────────────────────────────────────────
  const triggerSimulatedAlert = useCallback(async () => {
    try {
      const res = await api.simulateAlert();
      const newAlert = res.data;
      setAlerts((prev) => [newAlert, ...prev]);
      addToast(`🚨 LIVE AI ALERT: ${newAlert.title}`, 'error');
    } catch (err) {
      // Fallback to local simulation if backend is down
      const simulatedViolations = [
        { title: 'High Heat Zone: No Molten Splash Shield', desc: 'Contract worker ID #W-5501 detected near furnace runner without face shield.', zone: 'Blast Furnace #2', camera: 'CAM-01 (Tapping Deck)', type: 'PPE Violation', severity: 'CRITICAL' },
        { title: 'Restricted Proximity: Heavy Crane Swing Radius', desc: 'Worker detected inside 10m automated crane exclusion boundary.', zone: 'Scrap & Crane Yard', camera: 'CAM-04 (Crane Gantry)', type: 'Zone Intrusion', severity: 'HIGH' },
        { title: 'Missing Fall Arrest Harness at Elevated Deck', desc: 'Maintenance technician working on Level 3 walkway without secured lanyard.', zone: 'Continuous Caster Bay', camera: 'CAM-02 (Turret Level 2)', type: 'Fall Hazard', severity: 'CRITICAL' },
        { title: 'Hearing Protection Missing in Descaling Station', desc: 'Decibel level 108 dB. Worker detected without required class 5 ear defenders.', zone: 'Hot Rolling Mill #1', camera: 'CAM-03 (Finishing Stand)', type: 'PPE Violation', severity: 'MEDIUM' },
      ];
      const pick = simulatedViolations[Math.floor(Math.random() * simulatedViolations.length)];
      const local = {
        id: `ALT-${Math.floor(1000 + Math.random() * 9000)}`,
        timestamp: 'Just now',
        zone: pick.zone,
        camera: pick.camera,
        type: pick.type,
        severity: pick.severity,
        title: pick.title,
        description: pick.desc,
        status: 'ACTIVE',
        workerId: `W-${Math.floor(1000 + Math.random() * 9000)} (Auto-ID)`,
        confidence: `${(95 + Math.random() * 4.9).toFixed(1)}%`,
      };
      setAlerts((prev) => [local, ...prev]);
      addToast(`🚨 LIVE AI ALERT: ${pick.title}`, 'error');
    }
  }, [addToast]);

  return (
    <SafetyContext.Provider
      value={{
        currentPage,
        setCurrentPage,
        stats: stats || {},
        alerts,
        incidents,
        selectedCamera,
        setSelectedCamera,
        isReportModalOpen,
        setIsReportModalOpen,
        toasts,
        addToast,
        removeToast,
        acknowledgeAlert,
        resolveAlert,
        addIncident,
        resolveIncident,
        triggerSimulatedAlert,
        isLoading,
        apiError,
      }}
    >
      {children}
    </SafetyContext.Provider>
  );
}
