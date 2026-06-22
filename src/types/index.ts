export type AlgorithmType =
  | 'bubbleSort'
  | 'selectionSort'
  | 'insertionSort'
  | 'mergeSort'
  | 'quickSort'
  | 'heapSort'
  | 'bfs'
  | 'dfs'
  | 'dijkstra'
  | 'astar'

export type AlgorithmCategory = 'sorting' | 'graph'

export type StepEventType =
  | 'compare'
  | 'swap'
  | 'overwrite'
  | 'finalize'
  | 'visit'
  | 'enqueue'
  | 'shift'
  | 'divide'
  | 'merge'
  | 'baseCase'
  
export type BarState =
  | 'default'
  | 'comparing'
  | 'swapping'
  | 'sorted'
  | 'pivot'

export type Complexity = {
  best: string
  average: string
  worst: string
  space: string
}

export type StepEvent = {
  type: StepEventType
  indices: number[]
  values?: number[]
  pseudocodeLine: number
  description: string
}

export type ArrayBar = {
  value: number
  state: BarState
}

export type RunStats = {
  comparisons: number
  swapsOrWrites: number
}

export type AlgorithmInfo = {
  id: AlgorithmType
  name: string
  category: AlgorithmCategory
  description: string
  useCase: string
  complexity: Complexity
  pseudocode: string[]
}

export type Algorithm = {
  info: AlgorithmInfo
  run: (input: number[]) => StepEvent[]
}

