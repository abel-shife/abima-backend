// Service for product-related database operations
const prisma = require('../config/prismaClient');

function generateProductNumber() {
    return Math.floor(1000 + Math.random() * 9000).toString(); // 4-digit string
}

const getAllProducts = async () => {
    return prisma.product.findMany({
        where: { status: { not: "deleted" } },
        orderBy: { createdAt: 'desc' }
    });
};

const getProductById = async (id) => {
    return prisma.product.findUnique({ where: { id: parseInt(id) } });
};

const createProduct = async (data) => {
    let productNumber;
    let exists = true;
    // Always generate a unique product number
    while (exists) {
        productNumber = generateProductNumber();
        exists = await prisma.product.findUnique({ where: { productNumber } });
    }
    return prisma.product.create({ data: { ...data, productNumber } });
};

const updateProduct = async (id, data) => {
    return prisma.product.update({ where: { id: parseInt(id) }, data });
};

const deleteProduct = async (id) => {
    return prisma.product.update({
        where: { id: parseInt(id) },
        data: { status: "deleted" }
    });
};

module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
};
