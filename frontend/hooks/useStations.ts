import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export function useStations() {
  return useQuery({
    queryKey: ["stations"],
    queryFn: api.getStations,
    staleTime: 5 * 60 * 1000,
  });
}

export function useStats() {
  return useQuery({
    queryKey: ["stats"],
    queryFn: api.getStats,
    refetchInterval: 30 * 1000,
  });
}

export function useAnomalies(limit = 50) {
  return useQuery({
    queryKey: ["anomalies", limit],
    queryFn: () => api.getAnomalies(limit),
    refetchInterval: 30 * 1000,
  });
}

export function useStationData(id: string | null, hours = 48) {
  return useQuery({
    queryKey: ["station-data", id, hours],
    queryFn: () => api.getStationData(id!, hours),
    enabled: !!id,
  });
}

export function useAnomalyDetail(stationId: string | null, index: number | null) {
  return useQuery({
    queryKey: ["anomaly-detail", stationId, index],
    queryFn: () => api.getAnomalyDetail(stationId!, index!),
    enabled: !!stationId && index !== null,
  });
}