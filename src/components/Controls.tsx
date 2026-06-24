import type { ControlsProps } from '../types'

export default function Controls({
  isPlaying,
  speed,
  onPlay,
  onPause,
  onReset,
  onStepForward,
  onStepBackward,
  onSpeedChange,
}: ControlsProps) {
  return (
    <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-slate-800 bg-slate-900 p-4 shadow-lg">
      <button
        type="button"
        onClick={onReset}
        disabled={isPlaying}
        className="rounded-lg bg-slate-800 px-3 py-2 text-sm font-medium text-white transition-all hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-slate-800 active:scale-95"
      >
        ↺ Reset
      </button>

      <button
        type="button"
        onClick={onStepBackward}
        disabled={isPlaying}
        className="rounded-lg bg-slate-800 px-3 py-2 text-sm font-medium text-white transition-all hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-slate-800 active:scale-95"
      >
        ⏮ Back
      </button>

      <button
        type="button"
        onClick={isPlaying ? onPause : onPlay}
        className={`rounded-lg px-5 py-2 text-sm font-semibold transition-all active:scale-95 ${
          isPlaying
            ? 'bg-slate-200 text-slate-900 hover:bg-white'
            : 'bg-amber-500 text-slate-950 hover:bg-amber-400'
        }`}
      >
        {isPlaying ? '⏸ Pause' : '▶ Play'}
      </button>

      <button
        type="button"
        onClick={onStepForward}
        disabled={isPlaying}
        className="rounded-lg bg-slate-800 px-3 py-2 text-sm font-medium text-white transition-all hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-slate-800 active:scale-95"
      >
        ⏭ Next
      </button>

      <div className="ml-auto flex items-center gap-3 rounded-xl border border-slate-800/60 bg-slate-950 px-4 py-1.5">
        <label className="select-none text-xs font-bold uppercase tracking-wider text-slate-400">
          Speed
        </label>

        <input
          type="range"
          min="100"
          max="1000"
          step="100"
          value={speed}
          onChange={(event) => onSpeedChange(Number(event.target.value))}
          className="h-1.5 w-32 cursor-pointer appearance-none rounded-lg bg-slate-800 accent-amber-500 sm:w-40"
        />

        <span className="w-14 text-right font-mono text-xs font-bold text-amber-400">
          {speed}ms
        </span>
      </div>
    </div>
  )
}
