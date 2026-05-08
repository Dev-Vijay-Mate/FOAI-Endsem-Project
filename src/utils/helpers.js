/**
 * Haversine formula to calculate distance between two coordinates in km
 */
export function haversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(deg) {
  return deg * (Math.PI / 180);
}

/**
 * Calculate speed (km/h) between two coordinate/timestamp pairs
 */
export function calculateSpeed(prev, current) {
  if (!prev || !current) return 0;
  const distKm = haversineDistance(
    prev.latitude, prev.longitude,
    current.latitude, current.longitude
  );
  const timeDiffHours = (current.timestamp - prev.timestamp) / 3600;
  if (timeDiffHours <= 0) return 0;
  return Math.round(distKm / timeDiffHours);
}

/**
 * Format a Unix timestamp to readable time
 */
export function formatTime(timestamp) {
  return new Date(timestamp * 1000).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
}

/**
 * Format a Unix timestamp to readable date + time
 */
export function formatDateTime(timestamp) {
  return new Date(timestamp * 1000).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
}

/**
 * Format an ISO date string
 */
export function formatISODate(isoString) {
  if (!isoString) return 'Unknown';
  const date = new Date(isoString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

/**
 * Truncate string to maxLength chars
 */
export function truncate(str, maxLength = 120) {
  if (!str) return '';
  return str.length > maxLength ? str.slice(0, maxLength) + '…' : str;
}

/**
 * localStorage cache helpers
 */
export const cache = {
  set(key, data, ttlMs = 15 * 60 * 1000) {
    const item = {
      data,
      timestamp: Date.now(),
      ttl: ttlMs,
    };
    try {
      localStorage.setItem(key, JSON.stringify(item));
    } catch (e) {
      console.warn('Cache write failed:', e);
    }
  },

  get(key) {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return null;
      const item = JSON.parse(raw);
      if (Date.now() - item.timestamp > item.ttl) {
        localStorage.removeItem(key);
        return null;
      }
      return item.data;
    } catch {
      return null;
    }
  },

  remove(key) {
    localStorage.removeItem(key);
  },
};

/**
 * Animated counter value hook helper
 */
export function animateValue(start, end, duration, callback) {
  const startTime = performance.now();
  function step(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
    const current = Math.round(start + (end - start) * eased);
    callback(current);
    if (progress < 1) {
      requestAnimationFrame(step);
    }
  }
  requestAnimationFrame(step);
}
