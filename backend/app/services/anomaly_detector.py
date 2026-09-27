"""
Anomaly Detection Engine
Uses Isolation Forest + statistical z-scores for robust detection.
Trained per-station on normal patterns.
"""

import json
import os
import numpy as np
from sklearn.ensemble import IsolationForest
from sklearn.preprocessing import StandardScaler

MODEL_DIR = os.path.join(os.path.dirname(__file__), "..", "data", "models")
os.makedirs(MODEL_DIR, exist_ok=True)

_models = {}


def _extract_features(data: list, only_normal: bool = True) -> np.ndarray:
    """Extract feature vectors from weather data."""
    features = []
    for row in data:
        if only_normal and row.get("is_anomaly"):
            continue
        if row.get("temperature") is None:
            continue
        if row.get("pressure") is None:
            continue
        if row.get("humidity") is None:
            continue
        features.append([
            float(row["temperature"]),
            float(row["pressure"]),
            float(row["humidity"]),
        ])
    return np.array(features)


def train_station_model(station_id: str, data: list) -> dict:
    """Train Isolation Forest on this station's normal data."""
    X = _extract_features(data, only_normal=True)
    
    if len(X) < 20:
        return {"station_id": station_id, "status": "skipped", "reason": "Not enough data"}
    
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)
    
    model = IsolationForest(
        n_estimators=100,
        contamination=0.05,
        random_state=42,
        n_jobs=-1,
    )
    model.fit(X_scaled)
    
    _models[station_id] = {"model": model, "scaler": scaler, "trained_on": len(X)}
    
    return {"station_id": station_id, "status": "trained", "samples": len(X)}


def detect_anomaly(station_id: str, row: dict) -> dict:
    """Detect anomaly on a single data point."""
    if station_id not in _models:
        return {"error": "Model not trained"}
    
    # Handle missing values
    if row.get("temperature") is None:
        return {
            "is_anomaly": True,
            "confidence": 0.95,
            "type": "dropout",
            "reason": "Missing temperature reading",
        }
    
    m = _models[station_id]
    X = np.array([[
        float(row["temperature"]),
        float(row["pressure"]) if row.get("pressure") is not None else 1013.0,
        float(row["humidity"]) if row.get("humidity") is not None else 60.0,
    ]])
    X_scaled = m["scaler"].transform(X)
    
    prediction = m["model"].predict(X_scaled)[0]
    raw_score = float(-m["model"].score_samples(X_scaled)[0])
    confidence = min(1.0, max(0.0, (raw_score + 0.5) / 1.5))
    
    return {
        "is_anomaly": bool(prediction == -1),
        "confidence": round(confidence, 3),
        "raw_score": round(raw_score, 3),
        "type": None,
    }


def detect_anomalies_batch(station_id: str, data: list) -> list:
    """Run detection on entire station data."""
    results = []
    for i, row in enumerate(data):
        r = detect_anomaly(station_id, row)
        r["index"] = i
        r["timestamp"] = row.get("timestamp")
        r["is_labeled"] = row.get("is_anomaly", False)
        r["labeled_type"] = row.get("anomaly_type")
        results.append(r)
    return results


def get_trained_count() -> int:
    return len(_models)