import type { MenuCategory } from 'contracts/menu'

type CategoryPopoverProps = {
  category: MenuCategory
  isLoading: boolean
  onAddProduct: (productId: string) => void
  onClose: () => void
}

export function CategoryPopover({ category, isLoading, onAddProduct, onClose }: CategoryPopoverProps) {
  return (
    <div className="fixed inset-0 z-10 grid place-items-center bg-ink/60 p-5" role="presentation" onMouseDown={onClose}>
      <section role="dialog" aria-modal="true" aria-labelledby="category-title" onMouseDown={(event) => event.stopPropagation()} className="max-h-[min(80svh,40rem)] w-full max-w-lg overflow-y-auto border border-ink bg-paper p-6 shadow-2xl sm:p-8">
        <header className="flex items-start justify-between gap-5 border-b border-line pb-5">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-coral">Category</p>
            <h2 id="category-title" className="mt-2 font-serif text-4xl font-normal">{category.name}</h2>
          </div>
          <button type="button" aria-label="Close category" onClick={onClose} className="grid size-9 place-items-center border border-ink text-xl leading-none hover:bg-yellow">×</button>
        </header>
        <div className="mt-5 divide-y divide-line">
          {category.items.map(({ product }) => (
            <div key={product.id} className="flex items-center justify-between gap-5 py-4">
              <div className="flex min-w-0 items-center gap-4">
                <img src={product.imageUrl} alt="" className="size-16 shrink-0 rounded-lg border border-[#d8d6c9] bg-white/50 object-cover" />
                <div className="min-w-0">
                <p className="font-semibold">{product.name}</p>
                <p className="mt-1 font-mono text-sm text-muted">${product.price.amount}</p>
                </div>
              </div>
              <button type="button" onClick={() => onAddProduct(product.id)} disabled={isLoading} className="shrink-0 border border-ink px-4 py-3 text-sm font-bold hover:bg-yellow disabled:cursor-wait disabled:opacity-50">Add <span aria-hidden="true">+</span></button>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
