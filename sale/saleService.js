// Service for sale-related database operations
const prisma = require('../config/prismaClient');


const getAllSales = async () => {
    return prisma.sale.findMany({
        include: {
            Product: true,
            StockBatch: true,
            soldBy: true
        },
        orderBy: { soldAt: 'desc' }
    });
};

const getSaleById = async (id) => {
    return prisma.sale.findUnique({ where: { id: parseInt(id) } });
};

const getAvailableBatchesForProduct = async (productId) => {
    // Only batches with quantity > 0, ordered by receivedAt (FIFO)
    return prisma.stockBatch.findMany({
        where: {
            productId: parseInt(productId),
            quantity: { gt: 0 }
        },
        orderBy: { receivedAt: 'asc' },
    });
};

const createSale = async (data) => {
    return prisma.sale.create({ data });
};

const decrementBatchQuantity = async (tx, batchId, qty) => {
    // Get the batch with current quantity
    const batch = await tx.stockBatch.findUnique({
        where: { id: batchId },
        select: { quantity: true, productId: true }
    });

    if (!batch) {
        throw new Error('Stock batch not found');
    }

    if (batch.quantity < qty) {
        throw new Error('Insufficient stock in batch');
    }

    // Update batch quantity
    const updatedBatch = await tx.stockBatch.update({
        where: { id: batchId },
        data: { quantity: { decrement: qty } }
    });

    // Update product's current stock
    await tx.product.update({
        where: { id: batch.productId },
        data: { currentStock: { decrement: qty } }
    });

    // Update product's average buy price
    const batches = await tx.stockBatch.findMany({
        where: {
            productId: batch.productId,
            quantity: { gt: 0 }
        }
    });

    const totalQty = batches.reduce((sum, b) => sum + b.quantity, 0);
    const totalValue = batches.reduce((sum, b) => sum + (Number(b.quantity) * Number(b.buyPrice)), 0);
    const avg = totalQty > 0 ? totalValue / totalQty : 0;

    await tx.product.update({
        where: { id: batch.productId },
        data: { averageBuyPrice: avg }
    });

    return updatedBatch;
};

const updateSale = async (id, data) => {
    return prisma.sale.update({ where: { id: parseInt(id) }, data });
};

const deleteSale = async (id) => {
    return prisma.sale.delete({ where: { id: parseInt(id) } });
};

const getSalesByCashierId = async (cashierId) => {
    return prisma.sale.findMany({
        where: { soldById: parseInt(cashierId) },
        include: {
            Product: true,
            StockBatch: true,
            soldBy: true
        },
        orderBy: { soldAt: 'desc' }
    });
};

module.exports = {
    getAllSales,
    getSaleById,
    getAvailableBatchesForProduct,
    createSale,
    decrementBatchQuantity,
    updateSale,
    deleteSale,
    getSalesByCashierId,
};
