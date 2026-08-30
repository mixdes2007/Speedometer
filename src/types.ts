export type AlarmStatus = 'normal' | 'warning' | 'overspeed';

export type GpsStatus = 'idle' | 'searching' | 'active' | 'denied' | 'error' | 'simulated';

export interface LocationData {
  latitude: number | null;
  longitude: number | null;
  altitude: number | null;
  heading: number | null;
  accuracy: number | null;
  speedKmh: number;
  timestamp: number;
}

export interface TripStats {
  maxSpeedKmh: number;
  avgSpeedKmh: number;
  totalDistanceKm: number;
  startTime: number | null;
  totalSeconds: number;
}

export interface SpeedometerConfig {
  speedLimitKmh: number;
  alarmEnabled: boolean;
  soundVolume: number;
  isHudMode: boolean;
  isSimulated: boolean;
  unit: 'km/h' | 'mph';
}
