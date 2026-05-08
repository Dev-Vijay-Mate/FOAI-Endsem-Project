import { useDashboard } from '../context/DashboardContext';
import { useTheme } from '../context/ThemeContext';
import StatCard from '../components/StatCard';
import ISSMap from '../components/ISSMap';
import AstronautPanel from '../components/AstronautPanel';
import SpeedChart from '../charts/SpeedChart';
import { StatSkeleton, MapSkeleton } from '../components/Skeletons';
import ErrorState from '../components/ErrorState';
import { formatDateTime } from '../utils/helpers';

/**
 * Main dashboard overview page
 */
export default function DashboardPage() {
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
      {/* Error banner */}
      {issError && (
        <ErrorState message={issError} onRetry={refreshISS} compact />
      )}

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {issLoading ? (
          <>
            <StatSkeleton />
            <StatSkeleton />
            <StatSkeleton />
            <StatSkeleton />
          </>
        ) : (
          <>
            <StatCard
              title="ISS Latitude"
              value={issPosition ? issPosition.latitude.toFixed(4) : '—'}
              icon="🌍"
              suffix="°"
              color="nebula"
              delay={0}
            />
            <StatCard
              title="ISS Longitude"
              value={issPosition ? issPosition.longitude.toFixed(4) : '—'}
              icon="🌐"
              suffix="°"
              color="cosmic"
              delay={100}
            />
            <StatCard
              title="Speed"
              value={currentSpeed}
              icon="⚡"
              suffix="km/h"
              color="aurora"
              delay={200}
            />
            <StatCard
              title="Astronauts in Space"
              value={astronauts.count}
              icon="👨‍🚀"
              color="solar"
              delay={300}
            />
          </>
        )}
      </div>

      {/* Info bar */}
      <div className={`flex flex-wrap items-center gap-4 px-4 py-3 rounded-xl text-xs
        ${theme === 'dark' ? 'bg-white/3 text-gray-400' : 'bg-gray-50 text-gray-500'}`}
      >
        <div className="flex items-center gap-2">
          <div className={isConnected ? 'status-online' : 'status-offline'} />
          <span>{isConnected ? 'Connected' : 'Disconnected'}</span>
        </div>
        <span>•</span>
        <span>📍 {nearestLocation}</span>
        <span>•</span>
        <span>🔄 {positions.length} positions tracked</span>
        {lastUpdated && (
          <>
            <span>•</span>
            <span>⏱️ Last: {formatDateTime(lastUpdated)}</span>
          </>
        )}
        <button
          onClick={refreshISS}
          className="ml-auto btn-ghost text-xs py-1 px-3"
        >
          🔄 Refresh
        </button>
      </div>

      {/* Map and Astronauts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {issLoading ? (
            <MapSkeleton />
          ) : (
            <ISSMap
              issPosition={issPosition}
              positions={positions}
              nearestLocation={nearestLocation}
            />
          )}
        </div>
        <div>
          <AstronautPanel astronauts={astronauts} loading={astronautsLoading} />
        </div>
      </div>

      {/* Speed chart */}
      {speeds.length > 1 && (
        <SpeedChart speeds={speeds} />
      )}
    </div>
  );
}
