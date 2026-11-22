const express = require('express');
const productRoutes = require('./routes/productRoutes');

const app = express();
app.use(express.json());
app.use('/products', productRoutes);
app.use((error, req, res, next) => {
    if (res.headersSent) return next(error);
    if (error.status === 400) return res.status(400).json({ message: 'JSON tidak valid.' });
    console.error(error);
    return res.status(500).json({ message: 'Server gagal memproses permintaan.' });
});

app.listen(3000, '127.0.0.1', () => {
    console.log('API berjalan di http://127.0.0.1:3000/products');
});
