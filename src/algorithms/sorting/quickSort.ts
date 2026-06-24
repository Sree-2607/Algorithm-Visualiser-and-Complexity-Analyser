import type { Algorithm, PivotStrategy, StepEvent } from '../../types'

export const quickSort: Algorithm = {
  info: {
    id: 'quickSort',
    name: 'Quick Sort',
    category: 'sorting',
    description:
      'Quick Sort chooses a pivot, partitions the array around it, and recursively sorts the left and right sides.',
    useCase:
      'Useful for learning partitioning and pivot strategy. It is fast on average but can degrade with bad pivots.',
    complexity: {
      best: 'O(n log n)',
      average: 'O(n log n)',
      worst: 'O(n²)',
      space: 'O(log n)',
    },
    pseudocode: [
      'if low >= high, return', // Index 0
      'choose pivot using strategy', // Index 1
      'move pivot to end', // Index 2
      'partition array around pivot', // Index 3
      '  compare arr[j] with pivot', // Index 4
      '  if arr[j] <= pivot', // Index 5
      '    swap arr[i] and arr[j]', // Index 6
      'place pivot in correct position', // Index 7
      'quickSort(left side)', // Index 8
      'quickSort(right side)', // Index 9
      'mark array as sorted', // Index 10
    ],
  },

  run(input: number[], options?: { pivotStrategy?: PivotStrategy }): StepEvent[] {
    const steps: StepEvent[] = []
    const arr = [...input]
    const pivotStrategy = options?.pivotStrategy ?? 'last'

    function choosePivotIndex(
      low: number,
      high: number,
      strategy: PivotStrategy
    ): number {
      if (strategy === 'first') return low
      if (strategy === 'last') return high
      if (strategy === 'random') {
        return Math.floor(Math.random() * (high - low + 1)) + low
      }

      const mid = Math.floor((low + high) / 2)
      const candidates = [
        { index: low, value: arr[low] },
        { index: mid, value: arr[mid] },
        { index: high, value: arr[high] },
      ]
      candidates.sort((a, b) => a.value - b.value)
      return candidates[1].index
    }

    function quickSortRecursive(low: number, high: number): void {
      if (low >= high) {
        if (low === high) {
          steps.push({
            type: 'baseCase',
            indices: [low],
            pseudocodeLine: 0,
            description: `Base case reached at index ${low}`,
          })
        }
        return
      }

      const pivotIndex = choosePivotIndex(low, high, pivotStrategy)

      steps.push({
        type: 'pivot',
        indices: [pivotIndex],
        values: [arr[pivotIndex]],
        pseudocodeLine: 1,
        description: `Choosing pivot ${arr[pivotIndex]} at index ${pivotIndex} using ${pivotStrategy} strategy`,
      })

      if (pivotIndex !== high) {
        ;[arr[pivotIndex], arr[high]] = [arr[high], arr[pivotIndex]]

        steps.push({
          type: 'swap',
          indices: [pivotIndex, high],
          pseudocodeLine: 2,
          description: `Moving pivot to end by swapping index ${pivotIndex} and index ${high}`,
        })
      }

      const partitionIndex = partition(low, high)

      steps.push({
        type: 'partition',
        indices: [partitionIndex],
        values: [arr[partitionIndex]],
        pseudocodeLine: 7,
        description: `Pivot ${arr[partitionIndex]} placed at final locked index ${partitionIndex}`,
      })

      quickSortRecursive(low, partitionIndex - 1)
      quickSortRecursive(partitionIndex + 1, high)
    }

    function partition(low: number, high: number): number {
      const pivot = arr[high]
      let i = low - 1

      for (let j = low; j < high; j++) {
        steps.push({
          type: 'compare',
          indices: [j, high],
          values: [arr[j], pivot],
          pseudocodeLine: 4,
          description: `Comparing index ${j} (${arr[j]}) with pivot (${pivot})`,
        })

        if (arr[j] <= pivot) {
          i++

          if (i !== j) {
            ;[arr[i], arr[j]] = [arr[j], arr[i]]

            steps.push({
              type: 'swap',
              indices: [i, j],
              pseudocodeLine: 6,
              description: `Swapping index ${i} and index ${j}`,
            })
          }
        }
      }

      if (i + 1 !== high) {
        ;[arr[i + 1], arr[high]] = [arr[high], arr[i + 1]]

        steps.push({
          type: 'swap',
          indices: [i + 1, high],
          pseudocodeLine: 7,
          description: `Placing pivot by swapping index ${i + 1} and high index ${high}`,
        })
      }

      return i + 1
    }

    quickSortRecursive(0, arr.length - 1)

    steps.push({
      type: 'finalize',
      indices: arr.map((_, index) => index),
      pseudocodeLine: 10,
      description: 'Array is fully sorted',
    })

    return steps
  },
}
