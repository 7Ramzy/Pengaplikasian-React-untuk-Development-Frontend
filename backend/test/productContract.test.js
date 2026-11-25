const assert = require('node:assert/strict');
const { once } = require('node:events');
const test = require('node:test');
process.env.PRODUCT_DB_PATH = ':memory:';
const app = require('../app');

test('kontrak API produk untuk frontend React', async () => {
    const server = app.listen(0, '127.0.0.1');
    try {
        await once(server, 'listening');
        const base = 'http://127.0.0.1:' + server.address().port + '/products';
        const initial = await (await fetch(base)).json();
        assert.ok(Array.isArray(initial));
        assert.equal(typeof initial[0].id, 'number');

        const input = { name: 'Monitor', price: 1200000 };
        const write = (method, body) => ({
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });
        const created = await fetch(base, write('POST', input));
        assert.equal(created.status, 201);
        const { data: product } = await created.json();
        assert.equal(typeof product.id, 'number');
        assert.deepEqual(product, { id: product.id, ...input });
        const detail = base + '/' + product.id;
        assert.deepEqual(await (await fetch(detail)).json(), product);

        const edited = await fetch(detail, write('PUT', { ...input, price: 1000000 }));
        assert.equal(edited.status, 200);
        assert.equal((await edited.json()).price, 1000000);

        const deleted = await fetch(detail, { method: 'DELETE' });
        assert.equal(deleted.status, 204);
        assert.equal(await deleted.text(), '');
        const missing = await fetch(detail);
        assert.equal(missing.status, 404);
        assert.equal(typeof (await missing.json()).message, 'string');
    } finally {
        await new Promise((resolve, reject) => server.close(error => error ? reject(error) : resolve()));
    }
});
