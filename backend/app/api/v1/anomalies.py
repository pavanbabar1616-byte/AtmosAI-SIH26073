from fastapi import APIRouter, HTTPException
import json
import os
from ...services.anomaly_detector import (
    _models,
    detect_anomaly,
    train_station_model,
)
from ...services.explainability import explain_anomaly, get_confidence_breakdown
from ...services.imputation import suggest_correction

router = APIRouter(prefix="/anomalies", tags=["Anomalies"])

DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "data")


def load_json(filename):
    with open(os.path.join(DATA_DIR, filename)) as f:
        return json.load(f)


@router.get("")
def get_all_anomalies(limit: int = 50):
    """Return all labeled anomalies across stations."""
    stations = load_json("stations.json")
    all_data = load_json("weather_data.json")
    
    anomalies = []
    for station in stations:
        sid = station["station_id"]
        data = all_data.get(sid, [])
        
        for i, row in enumerate(data):
            if row.get("is_anomaly"):
                anomalies.append({
                    "station_id": sid,
                    "station_name": station["name"],
                    "state": station["state"],
                    "lat": station["lat"],
                    "lon": station["lon"],
                    "timestamp": row["timestamp"],
                    "type": row.get("anomaly_type"),
                    "temperature": row.get("temperature"),
                    "pressure": row.get("pressure"),
                    "humidity": row.get("humidity"),
                    "severity": "high" if row.get("anomaly_type") in ("spike", "dropout", "freeze") else "medium",
                    "index": i,
                })
    
    anomalies.sort(key=lambda x: x["timestamp"], reverse=True)
    return anomalies[:limit]


@router.get("/stats/summary")
def get_stats():
    """Return dashboard summary statistics."""
    stations = load_json("stations.json")
    all_data = load_json("weather_data.json")
    
    total_anomalies = 0
    by_type = {}
    by_severity = {"high": 0, "medium": 0, "low": 0}
    by_state = {}
    station_health = []
    
    for station in stations:
        sid = station["station_id"]
        data = all_data.get(sid, [])
        
        station_anomalies = [d for d in data if d.get("is_anomaly")]
        count = len(station_anomalies)
        total_anomalies += count
        
        # Health: 100 - (anomaly rate)
        health = max(0, 100 - (count / len(data) * 100)) if data else 0
        
        # Average readings for the station
        temps = [d.get("temperature") for d in data if d.get("temperature") is not None]
        avg_temp = round(sum(temps) / len(temps), 1) if temps else 0
        
        station_health.append({
            "station_id": sid,
            "name": station["name"],
            "state": station["state"],
            "lat": station["lat"],
            "lon": station["lon"],
            "anomalies": count,
            "health": round(health, 1),
            "total_readings": len(data),
            "avg_temperature": avg_temp,
        })
        
        for a in station_anomalies:
            t = a.get("anomaly_type", "unknown")
            by_type[t] = by_type.get(t, 0) + 1
            sev = "high" if t in ("spike", "dropout", "freeze") else "medium"
            by_severity[sev] += 1
            s = station["state"]
            by_state[s] = by_state.get(s, 0) + 1
    
    return {
        "total_stations": len(stations),
        "total_anomalies": total_anomalies,
        "total_data_points": sum(len(v) for v in all_data.values()),
        "by_type": by_type,
        "by_severity": by_severity,
        "by_state": by_state,
        "station_health": station_health,
    }


@router.get("/{station_id}/{index}")
def get_anomaly_detail(station_id: str, index: int):
    """Return full detail (detection + explanation + correction) for one anomaly."""
    all_data = load_json("weather_data.json")
    stations = load_json("stations.json")
    
    if station_id not in all_data:
        raise HTTPException(404, "Station not found")
    
    data = all_data[station_id]
    if index < 0 or index >= len(data):
        raise HTTPException(404, "Index out of range")
    
    station = next((s for s in stations if s["station_id"] == station_id), None)
    
    # Train if not yet
    if station_id not in _models:
        train_station_model(station_id, data)
    
    detection = detect_anomaly(station_id, data[index])
    explanation = explain_anomaly(station_id, index, data)
    correction = suggest_correction(data, index)
    trust = get_confidence_breakdown(detection, explanation)
    
    # Context window (±12 hours)
    start = max(0, index - 12)
    end = min(len(data), index + 13)
    context_window = data[start:end]
    
    return {
        "station": station,
        "data_point": data[index],
        "detection": detection,
        "explanation": explanation,
        "correction": correction,
        "trust": trust,
        "context_window": context_window,
        "data_index": index,
    }