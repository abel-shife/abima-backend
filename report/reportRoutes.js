const express = require('express');
const router = express.Router();
const reportController = require('./reportController');

router.get('/sales', reportController.salesReport);
router.get('/low-stock', reportController.lowStockAlert);
router.get('/inventory-valuation', reportController.inventoryValuation);

module.exports = router;
