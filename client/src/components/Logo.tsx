export function Logo() {
  return (
    <div className="grid size-[min(60vw,300px)] shrink-0 place-items-center rounded-full border border-ink bg-[repeating-conic-gradient(from_4deg,var(--color-yellow)_0deg_13deg,transparent_13deg_25deg)] sm:size-[min(38vw,320px)]" aria-label="Snack Bar">
      <div className="grid size-[70%] place-items-center rounded-full border border-ink bg-coral">
        <span className="font-serif text-[clamp(2rem,4vw,3rem)] font-bold leading-[0.82] tracking-[0.04em] text-paper">SNACK<br />BAR</span>
      </div>
    </div>
  )
}
