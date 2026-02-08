import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, Heart, ArrowLeft, ShoppingCart, Truck, ShieldCheck, MapPin } from 'lucide-react';
import TopBar from '../../components/layout/Topbar';
import NavBar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import productService from '../../services/productService';
import { useCart } from '../../context/CartContext';
import toast from 'react-hot-toast';

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [error, setError] = useState(null);
    const { addToCart } = useCart();

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const data = await productService.getProductById(id);
                setProduct(data);
            } catch (err) {
                console.error("Failed to load product details", err);
                setError("Failed to load product details");
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchProduct();
        }
    }, [id]);

    const handleQuantityChange = (type) => {
        if (type === 'inc') {
            setQuantity(prev => prev + 1);
        } else {
            setQuantity(prev => (prev > 1 ? prev - 1 : 1));
        }
    };

    const handleAddToCart = (redirect = false) => {
        if (product) {
            addToCart({ ...product, id: product.id || product.tempID }, quantity);
            if (redirect) {
                navigate('/cart');
            } else {
                toast.success('Added to cart');
            }
        }
    };

    if (loading) return (
        <>
            <TopBar />
            <NavBar />
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-harvest-primary"></div>
            </div>
            <Footer />
        </>
    );

    if (error || !product) return (
        <>
            <TopBar />
            <NavBar />
            <div className="min-h-screen flex flex-col items-center justify-center gap-4">
                <h2 className="text-2xl font-bold text-gray-800">Product Not Found</h2>
                <p className="text-gray-600">The product you are looking for does not exist or has been removed.</p>
                <button
                    onClick={() => navigate('/shop')}
                    className="px-6 py-2 bg-harvest-primary text-white rounded-lg hover:bg-harvest-dark transition-colors"
                >
                    Back to Shop
                </button>
            </div>
            <Footer />
        </>
    );

    return (
        <div className="bg-gray-50 min-h-screen">
            <TopBar />
            <NavBar />

            <div className="container mx-auto px-4 py-8">
                {/* Breadcrumb / Back Button */}
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-gray-500 hover:text-harvest-primary mb-6 transition-colors"
                >
                    <ArrowLeft size={20} />
                    <span>Back</span>
                </button>

                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                        {/* Image Section */}
                        <div className="bg-gray-100 p-8 flex items-center justify-center relative min-h-[400px]">
                            <img
                                src={product.imageUrl || "https://placehold.co/600x600?text=No+Image"}
                                alt={product.name}
                                className="w-full h-full object-contain max-h-[500px] mix-blend-multiply"
                            />
                            <button className="absolute top-6 right-6 p-3 rounded-full bg-white/80 hover:bg-white text-gray-600 hover:text-red-500 shadow-sm transition-colors backdrop-blur-sm">
                                <Heart size={24} />
                            </button>
                            <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm font-bold text-harvest-dark shadow-sm">
                                {product.category || 'Fresh Produce'}
                            </div>
                        </div>

                        {/* Details Section */}
                        <div className="p-8 md:p-12 flex flex-col">
                            <div className="mb-2 text-sm text-harvest-primary font-bold uppercase tracking-wider">
                                {product.farmerName ? `Sold by ${product.farmerName}` : 'Verified Farmer'}
                            </div>

                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{product.name}</h1>

                            <div className="flex items-center gap-4 mb-6">
                                <div className="flex items-center gap-1 text-yellow-400">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} size={18} fill="currentColor" />
                                    ))}
                                </div>
                                <span className="text-sm text-gray-500">(Sold Percentage: 50%)</span>
                                <span className="text-gray-300">|</span>
                                <div className="flex items-center gap-1 text-green-600 text-sm font-medium">
                                    <ShieldCheck size={16} />
                                    <span>Quality Verified</span>
                                </div>
                            </div>

                            <div className="flex items-end gap-2 mb-8">
                                <span className="text-4xl font-bold text-harvest-dark">LKR {product.price}</span>
                                <span className="text-lg text-gray-400 font-medium mb-1">/ {product.unit || 'Kg'}</span>
                            </div>

                            <div className="prose prose-sm text-gray-600 mb-8 border-b border-gray-100 pb-8">
                                <p>
                                    {product.description || "Fresh, locally sourced produce delivered directly from the farm to your table. Grown with care and sustainable farming practices to ensure the highest quality and taste."}
                                </p>
                            </div>

                            {product.location && (
                                <div className="flex items-center gap-2 text-gray-600 mb-6">
                                    <MapPin size={18} className="text-harvest-primary" />
                                    <span className="font-medium">Sourced from: {product.location}</span>
                                </div>
                            )}

                            {/* Quantity & Actions */}
                            <div className="flex flex-col sm:flex-row gap-4 mb-8">
                                <div className="flex items-center border-2 border-gray-200 rounded-xl w-fit">
                                    <button
                                        onClick={() => handleQuantityChange('dec')}
                                        className="px-4 py-3 hover:bg-gray-50 text-gray-600 transition-colors rounded-l-lg"
                                    >
                                        -
                                    </button>
                                    <span className="w-12 text-center font-bold text-gray-800">{quantity}</span>
                                    <button
                                        onClick={() => handleQuantityChange('inc')}
                                        className="px-4 py-3 hover:bg-gray-50 text-gray-600 transition-colors rounded-r-lg"
                                    >
                                        +
                                    </button>
                                </div>
                                <div className="flex-1 flex gap-3">
                                    <button
                                        onClick={() => handleAddToCart(true)}
                                        className="flex-1 bg-harvest-primary hover:bg-harvest-dark text-white font-bold py-3 px-6 rounded-xl transition-colors shadow-lg shadow-green-200 flex items-center justify-center gap-2">
                                        Buy Now
                                    </button>
                                    <button
                                        onClick={() => handleAddToCart(false)}
                                        className="p-3 border-2 border-gray-200 rounded-xl hover:border-harvest-primary hover:text-harvest-primary text-gray-600 transition-colors">
                                        <ShoppingCart size={24} />
                                    </button>
                                </div>
                            </div>

                            {/* Additional Info */}
                            <div className="flex items-center gap-3 text-sm text-gray-500 bg-blue-50 p-4 rounded-xl border border-blue-100">
                                <Truck size={20} className="text-blue-500" />
                                <span>Standard delivery within 1-2 days. Free shipping on orders over LKR 5000.</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default ProductDetail;
