/**
 * SafeSteel AI - In-Memory Database
 * 
 * Architecture note: All data access is funnelled through these repository functions.
 * To migrate to MongoDB later, simply replace each function body with a Mongoose call —
 * the routes and controllers remain unchanged.
 */

import { v4 as uuidv4 } from 'uuid';

// ─── Seed Data ───────────────────────────────────────────────────────────────

const STATS = {
  safeWorkHours: '18,450',
  safeDaysConsecutive: 142,
  ppeComplianceRate: 97.2,
  ppeComplianceDelta: '+1.8%',
  activeCamerasOnline: 24,
  totalCameras: 24,
  openIncidentsCount: 3,
  nearMissesToday: 1,
  activeWorkersOnFloor: 86,
  plantSafetyRating: 'A+ (Exemplary)',
};

let alerts = [
  {
    id: 'ALT-8921',
    timestamp: '2 mins ago',
    zone: 'Blast Furnace #2',
    camera: 'CAM-04 (Tuyere Platform)',
    type: 'PPE Violation',
    severity: 'CRITICAL',
    title: 'Missing Thermal Face Shield in Molten Splash Zone',
    description: 'Worker ID #W-4102 entered restricted apron without approved arc/heat-reflective face visor.',
    status: 'ACTIVE',
    workerId: 'W-4102 (S. Verma)',
    confidence: '98.4%',
    createdAt: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
  },
  {
    id: 'ALT-8919',
    timestamp: '14 mins ago',
    zone: 'Scrap & Crane Yard',
    camera: 'CAM-12 (Gantry Runway)',
    type: 'Zone Intrusion',
    severity: 'HIGH',
    title: 'Pedestrian Inside Heavy Crane Swing Radius',
    description: 'Worker entered the active electromagnet drop perimeter while Crane #3 was hoisting scrap bundles.',
    status: 'ACTIVE',
    workerId: 'W-2894 (R. Kumar)',
    confidence: '96.1%',
    createdAt: new Date(Date.now() - 14 * 60 * 1000).toISOString(),
  },
  {
    id: 'ALT-8915',
    timestamp: '38 mins ago',
    zone: 'Hot Rolling Mill #1',
    camera: 'CAM-08 (Roller Table 2)',
    type: 'Missing PPE',
    severity: 'MEDIUM',
    title: 'Hi-Vis Safety Vest Not Detected',
    description: 'Contract technician working near transport conveyor without high-visibility class 3 vest.',
    status: 'INVESTIGATING',
    workerId: 'C-1092 (T. Nair)',
    confidence: '94.7%',
    createdAt: new Date(Date.now() - 38 * 60 * 1000).toISOString(),
  },
  {
    id: 'ALT-8902',
    timestamp: '1 hr ago',
    zone: 'Continuous Caster Bay',
    camera: 'CAM-06 (Tundish Deck)',
    type: 'Safe Clearance',
    severity: 'LOW',
    title: 'Temporary Staging Barrier Displaced',
    description: 'Safety stanchion displaced by forklift clearance maneuver. Flagged for re-anchoring.',
    status: 'RESOLVED',
    workerId: 'F-04 (Logistics)',
    confidence: '91.2%',
    createdAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
  },
];

