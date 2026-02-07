import React, { useState } from 'react';
import { getPricePrediction } from '../../services/predictionService';

const PricePredictor = ({ productName }) => {
    const [prediction, setPrediction] = useState(null);
    const [loading, setLoading] = useState(false);
    const [region, setRegion] = useState("Colombo");
    const [date, setDate] = useState("");

    const handlePredict = async () => {
        if (!date) return alert("Please select a date!");
        
        setLoading(true);
        console.log("1. Sending Request..."); // Debug Log
        
        const result = await getPricePrediction(productName, date, region);
        
        console.log("2. Result Received from Backend:", result); // <--- CHECK THIS LOG IN BROWSER
        
        if (result) {
            setPrediction(result);
        } else {
            alert("Failed to get prediction. Check console.");
        }
        
        setLoading(false);
    };

    return (
        <div className="p-4 mt-4 bg-green-50 border border-green-200 rounded-lg shadow-sm">
            <h4 className="font-bold text-green-800 mb-2">💰 AI Price Forecast</h4>
            
            <div className="flex gap-2 mb-3">
                <select 
                    className="p-2 border rounded text-sm"
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                >
                    <option value="Colombo">Colombo</option>
                    <option value="Kandy">Kandy</option>
                    <option value="Dambulla">Dambulla</option>
                    <option value="Nuwara Eliya">Nuwara Eliya</option>
                </select>
                
                <input 
                    type="date" 
                    className="p-2 border rounded text-sm"
                    onChange={(e) => setDate(e.target.value)}
                />
            </div>

            <button 
                onClick={handlePredict} 
                disabled={loading}
                className="bg-green-600 text-white px-4 py-2 rounded text-sm font-semibold hover:bg-green-700 transition"
            >
                {loading ? "Analyzing..." : "Check Future Price"}
            </button>

            {prediction && (
                <div className="mt-3 p-3 bg-white rounded border">
                    <p className="text-sm text-gray-600">Prediction for {prediction.date}:</p>
                    <p className="text-2xl font-bold text-green-600">
                        LKR {prediction.predicted_price_lkr}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                        Season: {prediction.season} | Festival: {prediction.festival_impact}
                    </p>
                </div>
            )}
        </div>
    );
};

export default PricePredictor;