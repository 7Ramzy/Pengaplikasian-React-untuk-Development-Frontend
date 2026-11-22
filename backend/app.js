const express = require('express');
const app = express();
const productRoutes = require('./routes/productRoutes');

// Middleware untuk mem-parsing body JSON
app.use(express.json());

// Menggunakan route untuk endpoint /products
app.use('/products', productRoutes);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});