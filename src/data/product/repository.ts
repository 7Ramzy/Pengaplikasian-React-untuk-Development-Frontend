import { localProducts } from './localRepository'

export type Product = { id: number; name: string; price: number }
export type ProductInput = Omit<Product, 'id'>

const baseUrl = '/api/products'

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  let response: Response
  try {
    response = await fetch(baseUrl + path, options)
  } catch (error) {
    if (options?.signal?.aborted) throw error
    throw new Response('Backend tidak dapat dihubungi. Periksa apakah server API sudah berjalan.', { status: 503 })
  }

  if (!response.ok) {
    const body = await response.json().catch(() => null)
    throw new Response(body?.message ?? 'Server gagal memproses permintaan.', { status: response.status })
  }
  if (response.status === 204) return undefined as T
  return response.json()
}

const apiProducts = {
  list: (signal: AbortSignal) => request<Product[]>('', { signal }),
  detail: (id: string, signal: AbortSignal) => request<Product>('/' + encodeURIComponent(id), { signal }),
  create: async (input: ProductInput) => {
    const result = await request<{ data: Product }>('', write('POST', input))
    return result.data
  },
  update: (id: string, input: ProductInput) => request<Product>('/' + encodeURIComponent(id), write('PUT', input)),
  remove: (id: string) => request<void>('/' + encodeURIComponent(id), { method: 'DELETE' }),
}

export const products: typeof apiProducts = import.meta.env.MODE === 'frontend' ? localProducts : apiProducts

function write(method: string, input: ProductInput) {
  return { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(input) }
}

export const rupiah = new Intl.NumberFormat('id-ID', {
  style: 'currency', currency: 'IDR', maximumFractionDigits: 0,
})
