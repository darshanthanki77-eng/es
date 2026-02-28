const express = require('express');
const router = express.Router();
const { getWithdrawals, createWithdrawal, updateWithdrawalStatus, getWalletDetails } = require('../controllers/withdrawController');

router.route('/').get(getWithdrawals).post(createWithdrawal);
router.route('/wallet-details/info').get(getWalletDetails);
router.route('/:id').put(updateWithdrawalStatus);

module.exports = router;
