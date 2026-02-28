const mongoose = require('mongoose');

const packageSchema = new mongoose.Schema({
    id: { type: Number, required: true, unique: true },
    seller_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Seller', required: true },
    type: { type: String, required: true },
    amount: { type: Number },
    profit: { type: String, required: true },
    product_limit: { type: Number, required: true },
}, { timestamps: { createdAt: 'created_at', updatedAt: false } });

module.exports = mongoose.model('Package', packageSchema);
