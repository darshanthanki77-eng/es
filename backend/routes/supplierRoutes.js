const express = require('express');
const router = express.Router();
const { getSuppliers, createSupplier } = require('../controllers/supplierController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
    .get(getSuppliers)
    .post(createSupplier);

module.exports = router;
