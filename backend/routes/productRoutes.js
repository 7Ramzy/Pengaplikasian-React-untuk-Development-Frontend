const express = require('express');
const products = require('../controllers/productController');
const router = express.Router();

router.get('/', products.getAllProducts);
router.get('/:id', products.getProductById);
router.post('/', products.createProduct);
router.put('/:id', products.updateProduct);
router.delete('/:id', products.deleteProduct);

module.exports = router;
