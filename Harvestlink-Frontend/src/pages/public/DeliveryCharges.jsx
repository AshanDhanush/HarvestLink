import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Package, DollarSign, MapPin, Truck, Clock, Tag, Box } from 'lucide-react';
import { GoogleMap, LoadScript, Marker, DirectionsRenderer } from '@react-google-maps/api';
import deliveryService from '../../services/deliveryService';
import TopBar from '../../components/layout/Topbar';
import NavBar from '../../components/layout/Navbar';
import PageHeader from '../../components/layout/PageHeader';
import Footer from '../../components/layout/Footer';

// Google Maps API Key
const GOOGLE_MAPS_API_KEY = 'AIzaSyADS3GI741SZqoad-saqUN6uhu_nvlMp1Q';

const mapContainerStyle = {
    width: '100%',
    height: '70vh', // 70% of viewport height for larger map
    borderRadius: '16px'
};

const defaultCenter = {
    lat: 6.9271, // Sri Lanka default center
    lng: 79.8612
};

// Delivery Cost Calculation Logic
const calculateDeliveryCost = (distanceKm, weightKg) => {
    // --- CONFIGURATION ---
    const BASE_FARE = 450;          // Rs. 450 minimum charge
    const BASE_DISTANCE = 5;        // First 5 km included
    const RATE_PER_KM = 90;         // Rs. 90 per additional km

    const BASE_WEIGHT = 50;         // Up to 50 kg included
    const WEIGHT_STEP = 10;         // Extra cost calculated per 10 kg
    const COST_PER_WEIGHT_STEP = 150; // Rs. 150 per extra 10 kg block
    // ---------------------

    let totalCost = BASE_FARE;
    let distanceCost = 0;
    let weightCost = 0;

    // 1. Calculate Extra Distance Cost
    if (distanceKm > BASE_DISTANCE) {
        const extraKm = distanceKm - BASE_DISTANCE;
        distanceCost = extraKm * RATE_PER_KM;
        totalCost += distanceCost;
    }

    // 2. Calculate Extra Weight Cost
    if (weightKg > BASE_WEIGHT) {
        const extraWeight = weightKg - BASE_WEIGHT;
        // Math.ceil ensures that if they have 51kg, they pay for the full 10kg block
        const weightBlocks = Math.ceil(extraWeight / WEIGHT_STEP);
        weightCost = weightBlocks * COST_PER_WEIGHT_STEP;
        totalCost += weightCost;
    }

    return {
        total: Math.round(totalCost), // Return rounded total
        baseFare: BASE_FARE,
        distanceCost: Math.round(distanceCost),
        weightCost: Math.round(weightCost),
        distanceSurcharge: distanceKm > BASE_DISTANCE ? (distanceKm - BASE_DISTANCE) : 0,
        weightSurcharge: weightKg > BASE_WEIGHT ? (weightKg - BASE_WEIGHT) : 0
    };
}

