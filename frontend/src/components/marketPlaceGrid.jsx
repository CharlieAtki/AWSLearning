import { useEffect } from "react";
import { useState } from "react";

const MarketplaceGrid = () => {

    const [products, setProducts] = useState([]);
    
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    // const products = [
    //     {
    //         id: 1,
    //         name: "Latte",
    //         description: "Freshly brewed espresso with steamed milk.",
    //         imageUrl: "/latte.png"
    //     },
    //     {
    //         id: 2,
    //         name: "Croissant",
    //         description: "Buttery and flaky pastry.",
    //         imageUrl: "/croissant.png"
    //     },
    //     {
    //         id: 3,
    //         name: "Espresso",
    //         description: "Strong and bold coffee shot.",
    //         imageUrl: "/espresso.png"
    //     },
    //     {
    //         id: 4,
    //         name: "Macaron",
    //         description: "Delicate French pastry with a creamy filling.",
    //         imageUrl: "/macaron.png"
    //     },
    //     {
    //         id: 5,
    //         name: "Tart",
    //         description: "A sweet or savory dish with a pastry base.",
    //         imageUrl: "/tart.png"
    //     }
    // ]

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

    return (
        <div className="flex-1 w-full dark:bg-gray-900 bg-gray-50 px-2 sm:px-8 py-8">
            <div className="w-full max-w-none">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 w-full">
                    {products.map((products) => (
                        <div key={products.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:transform hover:scale-105 transition-transform duration-300 overflow-hidden flex flex-col w-full">
                            <img src={products.imageUrl} alt={products.productName} className="w-full h-48 object-cover" />
                            <div className="p-4 sm:p-6 flex flex-col flex-grow">
                                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                    {products.productName}
                                </h2>
                                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 flex-grow">
                                    {products.description}
                                </p>
                            </div>
                            <div className="flex justify-center mb-4">
                                <button className="bg-blue-600 text-white w-full mx-4 py-2 px-4 rounded-md hover:bg-blue-700 transition text-sm sm:text-base">
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
