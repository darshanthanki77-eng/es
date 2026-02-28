const express = require('express');
const router = express.Router();
const { getRecharges, updateRechargeStatus, createRecharge, completeRecharge } = require('../controllers/rechargeController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
    .get(protect, admin, getRecharges)
    .post(protect, createRecharge);

router.route('/:id/status').put(protect, admin, updateRechargeStatus);
router.route('/:id/complete').put(protect, completeRecharge);

module.exports = router;
