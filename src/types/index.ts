export type AlgorithmType =
  | 'bubbleSort'
  | 'selectionSort'
  | 'mergeSort'
  | 'quickSort'
  | 'heapSort'
  | 'bfs'
  | 'dfs'

export type BarState =
  | 'default'
  | 'comparing'
  | 'swapping'
  | 'sorted'

export type Complexity = {
  best: string
  average: string
  worst: string
  space: string
}

export type ArrayBar = {
  value: number
  state: BarState
}

export type AnimationFrame = {
  bars: ArrayBar[]
  comparisons: number
  swaps: number
  currentStep: string
}

export type AlgorithmInfo = {
  id: AlgorithmType
  name: string
  description: string
  useCase: string
  complexity: Complexity
}

export type SortingAlgorithm = {
  info: AlgorithmInfo
  generateFrames: (input: number[]) => AnimationFrame[]
}