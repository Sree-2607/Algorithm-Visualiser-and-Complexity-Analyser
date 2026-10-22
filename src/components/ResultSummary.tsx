import type { AlgorithmInfo } from '../types'

// Statistics required for each algorithm
interface AlgorithmResult {
  info: AlgorithmInfo
  comparisons: number
  swapsOrWrites: number
  totalSteps: number
}

// Props received from CompareMode
interface ResultsSummaryProps {
  left: AlgorithmResult
  right: AlgorithmResult
}

// Identify algorithms that use auxiliary arrays
const nonInPlaceAlgorithms = new Set<string>([
  'mergeSort',
])

// Display the correct operation unit
function getOperationLabel(algorithmId: string): string {
  if (algorithmId === 'mergeSort') {
    return 'Writes'
  }

  if (algorithmId === 'insertionSort') {
    return 'Shifts / Writes'
  }

  return 'Swaps / Writes'
}

// Determine whether the implementation sorts in-place
function isInPlace(algorithmId: string): boolean {
  return !nonInPlaceAlgorithms.has(algorithmId)
}

// Pure comparison function
function compareCounts(
  leftCount: number,
  rightCount: number
): 'left' | 'right' | 'tie' {
  if (leftCount < rightCount) return 'left'
  if (rightCount < leftCount) return 'right'

  return 'tie'
}

export default function ResultsSummary({
  left,
  right,
}: ResultsSummaryProps) {
  const comparisonWinner = compareCounts(
    left.comparisons,
    right.comparisons
  )

  const leftInPlace = isInPlace(left.info.id)
  const rightInPlace = isInPlace(right.info.id)

  const winnerName =
    comparisonWinner === 'left'
      ? left.info.name
      : comparisonWinner === 'right'
        ? right.info.name
        : null

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900 p-5 text-slate-100 shadow-xl">

      {/* Header */}
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-white">
            Results Summary
          </h2>

          <p className="mt-1 text-sm text-slate-400">
            Comparison of two completed sorting executions.
          </p>
        </div>

        <span className="rounded-full border border-emerald-800 bg-emerald-950/40 px-3 py-1 text-xs font-bold text-emerald-400">
          ✓ Both Completed
        </span>
      </div>

      {/* Algorithm name cards */}
      <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-2">

        <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
          <p className="text-xs font-bold uppercase text-slate-500">
            Algorithm A
          </p>

          <h3 className="mt-1 text-lg font-semibold">
            {left.info.name}
          </h3>

          <p className="mt-1 text-xs text-slate-400">
            {leftInPlace ? 'In-place sorting' : 'Not in-place'}
          </p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
          <p className="text-xs font-bold uppercase text-slate-500">
            Algorithm B
          </p>

          <h3 className="mt-1 text-lg font-semibold">
            {right.info.name}
          </h3>

          <p className="mt-1 text-xs text-slate-400">
            {rightInPlace ? 'In-place sorting' : 'Not in-place'}
          </p>
        </div>
      </div>

      {/* Comparison table */}
      <div className="overflow-x-auto rounded-xl border border-slate-800">

        <table className="w-full min-w-[540px] text-left text-sm">

          <thead className="bg-slate-950 text-xs uppercase text-slate-400">
            <tr>
              <th className="px-4 py-3">Metric</th>
              <th className="px-4 py-3">Algorithm A</th>
              <th className="px-4 py-3">Algorithm B</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-800">

            <tr>
              <td className="px-4 py-3 text-slate-400">
                Comparisons
              </td>

              <td className="px-4 py-3 font-mono font-bold text-blue-400">
                {left.comparisons}
              </td>

              <td className="px-4 py-3 font-mono font-bold text-blue-400">
                {right.comparisons}
              </td>
            </tr>

            <tr>
              <td className="px-4 py-3 text-slate-400">
                Data operations
              </td>

              <td className="px-4 py-3">
                <span className="font-mono font-semibold text-rose-400">
                  {left.swapsOrWrites}
                </span>

                <span className="ml-2 text-xs text-slate-500">
                  {getOperationLabel(left.info.id)}
                </span>
              </td>

              <td className="px-4 py-3">
                <span className="font-mono font-semibold text-rose-400">
                  {right.swapsOrWrites}
                </span>

                <span className="ml-2 text-xs text-slate-500">
                  {getOperationLabel(right.info.id)}
                </span>
              </td>
            </tr>

            <tr>
              <td className="px-4 py-3 text-slate-400">
                Visualization steps
              </td>

              <td className="px-4 py-3 font-mono">
                {left.totalSteps}
              </td>

              <td className="px-4 py-3 font-mono">
                {right.totalSteps}
              </td>
            </tr>

            <tr>
              <td className="px-4 py-3 text-slate-400">
                Best-case time
              </td>

              <td className="px-4 py-3">
                {left.info.complexity.best}
              </td>

              <td className="px-4 py-3">
                {right.info.complexity.best}
              </td>
            </tr>

            <tr>
              <td className="px-4 py-3 text-slate-400">
                Average-case time
              </td>

              <td className="px-4 py-3">
                {left.info.complexity.average}
              </td>

              <td className="px-4 py-3">
                {right.info.complexity.average}
              </td>
            </tr>

            <tr>
              <td className="px-4 py-3 text-slate-400">
                Worst-case time
              </td>

              <td className="px-4 py-3">
                {left.info.complexity.worst}
              </td>

              <td className="px-4 py-3">
                {right.info.complexity.worst}
              </td>
            </tr>

            <tr>
              <td className="px-4 py-3 text-slate-400">
                Auxiliary space
              </td>

              <td className="px-4 py-3">
                {left.info.complexity.space}
              </td>

              <td className="px-4 py-3">
                {right.info.complexity.space}
              </td>
            </tr>

            <tr>
              <td className="px-4 py-3 text-slate-400">
                In-place
              </td>

              <td className="px-4 py-3">
                {leftInPlace ? '✓ Yes' : '✗ No'}
              </td>

              <td className="px-4 py-3">
                {rightInPlace ? '✓ Yes' : '✗ No'}
              </td>
            </tr>

          </tbody>
        </table>
      </div>

      {/* Metric-specific winner badge */}
      <div className="mt-5 rounded-xl border border-emerald-900/50 bg-emerald-950/20 p-4">

        <p className="text-xs font-bold uppercase tracking-wider text-emerald-400">
          Comparison Count Result
        </p>

        {winnerName ? (
          <p className="mt-2 text-lg font-bold text-white">
            🏆 {winnerName} — fewer comparisons
          </p>
        ) : (
          <p className="mt-2 text-lg font-bold text-white">
            🤝 Tie — equal comparisons
          </p>
        )}

        <p className="mt-2 text-xs leading-relaxed text-slate-300">
          This result is based only on recorded comparison events
          for the current input. It does not establish which
          algorithm is faster in real execution time.
        </p>
      </div>

      {/* Methodology note */}
      <p className="mt-4 text-xs leading-relaxed text-slate-400">
        Operation counts reflect the events emitted by these
        implementations. Swaps, shifts, and overwrites represent
        different kinds of work and should not be compared as
        equivalent operations. Visualization step counts are
        not execution-time benchmarks.
      </p>

    </section>
  )
}