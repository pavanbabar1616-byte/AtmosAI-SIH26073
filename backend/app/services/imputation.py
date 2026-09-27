"""
Imputation Service
Suggests corrected values for anomalous data points.
"""

import statistics


def suggest_correction(data: list, row_index: int) -> dict:
    """Suggest corrected values using interpolation from normal neighbors."""
    if row_index >= len(data):
        return {"error": "Invalid index"}
    
    row = data[row_index]
    result = {
        "original": {
            "temperature": row.get("temperature"),
            "pressure": row.get("pressure"),
            "humidity": row.get("humidity"),
        },
        "corrected": {},
        "method": "weighted_linear_interpolation",
        "confidence": 0.0,
    }
    
    for field in ["temperature", "pressure", "humidity"]:
        current = row.get(field)
        
        # Find nearest valid values
        left = None
        right = None
        
        for i in range(row_index - 1, max(-1, row_index - 12), -1):
            if data[i].get(field) is not None and not data[i].get("is_anomaly"):
                left = (row_index - i, data[i][field])
                break
        
        for i in range(row_index + 1, min(len(data), row_index + 12)):
            if data[i].get(field) is not None and not data[i].get("is_anomaly"):
                right = (i - row_index, data[i][field])
                break
        
        if left and right:
            w_left = right[0] / (left[0] + right[0])
            w_right = left[0] / (left[0] + right[0])
            result["corrected"][field] = round(left[1] * w_left + right[1] * w_right, 1)
            result["confidence"] = max(result["confidence"], 0.9)
        elif left:
            result["corrected"][field] = left[1]
            result["confidence"] = max(result["confidence"], 0.6)
        elif right:
            result["corrected"][field] = right[1]
            result["confidence"] = max(result["confidence"], 0.6)
        else:
            result["corrected"][field] = current
            result["confidence"] = max(result["confidence"], 0.3)
    
    return result