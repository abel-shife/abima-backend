// Service for stock batch-related database operations
const prisma = require('../config/prismaClient');

const getAllStockBatches = async () => {
    return prisma.stockBatch.findMany();
};

const getStockBatchById = async (id) => {
    return prisma.stockBatch.findUnique({ where: { id: parseInt(id) } });
};

const createStockBatch = async (data) => {
    return prisma.stockBatch.create({ data });
};

const updateStockBatch = async (id, data) => {
    return prisma.stockBatch.update({ where: { id: parseInt(id) }, data });
};

const deleteStockBatch = async (id) => {
    return prisma.stockBatch.delete({ where: { id: parseInt(id) } });
};

const getStockBatchesByProductId = async (productId) => {
    return prisma.stockBatch.findMany({ where: { productId: parseInt(productId) } });
};

module.exports = {
    getAllStockBatches,
    getStockBatchById,
    createStockBatch,
    updateStockBatch,
    deleteStockBatch,
    getStockBatchesByProductId,
};
