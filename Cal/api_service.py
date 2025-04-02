from fastapi import FastAPI, HTTPException
import requests
import time
from collections import deque

app = FastAPI()

API_ENDPOINTS = {
    "p": "http://20.244.56.144/evaluation-service/primes",
    "f": "http://20.244.56.144/evaluation-service/fibo",
    "e": "http://20.244.56.144/evaluation-service/even",
    "r": "http://20.244.56.144/evaluation-service/rand"
}

WINDOW_SIZE = 10  
number_window = deque(maxlen=WINDOW_SIZE)  


def fetch_numbers(numberid):
    """Fetch numbers from third-party API and handle response timeouts"""
    if numberid not in API_ENDPOINTS:
        raise HTTPException(status_code=400, detail="Invalid number ID. Use 'p', 'f', 'e', or 'r'.")

    url = API_ENDPOINTS[numberid]
    try:
        start_time = time.time()
        response = requests.get(url, timeout=0.5) 
        elapsed_time = time.time() - start_time

        if response.status_code == 200 and elapsed_time <= 0.5:
            return response.json().get("numbers", [])
        else:
            return []

    except requests.exceptions.RequestException:
        return []


@app.get("/numbers/{numberid}")
def get_numbers(numberid: str):
    """Fetch numbers, update sliding window, and return the average"""
    global number_window


    new_numbers = fetch_numbers(numberid)

    unique_new_numbers = [num for num in new_numbers if num not in number_window]

    window_prev_state = list(number_window)

    number_window.extend(unique_new_numbers)

    avg_value = round(sum(number_window) / len(number_window), 2) if number_window else 0.0

    return {
        "windowPrevState": window_prev_state,
        "windowCurrState": list(number_window),
        "numbers": new_numbers,
        "avg": avg_value
    }


