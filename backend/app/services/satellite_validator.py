"""
Satellite Validation Service
Cross-validates AWS sensor readings against satellite observations.
"""

import json
import os

DATA_DIR = os.path.join(os.path.dirname(__file__), "..", "data")


def load_satellite_data():
    path = os.path.join(DATA_DIR, "satellite_data.json")
    if not os.path.exists(path):
        return {}
    with open(path) as f:
        return json.load(f)


def validate_station_readings(station_id: str, aws_readings: list) -> dict:
    satellite_data = load_satellite_data()
    if station_id not in satellite_data:
        return {
            "station_id": station_id,
            "status": "no_satellite_data",
            "message": "No satellite observations available for this station.",
            "validations": [],
        }

    sat_obs = satellite_data[station_id]["observations"]
    sat_index = {o["timestamp"][:13]: o for o in sat_obs}

    validations = []

    for reading in aws_readings:
        ts_key = reading["timestamp"][:13]
        sat = sat_index.get(ts_key)
        if not sat:
            continue

        aws_temp = reading.get("temperature")
        aws_hum = reading.get("humidity")
        sat_temp = sat["satellite_temp"]
        sat_hum = sat["satellite_humidity"]

        temp_dev = abs(aws_temp - sat_temp) if aws_temp is not None else None
        hum_dev = abs(aws_hum - sat_hum) if aws_hum is not None else None

        if temp_dev is None or hum_dev is None:
            verdict, confidence = "sensor_fault", 0.85
            reason = "Missing AWS reading — satellite data available"
        elif temp_dev > 5 or hum_dev > 20:
            verdict = "sensor_fault"
            confidence = min(0.95, 0.7 + (temp_dev + hum_dev / 4) / 50)
            reason = f"Large deviation: temp Δ{temp_dev:.1f}°C, humidity Δ{hum_dev:.1f}%"
        elif temp_dev > 2 or hum_dev > 10:
            verdict, confidence = "uncertain", 0.6
            reason = f"Moderate deviation: temp Δ{temp_dev:.1f}°C, humidity Δ{hum_dev:.1f}%"
        else:
            verdict = "validated"
            confidence = min(0.95, 0.7 + sat["confidence"] / 4)
            reason = f"Consistent with satellite: temp Δ{temp_dev:.1f}°C"

        validations.append({
            "timestamp": reading["timestamp"],
            "aws_temperature": aws_temp,
            "aws_humidity": aws_hum,
            "satellite_temperature": sat_temp,
            "satellite_humidity": sat_hum,
            "cloud_cover": sat["cloud_cover"],
            "temp_deviation": round(temp_dev, 2) if temp_dev is not None else None,
            "humidity_deviation": round(hum_dev, 2) if hum_dev is not None else None,
            "verdict": verdict,
            "confidence": round(confidence, 3),
            "reason": reason,
        })

    total = len(validations)
    validated = sum(1 for v in validations if v["verdict"] == "validated")
    faults = sum(1 for v in validations if v["verdict"] == "sensor_fault")
    uncertain = sum(1 for v in validations if v["verdict"] == "uncertain")

    return {
        "station_id": station_id,
        "station_name": satellite_data[station_id]["station_name"],
        "satellite_source": satellite_data[station_id]["satellite_source"],
        "status": "validated",
        "summary": {
            "total_comparisons": total,
            "validated": validated,
            "sensor_faults": faults,
            "uncertain": uncertain,
            "validation_rate": round(validated / total * 100, 1) if total else 0,
        },
        "validations": validations,
    }


def get_overview() -> dict:
    """Aggregate stats across all stations."""
    satellite_data = load_satellite_data()
    weather_path = os.path.join(DATA_DIR, "weather_data.json")
    with open(weather_path) as f:
        weather_data = json.load(f)

    total_validated = 0
    total_faults = 0
    total_uncertain = 0
    station_summaries = []

    for station_id in satellite_data.keys():
        if station_id not in weather_data:
            continue
        result = validate_station_readings(station_id, weather_data[station_id])
        s = result.get("summary", {})
        total_validated += s.get("validated", 0)
        total_faults += s.get("sensor_faults", 0)
        total_uncertain += s.get("uncertain", 0)
        station_summaries.append({
            "station_id": station_id,
            "station_name": result.get("station_name"),
            "validation_rate": s.get("validation_rate", 0),
            "sensor_faults": s.get("sensor_faults", 0),
            "total_comparisons": s.get("total_comparisons", 0),
        })

    total = total_validated + total_faults + total_uncertain
    return {
        "satellite_sources": ["INSAT-3DR", "MODIS"],
        "stations_covered": len(satellite_data),
        "total_comparisons": total,
        "validated": total_validated,
        "sensor_faults": total_faults,
        "uncertain": total_uncertain,
        "overall_validation_rate": round(total_validated / total * 100, 1) if total else 0,
        "station_summaries": sorted(station_summaries, key=lambda x: x["validation_rate"]),
    }