import json

with open("app/data/weather_data.json") as f:
    d = json.load(f)

total_points = sum(len(v) for v in d.values())
total_anomalies = sum(1 for v in d.values() for r in v if r.get("is_anomaly"))

print(f"Stations: {len(d)}")
print(f"Total data points: {total_points}")
print(f"Total anomalies: {total_anomalies}")

# Show sample
first_station = list(d.keys())[0]
sample = d[first_station][0]
print(f"\nSample from {first_station}:")
print(json.dumps(sample, indent=2))

# Show anomaly breakdown
from collections import Counter
types = Counter()
for station_data in d.values():
    for row in station_data:
        if row.get("is_anomaly"):
            types[row.get("anomaly_type")] += 1

print(f"\nAnomaly breakdown:")
for t, count in types.items():
    print(f"  {t}: {count}")