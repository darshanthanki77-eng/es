const Recharge = require('../models/Recharge');
const Seller = require('../models/Seller');
const asyncHandler = require('express-async-handler');

// @desc    Get all recharge requests
// @route   GET /api/recharges
// @access  Private/Admin
const getRecharges = asyncHandler(async (req, res) => {
    try {
        console.log('--- Fetching Recharge Data ---');
        const recharges = await Recharge.find({})
            .populate('seller', 'name shop_name')
            .sort({ created_at: -1 });

        console.log(`--- Found ${recharges.length} recharges ---`);
        if (recharges.length > 0) {
            console.log('Sample Recharge Item:', JSON.stringify(recharges[0], null, 2));
        }

        res.json({
            success: true,
            count: recharges.length,
            recharges
        });
    } catch (error) {
        console.error('ERROR in getRecharges:', error);
        res.status(500);
        throw new Error('Server Error: ' + error.message);
    }
});

// @desc    Update recharge status (Approve/Reject)
// @route   PUT /api/recharges/:id/status
// @access  Private/Admin
const updateRechargeStatus = asyncHandler(async (req, res) => {
    const { status, reason } = req.body;
    const recharge = await Recharge.findById(req.params.id);

    if (recharge) {
        recharge.status = status; // 1 = approved, 2 = rejected
        if (reason) recharge.reason = reason;

        const updatedRecharge = await recharge.save();
        res.json({
            success: true,
            recharge: updatedRecharge
        });
    } else {
        res.status(404);
        throw new Error('Recharge request not found');
    }
});

// @desc    Create a recharge request
// @route   POST /api/recharges
// @access  Private
const createRecharge = asyncHandler(async (req, res) => {
    const { amount, mode } = req.body;

    if (!amount) {
        res.status(400);
        throw new Error('Please provide an amount');
    }

    const lastRec = await Recharge.findOne().sort({ id: -1 });
    const newId = lastRec && lastRec.id ? lastRec.id + 1 : 1;

    const recharge = await Recharge.create({
        id: newId,
        seller_id: req.user._id,
        amount: String(amount),
        mode: mode || 'online',
        status: 0, // Pending
        created_at: new Date().toISOString()
    });

    res.status(201).json({
        success: true,
        recharge
    });
});

// @desc    Complete recharge (Simulate payment success)
// @route   PUT /api/recharges/:id/complete
// @access  Private
const completeRecharge = asyncHandler(async (req, res) => {
    const recharge = await Recharge.findById(req.params.id);

    if (!recharge) {
        res.status(404);
        throw new Error('Recharge request not found');
    }

    if (recharge.status === 1) {
        res.status(400);
        throw new Error('Recharge already completed');
    }

    recharge.status = 1; // Success
    await recharge.save();

    // Update seller wallet
    const seller = await Seller.findById(recharge.seller_id);
    if (seller) {
        seller.wallet_balance = (seller.wallet_balance || 0) + Number(recharge.amount);
        await seller.save();
    }

    res.json({
        success: true,
        message: 'Payment completed and wallet updated',
        wallet_balance: seller ? seller.wallet_balance : 0
    });
});

module.exports = {
    getRecharges,
    updateRechargeStatus,
    createRecharge,
    completeRecharge
};
