const asyncHandler = require('express-async-handler');
const RegCode = require('../models/RegCode');

// @desc    Get master invitation code
// @route   GET /api/settings/invite-code
// @access  Private/Admin
const getInvitationCode = asyncHandler(async (req, res) => {
    // There should be only one code, so we find the first one or create default
    let regCode = await RegCode.findOne();

    if (!regCode) {
        regCode = await RegCode.create({
            code: 'LKC1523' // Default initial code
        });
    }

    res.json({
        success: true,
        code: regCode.code,
        updatedAt: regCode.updatedAt
    });
});

// @desc    Update/Regenerate invitation code
// @route   PUT /api/settings/invite-code
// @access  Private/Admin
const updateInvitationCode = asyncHandler(async (req, res) => {
    const { code } = req.body;

    if (!code) {
        res.status(400);
        throw new Error('Code is required');
    }

    let regCode = await RegCode.findOne();

    if (regCode) {
        regCode.code = code;
        await regCode.save();
    } else {
        regCode = await RegCode.create({ code });
    }

    res.json({
        success: true,
        code: regCode.code,
        message: 'Invitation code updated successfully'
    });
});

// Internal function to rotate code
const rotateCode = async () => {
    const newCode = 'LKC' + Math.floor(1000 + Math.random() * 9000);

    let regCode = await RegCode.findOne();
    if (regCode) {
        regCode.code = newCode;
        await regCode.save();
    } else {
        await RegCode.create({ code: newCode });
    }
    console.log(`[System] Invitation Code Rotated: ${newCode}`);
    return newCode;
};

module.exports = {
    getInvitationCode,
    updateInvitationCode,
    rotateCode // Export for server.js
};
