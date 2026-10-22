import type { PseudoCodePanelProps } from '../types'

export default function PseudoCodePanel({
  lines,
  activeLine,
}: PseudoCodePanelProps) {
  return (
    <div className="h-full rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-lg">
      <h3 className="mb-4 select-none text-xs font-bold uppercase tracking-wider text-slate-500">
        Pseudocode Execution Tracker
      </h3>

      <div className="space-y-1.5 font-mono text-xs sm:text-sm">
        {lines.map((line, index) => {
          const isActive = index === activeLine

          return (
            <div
              key={index}
              aria-current={isActive ? 'step' : undefined}
              className={`flex items-start rounded-lg border px-3 py-1.5 transition-all duration-150 ${
                isActive
                  ? 'theme-code-active scale-[1.01] border-amber-500 bg-amber-500 font-bold shadow-md shadow-amber-500/10'
                  : 'theme-code-inactive'
              }`}
            >
              <span
                className={`theme-code-number mr-4 w-6 shrink-0 select-none text-right text-xs font-semibold ${
                  isActive ? 'theme-code-number-active' : ''
                }`}
              >
                {index}
              </span>

              <span className="min-w-0 whitespace-pre-wrap break-words">
                {line}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}