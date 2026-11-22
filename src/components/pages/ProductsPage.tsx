import { Link, useLoaderData } from 'react-router'
import type { Product } from '../../data/product/repository'
import { primary } from '../atoms/actionStyles'
import { ProductGrid } from '../organisms/ProductGrid'

export function ProductsPage() {
  const products = useLoaderData<Product[]>()
  return (
    <>
      <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Daftar produk</h1>
          <p className="mt-2 text-stone-600">{products.length} produk dalam inventori</p>
        </div>
        <Link to="new" className={primary}>Tambah produk</Link>
      </div>
      <ProductGrid products={products} />
    </>
  )
}
