import type { StatsPanelProps } from '../types'

export default function StatsPanel({
  comparisons,
  swapsOrWrites,
  operationLabel,
  currentStepIndex,
  totalSteps,
  currentStepDescription,
}: StatsPanelProps) {
  // Guard counter values to display step 0 if the playback track hasn't generated metrics yet
  const displayStep = totalSteps === 0 ? 0 : currentStepIndex + 1

  return (
    <div className="grid gap-3 rounded-2xl border border-slate-800 bg-slate-900 p-4 text-slate-200 shadow-lg sm:grid-cols-2 md:grid-cols-3">
      
      {/* Comparisons Block */}
      <div className="rounded-xl bg-slate-950 p-4 border border-slate-800/40">
        <p className="text-xs font-bold uppercase tracking-wider text-slate-500 select-none">
          Comparisons
        </p>
        <p className="mt-1 font-mono text-2xl font-bold text-blue-400">
          {comparisons}
        </p>
      </div>

      {/* Dynamic Operation Block (Swaps / Shifts / Overwrites) */}
      <div className="rounded-xl bg-slate-950 p-4 border border-slate-800/40">
        <p className="text-xs font-bold uppercase tracking-wider text-slate-500 select-none">
          {operationLabel}
        </p>
        <p className="mt-1 font-mono text-2xl font-bold text-red-400">
          {swapsOrWrites}
        </p>
      </div>

      {/* Timeline Iteration Progress */}
      <div className="rounded-xl bg-slate-950 p-4 border border-slate-800/40 sm:col-span-2 md:col-span-1">
        <p className="text-xs font-bold uppercase tracking-wider text-slate-500 select-none">
          Progress
        </p>
        <p className="mt-1 font-mono text-2xl font-bold text-amber-400">
          {displayStep} <span className="text-sm font-normal text-slate-600">/</span> {totalSteps}
        </p>
      </div>

      {/* Real-time Narrative Terminal */}
      <div className="rounded-xl bg-slate-950 p-4 border border-slate-800/40 sm:col-span-2 md:col-span-3">
        <p className="text-xs font-bold uppercase tracking-wider text-slate-500 select-none">
          Current Step Log
        </p>
        <p className="mt-2 text-sm font-medium text-slate-300 min-h-[1.25rem] leading-relaxed">
          {currentStepDescription || 'Click Play or Next to begin visualization.'}
        </p>
      </div>

    </div>
  )
}
