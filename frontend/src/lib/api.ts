// API calls are made to Next.js API routes (no external backend needed)

export interface Location {
  name: string;
  region: string;
  country: string;
  lat: number;
  lon: number;
  tz_id: string;
  localtime_epoch: number;
  localtime: string;
}

export interface Condition {
  text: string;
  icon: string;
  code: number;
}

export interface AirQuality {
  co: number;
  no2: number;
  o3: number;
  so2: number;
  pm2_5: number;
  pm10: number;
  'us-epa-index': number;
  'gb-defra-index': number;
}

export interface CurrentWeather {
  last_updated: string;
  temp_c: number;
  temp_f: number;
  is_day: number;
  condition: Condition;
  wind_mph: number;
  wind_kph: number;
  wind_degree: number;
  wind_dir: string;
  pressure_mb: number;
  precip_mm: number;
  humidity: number;
  cloud: number;
  feelslike_c: number;
  feelslike_f: number;
  vis_km: number;
  uv: number;
  gust_kph: number;
  air_quality?: AirQuality;
}

export interface DayForecast {
  maxtemp_c: number;
  maxtemp_f: number;
  mintemp_c: number;
  mintemp_f: number;
  avgtemp_c: number;
  avgtemp_f: number;
  maxwind_kph: number;
  totalprecip_mm: number;
  avghumidity: number;
  daily_chance_of_rain: number;
  daily_chance_of_snow: number;
  condition: Condition;
  uv: number;
}

export interface HourForecast {
  time: string;
  time_epoch: number;
  temp_c: number;
  temp_f: number;
  condition: Condition;
  wind_kph: number;
  wind_dir: string;
  humidity: number;
  feelslike_c: number;
  chance_of_rain: number;
  is_day: number;
}

export interface Astro {
  sunrise: string;
  sunset: string;
  moonrise: string;
  moonset: string;
  moon_phase: string;
  moon_illumination: number;
}

export interface ForecastDay {
  date: string;
  date_epoch: number;
  day: DayForecast;
  astro: Astro;
  hour: HourForecast[];
}

export interface Alert {
  headline: string;
  severity: string;
  urgency: string;
  event: string;
  effective: string;
  expires: string;
  desc: string;
}

export interface WeatherResponse {
  location: Location;
  current: CurrentWeather;
}

export interface ForecastResponse {
  location: Location;
  current: CurrentWeather;
  forecast: {
    forecastday: ForecastDay[];
  };
  alerts?: {
    alert: Alert[];
  };
}

export interface SearchResult {
  id: number;
  name: string;
  region: string;
  country: string;
  lat: number;
  lon: number;
  url: string;
}

async function fetchAPI<T>(endpoint: string, params: Record<string, string> = {}): Promise<T> {
  const url = new URL(endpoint, window.location.origin);
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.append(key, value);
  });

  const res = await fetch(url.toString());
  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(error.error || error.detail || `HTTP ${res.status}`);
  }
  return res.json();
}

export async function getCurrentWeather(query: string): Promise<WeatherResponse> {
  return fetchAPI<WeatherResponse>('/api/weather/current', { q: query, aqi: 'yes' });
}

export async function getForecast(query: string, days: number = 3): Promise<ForecastResponse> {
  return fetchAPI<ForecastResponse>('/api/weather/forecast', {
    q: query,
    days: days.toString(),
    aqi: 'yes',
    alerts: 'yes',
  });
}

export async function searchLocations(query: string): Promise<SearchResult[]> {
  return fetchAPI<SearchResult[]>('/api/weather/search', { q: query });
}
