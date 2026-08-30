import type { OpenOrder as OpenOrderData } from 'contracts/order'
import { useSession } from '../providers/SessionProvider'
import { CheckoutPopover } from './CheckoutPopover'

type OpenOrderProps = {
  order: OpenOrderData
}

export function OpenOrder({ order }: OpenOrderProps) {
  const { isLoading, error, paymentStatus, updateItemQuantity, checkout, dismissPayment } = useSession()
  const isCheckoutOpen = paymentStatus !== 'idle'

  async function handleCheckout() {
    await checkout()
  }

  return (
    <>
    <aside className="flex min-h-full min-w-0 flex-col rounded-2xl border border-ink bg-transparent p-5 lg:sticky lg:top-6">
      <div className="flex items-baseline justify-between border-b border-ink/20 pb-4">
        <h2 className="font-serif text-3xl font-normal">Your order</h2>
        <span className="text-xs font-bold uppercase tracking-[0.1em]">{order.items.length} items</span>
      </div>
      <div className="flex-1 divide-y divide-ink/20 overflow-y-auto">
        {order.items.length === 0 && <p className="py-8 text-sm text-muted-dark">Your order is waiting for a good idea.</p>}
        {order.items.map((item) => (
          <div key={item.id} className="flex items-center justify-between gap-3 py-4">
            <div className="min-w-0">
              <p className="truncate font-semibold">{item.product.name}</p>
              <p className="font-mono text-sm text-muted-dark">${item.product.price.amount}</p>
            </div>
            <div className="flex items-center gap-2">
              <button type="button" aria-label={`Remove one ${item.product.name}`} onClick={() => void updateItemQuantity(item.id, Math.max(0, item.quantity - 1))} disabled={isLoading} className="grid size-8 place-items-center border border-ink text-lg leading-none hover:bg-paper">−</button>
              <span className="w-5 text-center text-sm font-bold">{item.quantity}</span>
              <button type="button" aria-label={`Add one ${item.product.name}`} onClick={() => void updateItemQuantity(item.id, item.quantity + 1)} disabled={isLoading} className="grid size-8 place-items-center border border-ink text-lg leading-none hover:bg-paper">+</button>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-3 flex items-center justify-between border-t border-ink/30 pt-4 font-bold">
        <span>Total</span><span className="font-mono">${order.totalPrice.amount}</span>
      </div>
      <button type="button" onClick={() => void handleCheckout()} disabled={isLoading || order.items.length === 0} className="mt-5 w-full bg-ink px-4 py-4 text-sm font-bold text-paper transition hover:bg-coral disabled:cursor-not-allowed disabled:opacity-50">
        Proceed to payment <span aria-hidden="true">↗</span>
      </button>
      {error && <p className="mt-3 text-sm text-danger" role="alert">{error}</p>}
    </aside>
    {isCheckoutOpen && <CheckoutPopover isLoading={isLoading} paymentStatus={paymentStatus} error={error} onClose={dismissPayment} />}
    </>
  )
}