let incidents = [
  {
    id: 'INC-2026-0089',
    date: '2026-09-28',
    time: '22:45',
    zone: 'Blast Furnace #2',
    category: 'PPE Non-Compliance',
    severity: 'HIGH',
    reportedBy: 'AI Vision Auto-Trigger (CAM-04)',
    title: 'Unauthorized Entry into High Heat Zone Without Aluminized Suit',
    description: 'Operator observed within 3m of taphole runner without radiant heat protective apron.',
    actionTaken: 'Audio hazard siren sounded on floor; shift foreman redirected worker immediately.',
    status: 'UNDER_REVIEW',
    assignedTo: 'Chief Safety Officer Mehta',
    createdAt: new Date('2026-09-28T22:45:00').toISOString(),
  },
  {
    id: 'INC-2026-0088',
    date: '2026-09-28',
    time: '19:12',
    zone: 'Continuous Caster Bay',
    category: 'Near Miss',
    severity: 'CRITICAL',
    reportedBy: 'Shift Supervisor D. Roy',
    title: 'Hydraulic Line Pressure Spike Near Tundish',
    description: 'Sensor indicated sudden 18 bar fluctuation. Automatic shutoff valve activated preventing oil flare.',
    actionTaken: 'Line isolated, O-ring seal replaced by mechanical team. Pressure test passed.',
    status: 'RESOLVED',
    assignedTo: 'Eng. K. Dasgupta',
    createdAt: new Date('2026-09-28T19:12:00').toISOString(),
  },
  {
    id: 'INC-2026-0087',
    date: '2026-09-27',
    time: '14:30',
    zone: 'Scrap & Crane Yard',
    category: 'Equipment Hazard',
    severity: 'MEDIUM',
    reportedBy: 'AI Proximity Detection',
    title: 'Forklift Exceeded Speed Limit in Pedestrian Walkway',
    description: 'Vehicle FL-08 clocked at 18 km/h in restricted 8 km/h safety corridor.',
    actionTaken: 'Operator issued verbal safety notice. Speed limiter recalibrated.',
    status: 'RESOLVED',
    assignedTo: 'Logistics Lead Patel',
    createdAt: new Date('2026-09-27T14:30:00').toISOString(),
  },
  {
    id: 'INC-2026-0086',
    date: '2026-09-26',
    time: '09:15',
    zone: 'Hot Rolling Mill #1',
    category: 'PPE Non-Compliance',
    severity: 'LOW',
    reportedBy: 'AI Vision (CAM-03)',
    title: 'Missing Hearing Protection in High Decibel Zone',
    description: 'Contractor failed to wear grade 5 earmuffs near de-scaling hydraulic jets.',
    actionTaken: 'Contractor provided with certified PPE dispenser pack at station gate.',
    status: 'RESOLVED',
    assignedTo: 'HSE Inspector Singh',
    createdAt: new Date('2026-09-26T09:15:00').toISOString(),
  },
];

let ppeRecords = [
  { id: 'DET-001', label: 'Safety Helmet (Hardhat)', status: 'COMPLIANT', confidence: '99.2%', worker: 'W-4102', zone: 'Head Protection', camera: 'CAM-01', createdAt: new Date().toISOString() },
  { id: 'DET-002', label: 'Hi-Vis Radiant Apron', status: 'COMPLIANT', confidence: '98.5%', worker: 'W-4102', zone: 'Torso', camera: 'CAM-01', createdAt: new Date().toISOString() },
  { id: 'DET-003', label: 'Molten Visor Face Shield', status: 'VIOLATION', confidence: '95.1%', worker: 'W-4102', zone: 'Face / Eye', issue: 'Missing Visor', camera: 'CAM-01', createdAt: new Date().toISOString() },
  { id: 'DET-004', label: 'Metatarsal Steel Boots', status: 'COMPLIANT', confidence: '97.4%', worker: 'W-4102', zone: 'Footwear', camera: 'CAM-01', createdAt: new Date().toISOString() },
  { id: 'DET-005', label: 'Safety Helmet (Hardhat)', status: 'COMPLIANT', confidence: '99.8%', worker: 'W-3882', zone: 'Head Protection', camera: 'CAM-01', createdAt: new Date().toISOString() },
  { id: 'DET-006', label: 'Hi-Vis Safety Vest', status: 'COMPLIANT', confidence: '99.1%', worker: 'W-3882', zone: 'Torso', camera: 'CAM-01', createdAt: new Date().toISOString() },
];

