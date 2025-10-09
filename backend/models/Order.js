import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    orderedProducts: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
            },
            quantity: {
                type: Number,
                required: true,
            },
            productPrice: {
                type: Number,
                required: true,
            },
        },
    ],
    totalValue: {
        type: Number
    },
    status: {
        type: String,
        enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
        default: 'Pending'
    }
}, 
    {
        timestamps: true,
        collection: 'orders',
    }
);

const Order = mongoose.model('Order', orderSchema);

export default Order;
