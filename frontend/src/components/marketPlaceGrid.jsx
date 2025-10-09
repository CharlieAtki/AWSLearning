import { useEffect, useState} from "react";
import makeAuthenticatedRequest from "../utils/api";

const MarketplaceGrid = ({ userData  }) => {

    const [products, setProducts] = useState([]);
    
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

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
    }, []);

    const addItemToOrder = async (productId) => {
        try {

            const response = await makeAuthenticatedRequest(`${backendUrl}/api/user-auth/addItemToCheckout`,
                {
                    method: "POST",
                    body: JSON.stringify({
                        productId,
                        userEmail: userData.email
                    })
                }
            );

            // const response = await fetch(`${backendUrl}/api/user-auth/addItemToOrder`, {
            //     method: "POST",
            //     headers: {
            //         "Content-Type": "application/json",
            //         "Accept": "application/json"
            //     },
            //     body: JSON.stringify({
            //         productId, // pass the product ID to the backend
            //         userId: userData.id
            //     })
            // });

            const data = await response.json();

            if (data.success) {
                console.log("Order updated with product:", productId);
            } else {
                console.error("Failed to add product to order:", data.message);
            }

        } catch (error) {
            console.error('Error adding product to order:', error);
        }
    };



    return (
        <div className="flex-1 w-full dark:bg-gray-900 bg-gray-50 px-2 sm:px-8 py-8">
            <div className="w-full max-w-none">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-6 w-full">
                    {products.map((product, idx) => (
                        <div key={product._id ?? product.id ?? idx} className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:transform hover:scale-105 transition-transform duration-300 overflow-hidden flex flex-col w-full">
                            <img src={product.imageUrl} alt={product.productName} className="w-full h-48 object-cover" />
                            <div className="p-4 sm:p-6 flex flex-col flex-grow">
                                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                    {product.productName}
                                </h2>
                                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 flex-grow">
                                    {product.description}
                                </p>
                            </div>
                            <div className="flex justify-center mb-4">
                                <button className="bg-blue-600 text-white w-full mx-4 py-2 px-4 rounded-md hover:bg-blue-700 transition text-sm sm:text-base"
                                    onClick={() => addItemToOrder(product._id ?? product.id)}
                                >
                                    Add to Cart
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default MarketplaceGrid;
