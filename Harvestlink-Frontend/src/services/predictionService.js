import axios from "axios"; // Import standard axios directly to avoid interceptor issues for now

export const getPricePrediction = async (item, date, region) => {
    try {
        const response = await axios.post(
            'http://localhost:8000/predict_price', 
            { 
                item_name: item,
                date: date,
                region: region
            },
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error("Prediction Error:", error.response ? error.response.data : error.message);
        return null;
    }
};