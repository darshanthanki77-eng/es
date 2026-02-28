const mongoose = require('mongoose');

const supplierSchema = mongoose.Schema({
    supplier_name: {
        type: String,
        required: true,
    },
    rating: {
        type: Number,
        default: 0,
    },
    delivery_timeline: {
        type: String,
        required: false,
    },
}, {
    timestamps: true,
});

const Supplier = mongoose.model('Supplier', supplierSchema);

module.exports = Supplier;
