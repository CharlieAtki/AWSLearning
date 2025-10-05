const makeAuthenticatedRequest = async (url, options = {}) => {
    let token = localStorage.getItem('accessToken');

    const makeRequest = async (authToken) => {
        return await fetch(url, {
            ...options,
            headers: {
                ...options.headers,
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json'
            }
        });
    };

    // First attempt with current token
    let response = await makeRequest(token);

    // If the token expired, try to refresh it
    if (response.status === 401 || response.status === 403) {
        const refreshToken = localStorage.getItem('refreshToken');

        if (refreshToken) {
            try {
                // Call refresh endpoint
                const refreshResponse = await fetch('/api/user-unAuth/refresh', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ refreshToken })
                });

                if (refreshResponse.ok) {
                    const data = await refreshResponse.json();

                    // Store new tokens
                    localStorage.setItem('accessToken', data.accessToken);
                    localStorage.setItem('refreshToken', data.refreshToken);

                    // Retry the original request with new token
                    response = await makeRequest(data.accessToken);
                } else {
                    // Refresh failed, redirect to login
                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('refreshToken');
                    window.location.href = '/login';
                }
            } catch (error) {
                console.error('Token refresh failed:', error);
                window.location.href = '/login';
            }
        } else {
            // No refresh token, redirect to login
            window.location.href = '/login';
        }
    }

    return response;
};