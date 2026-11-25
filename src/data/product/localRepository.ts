import type { Product, ProductInput } from './repository'

const key = 'inventori-produk-tugas-3'
const initial = {
  nextId: 3,
  products: [
    { id: 1, name: 'Laptop Acer', price: 15000000 },
    { id: 2, name: 'Keyboard Mechanical', price: 500000 },
  ],
}

function read(): typeof initial {
  const saved = localStorage.getItem(key)
  return saved ? JSON.parse(saved) : initial
}

function save(inventory: typeof initial) {
  localStorage.setItem(key, JSON.stringify(inventory))
}

function find(products: Product[], id: string) {
  const product = products.find(item => String(item.id) === id)
  if (!product) throw new Response('Produk tidak ditemukan.', { status: 404 })
  return product
}

export const localProducts = {
  list: async () => read().products,
  detail: async (id: string) => find(read().products, id),
  async create(input: ProductInput) {
    const { nextId, products } = read()
    const product = { id: nextId, ...input }
    save({ nextId: nextId + 1, products: [...products, product] })
    return product
  },
  async update(id: string, input: ProductInput) {
    const inventory = read()
    const product = { id: find(inventory.products, id).id, ...input }
    save({ ...inventory, products: inventory.products.map(item => item.id === product.id ? product : item) })
    return product
  },
  async remove(id: string) {
    const inventory = read()
    const product = find(inventory.products, id)
    save({ ...inventory, products: inventory.products.filter(item => item.id !== product.id) })
  },
}