const machinery = [
  {
    id: 'MCH-CRN-04',
    name: 'Overhead Ladle Crane #4',
    zone: 'Continuous Caster Bay',
    type: 'Heavy Hoist (320 Ton)',
    status: 'CRITICAL_MONITOR',
    telemetry: {
      currentLoad: '248.5 Tons',
      ratedCapacity: '320 Tons',
      utilizationPct: 78,
      hoistMotorTemp: '82°C',
      vibrationMmS: '3.4 mm/s (Acceptable)',
      proximityAlert: 'ACTIVE: 2 Workers in Drop Shadow Zone',
      brakePadWear: '18% (Good)',
      emergencyStopArmed: true,
    },
    lastInspection: 'Yesterday (Shift A)',
    nextMaintenance: 'In 6 days',
  },
  {
    id: 'MCH-BF-02',
    name: 'Blast Furnace #2 Tuyere System',
    zone: 'Blast Furnace #2',
    type: 'Thermal Smelting Reactor',
    status: 'OPTIMAL',
    telemetry: {
      currentLoad: 'Hot Blast 1,220°C',
      ratedCapacity: '1,400°C Max',
      utilizationPct: 87,
      hoistMotorTemp: 'N/A (Blower: 64°C)',
      vibrationMmS: '1.1 mm/s',
      proximityAlert: 'Perimeter Barrier Secure',
      brakePadWear: 'N/A',
      emergencyStopArmed: true,
    },
    lastInspection: '3 days ago',
    nextMaintenance: 'In 14 days',
  },
  {
    id: 'MCH-ROLL-01',
    name: 'Continuous Hot Strip Finishing Mill',
    zone: 'Hot Rolling Mill #1',
    type: 'Hydraulic Reduction Stands',
    status: 'WARNING',
    telemetry: {
      currentLoad: 'Rolling Force: 2,450 kN',
      ratedCapacity: '3,000 kN',
      utilizationPct: 82,
      hoistMotorTemp: '94°C (Elevated)',
      vibrationMmS: '5.8 mm/s (Bearing Check Required)',
      proximityAlert: 'Interlock Gate Closed',
      brakePadWear: '44% (Schedule Service)',
      emergencyStopArmed: true,
    },
    lastInspection: '5 days ago',
    nextMaintenance: 'Tomorrow',
  },
  {
    id: 'MCH-GAN-02',
    name: 'Scrap Scraping Gantry Electromagnet',
    zone: 'Scrap & Crane Yard',
    type: 'Magnetic Material Handling',
    status: 'OPTIMAL',
    telemetry: {
      currentLoad: '32.0 Tons',
      ratedCapacity: '45 Tons',
      utilizationPct: 71,
      hoistMotorTemp: '58°C',
      vibrationMmS: '1.8 mm/s',
      proximityAlert: 'Zone Radar Clear',
      brakePadWear: '22% (Normal)',
      emergencyStopArmed: true,
    },
    lastInspection: 'Today (Shift B)',
    nextMaintenance: 'In 21 days',
  },
];

const knowledgeBase = [
  {
    keywords: ['ppe', 'blast furnace', 'tapping deck', 'face shield', 'molten', 'heat'],
    answer: `Under SafeSteel AI Policy & OSHA 1910.132, mandatory PPE for the Blast Furnace Tapping Deck includes:\n1. Aluminized radiant heat-reflective coat and chaps or full molten-splash coverall (NFPA 70E / ASTM F955).\n2. Gold-filmed heat reflective face shield over safety goggles.\n3. Heavy split-cowhide or aluminized heat-resistant gloves (rated >500°C contact).\n4. Steel-toe safety boots with metatarsal protection and Kevlar heat-resistant gaiters.\n5. Personal gas detector calibrated for CO (Carbon Monoxide) and H2S.`,
  },
  {
    keywords: ['crane', 'e-stop', 'emergency stop', 'overhead', 'interlock'],
    answer: `SafeSteel AI Computer Vision Engine triggers an automated audible alarm and interlock lockout when:\n- Any pedestrian is detected within the 10-meter dynamic travel envelope while hoist load exceeds 50 tons.\n- Two cranes on the same runway rail breach the 15-meter minimum separation distance.\n- Hoist wire rope skew angle exceeds 7 degrees, indicating high tip-over or uncentered load risk.`,
  },
  {
    keywords: ['near miss', 'iso 45001', 'report', 'log', 'incident'],
    answer: `To log a Near Miss in SafeSteel:\n1. Click '+ Log Incident' in the top navigation bar or go to the Incidents module.\n2. Select Severity as 'Medium' or 'Low' and Category as 'Near Miss'.\n3. Specify the Plant Zone and relevant equipment ID.\n4. Describe the sequence of events and immediate preventive action taken.\n5. AI will auto-categorize risk likelihood, notify the area safety supervisor, and schedule a 48-hour follow-up review.`,
  },
  {
    keywords: ['rolling mill', 'shift b', 'finishing', 'bearing', 'vibration'],
    answer: `### SafeSteel Hazard Assessment: Hot Rolling Mill #1 (Shift B)\n\n**Current Live Conditions:**\n1. **Finishing Stand F5**: Motor temperature is running elevated at **94°C** with vibration analysis at **5.8 mm/s**. Bearing wear warning active.\n2. **PPE Compliance**: 95% compliance observed by CAM-03. One warning logged for missing hearing protection in descaling zone.\n3. **Recommendation**: Schedule lubrication inspection during the scheduled 16:30 shift changeover; ensure all personnel in Stand 4-6 corridor wear Class 5 hearing protection.`,
  },
];

