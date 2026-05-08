import axios from 'axios';

// Use Vite proxy to avoid CORS issues
const ISS_POSITION_URL = '/api/iss/iss-now.json';
const ASTROS_URL = '/api/iss/astros.json';
const NOMINATIM_URL = '/api/nominatim/reverse';

/**
 * Fetch current ISS position
 */
export async function fetchISSPosition() {
  const response = await axios.get(ISS_POSITION_URL);
  const { iss_position, timestamp } = response.data;
  return {
    latitude: parseFloat(iss_position.latitude),
    longitude: parseFloat(iss_position.longitude),
    timestamp,
  };
}

/**
 * Fetch astronauts currently in space
 */
export async function fetchAstronauts() {
  const response = await axios.get(ASTROS_URL);
  return {
    count: response.data.number,
    people: response.data.people,
  };
}

/**
 * Reverse geocode coordinates to get nearest location name
 */
export async function reverseGeocode(lat, lon) {
  try {
    const response = await axios.get(NOMINATIM_URL, {
      params: {
        lat,
        lon,
        format: 'json',
        zoom: 5,
        addressdetails: 1,
      },
      headers: {
        'User-Agent': 'SpacePulseDashboard/1.0',
      },
    });
    if (response.data && response.data.display_name) {
      return response.data.display_name;
    }
    return getOceanName(lat, lon);
  } catch {
    return getOceanName(lat, lon);
  }
}

/**
 * Approximate ocean name based on coordinates
 */
function getOceanName(lat, lon) {
  const latN = parseFloat(lat);
  const lonN = parseFloat(lon);

  if (latN > 60) return 'Arctic Ocean';
  if (latN < -60) return 'Southern Ocean';

  if (lonN >= -80 && lonN <= 0 && latN >= 0) return 'North Atlantic Ocean';
  if (lonN >= -80 && lonN <= 20 && latN < 0) return 'South Atlantic Ocean';

  if (lonN >= 20 && lonN <= 100 && latN < 0) return 'Indian Ocean';
  if (lonN >= 40 && lonN <= 100 && latN >= 0 && latN <= 30) return 'Indian Ocean';

  if ((lonN >= 100 || lonN <= -80) && latN >= 0) return 'North Pacific Ocean';
  if ((lonN >= 100 || lonN <= -80) && latN < 0) return 'South Pacific Ocean';

  return 'Over Ocean';
}
