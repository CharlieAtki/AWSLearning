import {useEffect, useState} from "react";
import { useNavigate } from 'react-router-dom';
import makeAuthenticatedRequest from '../utils/api.js';

const NavigationBar = () => {
    const navigate = useNavigate();
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

    // Navigation bar elements
    const navbarElements = [
        {
            name: "Login",
            link: "/accountLogin"
        },
        {
            name: "ElementTwo",
            link: "/elementTwo"
        },
        {
            name: "ElementThree",
            link: "/elementThree"
        }
    ];

    // Placeholder user profile data
    const userProfile = {
        name: "John Doe",
        imageUrl: "/robot.png"
    };

    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                setLoading(true);
                const response = await makeAuthenticatedRequest(`${backendUrl}/api/user-auth/fetchCurrentUserInformation`);
                
                if (response.ok) {
                    const data = await response.json();
                    setUserData(data);
                } else {
                    console.error('Failed to fetch user data');
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [backendUrl]);

    return (
        <div className="w-full h-16 bg-gray-900 text-white flex items-center justify-left px-4">
            {/* Header within the Navigation Bar */}
            <div>
                <h1 className="text-2xl font-bold">
                    Cafe App
                </h1>
                <p className="text-sm text-gray-400">
                    Your one-stop solution.
                </p>
            </div>

            {/* Navigation Links */}
            <div className="relative flex justify-center items-center space-x-12 ml-auto">
                {navbarElements.map((element, index) => (
                    <button
                        key={index}
                        onClick={() => navigate(element.link)}
                        className="text-sm text-gray-400 hover:text-white"
                    >
                        {element.name}
                    </button>
                ))}
            </div>

            {/* Profile Picture */}
            <div className="pl-16 ml-auto">
                <h2>
                    {loading ? 'Loading...' : (userData?.user?.id || 'Guest')}
                </h2>
                <img
                    src={userProfile.imageUrl ? userProfile.imageUrl : "/robot.png"}
                    alt="Profile"
                    className="w-10 h-10 rounded-full"
                />
            </div>

        </div>
    );
}

export default NavigationBar;