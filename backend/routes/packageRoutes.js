const express = require('express');
const router = express.Router();
const { getPackages, purchasePackage } = require('../controllers/packageController');

const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getPackages);
router.route('/purchase').post(protect, purchasePackage);

module.exports = router;
