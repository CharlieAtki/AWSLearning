import { useEffect, useMemo, useState} from "react";
import makeAuthenticatedRequest from "../utils/api";
import { useNavigate } from "react-router-dom";

const MarketplaceGrid = ({ userData, onCheckoutUpdate, filters }) => {

    const [products, setProducts] = useState([]);
    const [addingToCart, setAddingToCart] = useState(null); // Track which product is being added
    
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const navigate = useNavigate();

    useEffect(() => {
        // Fetch products from backend API
        const fetchProducts = async () => {
            try {
                const response = await fetch(`${backendUrl}/api/product-unAuth/getAllProducts`);
                const data = await response.json();

                if (data.success) {
                    setProducts(data.products);
                } else {
                    console.error('Failed to fetch products:', data.message);
                }
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };

        fetchProducts();
    }, [backendUrl]);

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
                        userEmail: userData.user.email
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

    const filteredProducts = useMemo(() => {
        if (!Array.isArray(products)) return [];
        const search = (filters?.search || '').trim().toLowerCase();
        const minPrice = filters?.minPrice !== '' && filters?.minPrice != null ? parseFloat(filters.minPrice) : null;
        const maxPrice = filters?.maxPrice !== '' && filters?.maxPrice != null ? parseFloat(filters.maxPrice) : null;
        const category = (filters?.category || '').trim().toLowerCase();
        const business = (filters?.business || '').trim().toLowerCase();
        const sort = filters?.sort || 'relevance';

        let list = products.filter(p => {
            const name = (p.productName || '').toLowerCase();
            const desc = (p.description || '').toLowerCase();
            const price = typeof p.price === 'number' ? p.price : parseFloat(p.price);
            const pCategory = (p.category || '').toLowerCase();
            const pBusinessId = (p.business && p.business.businessId) ? String(p.business.businessId).toLowerCase() : '';
            const matchesSearch = search ? (name.includes(search) || desc.includes(search)) : true;
            const matchesMin = (minPrice != null && !isNaN(minPrice)) ? (price >= minPrice) : true;
            const matchesMax = (maxPrice != null && !isNaN(maxPrice)) ? (price <= maxPrice) : true;
            const matchesCategory = category ? pCategory.includes(category) : true;
            const matchesBusiness = business ? pBusinessId.includes(business) : true;
            return matchesSearch && matchesMin && matchesMax && matchesCategory && matchesBusiness;
        });

        switch (sort) {
            case 'price-asc':
                list = [...list].sort((a,b) => (a.price ?? 0) - (b.price ?? 0));
                break;
            case 'price-desc':
                list = [...list].sort((a,b) => (b.price ?? 0) - (a.price ?? 0));
                break;
            case 'name-asc':
                list = [...list].sort((a,b) => String(a.productName||'').localeCompare(String(b.productName||'')));
                break;
            case 'name-desc':
                list = [...list].sort((a,b) => String(b.productName||'').localeCompare(String(a.productName||'')));
                break;
            default:
                // relevance or unknown -> keep original order
                break;
        }
        return list;
    }, [products, filters]);

    return (
        <div className="flex-1 w-full dark:bg-gray-900 bg-gray-50 px-2 sm:px-8 py-8">
            <div className="w-full max-w-none">
                {filteredProducts.length === 0 ? (
                    <div className="w-full py-20 text-center text-gray-600 dark:text-gray-300">
                        No products match your filters.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-6 w-full">
                        {filteredProducts.map((product, idx) => (
                            <div key={product._id ?? product.id ?? idx} 
                                className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:transform hover:scale-105 transition-transform duration-300 overflow-hidden flex flex-col w-full"
                                onClick={() => {navigate('/productView', {
                                    state: {
                                        product,
                                        userData
                                    }
                                });
                            }} // Redirecting the user to the product view
                            >
                                <div className="space-y-4">
                                    <div className="relative group">
                                        <img
                                            src={product.imageUrl}
                                            alt={product.productName}
                                            className="w-full h-48 object-cover rounded-2xl shadow-2xl border-2 border-gray-200 dark:border-gray-700"
                                        />
                                        <div className="absolute top-2 right-2 bg-indigo-600 text-white px-4 py-2 rounded-full text-xs font-semibold shadow-lg">
                                            More Info
                                        </div>
                                    </div>
                                </div>
                                <div className="p-4 sm:p-6 flex flex-col flex-grow">
                                    <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                        {product.productName}
                                    </h2>
                                    <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 flex-grow">
                                        {product.description}
                                    </p>
                                </div>
                                <div className="flex justify-center mb-4">
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
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default MarketplaceGrid;
