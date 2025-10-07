import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    hashedPassword: {
        type: String,
        required: true,
    },
    business: {
        businessId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Business',
            required: true,
        },
        businessName: {
            type: String,
            required: true,
        },
        userRole: {
            type: String,
            enum: ['owner', 'employee'],
            required: true,
        }
    },
    orders: [
        {
            orderId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Order',}
        },
    ],
}, 
    {
        timestamps: true,
        collection: 'users',
    }
);

const User = mongoose.model('User', userSchema);

export default User;
