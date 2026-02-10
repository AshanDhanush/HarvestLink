// Google Maps API Key (same as used in DeliveryCharges.jsx)
const GOOGLE_MAPS_API_KEY = 'AIzaSyADS3GI741SZqoad-saqUN6uhu_nvlMp1Q';

/**
 * Delivery Fee Calculation Logic:
 * - Base: 20km = Rs. 300
 * - Distance: Every additional 10km = Rs. 10
 * - Weight: Up to 50kg = No extra, Every additional 10kg = Rs. 10
 */
const DELIVERY_CONFIG = {
    BASE_DISTANCE: 20,        // First 20 km included
    BASE_FEE: 300,            // Rs. 300 for first 20km
    DISTANCE_STEP: 10,        // Extra cost per 10km
    RATE_PER_DISTANCE_STEP: 10, // Rs. 10 per 10km

    BASE_WEIGHT: 50,          // Up to 50 kg included
    WEIGHT_STEP: 10,          // Extra cost per 10kg
    RATE_PER_WEIGHT_STEP: 10, // Rs. 10 per 10kg
};

/**
 * Calculate delivery fee based on distance and weight
 * @param {number} distanceKm - Distance in kilometers
 * @param {number} weightKg - Total weight in kilograms
 * @returns {object} Breakdown of delivery cost
 */
const calculateDistanceBasedDelivery = (distanceKm, weightKg) => {
    let baseFee = DELIVERY_CONFIG.BASE_FEE;
    let distanceCost = 0;
    let weightCost = 0;

    // 1. Calculate Extra Distance Cost
    if (distanceKm > DELIVERY_CONFIG.BASE_DISTANCE) {
        const extraKm = distanceKm - DELIVERY_CONFIG.BASE_DISTANCE;
        const distanceBlocks = Math.ceil(extraKm / DELIVERY_CONFIG.DISTANCE_STEP);
        distanceCost = distanceBlocks * DELIVERY_CONFIG.RATE_PER_DISTANCE_STEP;
    }

    // 2. Calculate Extra Weight Cost
    if (weightKg > DELIVERY_CONFIG.BASE_WEIGHT) {
        const extraWeight = weightKg - DELIVERY_CONFIG.BASE_WEIGHT;
        const weightBlocks = Math.ceil(extraWeight / DELIVERY_CONFIG.WEIGHT_STEP);
        weightCost = weightBlocks * DELIVERY_CONFIG.RATE_PER_WEIGHT_STEP;
    }

    const total = baseFee + distanceCost + weightCost;

    return {
        total: Math.round(total),
        baseFee,
        distanceCost: Math.round(distanceCost),
        weightCost: Math.round(weightCost),
        distanceKm: Math.round(distanceKm * 10) / 10,
        weightKg: Math.round(weightKg * 10) / 10,
        extraDistance: distanceKm > DELIVERY_CONFIG.BASE_DISTANCE ? Math.round((distanceKm - DELIVERY_CONFIG.BASE_DISTANCE) * 10) / 10 : 0,
        extraWeight: weightKg > DELIVERY_CONFIG.BASE_WEIGHT ? Math.round(weightKg - DELIVERY_CONFIG.BASE_WEIGHT) : 0,
    };
};

/**
 * Convert address string to coordinates using Google Geocoding API
 * @param {string} address - Address string (e.g., "Colombo, Sri Lanka")
 * @returns {Promise<{lat: number, lng: number} | null>}
 */
