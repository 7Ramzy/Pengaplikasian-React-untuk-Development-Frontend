import { Link, NavLink, Outlet, useNavigation } from 'react-router'

export function PageLayout() {
  const navigation = useNavigation()
  return (
    <>
      <header className="border-b border-white/15 bg-teal-950 text-white">
        <nav aria-label="Navigasi utama" className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-5 py-4 sm:px-8">
          <Link to="/" className="text-xl font-bold tracking-tight focus-visible:outline-white">Inventori Produk</Link>
          <NavLink to="/products" className={({ isActive }) =>
            'rounded-lg px-3 py-2 text-sm font-medium focus-visible:outline-white ' + (isActive ? 'bg-white/15' : 'hover:bg-white/10')
          }>Daftar produk</NavLink>
        </nav>
      </header>
      <main className="mx-auto max-w-6xl px-5 py-9 sm:px-8 sm:py-14">
        {navigation.state === 'loading' && <p role="status" className="mb-3 text-sm text-stone-600">Memuat halaman…</p>}
        <Outlet />
      </main>
    </>
  )
}
