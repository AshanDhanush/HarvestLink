import React, { useState, useEffect, useCallback } from 'react';
import { GoogleMap, LoadScript, Marker, DirectionsRenderer } from '@react-google-maps/api';
import { MapPin, Navigation, Truck, X, Loader, Route } from 'lucide-react';
import deliveryService from '../../services/deliveryService';

const mapContainerStyle = {
    width: '100%',
    height: '350px',
    borderRadius: '12px'
};

const defaultCenter = {
    lat: 6.9271, // Colombo, Sri Lanka
    lng: 79.8612
};

// Sri Lanka bounds for validation
const SRI_LANKA_BOUNDS = {
    NORTH: 9.95,
    SOUTH: 5.85,
    EAST: 82.00,
    WEST: 79.50
};

const DeliveryLocationPicker = ({
    cartItems = [],
    onDeliveryFeeCalculated,
    onLocationSelected,
    initialLocation = null
}) => {
    const [isMapLoaded, setIsMapLoaded] = useState(false);
    const [deliveryLocation, setDeliveryLocation] = useState(initialLocation);
    const [productLocations, setProductLocations] = useState([]);
    const [directions, setDirections] = useState(null);
    const [routeInfo, setRouteInfo] = useState(null);
    const [isCalculating, setIsCalculating] = useState(false);
    const [isLocating, setIsLocating] = useState(false);
    const [mapCenter, setMapCenter] = useState(defaultCenter);
    const [error, setError] = useState(null);
    const [isExpanded, setIsExpanded] = useState(false);

    // Get unique product locations
    useEffect(() => {
        const getProductLocations = async () => {
            const locations = [];
            const seenLocations = new Set();

            for (const item of cartItems) {
                if (item.location && !seenLocations.has(item.location)) {
                    seenLocations.add(item.location);
                    const coords = await deliveryService.geocodeAddress(item.location);
                    if (coords) {
                        locations.push({
                            name: item.location,
                            coords,
                            productName: item.name
                        });
                    }
                }
            }
            setProductLocations(locations);

            // Center map on first product location if available
            if (locations.length > 0) {
                setMapCenter(locations[0].coords);
            }
        };

        if (cartItems.length > 0) {
            getProductLocations();
        }
    }, [cartItems]);

    // Calculate route when both product locations and delivery location are set
    const calculateRoute = useCallback((destination, productLocs) => {
        if (!destination || productLocs.length === 0 || !window.google) {
            return;
        }

        const directionsService = new window.google.maps.DirectionsService();
        const origin = productLocs[0].coords;

        directionsService.route(
            {
                origin: origin,
                destination: destination,
                travelMode: window.google.maps.TravelMode.DRIVING,
            },
            (result, status) => {
                if (status === window.google.maps.DirectionsStatus.OK) {
                    setDirections(result);
                    // Extract route info
                    const leg = result.routes[0].legs[0];
                    setRouteInfo({
                        distance: leg.distance.text,
                        duration: leg.duration.text,
                        startAddress: leg.start_address,
                        endAddress: leg.end_address
                    });
                } else {
                    console.error('Directions request failed:', status);
                    setDirections(null);
                    setRouteInfo(null);
                }
            }
        );
    }, []);

    // Calculate delivery fee and route when location changes
    const calculateDeliveryFee = useCallback(async (location) => {
        if (!location || cartItems.length === 0) return;

        setIsCalculating(true);
        setError(null);

        try {
            const breakdown = await deliveryService.calculateCartDeliveryFee(cartItems, location);
            onDeliveryFeeCalculated?.(breakdown);
        } catch (err) {
            console.error('Error calculating delivery fee:', err);
            setError('Failed to calculate delivery fee');
        } finally {
            setIsCalculating(false);
        }
    }, [cartItems, onDeliveryFeeCalculated]);

    // Recalculate route when product locations or delivery location changes
    useEffect(() => {
        if (deliveryLocation && productLocations.length > 0 && isMapLoaded) {
            calculateRoute(deliveryLocation, productLocations);
        }
    }, [deliveryLocation, productLocations, isMapLoaded, calculateRoute]);

    // Handle map click
    const handleMapClick = (event) => {
        const lat = event.latLng.lat();
        const lng = event.latLng.lng();

        // Validate within Sri Lanka bounds
        if (lat > SRI_LANKA_BOUNDS.NORTH || lat < SRI_LANKA_BOUNDS.SOUTH ||
            lng > SRI_LANKA_BOUNDS.EAST || lng < SRI_LANKA_BOUNDS.WEST) {
            setError('Please select a location within Sri Lanka');
            return;
        }

        const location = { lat, lng };
        setDeliveryLocation(location);
        onLocationSelected?.(location);
        calculateDeliveryFee(location);
        setError(null);
    };

    // Use current location
    const useCurrentLocation = () => {
        if (!navigator.geolocation) {
            setError('Geolocation is not supported by your browser');
            return;
        }

        setIsLocating(true);
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const location = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                setDeliveryLocation(location);
                setMapCenter(location);
                onLocationSelected?.(location);
                calculateDeliveryFee(location);
                setIsLocating(false);
            },
            (error) => {
                console.error('Error getting location:', error);
                setError('Unable to get your location. Please click on the map instead.');
                setIsLocating(false);
            }
        );
    };

    // Clear selection
    const clearLocation = () => {
        setDeliveryLocation(null);
        setDirections(null);
        setRouteInfo(null);
        onLocationSelected?.(null);
        onDeliveryFeeCalculated?.({
            total: 0,
            baseFee: 0,
            distanceCost: 0,
            weightCost: 0,
            distanceKm: 0,
            weightKg: 0,
            extraDistance: 0,
            extraWeight: 0
        });
    };

    return (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            {/* Header */}
            <div
                className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-b border-gray-100 cursor-pointer"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-100 rounded-lg">
                            <Truck className="text-green-600" size={20} />
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-800">Delivery Location</h3>
                            <p className="text-sm text-gray-500">
                                {deliveryLocation ? 'Location selected' : 'Click to set delivery location'}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {isCalculating && (
                            <Loader className="animate-spin text-green-600" size={20} />
                        )}
                        {deliveryLocation && (
                            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                                ✓ Set
                            </span>
                        )}
                        <span className="text-gray-400">
                            {isExpanded ? '▲' : '▼'}
                        </span>
                    </div>
                </div>
            </div>

            {/* Expandable Content */}
            {isExpanded && (
                <div className="p-4 space-y-4">
                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={useCurrentLocation}
                            disabled={isLocating}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition font-medium text-sm disabled:opacity-50"
                        >
                            {isLocating ? (
                                <Loader className="animate-spin" size={16} />
                            ) : (
                                <Navigation size={16} />
                            )}
                            Use My Location
                        </button>

                        {deliveryLocation && (
                            <button
                                onClick={clearLocation}
                                className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition font-medium text-sm"
                            >
                                <X size={16} />
                                Clear
                            </button>
                        )}
                    </div>

                    {/* Route Info Banner */}
                    {routeInfo && (
                        <div className="p-3 bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl border border-green-200">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-green-500 rounded-full">
                                    <Route className="text-white" size={18} />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-4">
                                        <div>
                                            <p className="text-xs text-green-700 font-medium">Distance</p>
                                            <p className="text-lg font-bold text-green-800">{routeInfo.distance}</p>
                                        </div>
                                        <div className="h-8 w-px bg-green-300"></div>
                                        <div>
                                            <p className="text-xs text-green-700 font-medium">Est. Time</p>
                                            <p className="text-lg font-bold text-green-800">{routeInfo.duration}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Error Message */}
                    {error && (
                        <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    {/* Location Legend */}
                    <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-2">
                            <span className="w-4 h-4 bg-green-500 rounded-full inline-block"></span>
                            <span className="text-gray-600">Product Location</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-4 h-4 bg-blue-500 rounded-full inline-block"></span>
                            <span className="text-gray-600">Delivery Location</span>
                        </div>
                        {directions && (
                            <div className="flex items-center gap-2">
                                <span className="w-6 h-1 bg-green-500 rounded inline-block"></span>
                                <span className="text-gray-600">Route</span>
                            </div>
                        )}
                    </div>

                    {/* Map */}
                    <div className="rounded-xl overflow-hidden border-2 border-gray-200 shadow-lg">
                        <LoadScript googleMapsApiKey={deliveryService.GOOGLE_MAPS_API_KEY}>
                            <GoogleMap
                                mapContainerStyle={mapContainerStyle}
                                center={deliveryLocation || mapCenter}
                                zoom={deliveryLocation ? 12 : 9}
                                onClick={handleMapClick}
                                onLoad={() => setIsMapLoaded(true)}
                                options={{
                                    streetViewControl: false,
                                    mapTypeControl: false,
                                    fullscreenControl: true,
                                    zoomControl: true,
                                    cursor: 'crosshair',
                                }}
                            >
                                {/* Product location markers */}
                                {productLocations.map((loc, idx) => (
                                    <Marker
                                        key={`product-${idx}`}
                                        position={loc.coords}
                                        icon={window.google ? {
                                            url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                                                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40">
                                                    <circle cx="20" cy="20" r="18" fill="#22c55e" stroke="white" stroke-width="3"/>
                                                    <text x="20" y="26" font-size="18" text-anchor="middle" fill="white">🌾</text>
                                                </svg>
                                            `),
                                            scaledSize: new window.google.maps.Size(40, 40),
                                            anchor: new window.google.maps.Point(20, 20),
                                        } : undefined}
                                        title={`Product: ${loc.productName} (${loc.name})`}
                                    />
                                ))}

                                {/* Delivery location marker */}
                                {deliveryLocation && window.google && (
                                    <Marker
                                        position={deliveryLocation}
                                        icon={{
                                            url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                                                <svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 44 44">
                                                    <circle cx="22" cy="22" r="20" fill="#3b82f6" stroke="white" stroke-width="3"/>
                                                    <text x="22" y="28" font-size="20" text-anchor="middle" fill="white">📍</text>
                                                </svg>
                                            `),
                                            scaledSize: new window.google.maps.Size(44, 44),
                                            anchor: new window.google.maps.Point(22, 22),
                                        }}
                                        title="Delivery Location"
                                    />
                                )}

                                {/* Route between product and delivery location */}
                                {directions && (
                                    <DirectionsRenderer
                                        directions={directions}
                                        options={{
                                            suppressMarkers: true,
                                            polylineOptions: {
                                                strokeColor: '#22c55e',
                                                strokeWeight: 5,
                                                strokeOpacity: 0.9,
                                            },
                                        }}
                                    />
                                )}
                            </GoogleMap>
                        </LoadScript>
                    </div>

                    {/* Instructions */}
                    <p className="text-xs text-gray-500 text-center">
                        📍 Click anywhere on the map to set your delivery location. The route will be drawn automatically.
                    </p>
                </div>
            )}
        </div>
    );
};

export default DeliveryLocationPicker;
