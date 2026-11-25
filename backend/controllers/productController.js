const products = require('../data/productStore');

function productId(req) {
    const raw = req.params.id;
    const id = Number(raw);
    return /^[1-9]\d*$/.test(raw) && Number.isSafeInteger(id) ? id : 0;
}

function productInput(body) {
    const name = typeof body?.name === 'string' ? body.name.trim() : '';
    const price = body?.price;
    if (!name || name.length > 120 || !Number.isSafeInteger(price) || price < 0) return null;
    return { name, price };
}

function notFound(res) {
    return res.status(404).json({ message: 'Produk tidak ditemukan.' });
}

function invalidInput(res) {
    return res.status(400).json({ message: 'Isi nama produk (maksimal 120 karakter) dan harga rupiah berupa bilangan bulat nonnegatif.' });
}

exports.getAllProducts = (req, res) => res.json(products.list());

exports.getProductById = (req, res) => {
    const product = products.get(productId(req));
    return product ? res.json(product) : notFound(res);
};

exports.createProduct = (req, res) => {
    const input = productInput(req.body);
    if (!input) return invalidInput(res);
    const product = products.create(input);
    return res.location('/products/' + product.id)
        .status(201).json({ message: 'Produk berhasil ditambahkan', data: product });
};

exports.updateProduct = (req, res) => {
    const id = productId(req);
    const input = productInput(req.body);
    if (!input) return products.get(id) ? invalidInput(res) : notFound(res);
    const product = products.update(id, input);
    return product ? res.json(product) : notFound(res);
};

exports.deleteProduct = (req, res) => (
    products.remove(productId(req)) ? res.status(204).end() : notFound(res)
);
