import { useActionData, useLoaderData } from 'react-router'
import type { Product } from '../../data/product/repository'
import { ProductForm } from '../organisms/ProductForm'

export function ProductFormPage() {
  const product = useLoaderData<Product | undefined>()
  const action = useActionData<{ error: string }>()
  return (
    <section className="max-w-2xl">
      <h1 className="text-3xl font-bold tracking-tight">{product ? 'Edit produk' : 'Tambah produk'}</h1>
      <ProductForm key={product?.id ?? 'new'} product={product} error={action?.error} />
    </section>
  )
}