const DeliveryCharges = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [directions, setDirections] = useState(null);
    const [mapCenter, setMapCenter] = useState(defaultCenter);

    // Delivery Cost Breakdown State
    const [costBreakdown, setCostBreakdown] = useState({
        total: 0,
        baseFare: 0,
        distanceCost: 0,
        weightCost: 0,
        distanceSurcharge: 0,
        weightSurcharge: 0
    });

    // ... existing state ...

    // Temporary location selection feature
    const [isSelectingLocation, setIsSelectingLocation] = useState(false);
    const [locationType, setLocationType] = useState(null); // 'pickup' or 'delivery'
    const [tempPickupLocation, setTempPickupLocation] = useState(null);
    const [tempDeliveryLocation, setTempDeliveryLocation] = useState(null);
    const [showFullscreenMap, setShowFullscreenMap] = useState(false);

    // Real-time location and route tracking
    const [userLocation, setUserLocation] = useState(null);
    const [calculatedDistance, setCalculatedDistance] = useState(null);
    const [isLoadingRoute, setIsLoadingRoute] = useState(false);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                const data = await deliveryService.getProductById(id);
                setProduct(data);

                // Calculate initial estimated cost
                const weight = data.weight || data.quantity || 1;
                const estimatedDist = data.estimatedDistance || 5;
                const initialBreakdown = calculateDeliveryCost(estimatedDist, weight);
                setCostBreakdown(initialBreakdown);

                setError(null);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to fetch product details');
                console.error('Error fetching product:', err);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchProduct();
        }
    }, [id]);

    // Get user's location automatically on page load
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const userPos = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };
                    setUserLocation(userPos);
                    setMapCenter(userPos);
                },
                (error) => {
                    console.error('Error getting location:', error);
                    // Silently fail, user can still set locations manually
                }
            );
        }
    }, []);

    // Calculate route and distance manually when button is clicked
    const handleCalculateDistance = () => {
        // First, get user's current location
        if (navigator.geolocation) {
            setIsLoadingRoute(true);
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const userPos = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };
                    setUserLocation(userPos);
                    setMapCenter(userPos);

                    // Calculate route from user's current location to delivery location
                    if (tempDeliveryLocation && window.google) {
                        const directionsService = new window.google.maps.DirectionsService();

                        directionsService.route(
                            {
                                origin: userPos, // User's current location
                                destination: tempDeliveryLocation, // Delivery location
                                travelMode: window.google.maps.TravelMode.DRIVING,
                            },
                            (result, status) => {
                                if (status === window.google.maps.DirectionsStatus.OK) {
                                    setDirections(result);
                                    // Extract distance in kilometers
                                    const distanceInMeters = result.routes[0].legs[0].distance.value;
                                    const distanceInKm = parseFloat((distanceInMeters / 1000).toFixed(2));
                                    setCalculatedDistance(distanceInKm);

                                    // Calculate delivery cost based on distance and product weight/quantity
                                    // Assuming product.quantity or product.weight represents the total weight in kg
                                    // Fallback to 1kg if not available
                                    const weight = product.weight || product.quantity || 1;
                                    const breakdown = calculateDeliveryCost(distanceInKm, weight);
                                    setCostBreakdown(breakdown);
                                } else {
                                    console.error('Directions request failed:', status);
                                    setDirections(null);
                                    setCalculatedDistance(null);
                                    setCostBreakdown({
                                        total: 0,
                                        baseFare: 0,
                                        distanceCost: 0,
                                        weightCost: 0,
                                        distanceSurcharge: 0,
                                        weightSurcharge: 0
                                    });
                                }
                                setIsLoadingRoute(false);
                            }
                        );
                    } else {
                        setIsLoadingRoute(false);
                        alert('Please set a delivery location first.');
                    }
                },
                (error) => {
                    console.error('Error getting location:', error);
                    alert('Unable to get your location. Please enable location services.');
                    setIsLoadingRoute(false);
                }
            );
        } else {
            alert('Geolocation is not supported by your browser.');
        }
    };

    const handleMapClick = (event) => {
        if (isSelectingLocation && locationType) {
            const lat = event.latLng.lat();
            const lng = event.latLng.lng();

            // Sri Lanka Geographic Bounds
            // North: 9.85, South: 5.91, East: 81.90, West: 79.69
            const SRI_LANKA_BOUNDS = {
                NORTH: 9.95, // Slight buffer
                SOUTH: 5.85,
                EAST: 82.00,
                WEST: 79.50
            };

            // Check if clicked location is within Sri Lanka
            if (lat > SRI_LANKA_BOUNDS.NORTH || lat < SRI_LANKA_BOUNDS.SOUTH ||
                lng > SRI_LANKA_BOUNDS.EAST || lng < SRI_LANKA_BOUNDS.WEST) {
                alert("Please select a location within Sri Lanka.");
                return;
            }

            const location = { lat, lng };

            if (locationType === 'pickup') {
                setTempPickupLocation(location);
            } else if (locationType === 'delivery') {
                setTempDeliveryLocation(location);
            }

            setIsSelectingLocation(false);
            setLocationType(null);
            setShowFullscreenMap(false); // Make sure modal closes
        }
    };

    const startLocationSelection = (type) => {
        setIsSelectingLocation(true);
        setLocationType(type);
    };

    const clearLocation = (type) => {
        if (type === 'pickup') {
            setTempPickupLocation(null);
        } else if (type === 'delivery') {
            setTempDeliveryLocation(null);
        }
    };

    if (loading) {
        return (
            <>
                <TopBar />
                <NavBar />
                <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                    <div className="text-center">
                        <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-2 border-harvest-primary mb-4"></div>
                        <p className="text-gray-600 text-lg">Loading delivery information...</p>
                    </div>
                </div>
            </>
        );
    }

    if (error) {
        return (
            <>
                <TopBar />
                <NavBar />
                <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                    <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md text-center">
                        <div className="text-red-500 text-6xl mb-4">⚠️</div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">Error</h3>
                        <p className="text-gray-600">{error}</p>
                    </div>
                </div>
            </>
        );
    }

    if (!product) {
        return (
            <>
                <TopBar />
                <NavBar />
                <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                    <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md text-center">
                        <p className="text-gray-600 text-lg">No product found</p>
                    </div>
                </div>
            </>
        );
    }

    // Calculate total delivery cost
    // Old calculation logic removed - using costBreakdown state instead

    return (
        <>
            <TopBar />
            <NavBar />
            <PageHeader
                title="Delivery Tracking"
                bgImage="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=1600"
            />

            <div className="bg-gray-50 pb-20">
                <div className="container mx-auto px-4 py-8 -mt-10 relative z-20">

                    {/* Main Layout: Map on Left, Details on Right */}
                    <div className="grid lg:grid-cols-4 gap-6">

                        {/* MAP SECTION - Takes 3 columns (75% width) */}
                        <div className="lg:col-span-3 space-y-4">

                            {/* Map Card */}
                            <div className="bg-white rounded-3xl shadow-2xl p-6 border border-gray-100">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-harvest-bg-light p-3 rounded-full">
                                            <MapPin className="text-harvest-primary" size={24} />
                                        </div>
                                        <h2 className="text-2xl font-bold text-harvest-dark">Live Tracking</h2>
                                    </div>
                                    {userLocation && (
                                        <span className="text-sm text-green-600 font-semibold flex items-center gap-2">
                                            <span className="w-2 h-2 bg-green-600 rounded-full animate-pulse"></span>
                                            Location Active
                                        </span>
                                    )}
                                </div>

                                {/* Location Selector Buttons */}
                                <div className="mb-4 p-4 bg-gray-50 rounded-xl">
                                    <div className="flex flex-wrap gap-3">
                                        <button
                                            onClick={() => startLocationSelection('delivery')}
                                            disabled={isSelectingLocation}
                                            className={`px-4 py-2 rounded-lg font-semibold text-sm transition ${isSelectingLocation && locationType === 'delivery'
                                                ? 'bg-blue-600 text-white'
                                                : tempDeliveryLocation
                                                    ? 'bg-blue-100 text-blue-800 border-2 border-blue-500'
                                                    : 'bg-white text-blue-700 border-2 border-blue-300 hover:bg-blue-50'
                                                }`}
                                        >
                                            {isSelectingLocation && locationType === 'delivery' ? '📍 Click map...' : tempDeliveryLocation ? '✓ Delivery Set' : 'Set Delivery Location'}
                                        </button>
                                        {tempDeliveryLocation && (
                                            <button
                                                onClick={handleCalculateDistance}
                                                disabled={isLoadingRoute}
                                                className="px-4 py-2 rounded-lg font-semibold text-sm bg-harvest-primary text-white hover:bg-harvest-primary-hover transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                            >
                                                <Truck size={16} />
                                                {isLoadingRoute ? 'Calculating...' : 'Show Route'}
                                            </button>
                                        )}
                                        {tempDeliveryLocation && (
                                            <button
                                                onClick={() => {
                                                    clearLocation('delivery');
                                                    setDirections(null);
                                                    setCalculatedDistance(null);
                                                }}
                                                className="px-4 py-2 rounded-lg font-semibold text-sm bg-red-100 text-red-700 border-2 border-red-300 hover:bg-red-200 transition"
                                            >
                                                Clear
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Map */}
                                <div className={`${isSelectingLocation ? 'ring-4 ring-harvest-primary ring-opacity-50 rounded-2xl' : ''}`}>
                                    <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY}>
                                        <GoogleMap
                                            mapContainerStyle={mapContainerStyle}
                                            center={tempDeliveryLocation || userLocation || mapCenter}
                                            zoom={13}
                                            onClick={handleMapClick}
                                            options={{
                                                streetViewControl: false,
                                                mapTypeControl: false,
                                                fullscreenControl: false,
                                                zoomControl: true,
                                                cursor: isSelectingLocation ? 'crosshair' : 'default',
                                            }}
                                        >
                                            {/* User's current location marker */}
                                            {userLocation && window.google && (
                                                <Marker
                                                    position={userLocation}
                                                    icon={{
                                                        url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40">
                                                                <circle cx="20" cy="20" r="18" fill="#22c55e" stroke="white" stroke-width="3"/>
                                                                <circle cx="20" cy="20" r="8" fill="white"/>
                                                            </svg>
                                                        `),
                                                        scaledSize: new window.google.maps.Size(40, 40),
                                                        anchor: new window.google.maps.Point(20, 20),
                                                    }}
                                                    title="Your Current Location"
                                                />
                                            )}

                                            {/* Delivery location marker */}
                                            {tempDeliveryLocation && (
                                                <Marker
                                                    position={tempDeliveryLocation}
                                                    label={{
                                                        text: "📦",
                                                        fontSize: "24px"
                                                    }}
                                                    title="Delivery Location"
                                                />
                                            )}

                                            {/* Route between user and delivery */}
                                            {directions && (
                                                <DirectionsRenderer
                                                    directions={directions}
                                                    options={{
                                                        suppressMarkers: true,
                                                        polylineOptions: {
                                                            strokeColor: '#FF6B35',
                                                            strokeWeight: 6,
                                                            strokeOpacity: 1,
                                                        },
                                                    }}
                                                />
                                            )}
                                        </GoogleMap>
                                    </LoadScript>
                                </div>

                                {/* Distance Display */}
                                {calculatedDistance && (
                                    <div className="mt-4 p-4 bg-harvest-bg-light rounded-xl border-2 border-harvest-primary">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <Truck className="text-harvest-primary" size={24} />
                                                <span className="font-bold text-harvest-dark text-lg">Distance:</span>
                                            </div>
                                            <span className="text-harvest-primary font-bold text-2xl">{calculatedDistance} km</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* DETAILS SIDEBAR - Takes 1 column (25% width) */}
                        <div className="lg:col-span-1 space-y-4">

                            {/* Product Info Card */}
                            <div className="bg-white rounded-3xl shadow-xl p-6 border border-gray-100 sticky top-4">
                                <div className="flex items-center gap-3 mb-4">
                                    <Package className="text-harvest-primary" size={24} />
                                    <h3 className="text-xl font-bold text-harvest-dark">Product</h3>
                                </div>

                                <div className="space-y-3">
                                    <div>
                                        <p className="text-sm text-gray-600">Name</p>
                                        <p className="font-bold text-harvest-dark">{product.name || 'N/A'}</p>
                                    </div>

                                    {product.category && (
                                        <div>
                                            <p className="text-sm text-gray-600">Category</p>
                                            <p className="font-semibold text-gray-800">{product.category}</p>
                                        </div>
                                    )}

                                    <div>
                                        <p className="text-sm text-gray-600">Price</p>
                                        <p className="font-bold text-harvest-primary text-xl">Rs. {product.price ? product.price.toFixed(2) : '0.00'}</p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2">
                                        <div>
                                            <p className="text-xs text-gray-600">Weight</p>
                                            <p className="font-semibold text-sm">{product.weight ? `${product.weight} kg` : 'N/A'}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-600">Quantity</p>
                                            <p className="font-semibold text-sm">{product.quantity || 'N/A'}</p>
                                        </div>
                                    </div>

                                    <div className="pt-3 border-t">
                                        <p className="text-sm text-gray-600 mb-2 font-semibold">Delivery Breakdown</p>
                                        <div className="space-y-2 text-sm">
                                            {/* Base Fare */}
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Base Fare (0-5km)</span>
                                                <span className="font-semibold">Rs. {costBreakdown.baseFare}</span>
                                            </div>

                                            {/* Distance Surcharge */}
                                            {costBreakdown.distanceCost > 0 && (
                                                <div className="flex justify-between text-blue-700">
                                                    <span className="">Distance (+{costBreakdown.distanceSurcharge.toFixed(1)} km)</span>
                                                    <span className="font-semibold">Rs. {costBreakdown.distanceCost}</span>
                                                </div>
                                            )}

                                            {/* Heavy Load Fee */}
                                            {costBreakdown.weightCost > 0 && (
                                                <div className="flex justify-between text-orange-700">
                                                    <span className="">Heavy Load (+{costBreakdown.weightSurcharge} kg)</span>
                                                    <span className="font-semibold">Rs. {costBreakdown.weightCost}</span>
                                                </div>
                                            )}

                                            {/* Total */}
                                            <div className="flex justify-between pt-2 border-t-2 border-harvest-primary mt-2">
                                                <span className="font-bold text-harvest-dark text-lg">Total Cost</span>
                                                <span className="font-bold text-harvest-primary text-xl">Rs. {costBreakdown.total}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-3 border-t">
                                        <div className="flex items-center gap-2 text-sm">
                                            <Clock className="text-blue-600" size={16} />
                                            <div>
                                                <p className="text-gray-600">Est. Time</p>
                                                <p className="font-semibold text-blue-700">{product.estimatedDeliveryTime || '2-3 hours'}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <button className="w-full mt-4 bg-harvest-primary hover:bg-harvest-primary-hover text-white font-bold py-3 px-4 rounded-xl shadow-lg transition">
                                        Confirm Order
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Fullscreen Map Modal */}
            {showFullscreenMap && (
                <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl w-full max-w-5xl h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
                        <div className="p-4 border-b flex items-center justify-between bg-white z-10">
                            <div>
                                <h3 className="text-xl font-bold text-gray-900">Select {locationType === 'pickup' ? 'Pickup' : 'Delivery'} Location</h3>
                                <p className="text-sm text-gray-500">Click on the map to confirm location</p>
                            </div>
                            <button
                                onClick={() => {
                                    setShowFullscreenMap(false);
                                    setIsSelectingLocation(false);
                                    setLocationType(null);
                                }}
                                className="p-2 hover:bg-gray-100 rounded-full transition"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500 hover:text-gray-700"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                            </button>
                        </div>

                        <div className="flex-1 relative">
                            <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY}>
                                <GoogleMap
                                    mapContainerStyle={{ width: '100%', height: '100%' }}
                                    center={userLocation || mapCenter}
                                    zoom={14}
                                    onClick={handleMapClick}
                                    options={{
                                        streetViewControl: false,
                                        mapTypeControl: true,
                                        fullscreenControl: false,
                                        zoomControl: true,
                                        cursor: 'crosshair',
                                        clickableIcons: false,
                                    }}
                                >
                                    {userLocation && window.google && (
                                        <Marker
                                            position={userLocation}
                                            icon={{
                                                url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40">
                                                        <circle cx="20" cy="20" r="18" fill="#22c55e" stroke="white" stroke-width="3"/>
                                                        <circle cx="20" cy="20" r="8" fill="white"/>
                                                    </svg>
                                                `),
                                                scaledSize: new window.google.maps.Size(40, 40),
                                                anchor: new window.google.maps.Point(20, 20),
                                            }}
                                            title="Your Location"
                                        />
                                    )}
                                </GoogleMap>
                            </LoadScript>

                            {/* Overlay instructions */}
                            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur px-6 py-3 rounded-full shadow-lg border border-gray-200 pointer-events-none">
                                <p className="font-medium text-gray-800 flex items-center gap-2">
                                    <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                                    Tap anywhere on map to select location
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <Footer />
        </>
    );
};

export default DeliveryCharges;
