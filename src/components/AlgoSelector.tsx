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

const graphAlgorithms: {
  id: AlgorithmType
  label: string
}[] = [
  { id: 'bfs', label: 'Breadth-First Search (BFS)' },
  { id: 'dfs', label: 'Depth-First Search (DFS)' },
  { id: 'dijkstra', label: "Dijkstra's Algorithm" },
  { id: 'astar', label: 'A* Search' },
  { id: 'bellman-ford', label: 'Bellman-Ford' },
]

export default function AlgoSelector({
  selectedAlgorithm,
  onAlgorithmChange,
  category = 'sorting',
}: AlgoSelectorProps) {
  const showSorting =
    category === 'sorting' || category === 'all'

  const showGraph =
    category === 'graph' || category === 'all'

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-lg">
      <label
        htmlFor="algorithm-select"
        className="mb-2 block select-none text-xs font-bold uppercase tracking-wider text-slate-500"
      >
        Select Algorithm
      </label>

      <div className="group relative">
        <select
          id="algorithm-select"
          value={selectedAlgorithm}
          onChange={(event) =>
            onAlgorithmChange(event.target.value as AlgorithmType)
          }
          className="theme-algorithm-select w-full cursor-pointer appearance-none rounded-xl border px-4 py-3 pr-10 text-sm font-semibold outline-none transition-all focus:border-amber-500 focus:ring-2 focus:ring-amber-500/30"
        >
          {showSorting && (
            <optgroup label="Sorting Algorithms">
              {sortingAlgorithms.map((algorithm) => (
                <option
                  key={algorithm.id}
                  value={algorithm.id}
                >
                  {algorithm.label}
                </option>
              ))}
            </optgroup>
          )}

          {showGraph && (
            <optgroup label="Graph Algorithms">
              {graphAlgorithms.map((algorithm) => (
                <option
                  key={algorithm.id}
                  value={algorithm.id}
                >
                  {algorithm.label}
                </option>
              ))}
            </optgroup>
          )}
        </select>

        <div className="theme-select-arrow pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4 transition-colors">
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2.5"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>
    </div>
  )
}