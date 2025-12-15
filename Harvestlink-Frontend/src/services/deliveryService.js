import api from '../api/axios';

const deliveryService = {
    // Get all products
    getAllProducts: async () => {
        const response = await api.get('/products');
        return response.data;
    },

    // Get product by ID
    getProductById: async (id) => {
        const response = await api.get(`/products/${id}`);
        return response.data;
    },
};

export default deliveryService;
