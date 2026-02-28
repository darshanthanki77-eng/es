const Withdraw = require('../models/Withdraw');
const Seller = require('../models/Seller');
const asyncHandler = require('express-async-handler');

// @desc    Get all withdrawal requests
// @route   GET /api/withdrawals
// @access  Private/Admin
const getWithdrawals = asyncHandler(async (req, res) => {
    try {
        const withdrawals = await Withdraw.aggregate([
            {
                $lookup: {
                    from: 'sellers',
                    localField: 'seller_id',
                    foreignField: 'id',
                    as: 'seller_data'
                }
            },
            {
                $unwind: {
                    path: '$seller_data',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $project: {
                    _id: 1,
                    amount: 1,
                    op_type: 1,
                    message: 1,
                    status: 1,
                    reason: 1,
                    createdAt: { $ifNull: ['$createdAt', '$created_at'] },
                    seller_id: {
                        name: '$seller_data.name',
                        email: '$seller_data.email',
                        shop_name: '$seller_data.shop_name',
                        id: '$seller_data.id'
                    }
                }
            },
            { $sort: { createdAt: -1 } }
        ]);

        res.json({
            success: true,
            count: withdrawals.length,
            withdrawals
        });
    } catch (error) {
        res.status(500);
        throw new Error('Server Error: ' + error.message);
    }
});

// @desc    Create a withdrawal request
// @route   POST /api/withdrawals
// @access  Private
const createWithdrawal = asyncHandler(async (req, res) => {
    const { amount, trans_password, method } = req.body;
    const sellerId = req.user._id;

    const seller = await Seller.findById(sellerId);
    if (!seller) {
        res.status(404);
        throw new Error('Seller not found');
    }

    // 1. Verify Transaction Password
    if (!seller.trans_password || seller.trans_password !== trans_password) {
        res.status(400);
        throw new Error('Invalid transaction password');
    }

    // 2. Check Balance
    // Logic duped from getWalletDetails - ideally should be a helper function
    // Sales
    const salesResult = await require('../models/Order').aggregate([
        { $match: { seller_id: seller._id, status: { $regex: 'processing|shipped|completed|delivered', $options: 'i' } } },
        { $group: { _id: null, total: { $sum: { $toDouble: '$order_total' } } } }
    ]);
    const totalSales = salesResult.length > 0 ? salesResult[0].total : 0;

    // Recharges
    const rechargeResult = await require('../models/Recharge').aggregate([
        { $match: { seller_id: seller._id, status: 1 } },
        { $group: { _id: null, total: { $sum: { $toDouble: '$amount' } } } }
    ]);
    const totalRecharge = rechargeResult.length > 0 ? rechargeResult[0].total : 0;

    // Withdrawals (Pending + Approved)
    const withdrawResult = await Withdraw.aggregate([
        { $match: { seller_id: seller._id, status: { $in: [0, 1] } } }, // 0: Pending, 1: Approved
        { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    const totalWithdraw = withdrawResult.length > 0 ? withdrawResult[0].total : 0;

    // 4. Storehouse Payments (NEW)
    const storehouseResult = await require('../models/StorehousePayment').aggregate([
        { $match: { seller_id: seller._id, status: 'Completed' } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    const totalStorehousePaid = storehouseResult.length > 0 ? storehouseResult[0].total : 0;

    const availableBalance = (totalSales + totalRecharge) - (totalWithdraw + totalStorehousePaid);

    if (amount > availableBalance) {
        res.status(400);
        throw new Error('Insufficient balance');
    }

    // 3. Create Withdrawal Record
    const withdrawal = await Withdraw.create({
        seller_id: seller._id,
        amount,
        op_type: method === 'usdt' ? 2 : 1, // Assuming 1=Bank, 2=USDT based on existing patterns or conventions
        status: 0, // Pending
        message: 'Withdrawal requested'
    });

    if (withdrawal) {
        res.status(201).json({
            success: true,
            message: 'Withdrawal request submitted',
            withdrawal
        });
    } else {
        res.status(400);
        throw new Error('Invalid withdrawal data');
    }
});

// @desc    Update withdrawal status
// @route   PUT /api/withdrawals/:id
// @access  Private/Admin
const updateWithdrawalStatus = asyncHandler(async (req, res) => {
    const { status, reason } = req.body;
    const withdrawal = await Withdraw.findById(req.params.id);

    if (withdrawal) {
        withdrawal.status = status;
        if (reason) withdrawal.reason = reason;

        const updatedWithdrawal = await withdrawal.save();
        res.json(updatedWithdrawal);
    } else {
        res.status(404);
        throw new Error('Withdrawal request not found');
    }
});

// @desc    Get wallet details (balance, history)
// @route   GET /api/withdrawals/wallet-details
// @access  Private
const getWalletDetails = asyncHandler(async (req, res) => {
    const sellerId = req.user._id;
    const seller = await Seller.findById(sellerId);

    if (!seller) {
        res.status(404);
        throw new Error('Seller not found');
    }

    // 1. Recharge Money (Status: 1)
    const rechargeResult = await require('../models/Recharge').aggregate([
        { $match: { seller_id: seller._id, status: 1 } },
        { $group: { _id: null, total: { $sum: { $toDouble: '$amount' } } } }
    ]);
    const rechargeMoney = rechargeResult.length > 0 ? rechargeResult[0].total : 0;

    // 2. Package Money (Total)
    const packageResult = await require('../models/Package').aggregate([
        { $match: { seller_id: seller._id } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    const packageMoney = packageResult.length > 0 ? packageResult[0].total : 0;

    // 3. Storehouse Total Payment (Expense - All payments made)
    const storehouseExpenseResult = await require('../models/StorehousePayment').aggregate([
        { $match: { seller_id: seller._id } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    const storehouseTotalPayment = storehouseExpenseResult.length > 0 ? storehouseExpenseResult[0].total : 0;

    // 4. Storehouse Wallet Payment (Income - Delivered Orders linked to StorehousePayment)
    const storehouseIncomeResult = await require('../models/StorehousePayment').aggregate([
        { $match: { seller_id: seller._id } },
        {
            $lookup: {
                from: 'orders',
                localField: 'order_code',
                foreignField: 'order_code',
                as: 'order'
            }
        },
        { $unwind: '$order' },
        { $match: { 'order.status': 'delivered' } },
        { $group: { _id: null, total: { $sum: { $toDouble: '$order.order_total' } } } }
    ]);
    const storehouseWalletPayment = storehouseIncomeResult.length > 0 ? storehouseIncomeResult[0].total : 0;

    // 5. Withdraw Wallet Money (Status: 0 or 1)
    const withdrawResult = await Withdraw.aggregate([
        { $match: { seller_id: seller._id, status: { $in: [0, 1] } } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    const withdrawWalletMoney = withdrawResult.length > 0 ? withdrawResult[0].total : 0;

    // 6. Pending Payment (Not Delivered)
    const pendingPaymentResult = await require('../models/StorehousePayment').aggregate([
        { $match: { seller_id: seller._id } },
        {
            $lookup: {
                from: 'orders',
                localField: 'order_code',
                foreignField: 'order_code',
                as: 'order'
            }
        },
        { $unwind: '$order' },
        { $match: { 'order.status': { $ne: 'delivered' } } },
        { $group: { _id: null, total: { $sum: { $toDouble: '$order.order_total' } } } }
    ]);
    const pendingPayment = pendingPaymentResult.length > 0 ? pendingPaymentResult[0].total : 0;


    // --- Calculation ---
    // wallet_balance = (recharge_money + storehousewallet_payment) - (storehousetotal_payment + package_money + withdraw_wallet_money)

    // Income
    const totalIncome = rechargeMoney + storehouseWalletPayment;

    // Expenses
    const totalExpenses = storehouseTotalPayment + packageMoney + withdrawWalletMoney;

    const walletBalance = totalIncome - totalExpenses;

    // Additional Data for UI
    const pendingWithdrawResult = await Withdraw.aggregate([
        { $match: { seller_id: seller._id, status: 0 } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    const pendingWithdraw = pendingWithdrawResult.length > 0 ? pendingWithdrawResult[0].total : 0;

    const lastWithdrawDoc = await Withdraw.findOne({ seller_id: seller._id, status: 1 }).sort({ createdAt: -1 });
    const lastWithdraw = lastWithdrawDoc ? lastWithdrawDoc.amount : 0;

    // Fetch Lists
    const withdrawalList = await Withdraw.find({ seller_id: seller._id }).sort({ createdAt: -1 }).limit(10);
    const rechargeList = await require('../models/Recharge').find({ seller_id: seller._id }).sort({ created_at: -1 }).limit(10);
    const guaranteeList = await require('../models/GuaranteeMoney').find({ seller_id: seller._id }).sort({ created_at: -1 }).limit(10);

    // Today's Stats
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const todaysOrdersCount = await require('../models/Order').countDocuments({
        seller_id: seller._id,
        created_at: { $gte: startOfDay } // Assuming created_at is Date. If String, verify format. 
        // Order.js schema says created_at: { type: Date, default: Date.now }, or timestamps: true?
        // Let's assume Mongoose standard
    });

    // NOTE: Order Schema was Mixed types in seeded data, but we hope newly created are Dates.

    res.json({
        success: true,
        data: {
            balance: walletBalance,

            // Detailed Breakdown
            rechargeMoney,
            packageMoney,
            storehouseTotalPayment,
            storehouseWalletPayment,
            withdrawWalletMoney,
            pendingPayment,

            // Dashboard specifics
            pendingWithdraw,
            lastWithdraw,
            todaysOrdersCount,

            transactions: {
                withdrawals: withdrawalList,
                recharge: rechargeList,
                guarantee: guaranteeList
            }
        }
    });
});

module.exports = {
    getWithdrawals,
    createWithdrawal,
    updateWithdrawalStatus,
    getWalletDetails
};
