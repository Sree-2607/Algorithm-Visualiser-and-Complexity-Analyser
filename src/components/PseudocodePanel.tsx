import type { PseudoCodePanelProps } from '../types'

export default function PseudoCodePanel({
  lines,
  activeLine,
}: PseudoCodePanelProps) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-lg h-full">
      <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-slate-500 select-none">
        Pseudocode Execution Tracker
      </h3>

      <div className="space-y-1.5 font-mono text-xs sm:text-sm">
        {lines.map((line, index) => {
          const isActive = index === activeLine

          return (
            <div
              key={index}
              className={`flex items-start rounded-lg px-3 py-1.5 transition-all duration-150 ${
                isActive
                  ? 'bg-amber-500 font-bold text-slate-950 shadow-md shadow-amber-500/10 scale-[1.01]'
                  : 'bg-slate-950/60 text-slate-400 border border-slate-900'
              }`}
            >
              {/* Line Number Gutter */}
              <span className={`w-6 shrink-0 text-right mr-4 select-none text-xs font-semibold ${
                isActive ? 'text-slate-800' : 'text-slate-600'
              }`}>
                {index}
              </span>

              {/* Code Line Body — whitespace-pre preserves your nested indentation tabs */}
              <span className="whitespace-pre break-all">
                {line}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
