type GraphInputSource = 'default' | 'random' | 'custom'
interface GraphInputPickerProps {
  selectedSource: GraphInputSource
  customInput: string
  onSourceChange: (source: GraphInputSource) => void
  onCustomInputChange: (value: string) => void
  onApply: () => void
}

const sources: {
  id: GraphInputSource
  label: string
}[] = [
  { id: 'default', label: 'Default Graph' },
  { id: 'random', label: 'Random Graph' },
  { id: 'custom', label: 'Custom Graph' },
]

export type { GraphInputSource }

export default function GraphInputPicker({
  selectedSource,
  customInput,
  onSourceChange,
  onCustomInputChange,
  onApply,
}: GraphInputPickerProps) {
  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-lg">

      <h2 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-500">
        Graph Input Configuration
      </h2>

      {/* Graph input modes */}
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
        {sources.map((source) => {
          const isSelected = selectedSource === source.id

          return (
            <button
              key={source.id}
              type="button"
              onClick={() => onSourceChange(source.id)}
              aria-pressed={isSelected}
              className={`rounded-xl border px-3 py-2.5 text-sm font-semibold transition-all ${
                isSelected
                  ? 'border-amber-400 bg-amber-500 text-slate-950'
                  : 'border-slate-900 bg-slate-950 text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              {source.label}
            </button>
          )
        })}
      </div>

      {/* Custom edge editor */}
      {selectedSource === 'custom' && (
        <div className="mt-4">
          <label
            htmlFor="custom-graph-input"
            className="mb-2 block text-xs font-semibold text-slate-400"
          >
            Graph edges
          </label>

          <input
            id="custom-graph-input"
            type="text"
            value={customInput}
            onChange={(event) =>
              onCustomInputChange(event.target.value)
            }
            placeholder="A-B:4, B-C:-3, C-D:2"
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 font-mono text-sm text-white outline-none placeholder:text-slate-600 focus:border-amber-500"
          />

          <p className="mt-2 text-xs leading-relaxed text-slate-400">
            Format: A-B:4, B-C:-3, C-D:2.
            The weight is optional (defaults to 1).
            Negative and zero weights are allowed.
          </p>

          <p className="mt-1 text-xs text-slate-500">
            Undirected graphs; 2–12 nodes.
          </p>
        </div>
      )}

      <button
        type="button"
        onClick={onApply}
        className={`mt-4 w-full rounded-xl border px-4 py-3 text-sm font-bold transition-colors ${
          selectedSource === 'custom'
            ? 'border-amber-400 bg-amber-500 text-slate-950 hover:bg-amber-400'
            : 'border-slate-700 bg-slate-800 text-white hover:bg-slate-700'
        }`}
      >
        {selectedSource === 'default'
          ? '↺ Load Default Graph'
          : selectedSource === 'random'
            ? '🎲 Generate Random Graph'
            : '⚡ Parse & Apply Custom Graph'}
      </button>

    </section>
  )
}