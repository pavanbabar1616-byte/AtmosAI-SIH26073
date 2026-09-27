const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export interface Station {
  station_id: string;
  name: string;
  state: string;
  lat: number;
  lon: number;
  elevation_m: number;
}

export interface WeatherReading {
  timestamp: string;
  temperature: number | null;
  pressure: number | null;
  humidity: number | null;
  wind_speed: number | null;
  is_anomaly: boolean;
  anomaly_type: string | null;
}

export interface Anomaly {
  station_id: string;
  station_name: string;
  state: string;
  lat: number;
  lon: number;
  timestamp: string;
  type: string;
  temperature: number | null;
  pressure: number | null;
  humidity: number | null;
  severity: "high" | "medium" | "low";
  index: number;
}

export interface StationHealth {
  station_id: string;
  name: string;
  state: string;
  lat: number;
  lon: number;
  anomalies: number;
  health: number;
  total_readings: number;
  avg_temperature: number;
}

export interface DashboardStats {
  total_stations: number;
  total_anomalies: number;
  total_data_points: number;
  by_type: Record<string, number>;
  by_severity: Record<string, number>;
  by_state: Record<string, number>;
  station_health: StationHealth[];
}

export interface AnomalyDetail {
  station: Station;
  data_point: WeatherReading;
  detection: {
    is_anomaly: boolean;
    confidence: number;
    raw_score: number;
    type: string | null;
  };
  explanation: {
    station_id: string;
    timestamp: string;
    top_features: Array<{
      feature: string;
      contribution: number;
      severity: string;
      reason: string;
    }>;
    overall_reason: string;
    severity: string;
  };
  correction: {
    original: Record<string, number | null>;
    corrected: Record<string, number | null>;
    method: string;
    confidence: number;
  };
  trust: {
    trust_score: number;
    confidence: number;
    explanation_strength: number;
  };
  context_window: WeatherReading[];
  data_index: number;
}

const BASE_HEADERS = {
  "Content-Type": "application/json",
  "ngrok-skip-browser-warning": "true",
};

async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: { ...BASE_HEADERS, ...options?.headers },
  });
  if (!res.ok) throw new Error(`API error: ${res.statusText}`);
  return res.json();
}

export const api = {
  getHealth: () => request<{ status: string; stations_trained: number }>("/health"),
  getStations: () => request<Station[]>("/api/v1/stations"),
  getStation: (id: string) => request<Station>(`/api/v1/stations/${id}`),
  getStationData: (id: string, hours = 48) =>
    request<WeatherReading[]>(`/api/v1/stations/${id}/data?hours=${hours}`),
  getAnomalies: (limit = 50) => request<Anomaly[]>(`/api/v1/anomalies?limit=${limit}`),
  getStats: () => request<DashboardStats>("/api/v1/anomalies/stats/summary"),
  getAnomalyDetail: (stationId: string, index: number) =>
    request<AnomalyDetail>(`/api/v1/anomalies/${stationId}/${index}`),
  chat: (message: string, history: { role: string; content: string }[] = [], context?: any) =>
    request<{ reply: string; error: string | null }>("/api/v1/chatbot/chat", {
      method: "POST",
      body: JSON.stringify({ message, history, context }),
    }),
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 70000); // 70s timeout

  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "true",
        ...options?.headers,
      },
    });
    clearTimeout(timeoutId);

    if (!response.ok) throw new Error(`API error: ${response.statusText}`);
    return response.json();
  } catch (err) {
    clearTimeout(timeoutId);
    throw err;
  }
}