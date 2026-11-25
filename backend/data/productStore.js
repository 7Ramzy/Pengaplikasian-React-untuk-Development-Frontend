const fs = require('node:fs');
const path = require('node:path');

const initialProducts = [
    { id: 1, name: 'Laptop Acer', price: 15000000 },
    { id: 2, name: 'Keyboard Mechanical', price: 500000 },
];

function memoryStore() {
    const products = new Map(initialProducts.map(product => [product.id, product]));
    let nextId = 3;
    return {
        list: () => [...products.values()],
        get: id => products.get(id),
        create(input) {
            const product = { id: nextId++, ...input };
            products.set(product.id, product);
            return product;
        },
        update(id, input) {
            if (!products.has(id)) return;
            const product = { id, ...input };
            products.set(id, product);
            return product;
        },
        remove: id => products.delete(id),
    };
}

function sqliteStore() {
    const { DatabaseSync } = require('node:sqlite');
    const file = process.env.PRODUCT_DB_PATH || path.join(__dirname, 'products.sqlite');
    if (file !== ':memory:') fs.mkdirSync(path.dirname(file), { recursive: true });
    const db = new DatabaseSync(file);
    db.exec('PRAGMA busy_timeout = 5000; BEGIN IMMEDIATE');
    try {
        if (!db.prepare("SELECT name FROM sqlite_schema WHERE type = 'table' AND name = 'products'").get()) {
            db.exec(`
                CREATE TABLE products (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT NOT NULL CHECK(length(name) BETWEEN 1 AND 120),
                    price INTEGER NOT NULL CHECK(price BETWEEN 0 AND 9007199254740991)
                ) STRICT
            `);
            const legacyFile = path.join(__dirname, 'products.json');
            const inventory = process.env.PRODUCT_DB_PATH || !fs.existsSync(legacyFile)
                ? { products: initialProducts, nextId: 3 }
                : JSON.parse(fs.readFileSync(legacyFile, 'utf8'));
            const insert = db.prepare('INSERT INTO products (id, name, price) VALUES (?, ?, ?)');
            for (const product of inventory.products) insert.run(product.id, product.name, product.price);
            // Preserve IDs previously issued and deleted by the JSON implementation.
            db.prepare('DELETE FROM sqlite_sequence WHERE name = ?').run('products');
            db.prepare('INSERT INTO sqlite_sequence (name, seq) VALUES (?, ?)').run('products', inventory.nextId - 1);
        }
        db.exec('COMMIT');
    } catch (error) {
        db.exec('ROLLBACK');
        db.close();
        throw error;
    }

    const list = db.prepare('SELECT id, name, price FROM products ORDER BY id');
    const get = db.prepare('SELECT id, name, price FROM products WHERE id = ?');
    const create = db.prepare('INSERT INTO products (name, price) VALUES (?, ?) RETURNING id, name, price');
    const update = db.prepare('UPDATE products SET name = ?, price = ? WHERE id = ? RETURNING id, name, price');
    const remove = db.prepare('DELETE FROM products WHERE id = ?');
    return {
        list: () => list.all(),
        get: id => get.get(id),
        create: ({ name, price }) => create.get(name, price),
        update: (id, { name, price }) => update.get(name, price, id),
        remove: id => remove.run(id).changes === 1,
    };
}

module.exports = process.argv.includes('--memory') ? memoryStore() : sqliteStore();
