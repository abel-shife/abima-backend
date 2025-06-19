const prisma = require('../config/prismaClient');

const getSalesReport = async (startDate, endDate) => {
    // Filter sales by soldAt between startDate and endDate
    const where = {
        soldAt: {
            gte: new Date(startDate),
            lte: new Date(endDate)
        }
    };
    // Total sales
    const totalSales = await prisma.sale.aggregate({
        where,
        _sum: { soldTotalPrice: true, soldQuantity: true },
        _count: { id: true }
    });
    // Sales by product
    const salesByProduct = await prisma.sale.groupBy({
        by: ['soldproductId'],
        where,
        _sum: { soldTotalPrice: true, soldQuantity: true },
        _count: { id: true }
    });
    // Sales by date (daily)
    const salesByDate = await prisma.sale.groupBy({
        by: ['soldAt'],
        where,
        _sum: { soldTotalPrice: true, soldQuantity: true },
        _count: { id: true }
    });
    return { totalSales, salesByProduct, salesByDate };
};

const getLowStockAlert = async () => {
    return prisma.product.findMany({
        where: {
            minStockLevel: { not: null },
            currentStock: { lt: prisma.product.fields.minStockLevel }
        }
    });
};

const getInventoryValuation = async () => {
    const batches = await prisma.stockBatch.findMany({
        select: { quantity: true, buyPrice: true }
    });
    const totalValue = batches.reduce((sum, b) => sum + (Number(b.quantity) * Number(b.buyPrice)), 0);
    return { totalValue };
};

module.exports = {
    getSalesReport,
    getLowStockAlert,
    getInventoryValuation,
};
