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
        },
        businessName: {
            type: String,
        },
        userRole: {
            type: String,
            enum: ['owner', 'employee'],
        }
    },
    orders: [
        {
            orderId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Order',}
        },
    ],
    checkoutBasket: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product'
            },
            quantity: {
                type: Number,
                default: 1
            }
        }
    ]
}, 
    {
        timestamps: true,
        collection: 'users',
    }
);

const User = mongoose.model('User', userSchema);

export default User;
