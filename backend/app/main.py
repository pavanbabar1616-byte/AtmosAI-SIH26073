from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import json
import os
from .core.config import settings
from .api.v1 import stations, anomalies, chatbot, satellite, xai, simulation
from .services.anomaly_detector import train_station_model, _models

# ============================================================
# Create FastAPI app FIRST — before any include_router calls
# ============================================================
app = FastAPI(
    title="AtmosAI — SIH26073",
    version="1.0.0",
    description="AI-Powered Anomaly Detection for India's Automatic Weather Stations",
)

# ============================================================
# CORS
# ============================================================
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============================================================
# Routers
# ============================================================
app.include_router(stations.router, prefix="/api/v1")
app.include_router(anomalies.router, prefix="/api/v1")
app.include_router(chatbot.router, prefix="/api/v1")
app.include_router(satellite.router, prefix="/api/v1")
app.include_router(xai.router, prefix="/api/v1")
app.include_router(simulation.router, prefix="/api/v1")


# ============================================================
# Startup — train station models
# ============================================================
@app.on_event("startup")
async def startup_train_models():
    data_dir = os.path.join(os.path.dirname(__file__), "data")
    try:
        with open(os.path.join(data_dir, "weather_data.json")) as f:
            all_data = json.load(f)
        count = 0
        for sid, data in all_data.items():
            r = train_station_model(sid, data)
            if r.get("status") == "trained":
                count += 1
        print(f"✅ Trained {count} station models")
    except Exception as e:
        print(f"⚠️ Startup training failed: {e}")


# ============================================================
# Root + health
# ============================================================
@app.get("/")
def root():
    return {
        "service": "AtmosAi",
        "ps_code": "SIH26073",
        "status": "running",
        "tagline": "Detect. Explain. Trust.",
    }


@app.get("/health")
def health():
    return {
        "status": "healthy",
        "stations_trained": len(_models),
        "groq_configured": bool(settings.GROQ_API_KEY),
        "version": "1.0.0",
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)