import { bubbleSort, selectionSort, insertionSort } from './algorithms'

function App() {
  console.log('Bubble Sort')
  console.log(bubbleSort.run([5, 3, 1, 4]))

  console.log('Selection Sort')
  console.log(selectionSort.run([5, 3, 1, 4]))

  console.log('Insertion Sort')
  console.log(insertionSort.run([5, 3, 1, 4]))

  return <h1>Algorithm Visualizer</h1>
}

export default App