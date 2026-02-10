import axios from 'axios';

const API_URL = 'http://localhost:8085/api/order';

const getOrders = async () => {
    try {
        const response = await axios.get(`${API_URL}/get/Orders`);
        return response.data;
    } catch (error) {
        console.error("Error fetching orders", error);
        throw error;
    }
};

const getTopSellingProducts = async () => {
    try {
        const response = await axios.get(`${API_URL}/get/topsellingproducts`);
        return response.data;
    } catch (error) {
        console.error("Error fetching top selling products", error);
        throw error;
    }
};

const getMonthlyRevenue = async () => {
    try {
        const response = await axios.get(`${API_URL}/get/revenue`);
        return response.data;
    } catch (error) {
        console.error("Error fetching monthly revenue", error);
        throw error;
    }
};

const createOrder = async (orderData) => {
    try {
        const response = await axios.post(`${API_URL}/add/order`, orderData);
        return response.data;
    } catch (error) {
        console.error("Error creating order", error);
        throw error;
    }
};

export default {
    getOrders,
    getTopSellingProducts,
    getMonthlyRevenue,
    createOrder
};
