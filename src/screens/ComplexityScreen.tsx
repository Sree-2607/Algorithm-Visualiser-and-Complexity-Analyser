import { useMemo, useState } from 'react'
import {
  runAllBenchmarks,
  sortingBenchmarkAlgorithms,
  type BenchmarkCategory,
  type BenchmarkPoint,
} from '../algorithms/benchmark/benchmarkSuite'
import { graphAlgorithms } from '../algorithms/graph'

type ChartMode = 'real' | 'theoretical'

type AlgorithmOption = {
  id: string
  name: string
}

type ChartPoint = {
  size: number
  value: number
  edgeCount?: number
}

const COLORS = [
  '#38bdf8',
  '#f59e0b',
  '#34d399',
  '#a78bfa',
  '#fb7185',
  '#facc15',
]

const sortingOptions: AlgorithmOption[] =
  sortingBenchmarkAlgorithms.map((algorithm) => ({
    id: algorithm.info.id,
    name: algorithm.info.name,
  }))

const graphOptions: AlgorithmOption[] = [
  graphAlgorithms.bfs,
  graphAlgorithms.dfs,
  graphAlgorithms.dijkstra,
  graphAlgorithms.astar,
  graphAlgorithms['bellman-ford'],
]
  .filter((algorithm) => Boolean(algorithm))
  .map((algorithm) => ({
    id: algorithm.info.id,
    name: algorithm.info.name,
  }))

const formatNumber = (value: number) =>
  Math.round(value).toLocaleString()

function theoreticalValue(
  category: BenchmarkCategory,
  algorithmId: string,
  size: number,
  edgeCount: number
): number {
  const n = Math.max(size, 2)

  if (category === 'sorting') {
    switch (algorithmId) {
      case 'bubble':
      case 'bubbleSort':
      case 'selection':
      case 'selectionSort':
      case 'insertion':
      case 'insertionSort':
        return n * n

      case 'merge':
      case 'mergeSort':
      case 'heap':
      case 'heapSort':
        return n * Math.log2(n)

      case 'quick':
      case 'quickSort':
        return n * Math.log2(n)

      default:
        return n * Math.log2(n)
    }
  }

  switch (algorithmId) {
    case 'bfs':
    case 'dfs':
      return n + edgeCount

    case 'dijkstra':
    case 'astar':
      return n * n + edgeCount

    case 'bellman-ford':
    case 'bellmanFord':
      return n * edgeCount

    default:
      return n + edgeCount
  }
}

function theoreticalLabel(
  category: BenchmarkCategory,
  algorithmId: string
): string {
  if (category === 'graph') {
    if (
      algorithmId === 'bfs' ||
      algorithmId === 'dfs'
    ) {
      return 'O(V + E)'
    }

    if (algorithmId === 'bellman-ford') {
      return 'O(VE)'
    }

    return 'O(V² + E)'
  }

  if (
    algorithmId === 'bubble' ||
    algorithmId === 'bubbleSort' ||
    algorithmId === 'selection' ||
    algorithmId === 'selectionSort' ||
    algorithmId === 'insertion' ||
    algorithmId === 'insertionSort'
  ) {
    return 'O(N²)'
  }

  if (
    algorithmId === 'quick' ||
    algorithmId === 'quickSort'
  ) {
    return 'O(N log N) average'
  }

  return 'O(N log N)'
}

