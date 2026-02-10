import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import deliveryService from '../../services/deliveryService';
import './DeliveryProductsTest.css';

//dilivery product test
const DeliveryProductsTest = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    //use effect
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const data = await deliveryService.getAllProducts();
                setProducts(data);
                setError(null);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to fetch products');
                console.error('Error fetching products:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const handleProductClick = (productId) => {
        navigate(`/delivery-charges/${productId}`);
    };

    if (loading) {
        return (
            <div className="delivery-test-container">
                <div className="loading-spinner">
                    <div className="spinner"></div>
                    <p>Loading products...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="delivery-test-container">
                <div className="error-message">
                    <i className="error-icon">⚠️</i>
                    <h3>Error</h3>
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="delivery-test-container">
            <div className="delivery-test-content">
                <h1 className="page-title">Delivery Products Test</h1>
                <p className="page-subtitle">
                    Click on any product to view delivery charges
                </p>

                {products.length === 0 ? (
                    <div className="no-products">
                        <p>No products available</p>
                    </div>
                ) : (
                    <div className="products-grid">
                        {products.map((product) => (
                            <div
                                key={product.id}
                                className="product-card"
                                onClick={() => handleProductClick(product.id)}
                            >
                                <div className="product-header">
                                    <h3 className="product-name">
                                        {product.name || 'Unnamed Product'}
                                    </h3>
                                    <span className="product-id">ID: {product.id}</span>
                                </div>

                                <div className="product-details">
                                    {product.category && (
                                        <div className="detail-row">
                                            <span className="detail-label">Category:</span>
                                            <span className="detail-value">{product.category}</span>
                                        </div>
                                    )}
                                    {product.price && (
                                        <div className="detail-row">
                                            <span className="detail-label">Price:</span>
                                            <span className="detail-value price">
                                                Rs. {product.price.toFixed(2)}
                                            </span>
                                        </div>
                                    )}
                                    {product.weight && (
                                        <div className="detail-row">
                                            <span className="detail-label">Weight:</span>
                                            <span className="detail-value">
                                                {product.weight} kg
                                            </span>
                                        </div>
                                    )}
                                    {product.quantity !== undefined && (
                                        <div className="detail-row">
                                            <span className="detail-label">Quantity:</span>
                                            <span className="detail-value">{product.quantity}</span>
                                        </div>
                                    )}
                                </div>

                                {product.description && (
                                    <div className="product-description">
                                        <p>{product.description}</p>
                                    </div>
                                )}

                                <div className="product-footer">
                                    <button className="view-delivery-btn">
                                        View Delivery Charges →
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default DeliveryProductsTest;