const geocodeAddress = async (address) => {
    try {
        // Append "Sri Lanka" if not already present for better accuracy
        const searchAddress = address.toLowerCase().includes('sri lanka') 
            ? address 
            : `${address}, Sri Lanka`;
        
        const response = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(searchAddress)}&key=${GOOGLE_MAPS_API_KEY}`
        );
        const data = await response.json();
        
        if (data.status === 'OK' && data.results.length > 0) {
            const location = data.results[0].geometry.location;
            return { lat: location.lat, lng: location.lng };
        }
        console.warn('Geocoding failed for address:', address, data.status);
        return null;
    } catch (error) {
        console.error('Geocoding error:', error);
        return null;
    }
};

/**
 * Calculate distance between two coordinates using Haversine formula
 * (Fallback when Google Directions API is not available)
 * @param {object} point1 - {lat, lng}
 * @param {object} point2 - {lat, lng}
 * @returns {number} Distance in kilometers
 */
const calculateHaversineDistance = (point1, point2) => {
    const R = 6371; // Earth's radius in km
    const dLat = (point2.lat - point1.lat) * Math.PI / 180;
    const dLng = (point2.lng - point1.lng) * Math.PI / 180;
    const a = 
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(point1.lat * Math.PI / 180) * Math.cos(point2.lat * Math.PI / 180) *
        Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
};

/**
 * Calculate driving distance using Google Directions API
 * @param {object} origin - {lat, lng}
 * @param {object} destination - {lat, lng}
 * @returns {Promise<number | null>} Distance in kilometers
 */
const calculateDrivingDistance = async (origin, destination) => {
    return new Promise((resolve) => {
        if (!window.google || !window.google.maps) {
            console.warn('Google Maps not loaded, using Haversine distance');
            resolve(calculateHaversineDistance(origin, destination) * 1.3); // Add 30% for road distance
            return;
        }

        const directionsService = new window.google.maps.DirectionsService();
        
        directionsService.route(
            {
                origin: origin,
                destination: destination,
                travelMode: window.google.maps.TravelMode.DRIVING,
            },
            (result, status) => {
                if (status === window.google.maps.DirectionsStatus.OK) {
                    const distanceInMeters = result.routes[0].legs[0].distance.value;
                    resolve(distanceInMeters / 1000); // Convert to km
                } else {
                    console.warn('Directions API failed, using Haversine:', status);
                    resolve(calculateHaversineDistance(origin, destination) * 1.3);
                }
            }
        );
    });
};

/**
 * Calculate delivery fee for cart items
 * @param {Array} cartItems - Array of cart items with location, weight, quantity
 * @param {object} deliveryLocation - {lat, lng} of delivery destination
 * @returns {Promise<object>} Delivery fee breakdown
 */
const calculateCartDeliveryFee = async (cartItems, deliveryLocation) => {
    if (!deliveryLocation || !cartItems || cartItems.length === 0) {
        return {
            total: 0,
            baseFee: 0,
            distanceCost: 0,
            weightCost: 0,
            distanceKm: 0,
            weightKg: 0,
            extraDistance: 0,
            extraWeight: 0,
            error: 'Missing delivery location or cart items'
        };
    }

    // Calculate total weight from cart items
    let totalWeight = 0;
    let maxDistance = 0;
    
    for (const item of cartItems) {
        // Calculate weight: use item.weight or estimate from quantity
        const itemWeight = item.weight ? item.weight * item.quantity : item.quantity * 1; // Default 1kg per unit
        totalWeight += itemWeight;

        // Get product location coordinates
        if (item.location) {
            const productCoords = await geocodeAddress(item.location);
            if (productCoords) {
                const distance = await calculateDrivingDistance(productCoords, deliveryLocation);
                if (distance > maxDistance) {
                    maxDistance = distance;
                }
            }
        }
    }

    // If no distance calculated, use a default estimate
    if (maxDistance === 0) {
        // Default to Sri Lanka center if no product location
        const defaultOrigin = { lat: 7.8731, lng: 80.7718 }; // Sri Lanka center
        maxDistance = calculateHaversineDistance(defaultOrigin, deliveryLocation) * 1.3;
    }

    return calculateDistanceBasedDelivery(maxDistance, totalWeight);
};

// Backward compatibility: simple calculation
const calculateDeliveryCharge = (subtotal, address) => {
    if (subtotal >= 5000) {
        return 0;
    }
    return 350;
};

const deliveryService = {
    calculateDeliveryCharge,
    calculateDistanceBasedDelivery,
    calculateCartDeliveryFee,
    geocodeAddress,
    calculateDrivingDistance,
    calculateHaversineDistance,
    DELIVERY_CONFIG,
    GOOGLE_MAPS_API_KEY,
};

export default deliveryService;
