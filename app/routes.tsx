import { createBrowserRouter, redirect, type ActionFunctionArgs, type LoaderFunctionArgs } from 'react-router'
import { products } from '../src/data/product/repository'
import { PageLayout } from '../src/components/templates/PageLayout'
import { ProductsPage } from '../src/components/pages/ProductsPage'
import { ProductDetailPage } from '../src/components/pages/ProductDetailPage'
import { ProductFormPage } from '../src/components/pages/ProductFormPage'
import { NotFoundPage, ProductErrorPage } from '../src/components/pages/StatusPage'

function productId(params: LoaderFunctionArgs['params']) {
  if (!params.id || !/^[1-9]\d*$/.test(params.id)) {
    throw new Response('Produk tidak ditemukan.', { status: 404 })
  }
  return params.id
}

function detailLoader({ params, request }: LoaderFunctionArgs) {
  return products.detail(productId(params), request.signal)
}

async function saveProduct({ params, request }: ActionFunctionArgs) {
  const values = await request.formData()
  const name = String(values.get('name') ?? '').trim()
  const rawPrice = String(values.get('price') ?? '').trim()
  const price = Number(rawPrice)
  if (!name || name.length > 120 || !rawPrice || !Number.isSafeInteger(price) || price < 0) {
    return { error: 'Isi nama produk dan harga rupiah yang valid.' }
  }

  try {
    const input = { name, price }
    const product = params.id ? await products.update(productId(params), input) : await products.create(input)
    return redirect('/products/' + product.id)
  } catch (error) {
    if (error instanceof Response) {
      if (error.status === 404) throw error
      return { error: await error.text() }
    }
    throw error
  }
}

async function deleteProduct({ params }: ActionFunctionArgs) {
  try {
    await products.remove(productId(params))
  } catch (error) {
    if (error instanceof Response && error.status !== 404) return { error: await error.text() }
    throw error
  }
  return redirect('/products')
}

export const router = createBrowserRouter([{
  Component: PageLayout,
  HydrateFallback: () => <p role="status" className="p-5">Memuat inventori…</p>,
  children: [
    { index: true, loader: () => redirect('/products') },
    {
      path: 'products',
      ErrorBoundary: ProductErrorPage,
      children: [
        { index: true, loader: ({ request }) => products.list(request.signal), Component: ProductsPage },
        { path: 'new', action: saveProduct, Component: ProductFormPage },
        { path: ':id', loader: detailLoader, action: deleteProduct, Component: ProductDetailPage },
        { path: ':id/edit', loader: detailLoader, action: saveProduct, Component: ProductFormPage },
      ],
    },
    { path: '*', Component: NotFoundPage },
  ],
}])
