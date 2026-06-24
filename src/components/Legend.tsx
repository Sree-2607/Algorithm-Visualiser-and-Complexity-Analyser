import type { LegendItem } from '../types'

const legendItems: LegendItem[] = [
  {
    label: 'Default',
    className: 'bg-slate-600 shadow-sm shadow-slate-600/10',
  },
  {
    label: 'Comparing',
    className: 'bg-blue-500 shadow-sm shadow-blue-500/20',
  },
  {
    label: 'Swapping / Moving',
    className: 'bg-red-500 shadow-sm shadow-red-500/20',
  },
  {
    label: 'Pivot',
    className: 'bg-purple-500 shadow-sm shadow-purple-500/20',
  },
  {
    label: 'Sorted',
    className: 'bg-emerald-500 shadow-sm shadow-emerald-500/20',
  },
]

export default function Legend() {
  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-2 rounded-2xl border border-slate-800 bg-slate-900 px-5 py-3 text-xs font-medium uppercase tracking-wider text-slate-400 shadow-md">
      {legendItems.map((item) => (
        <div key={item.label} className="flex items-center gap-2 select-none">
          <span className={`h-3 w-3 shrink-0 rounded-full ${item.className}`} />
          <span className="text-slate-300 normal-case tracking-normal text-sm font-normal">
            {item.label}
          </span>
        </div>
      ))}
    </div>
  )
}