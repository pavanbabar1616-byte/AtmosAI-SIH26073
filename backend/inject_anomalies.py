"""
Inject labeled anomalies into real weather data.
This creates ground truth for training the anomaly detector.
"""

import json
import random
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_FILE = os.path.join(BASE_DIR, "app", "data", "weather_data.json")

random.seed(42)  # Reproducible


def inject_anomalies(data: list) -> list:
    """Inject 4 types of anomalies at random positions."""
    n = len(data)
    if n < 48:
        return data
    
    # Pick 5-7 anomaly positions (avoid first/last 12 hours)
    num_anomalies = random.randint(5, 7)
    positions = random.sample(range(12, n - 12), num_anomalies)
    
    for idx in positions:
        anomaly_type = random.choice(["spike", "freeze", "drift", "dropout"])
        
        if anomaly_type == "spike":
            # Sudden temperature spike
            if data[idx]["temperature"] is not None:
                data[idx]["temperature"] = round(data[idx]["temperature"] + random.uniform(18, 25), 1)
            data[idx]["anomaly_type"] = "spike"
        
        elif anomaly_type == "freeze":
            # Humidity stuck at same value for several hours
            frozen_value = data[idx]["humidity"] if data[idx]["humidity"] is not None else 65.0
            for j in range(idx, min(idx + 4, n)):
                data[j]["humidity"] = frozen_value
                data[j]["is_anomaly"] = True
                data[j]["anomaly_type"] = "freeze"
        
        elif anomaly_type == "drift":
            # Gradual temperature drift over several hours
            for j in range(idx, min(idx + 5, n)):
                if data[j]["temperature"] is not None:
                    data[j]["temperature"] = round(data[j]["temperature"] + (j - idx) * 1.2, 1)
                data[j]["is_anomaly"] = True
                data[j]["anomaly_type"] = "drift"
        
        elif anomaly_type == "dropout":
            # Missing value
            data[idx]["temperature"] = None
            data[idx]["anomaly_type"] = "dropout"
        
        data[idx]["is_anomaly"] = True
    
    return data


def main():
    print("Injecting synthetic anomalies into real weather data...")
    
    with open(DATA_FILE) as f:
        all_data = json.load(f)
    
    total_injected = 0
    for sid, data in all_data.items():
        all_data[sid] = inject_anomalies(data)
        count = sum(1 for d in all_data[sid] if d.get("is_anomaly"))
        total_injected += count
    
    with open(DATA_FILE, "w") as f:
        json.dump(all_data, f, indent=2)
    
    print(f"Done! Injected {total_injected} labeled anomalies across {len(all_data)} stations")


if __name__ == "__main__":
    main()