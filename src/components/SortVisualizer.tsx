import type { BarState, SortVisualizerProps } from '../types'

function getBarColorClass(state: BarState): string {
  switch (state) {
    case 'comparing':
      return 'bg-blue-500 shadow-md shadow-blue-500/20'

    case 'swapping':
      return 'bg-red-500 shadow-md shadow-red-500/20'

    case 'sorted':
      return 'bg-emerald-500 shadow-md shadow-emerald-500/20'

    case 'pivot':
      return 'bg-purple-500 shadow-md shadow-purple-500/20'

    default:
      return 'bg-slate-600'
  }
}

export default function SortVisualizer({ bars }: SortVisualizerProps) {
  const maxValue = bars.length > 0 ? Math.max(...bars.map((bar) => bar.value)) : 1

  return (
    <div className="flex h-80 w-full items-end gap-1 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-inner sm:gap-2">
      {bars.map((bar, index) => {
        const heightPercentage = (bar.value / maxValue) * 100

        return (
          <div
            key={index}
            style={{ height: `${heightPercentage}%` }}
            className={`flex-1 rounded-t-md transition-all duration-150 ${getBarColorClass(
              bar.state
            )}`}
          />
        )
      })}
    </div>
  )
}
