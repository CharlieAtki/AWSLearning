import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { ArrowLeft, ArrowRight, DollarSign, Shield, Truck, RefreshCw, Star, Check, Minus, Plus } from "lucide-react";
import makeAuthenticatedRequest from "../utils/api";

const ProductView = ({ userData, onCheckoutUpdate }) => {
    const navigate = useNavigate();
    const { state } = useLocation();
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const product = state?.product;

    const [quantity, setQuantity] = useState(1);
    const [updatingItem, setUpdatingItem] = useState(null);
    const [updatingCheckoutValue, setUpdatingCheckoutValue] = useState(null); // Used for spinners
    const [totalCheckoutValue, setTotalCheckoutValue] = useState(null);
    const [addingToCart, setAddingToCart] = useState(null); // Track which product is being added


    if (!product) {
        return <div className="p-6 text-center text-gray-500">No product selected.</div>;
    }

    // Safely deconstruct product details with fallbacks
    const {
        productId,
        productName,
        description,
        imageUrl,
        price
    } = product || {
        productId: null,
        productName: "Unknown Product",
        description: "No description available.",
        imageUrl: "https://via.placeholder.com/600x400?text=No+Image",
        price: 0
    };

    // Mock data for enhanced product info
    const features = [
        "Premium quality materials",
        "Expertly crafted design",
        "Satisfaction guaranteed",
        "Fast shipping available"
    ];

    // Hardcoded benefits section data
    const benefits = [
        { icon: Truck, title: "Free Delivery", desc: "On orders over £50" },
        { icon: RefreshCw, title: "Easy Returns", desc: "30-day return policy" },
        { icon: Shield, title: "Secure Payment", desc: "100% secure checkout" }
    ];    

    const addItemToOrder = async (productId, productName) => {
        // Check if user is signed in
        if (!userData || !userData.user) {
            alert("Please sign in to add items to your cart");
            return;
        }

        setAddingToCart(productId); // Set loading state for this specific product

        try {
            const response = await makeAuthenticatedRequest(`${backendUrl}/api/user-auth/addItemToCheckout`,
                {
                    method: "POST",
                    body: JSON.stringify({
                        productId,
                        productName,
                        userEmail: userData.user.email,
                        quantity
                    })
                }
            );

            const data = await response.json();

            if (data.success) {
                console.log("Cart updated with product:", productId);
                // Trigger parent component to refetch user data
                if (onCheckoutUpdate) {
                    await onCheckoutUpdate();
                }
            } else {
                console.error("Failed to add product to cart:", data.message);
                alert("Failed to add item to cart. Please try again.");
            }

        } catch (error) {
            console.error('Error adding product to cart:', error);
            alert("An error occurred. Please try again.");
        } finally {
            setAddingToCart(null); // Clear loading state
        }
    };

    return (
        <div className="p-4 sm:p-8 bg-gradient-to-br from-gray-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 min-h-screen text-gray-900 dark:text-white">
            <div className="max-w-7xl mx-auto w-full">

                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <button
                        onClick={() => navigate("/")}
                        className="flex items-center text-sm sm:text-base text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
                    >
                        <ArrowLeft className="mr-2 w-5 h-5" />
                        Back to Marketplace
                    </button>
                    <div className="flex items-center gap-1 text-yellow-500">
                        {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-current" />
                        ))}
                        <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">(128 reviews)</span>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">

                    {/* Image Section */}
                    <div className="space-y-4">
                        <div className="relative group">
                            <img
                                src={imageUrl}
                                alt={productName}
                                className="w-full h-[400px] sm:h-[500px] object-cover rounded-2xl shadow-2xl border-2 border-gray-200 dark:border-gray-700"
                            />
                            <div className="absolute top-4 right-4 bg-indigo-600 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                                Premium Quality
                            </div>
                        </div>
                    </div>

                    {/* Info Panel */}
                    <div className="flex flex-col">
                        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                            {productName}
                        </h1>

                        <div className="flex items-baseline gap-4 mb-6">
                            <p className="text-5xl font-bold text-indigo-600 dark:text-indigo-400">
                                £{price?.toFixed(2) ?? "N/A"}
                            </p>
                            <span className="text-lg text-gray-500 line-through">£{((price ?? 0) * 1.3).toFixed(2)}</span>
                            <span className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-3 py-1 rounded-full text-sm font-semibold">
                                Save 23%
                            </span>
                        </div>

                        {/* Description */}
                        <div className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">
                                Product Description
                            </h2>
                            <p className="text-gray-700 dark:text-gray-300 text-base leading-relaxed mb-4">
                                {description}
                            </p>
                            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                                Experience premium quality with our carefully curated selection. This product combines exceptional craftsmanship with modern design, ensuring you get the best value for your investment.
                            </p>
                        </div>

                        {/* Key Features */}
                        <div className="mb-8">
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                                Key Features
                            </h3>
                            <ul className="space-y-3">
                                {features.map((feature, idx) => (
                                    <li key={idx} className="flex items-start gap-3">
                                        <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                                        <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Quantity Selector */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Quantity
                            </label>
                            <div className="flex items-center gap-3">
                                {/* <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="w-10 h-10 rounded-lg border-2 border-gray-300 dark:border-gray-600 hover:border-indigo-500 dark:hover:border-indigo-400 flex items-center justify-center text-xl font-semibold transition"
                                >
                                    -
                                </button>
                                <input
                                    type="number"
                                    value={quantity}
                                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                                    className="w-20 h-10 text-center border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-semibold"
                                />
                                <button
                                    onClick={() => setQuantity(quantity + 1)}
                                    className="w-10 h-10 rounded-lg border-2 border-gray-300 dark:border-gray-600 hover:border-indigo-500 dark:hover:border-indigo-400 flex items-center justify-center text-xl font-semibold transition"
                                >
                                    +
                                </button> */}

                                {/* Quantity Controls */}
                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={() => setQuantity(quantity - 1)}
                                            disabled={quantity <= 1 || updatingItem === productId}
                                            className="p-1 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
                                        >
                                            <Minus className="w-4 h-4 text-gray-700 dark:text-gray-200" />
                                        </button>

                                        <span className="text-gray-700 dark:text-gray-200 font-semibold min-w-[2rem] text-center">
                                            {quantity}
                                        </span>

                                        <button
                                            onClick={() => setQuantity(quantity + 1)}
                                            disabled={updatingItem === productId}
                                            className="p-1 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
                                        >
                                            <Plus className="w-4 h-4 text-gray-700 dark:text-gray-200" />
                                        </button>
                                    </div>
                                <span className="ml-4 text-gray-600 dark:text-gray-400">
                                    Total: <span className="font-bold text-gray-900 dark:text-white">£{((price ?? 0) * quantity).toFixed(2)}</span>
                                </span>
                            </div>
                        </div>

                        {/* Call to Action */}
                        <div className="flex gap-4">
                            {/* <button
                                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-xl transition-all transform hover:scale-105 flex items-center justify-center text-lg font-semibold shadow-lg"
                                onClick={() => {
                                    alert(`Added ${quantity}x "${productName}" to cart.`);
                                }}
                            >
                                Add to Cart
                                <ArrowRight className="ml-2 w-5 h-5" />
                            </button>
                            <button
                                className="flex-1 bg-green-600 hover:bg-green-700 text-white py-4 rounded-xl transition-all transform hover:scale-105 flex items-center justify-center text-lg font-semibold shadow-lg"
                                onClick={() => {
                                    alert(`Proceeding to checkout with ${quantity}x "${productName}"`);
                                }}
                            >
                                Buy Now
                            </button> */}

                            <button 
                                className={`w-full mx-4 py-2 px-4 rounded-md transition text-sm sm:text-base flex items-center justify-center gap-2 ${
                                    userData && userData.user 
                                        ? addingToCart === (product._id ?? product.id)
                                            ? 'bg-green-500 text-white'
                                            : 'bg-blue-600 text-white hover:bg-blue-700'
                                        : 'bg-gray-400 text-gray-200 cursor-not-allowed'
                                }`}
                                onClick={(e) => {
                                    e.stopPropagation(); // Stops the click from propagating to the parent div
                                    addItemToOrder(product._id ?? product.id, product.productName)
                                }}
                                disabled={!userData || !userData.user || addingToCart === (product._id ?? product.id)}
                            >
                                {addingToCart === (product._id ?? product.id) ? (
                                    <>
                                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        <span>Added!</span>
                                    </>
                                ) : userData && userData.user ? (
                                    'Add to Cart'
                                ) : (
                                    'Sign In to Add'
                                )}
                            </button>
                        </div>

                        <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-4">
                            In stock and ready to ship
                        </p>
                    </div>
                </div>

                {/* Benefits Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    {benefits.map((benefit, idx) => {
                        const Icon = benefit.icon;
                        return (
                            <div key={idx} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 flex items-start gap-4">
                                <div className="bg-indigo-100 dark:bg-indigo-900 p-3 rounded-lg">
                                    <Icon className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-900 dark:text-white mb-1">{benefit.title}</h4>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">{benefit.desc}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Customer Reviews Section */}
                <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Customer Reviews</h2>
                    <div className="space-y-6">
                        {[
                            { name: "Sarah M.", rating: 5, comment: "Absolutely love this product! Exceeded my expectations in every way.", date: "2 weeks ago" },
                            { name: "James T.", rating: 5, comment: "Great quality and fast delivery. Highly recommend!", date: "1 month ago" },
                            { name: "Emma R.", rating: 4, comment: "Very satisfied with my purchase. Would buy again.", date: "1 month ago" }
                        ].map((review, idx) => (
                            <div key={idx} className="border-b border-gray-200 dark:border-gray-700 pb-6 last:border-0">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center font-semibold text-indigo-600 dark:text-indigo-400">
                                            {review.name[0]}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-900 dark:text-white">{review.name}</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">{review.date}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-1">
                                        {[...Array(review.rating)].map((_, i) => (
                                            <Star key={i} className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                                        ))}
                                    </div>
                                </div>
                                <p className="text-gray-700 dark:text-gray-300">{review.comment}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductView;
