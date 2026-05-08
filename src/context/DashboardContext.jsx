import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { fetchISSPosition, fetchAstronauts, reverseGeocode } from '../services/issService';
import { calculateSpeed, formatTime } from '../utils/helpers';
import toast from 'react-hot-toast';

const DashboardContext = createContext();

const MAX_POSITIONS = 15;
const MAX_SPEEDS = 30;
const POLL_INTERVAL = 15000;

export function DashboardProvider({ children }) {
  // ISS State
  const [issPosition, setIssPosition] = useState(null);
  const [positions, setPositions] = useState([]);
  const [speeds, setSpeeds] = useState([]);
  const [nearestLocation, setNearestLocation] = useState('Calculating...');
  const [currentSpeed, setCurrentSpeed] = useState(0);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [issLoading, setIssLoading] = useState(true);
  const [issError, setIssError] = useState(null);
  const [isConnected, setIsConnected] = useState(true);

  // Astronauts State
  const [astronauts, setAstronauts] = useState({ count: 0, people: [] });
  const [astronautsLoading, setAstronautsLoading] = useState(true);

  // News State (shared across components)
  const [techNews, setTechNews] = useState([]);
  const [spaceNews, setSpaceNews] = useState([]);

  const prevPositionRef = useRef(null);
  const intervalRef = useRef(null);

  // Fetch ISS position
  const updateISSPosition = useCallback(async () => {
    try {
      const pos = await fetchISSPosition();
      setIssPosition(pos);
      setIssError(null);
      setIsConnected(true);
      setLastUpdated(pos.timestamp);

      // Calculate speed if we have a previous position
      if (prevPositionRef.current) {
        const speed = calculateSpeed(prevPositionRef.current, pos);
        // ISS speed is ~28,000 km/h; filter out unrealistic spikes
        const validSpeed = speed > 0 && speed < 50000 ? speed : currentSpeed;
        setCurrentSpeed(validSpeed);
        setSpeeds((prev) => {
          const newSpeeds = [
            ...prev,
            { time: formatTime(pos.timestamp), speed: validSpeed, timestamp: pos.timestamp },
          ];
          return newSpeeds.slice(-MAX_SPEEDS);
        });
      }

      prevPositionRef.current = pos;

      // Update positions trail
      setPositions((prev) => {
        const newPositions = [...prev, pos];
        return newPositions.slice(-MAX_POSITIONS);
      });

      // Reverse geocode (don't block the UI)
      reverseGeocode(pos.latitude, pos.longitude).then((location) => {
        setNearestLocation(location);
      });

      setIssLoading(false);
    } catch (error) {
      console.error('ISS fetch error:', error);
      setIssError('Failed to fetch ISS position');
      setIsConnected(false);
      setIssLoading(false);
    }
  }, [currentSpeed]);

  // Fetch astronauts
  const updateAstronauts = useCallback(async () => {
    try {
      setAstronautsLoading(true);
      const data = await fetchAstronauts();
      setAstronauts(data);
    } catch (error) {
      console.error('Astronaut fetch error:', error);
      toast.error('Failed to fetch astronaut data');
    } finally {
      setAstronautsLoading(false);
    }
  }, []);

  // Manual refresh
  const refreshISS = useCallback(() => {
    toast.promise(updateISSPosition(), {
      loading: 'Refreshing ISS data...',
      success: 'ISS position updated!',
      error: 'Failed to refresh ISS data',
    });
  }, [updateISSPosition]);

  // Initialize polling
  useEffect(() => {
    updateISSPosition();
    updateAstronauts();

    intervalRef.current = setInterval(updateISSPosition, POLL_INTERVAL);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [updateISSPosition, updateAstronauts]);

  const value = {
    // ISS
    issPosition,
    positions,
    speeds,
    nearestLocation,
    currentSpeed,
    lastUpdated,
    issLoading,
    issError,
    isConnected,
    refreshISS,
    // Astronauts
    astronauts,
    astronautsLoading,
    // News (shared)
    techNews,
    setTechNews,
    spaceNews,
    setSpaceNews,
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
}
