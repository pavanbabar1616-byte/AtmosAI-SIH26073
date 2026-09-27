"""
Explainability Service
Generates human-readable explanations for detected anomalies.
"""

import statistics


def explain_anomaly(station_id: str, row_index: int, data: list) -> dict:
    """Generate a detailed explanation for why a point is anomalous."""
    if row_index >= len(data):
        return {"error": "Invalid index"}
    
    row = data[row_index]
    start = max(0, row_index - 6)
    end = min(len(data), row_index + 7)
    window = data[start:end]
    
    features = []
    
    # Temperature analysis
    temps = [r.get("temperature") for r in window if r.get("temperature") is not None]
    current_temp = row.get("temperature")
    
    if current_temp is None:
        features.append({
            "feature": "Temperature",
            "contribution": 1.0,
            "severity": "high",
            "reason": "Missing value — possible sensor failure or communication dropout"
        })
    elif len(temps) >= 3:
        mean = statistics.mean(temps)
        std = statistics.stdev(temps) if len(temps) > 1 else 1.0
        std = max(std, 0.1)
        z = abs(current_temp - mean) / std
        if z > 2:
            features.append({
                "feature": "Temperature",
                "contribution": min(1.0, z / 5),
                "severity": "high" if z > 4 else "medium",
                "reason": f"Value {current_temp}°C is {round(z, 1)}σ away from recent mean ({round(mean, 1)}°C)"
            })
    
    # Pressure analysis
    pressures = [r.get("pressure") for r in window if r.get("pressure") is not None]
    current_pressure = row.get("pressure")
    
    if current_pressure is not None and len(pressures) >= 3:
        mean = statistics.mean(pressures)
        std = max(statistics.stdev(pressures) if len(pressures) > 1 else 1.0, 0.1)
        z = abs(current_pressure - mean) / std
        if z > 2:
            features.append({
                "feature": "Pressure",
                "contribution": min(1.0, z / 5),
                "severity": "medium",
                "reason": f"Value {current_pressure} hPa is {round(z, 1)}σ from recent mean"
            })
    
    # Humidity analysis
    humidities = [r.get("humidity") for r in window if r.get("humidity") is not None]
    current_humidity = row.get("humidity")
    
    if current_humidity is not None and len(humidities) >= 4:
        # Check for freeze
        recent = humidities[-4:]
        if len(set(recent)) == 1:
            features.append({
                "feature": "Humidity Freeze",
                "contribution": 0.9,
                "severity": "high",
                "reason": f"Humidity stuck at {recent[0]}% for 4+ readings — sensor frozen"
            })
        else:
            mean = statistics.mean(humidities)
            std = max(statistics.stdev(humidities) if len(humidities) > 1 else 1.0, 0.1)
            z = abs(current_humidity - mean) / std
            if z > 2:
                features.append({
                    "feature": "Humidity",
                    "contribution": min(1.0, z / 5),
                    "severity": "medium",
                    "reason": f"Value {current_humidity}% is {round(z, 1)}σ from recent mean"
                })
    
    # Check for drift pattern
    if len(temps) >= 5:
        diffs = [temps[i+1] - temps[i] for i in range(len(temps)-1)]
        if diffs and all(d > 0.5 for d in diffs[-4:]):
            features.append({
                "feature": "Temperature Drift",
                "contribution": 0.8,
                "severity": "high",
                "reason": f"Monotonic drift detected: temperature rising {round(sum(diffs[-4:]), 1)}°C over 4 hours"
            })
    
    features.sort(key=lambda x: x["contribution"], reverse=True)
    
    return {
        "station_id": station_id,
        "timestamp": row.get("timestamp"),
        "top_features": features[:5],
        "overall_reason": features[0]["reason"] if features else "Statistical outlier",
        "severity": features[0]["severity"] if features else "low",
    }


def get_confidence_breakdown(detection: dict, explanation: dict) -> dict:
    """Combine detection confidence with explanation into a trust score."""
    base_confidence = detection.get("confidence", 0.5)
    
    # Boost confidence if explanation has strong features
    if explanation.get("top_features"):
        top_contribution = explanation["top_features"][0]["contribution"]
        trust_score = round((base_confidence * 0.7 + top_contribution * 0.3) * 100)
    else:
        trust_score = round(base_confidence * 100)
    
    return {
        "trust_score": min(100, max(0, trust_score)),
        "confidence": base_confidence,
        "explanation_strength": explanation.get("top_features", [{}])[0].get("contribution", 0) if explanation.get("top_features") else 0,
    }