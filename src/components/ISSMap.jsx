import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useTheme } from '../context/ThemeContext';

// Custom ISS icon
const issIcon = L.divIcon({
  className: 'iss-marker-icon',
  html: `<div style="
    font-size: 32px;
    filter: drop-shadow(0 0 12px rgba(6, 182, 212, 0.8));
    animation: orbit-glow 2s infinite;
  ">🛰️</div>`,
  iconSize: [40, 40],
  iconAnchor: [20, 20],
  popupAnchor: [0, -20],
});

// Trail dot icon
const dotIcon = L.divIcon({
  className: '',
  html: `<div style="
    width: 6px;
    height: 6px;
    background: rgba(124, 58, 237, 0.6);
    border-radius: 50%;
    box-shadow: 0 0 6px rgba(124, 58, 237, 0.4);
  "></div>`,
  iconSize: [6, 6],
  iconAnchor: [3, 3],
});

/**
 * Component to smoothly recenter map on ISS position
 */
function MapRecenter({ position }) {
  const map = useMap();
  const isFirstRef = useRef(true);

  useEffect(() => {
    if (position) {
      if (isFirstRef.current) {
        map.setView([position.latitude, position.longitude], 3, { animate: false });
        isFirstRef.current = false;
      } else {
        map.panTo([position.latitude, position.longitude], { animate: true, duration: 1 });
      }
    }
  }, [position, map]);

  return null;
}

/**
 * Interactive ISS tracking map with trajectory
 */
export default function ISSMap({ issPosition, positions, nearestLocation }) {
  const { theme } = useTheme();

  const tileUrl = theme === 'dark'
    ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
    : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';

  // Build polyline path from positions
  const pathCoords = positions.map((p) => [p.latitude, p.longitude]);

  if (!issPosition) return null;

  return (
    <div className="glass-card p-4 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          🗺️ ISS Live Position
        </h3>
        <div className={`flex items-center gap-2 text-xs font-mono
          ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}
        >
          <div className="status-online" />
          Tracking
        </div>
      </div>

      <div className="map-container">
        <MapContainer
          center={[issPosition.latitude, issPosition.longitude]}
          zoom={3}
          scrollWheelZoom={true}
          style={{ height: '100%', width: '100%' }}
          zoomControl={true}
        >
          <TileLayer
            url={tileUrl}
            attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          />

          <MapRecenter position={issPosition} />

          {/* Trajectory path */}
          {pathCoords.length > 1 && (
            <Polyline
              positions={pathCoords}
              pathOptions={{
                color: '#7c3aed',
                weight: 2,
                opacity: 0.6,
                dashArray: '8, 8',
              }}
            />
          )}

          {/* Trail dots */}
          {positions.slice(0, -1).map((pos, idx) => (
            <Marker
              key={`trail-${idx}`}
              position={[pos.latitude, pos.longitude]}
              icon={dotIcon}
            />
          ))}

          {/* ISS marker */}
          <Marker
            position={[issPosition.latitude, issPosition.longitude]}
            icon={issIcon}
          >
            <Popup>
              <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', lineHeight: 1.6 }}>
                <strong style={{ fontSize: '14px' }}>🛰️ International Space Station</strong>
                <br />
                <span>Lat: {issPosition.latitude.toFixed(4)}°</span>
                <br />
                <span>Lon: {issPosition.longitude.toFixed(4)}°</span>
                <br />
                <span>📍 {nearestLocation}</span>
              </div>
            </Popup>
          </Marker>
        </MapContainer>
      </div>
    </div>
  );
}
