type CheckoutPopoverProps = {
  isLoading: boolean
  paymentStatus: 'idle' | 'pending' | 'success' | 'error'
  error: string | null
  onClose: () => void
}

export function CheckoutPopover({ isLoading, paymentStatus, error, onClose }: CheckoutPopoverProps) {
  return (
    <div className="fixed inset-0 z-20 grid place-items-center bg-ink/70 p-5" role="presentation">
      <section role="dialog" aria-modal="true" aria-labelledby="payment-title" className="w-full max-w-md border border-ink bg-paper p-7 text-center shadow-2xl sm:p-10">
        <div className="mx-auto grid size-16 place-items-center rounded-full border border-ink bg-yellow text-3xl" aria-hidden="true">$</div>
        {paymentStatus === 'success' ? (
          <>
            <div className="mt-7 h-2 w-full bg-success" role="status" aria-label="Payment approved" />
            <p className="mt-5 text-xs font-extrabold uppercase tracking-[0.14em] text-success">Payment approved</p>
            <h2 id="payment-title" className="mt-3 font-serif text-4xl font-normal leading-none">Thank you.</h2>
          </>
        ) : paymentStatus === 'error' ? (
          <>
            <p className="mt-7 text-xs font-extrabold uppercase tracking-[0.14em] text-danger">Payment could not be completed</p>
            <h2 id="payment-title" className="mt-3 font-serif text-4xl font-normal leading-none">Please try again.</h2>
          </>
        ) : (
          <>
            <p className="mt-7 text-xs font-extrabold uppercase tracking-[0.14em] text-coral">Payment in progress</p>
            <h2 id="payment-title" className="mt-3 font-serif text-4xl font-normal leading-none">Please proceed on the payment terminal.</h2>
            <p className="mt-4 text-sm leading-6 text-muted">We are waiting for your payment to complete.</p>
            {isLoading && <div className="mx-auto mt-7 h-1 w-32 overflow-hidden bg-line"><div className="h-full w-1/2 animate-pulse bg-coral" /></div>}
          </>
        )}
        {error && <p className="mt-6 text-sm text-danger" role="alert">{error}</p>}
        {!isLoading && <button type="button" onClick={onClose} className="mt-7 border border-ink px-5 py-3 text-sm font-bold hover:bg-yellow">Close</button>}
      </section>
    </div>
  )
}
