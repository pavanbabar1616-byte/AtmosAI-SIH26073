from fastapi import APIRouter, HTTPException
import json
import os
from ...services.satellite_validator import validate_station_readings, get_overview

router = APIRouter(prefix="/satellite", tags=["Satellite"])

DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "data")


@router.get("/sources")
def get_satellite_sources():
    return {
        "sources": [
            {
                "id": "INSAT-3DR",
                "name": "INSAT-3DR",
                "agency": "ISRO",
                "type": "Geostationary Meteorological Satellite",
                "products": ["Temperature", "Humidity", "Cloud Cover"],
                "active": True,
            },
            {
                "id": "MODIS",
                "name": "MODIS (Terra/Aqua)",
                "agency": "NASA",
                "type": "Polar Orbiting",
                "products": ["Land Surface Temperature", "Aerosol Optical Depth"],
                "active": True,
            },
        ]
    }


@router.get("/overview")
def satellite_overview():
    return get_overview()


@router.get("/station/{station_id}")
def validate_station(station_id: str):
    with open(os.path.join(DATA_DIR, "weather_data.json")) as f:
        weather_data = json.load(f)
    if station_id not in weather_data:
        raise HTTPException(404, "Station not found")
    return validate_station_readings(station_id, weather_data[station_id])