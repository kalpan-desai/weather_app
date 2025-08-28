from fastapi import FastAPI, HTTPException, BackgroundTasks
import httpx
from settings import settings
from fastapi.middleware.cors import CORSMiddleware
import redis
import json

app = FastAPI()

# Connect to Redis (default localhost:6379)
redis_client = redis.Redis(host="localhost", port=6379, db=0, decode_responses=True)

# Add CORS middleware to allow frontend requests to the FastAPI server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Hello, FastAPI is running!"}

async def refresh_weather_data(city: str, cache_key: str, api_key: str):
    url = f"http://api.weatherapi.com/v1/current.json?key={api_key}&q={city}&aqi=no"
    async with httpx.AsyncClient() as client:
        response = await client.get(url)
        if response.status_code == 200:
            data = response.json()
            result = {
                "city": data["location"]["name"],
                "country": data["location"]["country"],
                "temperature_c": data["current"]["temp_c"],
                "condition": data["current"]["condition"]["text"]
            }
            redis_client.setex(cache_key, 600, json.dumps(result))

@app.get("/weather/{city}")
async def get_weather(city: str, background_tasks: BackgroundTasks):
    cache_key = f"weather:{city.lower()}"
    cached = redis_client.get(cache_key)
    api_key = settings.weather_api_key
    if cached:
        # Schedule background refresh
        background_tasks.add_task(refresh_weather_data, city, cache_key, api_key)
        return json.loads(cached)
    url = f"http://api.weatherapi.com/v1/current.json?key={api_key}&q={city}&aqi=no"
    async with httpx.AsyncClient() as client:
        response = await client.get(url)
        if response.status_code != 200:
            raise HTTPException(status_code=404, detail="City not found or API error.")
        data = response.json()
        result = {
            "city": data["location"]["name"],
            "country": data["location"]["country"],
            "temperature_c": data["current"]["temp_c"],
            "condition": data["current"]["condition"]["text"]
        }
        redis_client.setex(cache_key, 600, json.dumps(result))  # Cache for 10 minutes
        return result
