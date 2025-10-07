import mongoose from "mongoose";
import Business from "../models/Business.js";
import User from "../models/User.js";

export const createBusiness = async (req, res) => {
    try {
        const { businessName, owner } = req.body;

        if (!businessName || !owner) {
            return res.status(400).json({
                success: false,
                message: 'Business name and owner are required',
            });
        }

        // Check if a business with the same name already exists
        const existingBusinessCheck = await Business.findOne({ businessName: businessName });
        if (existingBusinessCheck) {
            return res.status(409).json({
                success: false,
                message: 'Business name already taken',
            });
        }

        // Create new business
        const business = new Business({
            businessName: businessName,
            owner: owner,
            employees: [owner], // Add owner to members array
        });

        await business.save();


        // Update the user's business info
        const user = await User.findById(owner);
        user.business = {
            businessId: business._id,
            businessName: business.businessName,
            userRole: 'owner'
        };
        await user.save();

        res.status(201).json({
            success: true,
            message: 'Business created successfully',
            business: business
        });

    } catch (error) {
        console.error('Business creation error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
};
