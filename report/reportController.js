const reportService = require('./reportService');

// Sales report: total sales, sales by product, sales by date
const salesReport = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        if (!startDate || !endDate) {
            return res.status(400).json({ error: 'startDate and endDate are required in query params (YYYY-MM-DD)' });
        }
        const report = await reportService.getSalesReport(startDate, endDate);
        res.json(report);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Low-stock alert: products below minStockLevel
const lowStockAlert = async (req, res) => {
    try {
        const lowStockProducts = await reportService.getLowStockAlert();
        res.json(lowStockProducts);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Inventory valuation: sum of (quantity * buyPrice) for all stock batches
const inventoryValuation = async (req, res) => {
    try {
        const value = await reportService.getInventoryValuation();
        res.json(value);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    salesReport,
    lowStockAlert,
    inventoryValuation,
};