export default function ComplexityScreen() {
  const [category, setCategory] =
    useState<BenchmarkCategory>('sorting')

  const [chartMode, setChartMode] =
    useState<ChartMode>('real')

  const [selectedIds, setSelectedIds] = useState<string[]>(
    sortingOptions.slice(0, 3).map((option) => option.id)
  )

  const [results, setResults] =
    useState<BenchmarkPoint[]>([])

  const [hasRun, setHasRun] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [running, setRunning] = useState(false)

  const options =
    category === 'sorting' ? sortingOptions : graphOptions

  const selectedOptions = options.filter((option) =>
    selectedIds.includes(option.id)
  )

  const changeCategory = (next: BenchmarkCategory) => {
    setCategory(next)

    const nextOptions =
      next === 'sorting' ? sortingOptions : graphOptions

    setSelectedIds(
      nextOptions.slice(0, 3).map((option) => option.id)
    )
  }

  const toggleAlgorithm = (id: string) => {
    setSelectedIds((previous) =>
      previous.includes(id)
        ? previous.filter((value) => value !== id)
        : [...previous, id]
    )
  }

  const runBenchmarks = () => {
    setRunning(true)
    setError(null)

    try {
      const benchmarkResults = runAllBenchmarks()

      setResults(benchmarkResults)
      setHasRun(true)

      const unexpected = benchmarkResults.filter(
        (result) => result.outcome !== 'completed'
      )

      if (unexpected.length > 0) {
        console.warn('Benchmark outcomes:', unexpected)
      }
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : 'Benchmark execution failed.'
      )
    } finally {
      setRunning(false)
    }
  }

  const filteredResults = useMemo(
    () =>
      results.filter(
        (result) =>
          result.category === category &&
          selectedIds.includes(result.algorithmId)
      ),
    [results, category, selectedIds]
  )

  const series = useMemo(
    () =>
      selectedOptions.map((option, index) => {
        const points: ChartPoint[] = filteredResults
          .filter(
            (result) => result.algorithmId === option.id
          )
          .sort((a, b) => a.inputSize - b.inputSize)
          .map((result) => ({
            size: result.inputSize,
            edgeCount: result.edgeCount,
            value:
              chartMode === 'real'
                ? result.operations
                : theoreticalValue(
                    category,
                    option.id,
                    result.inputSize,
                    result.edgeCount ?? 0
                  ),
          }))

        return {
          id: option.id,
          name: option.name,
          color: COLORS[index % COLORS.length],
          points,
        }
      }),
    [selectedOptions, filteredResults, chartMode, category]
  )

  const allPoints = series.flatMap((item) => item.points)

  const sizes = [
    ...new Set(allPoints.map((point) => point.size)),
  ].sort((a, b) => a - b)

  const maxValue = Math.max(
    1,
    ...allPoints.map((point) => point.value)
  )

  const chartWidth = 920
  const chartHeight = 350

  const left = 82
  const right = 28
  const top = 25
  const bottom = 65

  const plotWidth = chartWidth - left - right
  const plotHeight = chartHeight - top - bottom

  const xPosition = (size: number) => {
    const index = sizes.indexOf(size)

    return (
      left +
      (sizes.length <= 1
        ? plotWidth / 2
        : (index / (sizes.length - 1)) * plotWidth)
    )
  }

  const yPosition = (value: number) =>
    top + plotHeight - (value / maxValue) * plotHeight

  const totalAvailable =
    results.filter((result) => result.category === category)
      .length

  return (
    <section className="mx-auto max-w-7xl space-y-6 px-6 py-8 text-slate-100">
      <header className="space-y-2">
        <h2 className="text-2xl font-bold">
          Complexity Analyzer
        </h2>

        <p className="text-sm text-slate-400">
          Compare theoretical growth with recorded operations
          from the actual algorithm engines.
        </p>
      </header>

      {/* Category and execution controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-700 bg-slate-900 p-5">
        <div className="flex gap-2">
          {(['sorting', 'graph'] as const).map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => changeCategory(value)}
              aria-pressed={category === value}
              className={`rounded-lg px-4 py-2 text-sm font-semibold ${
                category === value
                  ? 'bg-amber-500 text-slate-950'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {value === 'sorting' ? 'Sorting' : 'Graph'}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={runBenchmarks}
          disabled={running}
          className="rounded-lg bg-emerald-500 px-5 py-2 font-semibold text-slate-950 hover:bg-emerald-400 disabled:opacity-50"
        >
          {running ? 'Running...' : 'Run All Benchmarks'}
        </button>
      </div>

      {/* Algorithm multi-select */}
      <div className="space-y-4 rounded-xl border border-slate-700 bg-slate-900 p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="font-semibold">Select Algorithms</h3>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() =>
                setSelectedIds(options.map((item) => item.id))
              }
              className="text-sm text-sky-400 hover:text-sky-300"
            >
              Select All
            </button>

            <button
              type="button"
              onClick={() => setSelectedIds([])}
              className="text-sm text-slate-400 hover:text-white"
            >
              Clear
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          {options.map((option) => {
            const selected = selectedIds.includes(option.id)

            return (
              <button
                key={option.id}
                type="button"
                aria-pressed={selected}
                onClick={() => toggleAlgorithm(option.id)}
                className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                  selected
                    ? 'border-amber-400 bg-amber-500/15 text-amber-300'
                    : 'border-slate-700 bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {selected ? '✓ ' : '+ '}
                {option.name}
              </button>
            )
          })}
        </div>
      </div>

      {/* Chart */}
      <div className="space-y-5 rounded-xl border border-slate-700 bg-slate-900 p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold">
              Complexity Growth
            </h3>

            <p className="text-xs text-slate-400">
              {chartMode === 'real'
                ? 'Recorded instrumented operations'
                : 'Theoretical relative growth (unscaled)'}
            </p>
          </div>

          <div className="flex rounded-lg bg-slate-800 p-1">
            {([
              ['real', 'Real Run'],
              ['theoretical', 'Theoretical'],
            ] as const).map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => setChartMode(value)}
                aria-pressed={chartMode === value}
                className={`rounded-md px-4 py-2 text-sm font-semibold ${
                  chartMode === value
                    ? 'bg-amber-500 text-slate-950'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {hasRun && selectedOptions.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <svg
                viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                className="min-w-[650px] w-full"
                role="img"
                aria-label="Complexity growth line chart comparing selected algorithms"
              >
                {/* Horizontal grid and y-axis labels */}
                {Array.from({ length: 5 }, (_, index) => {
                  const value = (maxValue * index) / 4
                  const y = yPosition(value)

                  return (
                    <g key={index}>
                      <line
                        x1={left}
                        x2={chartWidth - right}
                        y1={y}
                        y2={y}
                        stroke="#334155"
                        strokeDasharray="4 5"
                      />

                      <text
                        x={left - 12}
                        y={y + 4}
                        fill="#94a3b8"
                        fontSize="12"
                        textAnchor="end"
                      >
                        {formatNumber(value)}
                      </text>
                    </g>
                  )
                })}

                {/* Input-size labels */}
                {sizes.map((size) => (
                  <text
                    key={size}
                    x={xPosition(size)}
                    y={top + plotHeight + 25}
                    fill="#cbd5e1"
                    fontSize="13"
                    textAnchor="middle"
                  >
                    {size}
                  </text>
                ))}

                {/* Axis labels */}
                <text
                  x={left + plotWidth / 2}
                  y={chartHeight - 12}
                  fill="#94a3b8"
                  fontSize="13"
                  textAnchor="middle"
                >
                  {category === 'sorting'
                    ? 'Input size (N)'
                    : 'Vertices (V)'}
                </text>

                <text
                  x="16"
                  y="14"
                  fill="#94a3b8"
                  fontSize="11"
                >
                  {chartMode === 'real'
                    ? 'Operations'
                    : 'Growth units'}
                </text>

                {/* Algorithm curves */}
                {series.map((item) => {
                  const coordinates = item.points
                    .map(
                      (point) =>
                        `${xPosition(point.size)},${yPosition(point.value)}`
                    )
                    .join(' ')

                  return (
                    <g key={item.id}>
                      <polyline
                        points={coordinates}
                        fill="none"
                        stroke={item.color}
                        strokeWidth="3"
                        strokeLinejoin="round"
                        strokeLinecap="round"
                      />

                      {item.points.map((point) => (
                        <circle
                          key={point.size}
                          cx={xPosition(point.size)}
                          cy={yPosition(point.value)}
                          r="6"
                          fill={item.color}
                          stroke="#0f172a"
                          strokeWidth="2"
                        >
                          <title>
                            {`${item.name} | Size: ${point.size} | Value: ${formatNumber(point.value)}`}
                          </title>
                        </circle>
                      ))}
                    </g>
                  )
                })}
              </svg>
            </div>

            <div className="flex flex-wrap gap-4">
              {series.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-2 text-sm text-slate-300"
                >
                  <span
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  {item.name}
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="flex min-h-64 items-center justify-center rounded-lg border border-dashed border-slate-700 text-center text-sm text-slate-400">
            {!hasRun
              ? 'Click Run All Benchmarks to generate chart data.'
              : 'Select at least one algorithm to display its curve.'}
          </div>
        )}

        {chartMode === 'theoretical' && (
          <p className="text-xs leading-relaxed text-slate-400">
            Theoretical values represent growth functions,
            not measured execution time or exact operation counts.
            Constants and lower-order terms are omitted.
            Sorting curves use typical/average-case growth
            for Quick Sort and Insertion Sort, and worst-case
            reference growth for the other sorting algorithms.
          </p>
        )}

        {category === 'graph' && (
          <p className="text-xs leading-relaxed text-slate-400">
            Graph complexity depends on both vertices (V)
            and edges (E). Edge counts for each input size
            are shown in the table below. Benchmark graphs
            are connected, undirected, and positively weighted.
          </p>
        )}
      </div>

      {/* Data table */}
      <div className="overflow-hidden rounded-xl border border-slate-700 bg-slate-900">
        <div className="flex flex-wrap items-center justify-between gap-2 p-5">
          <h3 className="font-semibold">
            Benchmark Results
          </h3>

          <span className="text-xs text-slate-400">
            {filteredResults.length} displayed / {totalAvailable} available
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-800 text-slate-300">
              <tr>
                <th className="px-4 py-3">Algorithm</th>
                <th className="px-4 py-3">Size</th>
                {category === 'graph' && (
                  <th className="px-4 py-3">Edges</th>
                )}
                <th className="px-4 py-3">Comparisons</th>
                <th className="px-4 py-3">Operations</th>
                <th className="px-4 py-3">Steps</th>
                <th className="px-4 py-3">Complexity</th>
                <th className="px-4 py-3">Outcome</th>
              </tr>
            </thead>

            <tbody>
              {filteredResults.map((result) => (
                <tr
                  key={`${result.algorithmId}-${result.inputSize}`}
                  className="border-t border-slate-800 text-slate-300"
                >
                  <td className="px-4 py-3 font-medium text-white">
                    {result.algorithmName}
                  </td>
                  <td className="px-4 py-3">
                    {result.inputSize}
                  </td>
                  {category === 'graph' && (
                    <td className="px-4 py-3">
                      {result.edgeCount ?? '—'}
                    </td>
                  )}
                  <td className="px-4 py-3">
                    {formatNumber(result.comparisons)}
                  </td>
                  <td className="px-4 py-3 font-semibold text-amber-300">
                    {formatNumber(result.operations)}
                  </td>
                  <td className="px-4 py-3">
                    {formatNumber(result.steps)}
                  </td>
                  <td className="px-4 py-3">
                    {theoreticalLabel(
                      result.category,
                      result.algorithmId
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={
                        result.outcome === 'completed'
                          ? 'text-emerald-400'
                          : 'text-rose-400'
                      }
                    >
                      {result.outcome}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredResults.length === 0 && (
            <p className="p-6 text-center text-sm text-slate-400">
              No benchmark data to display.
            </p>
          )}
        </div>
      </div>

      {error && (
        <div
          role="alert"
          className="rounded-lg border border-rose-500 bg-rose-500/10 p-4 text-sm text-rose-300"
        >
          {error}
        </div>
      )}
    </section>
  )
}