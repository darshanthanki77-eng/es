const express = require('express');
const router = express.Router();
const { getInvitationCode, updateInvitationCode, getCryptoSettings, updateCryptoSettings } = require('../controllers/settingsController');
const { protect, admin } = require('../middleware/authMiddleware');

// Invite code
router.get('/invite-code', getInvitationCode);
router.put('/invite-code', updateInvitationCode);

// Crypto payment settings
router.get('/crypto', getCryptoSettings);                         // Public: sellers fetch admin crypto address
router.put('/crypto', protect, admin, updateCryptoSettings);      // Admin only: update wallet addresses

module.exports = router;
