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

module.exports = memoryStore();
