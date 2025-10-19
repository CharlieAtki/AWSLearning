import express from "express";
import mongoose from "mongoose";
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import unAuthRoutes from "./routes/unAuthRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import businessRoutes from "./routes/businessRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import {authCheck} from "./controller/authCheck.js";

// Load environment variables
dotenv.config();

// Initialize Express
const app = express();

// Step 1: Set up MongoDB connection
const mongoUri = process.env.MONGODB_URI;

mongoose.connect(mongoUri)
.then(() => {
    console.log('MongoDB connected successfully');
    console.log(`Connected to database: ${mongoose.connection.db.databaseName}`);
})
.catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1); // Exit process with failure
});

// Trust proxy setting before other middleware
app.set('trust proxy', 1);

app.use(cors({
    origin: [
            'http://localhost:5173', // Local development
            'https://cafe-application-kohl.vercel.app', // production development
    ],
    credentials: true, // Allow cookies to be sent (for refresh token if using cookies)
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
    exposedHeaders: ['Set-Cookie', 'Content-Type'],
    maxAge: 600,
    optionsSuccessStatus: 200
}));

// JWT Middleware for protected routes
export const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Access token required'
        });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({
                success: false,
                message: 'Invalid or expired token'
            });
        }
        // Returning the user information
        req.user = user;
        next();
    });
};

// Step 2: Middleware to handle JSON data
app.use(express.json());

// Step 4: Start the Express server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
});

// Routes - Need to update inline with the actual route files
app.use('/api/user-unAuth', unAuthRoutes) // Routes for unauthenticated users
// noinspection JSCheckFunctionSignatures
app.use('/api/user-auth', authenticateToken, userRoutes) // Routes for authenticated users

app.use('/api/product-unAuth', productRoutes) // Routes for unauthenticated users

app.use('/api/business-unAuth', businessRoutes) // Routes for authenticated users

app.use('/api/order-auth', authenticateToken, orderRoutes) // Routes for authenticated users

app.use('/api/agentChat-auth', authenticateToken, orderRoutes) // Routes for authenticated users

app.get('/health', (req, res) => res.status(200).json({ status: 'ok' }));

// Change to add auth to many of these routes.
