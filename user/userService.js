// Service for user-related database operations
const prisma = require('../config/prismaClient');

const getAllUsers = async () => {
    return prisma.user.findMany();
};

const getUserById = async (id) => {
    return prisma.user.findUnique({ where: { id: parseInt(id) } });
};

const getUserByUsername = async (username) => {
    return prisma.user.findUnique({ where: { username } });
};

const createUser = async (data) => {
    return prisma.user.create({ data });
};

const updateUser = async (id, data) => {
    return prisma.user.update({ where: { id: parseInt(id) }, data });
};

const deleteUser = async (id) => {
    return prisma.user.delete({ where: { id: parseInt(id) } });
};

module.exports = {
    getAllUsers,
    getUserById,
    getUserByUsername,
    createUser,
    updateUser,
    deleteUser,
};
