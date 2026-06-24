import type { InputSource, InputSourcePickerProps } from '../types'

const inputSources: {
  id: InputSource
  label: string
}[] = [
  { id: 'random', label: 'Random' },
  { id: 'sorted', label: 'Sorted' },
  { id: 'reverse', label: 'Reverse' },
  { id: 'nearlySorted', label: 'Nearly Sorted' },
  { id: 'fewUnique', label: 'Few Unique' },
  { id: 'custom', label: 'Custom' },
]

export default function InputSourcePicker({
  selectedInputSource,
  customInput,
  onInputSourceChange,
  onCustomInputChange,
  onGenerateInput,
}: InputSourcePickerProps) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-lg flex flex-col justify-between h-full">
      <div>
        <p className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-500 select-none">
          Data Input Configuration
        </p>

        {/* Dynamic Responsive Configuration Grid */}
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {inputSources.map((source) => {
            const isSelected = source.id === selectedInputSource

            return (
              <button
                key={source.id}
                type="button"
                onClick={() => onInputSourceChange(source.id)}
                className={`rounded-xl px-3 py-2.5 text-xs sm:text-sm font-semibold transition-all border active:scale-95 ${
                  isSelected
                    ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/10'
                    : 'bg-slate-950 border-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                {source.label}
              </button>
            )
          })}
        </div>

        {/* Custom Input Entry Gutter Field */}
        {selectedInputSource === 'custom' && (
          <div className="mt-3 animate-fadeIn">
            <input
              type="text"
              value={customInput}
              onChange={(event) => onCustomInputChange(event.target.value)}
              placeholder="Comma-separated values: 12, 45, 7, 23, 8"
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-2.5 text-sm font-mono font-medium text-slate-100 outline-none transition-colors placeholder:text-slate-600 focus:border-amber-500"
            />
            <p className="mt-1 text-[11px] text-slate-500 font-medium px-1">
              Enter numbers between 5 and 100 separated by commas.
            </p>
          </div>
        )}
      </div>

      {/* Primary Generation Execution Key */}
      <button
        type="button"
        onClick={onGenerateInput}
        className={`mt-4 w-full rounded-xl px-4 py-3 text-sm font-bold transition-all active:scale-95 border ${
          selectedInputSource === 'custom'
            ? 'bg-amber-500 text-slate-950 border-amber-400 font-black'
            : 'bg-slate-800 text-white border-slate-700 hover:bg-slate-700 hover:border-slate-600'
        }`}
      >
        {selectedInputSource === 'custom' ? '⚡ Parse & Apply Custom Array' : '🎲 Re-roll Dataset Pattern'}
      </button>
    </div>
  )
}