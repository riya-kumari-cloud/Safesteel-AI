import { useState } from 'react';
import { useSafety } from '../context/useSafety';
import { CAMERAS } from '../data/mockData';
import {
  Camera,
  Layers,
  Thermometer,
  BellRing,
  Upload,
  Cpu,
  CheckCircle2
} from 'lucide-react';

export default function PpeDetection() {
  const { selectedCamera, setSelectedCamera, addToast, setIsReportModalOpen } = useSafety();
  const [showBoundingBoxes, setShowBoundingBoxes] = useState(true);
  const [showConfidence, setShowConfidence] = useState(true);
  const [isThermalMode, setIsThermalMode] = useState(false);
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [isAnalyzingUpload, setIsAnalyzingUpload] = useState(false);
  const [workflowStep, setWorkflowStep] = useState(1); // 1: Input/Stream, 2: Analyze, 3: Results

  const detections = [
    { id: 'DET-1', label: 'Safety Helmet (Hardhat)', status: 'COMPLIANT', confidence: '99.2%', worker: 'W-4102', zone: 'Head Protection' },
    { id: 'DET-2', label: 'Hi-Vis Radiant Apron', status: 'COMPLIANT', confidence: '98.5%', worker: 'W-4102', zone: 'Torso' },
    { id: 'DET-3', label: 'Molten Visor Face Shield', status: 'VIOLATION', confidence: '95.1%', worker: 'W-4102', zone: 'Face / Eye', issue: 'Missing Visor' },
    { id: 'DET-4', label: 'Metatarsal Steel Boots', status: 'COMPLIANT', confidence: '97.4%', worker: 'W-4102', zone: 'Footwear' },
    { id: 'DET-5', label: 'Safety Helmet (Hardhat)', status: 'COMPLIANT', confidence: '99.8%', worker: 'W-3882', zone: 'Head Protection' },
    { id: 'DET-6', label: 'Hi-Vis Safety Vest', status: 'COMPLIANT', confidence: '99.1%', worker: 'W-3882', zone: 'Torso' },
  ];

  const filteredDetections = detections.filter((d) => {
    if (activeFilter === 'VIOLATION') return d.status === 'VIOLATION';
    if (activeFilter === 'COMPLIANT') return d.status === 'COMPLIANT';
    return true;
  });

  const handleSimulateUpload = () => {
    setWorkflowStep(2);
    setIsAnalyzingUpload(true);
    addToast('Uploading plant floor snapshot to YOLOv11 Edge Vision node...', 'info');

    setTimeout(() => {
      setIsAnalyzingUpload(false);
      setWorkflowStep(3);
      addToast('Analysis complete: 1 violation detected (Missing Eye Protection).', 'error');
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* 1. VISUAL WORKFLOW STEPPER (Upload → Analyze → Results) */}
      <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-2xl p-4 shadow-xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-mono uppercase font-bold text-amber-400 tracking-wider">
              EDGE COMPUTER VISION PIPELINE
            </span>
            <h3 className="text-sm font-bold text-white mt-0.5">
              Automated PPE Compliance & Hazard Detection
            </h3>
          </div>

          {/* Stepper indicators */}
          <div className="flex items-center space-x-2 sm:space-x-4 text-xs">
            <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg border transition-all ${
              workflowStep === 1
                ? 'bg-amber-500/15 border-amber-500/40 text-amber-300 font-bold'
                : 'bg-slate-950 border-slate-800 text-slate-400'
            }`}>
              <Upload className="w-3.5 h-3.5" />
              <span>1. Stream / Upload</span>
            </div>

            <span className="text-slate-600 font-mono">→</span>

            <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg border transition-all ${
              workflowStep === 2
                ? 'bg-sky-500/15 border-sky-500/40 text-sky-300 font-bold animate-pulse'
                : 'bg-slate-950 border-slate-800 text-slate-400'
            }`}>
              <Cpu className="w-3.5 h-3.5" />
              <span>2. YOLOv11 Inference</span>
            </div>

            <span className="text-slate-600 font-mono">→</span>

            <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg border transition-all ${
              workflowStep === 3
                ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300 font-bold'
                : 'bg-slate-950 border-slate-800 text-slate-400'
            }`}>
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>3. Verified Results</span>
            </div>
          </div>

          <button
            onClick={handleSimulateUpload}
            disabled={isAnalyzingUpload}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors cursor-pointer shrink-0"
          >
            <Upload className="w-3.5 h-3.5 text-amber-400" />
            <span>{isAnalyzingUpload ? 'Running Inference...' : 'Upload Frame / Photo'}</span>
          </button>
        </div>
      </div>

      {/* 2. CAMERA CHANNEL SELECTOR BAR */}
      <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-2xl p-3 flex flex-wrap items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center space-x-2">
          <Camera className="w-4 h-4 text-amber-400" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono">
            Active Edge Camera Feeds:
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          {CAMERAS.map((cam) => {
            const isSelected = selectedCamera.id === cam.id;
            return (
              <button
                key={cam.id}
                onClick={() => {
                  setSelectedCamera(cam);
                  setWorkflowStep(1);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center space-x-2 transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-slate-800 text-white font-bold border border-slate-700 shadow-sm'
                    : 'bg-slate-950/60 text-slate-400 hover:bg-slate-900 hover:text-white border border-slate-800/80'
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    isSelected ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400'
                  }`}
                />
                <span>{cam.id}: {cam.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. MAIN VISION STAGE & TELEMETRY BREAKDOWN */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: CCTV HUD Stage with Realistic Bounding Boxes */}
        <div className="lg:col-span-2 bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-2xl overflow-hidden shadow-2xl flex flex-col">
          {/* Stream Header */}
          <div className="p-3.5 bg-slate-950/90 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center space-x-3">
              <span className="flex items-center space-x-1.5 px-2 py-0.5 rounded bg-red-600/15 text-red-400 border border-red-500/30 text-[11px] font-bold font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                <span>LIVE FEED</span>
              </span>
              <span className="text-xs font-bold text-white tracking-wide">
                {selectedCamera.name} • {selectedCamera.location}
              </span>
            </div>

            <div className="flex items-center space-x-2 text-xs font-mono text-slate-400">
              <span className="px-2 py-0.5 rounded bg-slate-900 text-[10px] border border-slate-800">
                {selectedCamera.resolution}
              </span>
              <span className="px-2 py-0.5 rounded bg-slate-900 text-emerald-400 text-[10px] border border-slate-800">
                {selectedCamera.aiModel}
              </span>
            </div>
          </div>

          {/* Video Stream Stage */}
          <div className="relative w-full aspect-video bg-slate-950 overflow-hidden flex items-center justify-center select-none group">
            {/* Background Simulated Industrial Scene */}
            <div
              className={`absolute inset-0 bg-gradient-to-b ${
                isThermalMode
                  ? 'from-purple-950 via-red-950 to-amber-950'
                  : 'from-slate-900 via-slate-950 to-neutral-950'
              } transition-colors duration-500`}
            >
              {/* Subtle CCTV crosshair / grid overlay */}
              <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px]" />
              
              {/* Zone boundary markers */}
              <div className="absolute top-10 left-10 w-44 h-28 border border-dashed border-amber-500/30 rounded flex items-center justify-center text-[10px] text-amber-500/50 font-mono">
                ZONE 1A: TUYERE DUCT
              </div>
              <div className="absolute bottom-12 right-12 w-52 h-24 border border-dashed border-red-500/30 rounded flex items-center justify-center text-[10px] text-red-500/50 font-mono">
                MOLTEN RUNNER APRON
              </div>
            </div>

            {/* Overlaid Simulated Bounding Boxes */}
            {showBoundingBoxes && (
              <>
                {/* Person 1 (Compliant) */}
                <div className="absolute top-[20%] left-[26%] w-[19%] h-[60%] border-2 border-emerald-400/90 rounded bg-emerald-500/5 transition-all">
                  <div className="absolute -top-6 left-0 bg-emerald-600 text-slate-950 font-black text-[10px] font-mono px-1.5 py-0.2 rounded flex items-center space-x-1 shadow-md">
                    <span>WORKER #W-3882</span>
                    {showConfidence && <span className="opacity-80">(99.2%)</span>}
                  </div>
                  {/* Helmet Sub-box */}
                  <div className="absolute top-1 left-2 right-2 h-9 border border-emerald-400 bg-emerald-400/20 rounded text-[9px] font-mono text-emerald-300 font-bold px-1 flex items-center">
                    ✓ HELMET OK
                  </div>
                  {/* Vest Sub-box */}
                  <div className="absolute top-12 left-1 right-1 h-18 border border-emerald-400 bg-emerald-400/20 rounded text-[9px] font-mono text-emerald-300 font-bold px-1 flex items-center">
                    ✓ HI-VIS VEST OK
                  </div>
                </div>

                {/* Person 2 (VIOLATION DETECTED: Missing Visor) */}
                <div className="absolute top-[24%] right-[25%] w-[21%] h-[62%] border-2 border-red-500 rounded bg-red-500/10 animate-subtle-pulse transition-all">
                  <div className="absolute -top-6 left-0 bg-red-600 text-white font-black text-[10px] font-mono px-1.5 py-0.2 rounded flex items-center space-x-1 shadow-md">
                    <span>⚠️ NO FACE SHIELD</span>
                    {showConfidence && <span className="opacity-90">(95.1%)</span>}
                  </div>
                  {/* Flashing Box on Face Zone */}
                  <div className="absolute top-1 left-3 right-3 h-11 border-2 border-dashed border-red-400 bg-red-500/30 rounded text-[9px] font-mono text-red-200 font-black p-1 flex items-center justify-center animate-bounce">
                    MISSING VISOR!
                  </div>
                  {/* Apron OK */}
                  <div className="absolute top-15 left-2 right-2 h-18 border border-emerald-400/80 bg-emerald-500/10 rounded text-[9px] font-mono text-emerald-300 font-bold px-1 flex items-center">
                    ✓ HEAT APRON OK
                  </div>
                </div>
              </>
            )}

            {/* Corner CCTV HUD Metadata */}
            <div className="absolute top-3 left-3 font-mono text-[10px] text-slate-300 bg-black/70 px-2 py-1 rounded backdrop-blur-sm border border-slate-800">
              <div>CAM: {selectedCamera.id}</div>
              <div>FPS: 30.0 • 4.8 Mbps</div>
            </div>

            <div className="absolute bottom-3 right-3 font-mono text-[10px] text-emerald-400 bg-black/75 px-2 py-1 rounded border border-slate-800">
              AI INFERENCE: 18.2ms
            </div>
          </div>

          {/* Stream Controls Footer */}
          <div className="p-3 bg-slate-950/90 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center space-x-4 text-xs">
              <label className="flex items-center space-x-1.5 cursor-pointer text-slate-300 hover:text-white">
                <input
                  type="checkbox"
                  checked={showBoundingBoxes}
                  onChange={(e) => setShowBoundingBoxes(e.target.checked)}
                  className="rounded bg-slate-800 border-slate-700 text-amber-500 focus:ring-amber-500 cursor-pointer"
                />
                <span>Bounding Boxes</span>
              </label>

              <label className="flex items-center space-x-1.5 cursor-pointer text-slate-300 hover:text-white">
                <input
                  type="checkbox"
                  checked={showConfidence}
                  onChange={(e) => setShowConfidence(e.target.checked)}
                  className="rounded bg-slate-800 border-slate-700 text-amber-500 focus:ring-amber-500 cursor-pointer"
                />
                <span>Confidence %</span>
              </label>

              <button
                onClick={() => setIsThermalMode(!isThermalMode)}
                className={`flex items-center space-x-1 px-2.5 py-1 rounded border text-xs font-semibold transition-all cursor-pointer ${
                  isThermalMode
                    ? 'bg-purple-600 text-white border-purple-500'
                    : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:text-white'
                }`}
              >
                <Thermometer className="w-3.5 h-3.5" />
                <span>Thermal Mode</span>
              </button>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => addToast(`Audio warning siren triggered at ${selectedCamera.location}`, 'error')}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-red-600/15 text-red-300 border border-red-500/30 hover:bg-red-600/25 transition-colors cursor-pointer"
              >
                <BellRing className="w-3.5 h-3.5 text-red-400" />
                <span>Sound Station Siren</span>
              </button>
              <button
                onClick={() => setIsReportModalOpen(true)}
                className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 transition-colors shadow-md shadow-amber-500/10 cursor-pointer"
              >
                <span>Save Violation Incident</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Col: PPE Detections Breakdown & Snapshot Telemetry */}
        <div className="space-y-4">
          <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-2xl p-4 shadow-xl">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <Layers className="w-4 h-4 text-amber-400" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                  Detection Telemetry
                </h4>
              </div>

              {/* Filter tabs */}
              <div className="flex space-x-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
                {['ALL', 'VIOLATION', 'COMPLIANT'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveFilter(tab)}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all cursor-pointer ${
                      activeFilter === tab
                        ? 'bg-slate-800 text-white'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Detections List */}
            <div className="space-y-2 max-h-[380px] overflow-y-auto">
              {filteredDetections.map((item) => {
                const isViolation = item.status === 'VIOLATION';
                return (
                  <div
                    key={item.id}
                    className={`p-3 rounded-xl border transition-all ${
                      isViolation
                        ? 'bg-red-950/20 border-red-500/35 text-red-200'
                        : 'bg-slate-950/60 border-slate-800/80 text-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-white">{item.label}</span>
                      <span
                        className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded border ${
                          isViolation
                            ? 'bg-red-500/15 text-red-400 border-red-500/30'
                            : 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                      <span>Worker: <strong className="text-slate-300">{item.worker}</strong></span>
                      <span>Target: {item.zone}</span>
                      <span className="text-emerald-400 font-semibold">{item.confidence}</span>
                    </div>

                    {isViolation && item.issue && (
                      <div className="mt-2 text-[11px] text-red-300 font-semibold bg-red-900/30 p-2 rounded-lg border border-red-800/40">
                        ⚠️ Violation: {item.issue} (Requires immediate shield provisioning)
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Active Camera Scan Stats */}
          <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-2xl p-4 shadow-xl">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-3 font-mono">
              Live Feed Scanner Status
            </h4>
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <span className="text-[11px] text-slate-400 font-mono">Total Personnel</span>
                <div className="text-lg font-bold font-mono text-white mt-0.5">2 Detected</div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <span className="text-[11px] text-slate-400 font-mono">Infractions</span>
                <div className="text-lg font-bold font-mono text-red-400 mt-0.5">1 Violation</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
