const express = require('express');
const router = express.Router();
const stockBatchController = require('./stockBatchController');

router.get('/', stockBatchController.getAllStockBatches);
router.get('/:id', stockBatchController.getStockBatchById);
router.post('/', stockBatchController.createStockBatch);
router.put('/:id', stockBatchController.updateStockBatch);
router.delete('/:id', stockBatchController.deleteStockBatch);
router.get('/by-product/:productId', stockBatchController.getStockBatchesByProductId);

module.exports = router;
