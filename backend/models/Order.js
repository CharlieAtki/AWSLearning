import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
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
    orderDate: {
        type: Date,
        required: true,
    },
}, 
    {
        timestamps: true,
        collection: 'orders',
    }
);

const Order = mongoose.model('Order', orderSchema);

export default Order;
