type HeaderProps = {
  deviceId: string
  dark?: boolean
  onReset?: () => void
}

export function Header({ deviceId, dark = false, onReset }: HeaderProps) {
  return (
    <header className={`mx-auto flex w-full max-w-7xl items-center justify-between border-b pb-5 text-xs font-bold uppercase tracking-[0.08em] ${dark ? 'border-mint/30 text-mint' : 'border-line text-muted'}`}>
      <span className={dark ? 'text-yellow' : 'text-coral'}>SCO</span>
      <div className="flex items-center gap-4">
        <span className="flex items-center gap-2"><i className={`size-2 rounded-full ${dark ? 'bg-mint shadow-[0_0_0_4px_rgba(184,214,191,0.15)]' : 'bg-success shadow-[0_0_0_4px_rgba(93,156,108,0.15)]'}`} />Device {deviceId}</span>
        {onReset && <button type="button" onClick={onReset} className={`rounded-md border px-3 py-2 text-[10px] transition ${dark ? 'border-mint/40 hover:bg-mint/10' : 'border-line hover:bg-yellow/40'}`}>Reset</button>}
      </div>
    </header>
  )
}
