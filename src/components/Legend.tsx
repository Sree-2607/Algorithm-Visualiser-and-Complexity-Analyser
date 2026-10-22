import type { LegendItem } from '../types'

// 1. Define the supported legend categories
interface LegendProps {
  category?: 'sorting' | 'graph'
}

// 2. Existing sorting legend
const sortingLegendItems: LegendItem[] = [
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

// 3. Graph-specific visual states
const graphLegendItems: LegendItem[] = [
  {
    label: 'Unvisited',
    className: 'bg-slate-700 shadow-sm shadow-slate-700/20',
  },
  {
    label: 'Discovered / Queued',
    className: 'bg-violet-600 shadow-sm shadow-violet-600/20',
  },
  {
    label: 'Current / Visited',
    className: 'bg-blue-600 shadow-sm shadow-blue-600/20',
  },
  {
    label: 'Comparing / Relaxing Node',
    className: 'bg-amber-600 shadow-sm shadow-amber-600/20',
  },
  {
    label: 'Relaxed Edge / Path Update',
    className: 'bg-emerald-500 shadow-sm shadow-emerald-500/20',
  },
  {
    label: 'Finalized Node',
    className: 'bg-emerald-600 shadow-sm shadow-emerald-600/20',
  },
  {
    label: 'Negative Cycle',
    className: 'bg-red-600 shadow-sm shadow-red-600/20',
  },
]

// 4. Reusable Legend component
export default function Legend({
  category = 'sorting',
}: LegendProps) {

  // 5. Choose the correct legend configuration
  const legendItems =
    category === 'graph'
      ? graphLegendItems
      : sortingLegendItems

  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-3 rounded-2xl border border-slate-800 bg-slate-900 px-5 py-4 text-xs font-medium uppercase tracking-wider text-slate-400 shadow-md">

      {legendItems.map((item) => (
        <div
          key={item.label}
          className="flex items-center gap-2 select-none"
        >
          {/* Visual state colour */}
          <span
            className={`h-3 w-3 shrink-0 rounded-full ${item.className}`}
          />

          {/* Visual state description */}
          <span className="text-sm font-normal normal-case tracking-normal text-slate-300">
            {item.label}
          </span>
        </div>
      ))}

    </div>
  )
}