const complianceTrends = [
  { day: 'Mon', rate: 94.8, violations: 12 },
  { day: 'Tue', rate: 96.1, violations: 9 },
  { day: 'Wed', rate: 95.4, violations: 11 },
  { day: 'Thu', rate: 97.8, violations: 5 },
  { day: 'Fri', rate: 96.9, violations: 7 },
  { day: 'Sat', rate: 98.2, violations: 4 },
  { day: 'Sun', rate: 98.9, violations: 2 },
];

const plantZones = [
  { id: 'zone-1', name: 'Blast Furnace #2', riskLevel: 'HIGH', activeWorkers: 18, compliance: 96, temp: '1,480°C' },
  { id: 'zone-2', name: 'Continuous Caster Bay', riskLevel: 'HIGH', activeWorkers: 14, compliance: 98, temp: '920°C' },
  { id: 'zone-3', name: 'Hot Rolling Mill #1', riskLevel: 'MEDIUM', activeWorkers: 22, compliance: 95, temp: '680°C' },
  { id: 'zone-4', name: 'Scrap & Crane Yard', riskLevel: 'MEDIUM', activeWorkers: 12, compliance: 99, temp: '34°C' },
  { id: 'zone-5', name: 'Cold Finishing & Coil Storage', riskLevel: 'LOW', activeWorkers: 20, compliance: 100, temp: '28°C' },
];

const cameras = [
  { id: 'CAM-01', name: 'Blast Furnace Tapping Deck', zone: 'Blast Furnace #2', resolution: '4K UHD @ 30FPS', status: 'ONLINE', aiModel: 'YOLOv11-PPE-Steel v3.2', activeDetections: 4, violations: 1, location: 'Deck 3, East Gantry' },
  { id: 'CAM-02', name: 'Caster Ladle Turret Bay', zone: 'Continuous Caster Bay', resolution: '1080p @ 60FPS', status: 'ONLINE', aiModel: 'ThermalVision-PPE v2.0', activeDetections: 6, violations: 0, location: 'Turret Level 2' },
  { id: 'CAM-03', name: 'Rolling Mill Finishing Stand', zone: 'Hot Rolling Mill #1', resolution: '1080p @ 30FPS', status: 'ONLINE', aiModel: 'SafeSteel-Vision-Core', activeDetections: 5, violations: 1, location: 'Stand F5 Control View' },
  { id: 'CAM-04', name: 'Heavy Scrap Crane Gantry', zone: 'Scrap & Crane Yard', resolution: '4K UHD @ 30FPS', status: 'ONLINE', aiModel: 'SafeSteel-Proximity-Track', activeDetections: 3, violations: 1, location: 'Bay 4 Overhead Pylon' },
];

// ─── Helper to recompute stats from live data ─────────────────────────────────
function recomputeStats() {
  const openCount = incidents.filter((i) => i.status === 'UNDER_REVIEW').length;
  STATS.openIncidentsCount = openCount;
  return { ...STATS };
}

// ─── Alert Simulated Violations Pool ─────────────────────────────────────────
const simulatedViolations = [
  { title: 'High Heat Zone: No Molten Splash Shield', desc: 'Contract worker ID #W-5501 detected near furnace runner without face shield.', zone: 'Blast Furnace #2', camera: 'CAM-01 (Tapping Deck)', type: 'PPE Violation', severity: 'CRITICAL' },
  { title: 'Restricted Proximity: Heavy Crane Swing Radius', desc: 'Worker detected inside 10m automated crane exclusion boundary.', zone: 'Scrap & Crane Yard', camera: 'CAM-04 (Crane Gantry)', type: 'Zone Intrusion', severity: 'HIGH' },
  { title: 'Missing Fall Arrest Harness at Elevated Deck', desc: 'Maintenance technician working on Level 3 walkway without secured lanyard.', zone: 'Continuous Caster Bay', camera: 'CAM-02 (Turret Level 2)', type: 'Fall Hazard', severity: 'CRITICAL' },
  { title: 'Hearing Protection Missing in Descaling Station', desc: 'Decibel level 108 dB. Worker detected without required class 5 ear defenders.', zone: 'Hot Rolling Mill #1', camera: 'CAM-03 (Finishing Stand)', type: 'PPE Violation', severity: 'MEDIUM' },
];

