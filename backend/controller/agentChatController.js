export const agentChat = async (req, res) => {
    const { message, history } = req.body; // ⬅️ include history from frontend
    const authHeader = req.headers.authorization;

    // Extract token (remove "Bearer ")
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'No authentication token provided'
        });
    }

    const AGENT_SERVER_URL = process.env.AGENT_SERVER_URL;

    try {
        const response = await fetch(`${AGENT_SERVER_URL}/api/agent`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token, // Send raw token
            },
            body: JSON.stringify({
                message,
                history,      // ⬅️ forward conversation history
                userData: req.user, // user info for personalization
            }),
        });

        if (!response.ok) {
            throw new Error(`Agent service responded with status ${response.status}`);
        }

        const data = await response.json();

        res.status(200).json({
            success: true,
            message: 'Message sent successfully',
            payload: data,
        });

    } catch (error) {
        console.error('Error calling agent service:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while calling agent service',
            error: error.message,
        });
    }
};