import type {
  Algorithm,
  AlgorithmType,
  StepEvent,
} from '../../types'

export const BENCHMARK_INPUT_SIZES = [10, 25, 50, 100]

export interface SortingBenchmarkResult {
  algorithmId: AlgorithmType
  algorithmName: string
  inputSize: number
  comparisons: number
  swaps: number
  shifts: number
  overwrites: number
  dataOperations: number
  totalOperations: number
  visualizationSteps: number
  outcome: 'completed' | 'incorrect'
}

// All algorithms receive the same deterministic
// array for a given input size.
export function generateBenchmarkArray(
  size: number
): number[] {
  if (
    !Number.isInteger(size) ||
    size < 2 ||
    size > 100
  ) {
    throw new Error(
      'Benchmark size must be an integer from 2 to 100.'
    )
  }

  return Array.from(
    { length: size },
    (_, index) => ((index * 37 + 19) % 101) + 1
  ).reverse()
}

// Not every "compare" event represents a real
// pairwise element comparison.
function isActualComparison(
  algorithmId: AlgorithmType,
  step: StepEvent
): boolean {
  if (step.type !== 'compare') return false

  if (algorithmId === 'selectionSort') {
    return (
      step.pseudocodeLine === 3 &&
      (step.indices?.length ?? 0) === 2
    )
  }

  if (algorithmId === 'insertionSort') {
    return step.pseudocodeLine === 4
  }

  // Other engines retain their existing event counts.
  // Their comparison instrumentation is subject
  // to the final engine-level verification.
  return true
}

function countOperations(
  algorithmId: AlgorithmType,
  steps: StepEvent[]
) {
  let comparisons = 0
  let swaps = 0
  let shifts = 0
  let overwrites = 0

  for (const step of steps) {
    if (isActualComparison(algorithmId, step)) {
      comparisons++
    }

    switch (step.type) {
      case 'swap':
        swaps++
        break

      case 'shift':
        shifts++
        break

      case 'overwrite':
        overwrites++
        break
    }
  }

  const dataOperations =
    swaps + shifts + overwrites

  return {
    comparisons,
    swaps,
    shifts,
    overwrites,
    dataOperations,
    totalOperations: comparisons + dataOperations,
  }
}

// Replay mutations to verify that the emitted
// event sequence actually produces a sorted array.
function replaySortingSteps(
  input: number[],
  steps: StepEvent[]
): number[] {
  const array = [...input]

  for (const step of steps) {
    switch (step.type) {
      case 'swap': {
        const [a, b] = step.indices ?? []

        if (
          a !== undefined &&
          b !== undefined &&
          a >= 0 &&
          b >= 0 &&
          a < array.length &&
          b < array.length
        ) {
          ;[array[a], array[b]] = [
            array[b],
            array[a],
          ]
        }
        break
      }

      case 'shift': {
        const [from, to] = step.indices ?? []

        if (
          from !== undefined &&
          to !== undefined &&
          from >= 0 &&
          to >= 0 &&
          from < array.length &&
          to < array.length
        ) {
          array[to] = array[from]
        }
        break
      }

      case 'overwrite': {
        const index = step.indices?.[0]
        const value = step.values?.[0]

        if (
          index !== undefined &&
          value !== undefined &&
          index >= 0 &&
          index < array.length
        ) {
          array[index] = value
        }
        break
      }
    }
  }

  return array
}

export function benchmarkSortingAlgorithm(
  algorithm: Algorithm,
  inputSize: number
): SortingBenchmarkResult {
  const input = generateBenchmarkArray(inputSize)

  const steps = algorithm.run([...input], {
    pivotStrategy: 'last',
  })

  const metrics = countOperations(
    algorithm.info.id,
    steps
  )

  const actual = replaySortingSteps(input, steps)
  const expected = [...input].sort((a, b) => a - b)

  const isCorrect =
    actual.length === expected.length &&
    actual.every(
      (value, index) => value === expected[index]
    )

  return {
    algorithmId: algorithm.info.id,
    algorithmName: algorithm.info.name,
    inputSize,
    ...metrics,
    visualizationSteps: steps.length,
    outcome: isCorrect ? 'completed' : 'incorrect',
  }
}

export function runSortingBenchmarks(
  algorithms: Algorithm[],
  inputSizes: number[] = BENCHMARK_INPUT_SIZES
): SortingBenchmarkResult[] {
  const results: SortingBenchmarkResult[] = []

  for (const size of inputSizes) {
    for (const algorithm of algorithms) {
      results.push(
        benchmarkSortingAlgorithm(algorithm, size)
      )
    }
  }

  return results
}