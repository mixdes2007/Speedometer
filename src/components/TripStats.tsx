import React from 'react';
import { TripStats as TripStatsType } from '../types';
import { Flame, Activity, Compass, Clock } from 'lucide-react';

interface TripStatsProps {
  stats: TripStatsType;
  currentAltitude: number | null;
  isHudMode: boolean;
}

function formatDuration(totalSeconds: number): string {
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  const hrs = Math.floor(mins / 60);
  const displayMins = mins % 60;

  if (hrs > 0) {
    return `${hrs}h ${displayMins.toString().padStart(2, '0')}m`;
  }
  return `${displayMins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export const TripStats: React.FC<TripStatsProps> = ({
  stats,
  currentAltitude,
  isHudMode,
}) => {
  return (
    <div
      id="trip-stats-bar"
      className={`w-full grid grid-cols-2 sm:grid-cols-4 gap-2 bg-neutral-900/60 border border-neutral-800/80 rounded-xl p-3 ${
        isHudMode ? 'hud-mode' : ''
      }`}
    >
      {/* Max Speed */}
      <div className="flex items-center gap-2.5 px-2 py-1 bg-neutral-950/60 rounded-lg border border-neutral-800/50">
        <div className="p-1.5 rounded-md bg-red-950/40 text-red-400">
          <Flame className="w-4 h-4" />
        </div>
        <div>
          <div className="text-[10px] font-mono text-neutral-400 uppercase">Max Speed</div>
          <div className="text-sm font-bold font-rajdhani text-neutral-100">
            {Math.round(stats.maxSpeedKmh * 10) / 10}{' '}
            <span className="text-[10px] text-neutral-400">km/h</span>
          </div>
        </div>
      </div>

      {/* Avg Speed */}
      <div className="flex items-center gap-2.5 px-2 py-1 bg-neutral-950/60 rounded-lg border border-neutral-800/50">
        <div className="p-1.5 rounded-md bg-emerald-950/40 text-emerald-400">
          <Activity className="w-4 h-4" />
        </div>
        <div>
          <div className="text-[10px] font-mono text-neutral-400 uppercase">Avg Speed</div>
          <div className="text-sm font-bold font-rajdhani text-neutral-100">
            {Math.round(stats.avgSpeedKmh * 10) / 10}{' '}
            <span className="text-[10px] text-neutral-400">km/h</span>
          </div>
        </div>
      </div>

      {/* Distance */}
      <div className="flex items-center gap-2.5 px-2 py-1 bg-neutral-950/60 rounded-lg border border-neutral-800/50">
        <div className="p-1.5 rounded-md bg-indigo-950/40 text-indigo-400">
          <Compass className="w-4 h-4" />
        </div>
        <div>
          <div className="text-[10px] font-mono text-neutral-400 uppercase">Distance</div>
          <div className="text-sm font-bold font-rajdhani text-neutral-100">
            {stats.totalDistanceKm < 1
              ? `${Math.round(stats.totalDistanceKm * 1000)} m`
              : `${stats.totalDistanceKm.toFixed(2)} km`}
          </div>
        </div>
      </div>

      {/* Trip Duration / Altitude */}
      <div className="flex items-center gap-2.5 px-2 py-1 bg-neutral-950/60 rounded-lg border border-neutral-800/50">
        <div className="p-1.5 rounded-md bg-amber-950/40 text-amber-400">
          <Clock className="w-4 h-4" />
        </div>
        <div>
          <div className="text-[10px] font-mono text-neutral-400 uppercase">Trip Time</div>
          <div className="text-sm font-bold font-rajdhani text-neutral-100">
            {formatDuration(stats.totalSeconds)}
            {currentAltitude !== null && (
              <span className="text-[10px] text-neutral-400 ml-1">
                ({Math.round(currentAltitude)}m alt)
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
