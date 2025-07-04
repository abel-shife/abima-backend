// Controller for stock batch endpoints
const stockBatchService = require('./stockBatchService');
const prisma = require('../config/prismaClient');

const getAllStockBatches = async (req, res) => {
    try {
        const batches = await stockBatchService.getAllStockBatches();
        res.json(batches);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getStockBatchById = async (req, res) => {
    try {
        const batch = await stockBatchService.getStockBatchById(req.params.id);
        if (!batch) return res.status(404).json({ error: 'Stock batch not found' });
        res.json(batch);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const createStockBatch = async (req, res) => {
    try {
        const { productId, buyPrice, quantity, sellPrice } = req.body;
        const batch = await stockBatchService.createStockBatch({ productId, buyPrice, quantity, sellPrice });
        // Increment product currentStock only here
        await prisma.product.update({
            where: { id: productId },
            data: { currentStock: { increment: quantity } }
        });
        // Update averageBuyPrice using only batches with quantity > 0
        const batches = await prisma.stockBatch.findMany({ where: { productId: productId, quantity: { gt: 0 } } });
        const totalQty = batches.reduce((sum, b) => sum + b.quantity, 0);
        const totalValue = batches.reduce((sum, b) => sum + (Number(b.quantity) * Number(b.buyPrice)), 0);
        const avg = totalQty > 0 ? totalValue / totalQty : 0;
        await prisma.product.update({
            where: { id: productId },
            data: { averageBuyPrice: avg }
        });
        // If sellPrice is provided and greater than product's current sellPrice, update product.sellPrice
        if (sellPrice) {
            const product = await prisma.product.findUnique({ where: { id: productId } });
            if (!product.sellPrice || Number(sellPrice) > Number(product.sellPrice)) {
                await prisma.product.update({
                    where: { id: productId },
                    data: { sellPrice: sellPrice }
                });
            }
        }
        res.status(201).json(batch);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

const updateStockBatch = async (req, res) => {
    try {
        const { productId, buyPrice, quantity, receivedAt } = req.body;
        const batch = await stockBatchService.updateStockBatch(req.params.id, { productId, buyPrice, quantity, receivedAt });
        res.json(batch);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

const deleteStockBatch = async (req, res) => {
    try {
        await stockBatchService.deleteStockBatch(req.params.id);
        res.json({ message: 'Stock batch deleted' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

const getStockBatchesByProductId = async (req, res) => {
    try {
        const { productId } = req.params;
        const batches = await stockBatchService.getStockBatchesByProductId(productId);
        res.json(batches);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    getAllStockBatches,
    getStockBatchById,
    createStockBatch,
    updateStockBatch,
    deleteStockBatch,
    getStockBatchesByProductId,
};
