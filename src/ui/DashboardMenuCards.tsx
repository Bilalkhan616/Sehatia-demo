type DashboardMenuItem = {
  icon: React.ReactNode
  title: string
  onClick: () => void
}

type Props = {
  title: string
  items: DashboardMenuItem[]
}

export function DashboardMenuCards({ title, items }: Props) {
  return (
    <>
      <h3 className="mb-2 text-sm font-extrabold text-ink">{title}</h3>
      <div className="grid grid-cols-2 gap-3">
        {items.map((item) => (
          <button
            key={item.title}
            type="button"
            onClick={item.onClick}
            className="flex flex-col items-center gap-2 rounded-3xl border border-white/70 bg-white/95 px-3 py-4 shadow-[0_8px_28px_rgba(22,58,58,0.08)] transition hover:shadow-[0_10px_32px_rgba(22,58,58,0.12)] active:scale-[0.99]"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-mist text-seafoam">
              {item.icon}
            </span>
            <span className="text-center text-sm font-bold text-ink">{item.title}</span>
          </button>
        ))}
      </div>
    </>
  )
}
