import React, { createContext, useState, useEffect, useContext } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState(() => {
        const localData = localStorage.getItem('harvestLink_cart');
        return localData ? JSON.parse(localData) : [];
    });

    useEffect(() => {
        localStorage.setItem('harvestLink_cart', JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = (product, quantity = 1) => {
        setCartItems(prevItems => {
            const existingItemIndex = prevItems.findIndex(item => (item.id || item.tempID) === (product.id || product.tempID));

            if (existingItemIndex > -1) {
                // Item exists, update quantity
                const newItems = [...prevItems];
                newItems[existingItemIndex].quantity += quantity;
                return newItems;
            } else {
                // Item doesn't exist, add it
                // ensure we have a consistent ID and valid price details
                return [...prevItems, {
                    ...product,
                    id: product.id || product.tempID,
                    quantity
                }];
            }
        });
    };

    const removeFromCart = (productId) => {
        setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
    };

    const updateQuantity = (productId, newQuantity) => {
        if (newQuantity < 1) return;
        setCartItems(prevItems =>
            prevItems.map(item =>
                item.id === productId ? { ...item, quantity: newQuantity } : item
            )
        );
    };

    const clearCart = () => {
        setCartItems([]);
    };

    const getCartTotal = () => {
        return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    const getCartCount = () => {
        return cartItems.reduce((count, item) => count + item.quantity, 0);
    };

    const value = {
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartCount
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};
