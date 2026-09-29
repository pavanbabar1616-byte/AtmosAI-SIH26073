from fastapi import APIRouter, HTTPException
import json
import os
import statistics

router = APIRouter(prefix="/xai", tags=["XAI"])

DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "data")


def load_json(filename):
    with open(os.path.join(DATA_DIR, filename)) as f:
        return json.load(f)


@router.get("/explain/{station_id}/{index}")
def explain_prediction(station_id: str, index: int):
    """Generate SHAP-style explanation for a specific data point."""
    weather = load_json("weather_data.json")
    if station_id not in weather:
        raise HTTPException(404, "Station not found")
    
    data = weather[station_id]
    if index < 0 or index >= len(data):
        raise HTTPException(404, "Index out of range")
    
    row = data[index]
    
    # Window for statistical context
    start = max(0, index - 12)
    end = min(len(data), index + 13)
    window = data[start:end]
    
    temps = [r.get("temperature") for r in window if r.get("temperature") is not None]
    pressures = [r.get("pressure") for r in window if r.get("pressure") is not None]
    humidities = [r.get("humidity") for r in window if r.get("humidity") is not None]
    
    def analyze(field_name: str, current, values):
        if current is None:
            return {
                "feature": field_name,
                "current_value": None,
                "baseline": None,
                "shap_value": 1.0,
                "direction": "missing",
                "impact": "high",
                "explanation": f"{field_name} is missing — sensor dropout or communication failure"
            }
        
        if len(values) < 3:
            return None
        
        baseline = statistics.mean(values)
        std = max(statistics.stdev(values) if len(values) > 1 else 1.0, 0.1)
        z = (current - baseline) / std
        shap = min(abs(z) / 5, 1.0)
        
        if abs(z) < 1:
            direction = "neutral"
            impact = "low"
            explanation = f"{field_name} ({current}) is within normal range of recent mean ({round(baseline, 1)})"
        elif z > 0:
            direction = "positive"
            impact = "high" if abs(z) > 4 else "medium"
            explanation = f"{field_name} ({current}) is {round(z, 1)}σ ABOVE recent mean ({round(baseline, 1)})"
        else:
            direction = "negative"
            impact = "high" if abs(z) > 4 else "medium"
            explanation = f"{field_name} ({current}) is {round(abs(z), 1)}σ BELOW recent mean ({round(baseline, 1)})"
        
        return {
            "feature": field_name,
            "current_value": current,
            "baseline": round(baseline, 2),
            "shap_value": round(shap, 3),
            "z_score": round(z, 2),
            "direction": direction,
            "impact": impact,
            "explanation": explanation,
        }
    
    features = [
        analyze("Temperature", row.get("temperature"), temps),
        analyze("Pressure", row.get("pressure"), pressures),
        analyze("Humidity", row.get("humidity"), humidities),
    ]
    features = [f for f in features if f]
    
    # Sort by SHAP value (highest impact first)
    features.sort(key=lambda x: x["shap_value"], reverse=True)
    
    # Compute total anomaly score
    total_impact = sum(f["shap_value"] for f in features)
    anomaly_score = min(total_impact / 2, 1.0)
    
    # Counterfactual: what would reduce the anomaly?
    counterfactuals = []
    for f in features[:2]:
        if f["shap_value"] > 0.3 and f["direction"] in ("positive", "negative"):
            target = round(f["baseline"], 1)
            counterfactuals.append({
                "feature": f["feature"],
                "current": f["current_value"],
                "suggested": target,
                "impact": f"If {f['feature']} were {target}, anomaly score would drop by ~{round(f['shap_value'] * 40, 1)}%"
            })
    
    # Prediction
    if anomaly_score > 0.7:
        verdict = "definite_anomaly"
        severity = "high"
    elif anomaly_score > 0.4:
        verdict = "probable_anomaly"
        severity = "medium"
    else:
        verdict = "normal"
        severity = "low"
    
    return {
        "station_id": station_id,
        "index": index,
        "timestamp": row.get("timestamp"),
        "verdict": verdict,
        "severity": severity,
        "anomaly_score": round(anomaly_score, 3),
        "shap_values": features,
        "counterfactuals": counterfactuals,
        "baseline_window": {
            "size": len(window),
            "center_index": index,
        },
    }