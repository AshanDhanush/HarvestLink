from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import pandas as pd
from datetime import datetime
import numpy as np

app = FastAPI()

# --- 1. ENABLE CORS (Connects Frontend to Python) ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allows requests from React/Gateway
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- 2. LOAD MODEL & ENCODERS ---
try:
    model = joblib.load("model.pkl")
    item_encoder = joblib.load("item_encoder.pkl")
    region_encoder = joblib.load("region_encoder.pkl")
    print("✅ System loaded successfully!")
except Exception as e:
    print(f"❌ Error loading files: {e}")
    print("Did you run 'python train_model_v2.py'?")

class PredictionRequest(BaseModel):
    item_name: str
    date: str
    region: str = "Colombo" # Default value

@app.post("/predict_price")
def predict(request: PredictionRequest):
    try:
        # --- 3. PREPARE INPUTS ---
        # A. Date Features
        try:
            date_obj = datetime.strptime(request.date, "%Y-%m-%d")
        except ValueError:
            # Handle format errors or empty dates
            return {"error": "Invalid Date Format. Use YYYY-MM-DD"}

        year = date_obj.year
        month = date_obj.month
        day = date_obj.day
        
        # B. Region & Item Encoding
        # Handle "Unknown Item"
        if request.item_name not in item_encoder.classes_:
            return {
                "error": f"Item '{request.item_name}' not found.",
                "valid_items": list(item_encoder.classes_)[:5]
            }
            
        # Handle "Unknown Region" (Fallback to first known region)
        region_input = request.region
        if region_input not in region_encoder.classes_:
            region_input = region_encoder.classes_[0] 
            
        item_id = item_encoder.transform([request.item_name])[0]
        region_id = region_encoder.transform([region_input])[0]

        # C. Climate Defaults (Average Sri Lanka Weather)
        # The model expects: [Item, Region, Year, Month, Day, Temp, Rain, Humidity]
        avg_temp = 28.0 
        avg_rain = 5.0
        avg_humidity = 75.0

        # --- 4. PREDICT ---
        features = [[item_id, region_id, year, month, day, avg_temp, avg_rain, avg_humidity]]
        predicted_price = model.predict(features)[0]
        
        return {
            "item": request.item_name,
            "region": region_input,
            "date": request.date,
            "predicted_price_lkr": round(predicted_price, 2),
            "status": "success"
        }

    except Exception as e:
        print(f"Error during prediction: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# Run command: python -m uvicorn main:app --reload