import { Form, Link, useActionData, useLoaderData, useNavigation } from 'react-router'
import { rupiah, type Product } from '../../data/product/repository'
import { danger, primary, secondary } from '../atoms/actionStyles'

export function ProductDetailPage() {
  const product = useLoaderData<Product>()
  const action = useActionData<{ error: string }>()
  const busy = useNavigation().state !== 'idle'
  return (
    <div className="max-w-2xl">
      <Link to="/products" className={secondary}>Kembali ke daftar produk</Link>
      <article className="mt-5 rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
        <h1 className="break-words text-3xl font-bold tracking-tight">{product.name}</h1>
        <dl className="my-6 grid grid-cols-2 gap-4 rounded-xl bg-stone-100 p-4">
          <div><dt className="text-sm text-stone-600">ID produk</dt><dd className="mt-1 font-semibold">{product.id}</dd></div>
          <div><dt className="text-sm text-stone-600">Harga</dt><dd className="mt-1 break-words font-semibold">{rupiah.format(product.price)}</dd></div>
        </dl>
        {action?.error && <p role="alert" className="mb-4 text-sm text-red-800">{action.error}</p>}
        <div className="flex flex-wrap gap-3">
          <Link to="edit" className={primary}>Edit produk</Link>
          <Form method="delete" onSubmit={event => {
            if (!window.confirm('Hapus produk ini dari inventori?')) event.preventDefault()
          }}>
            <button className={danger} disabled={busy}>{busy ? 'Memproses…' : 'Hapus produk'}</button>
          </Form>
        </div>
      </article>
    </div>
  )
}
