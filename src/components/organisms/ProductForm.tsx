import { Form, Link, useNavigation } from 'react-router'
import type { Product } from '../../data/product/repository'
import { primary, secondary } from '../atoms/actionStyles'

const inputStyle = 'mt-2 block w-full rounded-lg border border-stone-300 bg-white px-3 py-2.5'

export function ProductForm({ product, error }: { product?: Product; error?: string }) {
  const busy = useNavigation().state !== 'idle'
  return (
    <Form method="post" className="mt-5 space-y-5 rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
      <label className="block font-medium">
        Nama produk
        <input className={inputStyle} name="name" defaultValue={product?.name} maxLength={120} required />
      </label>
      <label className="block font-medium">
        Harga (Rp)
        <input className={inputStyle} name="price" type="number" min="0" step="1" max={Number.MAX_SAFE_INTEGER} defaultValue={product?.price} required />
      </label>
      {error && <p role="alert" className="text-sm text-red-800">{error}</p>}
      <div className="flex flex-wrap gap-3">
        <button className={primary} disabled={busy}>{busy ? 'Menyimpan…' : 'Simpan produk'}</button>
        <Link className={secondary} to={product ? '/products/' + product.id : '/products'}>Batal</Link>
      </div>
    </Form>
  )
}
