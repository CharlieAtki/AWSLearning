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
