import makeAuthenticatedRequest from "./api.js";

/**
 * Handles user logout - removes token and optionally notifies server
 */
export const handleLogout = async (backendUrl, navigate, clearUserData) => {
    try {
        // Optional: Notify server about logout
        await makeAuthenticatedRequest(`${backendUrl}/api/user-auth/userLogout`, {
            method: 'POST'
        });
        console.log('Server logout successful');
    } catch (error) {
        console.error('Error during server logout:', error);
        // Continue with client-side logout even if server call fails
    } finally {
        // Remove JWT from storage
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');

        // Clear user data from component state
        if (clearUserData) {
            clearUserData(null);
        }

        console.log('Client-side logout completed');

        // Redirect to login page
        navigate('/accountLogin');
    }
};