const prisma = require('../config/prismaClient');

async function main() {
    // Seed Users
    await prisma.user.createMany({
        data: [
            { username: 'admin', password: 'adminpass', role: 'ADMIN' },
            { username: 'manager', password: 'managerpass', role: 'MANAGER' },
            { username: 'cashier', password: 'cashierpass', role: 'CASHIER' }
        ],
        skipDuplicates: true
    });

    // Seed Products
    await prisma.product.createMany({
        data: [
            { name: 'Coca Cola', description: 'Soft drink', currentStock: 100, minStockLevel: 10 },
            { name: 'Pepsi', description: 'Soft drink', currentStock: 80, minStockLevel: 10 },
            { name: 'Fanta', description: 'Soft drink', currentStock: 60, minStockLevel: 10 }
        ],
        skipDuplicates: true
    });

    // Seed StockBatches
    await prisma.stockBatch.createMany({
        data: [
            { productId: 30, buyPrice: 10, quantity: 50 },
            { productId: 31, buyPrice: 12, quantity: 50 },
            { productId: 32, buyPrice: 9, quantity: 80 },
            { productId: 32, buyPrice: 8, quantity: 60 }
        ]
    });

    // Seed Sales
    await prisma.sale.createMany({
        data: [
            { soldProductId: 1, soldQuantity: 5, soldById: 1, soldStockBatchId: 1, soldUnitPrice: 15, soldTotalPrice: 75 },
            { soldProductId: 2, soldQuantity: 10, soldById: 2, soldStockBatchId: 3, soldUnitPrice: 14, soldTotalPrice: 140 },
            { soldProductId: 3, soldQuantity: 8, soldById: 3, soldStockBatchId: 4, soldUnitPrice: 13, soldTotalPrice: 104 }
        ]
    });
}

main()
    .then(() => {
        console.log('Seeding complete');
        process.exit(0);
    })
    .catch((e) => {
        console.error(e);
        process.exit(1);
    });
