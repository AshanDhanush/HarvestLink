import React, { createContext, useState, useEffect, useContext } from 'react';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const { user } = useAuth();
    const [cartItems, setCartItems] = useState([]);

    // Calculate unique storage key based on user
    const getStorageKey = (currentUser) => {
        if (currentUser && currentUser.email) {
            return `harvestLink_cart_${currentUser.email}`;
        }
        return 'harvestLink_cart_guest';
    };

    // Load cart when user changes
    useEffect(() => {
        const key = getStorageKey(user);
        const localData = localStorage.getItem(key);
        setCartItems(localData ? JSON.parse(localData) : []);
    }, [user]);

    // Save cart when items change
    useEffect(() => {
        const key = getStorageKey(user);
        localStorage.setItem(key, JSON.stringify(cartItems));
    }, [cartItems, user]);

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
        return cartItems.length;
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
