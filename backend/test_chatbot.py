import requests

url = "http://localhost:8000/api/v1/chatbot/chat"
payload = {
    "message": "How many anomalies are there in total?",
    "history": [],
    "context": {"total_stations": 20, "total_anomalies": 312}
}

response = requests.post(url, json=payload)
print(response.json())
