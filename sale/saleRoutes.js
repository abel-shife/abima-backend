const express = require('express');
const router = express.Router();
const saleController = require('./saleController');

router.get('/', saleController.getAllSales);
router.get('/by-cashier/:cashierId', saleController.getSalesByCashierId);
router.get('/:id', saleController.getSaleById);
router.post('/', saleController.createSale);
router.put('/:id', saleController.updateSale);
router.delete('/:id', saleController.deleteSale);

module.exports = router;
