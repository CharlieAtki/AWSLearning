import ProductView from "../components/productView";
import { useEffect, useState } from "react";

const ProductViewPage = () => {

    // UseSates for managing the scroll user-feedback
    const [scrollProgress, setScrollProgress] = useState(0);
    const [scrollVisible, setScrollVisible] = useState(false)

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

    return (
        <div>
            {/* Progress Bar */}
            <div className="fixed top-0 left-0 w-full h-1 z-50">
                <div
                    className="h-full bg-indigo-600 transition-all duration-150 ease-out"
                    style={{ width: `${scrollProgress}%` }}
                />
            </div>
            
            < ProductView />
        </div>
    );
}

export default ProductViewPage
