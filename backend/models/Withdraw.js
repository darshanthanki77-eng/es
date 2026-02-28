const mongoose = require('mongoose');

const withdrawSchema = mongoose.Schema({
    seller_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Seller',
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    op_type: {
        type: Number, // 0 or 1, specific operation type context needed
        required: true,
    },
    message: {
        type: String,
        required: false,
    },
    status: {
        type: Number, // 0 = pending, 1 = approved, 2 = rejected
        default: 0,
    },
    reason: {
        type: String,
        required: false,
    },
}, {
    timestamps: true,
});

const Withdraw = mongoose.model('Withdraw', withdrawSchema);

module.exports = Withdraw;
