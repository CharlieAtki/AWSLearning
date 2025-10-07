import MarketplaceGrid from "../components/marketPlaceGrid";
import NavigationBar from "../components/navigationBar";
import { ShoppingCart } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import makeAuthenticatedRequest from "../utils/api.js";

const MarketplacePage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [tokenCheck, setTokenCheck] = useState(Date.now());

    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                setLoading(true);
                const accessToken = localStorage.getItem("accessToken");

                if (!accessToken) {
                    setUserData(null);
                    setLoading(false);
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
                setLoading(false);
            }
        };

        fetchUserData();
    }, [backendUrl, location.pathname, tokenCheck]);

    useEffect(() => {
        const checkTokenChange = () => {
            setTokenCheck(Date.now());
        };

        const interval = setInterval(() => {
            const currentAccessToken = localStorage.getItem("accessToken");
            if (currentAccessToken && !userData) {
                checkTokenChange();
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [userData]);

    const handleCheckout = () => {
        navigate("/checkout");
    };

    // ✅ Full-screen loader while backend or token check is in progress
    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-800">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-gray-300 border-t-green-500 rounded-full animate-spin"></div>
                    <p className="text-gray-700 dark:text-gray-200 font-medium text-lg">
                        Connecting to server...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen">
            <NavigationBar />
            <MarketplaceGrid />

            {/* Floating Cart Button */}
            <button
                onClick={handleCheckout}
                className="fixed bottom-6 right-6 bg-gray-600 text-white p-4 rounded-full shadow-lg hover:bg-green-500 hover:scale-110 transition-all duration-300"
            >
                <ShoppingCart className="w-6 h-6" />
            </button>
        </div>
    );
};

export default MarketplacePage;
