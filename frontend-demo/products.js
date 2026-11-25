const form = document.querySelector('#product');
const list = document.querySelector('#products');
const status = document.querySelector('#status');
const refresh = document.querySelector('#refresh');
const rupiah = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 });

async function request(options) {
    const response = await fetch('/products', options);
    const body = await response.json();
    if (!response.ok) throw new Error(body.message || 'Permintaan gagal.');
    return body;
}

async function load() {
    const products = await request();
    list.replaceChildren(...products.map(product => {
        const item = document.createElement('li');
        item.textContent = '#' + product.id + ' · ' + product.name + ' · ' + rupiah.format(product.price);
        return item;
    }));
    status.textContent = products.length + ' produk dimuat.';

}

async function run(action) {
    form.querySelector('button').disabled = true;
    refresh.disabled = true;
    try {
        await action();
    } catch (error) {
        status.textContent = error.message;
    } finally {
        form.querySelector('button').disabled = false;
        refresh.disabled = false;
    }
}

refresh.addEventListener('click', () => run(load));
form.addEventListener('submit', event => {
    event.preventDefault();
    const values = new FormData(form);
    run(async () => {
        const { data } = await request({
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: values.get('name').trim(), price: Number(values.get('price')) }),
        });

        form.reset();
        await load();
        status.textContent = 'Produk #' + data.id + ' tersimpan. ' + status.textContent;
    });
});
run(load);
