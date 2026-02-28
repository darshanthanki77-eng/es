const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const {
    getDashboardStats,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
    getAllPackages,
    getAllRecharges,
    updateRechargeStatus,
    getAllWithdrawals,
    updateWithdrawalStatus,
    getAllOrders,
    createOrder,
    updateOrderStatus,
    deleteOrder,
    getSellerStoreProducts,
    getAllProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    permanentDeleteProduct
} = require('../controllers/adminController');

// All routes are protected by admin middleware
router.use(protect, admin);

// Dashboard
router.get('/stats', getDashboardStats);

// User Management
router.get('/users', getAllUsers);
router.get('/users/:id', getUserById);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

// Package Management
router.get('/packages', getAllPackages);

// Recharge Management
router.get('/recharges', getAllRecharges);
router.put('/recharges/:id', updateRechargeStatus);

// Withdrawal Management
router.get('/withdrawals', getAllWithdrawals);
router.put('/withdrawals/:id', updateWithdrawalStatus);

// Order Management
router.get('/orders', getAllOrders);
router.post('/orders', createOrder);
router.put('/orders/:id', updateOrderStatus);
router.delete('/orders/:id', deleteOrder);

// Product Management (Storehouse)
router.get('/seller-store-products/:sellerId', getSellerStoreProducts);
router.get('/products', getAllProducts);
router.post('/products', upload.fields([{ name: 'image', maxCount: 1 }]), createProduct);
router.put('/products/:id', upload.fields([{ name: 'image', maxCount: 1 }]), updateProduct);
router.delete('/products/:id', deleteProduct);
router.delete('/products/:id/permanent', permanentDeleteProduct);

module.exports = router;
