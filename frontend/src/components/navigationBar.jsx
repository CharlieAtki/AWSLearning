const NavigationBar = () => {

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
                        onClick={() => window.location.href = element.link}
                        className="text-sm text-gray-400 hover:text-white"
                    >
                        {element.name}
                    </button>
                ))}
            </div>

            {/* Profile Picture */}
            <div className="pl-16 ml-auto">
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
