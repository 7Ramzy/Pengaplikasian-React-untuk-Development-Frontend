# Tugas 2 · ExpressJS dengan SQLite

Gunakan Node.js 24. Dari direktori `backend`, jalankan `npm install` dan `npm start`.

API tersedia di `http://127.0.0.1:3000/products`.

SQLite menyimpan data di `backend/data/products.sqlite`. Tambahkan produk dan mulai ulang server untuk memeriksa persistensi. Gunakan `PRODUCT_DB_PATH` untuk memilih lokasi database lain.

Metode API adalah GET dan POST pada `/products`, serta GET, PUT, dan DELETE pada `/products/:id`. Kirim JSON dengan properti `name` dan `price` untuk tambah dan edit.
