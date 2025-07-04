// Controller for sale endpoints
const saleService = require('./saleService');
const prisma = require('../config/prismaClient');

const getAllSales = async (req, res) => {
    try {
        const sales = await saleService.getAllSales();
        res.json(sales);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getSaleById = async (req, res) => {
    try {
        const sale = await saleService.getSaleById(req.params.id);
        if (!sale) return res.status(404).json({ error: 'Sale not found' });
        res.json(sale);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const createSale = async (req, res) => {
    try {
        const { soldProductId, soldQuantity, soldById, soldUnitPrice } = req.body;

        // Validate input
        if (
            soldProductId == null ||
            soldQuantity == null ||
            soldById == null ||
            soldUnitPrice == null
        ) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Check if product exists and has enough stock
        const product = await prisma.product.findUnique({
            where: { id: parseInt(soldProductId) },
            select: { currentStock: true }
        });

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        if (product.currentStock < soldQuantity) {
            return res.status(400).json({
                error: 'Insufficient stock',
                available: product.currentStock,
                requested: soldQuantity
            });
        }

        // Process the sale in a transaction
        const result = await prisma.$transaction(async (tx) => {
            // Get available batches ordered by receivedAt (FIFO)
            const batches = await saleService.getAvailableBatchesForProduct(soldProductId);
            let quantityToSell = soldQuantity;
            const sales = [];

            // Process each batch until we've sold the requested quantity
            for (const batch of batches) {
                if (quantityToSell <= 0) break;

                const sellQty = Math.min(batch.quantity, quantityToSell);

                // Create sale record for this batch
                const sale = await tx.sale.create({
                    data: {
                        soldProductId: parseInt(soldProductId),
                        soldQuantity: sellQty,
                        soldById: parseInt(soldById),
                        soldStockBatchId: batch.id,
                        soldUnitPrice: soldUnitPrice,
                        soldTotalPrice: sellQty * soldUnitPrice,
                        soldAt: new Date(),
                    }
                });

                // Update batch quantity and product stock
                await saleService.decrementBatchQuantity(tx, batch.id, sellQty);

                sales.push(sale);
                quantityToSell -= sellQty;
            }

            // If we couldn't fulfill the entire order
            if (quantityToSell > 0) {
                throw new Error('Not enough stock to fulfill sale');
            }

            return sales;
        });

        res.status(201).json(result);
    } catch (err) {
        console.error('Sale creation error:', err);
        res.status(400).json({
            error: err.message,
            details: err.stack
        });
    }
};

const updateSale = async (req, res) => {
    try {
        const { soldproductId, soldQuantity, soldById, soldUnitPrice, soldTotalPrice, soldAt } = req.body;
        const sale = await saleService.updateSale(req.params.id, { soldproductId, soldQuantity, soldById, soldUnitPrice, soldTotalPrice, soldAt });
        res.json(sale);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

const deleteSale = async (req, res) => {
    try {
        await saleService.deleteSale(req.params.id);
        res.json({ message: 'Sale deleted' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

const getSalesByCashierId = async (req, res) => {
    try {
        const cashierId = req.params.cashierId;
        if (!cashierId) {
            return res.status(400).json({ error: 'cashierId param is required' });
        }
        const sales = await saleService.getSalesByCashierId(cashierId);
        res.json(sales);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getSalesByProductId = async (req, res) => {
    try {
        const { productId } = req.params;
        if (!productId) {
            return res.status(400).json({ error: 'productId param is required' });
        }
        const sales = await saleService.getSalesByProductId(productId);
        res.json(sales);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getSalesByProductIdAndUserId = async (req, res) => {
    try {
        const { productId, userId } = req.params;
        if (!productId || !userId) {
            return res.status(400).json({ error: 'productId and userId params are required' });
        }
        const sales = await saleService.getSalesByProductIdAndUserId(productId, userId);
        res.json(sales);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    getAllSales,
    getSaleById,
    createSale,
    updateSale,
    deleteSale,
    getSalesByCashierId,
    getSalesByProductId,
    getSalesByProductIdAndUserId,
};
