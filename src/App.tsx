import { useState, useEffect, useMemo } from 'react';
import { useGeolocation } from './hooks/useGeolocation';
import { soundAlarm } from './services/sound';
import { AlarmStatus } from './types';
import { SpeedDisplay } from './components/SpeedDisplay';
import { SpeedLimitControl } from './components/SpeedLimitControl';
import { PresetButtons } from './components/PresetButtons';
import { GpsControls } from './components/GpsControls';
import { TripStats } from './components/TripStats';
import { Radio } from 'lucide-react';

export default function App() {
  // Speed Limit setup: default 60 km/h
  const [speedLimit, setSpeedLimit] = useState<number>(60);
  const [isAudioMuted, setIsAudioMuted] = useState<boolean>(false);
  const [isHudMode, setIsHudMode] = useState<boolean>(false);
  const [isSimulated, setIsSimulated] = useState<boolean>(false);

  // GPS tracking & simulation hook
  const {
    gpsStatus,
    location,
    activeSpeed,
    simulatedSpeed,
    setSimulatedSpeed,
    tripStats,
    resetTrip,
  } = useGeolocation(isSimulated);

  // Alarm Status computation:
  // Rule: "when ever the actual speed is about to reach the speed limit by 2km less then alarm should start and real time speed starts flashing"
  const alarmStatus: AlarmStatus = useMemo(() => {
    if (activeSpeed <= 0) return 'normal';
    if (activeSpeed >= speedLimit) {
      return 'overspeed';
    }
    if (activeSpeed >= speedLimit - 2) {
      return 'warning'; // 2km less than speed limit triggers alarm and flashing!
    }
    return 'normal';
  }, [activeSpeed, speedLimit]);

  // Sync sound alarm with status
  useEffect(() => {
    soundAlarm.setMuted(isAudioMuted);
    soundAlarm.setAlarmState(alarmStatus);

    return () => {
      soundAlarm.stopAlarm();
    };
  }, [alarmStatus, isAudioMuted]);

  const handleToggleAudio = () => {
    const nextMuted = !isAudioMuted;
    setIsAudioMuted(nextMuted);
    soundAlarm.setMuted(nextMuted);
    if (!nextMuted) {
      soundAlarm.playClick();
    }
  };

  const handleToggleSimulator = () => {
    setIsSimulated((prev) => !prev);
    soundAlarm.playClick();
  };

  const handleToggleHud = () => {
    setIsHudMode((prev) => !prev);
  };

  return (
    <div
      id="app-root-container"
      className={`min-h-screen bg-neutral-950 text-neutral-100 flex flex-col items-center justify-start p-2 sm:p-4 md:p-6 transition-colors duration-300 ${
        alarmStatus === 'overspeed'
          ? 'screen-alert-danger'
          : alarmStatus === 'warning'
          ? 'screen-alert-warning'
          : ''
      }`}
    >
      <div className="w-full max-w-4xl flex flex-col gap-3 sm:gap-4 flex-1">
        {/* App Title & Live Telemetry Header */}
        <header className="flex items-center justify-between px-2 py-1">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <h1 className="text-sm sm:text-base font-bold font-rajdhani tracking-wider text-neutral-200 uppercase">
              GPS Speedometer & Speed Alert
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 text-[11px] font-mono text-neutral-400 bg-neutral-900 px-2 py-1 rounded-md border border-neutral-800">
              <Radio className="w-3 h-3 text-emerald-400" />
              <span>Real-Time GPS</span>
            </span>
          </div>
        </header>

        {/* SECTION 1: LINE NO. 1 - Large 3-Digit Speed Display (Upper Half of Screen) */}
        <section id="line-1-speed-display" className="w-full">
          <SpeedDisplay
            speed={activeSpeed}
            speedLimit={speedLimit}
            alarmStatus={alarmStatus}
            isHudMode={isHudMode}
          />
        </section>

        {/* SECTION 2: SPEED LIMIT METER - User controls (+5km Left, -5km Right) */}
        <section id="line-2-speed-limit" className="w-full">
          <SpeedLimitControl
            speedLimit={speedLimit}
            onSpeedLimitChange={setSpeedLimit}
            isHudMode={isHudMode}
          />
        </section>

        {/* SECTION 3: PRESET BUTTONS (30, 40, 50, ... up to 150 km/h) */}
        <section id="line-3-presets" className="w-full">
          <PresetButtons
            currentLimit={speedLimit}
            onSelectLimit={setSpeedLimit}
            isHudMode={isHudMode}
          />
        </section>

        {/* SECTION 4: GPS Controls & Simulation Mode */}
        <section id="line-4-gps-controls" className="w-full">
          <GpsControls
            gpsStatus={gpsStatus}
            location={location}
            isAudioMuted={isAudioMuted}
            onToggleAudio={handleToggleAudio}
            isHudMode={isHudMode}
            onToggleHud={handleToggleHud}
            isSimulated={isSimulated}
            onToggleSimulator={handleToggleSimulator}
            simulatedSpeed={simulatedSpeed}
            onSimulatedSpeedChange={setSimulatedSpeed}
            speedLimit={speedLimit}
            onResetTrip={resetTrip}
          />
        </section>

        {/* Trip Stats Footer Bar */}
        <footer className="w-full mt-auto pb-2">
          <TripStats
            stats={tripStats}
            currentAltitude={location.altitude}
            isHudMode={isHudMode}
          />
        </footer>
      </div>
    </div>
  );
}
