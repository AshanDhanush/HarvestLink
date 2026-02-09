import React, { createContext, useState, useEffect, useContext } from 'react';
import wishlistService from '../services/wishlistService';
import { useAuth } from './AuthContext';

const WishlistContext = createContext();

export const useWishlist = () => useContext(WishlistContext);

export const WishlistProvider = ({ children }) => {
    const { user } = useAuth();
    const [wishlistCount, setWishlistCount] = useState(0);
    const [wishlistItems, setWishlistItems] = useState([]);

    const fetchWishlist = async () => {
        if (user) {
            try {
                const items = await wishlistService.getWishlist();
                setWishlistItems(items);
                setWishlistCount(items.length);
            } catch (error) {
                console.error("Failed to fetch wishlist context", error);
            }
        } else {
            setWishlistItems([]);
            setWishlistCount(0);
        }
    };

    useEffect(() => {
        fetchWishlist();
    }, [user]);

    const addToWishlistContext = async (product) => {
        await wishlistService.addToWishlist(product);
        fetchWishlist();
    };

    const removeFromWishlistContext = async (productId) => {
        await wishlistService.removeFromWishlist(productId);
        fetchWishlist();
    };
    
    const isInWishlist = (productId) => {
        return wishlistItems.some(item => (item.productId === productId || item.id === productId));
    };

    const value = {
        wishlistCount,
        wishlistItems,
        addToWishlistContext,
        removeFromWishlistContext,
        isInWishlist,
        refreshWishlist: fetchWishlist
    };

    return (
        <WishlistContext.Provider value={value}>
            {children}
        </WishlistContext.Provider>
    );
};
