import api from '../api/axios';
import authService from './authService';

const wishlistService = {

    addToWishlist: async (product) => {
        const user = authService.getCurrentUser();
        if (!user) throw new Error("User not logged in");

        const payload = {
            userId: user.email, // using email as ID for consistency with other parts
            productId: product.id || product.tempID,
            productName: product.name || product.title,
            productImage: product.imageUrl || product.image,
            price: product.price
        };

        try {
            // api has baseURL 'http://localhost:8085/api/v1', so we append '/user/wishlist/add'
            // If the backend controller is at /api/v1/user/wishlist, then relative path is /user/wishlist
            await api.post('/user/wishlist/add', payload);
        } catch (error) {
            console.error("Error adding to wishlist", error);
            throw error;
        }
    },

    removeFromWishlist: async (productId) => {
        const user = authService.getCurrentUser();
        if (!user) throw new Error("User not logged in");

        try {
            await api.delete(`/user/wishlist/remove/${user.email}/${productId}`);
        } catch (error) {
            console.error("Error removing from wishlist", error);
            throw error;
        }
    },

    getWishlist: async () => {
        const user = authService.getCurrentUser();
        if (!user) return [];

        try {
            const response = await api.get(`/user/wishlist/get/${user.email}`);
            return response.data;
        } catch (error) {
            console.error("Error fetching wishlist", error);
            return [];
        }
    },

    checkStatus: async (productId) => {
        const user = authService.getCurrentUser();
        if (!user) return false;

        try {
            const response = await api.get(`/user/wishlist/check/${user.email}/${productId}`);
            return response.data;
        } catch (error) {
            return false;
        }
    }
};

export default wishlistService;
