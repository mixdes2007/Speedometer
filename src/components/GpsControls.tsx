import React from 'react';
import { GpsStatus, LocationData } from '../types';
import {
  Volume2,
  VolumeX,
  Navigation,
  Sliders,
  Sparkles,
  Smartphone,
  RotateCcw,
  Play,
  Square,
} from 'lucide-react';
import { soundAlarm } from '../services/sound';

interface GpsControlsProps {
  gpsStatus: GpsStatus;
  location: LocationData;
  isAudioMuted: boolean;
  onToggleAudio: () => void;
  isHudMode: boolean;
  onToggleHud: () => void;
  isSimulated: boolean;
  onToggleSimulator: () => void;
  simulatedSpeed: number;
  onSimulatedSpeedChange: (speed: number) => void;
  speedLimit: number;
  onResetTrip: () => void;
}

export const GpsControls: React.FC<GpsControlsProps> = ({
  gpsStatus,
  location,
  isAudioMuted,
  onToggleAudio,
  isHudMode,
  onToggleHud,
  isSimulated,
  onToggleSimulator,
  simulatedSpeed,
  onSimulatedSpeedChange,
  speedLimit,
  onResetTrip,
}) => {
  // Test presets based on the current limit to test warning (limit - 2) and overspeed
  const nearLimitSpeed = Math.max(0, speedLimit - 2);
  const overLimitSpeed = speedLimit + 5;
  const safeSpeed = Math.max(0, speedLimit - 10);

  return (
    <div
      id="gps-controls-container"
      className="w-full bg-neutral-900/80 border border-neutral-800/80 rounded-2xl p-4 flex flex-col gap-3 shadow-md"
    >
      {/* Top row: GPS status and quick toggles */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
        {/* GPS status badge */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-950 border border-neutral-800">
            <Navigation
              className={`w-3.5 h-3.5 ${
                gpsStatus === 'active'
                  ? 'text-emerald-400 animate-pulse'
                  : gpsStatus === 'searching'
                  ? 'text-amber-400 animate-spin'
                  : gpsStatus === 'simulated'
                  ? 'text-cyan-400'
                  : 'text-neutral-500'
              }`}
            />
            <span className="font-mono font-medium text-neutral-300">
              {gpsStatus === 'active'
                ? `GPS Active (±${Math.round(location.accuracy || 5)}m)`
                : gpsStatus === 'searching'
                ? 'Acquiring GPS...'
                : gpsStatus === 'simulated'
                ? 'Simulator Mode'
                : gpsStatus === 'denied'
                ? 'GPS Denied (Use Simulator)'
                : 'GPS Ready'}
            </span>
          </div>

          <button
            id="btn-reset-trip"
            type="button"
            onClick={() => {
              soundAlarm.playClick();
              onResetTrip();
            }}
            title="Reset trip statistics"
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 text-neutral-400 hover:text-neutral-200 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline font-mono text-[11px]">Reset Trip</span>
          </button>
        </div>

        {/* Right utility buttons */}
        <div className="flex items-center gap-2">
          {/* Audio Alarm Toggle */}
          <button
            id="btn-toggle-sound"
            type="button"
            onClick={onToggleAudio}
            title={isAudioMuted ? 'Unmute Audio Alarm' : 'Mute Audio Alarm'}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-mono font-semibold transition-all cursor-pointer ${
              isAudioMuted
                ? 'bg-neutral-950 border-neutral-800 text-neutral-500'
                : 'bg-emerald-950/50 border-emerald-600/70 text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.2)]'
            }`}
          >
            {isAudioMuted ? (
              <>
                <VolumeX className="w-3.5 h-3.5 text-neutral-500" />
                <span className="text-[11px]">Alarm Muted</span>
              </>
            ) : (
              <>
                <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-[11px]">Alarm On</span>
              </>
            )}
          </button>

          {/* HUD Mirror Mode Toggle */}
          <button
            id="btn-toggle-hud"
            type="button"
            onClick={() => {
              soundAlarm.playClick();
              onToggleHud();
            }}
            title="Mirror display for windshield HUD reflection"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-mono transition-colors cursor-pointer ${
              isHudMode
                ? 'bg-indigo-950/60 border-indigo-500 text-indigo-300'
                : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="text-[11px]">HUD Mirror</span>
          </button>

          {/* Simulator Mode Toggle */}
          <button
            id="btn-toggle-simulator"
            type="button"
            onClick={() => {
              soundAlarm.playClick();
              onToggleSimulator();
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-mono transition-colors cursor-pointer ${
              isSimulated
                ? 'bg-cyan-950/70 border-cyan-500 text-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.3)]'
                : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span className="text-[11px]">
              {isSimulated ? 'Simulating' : 'Simulator'}
            </span>
          </button>
        </div>
      </div>

      {/* Simulator Control Drawer / Panel (Visible when Simulator mode is active or GPS not ready) */}
      {isSimulated && (
        <div
          id="simulator-panel"
          className="mt-1 p-3.5 rounded-xl bg-neutral-950 border border-cyan-900/60 flex flex-col gap-2.5 animate-fadeIn"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-semibold text-cyan-300 uppercase tracking-wider">
                Drive Speed Simulator
              </span>
            </div>
            <span className="text-xs font-mono font-bold text-cyan-400">
              {simulatedSpeed} km/h
            </span>
          </div>

          {/* Simulator Slider */}
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-mono text-neutral-500 w-6">0</span>
            <input
              id="simulated-speed-slider"
              type="range"
              min="0"
              max="160"
              step="1"
              value={simulatedSpeed}
              onChange={(e) => onSimulatedSpeedChange(Number(e.target.value))}
              className="w-full h-2.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
            <span className="text-[10px] font-mono text-neutral-500 w-8 text-right">
              160
            </span>
          </div>

          {/* Quick test buttons specifically for testing the 2km rule & overspeed */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-[10px] font-mono text-neutral-400 mr-1">
              Test Triggers:
            </span>

            <button
              type="button"
              onClick={() => onSimulatedSpeedChange(0)}
              className="px-2.5 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-[11px] font-mono text-neutral-300 cursor-pointer"
            >
              0 km/h (Stop)
            </button>

            <button
              type="button"
              onClick={() => onSimulatedSpeedChange(safeSpeed)}
              className="px-2.5 py-1 rounded bg-emerald-950/60 border border-emerald-800/60 hover:bg-emerald-900 text-[11px] font-mono text-emerald-300 cursor-pointer"
            >
              {safeSpeed} km/h (Safe)
            </button>

            <button
              type="button"
              onClick={() => onSimulatedSpeedChange(nearLimitSpeed)}
              className="px-2.5 py-1 rounded bg-amber-950/80 border border-amber-500/80 hover:bg-amber-900 text-[11px] font-mono font-bold text-amber-300 animate-pulse cursor-pointer"
            >
              {nearLimitSpeed} km/h (-2km Warning Alarm)
            </button>

            <button
              type="button"
              onClick={() => onSimulatedSpeedChange(overLimitSpeed)}
              className="px-2.5 py-1 rounded bg-red-950/80 border border-red-500/80 hover:bg-red-900 text-[11px] font-mono font-bold text-red-300 cursor-pointer"
            >
              {overLimitSpeed} km/h (Overspeed Alarm)
            </button>

            <div className="ml-auto flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => onSimulatedSpeedChange(Math.max(0, simulatedSpeed - 1))}
                className="px-2 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-xs font-mono text-neutral-300 cursor-pointer"
              >
                -1
              </button>
              <button
                type="button"
                onClick={() => onSimulatedSpeedChange(Math.min(180, simulatedSpeed + 1))}
                className="px-2 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-xs font-mono text-neutral-300 cursor-pointer"
              >
                +1
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
