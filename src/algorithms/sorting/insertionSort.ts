import type { Algorithm, StepEvent } from '../types'

export const insertionSort: Algorithm = {
  info: {
    id: 'insertionSort',
    name: 'Insertion Sort',
    category: 'sorting',
    description:
      'Insertion Sort builds the sorted array one element at a time by inserting each element into its correct position.',
    useCase:
      'Useful for small or nearly sorted datasets. It is also good for learning how shifting works.',
    complexity: {
      best: 'O(n)',
      average: 'O(n²)',
      worst: 'O(n²)',
      space: 'O(1)',
    },
    pseudocode: [
      'for i from 1 to n - 1', // Index 0
      '  key = arr[i]', // Index 1
      '  j = i - 1', // Index 2
      '  while j >= 0 and arr[j] > key', // Index 3
      '    compare arr[j] and key', // Index 4
      '    shift arr[j] right', // Index 5
      '    j = j - 1', // Index 6
      '  insert key at j + 1', // Index 7
      'mark array as sorted', // Index 8
    ],
  },

  run(input: number[]): StepEvent[] {
    const steps: StepEvent[] = []
    const arr = [...input]
    const n = arr.length

    for (let i = 1; i < n; i++) {
      const key = arr[i]
      let j = i - 1

      // Optional/Decorative: Let the UI know which key is picked up
      steps.push({
        type: 'compare', // Highlight the picked up element
        indices: [i],
        pseudocodeLine: 1,
        description: `Picked up key ${key} at index ${i}`,
      })

      while (j >= 0) {
        // FIXED: Highlight j and j + 1 (representing the active gap tracking the key position)
        steps.push({
          type: 'compare',
          indices: [j, j + 1],
          pseudocodeLine: 4,
          description: `Comparing index ${j} (${arr[j]}) with key (${key})`,
        })

        if (arr[j] > key) {
          arr[j + 1] = arr[j]

          steps.push({
            type: 'shift',
            indices: [j, j + 1],
            values: [arr[j]],
            pseudocodeLine: 5,
            description: `Shifting value ${arr[j]} from index ${j} to index ${j + 1}`,
          })

          j--
        } else {
          break
        }
      }

      arr[j + 1] = key

      steps.push({
        type: 'overwrite',
        indices: [j + 1],
        values: [key],
        pseudocodeLine: 7,
        description: `Inserting key ${key} at index ${j + 1}`,
      })
    }

    steps.push({
      type: 'finalize',
      indices: arr.map((_, index) => index),
      pseudocodeLine: 8,
      description: 'Array is fully sorted',
    })

    return steps
  },
}
