// Data disimpan dalam array (in-memory)
let products = [
    { id: 1, name: "Laptop Acer", price: 15000000 },
    { id: 2, name: "Keyboard Mechanical", price: 500000 }
];

// Mendapatkan semua produk
const getAllProducts = (req, res) => {
    res.status(200).json(products);
};

// Mendapatkan detail produk berdasarkan ID
const getProductById = (req, res) => {
    const id = parseInt(req.params.id);
    const product = products.find(p => p.id === id);

    if (product) {
        res.status(200).json(product);
    } else {
        res.status(404).json({ message: "Produk tidak ditemukan" });
    }
};

// Menambahkan produk baru
const createProduct = (req, res) => {
    const { name, price } = req.body;
    
    // Membuat ID baru yang auto-increment berdasarkan ID terakhir
    const newId = products.length > 0 ? products[products.length - 1].id + 1 : 1;
    
    const newProduct = {
        id: newId,
        name: name,
        price: price
    };

    products.push(newProduct);
    
    res.status(201).json({
        message: "Produk berhasil ditambahkan",
        data: newProduct
    });
};

module.exports = {
    getAllProducts,
    getProductById,
    createProduct
};