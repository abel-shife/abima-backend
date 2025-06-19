// Controller for product endpoints
const productService = require('./productService');
const stockBatchService = require('../stockbatch/stockBatchService');

const getAllProducts = async (req, res) => {
    try {
        const products = await productService.getAllProducts();
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getProductById = async (req, res) => {
    try {
        const product = await productService.getProductById(req.params.id);
        if (!product) return res.status(404).json({ error: 'Product not found' });
        res.json(product);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const createProduct = async (req, res) => {
    try {
        const { name, description, imageUrl, currentStock, minStockLevel, averageBuyPrice, quantity } = req.body;

        const product = await productService.createProduct({ name, description, imageUrl, currentStock, minStockLevel, averageBuyPrice });
        // Create initial stock batch if buyPrice and quantity are provided
        if (averageBuyPrice && quantity) {
            await stockBatchService.createStockBatch({
                productId: product.id,
                buyPrice: averageBuyPrice,
                quantity,
                // receivedAt will default to now()
            });
        }
        res.status(201).json(product);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

const updateProduct = async (req, res) => {
    try {
        const { name, description, imageUrl, currentStock, minStockLevel } = req.body;
        const product = await productService.updateProduct(req.params.id, { name, description, imageUrl, currentStock, minStockLevel });
        res.json(product);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

const deleteProduct = async (req, res) => {
    try {
        await productService.deleteProduct(req.params.id);
        res.json({ message: 'Product deleted' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
};
