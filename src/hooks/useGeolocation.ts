import { useState, useEffect, useRef, useCallback } from 'react';
import { GpsStatus, LocationData, TripStats } from '../types';

function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function useGeolocation(isSimulated: boolean) {
  const [gpsStatus, setGpsStatus] = useState<GpsStatus>('idle');
  const [location, setLocation] = useState<LocationData>({
    latitude: null,
    longitude: null,
    altitude: null,
    heading: null,
    accuracy: null,
    speedKmh: 0,
    timestamp: Date.now(),
  });

  const [simulatedSpeed, setSimulatedSpeed] = useState<number>(0);

  const [tripStats, setTripStats] = useState<TripStats>({
    maxSpeedKmh: 0,
    avgSpeedKmh: 0,
    totalDistanceKm: 0,
    startTime: null,
    totalSeconds: 0,
  });

  const prevLocationRef = useRef<{ lat: number; lon: number; time: number } | null>(null);
  const speedSamplesRef = useRef<number[]>([]);
  const wakeLockRef = useRef<WakeLockSentinel | null>(null);
  const watchIdRef = useRef<number | null>(null);

  // Screen WakeLock for Android/Mobile
  const requestWakeLock = useCallback(async () => {
    try {
      if ('wakeLock' in navigator) {
        wakeLockRef.current = await navigator.wakeLock.request('screen');
      }
    } catch {
      // Wake lock request failed (usually due to low battery or background tab)
    }
  }, []);

  // Update Trip Stats
  const recordSpeedForStats = useCallback((speedKmh: number, distanceDeltaKm: number = 0) => {
    setTripStats((prev) => {
      const now = Date.now();
      const startTime = prev.startTime || now;
      const totalSeconds = Math.floor((now - startTime) / 1000);
      const maxSpeedKmh = Math.max(prev.maxSpeedKmh, speedKmh);
      const totalDistanceKm = prev.totalDistanceKm + distanceDeltaKm;
      
      if (speedKmh > 0.5) {
        speedSamplesRef.current.push(speedKmh);
        // keep reasonable buffer
        if (speedSamplesRef.current.length > 500) {
          speedSamplesRef.current.shift();
        }
      }

      const sumSpeed = speedSamplesRef.current.reduce((a, b) => a + b, 0);
      const avgSpeedKmh =
        speedSamplesRef.current.length > 0
          ? sumSpeed / speedSamplesRef.current.length
          : prev.avgSpeedKmh;

      return {
        maxSpeedKmh,
        avgSpeedKmh,
        totalDistanceKm,
        startTime,
        totalSeconds,
      };
    });
  }, []);

  // Reset Trip Stats
  const resetTrip = useCallback(() => {
    speedSamplesRef.current = [];
    prevLocationRef.current = null;
    setTripStats({
      maxSpeedKmh: 0,
      avgSpeedKmh: 0,
      totalDistanceKm: 0,
      startTime: Date.now(),
      totalSeconds: 0,
    });
  }, []);

  // Real GPS Watcher
  useEffect(() => {
    if (isSimulated) {
      setGpsStatus('simulated');
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
      return;
    }

    if (!('geolocation' in navigator)) {
      setGpsStatus('error');
      return;
    }

    setGpsStatus('searching');
    requestWakeLock();

    const handleSuccess = (position: GeolocationPosition) => {
      const { latitude, longitude, altitude, heading, accuracy, speed } = position.coords;
      setGpsStatus('active');

      let currentSpeedKmh = 0;

      // coords.speed is in meters/second if provided by GPS hardware
      if (speed !== null && speed >= 0) {
        currentSpeedKmh = speed * 3.6;
      } else if (prevLocationRef.current) {
        // Fallback: Compute speed from coordinates delta
        const timeDiffSeconds = (position.timestamp - prevLocationRef.current.time) / 1000;
        if (timeDiffSeconds > 0 && timeDiffSeconds < 15) {
          const distKm = calculateDistanceKm(
            prevLocationRef.current.lat,
            prevLocationRef.current.lon,
            latitude,
            longitude
          );
          currentSpeedKmh = (distKm / timeDiffSeconds) * 3600;
        }
      }

      // Filter GPS jitter at rest (< 1.5 km/h considered stationary)
      if (currentSpeedKmh < 1.5) {
        currentSpeedKmh = 0;
      }

      let distDelta = 0;
      if (prevLocationRef.current) {
        distDelta = calculateDistanceKm(
          prevLocationRef.current.lat,
          prevLocationRef.current.lon,
          latitude,
          longitude
        );
        // ignore noise
        if (distDelta < 0.002 && currentSpeedKmh === 0) {
          distDelta = 0;
        }
      }

      prevLocationRef.current = {
        lat: latitude,
        lon: longitude,
        time: position.timestamp,
      };

      setLocation({
        latitude,
        longitude,
        altitude,
        heading,
        accuracy,
        speedKmh: Math.round(currentSpeedKmh * 10) / 10,
        timestamp: position.timestamp,
      });

      recordSpeedForStats(currentSpeedKmh, distDelta);
    };

    const handleError = (error: GeolocationPositionError) => {
      if (error.code === error.PERMISSION_DENIED) {
        setGpsStatus('denied');
      } else {
        setGpsStatus('error');
      }
    };

    const options: PositionOptions = {
      enableHighAccuracy: true,
      maximumAge: 0,
      timeout: 10000,
    };

    watchIdRef.current = navigator.geolocation.watchPosition(
      handleSuccess,
      handleError,
      options
    );

    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, [isSimulated, recordSpeedForStats, requestWakeLock]);

  // Handle Simulated Speed Changes
  useEffect(() => {
    if (isSimulated) {
      setLocation((prev) => ({
        ...prev,
        speedKmh: simulatedSpeed,
        timestamp: Date.now(),
      }));
      recordSpeedForStats(simulatedSpeed, (simulatedSpeed / 3600) * 1);
    }
  }, [isSimulated, simulatedSpeed, recordSpeedForStats]);

  const activeSpeed = isSimulated ? simulatedSpeed : location.speedKmh;

  return {
    gpsStatus,
    location,
    activeSpeed,
    simulatedSpeed,
    setSimulatedSpeed,
    tripStats,
    resetTrip,
    requestWakeLock,
  };
}
