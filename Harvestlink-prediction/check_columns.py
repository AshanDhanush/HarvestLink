import pandas as pd

try:
    # Read the file with the encoding that worked
    df = pd.read_csv("Vegetables_fruit_prices_with_climate_130000_2020_to_2025.csv", encoding='ISO-8859-1')
    
    print("\n✅ SUCCESS! Here are your column names:")
    print("------------------------------------------------------")
    print(list(df.columns))
    print("------------------------------------------------------")
    
    # Print first 2 rows to see what the data looks like
    print("\nSample Data:")
    print(df.head(2))

except Exception as e:
    print(f"Error: {e}")