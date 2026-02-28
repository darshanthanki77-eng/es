const Package = require('../models/Package');
const Seller = require('../models/Seller');
const asyncHandler = require('express-async-handler');

// @desc    Get seller's packages
// @route   GET /api/packages
// @access  Private
const getPackages = asyncHandler(async (req, res) => {
    const packages = await Package.find({ seller_id: req.user._id }).sort({ created_at: -1 });
    res.json({ success: true, packages });
});

// @desc    Purchase & instantly activate a package (one-time, no pending)
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

    // 1. Verify Transaction Password
    if (!seller.trans_password || !(await seller.matchTransPassword(trans_password))) {
        res.status(400);
        throw new Error('Invalid transaction password.');
    }

    // 2. Package Mapping
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

    // 3. Block if seller already has an ACTIVE package of ANY type
    const existingActive = await Package.findOne({ seller_id: sellerId, status: 1 });
    if (existingActive) {
        res.status(400);
        throw new Error(`You already have an active package (${existingActive.type}). A seller can only hold one active package at a time.`);
    }

    // 4. Check wallet balance
    const { getAvailableBalance } = require('../utils/wallet');
    const balance = await getAvailableBalance(sellerId);

    if (balance < pkg.amount) {
        res.status(400);
        throw new Error(`Insufficient funds. Package costs $${pkg.amount}, your balance is $${balance.toFixed(2)}.`);
    }

    // 5. Create package as INSTANTLY ACTIVE (status: 1) — no admin approval needed
    const lastRec = await Package.findOne().sort({ id: -1 });
    const newId = lastRec && lastRec.id ? lastRec.id + 1 : 1;

    const newPackage = await Package.create({
        id: newId,
        seller_id: sellerId,
        type: pkg.name,
        amount: pkg.amount,
        profit: '0',
        product_limit: pkg.limit,
        status: 1  // ✅ Directly ACTIVE — no pending, no admin approval
    });

    // 6. Balance is automatically reduced (wallet.js subtracts status:1 packages)
    const newBalance = balance - pkg.amount;

    res.status(200).json({
        success: true,
        message: `🎉 ${pkg.name} activated successfully! You can now list up to ${pkg.limit === 1000000 ? 'unlimited' : pkg.limit} products.`,
        package: newPackage,
        wallet_balance: newBalance
    });
});

module.exports = { getPackages, purchasePackage };
