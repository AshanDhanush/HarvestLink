import axios from 'axios';
import api from '../api/axios';

const deliveryService = {
    // Get all products
    getAllProducts: async () => {
        const response = await axios.get('http://localhost:8085/api/product/getAll');
        return response.data;
    },

    // Get product by ID
    getProductById: async (id) => {
        const response = await api.get(`/products/${id}`);
        return response.data;
    },
};

export default deliveryService;
