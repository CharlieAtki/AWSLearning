import mongoose from "mongoose";

import { generateTokens } from '../controller/authCheck.js';
import User from "../models/User";

// In your login handler
export const loginUser = async (req, res) => {
    try {
        // Your existing login validation logic here...
        // After successful authentication:

        const user = await User.findOne({ email: req.body.email });

        if (user && /* password verification logic */) {
            const tokens = generateTokens(user);

            res.json({
                success: true,
                message: 'Login successful',
                accessToken: tokens.accessToken,
                refreshToken: tokens.refreshToken,
                user: {
                    id: user._id,
                    email: user.email,
                    // other user data
                }
            });
        } else {
            res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};