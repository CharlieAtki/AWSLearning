import ProductView from "../components/productView";
import { useEffect, useState } from "react";
import { ShoppingCart } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import NavigationBar from "../components/navigationBar";
import makeAuthenticatedRequest from "../utils/api.js";

const ProductViewPage = () => {
    const navigate = useNavigate();
    const { state } = useLocation();
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    // UseSates for managing the scroll user-feedback
    const [scrollProgress, setScrollProgress] = useState(0);
    const [scrollVisible, setScrollVisible] = useState(false);
    const [userData, setUserData] = useState(state?.userData);
    const [loading, setLoading] = useState(false);

    const fetchUserData = async (showLoader = true) => {
        try {
            if (showLoader) {
                setLoading(true);
            }
            const accessToken = localStorage.getItem("accessToken");

            if (!accessToken) {
                setUserData(null);
                if (showLoader) {
                    setLoading(false);
                }
                return;
            }

            const response = await makeAuthenticatedRequest(
                `${backendUrl}/api/user-auth/fetchCurrentUserInformation`
            );

            if (response.ok) {
                const data = await response.json();
                setUserData(data);
                console.log("User data fetched:", data);
            } else {
                console.error("Failed to fetch user data");
                setUserData(null);
                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");
                localStorage.removeItem("user");
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
            setUserData(null);
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            localStorage.removeItem("user");
        } finally {
            if (showLoader) {
                setLoading(false);
            }
        }
    };
    
    // Handle scroll progress and button visibility
    useEffect(() => {
        const handleScroll = () => {
            // Calculate scroll progress
            const winScroll = document.documentElement.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (winScroll / height) * 100;
            setScrollProgress(scrolled);
            setScrollVisible(winScroll > 500);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Callback function to refresh user data after checkout update
    const handleCheckoutUpdate = async () => {
        await fetchUserData(false); // false = don't show loading spinner
    };

    const handleCheckout = (userData) => {
        if (!userData || !userData.user) {
            alert("Please sign in to view your cart");
            return;
        }
        navigate("/checkout", { state: userData });
    };

    // Safely calculate the total quantity of items in the user's checkout basket.
    // If any item is missing a quantity, treat it as 0. If the basket is undefined, default to 0.
    const cartItemCount = userData?.user?.checkoutBasket?.reduce((sum, item) => {
        return sum + (item?.quantity || 0);
    }, 0) || 0;

    return (
        <div>
            {/* Progress Bar */}
            <div className="fixed top-0 left-0 w-full h-1 z-50">
                <div
                    className="h-full bg-indigo-600 transition-all duration-150 ease-out"
                    style={{ width: `${scrollProgress}%` }}
                />
            </div>
            
            <NavigationBar />
            <ProductView
                userData={userData}
                onCheckoutUpdate={handleCheckoutUpdate}
            />

            {/* Floating Cart Button with Badge */}
            <button
                onClick={() => handleCheckout(userData)}
                className={`fixed bottom-6 right-6 p-4 rounded-full shadow-lg transition-all duration-300 ${
                    userData && userData.user 
                        ? 'bg-gray-600 hover:bg-green-500 hover:scale-110' 
                        : 'bg-gray-400 cursor-not-allowed'
                }`}
                disabled={!userData || !userData.user}
            >
                <ShoppingCart className="w-6 h-6 text-white" />
                {cartItemCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center">
                        {cartItemCount}
                    </span>
                )}
            </button>
        </div>
    );
}

export default ProductViewPage;
