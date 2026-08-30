type HeaderProps = {
  deviceId: string
  dark?: boolean
}

export function Header({ deviceId, dark = false }: HeaderProps) {
  return (
    <header className={`mx-auto flex w-full max-w-7xl items-center justify-between border-b pb-5 text-xs font-bold uppercase tracking-[0.08em] ${dark ? 'border-mint/30 text-mint' : 'border-line text-muted'}`}>
      <span className={dark ? 'text-yellow' : 'text-coral'}>SCO</span>
      <span className="flex items-center gap-2"><i className={`size-2 rounded-full ${dark ? 'bg-mint shadow-[0_0_0_4px_rgba(184,214,191,0.15)]' : 'bg-success shadow-[0_0_0_4px_rgba(93,156,108,0.15)]'}`} />Device {deviceId}</span>
    </header>
  )
}
