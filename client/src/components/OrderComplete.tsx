import { useEffect } from 'react'
import type { PaidOrder } from 'contracts/order'
import { useSession } from '../providers/useSession'
import { Header } from './Header'

type OrderCompleteProps = {
  order: PaidOrder
}

export function OrderComplete({ order }: OrderCompleteProps) {
  const { resetSession } = useSession()

  useEffect(() => {
    const timeoutId = window.setTimeout(resetSession, 10_000)

    return () => window.clearTimeout(timeoutId)
  }, [resetSession])

  return (
    <main className="min-h-svh bg-ink px-6 py-7 text-paper sm:px-10 sm:py-8">
      <Header deviceId={order.deviceId} dark />
      <section className="mx-auto grid min-h-[calc(100svh-8rem)] w-full max-w-xl content-center border border-mint/40 p-8 sm:p-12">
        <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-yellow">Payment complete</p>
        <h1 className="mt-6 font-serif text-6xl font-normal leading-none tracking-[-0.05em] sm:text-8xl">You’re<br /><em className="text-coral">all set.</em></h1>
        <div className="mt-10 flex items-center justify-between border-t border-mint/30 pt-5 text-sm">
          <span>Transaction</span>
          <span className="font-mono text-mint">{order.payment.kind === 'success' ? order.payment.transactionId : 'Unavailable'}</span>
        </div>
      </section>
    </main>
  )
}
