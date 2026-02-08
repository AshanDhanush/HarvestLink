import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
import joblib

# --- 1. SETTINGS ---
CSV_FILE = "Vegetables_fruit_prices_with_climate_130000_2020_to_2025.csv"

# --- 2. LOAD DATA ---
print("Loading data...")
df = pd.read_csv(CSV_FILE, encoding='ISO-8859-1', low_memory=False)

# --- 3. ADVANCED CLEANING ---
print("Cleaning data...")

# Select meaningful columns
# We ADDED: Temperature, Rainfall, Humidity
columns_to_keep = [
    'Date', 'Region', 'vegitable_Commodity', 'vegitable_Price per Unit (LKR/kg)',
    'Temperature (°C)', 'Rainfall (mm)', 'Humidity (%)'
]

# Rename for easier coding
data = df[columns_to_keep].copy()
data.columns = ['Date', 'Region', 'Item', 'Price', 'Temp', 'Rain', 'Humidity']

# Drop empty rows
data = data.dropna()

# Fix Price Column (Force to number)
data['Price'] = pd.to_numeric(data['Price'], errors='coerce')
data = data[data['Price'] > 10]   # Remove 0s
data = data[data['Price'] < 3000] # Remove crazy outliers

# Fix Climate Columns (Force to numbers)
data['Temp'] = pd.to_numeric(data['Temp'], errors='coerce').fillna(30) # Default to 30C if missing
data['Rain'] = pd.to_numeric(data['Rain'], errors='coerce').fillna(0)  # Default to 0mm
data['Humidity'] = pd.to_numeric(data['Humidity'], errors='coerce').fillna(75)

# Fix Date
data['Date'] = pd.to_datetime(data['Date'], errors='coerce')
data['Year'] = data['Date'].dt.year
data['Month'] = data['Date'].dt.month
data['Day'] = data['Date'].dt.day

# --- CRITICAL FIX: FOCUS ON RECENT DATA ---
# Old data (2020-2021) confuses the model because prices were very low.
# We prioritize 2022-2025 data for better current predictions.
print(f"Original row count: {len(data)}")
data = data[data['Year'] >= 2022] 
print(f"Recent data row count: {len(data)}")

# --- 4. ENCODING ---
item_encoder = LabelEncoder()
data['Item_ID'] = item_encoder.fit_transform(data['Item'])

region_encoder = LabelEncoder()
data['Region_ID'] = region_encoder.fit_transform(data['Region'])

# Save encoders
joblib.dump(item_encoder, "item_encoder.pkl")
joblib.dump(region_encoder, "region_encoder.pkl")

# --- 5. TRAIN MODEL ---
print("Training Smart AI Model...")

# FEATURES: Now includes Year, Climate, and Region
X = data[['Item_ID', 'Region_ID', 'Year', 'Month', 'Day', 'Temp', 'Rain', 'Humidity']]
y = data['Price']

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Increased estimators for better learning
model = RandomForestRegressor(n_estimators=200, max_depth=20, random_state=42)
model.fit(X_train, y_train)

# --- 6. EVALUATE ---
score = model.score(X_test, y_test)
print(f"✅ Model Trained!")
print(f"📊 New Accuracy Score (R2): {score * 100:.2f}%")

joblib.dump(model, "model.pkl")
print("Model saved as 'model.pkl'")