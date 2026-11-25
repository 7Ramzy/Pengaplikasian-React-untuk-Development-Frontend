import type { Product } from '../../data/product/repository'
import { ProductCard } from '../molecules/ProductCard'

export function ProductGrid({ products }: { products: Product[] }) {
  if (!products.length) {
    return <p className="rounded-2xl border border-stone-200 bg-white p-6 text-stone-700">Belum ada produk. Gunakan tombol Tambah produk untuk mengisi inventori.</p>
  }
  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {products.map(product => <li key={product.id} className="grid"><ProductCard product={product} /></li>)}
    </ul>
  )
}
