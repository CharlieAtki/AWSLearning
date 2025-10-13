import mongoose from "mongoose";
import {generateTokens} from "./authCheck.js";
import User from "../models/User.js";
import bcrypt from 'bcryptjs';


// Number of times the hashing algorithm is applied
const saltRounds = 10;

// In your login handler
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Find a user by email
        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password',
                field: 'email'
            });
        }

        // 2. Verify password
        const isPasswordValid = await bcrypt.compare(password, user.hashedPassword);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password',
                field: 'password'
            });
        }

        // 3. Generate JWT tokens (THIS IS WHERE JWT IS CREATED)
        const tokens = generateTokens(user);

        // 4. Return tokens and user data
        res.json({
            success: true,
            message: 'Login successful',
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
            user: {
                id: user._id,
                email: user.email,
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during login'
        });
    }
};

export const userCreation = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required',
                field: 'general'
            });
        }
    
        // Checking if the user already exists
        const existingEmailCheck = await User.findOne({email: email});
        if (existingEmailCheck) {
            return res.status(400).send({
                success: false,
                message: "Email already exists",
                field: "email"
            });
        }

        const passwordString = String(password);
        const hashedPassword = await bcrypt.hash(passwordString, saltRounds);

        // Creating the user account (the object in the MongoDb database)
        const user = new User({
            email: email,
            hashedPassword: hashedPassword
        });
        
        // Save use to the database
        const savedUser = await user.save();
        
        // Generate JWS token immediately after creation
        const tokens = generateTokens(savedUser);

        // 7. Return success response with tokens (auto-login)
        res.status(201).json({
            success: true,
            message: 'Account created successfully',
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
            user: {
                id: savedUser._id,
                email: savedUser.email,
            }
        });


    } catch (error) {
        return res.status(400).send({
            success: false,
            message: error.message
        });
    }
};

export const fetchCurrentUserInformation = async (req, res) => {
    try {
        // The JWT middleware already decoded the token and put user info in req.user
        const userId = req.user.id; // or req.user._id depending on what you stored in the JWT

        const currentUser = await User.findById(userId).select('-hashedPassword'); // Exclude password from the response

        if (!currentUser) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            user: {
                id: currentUser._id,
                email: currentUser.email,
                business: currentUser.business,
                orders: currentUser.orders,
                userRole: currentUser.business.userRole,
                businessId: currentUser.business.businessId,
                checkoutBasket: currentUser.checkoutBasket,
                createdAt: currentUser.createdAt
            }
        });

    } catch (error) {
        console.error('Fetch user error:', error)
        res.status(500).json({
            success: false,
            message: 'Server error fetching user information'
        });
    }
};

// Update your userLogout function to use the JWT user info
export const userLogout = async (req, res) => {
    try {
        // Get user info from JWT (provided by middleware)
        const userId = req.user?.id;

        // Optional: Log the logout event with user info
        console.log(`User ${userId} logged out at ${new Date().toISOString()}`);

        // If you're using token blacklisting (advanced):
        // const token = req.headers.authorization?.split(' ')[1];
        // await blacklistToken(token);

        res.status(200).json({
            success: true,
            message: 'Logged out successfully'
        });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({
            success: false,
            message: 'Logout failed',
            error: error.message
        });
    }
};

export const addItemToCheckout = async (req, res) => {
    try {
        const { productId, productName, userEmail } = req.body;

        // Write the API to update the user checkout 
        const user = await User.findOne(userEmail) // Returing the user (found via Id)

        // Checking the user exists in the database
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Cannot find use by Id in the database"
            });
        }

        if (!Array.isArray(user.checkoutBasket)) {
            user.checkoutBasket = [];
        }

        // Added the item to the checkout
        user.checkoutBasket.push({ productId, productName })

        // Saving the updated user
        await user.save();

        // Returning the sucess message
        res.status(201).json({
            success: true,
            message: "Updated the checkout basket with the new item"
        });

    } catch (error) {
        console.error('Failed to add item to checkout');
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};
