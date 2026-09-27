from fastapi import APIRouter, HTTPException
import json
import os

router = APIRouter(prefix="/stations", tags=["Stations"])

DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "data")


def load_json(filename):
    with open(os.path.join(DATA_DIR, filename)) as f:
        return json.load(f)


@router.get("")
def get_stations():
    """Return all 20 stations."""
    return load_json("stations.json")


@router.get("/{station_id}")
def get_station(station_id: str):
    """Return a single station's details."""
    stations = load_json("stations.json")
    station = next((s for s in stations if s["station_id"] == station_id), None)
    if not station:
        raise HTTPException(404, "Station not found")
    return station


@router.get("/{station_id}/data")
def get_station_data(station_id: str, hours: int = 48):
    """Return recent hourly data for a station."""
    all_data = load_json("weather_data.json")
    if station_id not in all_data:
        raise HTTPException(404, "No data for this station")
    return all_data[station_id][-hours:]