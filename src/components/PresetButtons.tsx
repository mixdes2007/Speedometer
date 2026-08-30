import React from 'react';
import { BookmarkCheck } from 'lucide-react';
import { soundAlarm } from '../services/sound';

interface PresetButtonsProps {
  currentLimit: number;
  onSelectLimit: (limit: number) => void;
  isHudMode: boolean;
}

const PRESET_LIMITS = [30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150];

export const PresetButtons: React.FC<PresetButtonsProps> = ({
  currentLimit,
  onSelectLimit,
  isHudMode,
}) => {
  return (
    <div
      id="preset-buttons-section"
      className={`w-full bg-neutral-900/90 border border-neutral-800 rounded-2xl p-4 sm:p-5 shadow-lg ${
        isHudMode ? 'hud-mode' : ''
      }`}
    >
      {/* Section Header */}
      <div className="flex items-center justify-between pb-3 border-b border-neutral-800/80 mb-3">
        <div className="flex items-center gap-2">
          <BookmarkCheck className="w-4 h-4 text-emerald-400" />
          <h2 className="text-xs sm:text-sm font-semibold tracking-wider text-neutral-300 uppercase">
            Quick Speed Presets (30 - 150 km/h)
          </h2>
        </div>
        <span className="text-[11px] font-mono text-neutral-500">
          13 Quick Limits
        </span>
      </div>

      {/* Grid of Preset Buttons: 30km up to 150km */}
      <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
        {PRESET_LIMITS.map((limit) => {
          const isSelected = currentLimit === limit;
          return (
            <button
              key={limit}
              id={`preset-btn-${limit}`}
              type="button"
              onClick={() => {
                soundAlarm.playClick();
                onSelectLimit(limit);
              }}
              className={`py-2 px-1.5 rounded-xl font-rajdhani font-bold text-center transition-all flex flex-col items-center justify-center cursor-pointer active:scale-95 border ${
                isSelected
                  ? 'bg-emerald-500 text-neutral-950 border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.5)] scale-[1.03]'
                  : 'bg-neutral-950/70 hover:bg-neutral-800/90 text-neutral-200 border-neutral-800 hover:border-neutral-700'
              }`}
            >
              <span
                className="leading-none text-center font-extrabold"
                style={{
                  fontSize: 'clamp(1.35rem, 5.25vw, 3rem)',
                  fontVariantNumeric: 'tabular-nums',
                  textAlign: 'center',
                }}
              >
                {limit}
              </span>
              <span
                className={`text-[9px] sm:text-[10px] font-mono uppercase mt-0.5 text-center ${
                  isSelected ? 'text-neutral-900 font-bold' : 'text-neutral-500'
                }`}
              >
                km/h
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
