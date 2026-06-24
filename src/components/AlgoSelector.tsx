import type { AlgorithmType, AlgoSelectorProps } from '../types'

const sortingAlgorithms: {
  id: AlgorithmType
  label: string
}[] = [
  { id: 'bubbleSort', label: 'Bubble Sort' },
  { id: 'selectionSort', label: 'Selection Sort' },
  { id: 'insertionSort', label: 'Insertion Sort' },
  { id: 'mergeSort', label: 'Merge Sort' },
  { id: 'quickSort', label: 'Quick Sort' },
  { id: 'heapSort', label: 'Heap Sort' },
]

export default function AlgoSelector({
  selectedAlgorithm,
  onAlgorithmChange,
}: AlgoSelectorProps) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-lg">
      <label
        htmlFor="algorithm-select"
        className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500 select-none"
      >
        Select Algorithm
      </label>

      {/* Relative container to wrap our appearance-none select and custom chevron icon */}
      <div className="relative group">
        <select
          id="algorithm-select"
          value={selectedAlgorithm}
          onChange={(event) =>
            onAlgorithmChange(event.target.value as AlgorithmType)
          }
          className="w-full appearance-none rounded-xl border border-slate-700 bg-slate-950/80 px-4 py-3 pr-10 text-sm font-semibold text-slate-100 outline-none transition-all cursor-pointer focus:border-amber-500 focus:ring-1 focus:ring-amber-500 group-hover:border-slate-600"
        >
          {sortingAlgorithms.map((algorithm) => (
            <option 
              key={algorithm.id} 
              value={algorithm.id}
              className="bg-slate-950 text-slate-200 font-medium py-2"
            >
              {algorithm.label}
            </option>
          ))}
        </select>

        {/* Custom Chevron Indicator */}
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400 group-hover:text-slate-200 transition-colors">
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
  )
}