import { useState } from 'react';
import { useSafety } from '../context/useSafety';
import {
  Settings as SettingsIcon,
  Sliders,
  Shield,
  Bell,
  Save,
  RotateCcw
} from 'lucide-react';

export default function Settings() {
  const { addToast } = useSafety();

  const [settings, setSettings] = useState({
    plantName: 'SafeSteel Jamshedpur Works - Mill #04',
    division: 'Hot Strip & Primary Metallurgy',
    chiefOfficer: 'A. Mehta (CSO-902)',
    confidenceThreshold: 85,
    craneExclusionDistance: 10,
    faceBlurPrivacy: true,
    thermalSensitivity: 75,
    autoSirenArmed: true,
    smsAlerts: true,
    autoEmailSummaries: true,
  });

  const handleSave = (e) => {
    e.preventDefault();
    addToast('Plant safety parameters & AI inference thresholds updated successfully!', 'success');
  };

  const handleReset = () => {
    setSettings({
      plantName: 'SafeSteel Jamshedpur Works - Mill #04',
      division: 'Hot Strip & Primary Metallurgy',
      chiefOfficer: 'A. Mehta (CSO-902)',
      confidenceThreshold: 85,
      craneExclusionDistance: 10,
      faceBlurPrivacy: true,
      thermalSensitivity: 75,
      autoSirenArmed: true,
      smsAlerts: true,
      autoEmailSummaries: true,
    });
    addToast('Default industrial presets restored.', 'info');
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl p-5 bg-slate-900/60 backdrop-blur-md border border-slate-800/80 shadow-md flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-2">
            <SettingsIcon className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-bold text-white tracking-tight">
              Platform & Edge AI Vision Configuration
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Fine-tune edge model detection thresholds, emergency sirens, and plant division parameters.
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Plant Metadata */}
        <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-2xl p-5 shadow-xl">
          <div className="flex items-center space-x-2 mb-4">
            <Shield className="w-4 h-4 text-amber-400" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Plant & Division Metadata
            </h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Plant Facility Name
              </label>
              <input
                type="text"
                value={settings.plantName}
                onChange={(e) => setSettings({ ...settings, plantName: e.target.value })}
                className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Division / Sector
              </label>
              <input
                type="text"
                value={settings.division}
                onChange={(e) => setSettings({ ...settings, division: e.target.value })}
                className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Chief Safety Officer
              </label>
              <input
                type="text"
                value={settings.chiefOfficer}
                onChange={(e) => setSettings({ ...settings, chiefOfficer: e.target.value })}
                className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 transition-colors"
              />
            </div>
          </div>
        </div>

        {/* AI Model Sensitivity & Sliders */}
        <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-2xl p-5 shadow-xl">
          <div className="flex items-center space-x-2 mb-4">
            <Sliders className="w-4 h-4 text-amber-400" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Edge Computer Vision Sensitivity & Thresholds
            </h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-semibold text-slate-300">PPE Confidence Filter</span>
                <span className="font-mono font-bold text-amber-400">{settings.confidenceThreshold}%</span>
              </div>
              <input
                type="range"
                min="50"
                max="99"
                value={settings.confidenceThreshold}
                onChange={(e) => setSettings({ ...settings, confidenceThreshold: Number(e.target.value) })}
                className="w-full accent-amber-500 cursor-pointer"
              />
              <span className="text-[11px] text-slate-400 block mt-1">
                Violations with inference score below this are logged as low-confidence warnings.
              </span>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-semibold text-slate-300">Crane Danger Perimeter</span>
                <span className="font-mono font-bold text-amber-400">{settings.craneExclusionDistance} meters</span>
              </div>
              <input
                type="range"
                min="3"
                max="25"
                value={settings.craneExclusionDistance}
                onChange={(e) => setSettings({ ...settings, craneExclusionDistance: Number(e.target.value) })}
                className="w-full accent-amber-500 cursor-pointer"
              />
              <span className="text-[11px] text-slate-400 block mt-1">
                Dynamic exclusion radius around traveling overhead cranes.
              </span>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-semibold text-slate-300">Thermal Anomaly Sensitivity</span>
                <span className="font-mono font-bold text-amber-400">{settings.thermalSensitivity}°C</span>
              </div>
              <input
                type="range"
                min="40"
                max="120"
                value={settings.thermalSensitivity}
                onChange={(e) => setSettings({ ...settings, thermalSensitivity: Number(e.target.value) })}
                className="w-full accent-amber-500 cursor-pointer"
              />
              <span className="text-[11px] text-slate-400 block mt-1">
                Temperature deviation threshold triggering hot spot alert.
              </span>
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80">
              <div>
                <span className="text-xs font-semibold text-white block">Worker Face Blur Privacy</span>
                <span className="text-[11px] text-slate-400">Blur worker faces on CCTV for GDPR/Data Privacy</span>
              </div>
              <input
                type="checkbox"
                checked={settings.faceBlurPrivacy}
                onChange={(e) => setSettings({ ...settings, faceBlurPrivacy: e.target.checked })}
                className="w-4 h-4 rounded bg-slate-800 border-slate-700 text-amber-500 focus:ring-amber-500 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Alarm and Notification Dispatches */}
        <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-2xl p-5 shadow-xl">
          <div className="flex items-center space-x-2 mb-4">
            <Bell className="w-4 h-4 text-amber-400" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Dispatch & Automated Response
            </h4>
          </div>

          <div className="space-y-3">
            <label className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 cursor-pointer">
              <div>
                <span className="text-xs font-semibold text-white block">
                  Automated Station Siren on Critical Hazard
                </span>
                <span className="text-[11px] text-slate-400">
                  Activates physical plant siren horn when unauthorized entry is detected near molten taphole.
                </span>
              </div>
              <input
                type="checkbox"
                checked={settings.autoSirenArmed}
                onChange={(e) => setSettings({ ...settings, autoSirenArmed: e.target.checked })}
                className="w-4 h-4 rounded bg-slate-800 border-slate-700 text-amber-500 focus:ring-amber-500 cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 cursor-pointer">
              <div>
                <span className="text-xs font-semibold text-white block">
                  SMS & Pager Emergency Broadcast
                </span>
                <span className="text-[11px] text-slate-400">
                  Instantly dispatch critical hazard warnings to shift engineers on duty.
                </span>
              </div>
              <input
                type="checkbox"
                checked={settings.smsAlerts}
                onChange={(e) => setSettings({ ...settings, smsAlerts: e.target.checked })}
                className="w-4 h-4 rounded bg-slate-800 border-slate-700 text-amber-500 focus:ring-amber-500 cursor-pointer"
              />
            </label>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-end space-x-3">
          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800/80 border border-slate-700/80 transition-colors flex items-center space-x-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>

          <button
            type="submit"
            className="px-5 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 flex items-center space-x-1.5 transition-all shadow-md shadow-amber-500/10 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save Configuration</span>
          </button>
        </div>
      </form>
    </div>
  );
}