// ─── Repositories (swap bodies for Mongoose later) ───────────────────────────

export const StatsRepo = {
  get: () => recomputeStats(),
};

export const AlertRepo = {
  getAll: () => [...alerts],
  getById: (id) => alerts.find((a) => a.id === id),
  create: (data) => {
    const alert = { ...data, id: `ALT-${Math.floor(1000 + Math.random() * 9000)}`, createdAt: new Date().toISOString() };
    alerts.unshift(alert);
    return alert;
  },
  update: (id, patch) => {
    const idx = alerts.findIndex((a) => a.id === id);
    if (idx === -1) return null;
    alerts[idx] = { ...alerts[idx], ...patch };
    return alerts[idx];
  },
  simulateRandom: () => {
    const pick = simulatedViolations[Math.floor(Math.random() * simulatedViolations.length)];
    return AlertRepo.create({
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
    });
  },
};

export const IncidentRepo = {
  getAll: () => [...incidents],
  getById: (id) => incidents.find((i) => i.id === id),
  create: (data) => {
    const num = incidents.length + 90;
    const now = new Date();
    const incident = {
      id: `INC-${now.getFullYear()}-00${num}`,
      date: now.toISOString().split('T')[0],
      time: now.toTimeString().slice(0, 5),
      status: 'UNDER_REVIEW',
      reportedBy: 'Safety Officer (Manual Log)',
      createdAt: now.toISOString(),
      ...data,
    };
    incidents.unshift(incident);
    return incident;
  },
  update: (id, patch) => {
    const idx = incidents.findIndex((i) => i.id === id);
    if (idx === -1) return null;
    incidents[idx] = { ...incidents[idx], ...patch };
    return incidents[idx];
  },
};

export const PpeRepo = {
  getAll: () => [...ppeRecords],
  getById: (id) => ppeRecords.find((r) => r.id === id),
  create: (data) => {
    const record = { ...data, id: `DET-${String(ppeRecords.length + 1).padStart(3, '0')}`, createdAt: new Date().toISOString() };
    ppeRecords.push(record);
    return record;
  },
};

export const MachineryRepo = {
  getAll: () => [...machinery],
  getById: (id) => machinery.find((m) => m.id === id),
};

export const AiAssistantRepo = {
  query: (text) => {
    const q = text.toLowerCase();
    const match = knowledgeBase.find((kb) =>
      kb.keywords.some((kw) => q.includes(kw))
    );
    if (match) return match.answer;
    return `### SafeSteel AI Guidance on "${text}":\n\n**Standard Protocol Reference (OSHA / SafeSteel Code of Practice):**\n- **Hazard Identification**: Always ensure dynamic boundary exclusion zones are respected before manual intervention.\n- **Permit Validation**: Confirm Hot Work or Confined Space permits are logged in the SafeSteel Incidents registry.\n- **PPE Verification**: Minimum requirement includes NFPA-rated arc flash gear, metatarsal steel boots, and approved eyewear.\n- **Immediate Escalation**: If imminent danger exists, depress the local emergency stop button and alert the Shift Safety In-Charge immediately.`;
  },
};

export const ReportsRepo = {
  getComplianceTrends: () => [...complianceTrends],
  getPlantZones: () => [...plantZones],
  getCameras: () => [...cameras],
  getAuditChecks: () => [
    { title: 'Edge AI Vision Camera Field Calibration', status: 'PASSED', date: 'Yesterday' },
    { title: 'Emergency Audio Siren Decibel Audibility (Zone 1-5)', status: 'PASSED', date: '3 days ago' },
    { title: 'High Heat Respirator & Face Shield Stock Audit', status: 'PASSED', date: '4 days ago' },
    { title: 'Crane Overhead Laser Proximity Sensor Test', status: 'PASSED', date: 'Last week' },
    { title: 'Emergency Lockout / Tagout (LOTO) Keybox Verification', status: 'PASSED', date: 'Last week' },
  ],
  getHazardCategories: () => [
    { name: 'PPE Non-Compliance', count: 18, pct: 42, color: 'bg-amber-500' },
    { name: 'Crane / Machinery Proximity', count: 12, pct: 28, color: 'bg-red-500' },
    { name: 'Near Miss / Pre-Hazard', count: 8, pct: 18, color: 'bg-sky-500' },
    { name: 'Thermal / Molten Metal Splash', count: 5, pct: 12, color: 'bg-orange-500' },
  ],
};
