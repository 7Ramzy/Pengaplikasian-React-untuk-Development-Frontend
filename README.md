# Inventori Produk

Aplikasi React dan TypeScript untuk mengelola produk melalui API Express. Navigasi memakai React Router, tampilan menggunakan Tailwind CSS, dan komponen mengikuti struktur Atomic Design dari [template perkuliahan](https://github.com/anasmcfudy/react-template).

## Menjalankan secara lokal

Gunakan Node.js 22.12 atau lebih baru dan jalankan perintah dari root repository.

1. Instal dependensi dengan `npm ci`.
2. Jalankan backend dengan `npm run backend`. API tersedia di `http://127.0.0.1:3000/products`.
3. Di terminal kedua, jalankan frontend dengan `npm run dev`. Buka alamat yang ditampilkan Vite, biasanya `http://localhost:5173`.

Vite meneruskan permintaan `/api/products` ke Express. Backend menyimpan perubahan di `backend/data/products.json` agar tetap tersedia setelah server dimulai ulang. Saat berkas tersebut belum ada, backend menampilkan dua produk awal.

## Pengujian

Jalankan `npm run build` untuk pemeriksaan TypeScript dan build produksi. Uji tambah, detail, edit, dan hapus melalui frontend. Buka URL produk yang sudah dihapus untuk melihat pesan produk tidak ditemukan, lalu buka URL seperti `/halaman-tidak-ada` untuk melihat halaman 404.

Untuk hosting produksi, arahkan `/api/products` ke service Express dan gunakan fallback `index.html` untuk URL frontend.
