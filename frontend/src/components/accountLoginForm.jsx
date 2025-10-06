import {useState} from "react";
import { Link, useNavigate } from "react-router-dom";
import {ArrowLeft} from "lucide-react";

const LoginForm = () => {
    const [input, setInput] = useState({ email: "", password: "" });
    const [passwordInputError, setPasswordInputError] = useState(false);
    const [passwordInputLengthError, setPasswordInputLengthError] = useState(false);
    const [emailInputError, setEmailInputError] = useState(false);
    const [emailInputValidityError, setEmailInputValidityError] = useState(false);

    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const emailValidityCheck = (email) => email.includes("@");

    const handleSubmit = async () => {
        event.preventDefault();
        setEmailInputError(false);
        setPasswordInputError(false);
        setPasswordInputLengthError(false);
        setEmailInputValidityError(false);

        let hasError = false;

        if (!input.email) {
            setEmailInputError(true);
            hasError = true;
        } else if (!emailValidityCheck(input.email)) {
            setEmailInputValidityError(true);
            hasError = true;
        }

        if (!input.password) {
            setPasswordInputError(true);
            hasError = true;
        } else if (input.password.length < 8) {
            setPasswordInputLengthError(true);
            hasError = true;
        }

        if (hasError) return;

        try {
            const response = await fetch(`${backendUrl}/api/user-unAuth/userLogin`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify(input)
            });

            const data = await response.json();

            if (response.ok && data.success) {
                // Store JWT tokens in localStorage
                localStorage.setItem('accessToken', data.accessToken);
                localStorage.setItem('refreshToken', data.refreshToken);
                localStorage.setItem('user', JSON.stringify(data.user));

                window.location.href = "/";
            } else {
                if (data.field === "email") {
                    setEmailInputError(true);
                } else if (data.field === "password") {
                    setPasswordInputError(true);
                }
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setInput((prev) => ({ ...prev, [name]: value }));
    };

    const navigate = useNavigate();

    const goBack = () => {
        navigate(-1);
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
            {/* Back Button */}
            <div className="w-full max-w-md mb-4">
                <button
                    onClick={goBack}
                    className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                    <span>Back</span>
                </button>
            </div>

            {/* Login Form */}
            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-6">
                    Sign in to your account
                </h2>
                <form className="space-y-4">
                    <div className="flex flex-col">
                        <label htmlFor="email" className="text-sm text-gray-700 dark:text-gray-300 mb-1">
                            Email Address
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            required
                            value={input.email}
                            onChange={handleChange}
                        />
                        {emailInputError && <p className="text-red-500 text-sm mt-1">No email found</p>}
                        {emailInputValidityError && <p className="text-red-500 text-sm mt-1">Invalid email</p>}
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="password" className="text-sm text-gray-700 dark:text-gray-300 mb-1">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            required
                            value={input.password}
                            onChange={handleChange}
                        />
                        {passwordInputLengthError && <p className="text-red-500 text-sm mt-1">Password must be at least 8 characters</p>}
                        {passwordInputError && <p className="text-red-500 text-sm mt-1">Invalid password</p>}
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition"
                        onClick={handleSubmit}
                    >
                        Sign In
                    </button>

                    <Link
                      to="/accountCreation"
                      className="text-sm flex items-center justify-center text-gray-700 dark:text-gray-300 hover:underline"
                    >
                      Don't have an account?
                    </Link>
                </form>
            </div>
        </div>
    );
};

export default LoginForm;