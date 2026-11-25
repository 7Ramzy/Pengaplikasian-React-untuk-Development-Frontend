import { isRouteErrorResponse, Link, useRouteError } from 'react-router'
import { primary } from '../atoms/actionStyles'

function StatusPage({ title, message }: { title: string; message: string }) {
  return (
    <section className="mx-auto max-w-xl rounded-2xl border border-stone-200 bg-white px-6 py-12 text-center shadow-sm">
      <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
      <p className="mb-6 mt-3 text-stone-700">{message}</p>
      <Link to="/products" className={primary}>Kembali ke daftar produk</Link>
    </section>
  )
}

export function NotFoundPage() {
  return <StatusPage title="404 · Halaman tidak ditemukan" message="Alamat yang Anda buka tidak terdaftar." />
}

export function ProductErrorPage() {
  const error = useRouteError()
  if (isRouteErrorResponse(error)) {
    return <StatusPage
      title={error.status === 404 ? 'Produk tidak ditemukan' : 'Gagal memuat produk'}
      message={error.status === 404 ? 'Periksa ID produk pada alamat atau pilih produk lain dari daftar.' : String(error.data)}
    />
  }
  return <StatusPage title="Gagal memuat produk" message="Coba buka kembali daftar produk." />
}
