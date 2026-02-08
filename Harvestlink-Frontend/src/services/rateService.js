import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8082';

const rateService = {
    addRating: async (ratingData) => {
        try {
            const response = await axios.post(`${API_BASE}/api/v1/product/rating/add`, ratingData);
            return response.data;
        } catch (error) {
            console.error("Error adding rating", error);
            throw error;
        }
    },

    getRatingsByProduct: async (productId) => {
        try {
            const response = await axios.get(`${API_BASE}/api/v1/product/rating/get/${productId}`);
            return response.data;
        } catch (error) {
            console.error("Error fetching ratings", error);
            throw error;
        }
    },

    getAverageRating: async (productId) => {
        try {
            const response = await axios.get(`${API_BASE}/api/v1/product/rating/average/${productId}`);
            return response.data;
        } catch (error) {
            console.error("Error fetching average rating", error);
            throw error;
        }
    }
};

export default rateService;
