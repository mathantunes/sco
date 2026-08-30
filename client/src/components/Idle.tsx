import { useSession } from '../providers/SessionProvider'
import { Header } from './Header'
import { Logo } from './Logo'

type IdleProps = {
  deviceId: string
}

export function Idle({ deviceId }: IdleProps) {
  const { isLoading, error, startSession } = useSession()

  return (
    <main className="min-h-svh bg-paper px-5 py-4 text-ink sm:px-8 lg:px-12">
      <Header deviceId={deviceId} />

      <section className="mx-auto flex min-h-[calc(100svh-130px)] w-full max-w-2xl flex-col items-center justify-center gap-10 py-12 sm:gap-12 sm:py-16">
        <Logo />

        <div className="w-full max-w-xl text-center">
          <p className="mb-5 text-xs font-extrabold uppercase tracking-[0.14em] text-coral">Self-service checkout</p>
          <h1 className="font-serif text-[clamp(3rem,7vw,5.375rem)] font-normal leading-[0.92] tracking-[-0.055em]">Good snacks.<br /><em className="text-coral">No waiting.</em></h1>
          <p className="mx-auto my-7 max-w-sm text-[17px] leading-6 text-muted">Tap below to browse the menu and build your order.</p>
          <button type="button" onClick={() => void startSession()} disabled={isLoading} className="relative inline-flex w-full max-w-xl items-center justify-center border border-ink bg-ink px-6 py-5 text-base font-bold text-paper transition hover:-translate-y-1 hover:bg-coral focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-yellow disabled:cursor-wait disabled:opacity-60">
            {isLoading ? 'Opening session...' : 'Start shopping'}
            <span aria-hidden="true" className="absolute right-5 text-2xl leading-3 text-yellow">↗</span>
          </button>
          {error && <p className="mt-4 text-sm text-danger" role="alert">{error}</p>}
        </div>
      </section>

      <footer className="flex items-center gap-4 border-t border-line pt-5 text-[10px] font-bold uppercase tracking-[0.08em] text-muted sm:text-xs">
        <span>Fresh from the shelf</span><span className="h-px w-10 bg-coral" /><span>Ready when you are</span>
      </footer>
    </main>
  )
}
