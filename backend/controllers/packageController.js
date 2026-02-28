const Package = require('../models/Package');
const Seller = require('../models/Seller');
const asyncHandler = require('express-async-handler');

// @desc    Get all packages
// @route   GET /api/packages
// @access  Private
const getPackages = asyncHandler(async (req, res) => {
    try {
        const packages = await Package.find({ seller_id: req.user._id }).sort({ created_at: -1 });
        res.json({
            success: true,
            packages
        });
    } catch (error) {
        res.status(500);
        throw new Error('Server Error: ' + error.message);
    }
});

// @desc    Purchase a package
// @route   POST /api/packages/purchase
// @access  Private
const purchasePackage = asyncHandler(async (req, res) => {
    const { packageId, trans_password } = req.body;
    const sellerId = req.user._id;

    const seller = await Seller.findById(sellerId);
    if (!seller) {
        res.status(404);
        throw new Error('Seller not found');
    }

    // 1. Verify Transaction Password (Must match registration password)
    // Use seller.trans_password which is stored during signup
    if (!seller.trans_password || seller.trans_password !== trans_password) {
        res.status(400);
        throw new Error('Invalid transaction password. Please use the password you set during registration.');
    }

    // 2. Package Mapping (Prices based on frontend UI)
    const packageMapping = {
        'silver': { name: 'Starter Merchant', amount: 50, limit: 5 },
        'platinum': { name: 'Professional Seller', amount: 150, limit: 1000000 },
        'diamond': { name: 'Enterprise Pro', amount: 450, limit: 1000000 }
    };

    const pkg = packageMapping[packageId];
    if (!pkg) {
        res.status(404);
        throw new Error('Invalid package selected');
    }

    // 3. Confirm Wallet Balance
    const balance = seller.wallet_balance || 0;
    if (balance < pkg.amount) {
        res.status(400);
        throw new Error(`Insufficient funds. Plan cost is $${pkg.amount}, but your wallet has $${balance.toFixed(2)}.`);
    }

    // 4. Record Transaction & Deduct
    try {
        // Create Package Activation Record
        const lastRec = await Package.findOne().sort({ id: -1 });
        const newId = lastRec && lastRec.id ? lastRec.id + 1 : 1;

        await Package.create({
            id: newId,
            seller_id: seller._id,
            type: pkg.name,
            amount: pkg.amount,
            profit: '0',
            product_limit: pkg.limit
        });

        // Deduct from Wallet
        seller.wallet_balance = balance - pkg.amount;
        await seller.save();

        res.status(200).json({
            success: true,
            message: `${pkg.name} activated successfully and $${pkg.amount} deducted.`,
            wallet_balance: seller.wallet_balance
        });
    } catch (error) {
        console.error('Package Purchase Error:', error);
        res.status(500);
        throw new Error('Transaction failed: ' + error.message);
    }
});

module.exports = {
    getPackages,
    purchasePackage
};
