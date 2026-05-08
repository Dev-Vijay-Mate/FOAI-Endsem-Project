import { useDashboard } from '../context/DashboardContext';
import { useTheme } from '../context/ThemeContext';
import ISSMap from '../components/ISSMap';
import AstronautPanel from '../components/AstronautPanel';
import StatCard from '../components/StatCard';
import SpeedChart from '../charts/SpeedChart';
import ErrorState from '../components/ErrorState';
import { MapSkeleton, StatSkeleton } from '../components/Skeletons';
import { formatDateTime } from '../utils/helpers';

/**
 * Dedicated ISS Tracking page with full details
 */
export default function ISSPage() {
  const { theme } = useTheme();
  const {
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
    astronauts,
    astronautsLoading,
  } = useDashboard();

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            🛰️ ISS Live Tracker
          </h2>
          <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
            Real-time International Space Station tracking with trajectory visualization
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium
            ${isConnected
              ? theme === 'dark' ? 'bg-aurora-500/10 text-aurora-400' : 'bg-green-50 text-green-600'
              : theme === 'dark' ? 'bg-danger-500/10 text-danger-400' : 'bg-red-50 text-red-600'
            }`}
          >
            <div className={isConnected ? 'status-online' : 'status-offline'} />
            {isConnected ? 'Live Tracking' : 'Reconnecting...'}
          </div>
          <button onClick={refreshISS} className="btn-primary text-sm">
            🔄 Refresh
          </button>
        </div>
      </div>

      {issError && <ErrorState message={issError} onRetry={refreshISS} compact />}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {issLoading ? (
          Array.from({ length: 5 }).map((_, i) => <StatSkeleton key={i} />)
        ) : (
          <>
            <StatCard title="Latitude" value={issPosition?.latitude.toFixed(4) || '—'} icon="🌍" suffix="°" color="nebula" delay={0} />
            <StatCard title="Longitude" value={issPosition?.longitude.toFixed(4) || '—'} icon="🌐" suffix="°" color="cosmic" delay={50} />
            <StatCard title="Speed" value={currentSpeed} icon="⚡" suffix="km/h" color="aurora" delay={100} />
            <StatCard title="Tracked Points" value={positions.length} icon="📌" color="solar" delay={150} />
            <StatCard title="Astronauts" value={astronauts.count} icon="👨‍🚀" color="nebula" delay={200} />
          </>
        )}
      </div>

      {/* Location bar */}
      <div className={`glass-card px-5 py-3 flex flex-wrap items-center gap-4 text-sm
        ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}
      >
        <span className="font-semibold">📍 Current Location:</span>
        <span className={`${theme === 'dark' ? 'text-cosmic-300' : 'text-cyan-600'}`}>
          {nearestLocation}
        </span>
        <span className="ml-auto text-xs font-mono text-gray-500">
          {lastUpdated ? `Updated: ${formatDateTime(lastUpdated)}` : 'Waiting for data...'}
        </span>
      </div>

      {/* Map */}
      {issLoading ? (
        <MapSkeleton />
      ) : (
        <ISSMap issPosition={issPosition} positions={positions} nearestLocation={nearestLocation} />
      )}

      {/* Speed chart and Astronauts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SpeedChart speeds={speeds} />
        <AstronautPanel astronauts={astronauts} loading={astronautsLoading} />
      </div>
    </div>
  );
}
