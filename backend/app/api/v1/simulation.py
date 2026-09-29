from fastapi import APIRouter
import random
from datetime import datetime, timedelta
import json
import os

router = APIRouter(prefix="/simulation", tags=["Simulation"])

DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "data")


def load_json(filename):
    with open(os.path.join(DATA_DIR, filename)) as f:
        return json.load(f)


@router.get("/next-reading/{station_id}")
def get_next_reading(station_id: str):
    """Return a simulated next reading for a station."""
    weather = load_json("weather_data.json")
    if station_id not in weather:
        return {"error": "Station not found"}
    
    data = weather[station_id]
    last = data[-1]
    
    # Base values from last reading
    base_temp = last.get("temperature") or 25.0
    base_pressure = last.get("pressure") or 1013.0
    base_humidity = last.get("humidity") or 60.0
    
    # Simulate natural variation
    temp_variation = random.gauss(0, 0.8)
    pressure_variation = random.gauss(0, 0.4)
    humidity_variation = random.gauss(0, 2.0)
    
    # 5% chance of anomaly injection
    is_anomaly = random.random() < 0.05
    anomaly_type = None
    
    if is_anomaly:
        anomaly_type = random.choice(["spike", "freeze", "drift"])
        if anomaly_type == "spike":
            temp_variation = random.uniform(15, 25)
        elif anomaly_type == "freeze":
            humidity_variation = -(base_humidity - 65.0)
    
    new_reading = {
        "timestamp": (datetime.utcnow() + timedelta(hours=1)).isoformat() + "Z",
        "temperature": round(base_temp + temp_variation, 1),
        "pressure": round(base_pressure + pressure_variation, 1),
        "humidity": round(max(0, min(100, base_humidity + humidity_variation)), 1),
        "is_anomaly": is_anomaly,
        "anomaly_type": anomaly_type,
    }
    
    return new_reading