import type { Algorithm, StepEvent } from '../../types'

export const mergeSort: Algorithm = {
  info: {
    id: 'mergeSort',
    name: 'Merge Sort',
    category: 'sorting',
    description:
      'Merge Sort divides the array into smaller parts, sorts them, and merges them back together.',
    useCase:
      'Useful for learning divide and conquer. It performs well on large datasets.',
    complexity: {
      best: 'O(n log n)',
      average: 'O(n log n)',
      worst: 'O(n log n)',
      space: 'O(n)',
    },
    pseudocode: [
      'if left >= right, return', // Index 0
      'mid = floor((left + right) / 2)', // Index 1
      'mergeSort(left half)', // Index 2
      'mergeSort(right half)', // Index 3
      'merge both halves', // Index 4
      '  compare left and right values', // Index 5
      '  overwrite array with smaller value', // Index 6
      '  copy remaining values', // Index 7
      'mark array as sorted', // Index 8
    ],
  },

  run(input: number[]): StepEvent[] {
    const steps: StepEvent[] = []
    const arr = [...input]

    function getRangeIndices(left: number, right: number): number[] {
      return Array.from({ length: right - left + 1 }, (_, index) => left + index)
    }

    function sort(left: number, right: number): void {
      if (left >= right) {
        // VISUAL FIX: Emitting the base case allows your UI to highlight single elements
        steps.push({
          type: 'baseCase',
          indices: [left],
          pseudocodeLine: 0,
          description: `Base case reached for index ${left} (sub-array size 1)`,
        })
        return
      }

      const mid = Math.floor((left + right) / 2)

      steps.push({
        type: 'divide',
        indices: getRangeIndices(left, right),
        pseudocodeLine: 1,
        description: `Dividing range [${left} to ${right}] at midpoint ${mid}`,
      })

      sort(left, mid)
      sort(mid + 1, right)

      merge(left, mid, right)
    }

    function merge(left: number, mid: number, right: number): void {
      const leftHalf = arr.slice(left, mid + 1)
      const rightHalf = arr.slice(mid + 1, right + 1)

      let i = 0
      let j = 0
      let k = left

      steps.push({
        type: 'merge',
        indices: getRangeIndices(left, right),
        pseudocodeLine: 4,
        description: `Merging ranges [${left} to ${mid}] and [${mid + 1} to ${right}]`,
      })

      while (i < leftHalf.length && j < rightHalf.length) {
        steps.push({
          type: 'compare',
          indices: [left + i, mid + 1 + j],
          pseudocodeLine: 5,
          description: `Comparing ${leftHalf[i]} and ${rightHalf[j]}`,
        })

        if (leftHalf[i] <= rightHalf[j]) {
          arr[k] = leftHalf[i]

          steps.push({
            type: 'overwrite',
            indices: [k],
            values: [leftHalf[i]],
            pseudocodeLine: 6,
            description: `Writing ${leftHalf[i]} from left range to index ${k}`,
          })

          i++
        } else {
          arr[k] = rightHalf[j]

          steps.push({
            type: 'overwrite',
            indices: [k],
            values: [rightHalf[j]],
            pseudocodeLine: 6,
            description: `Writing ${rightHalf[j]} from right range to index ${k}`,
          })

          j++
        }

        k++
      }

      while (i < leftHalf.length) {
        arr[k] = leftHalf[i]

        steps.push({
          type: 'overwrite',
          indices: [k],
          values: [leftHalf[i]],
          pseudocodeLine: 7,
          description: `Copying remaining value ${leftHalf[i]} from left range to index ${k}`,
        })

        i++
        k++
      }

      while (j < rightHalf.length) {
        arr[k] = rightHalf[j]

        steps.push({
          type: 'overwrite',
          indices: [k],
          values: [rightHalf[j]],
          pseudocodeLine: 7,
          description: `Copying remaining value ${rightHalf[j]} from right range to index ${k}`,
        })

        j++
        k++
      }
    }

    sort(0, arr.length - 1)

    steps.push({
      type: 'finalize',
      indices: arr.map((_, index) => index),
      pseudocodeLine: 8,
      description: 'Array is fully sorted',
    })

    return steps
  },
}