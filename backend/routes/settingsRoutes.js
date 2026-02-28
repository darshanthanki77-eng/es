const express = require('express');
const router = express.Router();
const { getInvitationCode, updateInvitationCode } = require('../controllers/settingsController');
// Assuming we want to protect this, but for now making it public or semi-private as per existing pattern
// Ideally should use 'protect' and 'admin' middleware
const { protect } = require('../middleware/authMiddleware');

router.get('/invite-code', getInvitationCode);
router.put('/invite-code', updateInvitationCode);

module.exports = router;
