const express = require('express');
const router = express.Router();
const {
    getInvitationCode, updateInvitationCode,
    getCryptoSettings, updateCryptoSettings,
    getBankSettings, updateBankSettings
} = require('../controllers/settingsController');
const { protect, admin } = require('../middleware/authMiddleware');

// Invite code
router.get('/invite-code', getInvitationCode);
router.put('/invite-code', updateInvitationCode);

// Crypto wallet settings
router.get('/crypto', getCryptoSettings);               // Public: sellers see admin crypto address
router.put('/crypto', protect, admin, updateCryptoSettings);  // Admin only

// Bank transfer settings
router.get('/bank', getBankSettings);                   // Public: sellers see admin bank details
router.put('/bank', protect, admin, updateBankSettings); // Admin only

module.exports = router;
