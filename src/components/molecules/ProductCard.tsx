import { Link } from 'react-router'
import { rupiah, type Product } from '../../data/product/repository'
import { secondary } from '../atoms/actionStyles'

export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="flex min-w-0 flex-col rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
      <p className="mb-2 text-sm font-medium text-stone-600">ID {product.id}</p>
      <h2 className="break-words text-xl font-bold">
        <Link to={String(product.id)} className="hover:text-teal-800 hover:underline">{product.name}</Link>
      </h2>
      <p className="mb-5 mt-2 grow text-stone-700">{rupiah.format(product.price)}</p>
      <Link to={String(product.id)} className={secondary + ' self-start'} aria-label={'Lihat detail ' + product.name}>Lihat detail</Link>
    </article>
  )
}
