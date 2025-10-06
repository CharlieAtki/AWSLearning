import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const CheckoutOrdersGrid = () => {
    const navigate = useNavigate();

    const goBack = () => {
        navigate(-1); // Goes back one page in history
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
            {/* Back Button */}
            <div className="w-full max-w-3xl mb-4">
                <button
                    onClick={goBack}
                    className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                    <span>Back</span>
                </button>
            </div>

            {/* Checkout Box */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-10 w-full max-w-3xl">
                <h1 className="text-3xl font-semibold mb-6 text-gray-800 dark:text-gray-100">
                    Checkout
                </h1>
                <p className="text-gray-600 dark:text-gray-300">
                    Your order summary and payment details will appear here.
                </p>
            </div>
        </div>
    );
};

export default CheckoutOrdersGrid;
