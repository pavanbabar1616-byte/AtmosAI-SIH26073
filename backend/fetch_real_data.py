"""
Fetch REAL weather data from Open-Meteo API for all 20 Indian stations.
This uses actual historical weather observations — not synthetic data.
"""

import json
import requests
from datetime import datetime, timedelta
import os
import sys

# Paths
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
STATIONS_FILE = os.path.join(BASE_DIR, "app", "data", "stations.json")
OUTPUT_FILE = os.path.join(BASE_DIR, "app", "data", "weather_data.json")


def fetch_station_data(station: dict, start_date: str, end_date: str) -> list:
    """Fetch real hourly weather data for one station."""
    url = "https://archive-api.open-meteo.com/v1/archive"
    params = {
        "latitude": station["lat"],
        "longitude": station["lon"],
        "start_date": start_date,
        "end_date": end_date,
        "hourly": "temperature_2m,relative_humidity_2m,surface_pressure,wind_speed_10m",
        "timezone": "Asia/Kolkata",
    }
    
    response = requests.get(url, params=params, timeout=60)
    response.raise_for_status()
    data = response.json()
    
    hourly = []
    times = data.get("hourly", {}).get("time", [])
    
    for i in range(len(times)):
        temp = data["hourly"]["temperature_2m"][i]
        pressure = data["hourly"]["surface_pressure"][i]
        humidity = data["hourly"]["relative_humidity_2m"][i]
        wind = data["hourly"]["wind_speed_10m"][i]
        
        hourly.append({
            "timestamp": times[i] + ":00Z",
            "temperature": round(temp, 1) if temp is not None else None,
            "pressure": round(pressure, 1) if pressure is not None else None,
            "humidity": round(humidity, 1) if humidity is not None else None,
            "wind_speed": round(wind, 1) if wind is not None else None,
            "is_anomaly": False,
            "anomaly_type": None,
        })
    
    return hourly


def main():
    print("=" * 60)
    print("AtmosAi — Real Weather Data Fetcher")
    print("=" * 60)
    
    # Load stations
    with open(STATIONS_FILE) as f:
        stations = json.load(f)
    
    # Fetch last 7 days of hourly data
    end_date = datetime.now().date()
    start_date = end_date - timedelta(days=7)
    
    print(f"\nFetching real data for {len(stations)} stations")
    print(f"Date range: {start_date} to {end_date}")
    print(f"Source: Open-Meteo Archive API (real observations)\n")
    
    all_data = {}
    failed = []
    
    for i, station in enumerate(stations, 1):
        sid = station["station_id"]
        name = station["name"]
        
        print(f"[{i:2d}/{len(stations)}] Fetching {sid} - {name}...", end=" ")
        
        try:
            hourly = fetch_station_data(station, start_date.isoformat(), end_date.isoformat())
            all_data[sid] = hourly
            print(f"OK ({len(hourly)} readings)")
        except Exception as e:
            print(f"FAILED: {e}")
            failed.append(sid)
    
    # Save
    with open(OUTPUT_FILE, "w") as f:
        json.dump(all_data, f, indent=2)
    
    print(f"\n{'=' * 60}")
    print(f"SUCCESS: Saved real weather data for {len(all_data)} stations")
    print(f"File: {OUTPUT_FILE}")
    print(f"Total data points: {sum(len(v) for v in all_data.values())}")
    
    if failed:
        print(f"\nFailed stations: {', '.join(failed)}")
    
    print("=" * 60)


if __name__ == "__main__":
    main()