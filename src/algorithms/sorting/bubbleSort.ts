import type { Algorithm, StepEvent } from '../../types'

export const bubbleSort: Algorithm = {
  info: {
    id: 'bubbleSort',
    name: 'Bubble Sort',
    category: 'sorting',
    description:
      'Bubble Sort repeatedly compares adjacent elements and swaps them if they are in the wrong order.',
    useCase:
      'Useful for learning sorting basics, but not efficient for large datasets.',
    complexity: {
      best: 'O(n)',
      average: 'O(n²)',
      worst: 'O(n²)',
      space: 'O(1)',
    },
    pseudocode: [
      'for i from 0 to n - 1', // Index 0
      '  for j from 0 to n - i - 2', // Index 1
      '    compare arr[j] and arr[j + 1]', // Index 2
      '    if arr[j] > arr[j + 1]', // Index 3
      '      swap arr[j] and arr[j + 1]', // Index 4
      'mark array as sorted', // Index 5
    ],
  },

  run(input: number[]): StepEvent[] {
    const steps: StepEvent[] = []
    const arr = [...input]
    const n = arr.length

    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        // Corrected line to index 2 (comparison block)
        steps.push({
          type: 'compare',
          indices: [j, j + 1],
          pseudocodeLine: 2,
          description: `Comparing index ${j} (${arr[j]}) and index ${j + 1} (${arr[j + 1]})`,
        })

        if (arr[j] > arr[j + 1]) {
          ;[arr[j], arr[j + 1]] = [arr[j + 1], arr[j]]

          // Corrected line to index 4 (swap execution block)
          steps.push({
            type: 'swap',
            indices: [j, j + 1],
            pseudocodeLine: 4,
            description: `Swapping index ${j} and index ${j + 1}`,
          })
        }
      }

      // Visually finalize the element that just finished bubbling up to the end
      steps.push({
        type: 'finalize',
        indices: [n - i - 1],
        pseudocodeLine: 0,
        description: `Element at index ${n - i - 1} is locked in its sorted position`,
      })
    }

    // Catch-all finalization to highlight the whole array as finished
    steps.push({
      type: 'finalize',
      indices: arr.map((_, index) => index),
      pseudocodeLine: 5,
      description: 'Array is fully sorted',
    })

    return steps
  },
}
