import React from 'react';
import { Plus, Minus, Gauge } from 'lucide-react';
import { soundAlarm } from '../services/sound';

interface SpeedLimitControlProps {
  speedLimit: number;
  onSpeedLimitChange: (newLimit: number) => void;
  isHudMode: boolean;
}

export const SpeedLimitControl: React.FC<SpeedLimitControlProps> = ({
  speedLimit,
  onSpeedLimitChange,
  isHudMode,
}) => {
  const handleIncrease = () => {
    soundAlarm.playClick();
    onSpeedLimitChange(Math.min(220, speedLimit + 5));
  };

  const handleDecrease = () => {
    soundAlarm.playClick();
    onSpeedLimitChange(Math.max(10, speedLimit - 5));
  };

  return (
    <div
      id="speed-limit-section"
      className={`w-full bg-neutral-900/90 border border-neutral-800 rounded-2xl p-4 sm:p-5 flex flex-col justify-between shadow-lg ${
        isHudMode ? 'hud-mode' : ''
      }`}
    >
      {/* Section Header */}
      <div className="flex items-center justify-between pb-2 border-b border-neutral-800/80">
        <div className="flex items-center gap-2">
          <Gauge className="w-4 h-4 text-emerald-400" />
          <h2 className="text-xs sm:text-sm font-semibold tracking-wider text-neutral-300 uppercase">
            Speed Limit Meter
          </h2>
        </div>
        <span className="text-[11px] font-mono text-neutral-500">
          Increment: ±5 km/h
        </span>
      </div>

      {/* Main Meter with Left (+5km) and Right (-5km) Buttons */}
      <div className="grid grid-cols-3 items-center gap-2 sm:gap-4 my-3">
        {/* Left Button: Increase Limit by 5km */}
        <button
          id="btn-increase-limit"
          type="button"
          onClick={handleIncrease}
          aria-label="Increase speed limit by 5 km/h"
          className="h-16 sm:h-20 flex flex-col items-center justify-center bg-emerald-950/40 hover:bg-emerald-900/60 active:bg-emerald-800/80 border border-emerald-600/60 hover:border-emerald-500 text-emerald-300 rounded-xl transition-all shadow-md active:scale-95 group cursor-pointer"
        >
          <div className="flex items-center gap-1">
            <Plus className="w-6 h-6 text-emerald-400 group-hover:scale-110 transition-transform" />
            <span className="text-xl sm:text-2xl font-bold font-rajdhani">5</span>
          </div>
          <span className="text-[10px] sm:text-xs font-mono font-medium text-emerald-400/80 uppercase">
            +5 KM/H (Left)
          </span>
        </button>

        {/* Center: Circular European/International Standard Speed Limit Sign */}
        <div className="flex flex-col items-center justify-center">
          <div
            id="speed-limit-badge"
            className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-neutral-100 border-[6px] border-red-600 flex flex-col items-center justify-center shadow-[0_0_25px_rgba(220,38,38,0.35)] relative select-none"
          >
            <span
              className="text-center font-extrabold font-rajdhani text-neutral-950 tracking-tight leading-none"
              style={{
                fontSize: 'clamp(2.75rem, 10.5vw, 6rem)',
                fontVariantNumeric: 'tabular-nums',
                textAlign: 'center',
              }}
            >
              {speedLimit}
            </span>
            <span className="text-[10px] sm:text-xs font-bold text-neutral-700 uppercase tracking-tighter text-center">
              KM/H
            </span>
          </div>
          <span className="text-[11px] font-mono text-amber-400 font-medium mt-1.5 text-center">
            Alarm at {speedLimit - 2} km/h
          </span>
        </div>

        {/* Right Button: Decrease Limit by 5km */}
        <button
          id="btn-decrease-limit"
          type="button"
          onClick={handleDecrease}
          aria-label="Decrease speed limit by 5 km/h"
          className="h-16 sm:h-20 flex flex-col items-center justify-center bg-rose-950/40 hover:bg-rose-900/60 active:bg-rose-800/80 border border-rose-600/60 hover:border-rose-500 text-rose-300 rounded-xl transition-all shadow-md active:scale-95 group cursor-pointer"
        >
          <div className="flex items-center gap-1">
            <Minus className="w-6 h-6 text-rose-400 group-hover:scale-110 transition-transform" />
            <span className="text-xl sm:text-2xl font-bold font-rajdhani">5</span>
          </div>
          <span className="text-[10px] sm:text-xs font-mono font-medium text-rose-400/80 uppercase">
            -5 KM/H (Right)
          </span>
        </button>
      </div>

      {/* Slider for quick fluid tuning if desired */}
      <div className="w-full flex items-center gap-3 pt-1">
        <span className="text-[10px] font-mono text-neutral-500 w-8">10</span>
        <input
          id="speed-limit-slider"
          type="range"
          min="10"
          max="200"
          step="5"
          value={speedLimit}
          onChange={(e) => {
            soundAlarm.playClick();
            onSpeedLimitChange(Number(e.target.value));
          }}
          className="w-full h-2 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
        />
        <span className="text-[10px] font-mono text-neutral-500 w-8 text-right">200</span>
      </div>
    </div>
  );
};
