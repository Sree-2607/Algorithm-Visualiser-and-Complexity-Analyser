import type { Algorithm, StepEvent } from '../../types'

export const selectionSort: Algorithm = {
  info: {
    id: 'selectionSort',
    name: 'Selection Sort',
    category: 'sorting',
    description:
      'Selection Sort repeatedly finds the minimum element from the unsorted portion and places it at the beginning.',
    useCase:
      'Useful for learning how minimum selection works, but not efficient for large datasets.',
    complexity: {
      best: 'O(n²)',
      average: 'O(n²)',
      worst: 'O(n²)',
      space: 'O(1)',
    },
    pseudocode: [
      'for i from 0 to n - 2', // Index 0
      '  minIndex = i', // Index 1
      '  for j from i + 1 to n - 1', // Index 2
      '    compare arr[j] and arr[minIndex]', // Index 3
      '    if arr[j] < arr[minIndex]', // Index 4
      '      minIndex = j', // Index 5
      '  swap arr[i] and arr[minIndex]', // Index 6
      '  mark index i as sorted', // Index 7
    ],
  },

  run(input: number[]): StepEvent[] {
    const steps: StepEvent[] = []
    const arr = [...input]
    const n = arr.length

    for (let i = 0; i < n - 1; i++) {
      let minIndex = i

      for (let j = i + 1; j < n; j++) {
        steps.push({
          type: 'compare',
          indices: [j, minIndex],
          pseudocodeLine: 3,
          description: `Comparing index ${j} (${arr[j]}) and current minimum index ${minIndex} (${arr[minIndex]})`,
        })

        if (arr[j] < arr[minIndex]) {
          minIndex = j
          
          // VISUAL TIP: Tell the UI that our pointer for the target minimum just shifted
          steps.push({
            type: 'compare', // Re-using compare state or tracking it to paint the min pointer
            indices: [minIndex],
            pseudocodeLine: 5,
            description: `New minimum found at index ${minIndex} (${arr[minIndex]})`,
          })
        }
      }

      if (minIndex !== i) {
        ;[arr[i], arr[minIndex]] = [arr[minIndex], arr[i]]

        steps.push({
          type: 'swap',
          indices: [i, minIndex],
          pseudocodeLine: 6,
          description: `Swapping index ${i} with minimum index ${minIndex}`,
        })
      } else {
        // RHYTHM FIX: Push a descriptive step when no layout mutation is required
        steps.push({
          type: 'compare',
          indices: [i],
          pseudocodeLine: 6,
          description: `Index ${i} is already the minimum. No swap needed.`,
        })
      }

      steps.push({
        type: 'finalize',
        indices: [i],
        pseudocodeLine: 7,
        description: `Element at index ${i} is locked in its sorted position`,
      })
    }

    // Last element is automatically sorted
    steps.push({
      type: 'finalize',
      indices: arr.map((_, index) => index),
      pseudocodeLine: 7,
      description: 'Array is fully sorted',
    })

    return steps
  },
}
