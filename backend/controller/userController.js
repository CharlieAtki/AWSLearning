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