import MarketplaceGrid from "../components/marketPlaceGrid";
import NavigationBar from "../components/navigationBar";
import { ShoppingCart } from "lucide-react";
import {useNavigate} from "react-router-dom";

const MarketplacePage = () => {
    const navigate = useNavigate();

    const handleCheckout = () => {
        // You’ll handle routing/navigation here later
        navigate('/checkout');
    };

    return (
        <div className="flex flex-col min-h-screen">
            <NavigationBar />
            <MarketplaceGrid />

            {/* Floating Cart Button - Always Visible */}
            <button
                onClick={handleCheckout}
                className="fixed bottom-6 right-6 bg-gray-600 text-white p-4 rounded-full shadow-lg hover:bg-green-500 hover:scale-115 transition-all duration-350"
            >
                <ShoppingCart className="w-6 h-6" />
            </button>
        </div>
    );
};

export default MarketplacePage;
