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
  | 'pivot'
  | 'partition'
  | 'heapify'
  
export type BarState =
  | 'default'
  | 'comparing'
  | 'swapping'
  | 'sorted'
  | 'pivot'

export type PivotStrategy =
  | 'first'
  | 'last'
  | 'random'
  | 'medianOfThree'

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
  run: (
    input: number[],
    options?: {
      pivotStrategy?: PivotStrategy
    }
  ) => StepEvent[]
}

export type UseStepPlayerResult = {
  bars: ArrayBar[]
  currentStep: StepEvent | null
  currentStepIndex: number
  totalSteps: number
  isPlaying: boolean
  comparisons: number
  swapsOrWrites: number
  play: () => void
  pause: () => void
  reset: () => void
  stepForward: () => void
  stepBackward: () => void
}

export type SortVisualizerProps = {
  bars: ArrayBar[]
}

export type ControlsProps = {
  isPlaying: boolean
  speed: number
  onPlay: () => void
  onPause: () => void
  onReset: () => void
  onStepForward: () => void
  onStepBackward: () => void
  onSpeedChange: (speed: number) => void
}

export type LegendItem = {
  label: string
  className: string
}