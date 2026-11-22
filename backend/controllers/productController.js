const fs = require('node:fs');
const path = require('node:path');

const directory = path.join(__dirname, '../data');
const file = path.join(directory, 'products.json');

let inventory = {
    nextId: 3,
    products: [
        { id: 1, name: 'Laptop Acer', price: 15000000 },
        { id: 2, name: 'Keyboard Mechanical', price: 500000 },
    ],
};

if (fs.existsSync(file)) inventory = JSON.parse(fs.readFileSync(file, 'utf8'));

function saveInventory(next) {
    fs.mkdirSync(directory, { recursive: true });
    const temporaryFile = file + '.tmp';
    fs.writeFileSync(temporaryFile, JSON.stringify(next, null, 2), 'utf8');
    fs.renameSync(temporaryFile, file);
    inventory = next;
}

function findProduct(req) {
    const id = req.params.id;
    return inventory.products.find(product => String(product.id) === id);
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

exports.getAllProducts = (req, res) => res.json(inventory.products);

exports.getProductById = (req, res) => {
    const product = findProduct(req);
    return product ? res.json(product) : notFound(res);
};

exports.createProduct = (req, res) => {
    const input = productInput(req.body);
    if (!input) return invalidInput(res);

    const product = { id: inventory.nextId, ...input };
    saveInventory({ nextId: product.id + 1, products: [...inventory.products, product] });
    return res.status(201).json({ message: 'Produk berhasil ditambahkan', data: product });
};

exports.updateProduct = (req, res) => {
    const current = findProduct(req);
    if (!current) return notFound(res);

    const input = productInput(req.body);
    if (!input) return invalidInput(res);

    const product = { id: current.id, ...input };
    saveInventory({ ...inventory, products: inventory.products.map(item => item.id === product.id ? product : item) });
    return res.json(product);
};

exports.deleteProduct = (req, res) => {
    const product = findProduct(req);
    if (!product) return notFound(res);

    saveInventory({ ...inventory, products: inventory.products.filter(item => item.id !== product.id) });
    return res.status(204).end();
};
