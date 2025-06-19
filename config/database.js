// Database configuration for Prisma
require('dotenv').config();
const prisma = require('../config/prismaClient');


async function connectDB() {
    try {
        await prisma.$connect();
        console.log('Database connected successfully');
    } catch (error) {
        console.error('Database connection failed:', error);
        process.exit(1);
    }
}

module.exports = { prisma, connectDB };
