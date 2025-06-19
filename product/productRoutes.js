const express = require('express');
const router = express.Router();
const productController = require('./productController');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);
router.post('/', productController.createProduct);
router.put('/:id', productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

module.exports = router;
