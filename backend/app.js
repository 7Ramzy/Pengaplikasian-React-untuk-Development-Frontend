const express = require('express');
const productRoutes = require('./routes/productRoutes');

const app = express();
app.use(express.json());
app.use('/products', productRoutes);
app.use('/demo', express.static(require('node:path').join(__dirname, '../frontend-demo')));
app.use((req, res) => res.status(404).json({ message: 'Endpoint tidak ditemukan.' }));
app.use((error, req, res, next) => {
    if (res.headersSent) return next(error);
    if (error.type === 'entity.parse.failed') {
        return res.status(400).json({ message: 'Body JSON tidak valid.' });
    }
    if (error.type === 'entity.too.large') {
        return res.status(413).json({ message: 'Body terlalu besar.' });
    }
    console.error(error);
    return res.status(500).json({ message: 'Server gagal memproses permintaan.' });
});

if (require.main === module) {
    const port = Number(process.env.PORT || 3000);
    app.listen(port, '127.0.0.1', () => console.log(`API tersedia di http://127.0.0.1:${port}/products`));
}

module.exports = app;
