import axios from 'axios';
import authService from './authService';

// Use same base as user service (port 8080/8085 depending on gateway)
// Assuming direct access or gateway for now. The previous files used 8085 for admin and 8080 checks.
// Let's use VITE_API_BASE or default to 8080 for user service if distinct from product service.
const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8080';

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
            await axios.post(`${API_BASE}/api/v1/user/wishlist/add`, payload);
        } catch (error) {
            console.error("Error adding to wishlist", error);
            throw error;
        }
    },

    removeFromWishlist: async (productId) => {
        const user = authService.getCurrentUser();
        if (!user) throw new Error("User not logged in");

        try {
            await axios.delete(`${API_BASE}/api/v1/user/wishlist/remove/${user.email}/${productId}`);
        } catch (error) {
            console.error("Error removing from wishlist", error);
            throw error;
        }
    },

    getWishlist: async () => {
        const user = authService.getCurrentUser();
        if (!user) return [];

        try {
            const response = await axios.get(`${API_BASE}/api/v1/user/wishlist/get/${user.email}`);
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
            const response = await axios.get(`${API_BASE}/api/v1/user/wishlist/check/${user.email}/${productId}`);
            return response.data;
        } catch (error) {
            return false;
        }
    }
};

export default wishlistService;
