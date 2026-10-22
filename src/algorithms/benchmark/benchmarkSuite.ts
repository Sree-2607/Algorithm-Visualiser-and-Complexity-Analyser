import type {
  Algorithm,
  AlgorithmType,
  GraphAlgorithm,
} from '../../types'

import {
  bubbleSort,
  selectionSort,
  insertionSort,
  mergeSort,
  quickSort,
  heapSort,
} from '../sorting'

import { graphAlgorithms } from '../graph'

import {
  BENCHMARK_INPUT_SIZES,
  generateBenchmarkArray,
  runSortingBenchmarks as executeSortingBenchmarks,
} from './sortingBenchmark'

import {
  runGraphBenchmarks,
  type GraphBenchmarkResult,
} from './graphBenchmark'

export type BenchmarkCategory = 'sorting' | 'graph'

export interface BenchmarkPoint {
  algorithmId: AlgorithmType
  algorithmName: string
  category: BenchmarkCategory
  inputSize: number
  edgeCount?: number
  comparisons: number
  operations: number
  steps: number
  outcome: string
}

export const SORTING_BENCHMARK_SIZES =
  BENCHMARK_INPUT_SIZES

export { generateBenchmarkArray }

export const sortingBenchmarkAlgorithms: Algorithm[] = [
  bubbleSort,
  selectionSort,
  insertionSort,
  mergeSort,
  quickSort,
  heapSort,
]

const graphBenchmarkAlgorithms: GraphAlgorithm[] = [
  graphAlgorithms.bfs,
  graphAlgorithms.dfs,
  graphAlgorithms.dijkstra,
  graphAlgorithms.astar,
  graphAlgorithms['bellman-ford'],
].filter(
  (algorithm): algorithm is GraphAlgorithm =>
    algorithm !== undefined
)

// Convert sorting benchmark results into the
// shared chart/table format.
export function runSortingBenchmarks(
  sizes: number[] = SORTING_BENCHMARK_SIZES
): BenchmarkPoint[] {
  const sortingResults = executeSortingBenchmarks(
    sortingBenchmarkAlgorithms,
    sizes
  )

  return sortingResults.map((result) => ({
    algorithmId: result.algorithmId,
    algorithmName: result.algorithmName,
    category: 'sorting',
    inputSize: result.inputSize,
    comparisons: result.comparisons,
    operations: result.totalOperations,
    steps: result.visualizationSteps,
    outcome: result.outcome,
  }))
}

// Convert graph benchmark results into the
// same shared chart/table format.
export function runGraphBenchmarkSuite(): BenchmarkPoint[] {
  const graphResults: GraphBenchmarkResult[] =
    runGraphBenchmarks(graphBenchmarkAlgorithms)

  return graphResults.map((result) => ({
    algorithmId: result.algorithmId,
    algorithmName: result.algorithmName,
    category: 'graph',
    inputSize: result.vertexCount,
    edgeCount: result.edgeCount,
    comparisons: result.comparisons,
    operations: result.totalOperations,
    steps: result.visualizationSteps,
    outcome: result.outcome,
  }))
}

// Public API consumed by ComplexityScreen.tsx.
export function runAllBenchmarks(): BenchmarkPoint[] {
  return [
    ...runSortingBenchmarks(),
    ...runGraphBenchmarkSuite(),
  ]
}