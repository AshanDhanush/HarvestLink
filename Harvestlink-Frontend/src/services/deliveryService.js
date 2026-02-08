const deliveryService = {
    /**
     * Calculate delivery charge based on order subtotal and address.
     * Current logic: Free delivery for orders over LKR 5000, else LKR 350.
     * @param {number} subtotal - The total price of items in the cart.
     * @param {string} address - The delivery address (unused for now, but ready for future distance-based logic).
     * @returns {number} The calculated delivery fee.
     */
    calculateDeliveryCharge: (subtotal, address) => {
        if (subtotal >= 5000) {
            return 0;
        }
        return 350;
    }
};

export default deliveryService;
