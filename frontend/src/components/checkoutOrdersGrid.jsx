import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const CheckoutOrdersGrid = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const userData = location.state;

    const goBack = () => {
        navigate(-1);
    };

    // ✅ Access the nested user object
    if (!userData || !userData.user || !userData.user.checkoutBasket) {
        return (
            <div className="flex items-center justify-center min-h-screen  bg-gray-100 dark:bg-gray-900">
                <p className="text-gray-400">No items in your basket.</p>
            </div>
        );
    }

    const checkoutBasket = userData.user.checkoutBasket;

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
            <div className="w-full max-w-3xl mb-4">
                <button
                    onClick={goBack}
                    className="flex items-center gap-2 text-gray-400 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                    <span>Back</span>
                </button>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-10 w-full max-w-3xl">
                <h1 className="text-3xl font-semibold mb-6 text-gray-500 dark:text-gray-100">
                    Checkout
                </h1>
                <p className="text-gray-400 dark:text-gray-300 mb-6">
                    Your order summary and payment details will appear here.
                </p>

                <ul>
                    {checkoutBasket.map((item, index) => (
                        <li
                            key={index}
                            className="border-b border-gray-300 dark:border-gray-700 text-gray-400 py-4 flex justify-between"
                        >
                            <span>{item.productName}</span>
                            <span>Quantity: {item.quantity}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default CheckoutOrdersGrid;
