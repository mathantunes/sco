type CategoryProps = {
  name: string
  isSelected: boolean
  onSelect: () => void
}

export function Category({ name, isSelected, onSelect }: CategoryProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`w-full rounded-lg px-4 py-3 text-left text-sm font-bold transition ${isSelected ? 'bg-ink text-paper shadow-sm' : 'text-muted hover:bg-yellow/50 hover:text-ink'}`}
    >
      {name}
    </button>
  )
}
