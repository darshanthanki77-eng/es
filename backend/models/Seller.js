const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const sellerSchema = mongoose.Schema({
    id: {
        type: Number,
        unique: true
    },
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    trans_password: {
        type: String,
        required: false, // Make optional if not essential for all
    },
    shop_name: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['admin', 'seller'],
        default: 'seller',
    },
    cert_type: {
        type: String,
        enum: ['id_card', 'passport', 'driving_license', ''],
        default: '',
    },
    cert_front: {
        type: String,
        default: '',
    },
    cert_back: {
        type: String,
        default: '',
    },
    verified: {
        type: Number, // 0 = pending, 1 = verified
        default: 0,
    },
    ratings: {
        type: Number,
        default: 0,
    },
    views: {
        type: Number,
        default: 0,
    },
    freeze: {
        type: Number, // 0 = not frozen, 1 = frozen
        default: 0,
    },
    invitation_code: {
        type: String,
        required: false,
    },
    otp: {
        type: String,
        required: false
    },
    otpExpires: {
        type: Date,
        required: false
    },
    wallet_balance: {
        type: Number,
        default: 0,
    },
    guarantee_balance: {
        type: Number,
        default: 0,
    }
}, {
    timestamps: true,
});

// Match user entered password to hashed password in database
sellerSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Encrypt password using bcrypt
sellerSchema.pre('save', async function () {
    if (!this.isModified('password')) {
        return;
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

const Seller = mongoose.model('Seller', sellerSchema);

module.exports = Seller;
