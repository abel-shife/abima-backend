// Service for product-related database operations
const prisma = require('../config/prismaClient');

const getAllProducts = async () => {
    return prisma.product.findMany();
};

const getProductById = async (id) => {
    return prisma.product.findUnique({ where: { id: parseInt(id) } });
};

const createProduct = async (data) => {
    return prisma.product.create({ data });
};

const updateProduct = async (id, data) => {
    return prisma.product.update({ where: { id: parseInt(id) }, data });
};

const deleteProduct = async (id) => {
    return prisma.product.delete({ where: { id: parseInt(id) } });
};

module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
};
