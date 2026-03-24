import requests
import json

url = "http://localhost:5001/api/Auth/login/candidate"
payload = {
    "email": "vedant@example.com",
    "password": "Vedant@123"
}
headers = {
    "Content-Type": "application/json"
}

try:
    response = requests.post(url, data=json.dumps(payload), headers=headers)
    print(f"Status: {response.status_code}")
    print(f"Response: {response.text}")
except Exception as e:
    print(f"Error: {e}")
