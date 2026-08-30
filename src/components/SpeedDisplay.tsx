import React from 'react';
import { AlarmStatus } from '../types';
import { AlertTriangle, ShieldCheck, Zap } from 'lucide-react';

interface SpeedDisplayProps {
  speed: number;
  speedLimit: number;
  alarmStatus: AlarmStatus;
  isHudMode: boolean;
}

export const SpeedDisplay: React.FC<SpeedDisplayProps> = ({
  speed,
  speedLimit,
  alarmStatus,
  isHudMode,
}) => {
  // Format speed to 3 digits (e.g. 000, 045, 120) or rounded integer
  const roundedSpeed = Math.max(0, Math.round(speed));
  const threeDigitSpeed = roundedSpeed.toString().padStart(3, '0');

  const isWarning = alarmStatus === 'warning';
  const isOverspeed = alarmStatus === 'overspeed';
  const isAlerting = isWarning || isOverspeed;

  // Visual warning message
  const warningDiff = speedLimit - speed;

  return (
    <div
      id="speed-display-section"
      className={`relative w-full flex flex-col items-center justify-between py-4 px-2 sm:px-6 transition-all duration-300 rounded-2xl border ${
        isOverspeed
          ? 'bg-red-950/40 border-red-600/80 shadow-[0_0_50px_rgba(239,68,68,0.35)]'
          : isWarning
          ? 'bg-amber-950/30 border-amber-500/70 shadow-[0_0_40px_rgba(245,158,11,0.25)]'
          : 'bg-neutral-900/80 border-neutral-800/80 shadow-inner'
      } ${isHudMode ? 'hud-mode' : ''}`}
      style={{ minHeight: '44vh' }}
    >
      {/* Top Banner Status within Display */}
      <div className="w-full flex items-center justify-between px-3 pt-1">
        <div className="flex items-center gap-2">
          {isOverspeed ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-600 text-white animate-pulse">
              <AlertTriangle className="w-3.5 h-3.5" />
              SPEED LIMIT EXCEEDED!
            </span>
          ) : isWarning ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500 text-neutral-950 animate-bounce">
              <Zap className="w-3.5 h-3.5" />
              NEAR LIMIT ALERT (-2 KM/H)
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-950/80 text-emerald-400 border border-emerald-800/60">
              <ShieldCheck className="w-3.5 h-3.5" />
              SAFE SPEED
            </span>
          )}
        </div>

        <div className="text-right">
          <span className="text-xs font-mono text-neutral-400 uppercase tracking-widest">
            Line No. 1
          </span>
        </div>
      </div>

      {/* Main 3-Digit Speed Display - 3/4 width of screen, large size */}
      <div className="my-auto flex flex-col items-center justify-center w-full">
        <div
          id="main-speed-digits-container"
          className="w-[75%] sm:w-[75%] max-w-xl mx-auto flex items-center justify-center relative py-1"
        >
          {/* Main Digits */}
          <div
            id="realtime-speed-digits"
            className={`font-rajdhani font-extrabold tracking-tight text-center select-none transition-colors duration-150 leading-none ${
              isOverspeed
                ? 'flash-danger text-red-500'
                : isWarning
                ? 'flash-warning text-amber-400'
                : 'text-emerald-400'
            }`}
            style={{
              fontSize: 'clamp(5.5rem, 21vw, 12rem)',
              textShadow: isOverspeed
                ? '0 0 40px rgba(239, 68, 68, 0.8)'
                : isWarning
                ? '0 0 35px rgba(245, 158, 11, 0.7)'
                : '0 0 25px rgba(52, 211, 153, 0.4)',
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {threeDigitSpeed}
          </div>
        </div>

        {/* Speed Unit and Limit Difference */}
        <div className="flex items-center gap-3 mt-1">
          <span
            className={`text-xl sm:text-2xl font-bold font-rajdhani tracking-widest ${
              isOverspeed
                ? 'text-red-400'
                : isWarning
                ? 'text-amber-300'
                : 'text-neutral-300'
            }`}
          >
            KM / H
          </span>

          <span className="text-xs text-neutral-500 font-mono">|</span>

          <span
            className={`text-xs sm:text-sm font-semibold font-mono ${
              isOverspeed
                ? 'text-red-400 font-bold'
                : isWarning
                ? 'text-amber-400'
                : 'text-neutral-400'
            }`}
          >
            {isOverspeed
              ? `+${Math.abs(Math.round((speed - speedLimit) * 10) / 10)} km/h OVER LIMIT`
              : isWarning
              ? `${Math.abs(Math.round(warningDiff * 10) / 10)} km/h to Limit (${speedLimit})`
              : `Limit: ${speedLimit} km/h`}
          </span>
        </div>
      </div>

      {/* Speed Bar Progress Indicator relative to Speed Limit */}
      <div className="w-full px-4 pb-2">
        <div className="w-full bg-neutral-950/80 rounded-full h-3 p-0.5 border border-neutral-800 overflow-hidden relative">
          {/* Speed Limit Marker on the bar */}
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-red-500 z-10 shadow-[0_0_8px_#ef4444]"
            style={{
              left: `${Math.min(100, (speedLimit / 160) * 100)}%`,
            }}
          />
          {/* -2km Warning Marker on the bar */}
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-amber-400 z-10 shadow-[0_0_8px_#f59e0b]"
            style={{
              left: `${Math.min(100, ((speedLimit - 2) / 160) * 100)}%`,
            }}
          />

          {/* Actual Fill Bar */}
          <div
            className={`h-full rounded-full transition-all duration-150 ${
              isOverspeed
                ? 'bg-gradient-to-r from-amber-500 via-red-500 to-red-600 animate-pulse'
                : isWarning
                ? 'bg-gradient-to-r from-emerald-500 via-amber-400 to-amber-500'
                : 'bg-gradient-to-r from-emerald-600 to-emerald-400'
            }`}
            style={{
              width: `${Math.min(100, Math.max(3, (speed / 160) * 100))}%`,
            }}
          />
        </div>

        <div className="flex justify-between items-center text-[10px] font-mono text-neutral-500 mt-1">
          <span>0</span>
          <span>50</span>
          <span className="text-amber-400/90 font-bold">
            Alert at: {speedLimit - 2} km/h
          </span>
          <span className="text-red-400 font-bold">Limit: {speedLimit}</span>
          <span>160+</span>
        </div>
      </div>
    </div>
  );
};
