import type { Algorithm, StepEvent } from '../types'

export const heapSort: Algorithm = {
  info: {
    id: 'heapSort',
    name: 'Heap Sort',
    category: 'sorting',
    description:
      'Heap Sort builds a max heap, repeatedly moves the largest element to the end, and restores the heap.',
    useCase:
      'Useful for learning heap data structures and guaranteed O(n log n) sorting.',
    complexity: {
      best: 'O(n log n)',
      average: 'O(n log n)',
      worst: 'O(n log n)',
      space: 'O(1)',
    },
    pseudocode: [
      'build max heap', // Index 0
      'for end from n - 1 down to 1', // Index 1
      '  swap arr[0] and arr[end]', // Index 2
      '  mark end as sorted', // Index 3
      '  heapify remaining heap', // Index 4
      'largest = root', // Index 5
      'left = 2 * root + 1', // Index 6
      'right = 2 * root + 2', // Index 7
      'compare left child with largest', // Index 8
      'compare right child with largest', // Index 9
      'if largest changed, swap and heapify again', // Index 10
      'mark array as sorted', // Index 11
    ],
  },

  run(input: number[]): StepEvent[] {
    const steps: StepEvent[] = []
    const arr = [...input]
    const n = arr.length

    function heapify(heapSize: number, root: number): void {
      let largest = root
      const left = 2 * root + 1
      const right = 2 * root + 2

      steps.push({
        type: 'heapify',
        indices: [root],
        pseudocodeLine: 4,
        description: `Heapifying subtree rooted at index ${root} (Heap Size: ${heapSize})`,
      })

      if (left < heapSize) {
        steps.push({
          type: 'compare',
          indices: [left, largest],
          pseudocodeLine: 8,
          description: `Comparing left child index ${left} (${arr[left]}) with current largest index ${largest} (${arr[largest]})`,
        })

        if (arr[left] > arr[largest]) {
          largest = left
        }
      }

      if (right < heapSize) {
        steps.push({
          type: 'compare',
          indices: [right, largest],
          pseudocodeLine: 9,
          description: `Comparing right child index ${right} (${arr[right]}) with current largest index ${largest} (${arr[largest]})`,
        })

        if (arr[right] > arr[largest]) {
          largest = right
        }
      }

      if (largest !== root) {
        ;[arr[root], arr[largest]] = [arr[largest], arr[root]]

        steps.push({
          type: 'swap',
          indices: [root, largest],
          pseudocodeLine: 10,
          description: `Swapping root index ${root} (${arr[largest]}) with larger child index ${largest} (${arr[root]})`,
        })

        heapify(heapSize, largest)
      }
    }

    // Phase 1: Build the Max Heap
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
      steps.push({
        type: 'heapify',
        indices: [i],
        pseudocodeLine: 0,
        description: `Building max heap: Analyzing parent index ${i}`,
      })

      heapify(n, i)
    }

    // Phase 2: Extract elements from heap one by one
    for (let end = n - 1; end > 0; end--) {
      ;[arr[0], arr[end]] = [arr[end], arr[0]]

      steps.push({
        type: 'swap',
        indices: [0, end],
        pseudocodeLine: 2,
        description: `Moving maximum value ${arr[end]} from root to final index ${end}`,
      })

      steps.push({
        type: 'finalize',
        indices: [end],
        pseudocodeLine: 3,
        description: `Element at index ${end} is locked in its sorted position`,
      })

      heapify(end, 0)
    }

    // Phase 3: Everything is sorted, lock down layout states
    steps.push({
      type: 'finalize',
      indices: arr.map((_, index) => index),
      pseudocodeLine: 11,
      description: 'Array is fully sorted',
    })

    return steps
  },
}