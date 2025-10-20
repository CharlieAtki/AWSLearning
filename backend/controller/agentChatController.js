export const agentChat = async (req, res) => {
    const { message } = req.body;
    const token = req.headers.authorization; // Bearer token

    const AGENT_SERVER_URL = process.env.AGENT_SERVER_URL;

    try {
        const response = await fetch(`${AGENT_SERVER_URL}/api/agent`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": token,
            },
            body: JSON.stringify({
                message,
                userData: req.user,
                token,
            }),
        });

        const data = await response.json();

        res.status(200).json({
            success: true,
            message: 'Message sent successfully',
            payload: data
        });

    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching products'
        });
    }
}