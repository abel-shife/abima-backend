// filepath: index.js
const express = require('express');
const { connectDB } = require('./config/database');
const app = express();

app.use(express.json());

app.use('/testserver', (req, res) => {
    res.json('Server is working');
})

// Remove old user.routes.js registration if present
// app.use('/users', require('./user.routes'));
app.use('/products', require('./product/productRoutes'));
app.use('/stockbatches', require('./stockbatch/stockBatchRoutes'));
app.use('/users', require('./user/userRoutes'));
app.use('/sales', require('./sale/saleRoutes'));
app.use('/reports', require('./report/reportRoutes'));

// Serve the uploads directory as static files so images can be accessed via their URLs
app.use('/uploads', express.static('uploads'));

// Add more routes for sales, etc.

const PORT = process.env.PORT || 4000;

// Connect to the database before starting the server
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
});
